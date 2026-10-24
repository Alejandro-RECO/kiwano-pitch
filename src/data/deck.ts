/**
 * Orden narrativo del deck. Cada slide sabe su tema (oscuro para abrir y cerrar,
 * crema para contenido denso) y la frase que la conecta con la siguiente:
 * problema → solución → cliente → competencia → precio → viabilidad → cierre.
 */
export type SlideTheme = 'dark' | 'light';

export interface SlideMeta {
  id: string;
  /** Nombre corto para el riel de navegación. */
  label: string;
  theme: SlideTheme;
  /** Frase de transición hacia la siguiente slide. Vacía en la última. */
  transition: string;
}

export const slides: SlideMeta[] = [
  {
    id: 'inicio',
    label: 'Portada',
    theme: 'dark',
    transition: 'Todo empieza con un costo que las empresas asumen como normal.',
  },
  {
    id: 'problema',
    label: 'La problemática',
    theme: 'light',
    transition: 'Ese costo tiene solución, y no exige un equipo técnico.',
  },
  {
    id: 'kiwano',
    label: 'La solución',
    theme: 'dark',
    transition: '¿Para quién es?',
  },
  {
    id: 'cliente',
    label: 'Cliente objetivo',
    theme: 'light',
    transition: '¿Y por qué Kiwano y no otro?',
  },
  {
    id: 'competencia',
    label: 'Panorama competitivo',
    theme: 'light',
    transition: '¿Cuánto cuesta?',
  },
  {
    id: 'oferta',
    label: 'Producto y precio',
    theme: 'dark',
    transition: '¿Y es un negocio viable?',
  },
  {
    id: 'numeros',
    label: 'Viabilidad',
    theme: 'light',
    transition: 'Para cerrar.',
  },
  {
    id: 'cierre',
    label: 'Cierre',
    theme: 'dark',
    transition: '',
  },
];

export const site = {
  name: 'Kiwano',
  tagline: 'AI Agents & Tech Solutions',
  claim: 'Automatiza lo repetitivo. Decide con inteligencia.',
  description:
    'Presentación estratégica de Kiwano: agentes de IA que convierten procesos repetitivos en decisiones automáticas para PYMES de logística, comercio y distribución en Bogotá.',
  /**
   * Correo para el llamado a la acción del cierre. Déjalo vacío y el botón
   * llevará a la fase de diagnóstico dentro de la misma presentación.
   */
  contactEmail: '',
};
