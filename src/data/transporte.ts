/**
 * Modelo de transporte (método visto en clase) aplicado al proceso de Kiwano:
 * cada mes se reparten las transacciones de los clientes entre 3 proveedores de
 * IA y nube, cada uno con capacidad contratada y un costo distinto según el
 * proceso del cliente. Se resuelve con Vogel y se compara con los otros métodos.
 */
export const origenes = ['Claude Haiku', 'Claude Sonnet', 'Azure (XMS)'];
export const destinos = ['AMIL Cargo', 'El Mayorista', 'TMEX', 'Blu Logistics'];
/** Qué hace el agente en cada cliente (define cuántos tokens consume cada transacción). */
export const procesos = ['Asignación de viajes', 'Toma de pedidos', 'Atención por WhatsApp', 'Documentos de aduana'];
/** Capacidad contratada con cada proveedor, en miles de transacciones al mes. */
export const oferta = [10, 6, 4];
/** Transacciones que procesa el agente de cada cliente, en miles al mes. */
export const demanda = [6, 4, 8, 2];
/**
 * Costo por cada 1.000 transacciones, en miles de pesos. Base: precio de la API
 * (Haiku ≈ 18 mil por 1.000 conversaciones, Sonnet ≈ el doble). Los documentos
 * consumen más tokens y, en el modelo más barato, exigen revisión humana.
 */
export const costo = [
  [18, 20, 15, 60],
  [36, 38, 34, 45],
  [22, 19, 25, 55],
];

export type Asignacion = number[][];

const vacia = (): Asignacion => origenes.map(() => destinos.map(() => 0));
export const costoTotal = (x: Asignacion) =>
  x.reduce((t, fila, i) => t + fila.reduce((s, q, j) => s + q * costo[i][j], 0), 0);

/** Esquina noroeste: llena desde la celda superior izquierda, sin mirar costos. */
export function esquinaNoroeste(): Asignacion {
  const x = vacia();
  const o = [...oferta];
  const d = [...demanda];
  let i = 0;
  let j = 0;
  while (i < o.length && j < d.length) {
    const q = Math.min(o[i], d[j]);
    x[i][j] = q;
    o[i] -= q;
    d[j] -= q;
    if (o[i] === 0) i++;
    else j++;
  }
  return x;
}

/** Costo mínimo: asigna primero a la celda más barata disponible. */
export function costoMinimo(): Asignacion {
  const x = vacia();
  const o = [...oferta];
  const d = [...demanda];
  const celdas = costo
    .flatMap((fila, i) => fila.map((c, j) => ({ i, j, c })))
    .sort((a, b) => a.c - b.c || a.i - b.i || a.j - b.j);
  for (const { i, j } of celdas) {
    const q = Math.min(o[i], d[j]);
    if (q <= 0) continue;
    x[i][j] = q;
    o[i] -= q;
    d[j] -= q;
  }
  return x;
}

/**
 * Vogel: en cada paso calcula la penalización (diferencia entre los dos costos
 * más bajos) de cada fila y columna activa, y asigna en la celda más barata de
 * la línea con mayor penalización.
 */
export function vogel(): Asignacion {
  const x = vacia();
  const o = [...oferta];
  const d = [...demanda];
  const filas = new Set(origenes.map((_, i) => i));
  const cols = new Set(destinos.map((_, j) => j));
  const pen = (vals: number[]) => {
    const s = [...vals].sort((a, b) => a - b);
    return s.length > 1 ? s[1] - s[0] : s[0];
  };

  while (filas.size && cols.size) {
    let mejor = { p: -1, i: -1, j: -1 };
    for (const i of filas) {
      const p = pen([...cols].map((j) => costo[i][j]));
      const j = [...cols].reduce((a, b) => (costo[i][b] < costo[i][a] ? b : a));
      if (p > mejor.p) mejor = { p, i, j };
    }
    for (const j of cols) {
      const p = pen([...filas].map((i) => costo[i][j]));
      const i = [...filas].reduce((a, b) => (costo[b][j] < costo[a][j] ? b : a));
      if (p > mejor.p) mejor = { p, i, j };
    }
    const { i, j } = mejor;
    const q = Math.min(o[i], d[j]);
    x[i][j] = q;
    o[i] -= q;
    d[j] -= q;
    if (o[i] === 0) filas.delete(i);
    if (d[j] === 0) cols.delete(j);
  }
  return x;
}

export const metodos = [
  { nombre: 'Esquina noroeste', x: esquinaNoroeste() },
  { nombre: 'Costo mínimo', x: costoMinimo() },
  { nombre: 'Vogel', x: vogel() },
].map((m) => ({ ...m, total: costoTotal(m.x) }));

/** Penalizaciones iniciales de Vogel (diferencia entre los dos costos más bajos), como en la tabla de clase. */
const dif = (vals: number[]) => {
  const [a, b] = [...vals].sort((x, y) => x - y);
  return b - a;
};
export const penalFila = costo.map((fila) => dif(fila));
export const penalCol = destinos.map((_, j) => dif(costo.map((fila) => fila[j])));
