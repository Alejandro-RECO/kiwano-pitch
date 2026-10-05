/**
 * Red comercial de Kiwano: 20 nodos reales en Bogotá más la sede (nodo 0).
 * Los datos crudos viven en nodos.json; aquí se derivan las distancias, la ruta
 * de visitas con ventanas de tiempo y la proyección al mapa. Todo se calcula
 * en build, así la presentación y el informe salen de la misma fuente.
 */
import data from './nodos.json' with { type: 'json' };
import mapa from './mapa.json' with { type: 'json' };

export type TipoNodo = 'sede' | 'cliente' | 'proveedor' | 'competencia';

export interface Nodo {
  id: string;
  nombre: string;
  /** Nombre corto para el mapa. */
  corto: string;
  tipo: TipoNodo;
  sector: string;
  direccion: string;
  localidad: string;
  lat: number;
  lon: number;
  /** Ventana de atención en formato 24 h, "08:00". */
  abre: string;
  cierra: string;
  horarioEstimado: boolean;
  fuente: string;
  relevancia: string;
}

export const supuestos = {
  /** Las calles de Bogotá no son líneas rectas: distancia vial ≈ 1,35 × línea recta. */
  factorCircuidad: 1.35,
  /** Velocidad promedio de un desplazamiento urbano en Bogotá (km/h). */
  velocidadKmH: 22,
  /** Duración de una visita comercial (min). */
  visitaMin: 45,
  /** Tope realista de visitas por día para un solo comercial. */
  maxVisitasDia: 5,
  /** Jornada del comercial de campo. */
  salida: '08:00',
  finJornada: '17:30',
};

export const nodos = data as Nodo[];

/** Prompt con el que se pidió a Claude el gráfico de la red (se cita en la slide y en el informe). */
export const promptGrafico =
  'Con la base de datos de 20 nodos (tipo y coordenadas), ubica cada empresa en el mapa de Bogotá con un color por tipo, calcula la distancia entre todos los nodos y arma la ruta de visitas respetando las ventanas de tiempo.';
export const sede = nodos.find((n) => n.tipo === 'sede')!;

const rad = (g: number) => (g * Math.PI) / 180;

/** Distancia vial estimada en km: haversine × factor de circuidad. */
export function distanciaKm(a: Nodo, b: Nodo): number {
  const R = 6371;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h)) * supuestos.factorCircuidad;
}

export const matriz: number[][] = nodos.map((a) => nodos.map((b) => distanciaKm(a, b)));

export const aMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
export const aHora = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(Math.round(min % 60)).padStart(2, '0')}`;

const viajeMin = (km: number) => (km / supuestos.velocidadKmH) * 60;

export interface Parada {
  nodo: Nodo;
  llegada: number;
  inicio: number;
  km: number;
}

export interface Jornada {
  dia: number;
  paradas: Parada[];
  km: number;
  regreso: number;
}

/**
 * Plan de visitas a clientes con ventanas de tiempo (VRPTW, heurística del
 * vecino más cercano factible): cada día sale de la sede, elige el cliente
 * alcanzable más cercano que aún esté dentro de su horario, y vuelve antes del
 * fin de jornada. Si llega antes de que abra, espera.
 */
export function planDeVisitas(objetivo: TipoNodo[] = ['cliente']): Jornada[] {
  const idx = (n: Nodo) => nodos.indexOf(n);
  const pendientes = new Set(nodos.filter((n) => objetivo.includes(n.tipo)));
  const jornadas: Jornada[] = [];
  const s = idx(sede);

  while (pendientes.size && jornadas.length < 10) {
    let pos = s;
    let t = aMin(supuestos.salida);
    const paradas: Parada[] = [];
    let km = 0;

    while (paradas.length < supuestos.maxVisitasDia) {
      let mejor: { n: Nodo; llegada: number; inicio: number; d: number } | null = null;
      for (const n of pendientes) {
        const d = matriz[pos][idx(n)];
        const llegada = t + viajeMin(d);
        const inicio = Math.max(llegada, aMin(n.abre));
        const fin = inicio + supuestos.visitaMin;
        const regreso = fin + viajeMin(matriz[idx(n)][s]);
        if (fin > aMin(n.cierra) || regreso > aMin(supuestos.finJornada)) continue;
        // Prioriza cercanía, penalizando la espera para no perder la mañana.
        const costo = d + (inicio - llegada) / 10;
        if (!mejor || costo < mejor.d + (mejor.inicio - mejor.llegada) / 10) mejor = { n, llegada, inicio, d };
      }
      if (!mejor) break;
      paradas.push({ nodo: mejor.n, llegada: mejor.llegada, inicio: mejor.inicio, km: mejor.d });
      km += mejor.d;
      t = mejor.inicio + supuestos.visitaMin;
      pos = idx(mejor.n);
      pendientes.delete(mejor.n);
    }

    if (!paradas.length) break;
    const vuelta = matriz[pos][s];
    jornadas.push({ dia: jornadas.length + 1, paradas, km: km + vuelta, regreso: t + viajeMin(vuelta) });
  }
  return jornadas;
}

export { mapa };

/**
 * Proyección Web Mercator sobre el mapa base de Bogotá (scripts/mapa_base.py).
 * Devuelve el tamaño del lienzo para el ancho pedido y la función que ubica cada nodo.
 */
export function proyectarMapa(ancho: number) {
  const k = ancho / mapa.ancho;
  const n = 2 ** mapa.zoom * mapa.tile;
  return {
    ancho,
    alto: mapa.alto * k,
    p: (nodo: Nodo) => {
      const s = Math.sin(rad(nodo.lat));
      const x = ((nodo.lon + 180) / 360) * n;
      const y = (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n;
      return { x: (x - mapa.x0) * k, y: (y - mapa.y0) * k };
    },
  };
}

/** Proyección equirrectangular de lat/lon a un lienzo SVG, con margen. */
export function proyectar(ancho: number, alto: number, margen = 40) {
  const lats = nodos.map((n) => n.lat);
  const lons = nodos.map((n) => n.lon);
  const [minLat, maxLat, minLon, maxLon] = [Math.min(...lats), Math.max(...lats), Math.min(...lons), Math.max(...lons)];
  const kx = Math.cos(rad((minLat + maxLat) / 2));
  const w = (maxLon - minLon) * kx;
  const h = maxLat - minLat;
  const escala = Math.min((ancho - 2 * margen) / w, (alto - 2 * margen) / h);
  const offX = (ancho - w * escala) / 2;
  const offY = (alto - h * escala) / 2;
  return (n: Nodo) => ({
    x: offX + (n.lon - minLon) * kx * escala,
    y: offY + (maxLat - n.lat) * escala,
  });
}

export const conteo = {
  cliente: nodos.filter((n) => n.tipo === 'cliente').length,
  proveedor: nodos.filter((n) => n.tipo === 'proveedor').length,
  competencia: nodos.filter((n) => n.tipo === 'competencia').length,
};

/** Vecino más cercano de un nodo dentro de un tipo. */
export function masCercano(n: Nodo, tipo: TipoNodo) {
  const i = nodos.indexOf(n);
  return nodos
    .map((m, j) => ({ m, d: matriz[i][j] }))
    .filter(({ m }) => m.tipo === tipo && m !== n)
    .sort((a, b) => a.d - b.d)[0];
}

/**
 * P-medianas: elige p sitios entre todos los nodos para minimizar la suma de
 * distancias de cada cliente a su sitio más cercano. Con 21 candidatos y p ≤ 2
 * se resuelve por enumeración completa, así que el resultado es el óptimo exacto.
 */
export function pMedianas(p: number) {
  const clientes = nodos.filter((n) => n.tipo === 'cliente');
  const asignar = (sel: Nodo[]) =>
    clientes.map((c) => {
      const d = sel.map((s) => distanciaKm(s, c));
      const k = d.indexOf(Math.min(...d));
      return { cliente: c, sitio: sel[k], km: d[k] };
    });
  const total = (sel: Nodo[]) => asignar(sel).reduce((t, a) => t + a.km, 0);

  let mejor: Nodo[] = [];
  let valor = Infinity;
  const recorrer = (desde: number, sel: Nodo[]) => {
    if (sel.length === p) {
      const v = total(sel);
      if (v < valor) [valor, mejor] = [v, sel];
      return;
    }
    for (let k = desde; k < nodos.length; k++) recorrer(k + 1, [...sel, nodos[k]]);
  };
  recorrer(0, []);
  return { sitios: mejor, total: valor, asignacion: asignar(mejor) };
}

/** Suma de distancias si todo se atiende desde la sede actual (p = 1 fijo en Chapinero). */
export const totalDesdeSede = nodos
  .filter((n) => n.tipo === 'cliente')
  .reduce((t, c) => t + distanciaKm(sede, c), 0);
