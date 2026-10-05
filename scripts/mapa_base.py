"""
Descarga el mapa base de Bogotá (teselas de OpenStreetMap) que cubre todos
los nodos, lo une, lo pasa a la paleta crema de la marca y guarda:
  - src/assets/mapa-bogota.webp
  - src/data/mapa.json  (zoom y origen en píxeles para proyectar lat/lon)
Uso: python scripts/mapa_base.py   (requiere Pillow; solo hace falta correrlo si cambian los nodos)
"""
import io
import json
import math
import time
import urllib.request
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
nodos = json.loads((RAIZ / "src" / "data" / "nodos.json").read_text(encoding="utf-8"))

ZOOM = 14
TILE = 256
MARGEN_PX = 70
URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png"


def a_pixel(lat, lon):
    """Web Mercator: lat/lon a píxel global en el zoom elegido."""
    n = 2**ZOOM * TILE
    x = (lon + 180) / 360 * n
    s = math.sin(math.radians(lat))
    y = (0.5 - math.log((1 + s) / (1 - s)) / (4 * math.pi)) * n
    return x, y


xs, ys = zip(*(a_pixel(n["lat"], n["lon"]) for n in nodos))
x0, x1 = min(xs) - MARGEN_PX, max(xs) + MARGEN_PX
y0, y1 = min(ys) - MARGEN_PX, max(ys) + MARGEN_PX

# Proporción 4:3 para que el mapa llene bien la tarjeta de la slide.
ancho, alto = x1 - x0, y1 - y0
if ancho / alto < 4 / 3:
    extra = (alto * 4 / 3 - ancho) / 2
    x0, x1 = x0 - extra, x1 + extra
else:
    extra = (ancho * 3 / 4 - alto) / 2
    y0, y1 = y0 - extra, y1 + extra
x0, y0, x1, y1 = map(round, (x0, y0, x1, y1))

tx0, tx1 = x0 // TILE, x1 // TILE
ty0, ty1 = y0 // TILE, y1 // TILE
lienzo = Image.new("RGB", ((tx1 - tx0 + 1) * TILE, (ty1 - ty0 + 1) * TILE))
for i, tx in enumerate(range(tx0, tx1 + 1)):
    for j, ty in enumerate(range(ty0, ty1 + 1)):
        url = URL.format(z=ZOOM, x=tx, y=ty)
        req = urllib.request.Request(url, headers={"User-Agent": "kiwano-pitch (proyecto universitario)"})
        with urllib.request.urlopen(req, timeout=20) as r:
            lienzo.paste(Image.open(io.BytesIO(r.read())).convert("RGB"), (i * TILE, j * TILE))
        time.sleep(0.1)

recorte = lienzo.crop((x0 - tx0 * TILE, y0 - ty0 * TILE, x1 - tx0 * TILE, y1 - ty0 * TILE))
# Escala de grises teñida de crema: el mapa da contexto sin competir con los puntos.
gris = ImageEnhance.Contrast(ImageOps.grayscale(recorte)).enhance(0.85)
recorte = ImageOps.colorize(gris, black="#3d3a35", white="#f7f4ef", mid="#cfc8bc")
recorte.save(RAIZ / "src" / "assets" / "mapa-bogota.webp", quality=82, method=6)
meta = {"zoom": ZOOM, "tile": TILE, "x0": x0, "y0": y0, "ancho": x1 - x0, "alto": y1 - y0,
        "atribucion": "Mapa base: © colaboradores de OpenStreetMap"}
(RAIZ / "src" / "data" / "mapa.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
print(f"OK: {meta['ancho']}×{meta['alto']} px, {(tx1 - tx0 + 1) * (ty1 - ty0 + 1)} teselas")
