/**
 * Orden narrativo del deck. Cada slide sabe su tema (oscuro para abrir y cerrar,
 * crema para contenido denso) y la frase que la conecta con la siguiente:
 * problema → necesidad de fondo → a quién → cómo → por qué nosotros → qué tan sólido es el análisis.
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
    label: 'El problema',
    theme: 'light',
    transition: 'Ese costo tiene solución, y no exige un equipo técnico.',
  },
  {
    id: 'kiwano',
    label: '¿Qué es Kiwano?',
    theme: 'dark',
    transition: 'Detrás de la eficiencia hay una necesidad más básica.',
  },
  {
    id: 'necesidad',
    label: 'La necesidad de fondo',
    theme: 'light',
    transition: '¿Quién siente esa necesidad todos los días?',
  },
  {
    id: 'cliente',
    label: '¿A quién le hablamos?',
    theme: 'dark',
    transition: 'Así se ve Kiwano dentro de su operación.',
  },
  {
    id: 'logistica',
    label: 'Ejemplo en logística',
    theme: 'light',
    transition: 'Y así se lleva a producción sin poner en riesgo la operación.',
  },
  {
    id: 'implementacion',
    label: '¿Cómo se implementa?',
    theme: 'dark',
    transition: 'No somos los únicos en el mercado. Sí somos los que encajan.',
  },
  {
    id: 'competencia',
    label: '¿Existe competencia?',
    theme: 'light',
    transition: 'Con claridad sobre dónde estamos parados.',
  },
  {
    id: 'dofa',
    label: 'Análisis DOFA',
    theme: 'light',
    transition: 'Y con el rigor de descartar lo que no aplica.',
  },
  {
    id: 'metodologia',
    label: 'Nota metodológica',
    theme: 'light',
    transition: 'El análisis sostiene la propuesta. Este es el siguiente paso.',
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
