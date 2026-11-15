"""Empalma varios cuadros de un video de una seña en una sola foto.

El cuadro de INICIO queda completo y nítido; las manos y los brazos de los cuadros
siguientes se enciman con transparencia progresiva (cada vez más transparentes) y con
un contorno blanco para que su forma se distinga. El fondo verde se suaviza para
que resalten la persona y sus manos.

Uso:
  python3 plantilla/empalmar.py VIDEO SALIDA.jpg --cuadros 1,21,33,49 [--recorte x0,y0,x1,y1]

  --cuadros  números de cuadro (empiezan en 1); el primero es el inicio.
  --recorte  zona a conservar, en píxeles del video.
Requiere ffmpeg, Pillow y numpy.
"""
import argparse, subprocess, tempfile, os, glob
import numpy as np
from PIL import Image, ImageFilter

a = argparse.ArgumentParser()
a.add_argument('video'); a.add_argument('salida')
a.add_argument('--cuadros', required=True)
a.add_argument('--recorte')
a.add_argument('--fondo', type=float, default=.6, help='cuánto suavizar el fondo verde (0 a 1)')
args = a.parse_args()
sel = [int(x) for x in args.cuadros.split(',')]

tmp = tempfile.mkdtemp()
subprocess.run(['ffmpeg', '-v', 'error', '-i', args.video, os.path.join(tmp, 'f_%03d.png')], check=True)
n = len(glob.glob(os.path.join(tmp, 'f_*.png')))
L = lambda i: np.asarray(Image.open(os.path.join(tmp, f'f_{i:03d}.png')).convert('RGB')).astype(np.float32)

def piel(f):
    R, G, B = f[..., 0], f[..., 1], f[..., 2]
    return (R > 95) & (R > G + 12) & (R > B + 28)

def mascara(b, grow=0, blur=1.4):
    # silueta limpia: suaviza, vuelve a umbralizar (sin cuadritos) y difumina el borde
    m = Image.fromarray((b * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2.5))
    m = Image.fromarray(((np.asarray(m) > 110) * 255).astype(np.uint8))
    if grow:
        m = m.filter(ImageFilter.MaxFilter(grow))
    return np.asarray(m.filter(ImageFilter.GaussianBlur(blur))).astype(np.float32)[..., None] / 255

# fondo limpio: mediana de cada píxel ignorando los cuadros donde ahí hay piel
pila = np.stack([L(i) for i in range(1, n + 1, 2)])
sk = np.stack([piel(f) for f in pila])[..., None]
fondo = np.nanmedian(np.where(sk, np.nan, pila), axis=0)
fondo = np.where(np.isnan(fondo), np.median(pila, axis=0), fondo)

def manos(f):
    return piel(f) & (np.abs(f - fondo).sum(axis=2) > 70)

inicio = L(sel[0]); resto = sel[1:]
alfas = np.linspace(.82, .5, len(resto)) if len(resto) > 1 else [.7]

# vestido / ropa clara del inicio: ahí no se dibujan fantasmas
R, G, B = inicio[..., 0], inicio[..., 1], inicio[..., 2]
ropa = (R > 140) & (G > 120) & (B < 130) & (np.abs(R - G) < 45)
permitido = 1 - mascara(ropa, grow=7, blur=3)
# fondo (lo que no cambia respecto al fondo limpio y no es piel ni ropa): más claro y menos saturado
es_fondo = (np.abs(inicio - fondo).sum(axis=2) < 45) & ~piel(inicio) & ~ropa
fm = mascara(es_fondo, blur=4) * args.fondo
gris = inicio.mean(axis=2, keepdims=True)
claro = (inicio * .35 + gris * .65) * .6 + 255 * .4
out = inicio * (1 - fm) + claro * fm

m0 = mascara(manos(inicio), grow=11, blur=3)  # manos del inicio: protegidas y nítidas
for i, al in reversed(list(zip(resto, alfas))):
    f = L(i); m = mascara(manos(f)) * (1 - m0) * permitido
    borde = np.clip(mascara(manos(f), grow=7, blur=1.2) - mascara(manos(f)), 0, 1) * (1 - m0) * permitido
    out = out * (1 - borde * al) + 255 * borde * al          # contorno blanco
    out = out * (1 - m * al) + f * (m * al)                   # mano transparente
img = Image.fromarray(out.clip(0, 255).astype(np.uint8))
if args.recorte:
    img = img.crop(tuple(int(v) for v in args.recorte.split(',')))
img.save(args.salida, quality=92)
print('Listo:', args.salida, img.size)
