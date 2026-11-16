// Bocas: posición de la boca para pronunciar cada sonido del español (de México).
// Dibujo de frente, tierno y simple: labios, dientes, lengua y pistas (aire, nariz, vibración).
// Es un APOYO VISUAL para cuando Valeria intente el sonido; conviene validarlo con su terapeuta de lenguaje.

// Formas por sonido (visema). w/h = medio ancho/alto de la abertura.
const VISEMAS = {
  a:  { w: 30, h: 24, dientes: 'arriba', lengua: 'abajo' },                 // boca bien abierta
  e:  { w: 36, h: 15, dientes: 'ambos', lengua: 'abajo' },                  // abierta y estirada (sonrisa)
  i:  { w: 40, h: 8, dientes: 'ambos' },                                    // sonrisa, casi cerrada
  o:  { w: 21, h: 21, redonda: 1, lengua: 'abajo' },                        // labios redondos
  u:  { w: 11, h: 11, redonda: 2 },                                         // labios redondos y hacia adelante
  s:  { w: 38, h: 7, dientes: 'juntos', aire: 'frente' },                   // dientes juntos, sale aire (s, z, ce, ci)
  t:  { w: 30, h: 13, dientes: 'arriba', lengua: 'arriba' },                // punta de la lengua detrás de los dientes de arriba
  d:  { w: 30, h: 12, dientes: 'ambos', lengua: 'entre' },                  // lengua asoma entre los dientes, suave
  n:  { w: 30, h: 13, dientes: 'arriba', lengua: 'arriba', nariz: 1 },      // lengua arriba, suena por la nariz
  l:  { w: 30, h: 14, dientes: 'arriba', lengua: 'arriba' },                // lengua arriba, el aire sale por los lados
  r:  { w: 30, h: 14, dientes: 'arriba', lengua: 'arriba', golpe: 1 },      // la lengua da un golpecito
  rr: { w: 30, h: 14, dientes: 'arriba', lengua: 'arriba', vibra: 1 },      // la lengua vibra
  ll: { w: 30, h: 11, dientes: 'ambos', lengua: 'medio' },                  // como "y": la lengua sube al paladar
  ñ:  { w: 30, h: 11, dientes: 'ambos', lengua: 'medio', nariz: 1 },
  ch: { w: 22, h: 10, redonda: 1, dientes: 'juntos', aire: 'frente' },      // labios un poco hacia adelante
  m:  { cerrada: 1, nariz: 1 },                                             // labios juntos, suena por la nariz
  b:  { cerrada: 1 },                                                       // labios juntos (b, v)
  p:  { cerrada: 1, aire: 'frente' },                                       // labios juntos y sale un soplito
  f:  { labioDiente: 1, aire: 'frente' },                                   // dientes de arriba sobre el labio de abajo
  k:  { w: 28, h: 17, dientes: 'arriba', lengua: 'atras' },                 // la parte de atrás de la lengua sube (ca, co, cu, k, qu)
  g:  { w: 28, h: 15, dientes: 'arriba', lengua: 'atras', voz: 1 },         // como k pero con voz (ga, go, gu)
  j:  { w: 28, h: 17, dientes: 'arriba', lengua: 'atras', aire: 'garganta' }, // aire raspado desde atrás (j, ge, gi)
  muda: { muda: 1 },                                                        // no suena (h, u de que/qui/gue/gui)
};

const VOCALES = 'aeiouáéíóú';
const quitaAcento = (l) => ({ á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u' }[l] || l);

// Sonido de la letra i de la palabra, según las letras de alrededor.
function sonido(ls, i) {
  const l = quitaAcento(ls[i].toLowerCase()), sig = (ls[i + 1] || '').toLowerCase(), ant = (ls[i - 1] || '').toLowerCase();
  const sigV = quitaAcento(sig);
  switch (l) {
    case 'a': case 'e': case 'i': case 'o': return l;
    case 'u': return (['q', 'g'].includes(ant) && 'ei'.includes(sigV) && sigV && ls[i] !== 'ü') ? 'muda' : 'u';
    case 'y': return sig && VOCALES.includes(sig) ? 'll' : 'i';
    case 'w': return 'u';
    case 'v': case 'b': return 'b';
    case 'z': case 'x': case 's': return 's';
    case 'c': return sig === 'h' ? 'ch' : ('ei'.includes(sigV) && sigV ? 's' : 'k');
    case 'q': case 'k': return 'k';
    case 'g': return ('ei'.includes(sigV) && sigV) ? 'j' : 'g';
    case 'h': return ant === 'c' ? 'ch' : 'muda';
    case 'l': return sig === 'l' || ant === 'l' ? 'll' : 'l';
    case 'r': return (sig === 'r' || ant === 'r' || i === 0 || 'lns'.includes(ant) && ant) ? 'rr' : 'r';
    default: return VISEMAS[l] ? l : 'muda';
  }
}

// SVG de la boca (viewBox 140 x 100).
function boca(nombre) {
  const v = VISEMAS[nombre] || VISEMAS.muda;
  const LAB = '#EE6F93', LAB2 = '#C9486F', DENTRO = '#5A1630', LEN = '#FF8FAA', BLANCO = '#FFFFFF', PISTA = '#3D8FD1';
  const cx = 70, cy = 50;
  let s = '';
  if (v.muda) {
    s += `<path d="M42 52 Q70 60 98 52" fill="none" stroke="#B9B2CF" stroke-width="9" stroke-linecap="round"/>
          <circle cx="112" cy="26" r="14" fill="none" stroke="#B9B2CF" stroke-width="5"/><line x1="102" y1="36" x2="122" y2="16" stroke="#B9B2CF" stroke-width="5" stroke-linecap="round"/>`;
  } else if (v.cerrada) {
    s += `<ellipse cx="${cx}" cy="${cy}" rx="40" ry="17" fill="${LAB}"/>
          <path d="M32 ${cy} Q70 ${cy + 5} 108 ${cy}" fill="none" stroke="${LAB2}" stroke-width="5" stroke-linecap="round"/>
          <path d="M52 40 Q62 35 70 40 Q78 35 88 40" fill="none" stroke="#fff" stroke-width="3" opacity=".5" stroke-linecap="round"/>`;
  } else if (v.labioDiente) {
    s += `<ellipse cx="${cx}" cy="${cy}" rx="39" ry="17" fill="${LAB}"/>
          <ellipse cx="${cx}" cy="${cy - 4}" rx="30" ry="7" fill="${DENTRO}"/>
          <rect x="48" y="${cy - 9}" width="44" height="15" rx="4" fill="${BLANCO}"/>
          <path d="M59 ${cy - 9} v14 M70 ${cy - 9} v14 M81 ${cy - 9} v14" stroke="#E4DDEE" stroke-width="2"/>`;
  } else {
    const grueso = v.redonda ? 14 : 10;
    const id = 'c' + Math.random().toString(36).slice(2, 8);
    s += `<defs><clipPath id="${id}"><ellipse cx="${cx}" cy="${cy}" rx="${v.w}" ry="${v.h}"/></clipPath></defs>
          <ellipse cx="${cx}" cy="${cy}" rx="${v.w + grueso}" ry="${v.h + grueso - 2}" fill="${LAB}"/>
          <ellipse cx="${cx}" cy="${cy}" rx="${v.w}" ry="${v.h}" fill="${DENTRO}"/>
          <g clip-path="url(#${id})">`;
    const dh = Math.min(8, v.h * .55);
    if (v.dientes === 'arriba' || v.dientes === 'ambos') s += `<rect x="${cx - v.w}" y="${cy - v.h - 1}" width="${2 * v.w}" height="${dh + 1}" fill="${BLANCO}"/>`;
    if (v.dientes === 'ambos') s += `<rect x="${cx - v.w}" y="${cy + v.h - dh}" width="${2 * v.w}" height="${dh + 1}" fill="${BLANCO}"/>`;
    if (v.dientes === 'juntos') s += `<rect x="${cx - v.w}" y="${cy - v.h}" width="${2 * v.w}" height="${2 * v.h}" fill="${BLANCO}"/><line x1="${cx - v.w}" x2="${cx + v.w}" y1="${cy}" y2="${cy}" stroke="#D9D2E6" stroke-width="2"/>`;
    if (v.lengua === 'abajo') s += `<ellipse cx="${cx}" cy="${cy + v.h * .75}" rx="${v.w * .7}" ry="${v.h * .5}" fill="${LEN}"/>`;
    if (v.lengua === 'arriba') s += `<path d="M${cx - v.w * .55} ${cy + v.h + 2} Q${cx - v.w * .3} ${cy - v.h + dh} ${cx} ${cy - v.h + dh} Q${cx + v.w * .3} ${cy - v.h + dh} ${cx + v.w * .55} ${cy + v.h + 2} Z" fill="${LEN}"/>`;
    if (v.lengua === 'medio') s += `<ellipse cx="${cx}" cy="${cy + v.h * .45}" rx="${v.w * .8}" ry="${v.h * .85}" fill="${LEN}"/>`;
    if (v.lengua === 'atras') s += `<ellipse cx="${cx}" cy="${cy + v.h * .9}" rx="${v.w * .6}" ry="${v.h * .45}" fill="${LEN}" opacity=".85"/>`;
    s += `</g>`;
    if (v.lengua === 'entre') s += `<ellipse cx="${cx}" cy="${cy + 1}" rx="${v.w * .5}" ry="6" fill="${LEN}"/>`;
    if (v.lengua === 'atras') s += `<circle cx="${cx}" cy="92" r="5" fill="${PISTA}"/><path d="M${cx} 86 v-6" stroke="${PISTA}" stroke-width="3" stroke-linecap="round"/>`;
  }
  // pistas
  if (v.aire === 'frente') s += `<g fill="none" stroke="${PISTA}" stroke-width="4" stroke-linecap="round"><path d="M114 38 q6 -4 12 0"/><path d="M116 50 q6 -4 12 0"/><path d="M114 62 q6 -4 12 0"/></g>`;
  if (v.aire === 'garganta') s += `<g fill="none" stroke="${PISTA}" stroke-width="4" stroke-linecap="round"><path d="M112 70 q6 -6 12 0"/><path d="M112 82 q6 -6 12 0"/></g>`;
  if (v.nariz) s += `<g fill="none" stroke="${PISTA}" stroke-width="4" stroke-linecap="round"><path d="M56 12 q4 -5 8 0 q4 5 8 0 q4 -5 8 0"/></g>`;
  if (v.vibra) s += `<path d="M112 34 l6 6 -6 6 6 6 -6 6 6 6" fill="none" stroke="${PISTA}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (v.golpe) s += `<path d="M114 44 l8 -6 M114 50 h10" stroke="${PISTA}" stroke-width="4" stroke-linecap="round"/>`;
  if (v.voz) s += `<path d="M58 92 q4 -5 8 0 q4 5 8 0 q4 -5 8 0" fill="none" stroke="${PISTA}" stroke-width="4" stroke-linecap="round"/>`;
  return `<svg viewBox="20 6 116 90" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">${s}</svg>`;
}

module.exports = { sonido, boca, VISEMAS };
