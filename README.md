# Kiwano — presentación estratégica

Pitch deck web de **Kiwano (AI Agents & Tech Solutions)**: una presentación de 15 slides para la clase de Emprendimiento II construida con [Astro](https://astro.build) y publicada en GitHub Pages.

**Sitio publicado:** https://alejandro-reco.github.io/kiwano-pitch/

## Cómo se usa la presentación

| Acción | Cómo |
| --- | --- |
| Avanzar / retroceder | Flechas ↓ ↑ (o ← →), Espacio, Av Pág / Re Pág |
| Ir al inicio / final | Inicio / Fin |
| Pantalla completa | Tecla `F` o botón **Presentar** |
| Saltar a una slide | Clic en un punto del riel izquierdo |
| Guardar como PDF | Botón **Guardar como PDF** en el cierre (una slide por página, 16:9) |

En móvil se navega con scroll; la barra superior y el contador muestran el avance.

## Estructura narrativa

1. Portada
2. La problemática
3. La solución (Kiwano + casos en logística)
4. Panorama competitivo
5. Fundamentación: el valor que entregamos
6. Producto y precio (4P)
7. Plaza y promoción (4P)
8. Red de nodos: 20 empresas reales en Bogotá sobre el mapa (gráfico generado con Claude + prompt)
9. Ruta de visitas: distancias y ventanas de tiempo de cada cliente
10. P-medianas: dónde ubicar el punto de atención
11. Modelo de transporte (Vogel): qué proveedor de IA atiende a cada cliente
12. Estrategia de relación con clientes, proveedores y competencia
13. Costos fijos y variables, margen y punto de equilibrio
14. ¿Cómo se implementa?
15. Cierre

Cada slide termina con una **frase de transición** hacia la siguiente. Esas frases, el orden y el tema (oscuro o crema) de cada slide viven en [`src/data/deck.ts`](src/data/deck.ts).

## Editar el contenido

- Textos de cada slide: [`src/components/slides/`](src/components/slides/) (un archivo por slide).
- Orden, frases de transición y datos generales: [`src/data/deck.ts`](src/data/deck.ts). Ahí también está `contactEmail`: si lo llenas, el botón del cierre abre un correo; vacío, lleva a la fase de diagnóstico.
- Logo: [`src/assets/kiwano-logo.png`](src/assets/kiwano-logo.png) (Astro lo optimiza a WebP en el build).
- Colores, tipografías y ritmo: [`src/styles/global.css`](src/styles/global.css).

### Paleta de marca

| Rol | Color |
| --- | --- |
| Títulos y estructura | Kiwano Brown `#8C7355` |
| Acentos, CTA, hilo narrativo (con moderación) | Kiwi Pulp `#9DBF85` |
| Tarjetas, íconos, bordes | Pulp Green Deep `#1B4D3E` |
| Texto principal / fondo oscuro | Off-Black `#121413` |
| Fondos claros | Soft Cream `#F7F4EF` |

No se usa negro ni blanco puro. Tipografías: **Fredoka** (títulos, redondeada como el logo) y **Nunito Sans** (texto), servidas localmente desde `@fontsource-variable`.

## Datos y anexo para el informe

- [`src/data/nodos.json`](src/data/nodos.json): base de datos de los 20 nodos (más la sede N00), con dirección, coordenadas, horario y fuente.
- [`src/data/costos.json`](src/data/costos.json): costos fijos, variables y precios con su fuente (valores de 2026).
- [`src/data/red.ts`](src/data/red.ts) y [`src/data/costos.ts`](src/data/costos.ts): cálculo de distancias (haversine × 1,35), ruta con ventanas de tiempo, totales y punto de equilibrio. La presentación y el Excel usan la misma lógica.

- [`src/assets/mapa-bogota.webp`](src/assets/mapa-bogota.webp): mapa base real de Bogotá (OpenStreetMap, en tonos de la marca) sobre el que se dibujan los nodos y la ruta. Si cambian los nodos, se regenera con `python scripts/mapa_base.py` (requiere Pillow).

Para regenerar el Excel del informe ([`informe/Kiwano_red_de_nodos.xlsx`](informe/Kiwano_red_de_nodos.xlsx)):

```sh
node --experimental-strip-types scripts/exportar-red.ts
python scripts/informe_xlsx.py   # requiere openpyxl
```

## Desarrollo

```sh
npm install
npm run dev      # http://localhost:4321/kiwano-pitch/
npm run build    # genera dist/
npm run preview  # sirve dist/ localmente
```

## Publicación

Cada `push` a `main` ejecuta [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), que construye el sitio y lo publica en GitHub Pages. Si cambias el nombre del repositorio, actualiza `base` en [`astro.config.mjs`](astro.config.mjs).
