"""Empalma varios cuadros de un video de una seña en una sola foto.

El cuadro de INICIO queda completo y nítido; las manos y los brazos de los cuadros
siguientes se encima con transparencia progresiva (cada vez más transparentes),
para mostrar hacia dónde va el movimiento.

Uso:
  python3 plantilla/empalmar.py VIDEO SALIDA.jpg --cuadros 1,14,26,38,50 [--recorte x0,y0,x1,y1]

  --cuadros  números de cuadro (empiezan en 1); el primero es el inicio.
  --recorte  zona a conservar, en píxeles del video.
Requiere ffmpeg, Pillow y numpy.
"""
import argparse, subprocess, tempfile, os
import numpy as np
from PIL import Image, ImageFilter

a = argparse.ArgumentParser()
a.add_argument('video'); a.add_argument('salida')
a.add_argument('--cuadros', required=True)
a.add_argument('--recorte')
args = a.parse_args()
sel = [int(x) for x in args.cuadros.split(',')]

tmp = tempfile.mkdtemp()
subprocess.run(['ffmpeg', '-v', 'error', '-i', args.video, os.path.join(tmp, 'f_%03d.png')], check=True)
L = lambda i: np.asarray(Image.open(os.path.join(tmp, f'f_{i:03d}.png')).convert('RGB')).astype(np.float32)

def piel(f):
    R, G, B = f[..., 0], f[..., 1], f[..., 2]
    return (R > 95) & (R > G + 12) & (R > B + 28)

def suave(b, grow=7, blur=4):
    m = Image.fromarray((b * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(grow)).filter(ImageFilter.GaussianBlur(blur))
    return np.asarray(m).astype(np.float32)[..., None] / 255

dif = lambda x, y: np.abs(x - y).sum(axis=2) > 60

inicio = L(sel[0]); resto = sel[1:]
fr = {i: L(i) for i in resto}
# transparencia progresiva: de .75 (siguiente) a .38 (último)
alfas = np.linspace(.75, .38, len(resto)) if len(resto) > 1 else [.6]
# zona de las manos del inicio: se protege para que quede nítida
m0 = np.ones(inicio.shape[:2], bool)
for i in (resto[len(resto) // 2], resto[-1]):
    m0 &= dif(inicio, fr[i])
m0 = suave(piel(inicio) & m0, 15, 6)
out = inicio.copy()
for i, al in reversed(list(zip(resto, alfas))):
    f = fr[i]; m = suave(piel(f) & dif(f, inicio)) * (1 - m0) * al
    out = out * (1 - m) + f * m
img = Image.fromarray(out.clip(0, 255).astype(np.uint8))
if args.recorte:
    img = img.crop(tuple(int(v) for v in args.recorte.split(',')))
img.save(args.salida, quality=90)
print('Listo:', args.salida, img.size)
