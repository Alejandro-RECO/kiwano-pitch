/**
 * Orden narrativo del deck: las 8 secciones del elevator pitch, en 5 minutos.
 * problema → solución → cliente → propuesta de valor → competencia →
 * modelo de negocio → tracción → equipo.
 * Cada slide sabe su tema (oscuro o crema) y la frase que la conecta con la siguiente.
 */
export type SlideTheme = 'dark' | 'light';

export interface SlideMeta {
  id: string;
  /** Nombre de la sección: se muestra en el riel y en la etiqueta numerada de la slide. */
  label: string;
  theme: SlideTheme;
  /** Frase de transición hacia la siguiente slide. Vacía en la última. */
  transition: string;
}

export const slides: SlideMeta[] = [
  {
    id: 'problema',
    label: 'Problema',
    theme: 'light',
    transition: 'Ese costo tiene solución, y no exige un equipo técnico.',
  },
  {
    id: 'kiwano',
    label: 'Solución',
    theme: 'dark',
    transition: '¿Para quién es?',
  },
  {
    id: 'cliente',
    label: 'Cliente',
    theme: 'light',
    transition: '¿Qué gana con Kiwano?',
  },
  {
    id: 'valor',
    label: 'Propuesta de valor',
    theme: 'dark',
    transition: '¿Y quién más lo ofrece?',
  },
  {
    id: 'competencia',
    label: 'Competencia',
    theme: 'light',
    transition: '¿Cómo ganamos dinero?',
  },
  {
    id: 'modelo',
    label: 'Modelo de negocio',
    theme: 'dark',
    transition: '¿Qué tan cerca estamos?',
  },
  {
    id: 'traccion',
    label: 'Tracción',
    theme: 'light',
    transition: '¿Quiénes lo hacemos?',
  },
  {
    id: 'equipo',
    label: 'Equipo',
    theme: 'dark',
    transition: '',
  },
];

export const site = {
  name: 'Kiwano',
  tagline: 'AI Agents & Tech Solutions',
  claim: 'Automatiza lo repetitivo. Decide con inteligencia.',
  description:
    'Elevator pitch de Kiwano: agentes de IA que convierten procesos repetitivos en decisiones automáticas para PyMes de logística, comercio y distribución en Bogotá.',
};

/** Tamaño de mercado (slide «Modelo de negocio»). */
export const mercado = {
  cifra: '+12.000',
  texto: 'empresas de logística y transporte activas en Bogotá-Región',
  /** Total exacto que reporta la fuente; sirve para calcular la participación de la meta. */
  total: 12377,
  fuente: 'Cámara de Comercio de Bogotá, Radar de eficiencia y competitividad logística (Registro Mercantil, 2025)',
};

/** Meta de clientes del primer año (objetivo del equipo). */
export const metaClientes = 40;

/**
 * Tracción (slide 7). `pruebas` son evidencias reales de interés: entrevistas,
 * encuestas, empresas que pidieron el diagnóstico, cartas de intención.
 * Déjala vacía si aún no hay; cada fila que agregues aparece como una cifra grande.
 * Ejemplo: { cifra: '8', texto: 'gerentes entrevistados' }
 */
export const traccion: { pruebas: { cifra: string; texto: string }[] } = {
  pruebas: [],
};

/**
 * Equipo (slide 8). Reemplaza los textos de ejemplo por los datos reales:
 * nombre, rol en Kiwano y la experiencia o fortaleza que aporta cada uno.
 */
export const equipo = [
  {
    nombre: 'Nombre Apellido',
    rol: 'Rol en Kiwano',
    fortaleza: 'Experiencia y fortaleza principal.',
  },
  {
    nombre: 'Nombre Apellido',
    rol: 'Rol en Kiwano',
    fortaleza: 'Experiencia y fortaleza principal.',
  },
];
