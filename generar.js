// Genera una tarjeta PNG (1200 x 1680) a partir de su archivo JSON.
// Uso:  node generar.js tarjetas/estrella.json
// Resultado: tarjetas/estrella.png
//
// Prioridad del diseño: el CÓDIGO ESCRITO (letras, sílabas, pronunciación).
// La seña LSM es solo un apoyo pequeño (Valeria ya conoce LSM).
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const RAIZ = __dirname;
const W = 1200, H = 1680;

// Colores por defecto. Cada tarjeta puede cambiarlos en "colores" según su temática.
const COLORES_BASE = {
  fondo: '#6C2BD9',        // fondo de la tarjeta
  escena: '#16B4CE',       // fondo del panel de la escena
  texto: '#2B1B5C',        // letras oscuras en fichas
  acento: '#FF5DA2',       // etiquetas y detalles
  silabas: ['#FFD3E8', '#CFF5E7', '#FFF1B8', '#D9E8FF'], // un color por sílaba
};

const b64 = (p) => fs.readFileSync(path.join(RAIZ, p)).toString('base64');
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function fichas(silabas, c) {
  // Ancho disponible 1056 px. 10 px entre letras, 30 px entre sílabas.
  const letras = silabas.join('').length;
  const huecos = (letras - silabas.length) * 10 + (silabas.length - 1) * 30;
  const ancho = Math.min(150, Math.floor((1056 - huecos) / letras));
  const fuente = Math.round(ancho * 1.25);
  return silabas.map((s, i) => {
    const color = c.silabas[i % c.silabas.length];
    const letrasHtml = [...s].map((l) =>
      `<div class="ficha" style="width:${ancho}px;background:${color};font-size:${fuente}px">${esc(l)}</div>`).join('');
    // Debajo de cada sílaba, un arco en "U": se recorre con el dedo de izquierda a derecha
    // mientras se pronuncia la sílaba. Empieza en un punto (moneda) y termina en una flecha.
    const w = s.length * ancho + (s.length - 1) * 10;
    const x0 = Math.min(26, w * .2), x1 = w - x0;
    const arco = `<svg class="arco" width="${w}" height="96" viewBox="0 0 ${w} 96">
      <path d="M${x0} 14 Q${w / 2} 156 ${x1 - 6} 18" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round"/>
      <path d="M${x1 - 26} 12 L${x1 + 2} 8 L${x1 - 6} 36" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${x0}" cy="14" r="15" fill="#FFD43B" stroke="#C98A00" stroke-width="5"/>
    </svg>`;
    return `<div class="silaba"><div class="letras">${letrasHtml}</div>${arco}</div>`;
  }).join('');
}

function html(t) {
  const c = { ...COLORES_BASE, ...(t.colores || {}) };
  const palabra = t.palabra;
  const inicial = [...palabra][0];
  const tamPalabra = Math.min(250, Math.floor(1700 / palabra.length));
  const tipo = (f) => f.endsWith('.svg') ? 'svg+xml' : f.endsWith('.png') ? 'png' : 'jpeg';
  // Foto (jpg): llena todo el panel. Dibujo (svg/png): se acomoda abajo al centro.
  const sena = !t.sena ? `<div class="pendiente">seña<br>pendiente</div>`
    : /\.jpe?g$/.test(t.sena) ? `<div class="foto"><img src="data:image/jpeg;base64,${b64(t.sena)}"></div>`
    : `<img src="data:image/${tipo(t.sena)};base64,${b64(t.sena)}">`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: Fredoka; font-weight: 600; src: url(data:font/woff2;base64,${b64('plantilla/fuentes/fredoka-latin-600-normal.woff2')}); }
  @font-face { font-family: Fredoka; font-weight: 700; src: url(data:font/woff2;base64,${b64('plantilla/fuentes/fredoka-latin-700-normal.woff2')}); }
  * { box-sizing: border-box; margin: 0; }
  body { width: ${W}px; height: ${H}px; background: ${c.fondo}; font-family: Fredoka, sans-serif;
         display: flex; flex-direction: column; align-items: center; padding: 48px 72px 56px; }
  .escena { width: 1056px; height: 400px; border-radius: 64px; background: ${c.escena}; overflow: hidden; flex: none; }
  .escena img { width: 100%; height: 100%; display: block; object-fit: cover; }
  .palabra { color: #fff; font-weight: 700; font-size: ${tamPalabra}px; line-height: 1; margin: 34px 0 30px; letter-spacing: 4px;
             text-shadow: 0 8px 0 rgba(0,0,0,.18); }
  .fichas { display: flex; gap: 30px; justify-content: center; }
  .silaba { display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .arco { display: block; overflow: visible; }
  .letras { display: flex; gap: 10px; }
  .ficha { height: 300px; border-radius: 60px; display: flex; align-items: center; justify-content: center;
           color: ${c.texto}; font-weight: 700; padding-bottom: 14px;
           box-shadow: inset 0 -16px 0 rgba(0,0,0,.10), inset 0 14px 0 rgba(255,255,255,.7), 0 8px 0 rgba(0,0,0,.2); }
  .moneda { width: 64px; height: 64px; border-radius: 50%; background: #FFD43B; border: 7px solid #C98A00;
            box-shadow: inset -8px -8px 0 rgba(201,138,0,.25), 0 6px 0 rgba(0,0,0,.2); }
  .abajo { display: flex; gap: 32px; margin-top: 44px; width: 1056px; flex: 1; }
  .letra { flex: 1.25; background: #fff; border-radius: 56px; display: flex; align-items: center; justify-content: center;
           gap: 28px; color: ${c.texto}; font-weight: 700; line-height: 1; position: relative; }
  .letra .may { font-size: 280px; }
  .letra .min { font-size: 280px; color: ${c.acento}; }
  .sena { flex: 1; position: relative; background: #fff; border-radius: 56px; display: flex; align-items: flex-end; justify-content: center; }
  .sena img { max-width: 94%; max-height: 94%; display: block; }
  .foto { position: absolute; inset: 0; border-radius: 56px; overflow: hidden; }
  .foto img { width: 100%; height: 100%; object-fit: cover; max-width: none; max-height: none; }
  .sena .etiqueta { z-index: 2; }
  .pendiente { color: #bbb; font-size: 48px; text-align: center; font-weight: 600; }
  .etiqueta { position: absolute; top: -22px; left: 32px; background: ${c.acento}; color: #fff; font-weight: 700;
              font-size: 34px; padding: 4px 22px; border-radius: 24px; border: 5px solid ${c.fondo}; }
  </style></head><body>
    <div class="escena"><img src="data:image/svg+xml;base64,${b64(t.escena)}"></div>
    <div class="palabra">${esc(palabra)}</div>
    <div class="fichas">${fichas(t.silabas, c)}</div>
    <div class="abajo">
      <div class="letra"><span class="etiqueta">letra</span><span class="may">${esc(inicial.toUpperCase())}</span><span class="min">${esc(inicial)}</span></div>
      <div class="sena"><span class="etiqueta">LSM</span>${sena}</div>
    </div>
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
