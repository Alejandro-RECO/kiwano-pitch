// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages publica el sitio en https://<usuario>.github.io/<repositorio>/
// Si cambias el nombre del repositorio, actualiza `base`.
export default defineConfig({
  site: 'https://alejandro-reco.github.io',
  base: '/kiwano-pitch',
  trailingSlash: 'ignore',
  vite: {
    // La carpeta vive en OneDrive: el sondeo garantiza que la recarga en vivo detecte los cambios.
    server: { watch: { usePolling: true, interval: 300 } },
  },
});
