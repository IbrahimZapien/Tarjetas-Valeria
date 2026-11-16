// Tarjetas de Valeria, versión 2: DOS caras por palabra (1200 x 1680 cada una).
//
//   FRENTE  (aprender):  escena → palabra → letras en orden (por sílaba) → arcos por sílaba
//                        → seña de la palabra.
//   REVERSO (practicar): 1 traza · 2 ordena · 3 completa · 4 muévete.
//
// Uso:  node generar.js tarjetas/estrella.json
// Resultado: tarjetas/estrella-frente.png y tarjetas/estrella-reverso.png

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const RAIZ = __dirname;
const W = 1200, H = 1680;

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

// Letras de la palabra con su sílaba (índice) para colorear.
function letrasConSilaba(silabas) {
  const out = [];
  silabas.forEach((s, i) => [...s].forEach((l) => out.push({ l, s: i })));
  return out;
}

// Medidas de las fichas según el número de letras (ancho útil 1056 px).
function medidas(silabas, gapL = 10, gapS = 30) {
  const n = silabas.join('').length;
  const huecos = (n - silabas.length) * gapL + (silabas.length - 1) * gapS;
  return { n, ancho: Math.min(150, Math.floor((1056 - huecos) / n)), gapL, gapS };
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
// Dígrafos que en español suenan como una sola letra: llevan "movimiento" entre sus dos stickers.
const DIGRAFOS = ['ll', 'rr', 'ch'];

function frente(t, c) {
  const { ancho, gapL, gapS } = medidas(t.silabas);
  const fuente = Math.round(ancho * 1.2);
  const mano = Math.round(ancho * .92);
  const paso = ancho + gapL; // distancia entre centros de dos letras seguidas
  const columnas = t.silabas.map((s, i) => {
    const color = c.silabas[i % c.silabas.length];
    const ls = [...s];
    const cols = ls.map((l, k) => {
      const f = sticker(l);
      const dig = DIGRAFOS.includes((l + (ls[k + 1] || '')).toLowerCase());
      // movimiento: copias en gris, cada vez más tenues, entre los dos stickers del dígrafo + arco que los une
      const mov = dig && f ? [1 / 3, 2 / 3].map((fr, j) =>
        `<img class="fantasma" src="${img(f)}" style="width:${mano}px;left:${ancho / 2 + paso * fr - mano / 2}px;opacity:${j ? .28 : .45}">`).join('')
        + `<svg class="liga" width="${paso + 20}" height="40" style="left:${ancho / 2 - 10}px" viewBox="0 0 ${paso + 20} 40">
            <path d="M10 34 C10 4 ${paso + 10} 4 ${paso + 10} 34" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-dasharray="2 13"/></svg>` : '';
      const arriba = f ? `<img class="mano" src="${img(f)}" style="width:${mano}px;height:${mano}px">`
                       : `<div class="mano" style="width:${mano}px;height:${mano}px"></div>`;
      return `<div class="col" style="width:${ancho}px">
        <div class="manos" style="height:${mano + 30}px">${mov}${arriba}</div>
        <div class="ficha" style="background:${color};font-size:${fuente}px">${esc(l)}</div></div>`;
    }).join('');
    const w = s.length * ancho + (s.length - 1) * gapL;
    return `<div class="silaba"><div class="cols" style="gap:${gapL}px">${cols}</div>${arco(w)}</div>`;
  }).join('');

  const sena = !t.sena ? `<div class="pendiente">seña<br>pendiente</div>`
    : /\.jpe?g$/.test(t.sena) ? `<div class="foto"><img src="${img(t.sena)}"></div>`
    : `<img class="dibujo" src="${img(t.sena)}">`;
  const tamPalabra = Math.min(230, Math.floor(1600 / t.palabra.length));

  return `<!doctype html><html><head><meta charset="utf-8"><style>${FUENTES}
  body { width:${W}px; height:${H}px; background:${c.fondo}; font-family:Fredoka,sans-serif; color:${c.texto};
         display:flex; flex-direction:column; align-items:center; padding:44px 72px 48px; }
  .escena { width:1056px; height:340px; border-radius:60px; background:${c.escena}; overflow:hidden; flex:none; }
  .escena img { width:100%; height:100%; object-fit:cover; display:block; }
  .palabra { color:#fff; font-weight:700; font-size:${tamPalabra}px; line-height:1; margin:26px 0 22px; letter-spacing:4px;
             text-shadow:0 8px 0 rgba(0,0,0,.18); }
  .fichas { display:flex; gap:${gapS}px; }
  .silaba { display:flex; flex-direction:column; align-items:center; gap:8px; }
  .cols { display:flex; }
  .col { display:flex; flex-direction:column; align-items:center; gap:10px; }
  .manos { position:relative; width:100%; display:flex; align-items:flex-end; justify-content:center; }
  .mano { display:block; object-fit:contain; position:relative; z-index:2; filter:drop-shadow(0 4px 0 rgba(0,0,0,.18)); }
  .fantasma { position:absolute; bottom:0; z-index:1; filter:grayscale(1); }
  .liga { position:absolute; top:-6px; z-index:3; overflow:visible; }
  .ficha { width:100%; height:240px; border-radius:50px; display:flex; align-items:center; justify-content:center;
           font-weight:700; padding-bottom:10px;
           box-shadow: inset 0 -14px 0 rgba(0,0,0,.10), inset 0 12px 0 rgba(255,255,255,.7), 0 7px 0 rgba(0,0,0,.2); }
                 display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff; line-height:1; }
  .arco { display:block; overflow:visible; }
  .abajo { display:flex; gap:28px; margin-top:22px; width:1056px; flex:1; }
  .panel { position:relative; background:#fff; border-radius:50px; }
  .sena { flex:1; display:flex; align-items:flex-end; justify-content:center; }
  .foto { position:absolute; inset:0; border-radius:50px; overflow:hidden; }
  .foto img { width:100%; height:100%; object-fit:cover; object-position:center top; }
  .dibujo { max-width:94%; max-height:94%; }
  .pendiente { margin:auto; color:#bbb; font-size:44px; text-align:center; font-weight:600; }
  .fila { display:flex; align-items:center; gap:18px; font-weight:700; font-size:40px; }
  .fila b { font-size:110px; line-height:1; min-width:80px; text-align:center; }
  .bolitas { display:flex; gap:8px; flex-wrap:wrap; }
  .bolitas i { width:36px; height:36px; border-radius:50%; display:block; }
  .etiqueta { position:absolute; top:-22px; left:30px; z-index:2; background:${c.acento}; color:#fff; font-weight:700;
              font-size:32px; padding:4px 22px; border-radius:24px; border:5px solid ${c.fondo}; }
  </style></head><body>
    <div class="escena"><img src="${img(t.escena)}"></div>
    <div class="palabra">${esc(t.palabra)}</div>
    <div class="fichas">${columnas}</div>
    <div class="abajo">
      <div class="panel sena"><span class="etiqueta">seña</span>${sena}</div>
    </div>
  </body></html>`;
}
function arcosMini(n) {
  return `<div class="bolitas">${Array.from({ length: n }, () =>
    `<svg width="80" height="50" viewBox="0 0 54 34"><path d="M6 6 C6 36 48 36 48 10" fill="none" stroke="#2B1B5C" stroke-width="6" stroke-linecap="round"/><circle cx="6" cy="6" r="6" fill="#FFD43B" stroke="#C98A00" stroke-width="2.5"/></svg>`).join('')}</div>`;
}

// ---------- REVERSO ----------
// Mezcla determinista (siempre igual para la misma palabra) que nunca deja la palabra en orden.
function mezclar(arr, semilla) {
  let s = [...semilla].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7) >>> 0;
  const r = () => (s = (s * 1103515245 + 12345) >>> 0) / 2 ** 32;
  let out;
  do {
    out = arr.map((x, i) => ({ x, k: r(), i })).sort((a, b) => a.k - b.k);
  } while (out.every((o, i) => o.i === i) && arr.length > 1);
  return out.map((o) => o.x);
}

// Figurita tierna haciendo ejercicio (salto de tijera), coloreada.
function saltarin(color, c) {
  return `<svg width="200" height="250" viewBox="0 0 120 150">
    <g stroke="${c.texto}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M44 58 L18 18 M76 58 L102 18" fill="none" stroke="${color}" stroke-width="16"/>
      <path d="M50 100 L28 140 M70 100 L92 140" fill="none" stroke="${color}" stroke-width="16"/>
      <rect x="38" y="52" width="44" height="56" rx="20" fill="${color}"/>
      <circle cx="60" cy="34" r="22" fill="#F7C9A8"/>
    </g>
    <circle cx="53" cy="33" r="3.5" fill="${c.texto}"/><circle cx="67" cy="33" r="3.5" fill="${c.texto}"/>
    <path d="M54 42 Q60 47 66 42" fill="none" stroke="${c.texto}" stroke-width="3" stroke-linecap="round"/>
    <path d="M8 60 q-6 8 0 16 M112 60 q6 8 0 16" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
  </svg>`;
}

function reverso(t, c) {
  const ls = letrasConSilaba(t.silabas);
  const n = ls.length;
  const col = (i) => c.silabas[ls[i].s % c.silabas.length];
  // 1 TRAZA: palabra punteada sobre renglones de cuaderno.
  const fs1 = Math.min(250, Math.floor(1700 / n));
  const base = 250, xh = fs1 * .5, cap = fs1 * .74;
  const traza = `<svg width="1000" height="290" viewBox="0 0 1000 290">
    <line x1="20" x2="980" y1="${base - cap}" y2="${base - cap}" stroke="#C9C2F2" stroke-width="4"/>
    <line x1="20" x2="980" y1="${base - xh}" y2="${base - xh}" stroke="#C9C2F2" stroke-width="4" stroke-dasharray="16 12"/>
    <line x1="20" x2="980" y1="${base}" y2="${base}" stroke="${c.texto}" stroke-width="5"/>
    <text x="500" y="${base}" text-anchor="middle" font-family="Fredoka" font-weight="600" font-size="${fs1}" letter-spacing="10"
      fill="#EEEAFD" stroke="${c.texto}" stroke-width="5" stroke-dasharray="3 13" stroke-linecap="round">${esc(t.palabra)}</text>
  </svg>`;
  // 2 ORDENA: casillas numeradas + letras revueltas.
  const lado = Math.min(104, Math.floor((1000 - (n - 1) * 12) / n));
  const casillas = ls.map((x, i) => `<div class="casilla" style="width:${lado}px;height:${lado}px;border-color:${col(i)}"><span>${i + 1}</span></div>`).join('');
  const revueltas = mezclar(ls.map((x, i) => i), t.palabra).map((i) =>
    `<div class="pieza" style="width:${lado}px;height:${lado}px;background:${col(i)};font-size:${lado * .7}px">${esc(ls[i].l)}</div>`).join('');
  // 3 COMPLETA: faltan dos letras.
  const faltan = new Set([Math.floor(n / 3), Math.floor((2 * n) / 3)]);
  const completa = ls.map((x, i) => faltan.has(i)
    ? `<div class="hueco" style="width:${lado}px;height:${lado * 1.1}px"></div>`
    : `<div class="pieza" style="width:${lado}px;height:${lado * 1.1}px;background:${col(i)};font-size:${lado * .72}px">${esc(x.l)}</div>`).join('');
  // 4 MUÉVETE: un salto por sílaba.
  const mueve = t.silabas.map((s, i) => `<div class="salto">${saltarin(c.silabas[i % c.silabas.length], c)}<b>${esc(s)}</b></div>`).join('');

  const seccion = (k, titulo, cont, extra = '') => `<div class="sec ${extra}"><div class="tit"><span class="paso">${k}</span>${titulo}</div>${cont}</div>`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FUENTES}
  body { width:${W}px; height:${H}px; background:${c.fondo}; font-family:Fredoka,sans-serif; color:${c.texto};
         display:flex; flex-direction:column; gap:26px; padding:40px 60px; }
  .sec { background:#fff; border-radius:44px; padding:18px 40px 22px; display:flex; flex-direction:column; align-items:center; }
  .tit { align-self:flex-start; display:flex; align-items:center; gap:14px; font-weight:700; font-size:40px; }
  .paso { width:56px; height:56px; border-radius:50%; background:${c.acento}; color:#fff; display:flex; align-items:center; justify-content:center; }
  .fila { display:flex; gap:12px; justify-content:center; }
  .casilla { border:5px dashed; border-radius:22px; position:relative; }
  .casilla span { position:absolute; top:4px; left:10px; font-size:22px; font-weight:700; opacity:.6; }
  .pieza { border-radius:24px; display:flex; align-items:center; justify-content:center; font-weight:700; padding-bottom:6px;
           box-shadow: inset 0 -8px 0 rgba(0,0,0,.10), inset 0 7px 0 rgba(255,255,255,.7), 0 5px 0 rgba(0,0,0,.18); }
  .hueco { border-radius:24px; border:5px dashed ${c.acento}; background:#FFF4FA; }
  .grande { flex:1; }
  .saltos { display:flex; gap:70px; justify-content:center; align-items:flex-end; margin:auto 0; }
  .salto { display:flex; flex-direction:column; align-items:center; gap:4px; }
  .salto b { font-size:72px; line-height:1; }
  </style></head><body>
    ${seccion(1, 'traza', traza)}
    ${seccion(2, 'ordena', `<div class="fila" style="margin:10px 0 18px">${casillas}</div><div class="fila">${revueltas}</div>`)}
    ${seccion(3, 'completa', `<div class="fila" style="margin-top:10px">${completa}</div>`)}
    ${seccion(4, 'muévete', `<div class="saltos">${mueve}</div>`, 'grande')}
  </body></html>`;
}

(async () => {
  const entrada = process.argv[2];
  if (!entrada) { console.error('Uso: node generar.js tarjetas/<palabra>.json'); process.exit(1); }
  const t = JSON.parse(fs.readFileSync(path.join(RAIZ, entrada), 'utf8'));
  if (t.silabas.join('') !== t.palabra) throw new Error('Las sílabas no forman la palabra: ' + t.silabas.join('-'));
  const c = { ...COLORES_BASE, ...(t.colores || {}) };
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  for (const [cara, fn] of [['frente', frente], ['reverso', reverso]]) {
    await page.setContent(fn(t, c));
    await page.evaluate(() => document.fonts.ready);
    const salida = path.join(RAIZ, entrada.replace(/\.json$/, `-${cara}.png`));
    await page.screenshot({ path: salida });
    console.log('Creada:', path.relative(RAIZ, salida));
  }
  await browser.close();
  if (faltantes.size) console.log('Faltan stickers LSM en abecedario/ para:', [...faltantes].join(', '));
})();
