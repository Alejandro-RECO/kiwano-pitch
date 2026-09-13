# Kiwano — presentación estratégica

Pitch deck web de **Kiwano (AI Agents & Tech Solutions)**: una presentación de 11 slides construida con [Astro](https://astro.build) y publicada en GitHub Pages.

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
2. El problema
3. ¿Qué es Kiwano?
4. La necesidad de fondo (Maslow y Max-Neef en lenguaje de negocio)
5. ¿A quién le hablamos? (segmentación B2B)
6. Ejemplo en logística
7. ¿Cómo se implementa? (cinco fases)
8. ¿Existe competencia? (diferenciador)
9. Análisis DOFA
10. Nota metodológica: p-medianas (evaluado y descartado como requisito)
11. Cierre y llamado a la acción

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
| Acentos, CTA, hilo narrativo (con moderación) | Neural Green `#39FF14` |
| Tarjetas, íconos, bordes | Pulp Green Deep `#1B4D3E` |
| Texto principal / fondo oscuro | Off-Black `#121413` |
| Fondos claros | Soft Cream `#F7F4EF` |

No se usa negro ni blanco puro. Tipografías: **Fredoka** (títulos, redondeada como el logo) y **Nunito Sans** (texto), servidas localmente desde `@fontsource-variable`.

## Desarrollo

```sh
npm install
npm run dev      # http://localhost:4321/kiwano-pitch/
npm run build    # genera dist/
npm run preview  # sirve dist/ localmente
```

## Publicación

Cada `push` a `main` ejecuta [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), que construye el sitio y lo publica en GitHub Pages. Si cambias el nombre del repositorio, actualiza `base` en [`astro.config.mjs`](astro.config.mjs).
