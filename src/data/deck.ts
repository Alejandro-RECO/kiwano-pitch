/**
 * Orden narrativo del deck. Cada slide sabe su tema (oscuro para abrir y cerrar,
 * crema para contenido denso) y la frase que la conecta con la siguiente:
 * problema → solución → competencia → valor → 4P → red de nodos → ruta → relación → costos → cómo arrancar.
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
    transition: 'No es la única opción en el mercado.',
  },
  {
    id: 'competencia',
    label: 'Panorama competitivo',
    theme: 'light',
    transition: '¿Qué valor genera?',
  },
  {
    id: 'valor',
    label: 'Fundamentación',
    theme: 'light',
    transition: 'Así se empaqueta ese valor.',
  },
  {
    id: 'oferta',
    label: 'Producto y precio',
    theme: 'dark',
    transition: '¿Cómo llega al cliente?',
  },
  {
    id: 'canal',
    label: 'Plaza y promoción',
    theme: 'light',
    transition: 'Ese canal tiene direcciones en Bogotá.',
  },
  {
    id: 'red',
    label: 'Red de nodos',
    theme: 'dark',
    transition: 'Con los puntos ubicados, se miden las distancias.',
  },
  {
    id: 'distancias',
    label: 'Distancias y horarios',
    theme: 'light',
    transition: 'Con las distancias, ¿desde dónde conviene atenderlos?',
  },
  {
    id: 'pmedianas',
    label: 'P-medianas',
    theme: 'light',
    transition: 'Y para atender a esos clientes, ¿qué proveedor usa cada uno?',
  },
  {
    id: 'transporte',
    label: 'Modelo de transporte',
    theme: 'dark',
    transition: 'Y con cada actor de la red, una estrategia.',
  },
  {
    id: 'relacion',
    label: 'Estrategia de relación',
    theme: 'light',
    transition: '¿Cuánto cuesta operar?',
  },
  {
    id: 'costos',
    label: 'Costos',
    theme: 'light',
    transition: 'Así arranca un cliente.',
  },
  {
    id: 'implementacion',
    label: '¿Cómo se implementa?',
    theme: 'dark',
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
