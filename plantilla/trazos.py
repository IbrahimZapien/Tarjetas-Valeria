"""Calcula la línea central (esqueleto) de cada letra de la fuente Fredoka 700 y la guarda como
puntos para dibujar una línea punteada "de pluma" por EN MEDIO de la letra negra.

Uso: python3 plantilla/trazos.py            -> plantilla/trazos.json
Coordenadas en el mismo viewBox que usa generar.js para la letra: 0 0 100 130,
<text x=50 y=98 font-size=100 text-anchor=middle>.
"""
import json, os, subprocess, tempfile
import numpy as np
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LETRAS = list('abcdefghijklmnopqrstuvwxyzñáéíóú')
ESC = 8  # px por unidad del viewBox

def zhang_suen(img):
    """Adelgaza una imagen binaria hasta 1 px (algoritmo de Zhang-Suen)."""
    im = img.copy().astype(np.uint8)
    while True:
        cambio = False
        for paso in (0, 1):
            P = np.pad(im, 1)
            p2, p3, p4 = P[:-2, 1:-1], P[:-2, 2:], P[1:-1, 2:]
            p5, p6, p7 = P[2:, 2:], P[2:, 1:-1], P[2:, :-2]
            p8, p9 = P[1:-1, :-2], P[:-2, :-2]
            vec = [p2, p3, p4, p5, p6, p7, p8, p9, p2]
            B = sum(vec[:8])
            A = sum(((vec[k] == 0) & (vec[k + 1] == 1)).astype(np.uint8) for k in range(8))
            if paso == 0:
                c = (p2 * p4 * p6 == 0) & (p4 * p6 * p8 == 0)
            else:
                c = (p2 * p4 * p8 == 0) & (p2 * p6 * p8 == 0)
            m = (im == 1) & (B >= 2) & (B <= 6) & (A == 1) & c
            if m.any():
                im[m] = 0; cambio = True
        if not cambio:
            return im

def podar(sk, largo):
    """Quita ramitas cortas (espuelas) que salen de los extremos."""
    sk = sk.copy()
    for _ in range(largo):
        P = np.pad(sk, 1)
        vec = sum(np.roll(np.roll(P, dy, 0), dx, 1) for dy in (-1, 0, 1) for dx in (-1, 0, 1) if dy or dx)[1:-1, 1:-1]
        ext = (sk == 1) & (vec == 1)
        if not ext.any(): break
        sk[ext] = 0
    return sk

def puntos(sk, sep):
    ys, xs = np.nonzero(sk)
    orden = np.lexsort((xs, ys)); pts = np.stack([xs[orden], ys[orden]], 1).astype(float)
    elegidos = []
    for p in pts:
        if not elegidos or np.min(np.hypot(*(np.array(elegidos) - p).T)) >= sep:
            elegidos.append(p)
    return elegidos

def main():
    fuente = os.path.join(RAIZ, 'plantilla/fuentes/fredoka-latin-700-normal.woff2')
    tmp = tempfile.mkdtemp()
    js = f"""
const {{chromium}}=require('playwright');const fs=require('fs');
(async()=>{{const b=await chromium.launch();const p=await b.newPage({{viewport:{{width:{100*ESC},height:{130*ESC}}}}});
const f=fs.readFileSync('{fuente}').toString('base64');
for (const l of {json.dumps(LETRAS)}) {{
 await p.setContent(`<style>@font-face{{font-family:F;font-weight:700;src:url(data:font/woff2;base64,${{f}})}}body{{margin:0;background:#fff}}</style>
 <svg width="{100*ESC}" height="{130*ESC}" viewBox="0 0 100 130"><text x="50" y="98" text-anchor="middle" font-family="F" font-weight="700" font-size="100">${{l}}</text></svg>`);
 await p.evaluate(()=>document.fonts.ready);
 await p.screenshot({{path:'{tmp}/'+encodeURIComponent(l)+'.png'}});
}}
await b.close();}})();"""
    open(os.path.join(tmp, 'r.js'), 'w').write(js)
    subprocess.run(['node', os.path.join(tmp, 'r.js')], check=True, cwd=RAIZ)
    from urllib.parse import quote
    out = {}
    for l in LETRAS:
        g = np.asarray(Image.open(os.path.join(tmp, quote(l) + '.png')).convert('L')) < 128
        sk = podar(zhang_suen(g), int(1.5 * ESC))
        pts = puntos(sk, 5.2 * ESC)
        out[l] = [[round(x / ESC, 2), round(y / ESC, 2)] for x, y in pts]
        print(l, len(out[l]))
    json.dump(out, open(os.path.join(RAIZ, 'plantilla/trazos.json'), 'w'), ensure_ascii=False)

main()
