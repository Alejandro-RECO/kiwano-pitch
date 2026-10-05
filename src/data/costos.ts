/**
 * Estructura de costos y precios de Kiwano (COP, mensual). Los valores y sus
 * fuentes viven en costos.json; aquí se derivan totales, margen y equilibrio.
 */
import data from './costos.json' with { type: 'json' };
import { planDeVisitas } from './red.ts';

export const costos = data;

export const cop = (n: number) => `$${Math.round(n).toLocaleString('es-CO')}`;
/** Millones con un decimal: 21,3 M. */
export const millones = (n: number) => `$${(n / 1e6).toLocaleString('es-CO', { maximumFractionDigits: 1 })} M`;

const carga = (f: { valor: number; prestacional: boolean }) =>
  f.prestacional ? f.valor * (1 + data.cargaPrestacional) : f.valor;

/** Fijos con la carga prestacional sumada a los sueldos. */
export const fijos = data.fijos.map((f) => ({ ...f, total: carga(f) }));
export const totalFijos = fijos.reduce((a, f) => a + f.total, 0);

export const fijosPorGrupo = Object.entries(
  fijos.reduce<Record<string, number>>((acc, f) => ((acc[f.grupo] = (acc[f.grupo] ?? 0) + f.total), acc), {}),
)
  .map(([grupo, total]) => ({ grupo, total }))
  .sort((a, b) => b.total - a.total);

/** Kilómetros al mes de la ruta comercial (la ruta de la slide, repetida cada semana). */
export const kmMes = planDeVisitas().reduce((a, j) => a + j.km, 0) * data.transporte.rutasPorMes;
export const transporteMes = kmMes * data.transporte.copPorKm;

export const totalCampana = data.variablesCampana.reduce((a, v) => a + v.valor, 0) + transporteMes;

/** Costo variable de atender un cliente del plan Agente. */
export function variablePorCliente(precio: number) {
  return data.variablesCliente.reduce((a, v) => a + (v.tipo === 'pct' ? v.valor * precio : v.valor), 0);
}

const planAgente = data.precios.find((p) => p.plan === 'Agente')!;
export const precioAgente = planAgente.precio;
export const cvAgente = variablePorCliente(precioAgente);
export const margenAgente = precioAgente - cvAgente;

/** Clientes del plan Agente necesarios para cubrir fijos y campaña de cada mes. */
export const equilibrio = Math.ceil((totalFijos + totalCampana) / margenAgente);
