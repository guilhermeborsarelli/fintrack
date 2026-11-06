// Home Tender — ilustrações em SVG no estilo aquarela dos cardápios impressos:
// copo de vidro com traço fino e reflexos, líquido em aguada com granulação de pigmento
// e borda escurecida, e uma mancha de tinta na base. Os filtros ficam em artDefs(),
// inseridos uma única vez no documento.

let uid = 0;

const LINE = '#6e655c';      // traço do vidro
const LINE_SOFT = '#9a9087';
const GARNISH_LINE = '#6a5646';

// viewBox 0 0 120 170 — o pé dos copos fica em y≈158
const G = {
  coupe: {
    outline: 'M20 48 C22 78 44 85 60 85 C76 85 98 78 100 48',
    interior: 'M21 48 L99 48 C97 77 76 84 60 84 C44 84 23 77 21 48 Z',
    stem: 'M57.5 85 C58 100 58 130 57 150 L63 150 C62 130 62 100 62.5 85 Z', foot: [60, 152.5, 23, 4.2],
    rim: [20, 48, 100], level: 54, bottom: 84, cherry: [60, 76], olive: [60, 74]
  },
  martini: {
    outline: 'M14 38 L60 98 L106 38',
    interior: 'M15 38 L105 38 L60 97 Z',
    stem: 'M58.5 97 L58 152 L62 152 L61.5 97 Z', foot: [60, 154.5, 23, 4.2],
    rim: [14, 38, 106], level: 44, bottom: 97, cherry: [60, 86], olive: [60, 82]
  },
  rocks: {
    outline: 'M26 80 L31 155 Q31 158 35 158 L85 158 Q89 158 89 155 L94 80',
    interior: 'M28 82 L92 82 L88.4 141 L31.6 141 Z', heavy: [31.4, 141, 88.6, 157.5],
    rim: [26, 80, 94], level: 96, bottom: 141, cherry: [46, 102], olive: [60, 118]
  },
  highball: {
    outline: 'M35 28 L37 155 Q37 158 41 158 L79 158 Q83 158 83 155 L85 28',
    interior: 'M36 30 L84 30 L82.2 147 L37.8 147 Z', heavy: [37.6, 147, 82.4, 157.5],
    rim: [35, 28, 85], level: 42, bottom: 147, cherry: [50, 48], olive: [60, 120]
  },
  collins: {
    outline: 'M39 16 L40 155 Q40 158 44 158 L76 158 Q80 158 80 155 L81 16',
    interior: 'M40 18 L80 18 L79.2 147 L40.8 147 Z', heavy: [40.6, 147, 79.4, 157.5],
    rim: [39, 16, 81], level: 30, bottom: 147, cherry: [52, 36], olive: [60, 120]
  },
  flute: {
    outline: 'M45 20 C45 70 49 100 60 105 C71 100 75 70 75 20',
    interior: 'M46 20 L74 20 C74 70 70 99 60 104 C50 99 46 70 46 20 Z',
    stem: 'M58.5 104 L58 151 L62 151 L61.5 104 Z', foot: [60, 154, 19, 4],
    rim: [45, 20, 75], level: 30, bottom: 104, cherry: [60, 94], olive: [60, 90]
  },
  wine: {
    outline: 'M38 32 C29 56 26 84 39 96 C47 104 73 104 81 96 C94 84 91 56 82 32',
    interior: 'M39 33 L81 33 C90 56 92 83 80 95 C72 103 48 103 40 95 C28 83 30 56 39 33 Z',
    stem: 'M58.5 102 L58 151 L62 151 L61.5 102 Z', foot: [60, 154, 23, 4.2],
    rim: [38, 32, 82], level: 54, bottom: 102, cherry: [52, 70], olive: [60, 80]
  },
  mug: {
    outline: 'M30 56 L32 154 Q32 158 36 158 L80 158 Q84 158 84 154 L86 56',
    interior: 'M31 56 L85 56 L83 156 L33 156 Z', metal: ['#d9955f', '#a8613a', '#6f3a20'],
    handle: 'M85 70 C106 70 106 122 84 124 M85 78 C98 80 98 114 84 116',
    rim: [30, 56, 86], level: 60, bottom: 156, cherry: [50, 62], olive: [60, 70]
  },
  tiki: {
    outline: 'M33 30 L35 154 Q35 158 40 158 L80 158 Q85 158 85 154 L87 30',
    interior: 'M34 30 L86 30 L84 156 L36 156 Z', metal: ['#b98a5c', '#8c5e3a', '#5a3a22'],
    carve: 'M42 62 L54 62 L54 72 L42 72 Z M66 62 L78 62 L78 72 L66 72 Z M44 56 L56 58 M64 58 L76 56 M57 78 L60 96 L63 78 M44 108 L76 108 L76 122 L44 122 Z M44 115 L76 115 M50 108 L50 122 M57 108 L57 122 M63 108 L63 122 M70 108 L70 122 M36 134 L84 134 M36 138 L84 138',
    rim: [33, 30, 87], level: 34, bottom: 156, cherry: [50, 36], olive: [60, 50]
  },
  irish: {
    outline: 'M35 26 L40 103 Q41 110 48 110 L72 110 Q79 110 80 103 L85 26',
    interior: 'M36 28 L84 28 L79 103 Q78 108 72 108 L48 108 Q42 108 41 103 Z',
    handle: 'M82 42 C102 44 102 86 80 88 M82 50 C94 52 94 80 81 82',
    stem: 'M58 110 L57.5 144 L62.5 144 L62 110 Z', foot: [60, 147, 22, 4],
    rim: [35, 26, 85], level: 36, bottom: 108, cherry: [52, 40], olive: [60, 60]
  },
  julep: {
    outline: 'M33 48 L37 154 Q37 158 41 158 L79 158 Q83 158 83 154 L87 48',
    interior: 'M34 48 L86 48 L82 156 L38 156 Z', metal: ['#eceae4', '#b9b7b0', '#7e7c76'], frost: true,
    rim: [33, 48, 87], level: 50, bottom: 156, cherry: [50, 50], olive: [60, 60]
  },
  hurricane: {
    outline: 'M38 20 C33 38 33 56 44 70 C51 80 40 96 40 114 C40 128 50 135 60 135 C70 135 80 128 80 114 C80 96 69 80 76 70 C87 56 87 38 82 20',
    interior: 'M39 21 L81 21 C86 38 86 55 75 69 C67 80 79 96 79 114 C79 127 70 134 60 134 C50 134 41 127 41 114 C41 96 53 80 45 69 C34 55 34 38 39 21 Z',
    stem: 'M58.5 134 L58 151 L62 151 L61.5 134 Z', foot: [60, 154, 20, 4],
    rim: [38, 20, 82], level: 28, bottom: 134, cherry: [60, 30], olive: [60, 60]
  }
};

const CITRUS = {
  lemon: {peel: '#e8c94a', flesh: '#f6e7a2', pith: '#fbf5dc'},
  lime: {peel: '#7f9c45', flesh: '#d5e19a', pith: '#f1f4dc'},
  orange: {peel: '#e08a2c', flesh: '#f4b866', pith: '#fbecd2'}
};

const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const f1 = n => (Math.round(n * 10) / 10).toString();

function rgb(hex) { const n = parseInt(hex.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
/** Mistura duas cores hex (t = 0 → a, t = 1 → b). */
export function mix(a, b, t) {
  const x = rgb(a), y = rgb(b);
  return '#' + x.map((v, k) => Math.round(v + (y[k] - v) * t).toString(16).padStart(2, '0')).join('');
}

function seeded(seed) {
  let s = 0; for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

/** Filtros de aquarela compartilhados por todas as ilustrações (inserir uma vez no <body>). */
export function artDefs() {
  return `<svg width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false"><defs>
  <filter id="wc-paint" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="3" seed="4" result="warp"/>
    <feDisplacementMap in="SourceGraphic" in2="warp" scale="3.6" xChannelSelector="R" yChannelSelector="G" result="wob"/>
    <feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="3" seed="11" result="grain"/>
    <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 1.42" result="grainA"/>
    <feComposite in="wob" in2="grainA" operator="in" result="tex"/>
    <feMorphology in="wob" operator="erode" radius="1.3" result="inner"/>
    <feComposite in="wob" in2="inner" operator="out" result="edge"/>
    <feGaussianBlur in="edge" stdDeviation=".7" result="edgeSoft"/>
    <feColorMatrix in="edgeSoft" type="matrix" values=".55 0 0 0 0  0 .5 0 0 0  0 0 .45 0 0  0 0 0 .5 0" result="edgeDark"/>
    <feMerge><feMergeNode in="tex"/><feMergeNode in="edgeDark"/></feMerge>
  </filter>
  <filter id="wc-soft" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency=".07" numOctaves="2" seed="5" result="warp"/>
    <feDisplacementMap in="SourceGraphic" in2="warp" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="wob"/>
    <feTurbulence type="fractalNoise" baseFrequency=".12" numOctaves="2" seed="3" result="grain"/>
    <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -.6 1.3" result="grainA"/>
    <feComposite in="wob" in2="grainA" operator="in"/>
  </filter>
  <filter id="wc-wash" filterUnits="userSpaceOnUse" x="-20" y="-20" width="160" height="220" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency=".022 .05" numOctaves="3" seed="2" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="18" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feGaussianBlur in="d" stdDeviation="2.4" result="b"/>
    <feTurbulence type="fractalNoise" baseFrequency=".08" numOctaves="3" seed="9" result="g"/>
    <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.2 1.4" result="ga"/>
    <feComposite in="b" in2="ga" operator="in"/>
  </filter>
  <filter id="wc-line" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="7" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="1.3" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
</defs></svg>`;
}

// ── Guarnições ──
function wheel(x, y, r, kind, rot = 0) {
  const c = CITRUS[kind];
  const seg = [...Array(8)].map((_, k) => {
    const a = (k * Math.PI) / 4 + .2;
    return `M${x} ${y} L${f1(x + Math.cos(a) * (r - 2.6))} ${f1(y + Math.sin(a) * (r - 2.6))}`;
  }).join(' ');
  return `<g transform="rotate(${rot} ${x} ${y})"><circle cx="${x}" cy="${y}" r="${r}" fill="${c.peel}" stroke="${mix(c.peel, '#3b2a1a', .35)}" stroke-width=".6"/>`
    + `<circle cx="${x}" cy="${y}" r="${r - 1.6}" fill="${c.pith}"/><circle cx="${x}" cy="${y}" r="${r - 2.4}" fill="${c.flesh}"/>`
    + `<path d="${seg}" stroke="${c.pith}" stroke-width=".9"/><circle cx="${x}" cy="${y}" r="1.1" fill="${c.pith}"/>`
    + `<path d="M${x} ${y + r} L${x} ${y + 2}" stroke="${mix(c.peel, '#3b2a1a', .3)}" stroke-width=".8"/></g>`;
}

function wedge(x, y, kind) {
  const c = CITRUS[kind];
  return `<g transform="rotate(-25 ${x} ${y})"><path d="M${x - 11} ${y} A11 11 0 0 0 ${x + 11} ${y} Z" fill="${c.peel}" stroke="${mix(c.peel, '#3b2a1a', .35)}" stroke-width=".6"/>`
    + `<path d="M${x - 9.4} ${y} A9.4 9.4 0 0 0 ${x + 9.4} ${y} Z" fill="${c.pith}"/><path d="M${x - 8.6} ${y} A8.6 8.6 0 0 0 ${x + 8.6} ${y} Z" fill="${c.flesh}"/>`
    + `<path d="M${x} ${y} L${x - 6} ${y + 6} M${x} ${y} L${x} ${y + 8.5} M${x} ${y} L${x + 6} ${y + 6}" stroke="${c.pith}" stroke-width=".9"/></g>`;
}

function twist(x, y, kind) {
  const c = CITRUS[kind];
  const d = `M${x - 6} ${y - 3} c5 -10 15 -8 13 0 c-2 6 -11 5 -9 12 c2 6 10 5 11 11`;
  return `<path d="${d}" fill="none" stroke="${mix(c.peel, '#3b2a1a', .35)}" stroke-width="4.2" stroke-linecap="round"/>`
    + `<path d="${d}" fill="none" stroke="${c.peel}" stroke-width="3" stroke-linecap="round"/>`
    + `<path d="${d}" fill="none" stroke="${mix(c.peel, '#ffffff', .45)}" stroke-width=".9" stroke-linecap="round" transform="translate(-.6 -.6)"/>`;
}

function leaves(x, y, color, n = 5, size = 1) {
  const out = [];
  for (let k = 0; k < n; k++) {
    const a = -90 + (k - (n - 1) / 2) * 28;
    const lx = x + Math.cos((a * Math.PI) / 180) * 7 * size;
    const ly = y + Math.sin((a * Math.PI) / 180) * 7 * size;
    const shade = mix(color, k % 2 ? '#2f4220' : '#c9d79a', .25);
    out.push(`<ellipse cx="${f1(lx)}" cy="${f1(ly)}" rx="${f1(3.4 * size)}" ry="${f1(6.5 * size)}" transform="rotate(${a + 90} ${f1(lx)} ${f1(ly)})" fill="${shade}" stroke="${mix(color, '#1d2a14', .45)}" stroke-width=".5"/>`);
    out.push(`<path d="M${x} ${y} L${f1(lx)} ${f1(ly)}" stroke="${mix(color, '#1d2a14', .4)}" stroke-width=".45" opacity=".7"/>`);
  }
  return `<path d="M${x} ${y} L${x} ${y + 14 * size}" stroke="#55703f" stroke-width="1.4"/>` + out.join('');
}

function cherry(x, y) {
  return `<path d="M${x} ${y - 3} C${x + 1} ${y - 12} ${x + 6} ${y - 18} ${x + 10} ${y - 20}" fill="none" stroke="#5a3b22" stroke-width=".9"/>`
    + `<circle cx="${x}" cy="${y}" r="4.8" fill="#9b1c22" stroke="#5e0f14" stroke-width=".6"/><circle cx="${x + 1}" cy="${y + 1.2}" r="2.6" fill="#6f1016" opacity=".6"/><circle cx="${x - 1.6}" cy="${y - 1.7}" r="1.3" fill="#fff6ef" opacity=".85"/>`;
}

function garnishes(drink, g, rnd) {
  const [L, Y, R] = g.rim;
  const out = [];
  for (const kind of drink.garnish || []) {
    if (kind === 'cherry') {
      const [cx, cy] = g.cherry; out.push(cherry(cx, cy));
    } else if (kind === 'olive') {
      const [ox, oy] = g.olive;
      out.push(`<path d="M${R - 6} ${Y - 16} L${ox - 2} ${oy + 4}" stroke="#8a6a44" stroke-width="1.2" stroke-linecap="round"/>`
        + `<ellipse cx="${ox}" cy="${oy}" rx="5" ry="6.5" transform="rotate(-35 ${ox} ${oy})" fill="#97a24f" stroke="#5c6428" stroke-width=".6"/><ellipse cx="${ox - 1.4}" cy="${oy - 1}" rx="1.6" ry="2.6" transform="rotate(-35 ${ox} ${oy})" fill="#d3d98f" opacity=".7"/><circle cx="${ox + 1.5}" cy="${oy - 2.4}" r="1.6" fill="#b5452f"/>`);
    } else if (kind.endsWith('_wheel')) {
      out.push(wheel(R - 3, Y - 5, 11, kind.split('_')[0], 15));
    } else if (kind.endsWith('_wedge')) {
      out.push(wedge(R - 4, Y - 1, kind.split('_')[0]));
    } else if (kind.endsWith('_twist')) {
      out.push(twist(R - 2, Y - 2, kind.split('_')[0]));
    } else if (kind === 'lemon_peel_long') {
      const top = Y + 4, bot = Math.min(g.bottom - 6, Y + 100);
      let d = `M${R - 6} ${Y - 4} Q${R - 2} ${top} ${R - 8} ${top + 4}`;
      let x = R - 8; let side = -1;
      for (let yy = top + 12; yy < bot; yy += 12) { const nx = side < 0 ? L + 10 : R - 10; d += ` Q${(x + nx) / 2} ${yy - 2} ${nx} ${yy}`; x = nx; side *= -1; }
      out.push(`<path d="${d}" fill="none" stroke="#b08a2a" stroke-width="3.4" stroke-linecap="round" opacity=".8"/><path d="${d}" fill="none" stroke="${CITRUS.lemon.peel}" stroke-width="2.3" stroke-linecap="round"/>`);
    } else if (kind === 'mint') {
      out.push(leaves(L + (R - L) * 0.32, Y - 9, '#6f9a52', 5));
    } else if (kind === 'basil') {
      out.push(leaves(L + (R - L) * 0.35, Y - 10, '#5a8a3c', 4, 1.25));
    } else if (kind === 'berries') {
      const bx = L + 14, by = Y - 4;
      for (const [dx, dy] of [[0, 0], [6, -2], [3, -7]]) out.push(`<circle cx="${bx + dx}" cy="${by + dy}" r="4" fill="#4b1734" stroke="#2a0b1c" stroke-width=".5"/><circle cx="${bx + dx - 1.2}" cy="${by + dy - 1.2}" r="1" fill="#f3dbe6" opacity=".7"/>`);
    } else if (kind === 'pineapple') {
      const px = R - 4, py = Y - 6;
      out.push(`<path d="M${px - 12} ${py + 6} L${px} ${py - 10} L${px + 12} ${py + 6} Z" fill="#efcf63" stroke="#a7822c" stroke-width=".6"/>`
        + `<path d="M${px - 12} ${py + 6} L${px + 12} ${py + 6}" stroke="#c49a3a" stroke-width="2"/>`
        + `<path d="M${px} ${py - 10} L${px - 6} ${py - 24} M${px} ${py - 10} L${px} ${py - 27} M${px} ${py - 10} L${px + 7} ${py - 23}" stroke="#55703f" stroke-width="2.4" stroke-linecap="round"/>`);
    } else if (kind === 'celery') {
      out.push(`<path d="M${R - 12} ${g.bottom - 10} L${R - 2} ${Y - 30}" stroke="#7f9a55" stroke-width="5.4" stroke-linecap="round"/><path d="M${R - 12.6} ${g.bottom - 10} L${R - 2.6} ${Y - 30}" stroke="#c3d494" stroke-width="2" stroke-linecap="round"/>`
        + leaves(R - 2, Y - 30, '#7f9c5a', 4, 0.9));
    } else if (kind === 'nutmeg') {
      for (let k = 0; k < 16; k++) out.push(`<circle cx="${f1(L + 18 + rnd() * (R - L - 36))}" cy="${f1(g.level + .5 + rnd() * 3)}" r=".75" fill="#7a4e2c" opacity=".85"/>`);
    } else if (kind === 'coffee_beans') {
      const cx = (L + R) / 2;
      for (const dx of [-7, 0, 7]) out.push(`<ellipse cx="${cx + dx}" cy="${g.level + 1.6}" rx="2.7" ry="1.9" fill="#3d2414"/><path d="M${cx + dx - 2} ${g.level + 1.6} Q${cx + dx} ${g.level + 1} ${cx + dx + 2} ${g.level + 1.6}" stroke="#a0754e" stroke-width=".45" fill="none"/>`);
    } else if (kind === 'bitters_drops') {
      const cx = (L + R) / 2;
      for (const dx of [-10, 0, 10]) out.push(`<ellipse cx="${cx + dx}" cy="${g.level + 2.2}" rx="1.9" ry="1.1" fill="#8e2a1e" opacity=".85"/>`);
    }
  }
  return out.join('');
}

// ── Gelo ──
const cube = (x, y, s, rot, rnd) => {
  const cx = f1(x + s / 2), cy = f1(y + s / 2);
  return `<g transform="rotate(${rot} ${cx} ${cy})"><rect x="${f1(x)}" y="${f1(y)}" width="${f1(s)}" height="${f1(s)}" rx="3" fill="#ffffff" fill-opacity=".38" stroke="#ffffff" stroke-opacity=".9" stroke-width=".9"/>`
    + `<path d="M${f1(x + 3)} ${f1(y + s - 4)} L${f1(x + 3)} ${f1(y + 4)} L${f1(x + s * .55)} ${f1(y + 3)}" stroke="#ffffff" stroke-width="1.2" fill="none" opacity=".85" stroke-linecap="round"/>`
    + `<path d="M${f1(x + s - 2)} ${f1(y + 4 + rnd() * 3)} L${f1(x + s - 3)} ${f1(y + s - 3)}" stroke="#7d8c96" stroke-width=".5" opacity=".45"/></g>`;
};

function ice(drink, g, rnd) {
  const [L, , R] = g.rim;
  const out = [];
  if (drink.serve === 'rocks') {
    const n = g.rim[1] < 40 ? 4 : 3;
    for (let k = 0; k < n; k++) {
      const s = 15 + rnd() * 4;
      const x = L + 9 + (k % 2) * ((R - L) / 2 - 6) + rnd() * 4;
      const y = g.level - 7 + Math.floor(k / 2) * 18 + k * 2;
      out.push(cube(x, y, s, f1(rnd() * 30 - 15), rnd));
    }
  } else if (drink.serve === 'big') {
    const s = Math.min(36, R - L - 22);
    out.push(cube((L + R) / 2 - s / 2, g.level - 7, s, -6, rnd));
  } else if (drink.serve === 'crushed') {
    for (let k = 0; k < 28; k++) {
      const x = L + 6 + rnd() * (R - L - 12), y = g.level + rnd() * (g.bottom - g.level - 6), r = 2 + rnd() * 3;
      out.push(`<path d="M${f1(x)} ${f1(y - r)} l${f1(r)} ${f1(r * .7)} l${f1(-r * .4)} ${f1(r)} l${f1(-r)} ${f1(-r * .3)} Z" fill="#ffffff" fill-opacity=".5" stroke="#ffffff" stroke-width=".5"/>`);
    }
  }
  return out.join('');
}

function dome(g, rnd) {
  const [L, Y, R] = g.rim;
  const out = [`<path d="M${L + 2} ${Y} C${L + 8} ${Y - 16} ${R - 8} ${Y - 16} ${R - 2} ${Y} Z" fill="#f7f8f6" stroke="#b9c2c6" stroke-width=".6"/>`];
  for (let k = 0; k < 18; k++) {
    const x = L + 8 + rnd() * (R - L - 16), y = Y - 2 - rnd() * 9;
    out.push(`<path d="M${f1(x)} ${f1(y)} l2.4 1.6 l-1 2.4 l-2.4 -.8 Z" fill="#e2e8ea" stroke="#aeb9be" stroke-width=".35"/>`);
  }
  return out.join('');
}

/** Mancha de aquarela que "assenta" o copo no papel. */
function wash(drink, g, rnd) {
  const [L, Y, R] = g.rim;
  const side = rnd() < .5 ? -1 : 1;
  const tint = mix(drink.color || '#c9a27a', '#c9a27a', .55);
  return `<g filter="url(#wc-wash)" opacity=".6">`
    + `<ellipse cx="${60 + side * 6}" cy="158" rx="${f1(Math.min(46, (R - L) / 2 + 16))}" ry="6.5" fill="#c9a27a" opacity=".6"/>`
    + `<ellipse cx="${60 + side * 9}" cy="${f1((Y + g.bottom) / 2 + 8)}" rx="${f1(Math.min(36, (R - L) / 2))}" ry="${f1((g.bottom - Y) / 2.4)}" fill="${tint}" opacity=".24"/>`
    + `</g>`;
}

/** Desenho completo do drink, em aquarela. */
export function drinkSVG(drink, {size = 120, title = true, crop = true, empty = false} = {}) {
  const g = G[drink.glass] || G.coupe;
  const id = `bn${++uid}`;
  const rnd = seeded(drink.id);
  const [L, Y, R] = g.rim;
  const base = drink.color || '#d8b46a';
  const top = mix(base, '#ffffff', .28);
  const bottom = drink.layerTop || !drink.color2 ? mix(base, '#2a1a10', .14) : drink.color2;
  const level = g.level;

  const defs = `<defs>
    <clipPath id="${id}c"><path d="${g.interior}"/></clipPath>
    <linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset=".45" stop-color="${base}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>
    <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".35"/><stop offset=".35" stop-color="#ffffff" stop-opacity="0"/><stop offset=".8" stop-color="#2a1a10" stop-opacity="0"/><stop offset="1" stop-color="#2a1a10" stop-opacity=".22"/></linearGradient>
    ${g.metal ? `<linearGradient id="${id}m" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${g.metal[1]}"/><stop offset=".22" stop-color="${g.metal[0]}"/><stop offset=".55" stop-color="${g.metal[1]}"/><stop offset="1" stop-color="${g.metal[2]}"/></linearGradient>` : ''}
  </defs>`;

  // Vidro: leve tom azulado por trás do líquido
  let glassBack = '';
  if (!g.metal) glassBack = `<path d="${g.interior}" fill="#dfe8ec" opacity=".35"/>`;

  let liquid = '';
  if (!g.metal && !empty) {
    liquid += `<g clip-path="url(#${id}c)"><g filter="url(#wc-paint)">`;
    liquid += `<rect x="0" y="${level}" width="120" height="${170 - level}" fill="url(#${id}g)" class="liquid"/>`;
    if (drink.layerTop && drink.color2) liquid += `<rect x="0" y="${level}" width="120" height="${drink.layerH || 9}" fill="${drink.color2}" class="liquid"/>`;
    if (drink.foam) {
      const fc = drink.foamColor || '#f6efdf';
      liquid += `<rect x="0" y="${level - 1}" width="120" height="${drink.id === 'ramos-fizz' ? 16 : 6.5}" fill="${fc}"/>`;
    }
    liquid += `</g>`;
    liquid += `<rect x="0" y="${level}" width="120" height="${170 - level}" fill="url(#${id}s)"/>`;
    if (drink.foam) for (let k = 0; k < 22; k++) liquid += `<circle cx="${f1(L + 6 + rnd() * (R - L - 12))}" cy="${f1(level + rnd() * 5)}" r="${f1(.4 + rnd() * .7)}" fill="#c7b38f" opacity=".55"/>`;
    liquid += ice(drink, g, rnd);
    if (drink.bubbles) for (let k = 0; k < 16; k++) liquid += `<circle cx="${f1(L + 8 + rnd() * (R - L - 16))}" cy="${f1(level + 6 + rnd() * (g.bottom - level - 10))}" r="${f1(0.6 + rnd() * 1.1)}" fill="none" stroke="#ffffff" stroke-width=".6" opacity=".9"/>`;
    liquid += `<path d="M${L} ${level} L${R} ${level}" stroke="#ffffff" stroke-width=".8" opacity=".55"/>`;
    liquid += `</g>`;
  }

  // Corpos opacos (cobre, cerâmica, prata)
  let body = '';
  if (g.metal) {
    body += `<g filter="url(#wc-soft)"><path d="${g.interior}" fill="url(#${id}m)"/></g>`;
    if (g.frost) for (let k = 0; k < 46; k++) body += `<circle cx="${f1(L + 4 + rnd() * (R - L - 8))}" cy="${f1(Y + 4 + rnd() * 100)}" r=".8" fill="#ffffff" opacity=".8"/>`;
    if (drink.glass === 'mug') for (let k = 0; k < 24; k++) body += `<circle cx="${f1(L + 6 + rnd() * (R - L - 12))}" cy="${f1(Y + 8 + rnd() * 90)}" r="1.7" fill="#f3c49a" opacity=".35"/>`;
    body += `<path d="M${L + 7} ${Y + 6} L${L + 9} ${g.bottom - 8}" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" opacity=".45"/>`;
    if (!empty) body += `<ellipse cx="${(L + R) / 2}" cy="${Y}" rx="${(R - L) / 2 - 1}" ry="3" fill="${base}" stroke="${mix(g.metal[2], '#000000', .2)}" stroke-width=".7"/>`;
    if (g.carve) body += `<path d="${g.carve}" fill="none" stroke="#3a2416" stroke-width="1.2" stroke-linejoin="round" opacity=".85"/>`;
  }

  // Fundo grosso e lapidado dos copos baixos e altos
  let heavy = '';
  if (g.heavy) {
    const [hx1, hy1, hx2, hy2] = g.heavy;
    heavy += `<path d="M${hx1} ${hy1} L${hx2} ${hy1} L${hx2 - .3} ${hy2} L${hx1 + .3} ${hy2} Z" fill="#dfe8ec" opacity=".75"/>`;
    for (let x = hx1 + 5; x < hx2 - 2; x += 7) heavy += `<path d="M${f1(x)} ${hy1 + 1.5} L${f1(x + .6)} ${hy2 - 1}" stroke="#a9b6bc" stroke-width=".6" opacity=".8"/>`;
    heavy += `<path d="M${hx1 + 2} ${hy1 + 2} L${hx2 - 2} ${hy1 + 2}" stroke="#ffffff" stroke-width="1" opacity=".8"/>`;
  }

  const highlight = `<path d="M${L + 6} ${Y + 6} L${L + 9} ${Math.min(g.bottom - 8, Y + 64)}" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity=".85"/>`
    + `<path d="M${L + 11} ${Y + 8} L${L + 12.5} ${Math.min(g.bottom - 14, Y + 30)}" stroke="#ffffff" stroke-width=".9" stroke-linecap="round" opacity=".7"/>`
    + `<path d="M${R - 6} ${Y + 10} L${R - 7.5} ${Math.min(g.bottom - 10, Y + 44)}" stroke="#ffffff" stroke-width=".9" stroke-linecap="round" opacity=".5"/>`;
  const straw = drink.straw ? `<path d="M${f1(L + (R - L) * 0.62)} ${g.bottom - 14} L${R + 6} ${Y - 26}" stroke="#8e7f70" stroke-width="3.6" stroke-linecap="round"/><path d="M${f1(L + (R - L) * 0.62)} ${g.bottom - 14} L${R + 6} ${Y - 26}" stroke="#f7f1e6" stroke-width="2.4" stroke-linecap="round"/>` : '';
  const rimDots = drink.rim ? [...Array(20)].map((_, k) => `<circle cx="${f1(L + 2 + (k * (R - L - 4)) / 19)}" cy="${f1(Y - .6 + (k % 2) * 1.4)}" r="1.4" fill="${drink.rim === 'salt' ? '#ffffff' : '#f4e6c4'}" stroke="#b7aa95" stroke-width=".3"/>`).join('') : '';
  const crushedDome = !empty && drink.serve === 'crushed' && ['julep', 'tiki', 'rocks', 'collins', 'hurricane'].includes(drink.glass) ? dome(g, rnd) : '';
  const glassLines = `<g filter="url(#wc-line)">`
    + (g.stem ? `<path d="${g.stem}" fill="#e6eef1" stroke="${LINE}" stroke-width=".8"/><path d="M59.4 ${Y + 60} L59.2 ${g.foot[1] - 4}" stroke="#ffffff" stroke-width=".8" opacity=".9"/>` : '')
    + (g.foot ? `<ellipse cx="${g.foot[0]}" cy="${g.foot[1]}" rx="${g.foot[2]}" ry="${g.foot[3]}" fill="#e6eef1" fill-opacity=".8" stroke="${LINE}" stroke-width="1"/><path d="M${g.foot[0] - g.foot[2] + 4} ${g.foot[1] - 1} Q${g.foot[0]} ${g.foot[1] - 3.4} ${g.foot[0] + g.foot[2] - 4} ${g.foot[1] - 1}" stroke="#ffffff" stroke-width=".8" fill="none"/>` : '')
    + `<path d="${g.outline}" fill="none" stroke="${LINE}" stroke-width="1.15" stroke-linejoin="round" stroke-linecap="round"/>`
    + `<ellipse cx="${(L + R) / 2}" cy="${Y}" rx="${(R - L) / 2}" ry="${g.metal ? 3 : 2.2}" fill="none" stroke="${LINE_SOFT}" stroke-width=".8"/>`
    + (g.handle ? `<path d="${g.handle}" fill="none" stroke="${g.metal ? mix(g.metal[2], '#000000', .1) : LINE}" stroke-width="${g.metal ? 2.6 : 1.2}" stroke-linecap="round"/>` : '')
    + `</g>`;
  const vbTop = crop ? Math.max(0, Y - 48) : 0;
  const label = title ? `<title>${esc(drink.name)}</title>` : '';
  return `<svg class="drink-art" viewBox="0 ${vbTop} 120 ${170 - vbTop}" width="${size}" height="${Math.round(size * (170 - vbTop) / 120)}" role="img" aria-label="Ilustração: ${esc(drink.name)}" xmlns="http://www.w3.org/2000/svg">${label}${defs}${wash(drink, g, rnd)}${glassBack}${body}${liquid}${heavy}${crushedDome}${straw}${highlight}${glassLines}${rimDots}<g filter="url(#wc-soft)">${garnishes(drink, g, rnd)}</g></svg>`;
}

/** Copo vazio (para o glossário). */
export function glassSVG(glassId, size = 90) {
  return drinkSVG({id: `glass-${glassId}`, name: glassId, glass: glassId, color: '#e9e4d6', serve: 'neat', garnish: []}, {size, title: false, empty: true});
}

// Ícones dos utensílios (traço fino, 48×48)
const TOOL_PATHS = {
  coqueteleira: 'M17 8 h14 v4 h-14 z M15 12 h18 l-2 6 h-14 z M17 18 h14 l3 24 h-20 z M22 4 h4 v4 h-4 z',
  dosador: 'M14 6 h20 l-8 17 h-4 z M22 23 h4 l8 19 h-20 z',
  hawthorne: 'M10 18 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 M14 18 a10 10 0 1 0 20 0 M38 18 h8 v4 h-8 M12 28 c3 4 6 4 9 0 c3 4 6 4 9 0 c3 4 6 4 9 0',
  peneira: 'M8 12 h26 a13 13 0 0 1 -26 0 z M34 14 h10 v3 h-10 M14 18 l14 0 M15 22 l12 0 M18 26 l6 0 M14 12 l7 13 M21 12 l0 14 M28 12 l-6 13',
  misturador: 'M12 8 h24 l-2 34 h-20 z M12 14 h24 M14 42 h20 M33 8 l4 -3',
  bailarina: 'M24 2 l0 4 M22 6 c4 2 -4 4 0 6 c4 2 -4 4 0 6 c4 2 -4 4 0 6 c4 2 -4 4 0 6 c4 2 -4 4 0 6 M22 36 l2 4 l2 -4 M20 40 a4 3 0 1 0 8 0 a4 3 0 1 0 -8 0',
  julep_strainer: 'M8 18 a14 12 0 1 0 28 0 a14 12 0 1 0 -28 0 M36 18 l10 -4 M15 15 h.1 M21 13 h.1 M27 15 h.1 M18 21 h.1 M24 21 h.1 M30 21 h.1 M21 26 h.1 M27 26 h.1',
  socador: 'M20 4 h8 v6 h-8 z M21 10 h6 l1 26 h-8 z M18 36 h12 v7 h-12 z',
  espremedor: 'M8 24 h32 l-4 14 h-24 z M14 24 c0 -12 20 -12 20 0 M24 12 l0 -6 M40 28 l6 -2',
  descascador: 'M24 4 l0 18 M18 22 h12 v20 h-12 z M21 4 c-4 4 -4 10 0 14 M27 4 c4 4 4 10 0 14',
  faca: 'M6 30 h22 l12 -6 c4 -2 4 4 0 6 l-12 6 h-22 z M28 30 v6 M4 38 h40 v6 h-40 z',
  liquidificador: 'M14 6 h20 l-3 26 h-14 z M12 32 h24 v12 h-24 z M22 40 h4 M16 2 h16 v4 h-16 z',
  chaleira: 'M12 20 h24 v18 a4 4 0 0 1 -4 4 h-16 a4 4 0 0 1 -4 -4 z M16 20 c0 -8 16 -8 16 0 M36 24 l8 -6 M22 12 h4',
  pinca: 'M10 6 l14 36 l14 -36 M14 6 l10 28 l10 -28'
};

export function toolSVG(toolId, size = 28) {
  const d = TOOL_PATHS[toolId] || TOOL_PATHS.dosador;
  return `<svg class="tool-icon" viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
}

// ── Arabescos dourados (filigrana de cardápio) ──
const SCROLL_HALF = 'M6 12 C14 4 24 3 32 8 C38 12 44 15 52 12 C58 9.5 59 4 55 2.6 C52 1.6 49.6 4 51 6.4'
  + ' M6 12 C14 18 22 20 30 17 C34 15.5 36 18 34 20 C32.5 21.4 30.4 20.2 31.2 18.6'
  + ' M52 12 C64 11 80 12 96 12 M60 15 C70 16 80 16 88 15.4';

/** Cabeçalho/rodapé simétrico em filigrana. */
export function ornament(width = 220) {
  return `<svg class="ornament" viewBox="0 0 220 24" width="${width}" height="${Math.round(width * 24 / 220)}" aria-hidden="true">
    <g fill="none" stroke="currentColor" stroke-width=".9" stroke-linecap="round">
      <path transform="translate(110 0)" d="${SCROLL_HALF}"/>
      <path transform="translate(110 0) scale(-1 1)" d="${SCROLL_HALF}"/>
    </g>
    <path d="M110 5.5 C112.5 9 112.5 15 110 18.5 C107.5 15 107.5 9 110 5.5 Z" fill="currentColor"/>
    <circle cx="110" cy="2.6" r="1.1" fill="currentColor"/><circle cx="110" cy="21.4" r="1.1" fill="currentColor"/>
  </svg>`;
}

/** Divisória discreta entre os drinks: filete afinado com um ponto. */
export function divider(width = 260) {
  return `<svg class="divider" viewBox="0 0 260 8" width="${width}" height="${Math.round(width * 8 / 260)}" aria-hidden="true">
    <path d="M10 4 Q130 2.6 250 4 Q130 5.4 10 4 Z" fill="currentColor" opacity=".55"/>
    <path d="M130 0.6 L133.4 4 L130 7.4 L126.6 4 Z" fill="currentColor"/>
  </svg>`;
}

/** Arabesco de canto (rotacionado via CSS para os quatro cantos). */
export function cornerFlourish(size = 64) {
  return `<svg class="corner-flourish" viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round">
    <path d="M4 62 C4 36 10 16 30 8 C40 4 50 4 62 4"/>
    <path d="M9 62 C9 40 14 22 32 13 C42 9 52 9 62 9" stroke-width=".55"/>
    <path d="M4 40 C10 38 15 42 14 48 C13.4 52 9 53 8 50 C7.2 47.6 9.6 46 11 47.4"/>
    <path d="M40 4 C38 10 42 15 48 14 C52 13.4 53 9 50 8 C47.6 7.2 46 9.6 47.4 11"/>
    <path d="M18 18 C22 22 28 22 30 18 C31.4 15 28.6 13 27 14.6"/>
  </g><circle cx="20" cy="20" r="1.4" fill="currentColor"/></svg>`;
}
