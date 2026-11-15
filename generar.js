// Genera una tarjeta PNG (1200 x 1680) a partir de su archivo JSON.
// Uso:  node generar.js tarjetas/estrella.json
// Resultado: tarjetas/estrella.png
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const RAIZ = __dirname;
const W = 1200, H = 1680;

// Un color pastel por sílaba (se repite si hay más de 4 sílabas).
const COLORES_SILABA = ['#FFD3E8', '#CFF5E7', '#FFF1B8', '#D9E8FF'];

const b64 = (p) => fs.readFileSync(path.join(RAIZ, p)).toString('base64');
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function fichas(silabas) {
  // Ancho disponible 1056 px. 10 px entre letras, 28 px entre sílabas.
  const letras = silabas.join('').length;
  const huecos = (letras - silabas.length) * 10 + (silabas.length - 1) * 28;
  const ancho = Math.min(150, Math.floor((1056 - huecos) / letras));
  const fuente = Math.round(ancho * 1.25);
  return silabas.map((s, i) => {
    const color = COLORES_SILABA[i % COLORES_SILABA.length];
    const letrasHtml = [...s].map((l) =>
      `<div class="ficha" style="width:${ancho}px;background:${color};font-size:${fuente}px">${esc(l)}</div>`).join('');
    return `<div class="silaba">${letrasHtml}</div>`;
  }).join('');
}

function html(t) {
  const palabra = t.palabra;
  const tamPalabra = Math.min(260, Math.floor(1700 / palabra.length));
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: Fredoka; font-weight: 600; src: url(data:font/woff2;base64,${b64('plantilla/fuentes/fredoka-latin-600-normal.woff2')}); }
  @font-face { font-family: Fredoka; font-weight: 700; src: url(data:font/woff2;base64,${b64('plantilla/fuentes/fredoka-latin-700-normal.woff2')}); }
  * { box-sizing: border-box; margin: 0; }
  body { width: ${W}px; height: ${H}px; background: #6C2BD9; font-family: Fredoka, sans-serif;
         display: flex; flex-direction: column; align-items: center; padding: 56px 72px 0; }
  .escena { width: 1056px; height: 428px; border-radius: 64px; background: #16B4CE; overflow: hidden; }
  .escena img { width: 100%; height: 100%; display: block; }
  .palabra { color: #fff; font-weight: 700; font-size: ${tamPalabra}px; line-height: 1; margin: 40px 0 34px; letter-spacing: 4px; }
  .fichas { display: flex; gap: 28px; justify-content: center; }
  .silaba { display: flex; gap: 10px; }
  .ficha { height: 330px; border-radius: 60px; display: flex; align-items: center; justify-content: center;
           color: #2B1B5C; font-weight: 700; padding-bottom: 14px;
           box-shadow: inset 0 -16px 0 rgba(43,27,92,.12), inset 0 14px 0 rgba(255,255,255,.7), 0 8px 0 rgba(0,0,0,.18); }
  .sena { position: relative; margin-top: 56px; width: 624px; height: 424px; background: #fff; border-radius: 56px;
          display: flex; align-items: center; justify-content: center; }
  .sena img { width: 576px; }
  .lsm { position: absolute; top: -22px; left: 32px; background: #FF5DA2; color: #fff; font-weight: 700;
         font-size: 34px; padding: 4px 22px; border-radius: 24px; border: 5px solid #6C2BD9; }
  </style></head><body>
    <div class="escena"><img src="data:image/svg+xml;base64,${b64(t.escena)}"></div>
    <div class="palabra">${esc(palabra)}</div>
    <div class="fichas">${fichas(t.silabas)}</div>
    <div class="sena"><span class="lsm">LSM</span><img src="data:image/png;base64,${b64(t.sena)}"></div>
  </body></html>`;
}

(async () => {
  const entrada = process.argv[2];
  if (!entrada) { console.error('Uso: node generar.js tarjetas/<palabra>.json'); process.exit(1); }
  const t = JSON.parse(fs.readFileSync(path.join(RAIZ, entrada), 'utf8'));
  if (t.silabas.join('') !== t.palabra) throw new Error('Las sílabas no forman la palabra: ' + t.silabas.join('-'));
  const salida = path.join(RAIZ, entrada.replace(/\.json$/, '.png'));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.setContent(html(t));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: salida });
  await browser.close();
  console.log('Tarjeta creada:', path.relative(RAIZ, salida));
})();
