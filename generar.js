// Tarjetas de Valeria: una hoja A4 por palabra (1240 x 1754 px = A4 a 150 ppp).
//
//   escena → palabra → por cada letra: mano LSM → boca (cómo suena) → letra → arcos por sílaba
//   → seña de la palabra.
//
// Uso:  node generar.js datos/estrella.json
// Resultado: tarjetas/estrella.pdf (A4 para imprimir), datos/vistas/estrella.png (vista previa)
// y tarjetas/TODAS-LAS-TARJETAS.pdf actualizado. En tarjetas/ solo quedan los PDF aprobados.

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const { execFileSync } = require('child_process');
const { sonido, boca, FOTO_DE_SONIDO } = require('./plantilla/bocas.js');

const RAIZ = __dirname;
const W = 1650, H = 1275;          // hoja tamaño CARTA horizontal (11 x 8.5 in) a 150 ppp
const ANCHO = 1570;                // ancho útil (márgenes de 40 px ≈ 7 mm)

const COLORES_BASE = {
  fondo: '#6C2BD9', escena: '#16B4CE', texto: '#2B1B5C', acento: '#FF5DA2',
  silabas: ['#FFD3E8', '#CFF5E7', '#FFF1B8', '#D9E8FF'],
};

const existe = (p) => fs.existsSync(path.join(RAIZ, p));
const b64 = (p) => fs.readFileSync(path.join(RAIZ, p)).toString('base64');
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const mime = (f) => f.endsWith('.svg') ? 'image/svg+xml' : f.endsWith('.png') ? 'image/png' : 'image/jpeg';
const img = (f) => `data:${mime(f)};base64,${b64(f)}`;

const FUENTES = `
  @font-face { font-family: Fredoka; font-weight: 600; src: url(data:font/woff2;base64,${b64('plantilla/fuentes/fredoka-latin-600-normal.woff2')}); }
  @font-face { font-family: Fredoka; font-weight: 700; src: url(data:font/woff2;base64,${b64('plantilla/fuentes/fredoka-latin-700-normal.woff2')}); }
  * { box-sizing: border-box; margin: 0; }`;

// ---------- COLORES ----------
// "fondo" y "escena" pueden ser un color o una lista (degradado).
// Cada sílaba puede ser un color o [claro, fuerte] (ficha tipo gelatina con degradado).
const degradado = (v, ang = 165) => Array.isArray(v) ? `linear-gradient(${ang}deg, ${v.join(', ')})` : v;
const primero = (v) => Array.isArray(v) ? v[0] : v;
// Fondo de página: una ilustración (colores.fondoImagen, p. ej. un cielo estrellado) o el degradado.
const fondoPagina = (c) => c.fondoImagen ? `url(${img(c.fondoImagen)}) center / cover no-repeat, ${degradado(c.fondo)}` : degradado(c.fondo);
const silFondo = (c, i) => { const v = c.silabas[i % c.silabas.length]; return Array.isArray(v) ? `linear-gradient(180deg, ${v[0]} 0%, ${v[0]} 35%, ${v[1]} 100%)` : v; };
const silFuerte = (c, i) => { const v = c.silabas[i % c.silabas.length]; return Array.isArray(v) ? v[1] : v; };

// Patrón suave de fondo según el tema (destellos, burbujas, corazones), siempre igual para la misma palabra.
function patron(tipo, semilla, colores = ['#FFFFFF', '#FFE36B', '#FFB3D9']) {
  if (!tipo) return '';
  let s = [...semilla].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 11) >>> 0;
  const r = () => (s = (s * 1103515245 + 12345) >>> 0) / 2 ** 32;
  const forma = {
    destellos: (x, y, t) => `<path d="M${x} ${y - t} Q${x} ${y} ${x + t} ${y} Q${x} ${y} ${x} ${y + t} Q${x} ${y} ${x - t} ${y} Q${x} ${y} ${x} ${y - t}Z"/>`,
    burbujas: (x, y, t) => `<circle cx="${x}" cy="${y}" r="${t * .7}" fill-opacity=".0" stroke-width="3"/>`,
    corazones: (x, y, t) => `<path d="M${x} ${y + t * .6} C${x - t} ${y - t * .2} ${x - t * .5} ${y - t} ${x} ${y - t * .4} C${x + t * .5} ${y - t} ${x + t} ${y - t * .2} ${x} ${y + t * .6}Z"/>`,
  }[tipo];
  let out = '';
  for (let k = 0; k < 70; k++) {
    const x = r() * W, y = r() * H, t = 8 + r() * 16, col = colores[k % colores.length];
    out += `<g fill="${col}" stroke="${col}" opacity="${(.25 + r() * .35).toFixed(2)}">${forma(Math.round(x), Math.round(y), Math.round(t))}</g>`;
  }
  return `<svg class="patron" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${out}</svg>`;
}

// Letras de la palabra con su sílaba (índice) para colorear.
function letrasConSilaba(silabas) {
  const out = [];
  silabas.forEach((s, i) => [...s].forEach((l) => out.push({ l, s: i })));
  return out;
}

// Medidas de las fichas según el número de letras (ancho útil ANCHO px).
function medidas(silabas, gapL = 10, gapS = 30) {
  const n = silabas.join('').length;
  const huecos = (n - silabas.length) * gapL + (silabas.length - 1) * gapS;
  return { n, ancho: Math.min(250, Math.floor((ANCHO - huecos) / n)), gapL, gapS };
}

// Arco en "U" (sonrisa con flecha) para recorrer una sílaba de izquierda a derecha.
function arco(w, color = '#fff') {
  const x0 = Math.min(26, w * .2), x1 = w - x0;
  return `<svg class="arco" width="${w}" height="90" viewBox="0 0 ${w} 90">
    <path d="M${x0} 14 C${x0} 98 ${x1} 98 ${x1} 30" fill="none" stroke="${color}" stroke-width="10" stroke-linecap="round"/>
    <path d="M${x1 - 14} 30 L${x1 + 14} 30 L${x1} 10 Z" fill="${color}" stroke="${color}" stroke-width="8" stroke-linejoin="round"/>
    <circle cx="${x0}" cy="14" r="14" fill="#FFD43B" stroke="#C98A00" stroke-width="5"/></svg>`;
}

// ---------- FRENTE ----------
// Sticker de la mano LSM de una letra (abecedario/<letra>.png|.jpg|.webp), o null si falta.
const faltantes = new Set();
function sticker(l) {
  const f = ['png', 'webp', 'jpg'].map((e) => `abecedario/${l}.${e}`).find(existe);
  if (!f) faltantes.add(l);
  return f || null;
}
// Boca: foto real si existe para ese sonido (bocas/<letra>.jpg); si no, el dibujo.
// La rr lleva además una pista de vibración.
function bocaHTML(son) {
  const f = FOTO_DE_SONIDO[son] && `bocas/${FOTO_DE_SONIDO[son]}.jpg`;
  if (!f || !existe(f)) return boca(son);
  const vibra = son === 'rr' ? `<svg class="pista" viewBox="0 0 20 40"><path d="M6 4 l8 6 -8 6 8 6 -8 6 8 6" fill="none" stroke="#3D8FD1" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>` : '';
  return `<img class="foto-boca" src="${img(f)}">${vibra}`;
}
// Letra para repasar con el dedo: letra grande y suave con su contorno PUNTEADO (como en un cuaderno de trazo)
// y un puntito verde donde empieza el trazo.
function letraTrazo(l, tam, color) {
  return `<svg class="trazo" viewBox="0 0 100 130" style="height:${Math.round(tam * 1.55)}px">
    <text x="50" y="98" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="100"
      fill="rgba(255,255,255,.55)" stroke="${color}" stroke-width="3" stroke-dasharray=".8 4.4" stroke-linecap="round" stroke-linejoin="round">${esc(l)}</text>
  </svg>`;
}
// Dígrafos que en español suenan como una sola letra: llevan "movimiento" entre sus dos stickers.
const DIGRAFOS = ['ll', 'rr', 'ch'];

function frente(t, c) {
  const { ancho, gapL, gapS } = medidas(t.silabas);
  // Lo escrito es lo principal: fichas grandes; mano y boca más chicas, solo de apoyo.
  const fichaH = Math.min(400, Math.round(ancho * 2.4));
  const fuente = Math.min(Math.round(ancho * 1.25), Math.round(fichaH * .78));
  const mano = Math.min(140, Math.round(ancho * .8));
  const paso = ancho + gapL; // distancia entre centros de dos letras seguidas
  const todas = [...t.palabra];
  let g = 0; // índice de la letra en la palabra completa
  const altoBoca = Math.min(105, Math.round(ancho * .6));
  const columnas = t.silabas.map((s, i) => {
    const color = silFondo(c, i), fuerte = silFuerte(c, i);
    const ls = [...s];
    const cols = ls.map((l, k) => {
      const f = sticker(l);
      const par = (a, b) => DIGRAFOS.includes((a + (b || '')).toLowerCase());
      const inicioDig = par(l, ls[k + 1]);
      const finDig = k > 0 && par(ls[k - 1], l);
      let arriba;
      if (inicioDig) {
        // dígrafo (ll, rr, ch): una sola cápsula sobre las dos letras = una sola letra.
        // mano · movimiento en gris (cada vez más tenue) · mano
        const g = sticker(ls[k + 1]);
        const mano1 = f ? `<img class="m" src="${img(f)}">` : '';
        const mano2 = g ? `<img class="m" src="${img(g)}">` : '';
        const mov = f ? [.6, .35].map((o) => `<img class="g" src="${img(f)}" style="opacity:${o}">`).join('') : '';
        arriba = `<div class="capsula" style="width:${2 * ancho + gapL}px;height:${mano}px;border-color:${fuerte}">${mano1}${mov}${mano2}</div>`;
      } else if (finDig) {
        arriba = `<div style="height:${mano}px"></div>`;
      } else {
        arriba = `<div class="burbuja" style="width:${mano}px;height:${mano}px;border-color:${fuerte}">${f ? `<img src="${img(f)}">` : ''}</div>`;
      }
      // boca: cómo se pone para el sonido de esta letra (una sola para ll, rr, ch)
      const gi = g++;
      const son = sonido(todas, gi);
      const abajo = finDig ? `<div style="height:${altoBoca}px"></div>`
        : `<div class="boca${inicioDig ? ' doble' : ''}" style="height:${altoBoca}px;border-color:${fuerte};${inicioDig ? `width:${2 * ancho + gapL}px` : ''}">${bocaHTML(son)}</div>`;
      return `<div class="col" style="width:${ancho}px">
        <div class="manos" style="height:${mano + 20}px">${arriba}</div>
        <div class="bocas" style="height:${altoBoca}px">${abajo}</div>
        <div class="ficha" style="background:${color};height:${fichaH}px">${letraTrazo(l, fuente, c.texto)}</div></div>`;
    }).join('');
    const w = s.length * ancho + (s.length - 1) * gapL;
    return `<div class="silaba"><div class="cols" style="gap:${gapL}px">${cols}</div>${arco(w)}</div>`;
  }).join('');

  const sena = !t.sena ? `<div class="pendiente">seña<br>pendiente</div>`
    : /\.jpe?g$/.test(t.sena) ? `<div class="foto"><img src="${img(t.sena)}"></div>`
    : `<img class="dibujo" src="${img(t.sena)}">`;


  return `<!doctype html><html><head><meta charset="utf-8"><style>${FUENTES}
  html { background:${primero(c.fondo)}; }
  body { width:${W}px; height:${H}px; background:${fondoPagina(c)}; font-family:Fredoka,sans-serif; color:${c.texto};
         display:flex; flex-direction:column; align-items:center; padding:34px 40px 30px; position:relative; }
  .patron { position:absolute; inset:0; z-index:0; pointer-events:none; }
  body > div { position:relative; z-index:1; }
  .arriba { display:flex; gap:28px; width:${ANCHO}px; height:390px; flex:none; }
  .escena { flex:1; min-width:0; height:100%; border-radius:60px; background:${degradado(c.escena, 180)}; border:6px solid rgba(255,255,255,.85); overflow:hidden; }
  .escena img { width:100%; height:100%; object-fit:contain; display:block; }
  .fichas { display:flex; gap:${gapS}px; }
  .silaba { display:flex; flex-direction:column; align-items:center; gap:8px; }
  .cols { display:flex; }
  .col { display:flex; flex-direction:column; align-items:center; gap:10px; }
  .manos { position:relative; width:100%; display:flex; align-items:flex-end; justify-content:center; }
  .burbuja { position:relative; z-index:2; background:#fff; border:6px solid; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 5px 0 rgba(0,0,0,.2); }
  .burbuja img { width:86%; height:86%; object-fit:contain; }
  .capsula { position:absolute; left:0; bottom:0; z-index:2; background:#fff; border:6px solid; border-radius:999px; box-shadow:0 5px 0 rgba(0,0,0,.2);
             display:flex; align-items:center; justify-content:center; padding:0 6px; }
  .capsula .m { height:80%; object-fit:contain; position:relative; z-index:2; }
  .capsula .g { height:58%; object-fit:contain; filter:grayscale(1); margin:0 -16px; }
  .ficha { width:100%; border-radius:50px; display:flex; align-items:center; justify-content:center;
           font-weight:700; padding-bottom:10px;
           box-shadow: inset 0 -14px 0 rgba(0,0,0,.10), inset 0 12px 0 rgba(255,255,255,.7), 0 7px 0 rgba(0,0,0,.2); }
  .arco { display:block; overflow:visible; }
  .bocas { position:relative; width:100%; }
  .boca { background:#fff; border:5px solid; border-radius:26px; box-shadow:0 5px 0 rgba(0,0,0,.2); padding:2px; }
  .boca.doble { position:absolute; left:0; top:0; z-index:2; }
  .boca { position:relative; display:flex; justify-content:center; }
  .foto-boca { height:100%; width:100%; object-fit:cover; border-radius:20px; display:block; }
  .boca.doble .foto-boca { width:auto; aspect-ratio:1.45; }
  .pista { position:absolute; right:6px; top:50%; transform:translateY(-50%); height:60%; }
  .abajo { display:flex; gap:28px; margin-top:10px; width:${ANCHO}px; height:330px; flex:none; }
  .medio { flex:1; display:flex; align-items:center; justify-content:center; }
  .panel { position:relative; background:#fff; border-radius:50px; border:6px solid rgba(255,255,255,.9); }
  .escribe { flex:1; display:flex; align-items:center; justify-content:center; padding:20px 24px 10px; }
  .renglon { width:100%; height:100%; }
  .sena { width:700px; flex:none; display:flex; align-items:flex-end; justify-content:center; }
  .trazo { display:block; overflow:visible; }
  .foto { position:absolute; inset:0; border-radius:50px; overflow:hidden; }
  .foto { background:#fff; }
  .foto img { width:100%; height:100%; object-fit:contain; object-position:center center; }
  .dibujo { max-width:94%; max-height:94%; }
  .pendiente { margin:auto; color:#bbb; font-size:44px; text-align:center; font-weight:600; }
  .fila { display:flex; align-items:center; gap:18px; font-weight:700; font-size:40px; }
  .fila b { font-size:110px; line-height:1; min-width:80px; text-align:center; }
  .bolitas { display:flex; gap:8px; flex-wrap:wrap; }
  .bolitas i { width:36px; height:36px; border-radius:50%; display:block; }
  .etiqueta { position:absolute; top:-22px; left:30px; z-index:2; background:${c.acento}; color:#fff; font-weight:700;
              font-size:32px; padding:4px 22px; border-radius:24px; border:5px solid #fff; }
  </style></head><body>
    ${patron(c.patron, t.palabra, c.patronColores)}
    <div class="arriba">
      <div class="escena"><img src="${img(t.escena)}"></div>
      <div class="panel sena"><span class="etiqueta">seña</span>${sena}</div>
    </div>
    <div class="medio"><div class="fichas">${columnas}</div></div>
  </body></html>`;
}
function arcosMini(n) {
  return `<div class="bolitas">${Array.from({ length: n }, () =>
    `<svg width="80" height="50" viewBox="0 0 54 34"><path d="M6 6 C6 36 48 36 48 10" fill="none" stroke="#2B1B5C" stroke-width="6" stroke-linecap="round"/><circle cx="6" cy="6" r="6" fill="#FFD43B" stroke="#C98A00" stroke-width="2.5"/></svg>`).join('')}</div>`;
}

(async () => {
  const entrada = process.argv[2];
  if (!entrada) { console.error('Uso: node generar.js datos/<palabra>.json'); process.exit(1); }
  const t = JSON.parse(fs.readFileSync(path.join(RAIZ, entrada), 'utf8'));
  if (t.silabas.join('') !== t.palabra) throw new Error('Las sílabas no forman la palabra: ' + t.silabas.join('-'));
  const c = { ...COLORES_BASE, ...(t.colores || {}) };
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  const pdfs = [];
  for (const [cara, fn] of [['frente', frente]]) {
    await page.setContent(fn(t, c));
    await page.evaluate(() => document.fonts.ready);
    const nombre = path.basename(entrada, '.json');
    const salida = path.join(RAIZ, 'datos', 'vistas', `${nombre}.png`);
    await page.screenshot({ path: salida });
    console.log('Creada:', path.relative(RAIZ, salida));
    // página A4 (210 x 297 mm) con la imagen a escala exacta
    const pdf = path.join(RAIZ, 'datos', 'vistas', `${nombre}-tmp.pdf`);
    await page.pdf({ path: pdf, width: '279.4mm', height: '215.9mm', printBackground: true, scale: 1056 / W,
                     margin: { top: 0, right: 0, bottom: 0, left: 0 }, pageRanges: '1' });
    pdfs.push(pdf);
  }
  await browser.close();
  const final = path.join(RAIZ, 'tarjetas', `${path.basename(entrada, '.json')}.pdf`);
  execFileSync('python3', ['-c', `import sys
from pypdf import PdfWriter
w = PdfWriter()
for f in sys.argv[2:]: w.append(f)
w.write(sys.argv[1])`, final, ...pdfs]);
  pdfs.forEach((f) => fs.unlinkSync(f));
  console.log('Para imprimir (carta horizontal):', path.relative(RAIZ, final));
  // Juntar TODAS las tarjetas en un solo PDF (tarjetas/TODAS-LAS-TARJETAS.pdf), en orden alfabético.
  const todas = fs.readdirSync(path.join(RAIZ, 'tarjetas')).filter((f) => f.endsWith('.pdf') && !f.startsWith('TODAS')).sort()
    .map((f) => path.join(RAIZ, 'tarjetas', f));
  const junto = path.join(RAIZ, 'tarjetas', 'TODAS-LAS-TARJETAS.pdf');
  execFileSync('python3', ['-c', `import sys
from pypdf import PdfWriter
w = PdfWriter()
for f in sys.argv[2:]: w.append(f)
w.write(sys.argv[1])`, junto, ...todas]);
  console.log('Todas juntas:', path.relative(RAIZ, junto), `(${todas.length} tarjetas)`);
  if (faltantes.size) console.log('Faltan stickers LSM en abecedario/ para:', [...faltantes].join(', '));
})();
