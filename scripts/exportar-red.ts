/**
 * Exporta la red y los costos ya calculados (misma lógica que la presentación)
 * a informe/red-kiwano.json, para que scripts/informe_xlsx.py arme el Excel.
 * Uso: node --experimental-strip-types scripts/exportar-red.ts
 */
import { writeFileSync } from 'node:fs';
import { nodos, matriz, planDeVisitas, supuestos, aHora, promptGrafico, pMedianas, totalDesdeSede } from '../src/data/red.ts';
import * as c from '../src/data/costos.ts';
import * as t from '../src/data/transporte.ts';

const plan = planDeVisitas().map((j) => ({
  dia: j.dia,
  km: j.km,
  regreso: aHora(j.regreso),
  paradas: j.paradas.map((p) => ({
    id: p.nodo.id,
    nombre: p.nodo.nombre,
    ventana: `${p.nodo.abre}-${p.nodo.cierra}`,
    llegada: aHora(p.llegada),
    inicio: aHora(p.inicio),
    km: p.km,
  })),
}));

const out = {
  supuestos,
  promptGrafico,
  nodos,
  matriz,
  plan,
  pmedianas: {
    totalDesdeSede,
    soluciones: [1, 2].map((p) => {
      const r = pMedianas(p);
      return {
        p,
        total: r.total,
        sitios: r.sitios.map((s) => `${s.id} ${s.corto} (${s.localidad})`),
        asignacion: r.asignacion.map((a) => ({ cliente: a.cliente.corto, sitio: a.sitio.corto, km: a.km })),
      };
    }),
  },
  transporte: { origenes: t.origenes, destinos: t.destinos, oferta: t.oferta, demanda: t.demanda, costo: t.costo, metodos: t.metodos },
  costos: {
    ...c.costos,
    fijosCalculados: c.fijos,
    totalFijos: c.totalFijos,
    kmMes: c.kmMes,
    transporteMes: c.transporteMes,
    totalCampana: c.totalCampana,
    cvAgente: c.cvAgente,
    margenAgente: c.margenAgente,
    equilibrio: c.equilibrio,
  },
};
writeFileSync(new URL('../informe/red-kiwano.json', import.meta.url), JSON.stringify(out, null, 2));
console.log(`OK: ${nodos.length} nodos, ${plan.length} jornadas, equilibrio ${c.equilibrio} clientes`);
