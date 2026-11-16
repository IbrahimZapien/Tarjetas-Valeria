"""Recorta el abecedario LSM (imagen en cuadrícula de 4 columnas, fondo oscuro liso)
en un sticker PNG transparente por letra: abecedario/<letra>.png

Uso: python3 plantilla/recortar_abecedario.py IMAGEN

Quita el fondo por color, pero RELLENA los huecos cerrados dentro de la mano
(sombras oscuras, p. ej. dentro del puño de la "s"). Los huecos grandes que dejan ver
el fondo de verdad (p. ej. el círculo de la "o") se conservan transparentes.
"""
import sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

LETRAS = list('abcdefghijklmn') + ['ñ'] + list('opqrstuvwxyz')

def huecos(opaco):
    """Regiones transparentes que NO tocan el borde (huecos cerrados), como lista de máscaras."""
    h, w = opaco.shape
    visto = opaco.copy()
    cola = deque([(y, x) for y in range(h) for x in (0, w - 1)] + [(y, x) for x in range(w) for y in (0, h - 1)])
    for y, x in cola: visto[y, x] = True
    while cola:  # el exterior
        y, x = cola.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not visto[ny, nx]:
                visto[ny, nx] = True; cola.append((ny, nx))
    out = []
    for y0, x0 in zip(*np.where(~visto)):
        if visto[y0, x0]: continue
        reg = [(y0, x0)]; visto[y0, x0] = True; q = deque(reg)
        while q:
            y, x = q.popleft()
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = y + dy, x + dx
                if 0 <= ny < h and 0 <= nx < w and not visto[ny, nx]:
                    visto[ny, nx] = True; q.append((ny, nx)); reg.append((ny, nx))
        m = np.zeros_like(opaco); ys, xs = zip(*reg); m[list(ys), list(xs)] = True
        out.append(m)
    return out

im = Image.open(sys.argv[1]).convert('RGB'); W, H = im.size
a = np.asarray(im).astype(np.float32)
bg = np.median(a[5:25, 5:200].reshape(-1, 3), axis=0)
dist = np.sqrt(((a - bg) ** 2).sum(axis=2))
alfa = np.clip((dist - 28) / 30, 0, 1)

# filas con contenido
on = (alfa > .5).sum(axis=1) > 3
bandas, ini = [], None
for y, v in enumerate(on):
    if v and ini is None: ini = y
    if not v and ini is not None:
        if y - ini > 40: bandas.append((ini, y))
        ini = None
if ini is not None: bandas.append((ini, H))

cw = W / 4
for k, l in enumerate(LETRAS):
    r, c = divmod(k, 4); y0, y1 = bandas[r]
    x0, x1 = int(c * cw), int((c + 1) * cw)
    y0, y1 = max(0, y0 - 10), min(H, y1 + 10)
    A = alfa[y0:y1, x0:x1].copy()
    opaco = A > .5
    area = opaco.sum()
    for m in huecos(opaco):
        # hueco chico (sombra dentro de la mano) → se rellena; hueco grande (fondo real) → se queda
        if m.sum() < .04 * area:
            A[m] = 1
    msk = Image.fromarray((A * 255).astype(np.uint8)).filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(.8))
    cel = im.crop((x0, y0, x1, y1)); cel.putalpha(msk)
    cel = cel.crop(cel.getchannel('A').point(lambda v: 255 if v > 60 else 0).getbbox())
    s = max(cel.size) + 16
    sq = Image.new('RGBA', (s, s), (0, 0, 0, 0)); sq.paste(cel, ((s - cel.size[0]) // 2, (s - cel.size[1]) // 2))
    sq.resize((300, 300), Image.LANCZOS).save(f'abecedario/{l}.png')
    print(l, 'huecos rellenados:', sum(1 for m in huecos(opaco) if m.sum() < .04 * area))
