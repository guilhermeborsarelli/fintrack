// Home Tender — estúdio 3D para gerar as fotos dos drinks.
// Fundo preto, piso escuro reflexivo, spot de cima e contraluz, como fotografia de produto.
// Rodado no Chromium headless por render.cjs; cada drink vira um WebP em public/drinks/img/drinks/.
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {Reflector} from 'three/addons/objects/Reflector.js';

const W = 960, H = 1200;
// 'raster' é o modo usado. 'pt' (path tracing com materiais de transmissão física) ficou como experimento:
// sem GPU, levava minutos por imagem.
let MODE = 'raster';
export const setMode = m => { MODE = m; };

// ───────────── Perfis dos copos (cm): pontos (r, y) da parede externa e interna ─────────────
const arc = (cx, cy, a, b, t0, t1, n) => [...Array(n + 1)].map((_, k) => {
  const t = t0 + (t1 - t0) * k / n;
  return [cx + a * Math.cos(t), cy + b * Math.sin(t)];
});

function stemmed({footR = 3.8, stemTop, bowlOuter, bowlInner}) {
  // pé + haste + bojo; bowlOuter vai de baixo para a borda, bowlInner da borda para o fundo
  const outer = [[0, 0], [footR, 0], [footR, 0.18], [footR * 0.55, 0.35], [0.9, 0.7], [0.36, 1.4], [0.33, stemTop - 0.6], [0.6, stemTop], ...bowlOuter];
  return {outer, inner: bowlInner};
}

function bowlFromRadius(fn, y0, y1, n, wall = 0.14) {
  const out = [], inn = [];
  for (let k = 0; k <= n; k++) { const y = y0 + (y1 - y0) * k / n; out.push([fn(y), y]); }
  for (let k = n; k >= 0; k--) { const y = y0 + (y1 - y0) * k / n; inn.push([Math.max(0, fn(y) - wall), y + (k === 0 ? wall * 1.2 : 0)]); }
  return {out, inn};
}

const GLASSES = {
  rocks: () => {
    const outer = [[0, 0], [3.7, 0], [3.95, 0.15], [4.05, 0.6], [4.5, 9.2]];
    const inner = [[4.18, 9.2], [3.72, 1.7], [3.5, 1.5], [0, 1.45]];
    return {outer, inner, rim: 9.2, floor: 1.45, fill: 0.62};
  },
  highball: () => {
    const outer = [[0, 0], [3.1, 0], [3.3, 0.15], [3.35, 0.5], [3.55, 15.5]];
    const inner = [[3.26, 15.5], [3.06, 1.3], [2.9, 1.1], [0, 1.05]];
    return {outer, inner, rim: 15.5, floor: 1.05, fill: 0.86};
  },
  collins: () => {
    const outer = [[0, 0], [2.7, 0], [2.85, 0.15], [2.9, 0.5], [3.0, 17.5]];
    const inner = [[2.72, 17.5], [2.62, 1.3], [2.48, 1.1], [0, 1.05]];
    return {outer, inner, rim: 17.5, floor: 1.05, fill: 0.88};
  },
  coupe: () => {
    const outerArc = arc(0, 13.6, 5.6, 4.6, -Math.PI / 2, 0, 18).filter(([r]) => r > 0.55);
    const innerArc = arc(0, 13.6, 5.44, 4.45, 0, -Math.PI / 2, 18);
    const g = stemmed({footR: 3.9, stemTop: 9.2, bowlOuter: outerArc, bowlInner: innerArc});
    return {...g, rim: 13.6, floor: 9.15, fill: 0.78};
  },
  martini: () => {
    const bowlOuter = [[0.7, 9.6], [2.2, 11.2], [4.2, 13.7], [6.2, 16.2]];
    const bowlInner = [[6.04, 16.2], [4.05, 13.75], [2.05, 11.3], [0, 9.95]];
    const g = stemmed({footR: 4.1, stemTop: 9.4, bowlOuter, bowlInner});
    return {...g, rim: 16.2, floor: 9.95, fill: 0.84};
  },
  flute: () => {
    const fn = y => 2.75 * Math.pow(Math.sin(Math.min(1, (y - 10.6) / 11.4) * Math.PI / 2), 0.55) + 0.25;
    const {out, inn} = bowlFromRadius(fn, 10.6, 22, 22, 0.12);
    const g = stemmed({footR: 3.3, stemTop: 10.4, bowlOuter: out, bowlInner: inn});
    return {...g, rim: 22, floor: 10.75, fill: 0.86};
  },
  wine: () => {
    const fn = y => { const t = (y - 9.6) / 11; return Math.max(0.4, 4.6 * Math.sin(Math.min(1, t * 1.45) * Math.PI * 0.62) * (1 - 0.18 * Math.max(0, t - 0.55) / 0.45) + 0.2); };
    const {out, inn} = bowlFromRadius(fn, 9.6, 20.6, 26, 0.13);
    const g = stemmed({footR: 3.9, stemTop: 9.4, bowlOuter: out, bowlInner: inn});
    return {...g, rim: 20.6, floor: 9.8, fill: 0.5};
  },
  irish: () => {
    const fn = y => 3.1 + (y - 4.4) * 0.07 + 0.25 * Math.sin((y - 4.4) / 11 * Math.PI);
    const {out, inn} = bowlFromRadius(fn, 4.4, 15.6, 14, 0.18);
    out.unshift([0.9, 4.0]);
    const g = stemmed({footR: 3.6, stemTop: 3.6, bowlOuter: out, bowlInner: inn});
    return {...g, rim: 15.6, floor: 4.65, fill: 0.86, handle: true};
  },
  hurricane: () => {
    const fn = y => { const t = (y - 5) / 16; return 2.4 + 1.3 * Math.sin(t * Math.PI * 1.05 + 0.2) - 0.9 * Math.sin(t * Math.PI * 2.1) * 0.5 + t * 0.6; };
    const {out, inn} = bowlFromRadius(fn, 5, 21, 30, 0.13);
    out.unshift([0.8, 4.6]);
    const g = stemmed({footR: 3.4, stemTop: 4.2, bowlOuter: out, bowlInner: inn});
    return {...g, rim: 21, floor: 5.2, fill: 0.85};
  },
  mug: () => ({outer: [[0, 0], [3.9, 0], [4.15, 0.3], [4.25, 10]], inner: [[4.05, 10], [3.95, 0.6], [0, 0.55]], rim: 10, floor: 0.55, fill: 0.88, metal: 'copper', handle: true}),
  tiki: () => ({outer: [[0, 0], [3.5, 0], [3.75, 0.4], [3.8, 15]], inner: [[3.55, 15], [3.4, 0.8], [0, 0.7]], rim: 15, floor: 0.7, fill: 0.86, metal: 'ceramic'}),
  julep: () => ({outer: [[0, 0], [3.2, 0], [3.45, 0.3], [3.5, 1.2], [3.9, 10.5]], inner: [[3.75, 10.5], [3.3, 1.2], [0, 1.0]], rim: 10.5, floor: 1.0, fill: 0.9, metal: 'silver'})
};

// ───────────── Utilidades ─────────────
const lathe = (pts, seg = 96) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(Math.max(0, r), y)), seg);

function innerRadiusAt(inner, y) {
  const pts = [...inner].sort((a, b) => a[1] - b[1]);
  if (y <= pts[0][1]) return pts[0][0];
  for (let k = 1; k < pts.length; k++) {
    const [r0, y0] = pts[k - 1], [r1, y1] = pts[k];
    if (y <= y1) return r0 + (r1 - r0) * (y - y0) / ((y1 - y0) || 1);
  }
  return pts.at(-1)[0];
}

function liquidProfile(inner, floor, top, shrink = 0.012) {
  const pts = [...inner].sort((a, b) => a[1] - b[1]).filter(([, y]) => y > floor + 0.01 && y < top);
  const prof = [[0, floor + 0.02], [Math.max(0, innerRadiusAt(inner, floor + 0.05) - shrink - 0.05), floor + 0.05], ...pts.map(([r, y]) => [Math.max(0, r - shrink), y]), [innerRadiusAt(inner, top) - shrink, top], [0, top]];
  return prof;
}

function seeded(seed) {
  let s = 0; for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

const col = hex => new THREE.Color(hex);

// ───────────── Materiais ─────────────
function glassMat() {
  return new THREE.MeshPhysicalMaterial({color: col('#d6e6ec'), roughness: 0.05, transparent: true, opacity: 0.07, depthWrite: false, side: THREE.DoubleSide, envMapIntensity: 0.6});
}
function glassShine() {
  return new THREE.MeshPhysicalMaterial({color: 0x000000, roughness: 0.03, metalness: 0, ior: 1.5, specularIntensity: 1, clearcoat: 1, clearcoatRoughness: 0.03,
    envMapIntensity: 1.9, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide});
}
function glassMesh(geo) {
  if (MODE === 'pt') {
    return new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({color: 0xffffff, roughness: 0, metalness: 0, transmission: 1, ior: 1.5,
      attenuationColor: col('#eef6f4'), attenuationDistance: 25, specularIntensity: 1}));
  }
  const g = new THREE.Group();
  const body = new THREE.Mesh(geo, glassMat()); body.renderOrder = 10;
  const shine = new THREE.Mesh(geo, glassShine()); shine.renderOrder = 11;
  g.add(body, shine); return g;
}

function liquidMat(hex, {cream = false, color2 = null, floor = 0, top = 10} = {}) {
  const c = col(hex);
  if (MODE === 'pt') {
    if (cream) return new THREE.MeshPhysicalMaterial({color: c, roughness: 0.45, sheen: 0.5});
    // A cor vem da absorção: quanto mais "fundo" o líquido, mais intensa (como na vida real)
    const lum = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
    const sat = c.clone(); const hsl = {}; sat.getHSL(hsl); sat.setHSL(hsl.h, Math.min(1, hsl.s * 1.15), Math.min(0.62, hsl.l));
    return new THREE.MeshPhysicalMaterial({color: 0xffffff, roughness: 0, transmission: 1, ior: 1.34,
      attenuationColor: sat, attenuationDistance: 1.2 + 9 * Math.pow(lum, 3)});
  }
  if (cream) return new THREE.MeshPhysicalMaterial({color: c, roughness: 0.4, sheen: 0.6, sheenColor: col('#ffffff'), envMapIntensity: 0.7, emissive: c, emissiveIntensity: 0.08});
  // Líquido "iluminado por trás": translúcido, com brilho próprio da cor e verniz para reflexos
  const lum = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
  const m = new THREE.MeshPhysicalMaterial({color: c, roughness: 0.06, metalness: 0, transparent: true,
    opacity: Math.min(0.92, 0.42 + 0.62 * (1 - lum)), emissive: c, emissiveIntensity: 0.18 + 0.5 * (1 - lum),
    clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 0.9, depthWrite: true});
  // Volume: centro mais luminoso, bordas mais densas (como luz atravessando o líquido)
  m.onBeforeCompile = sh => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
      float facing = abs(dot(normalize(normal), normalize(vViewPosition)));
      float hgt = clamp((vWorldY - uFloor) / max(0.001, uTop - uFloor), 0.0, 1.0);
      totalEmissiveRadiance *= mix(0.25, 1.35, pow(facing, 1.4)) * mix(0.55, 1.15, smoothstep(0.0, 0.85, hgt));
      totalEmissiveRadiance += vec3(1.0, 0.97, 0.9) * smoothstep(0.93, 1.0, hgt) * (1.0 - facing) * 0.55;
      diffuseColor.rgb *= mix(0.55, 1.0, facing);`).replace('#include <color_fragment>', `#include <color_fragment>
      float hgt0 = clamp((vWorldY - uFloor) / max(0.001, uTop - uFloor), 0.0, 1.0);
      float layerMix = USE_LAYER > 0.5 ? smoothstep(0.18, 0.62, hgt0) : 1.0;
      diffuseColor.rgb = mix(uColor2, diffuseColor.rgb, layerMix);`).replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n      totalEmissiveRadiance = mix(uColor2 * uEmI, totalEmissiveRadiance, layerMix);').replace('#include <common>', '#include <common>\nvarying float vWorldY;\nuniform float uFloor;\nuniform float uTop;\nuniform vec3 uColor2;\nuniform float USE_LAYER;\nuniform float uEmI;');
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying float vWorldY;').replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWorldY = (modelMatrix * vec4(transformed, 1.0)).y;');
    sh.uniforms.uFloor = {value: floor}; sh.uniforms.uTop = {value: top};
    sh.uniforms.uColor2 = {value: color2 ? col(color2).convertSRGBToLinear() : new THREE.Color()}; sh.uniforms.USE_LAYER = {value: color2 ? 1 : 0}; sh.uniforms.uEmI = {value: m.emissiveIntensity};
  };
  m.customProgramCacheKey = () => 'liquid';
  return m;
}

const iceMat = () => MODE === 'pt'
  ? new THREE.MeshPhysicalMaterial({color: 0xffffff, roughness: 0.06, transmission: 1, ior: 1.31, attenuationColor: col('#e6f4fa'), attenuationDistance: 14})
  : new THREE.MeshPhysicalMaterial({color: col('#ffffff'), roughness: 0.1, transparent: true, opacity: 0.3, emissive: col('#ffffff'), emissiveIntensity: 0.06, clearcoat: 1, clearcoatRoughness: 0.05,
      envMapIntensity: 2.6, depthWrite: false, blending: THREE.AdditiveBlending});

// ───────────── Estúdio ─────────────
function studioEnvironment(renderer) {
  // Sala preta com softboxes: gera reflexos verticais nítidos no vidro
  const env = new THREE.Scene();
  env.background = new THREE.Color(0x000000);
  const box = (w, h, x, y, z, ry, intensity) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({color: new THREE.Color(intensity, intensity, intensity), side: THREE.DoubleSide}));
    m.position.set(x, y, z); m.rotation.y = ry; env.add(m); return m;
  };
  box(0.9, 14, -9, 4, 3, Math.PI / 2.4, 4.5); // faixa esquerda (estreita = reflexo fino)
  box(0.5, 14, 9, 4, 1, -Math.PI / 2.2, 2.6); // faixa direita
  box(10, 2.2, 0, 12, -2, 0, 2.2).rotation.x = Math.PI / 2; // teto
  box(14, 7, 0, 3, -12, 0, 0.35);              // fundo bem fraco
  const pm = new THREE.PMREMGenerator(renderer);
  return pm.fromScene(env, 0.02).texture;
}

export function createStudio(canvas) {
  const renderer = new THREE.WebGLRenderer({canvas, antialias: true, preserveDrawingBuffer: true, alpha: false});
  renderer.setPixelRatio(1);
  renderer.setSize(W, H, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.transmissionResolutionScale = 1;
  const envTex = studioEnvironment(renderer);
  return {renderer, envTex};
}

// Ambiente equiretangular para o path tracer: estúdio preto com softboxes
export function studioEquirect() {
  const w = 1024, h = 512, c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, w, h);
  const strip = (u, width, v0, v1, a) => { // u: longitude 0..1
    const x = u * w, grd = g.createLinearGradient(x - width, 0, x + width, 0);
    grd.addColorStop(0, 'rgba(255,255,255,0)'); grd.addColorStop(0.5, `rgba(255,248,235,${a})`); grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(x - width, v0 * h, width * 2, (v1 - v0) * h);
  };
  strip(0.36, 14, 0.18, 0.62, 1);    // softbox à esquerda-frente
  strip(0.68, 8, 0.2, 0.6, 0.75);    // softbox à direita
  strip(0.84, 22, 0.25, 0.55, 0.35); // contorno de trás
  g.fillStyle = 'rgba(255,245,230,.5)'; g.fillRect(0, 0, w, h * 0.06); // teto suave
  // DataTexture em ponto flutuante (o path tracer amostra o ambiente como HDR)
  const px = g.getImageData(0, 0, w, h).data, data = new Float32Array(w * h * 4);
  const lin = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  for (let k = 0; k < w * h; k++) { for (let ch = 0; ch < 3; ch++) data[k * 4 + ch] = lin(px[k * 4 + ch]) * 6; data[k * 4 + 3] = 1; }
  const t = new THREE.DataTexture(data, w, h, THREE.RGBAFormat, THREE.FloatType);
  t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.LinearSRGBColorSpace;
  t.magFilter = t.minFilter = THREE.LinearFilter; t.generateMipmaps = false; t.flipY = true; t.needsUpdate = true;
  return t;
}

function addPTLights(scene, rimY, glassW) {
  const spot = new THREE.SpotLight(0xfff0da, 2600, 0, Math.PI / 16, 0.9, 2);
  spot.position.set(1.5, 46, 10); spot.target.position.set(0, rimY * 0.5, 0); spot.radius = 1.5;
  scene.add(spot, spot.target);
  // Cartão de luz atrás do copo: o "brilho" que atravessa o líquido, como em foto de produto
  const tex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
    const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128); grd.addColorStop(0, '#fff3dc'); grd.addColorStop(0.45, '#7a6248'); grd.addColorStop(1, '#000');
    g.fillStyle = grd; g.fillRect(0, 0, 256, 256); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const card = new THREE.Mesh(new THREE.PlaneGeometry(glassW * 3.2, rimY * 2.2), new THREE.MeshBasicMaterial({color: 0x000000}));
  card.material = new THREE.MeshStandardMaterial({color: 0x000000, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 1.6});
  card.position.set(0, rimY * 0.55, -30); scene.add(card);
  const rim = new THREE.DirectionalLight(0xdfe8ff, 0.6); rim.position.set(-10, 8, -6); scene.add(rim);
}

function addLights(scene, rimY) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.04));
  const spot = new THREE.SpotLight(0xfff1dc, 380, 80, Math.PI / 16, 0.85, 1.6);
  spot.position.set(2, 42, 12); spot.target.position.set(0, rimY * 0.45, 0);
  spot.castShadow = true; spot.shadow.mapSize.set(1024, 1024); spot.shadow.bias = -0.0005; spot.shadow.radius = 6;
  scene.add(spot, spot.target);
  const back = new THREE.SpotLight(0xffe2b8, 500, 70, Math.PI / 9, 0.8, 1.5); // contraluz: brilho através do líquido
  back.position.set(-4, 14, -26); back.target.position.set(0, rimY * 0.4, 0); scene.add(back, back.target);
  const rimL = new THREE.DirectionalLight(0xdfe8ff, 1.4); rimL.position.set(-10, 8, -6); scene.add(rimL);
  const rimR = new THREE.DirectionalLight(0xffe9cf, 1.0); rimR.position.set(10, 6, -5); scene.add(rimR);
}

function radialTexture(stops, size = 512) {
  const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d');
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [o, color] of stops) grd.addColorStop(o, color);
  g.fillStyle = grd; g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function addFloor(scene, rimY, glassW) {
  if (MODE === 'pt') {
    const floor = new THREE.Mesh(new THREE.CircleGeometry(60, 64), new THREE.MeshPhysicalMaterial({color: 0x060606, roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.3}));
    floor.rotation.x = -Math.PI / 2; scene.add(floor); return;
  }
  // Bancada preta espelhada: reflexo sutil do copo
  const mirror = new Reflector(new THREE.PlaneGeometry(120, 120), {textureWidth: W, textureHeight: H, color: 0x2a2a2a, clipBias: 0.003});
  mirror.rotation.x = -Math.PI / 2; mirror.position.y = -0.01; scene.add(mirror);
  // Véu preto que dissolve o reflexo e a bancada no escuro, deixando só a poça de luz sob o copo
  const veil = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), new THREE.MeshBasicMaterial({map: radialTexture([[0, 'rgba(0,0,0,0.25)'], [0.07, 'rgba(0,0,0,0.55)'], [0.16, 'rgba(0,0,0,0.92)'], [0.3, 'rgba(0,0,0,1)']]), transparent: true, depthWrite: false}));
  veil.rotation.x = -Math.PI / 2; veil.position.y = 0.005; veil.renderOrder = 1; scene.add(veil);
  // Poça de luz quente na bancada
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(glassW * 3.2, glassW * 3.2), new THREE.MeshBasicMaterial({map: radialTexture([[0, 'rgba(255,236,205,0.30)'], [0.35, 'rgba(255,226,190,0.12)'], [1, 'rgba(0,0,0,0)']]), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending}));
  pool.rotation.x = -Math.PI / 2; pool.position.y = 0.01; pool.renderOrder = 2; scene.add(pool);
  // Halo de luz atrás do copo (fundo de estúdio)
  const haloTex = (() => { const c = document.createElement('canvas'); c.width = 512; c.height = 512; const g = c.getContext('2d');
    const grd = g.createRadialGradient(256, 300, 0, 256, 300, 280); grd.addColorStop(0, 'rgba(125,100,72,0.6)'); grd.addColorStop(0.45, 'rgba(62,48,34,0.3)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 512, 512);
    g.globalCompositeOperation = 'destination-in'; const v = g.createLinearGradient(0, 512, 0, 0); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(0.4, 'rgba(0,0,0,1)'); v.addColorStop(1, 'rgba(0,0,0,1)');
    g.fillStyle = v; g.fillRect(0, 0, 512, 512);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const hs = rimY * 2.9;
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(hs, hs), new THREE.MeshBasicMaterial({map: haloTex, transparent: true, depthWrite: false, fog: false}));
  halo.position.set(0, hs / 2, -16); halo.renderOrder = 0; scene.add(halo);
}

// ───────────── Guarnições ─────────────
function citrusTexture(kind) {
  const C = {lemon: ['#e9c637', '#f3dc6e', '#fbf3c9', '#fffbe8'], lime: ['#5d8a2a', '#b9d26a', '#e3ecb0', '#f6f8e6'], orange: ['#d9711c', '#f0a443', '#f9d29a', '#fff3e2']}[kind];
  const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d');
  const R = 256, rnd = seeded('tex' + kind);
  g.fillStyle = C[0]; g.beginPath(); g.arc(R, R, R, 0, Math.PI * 2); g.fill();           // casca
  g.fillStyle = C[3]; g.beginPath(); g.arc(R, R, R * 0.92, 0, Math.PI * 2); g.fill();    // parte branca
  const n = 10;
  for (let k = 0; k < n; k++) {
    const a0 = k / n * Math.PI * 2 + 0.035, a1 = (k + 1) / n * Math.PI * 2 - 0.035;
    const grad = g.createRadialGradient(R, R, 10, R, R, R * 0.86);
    grad.addColorStop(0, C[2]); grad.addColorStop(0.5, C[1]); grad.addColorStop(1, C[1]);
    g.fillStyle = grad; g.beginPath(); g.moveTo(R + 18 * Math.cos((a0 + a1) / 2), R + 18 * Math.sin((a0 + a1) / 2)); g.arc(R, R, R * 0.86, a0, a1); g.closePath(); g.fill();
    for (let j = 0; j < 120; j++) { // vesículas de polpa
      const a = a0 + 0.02 + rnd() * (a1 - a0 - 0.04), r = 30 + rnd() * (R * 0.82 - 30);
      g.fillStyle = `rgba(255,255,255,${0.12 + rnd() * 0.25})`; g.beginPath(); g.ellipse(R + r * Math.cos(a), R + r * Math.sin(a), 5 + rnd() * 6, 1.6 + rnd() * 1.4, a, 0, Math.PI * 2); g.fill();
    }
  }
  g.fillStyle = C[3]; g.beginPath(); g.arc(R, R, 16, 0, Math.PI * 2); g.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

function citrusWheel(kind, r = 2.6) {
  const peel = {lemon: '#e6c23a', lime: '#5f8a2c', orange: '#d9731c'}[kind];
  const grp = new THREE.Group();
  const tex = citrusTexture(kind);
  const face = new THREE.MeshPhysicalMaterial({map: tex, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.1, roughness: 0.5, clearcoat: 0.9, clearcoatRoughness: 0.2, sheen: 0.4});
  const side = new THREE.MeshStandardMaterial({color: col(peel), roughness: 0.45});
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.26, 64), [side, face, face]);
  m.rotation.x = Math.PI / 2; m.castShadow = true; grp.add(m); return grp;
}

function citrusWedge(kind) {
  const peel = {lemon: '#e6c23a', lime: '#5f8a2c', orange: '#d9731c'}[kind];
  const flesh = {lemon: '#f6e48c', lime: '#cfe08a', orange: '#f4b35a'}[kind];
  const geo = new THREE.SphereGeometry(1.8, 32, 16, 0, Math.PI, 0, Math.PI / 2);
  const m = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({color: col(peel), roughness: 0.4, side: THREE.DoubleSide}));
  const cut = new THREE.Mesh(new THREE.CircleGeometry(1.8, 32, 0, Math.PI), new THREE.MeshPhysicalMaterial({color: col(flesh), roughness: 0.3, transmission: 0.3, thickness: 0.4}));
  cut.rotation.x = -Math.PI / 2;
  const g = new THREE.Group(); g.add(m, cut); g.scale.set(1, 1.6, 1); return g;
}

function peelTwist(kind, len = 6) {
  const peel = {lemon: '#e9c437', lime: '#6c9433', orange: '#df7a22'}[kind];
  const pts = [...Array(40)].map((_, k) => { const t = k / 39; return new THREE.Vector3(Math.cos(t * Math.PI * 3.2) * 0.75, -t * len, Math.sin(t * Math.PI * 3.2) * 0.75); });
  const tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, 0.22, 10, false);
  tube.scale(1, 1, 1);
  const m = new THREE.Mesh(tube, new THREE.MeshPhysicalMaterial({color: col(peel), roughness: 0.45, sheen: 0.3, clearcoat: 0.3}));
  m.castShadow = true; return m;
}

function cherry() {
  const g = new THREE.Group();
  const b = new THREE.Mesh(new THREE.SphereGeometry(1.0, 32, 24), new THREE.MeshPhysicalMaterial({color: col('#6e0710'), roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05, sheen: 0.2}));
  b.scale.set(1, 0.92, 1); b.castShadow = true;
  const stem = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.8, 0), new THREE.Vector3(0.3, 2.2, 0), new THREE.Vector3(1.1, 3.4, 0.2)]), 20, 0.06, 6), new THREE.MeshStandardMaterial({color: col('#4a3218'), roughness: 0.6}));
  g.add(b, stem); return g;
}

function olivePick() {
  const g = new THREE.Group();
  const pick = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 11, 8), new THREE.MeshStandardMaterial({color: col('#c9a46a'), roughness: 0.5}));
  pick.position.y = 3.5; g.add(pick);
  for (const y of [0, 2.2]) {
    const o = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 16), new THREE.MeshPhysicalMaterial({color: col('#6f7a2e'), roughness: 0.25, clearcoat: 0.8}));
    o.scale.set(1, 1.3, 1); o.position.y = y; o.castShadow = true; g.add(o);
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 8), new THREE.MeshStandardMaterial({color: col('#b5301f'), roughness: 0.5}));
    p.position.set(0, y + 1.0, 0); g.add(p);
  }
  return g;
}

function leaf(len, wid, color) {
  const s = new THREE.Shape(); s.moveTo(0, 0); s.quadraticCurveTo(wid, len * 0.45, 0, len); s.quadraticCurveTo(-wid, len * 0.45, 0, 0);
  const geo = new THREE.ShapeGeometry(s, 10);
  const pos = geo.attributes.position; // dobra a folha
  for (let k = 0; k < pos.count; k++) pos.setZ(k, -Math.pow(pos.getX(k), 2) * 0.5 + Math.pow(pos.getY(k) / len, 2) * 0.4);
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({color: col(color), roughness: 0.55, sheen: 0.4, side: THREE.DoubleSide}));
}

function herbSprig(color = '#3f6e2a', n = 7, size = 1) {
  const g = new THREE.Group(); const rnd = seeded('herb' + n);
  for (let k = 0; k < n; k++) {
    const l = leaf(3.1 * size, 1.5 * size, k % 2 ? color : new THREE.Color(color).offsetHSL(0.02, 0, 0.06).getStyle());
    const a = k / n * Math.PI * 2 + rnd();
    l.position.set(Math.cos(a) * 0.4, k * 0.35 * size, Math.sin(a) * 0.4);
    l.rotation.set(-0.5 - rnd() * 0.6, a, 0.2);
    l.castShadow = true; g.add(l);
  }
  return g;
}

function straw(height, color = '#111') {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, height, 16, 1, true), new THREE.MeshPhysicalMaterial({color: col(color), roughness: 0.3, clearcoat: 0.6, side: THREE.DoubleSide}));
  m.castShadow = true; return m;
}

// ───────────── Montagem do drink ─────────────
export function buildDrink(spec, envTex) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.environment = envTex;
  const G = GLASSES[spec.glass]();
  addFloor(scene, G.rim, Math.max(...G.outer.map(([r]) => r)) * 2);
  if (MODE === 'pt') { scene.environmentIntensity = 1.4; addPTLights(scene, G.rim, Math.max(...G.outer.map(([r]) => r)) * 2); }
  else addLights(scene, G.rim);
  const rnd = seeded(spec.id);

  const vessel = new THREE.Group(); scene.add(vessel);
  const shellPts = [...G.outer, ...G.inner];
  const metal = G.metal;
  const shellMat = metal === 'copper' ? new THREE.MeshPhysicalMaterial({color: col('#e08a55'), metalness: 1, roughness: 0.2, clearcoat: 0.6, envMapIntensity: 4.2})
    : metal === 'silver' ? new THREE.MeshPhysicalMaterial({color: col('#cfcfca'), metalness: 1, roughness: 0.45, envMapIntensity: 2.2})
    : metal === 'ceramic' ? new THREE.MeshPhysicalMaterial({color: col('#5b3a22'), roughness: 0.5, clearcoat: 0.7, clearcoatRoughness: 0.2})
    : glassMat();
  if (metal) {
    const shell = new THREE.Mesh(lathe(shellPts), shellMat); shell.castShadow = shell.receiveShadow = true; vessel.add(shell);
    // Metal só brilha se houver o que refletir: luzes de recorte laterais
    for (const [x, z, i] of [[-14, 10, 260], [12, 8, 160], [-4, 14, 90]]) { const l = new THREE.PointLight(0xfff0dc, i, 60, 1.6); l.position.set(x, G.rim * 0.6, z); scene.add(l); }
  }
  else vessel.add(glassMesh(lathe(shellPts)));

  if (G.handle) {
    const r = G.outer.at(-1)[0];
    const hg = new THREE.TorusGeometry(G.rim * 0.26, metal ? 0.42 : 0.3, 16, 48, Math.PI);
    const h = metal ? new THREE.Mesh(hg, shellMat) : glassMesh(hg);
    h.rotation.z = -Math.PI / 2; h.position.set(r + 0.05, G.rim * 0.55, 0); vessel.add(h);
  }
  if (metal === 'ceramic') { // rosto esculpido do tiki
    const dark = new THREE.MeshStandardMaterial({color: col('#2a170c'), roughness: 0.8});
    const r = 3.82;
    for (const [x, y, w, h2] of [[-1.3, 10.6, 1.4, 0.9], [1.3, 10.6, 1.4, 0.9], [0, 8.2, 0.7, 2.2], [0, 5.2, 3.6, 1.1]]) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h2, 0.5), dark); b.position.set(x, y, r - 0.1); vessel.add(b);
    }
    const brow = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.35, 0.6), dark); brow.position.set(0, 11.6, r - 0.05); vessel.add(brow);
  }
  if (spec.glass === 'julep') { // gelo condensado por fora
    const frost = new THREE.Mesh(lathe(G.outer.map(([r, y]) => [r + 0.02, y]).filter(([, y]) => y > 0.25)), new THREE.MeshPhysicalMaterial({color: 0xffffff, roughness: 0.9, transparent: true, opacity: 0.3}));
    vessel.add(frost);
  }

  // ── Líquido ──
  const fillFrac = spec.fill ?? (spec.serve === 'crushed' ? G.fill + 0.02 : G.fill);
  const top = G.floor + (G.rim - G.floor) * Math.min(0.93, fillFrac);
  const creamy = !!spec.creamy;
  const layered = spec.color2 && !spec.layerTop;
  const liquidTopColor = spec.color || '#d9b46a';
  const liq = new THREE.Mesh(lathe(liquidProfile(G.inner, G.floor, top)), liquidMat(liquidTopColor, {cream: creamy, color2: layered ? spec.color2 : null, floor: G.floor, top}));
  liq.renderOrder = 3; vessel.add(liq);
  let surface = top;
  if (spec.layerTop && spec.color2) {
    const h = spec.layerH ? spec.layerH / 9 * 0.9 : 0.9;
    const lt = new THREE.Mesh(lathe(liquidProfile(G.inner, top - 0.02, top + h)), liquidMat(spec.color2, {cream: /^#e|^#f/i.test(spec.color2), floor: top - 3, top: top + h}));
    lt.renderOrder = 4; vessel.add(lt);
    surface = top + h;
  }
  if (spec.foam) {
    const h = spec.id === 'ramos-fizz' ? 3.2 : 0.75;
    const foamMat = new THREE.MeshPhysicalMaterial({color: col(spec.foamColor || '#f4ead6'), roughness: 0.85, sheen: 1, sheenColor: col('#ffffff'), sheenRoughness: 0.6});
    const fp = liquidProfile(G.inner, surface - 0.05, Math.min(G.rim + (spec.id === 'ramos-fizz' ? 1.2 : 0), surface + h));
    vessel.add(new THREE.Mesh(lathe(fp), foamMat));
    surface += h;
  }

  // ── Gelo ──
  const rIn = y => innerRadiusAt(G.inner, y);
  const ice = iceMat();
  if (!creamy && (spec.serve === 'rocks' || spec.serve === 'big' || spec.serve === 'crushed')) {
    if (spec.serve === 'big') {
      const s = Math.min(rIn(G.floor + 2) * 1.25, 5.2);
      const m = new THREE.Mesh(new RoundedBoxGeometry(s, s, s, 4, 0.55), ice);
      m.position.set(0, G.floor + s / 2 + 0.3, 0); m.rotation.set(0.12, 0.6, 0.08); vessel.add(m);
    } else if (spec.serve === 'rocks') {
      const levels = Math.max(1, Math.floor((top - G.floor) / 3.2));
      for (let L = 0; L < levels + 1; L++) for (let k = 0; k < 3; k++) {
        const y = G.floor + 1.6 + L * 2.9 + rnd() * 0.5;
        if (y > top + 1.2) continue;
        const s = Math.min(2.7, rIn(y) * 0.82);
        const a = k / 3 * Math.PI * 2 + L + rnd();
        const rr = Math.max(0, rIn(y) - s * 0.72);
        const m = new THREE.Mesh(new RoundedBoxGeometry(s, s, s, 3, 0.35), ice);
        m.position.set(Math.cos(a) * rr, y, Math.sin(a) * rr); m.rotation.set(rnd() * 1.2, rnd() * 3, rnd() * 1.2); vessel.add(m);
      }
    } else {
      const geo = new THREE.IcosahedronGeometry(0.55, 0);
      for (let k = 0; k < 140; k++) {
        const y = G.floor + 0.6 + rnd() * (top - G.floor + 1.6);
        const rr = Math.sqrt(rnd()) * (rIn(Math.min(y, G.rim)) - 0.6);
        const a = rnd() * Math.PI * 2;
        const m = new THREE.Mesh(geo, ice); m.scale.setScalar(0.6 + rnd() * 0.8);
        m.position.set(Math.cos(a) * rr, y, Math.sin(a) * rr); m.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); vessel.add(m);
      }
      // domo de gelo acima da borda (fora do líquido: gelo fosco, não aditivo)
      const domeIce = new THREE.MeshPhysicalMaterial({color: col('#eef4f6'), roughness: 0.35, transparent: true, opacity: 0.82, clearcoat: 1, clearcoatRoughness: 0.15, envMapIntensity: 1.2});
      for (let k = 0; k < 40; k++) {
        const rr = Math.sqrt(rnd()) * (rIn(G.rim) - 0.4), a = rnd() * Math.PI * 2;
        const y = G.rim - 0.4 + (1 - rr / rIn(G.rim)) * 1.6 * rnd();
        const m = new THREE.Mesh(geo, domeIce); m.scale.setScalar(0.7 + rnd() * 0.7);
        m.position.set(Math.cos(a) * rr, y, Math.sin(a) * rr); m.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); vessel.add(m);
      }
    }
  }

  // ── Condensação: gotículas por fora do copo gelado ──
  if (!G.metal && ['rocks', 'big', 'crushed'].includes(spec.serve) && MODE !== 'pt') {
    const dropMat = new THREE.MeshPhysicalMaterial({color: 0x000000, roughness: 0, clearcoat: 1, envMapIntensity: 3.5, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false});
    const dropBody = new THREE.MeshPhysicalMaterial({color: col('#ffffff'), roughness: 0.2, transparent: true, opacity: 0.12, depthWrite: false});
    const geo = new THREE.SphereGeometry(1, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const n = 140, iA = new THREE.InstancedMesh(geo, dropMat, n), iB = new THREE.InstancedMesh(geo, dropBody, n), d = new THREE.Object3D();
    const yMax = Math.min(top, G.rim - 0.6), yMin = Math.max(G.floor, G.outer.find(([r]) => r > 1)?.[1] ?? 0) + 0.4;
    for (let k = 0; k < n; k++) {
      const y = yMin + rnd() * (yMax - yMin), a = (rnd() - 0.5) * Math.PI * 1.5;
      let r = 0; for (const [rr, yy] of G.outer) if (yy <= y) r = rr; else { r = r + 0; break; }
      const rr = innerRadiusAt(G.outer.filter(p => p[0] > 0), y) + 0.02;
      const sz = 0.035 + Math.pow(rnd(), 4) * 0.12;
      d.position.set(Math.sin(a) * rr, y, Math.cos(a) * rr); d.lookAt(Math.sin(a) * rr * 2, y, Math.cos(a) * rr * 2); d.rotateX(Math.PI / 2);
      d.scale.set(sz, sz * 0.45, sz * 1.15); d.updateMatrix(); iA.setMatrixAt(k, d.matrix); iB.setMatrixAt(k, d.matrix);
    }
    iA.renderOrder = 12; iB.renderOrder = 12; vessel.add(iB, iA);
  }

  // ── Bolhas ──
  if (spec.bubbles) {
    const bm = MODE === 'pt' ? new THREE.MeshPhysicalMaterial({color: 0xffffff, roughness: 0, transmission: 1, ior: 1 / 1.33})
      : new THREE.MeshPhysicalMaterial({color: 0xffffff, roughness: 0, transparent: true, opacity: 0.55, emissive: 0xffffff, emissiveIntensity: 0.35, envMapIntensity: 2.5});
    const geo = new THREE.SphereGeometry(0.09, 10, 8);
    for (let k = 0; k < 160; k++) {
      const y = G.floor + 0.3 + rnd() * (top - G.floor - 0.5);
      const rr = Math.sqrt(rnd()) * (rIn(y) - 0.2), a = rnd() * Math.PI * 2;
      const m = new THREE.Mesh(geo, bm); m.scale.setScalar(0.5 + rnd() * 1.4);
      m.position.set(Math.cos(a) * rr, y, Math.sin(a) * rr); vessel.add(m);
    }
  }

  // ── Borda de sal ou açúcar ──
  if (spec.rim) {
    const crystals = new THREE.InstancedMesh(new THREE.BoxGeometry(0.16, 0.16, 0.16), new THREE.MeshPhysicalMaterial({color: 0xffffff, roughness: 0.3, emissive: 0xffffff, emissiveIntensity: 0.15}), 900);
    const rr = G.outer.at(-1)[0] + 0.05; const d = new THREE.Object3D();
    for (let k = 0; k < 900; k++) {
      const a = rnd() * Math.PI * 2, y = G.rim - rnd() * 0.9;
      d.position.set(Math.cos(a) * (rr + rnd() * 0.08), y, Math.sin(a) * (rr + rnd() * 0.08)); d.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); d.scale.setScalar(0.6 + rnd()); d.updateMatrix();
      crystals.setMatrixAt(k, d.matrix);
    }
    vessel.add(crystals);
  }

  // ── Guarnições ──
  const rimR = innerRadiusAt(G.inner, G.rim) + 0.15;
  for (const kind of spec.garnish || []) {
    if (kind.endsWith('_wheel')) {
      const w = citrusWheel(kind.split('_')[0], Math.min(2.8, Math.max(2.1, rimR * 0.6)));
      w.position.set(rimR * 0.95, G.rim + 0.6, 0.4); w.rotation.set(0.08, -0.95, 0.15); vessel.add(w);
    } else if (kind.endsWith('_wedge')) {
      const w = citrusWedge(kind.split('_')[0]); w.position.set(rimR * 0.95, G.rim - 0.2, 0.4); w.rotation.set(0, -0.6, -0.5); vessel.add(w);
    } else if (kind.endsWith('_twist')) {
      const t = peelTwist(kind.split('_')[0]); t.position.set(rimR * 0.82, G.rim + 1.2, 0.7); t.rotation.set(0.1, 0.4, -0.18); vessel.add(t);
    } else if (kind === 'lemon_peel_long') {
      const pts = [...Array(80)].map((_, k) => { const t = k / 79; const y = G.rim + 0.6 - t * (G.rim - G.floor - 1); const r = rIn(Math.min(G.rim, y)) - 0.45; return new THREE.Vector3(Math.cos(t * Math.PI * 6) * r, y, Math.sin(t * Math.PI * 6) * r); });
      const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 300, 0.2, 8), new THREE.MeshPhysicalMaterial({color: col('#e9c437'), roughness: 0.45}));
      vessel.add(m);
    } else if (kind === 'lime_chunks') { // gomos macerados no fundo do copo
      for (let k = 0; k < 5; k++) {
        const w = citrusWedge('lime'); w.scale.multiplyScalar(0.75);
        const a = k / 5 * Math.PI * 2 + rnd(), rr = rIn(G.floor + 1) * 0.45;
        w.position.set(Math.cos(a) * rr, G.floor + 0.9 + rnd() * 1.6, Math.sin(a) * rr); w.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); vessel.add(w);
      }
    } else if (kind === 'cherry') {
      const c = cherry();
      const inBowl = ['coupe', 'martini', 'flute', 'wine'].includes(spec.glass);
      if (inBowl) c.position.set(0.6, G.floor + 1.2, 0.4); else c.position.set(-rimR * 0.35, surface + 0.7, 0.8);
      c.rotation.z = 0.3; vessel.add(c);
    } else if (kind === 'olive') {
      const o = olivePick(); o.position.set(0.3, G.floor + 1.2, 0.2); o.rotation.set(0.1, 0, -0.38); vessel.add(o);
    } else if (kind === 'mint' || kind === 'basil') {
      const h = herbSprig(kind === 'mint' ? '#3f7a2c' : '#2f6a22', 9, kind === 'basil' ? 1.25 : 1);
      h.position.set(-rimR * 0.3, Math.max(surface, G.rim - 1.2) + 0.2, 0.3); vessel.add(h);
    } else if (kind === 'berries') {
      const mat = new THREE.MeshPhysicalMaterial({color: col('#240814'), roughness: 0.3, clearcoat: 0.8});
      for (let k = 0; k < 3; k++) {
        const g = new THREE.Group();
        for (let j = 0; j < 22; j++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), mat); const a = rnd() * 6.28, b = rnd() * 3.14; s.position.set(Math.cos(a) * Math.sin(b) * 0.55, Math.cos(b) * 0.7, Math.sin(a) * Math.sin(b) * 0.55); g.add(s); }
        g.position.set(-rimR * 0.4 + k * 1.1, Math.max(surface, G.rim - 0.6) + 0.5 + (k === 1 ? 0.6 : 0), 0.6 - k * 0.3); vessel.add(g);
      }
    } else if (kind === 'pineapple') {
      const p = new THREE.Group();
      const flesh = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 0.9, 24, 1, false, 0, 0.75), [new THREE.MeshPhysicalMaterial({color: col('#7a5a24'), roughness: 0.7}), new THREE.MeshPhysicalMaterial({color: col('#f3cd52'), roughness: 0.35, emissive: col('#f3cd52'), emissiveIntensity: 0.12, clearcoat: 0.6}), new THREE.MeshPhysicalMaterial({color: col('#f3cd52'), roughness: 0.35, clearcoat: 0.6})]);
      flesh.rotation.set(Math.PI / 2, 0, -Math.PI / 2 - 0.37); flesh.position.y = -1.6; p.add(flesh);
      for (let k = 0; k < 5; k++) { const l = leaf(3.6, 0.5, '#41702c'); l.position.set(0, 1.4, 0); l.rotation.set(0, k * 1.2, (k - 2) * 0.25); p.add(l); }
      p.position.set(rimR * 0.95, G.rim + 1, 0.2); p.rotation.z = -0.25; vessel.add(p);
    } else if (kind === 'celery') {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, G.rim + 4, 16), new THREE.MeshPhysicalMaterial({color: col('#9cbc62'), roughness: 0.45, clearcoat: 0.3}));
      m.position.set(rimR * 0.4, (G.rim + 4) / 2, -0.4); m.rotation.z = -0.12; vessel.add(m);
      const h = herbSprig('#7aa548', 7, 1.1); h.position.set(rimR * 0.4 + 0.9, G.rim + 4, -0.4); vessel.add(h);
    } else if (kind === 'nutmeg') {
      const mat = new THREE.MeshStandardMaterial({color: col('#5b361c'), roughness: 0.9});
      for (let k = 0; k < 60; k++) { const rr = Math.sqrt(rnd()) * (rIn(surface) - 0.5), a = rnd() * 6.28; const s = new THREE.Mesh(new THREE.SphereGeometry(0.05 + rnd() * 0.05, 5, 4), mat); s.position.set(Math.cos(a) * rr, surface + 0.02, Math.sin(a) * rr); vessel.add(s); }
    } else if (kind === 'coffee_beans') {
      const mat = new THREE.MeshPhysicalMaterial({color: col('#2a160b'), roughness: 0.25, clearcoat: 0.8});
      for (let k = 0; k < 3; k++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 12), mat); b.scale.set(1, 0.55, 0.75); b.position.set((k - 1) * 1.0, surface + 0.12, 0.2 * k); b.rotation.y = k; vessel.add(b); }
    } else if (kind === 'bitters_drops') {
      const mat = new THREE.MeshStandardMaterial({color: col('#7b1d12'), roughness: 0.4});
      for (const [x, z] of [[-1, 0.3], [0, -0.2], [1, 0.4]]) { const d = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.02, 20), mat); d.position.set(x, surface + 0.02, z); vessel.add(d); }
    }
  }
  if (spec.straw) {
    const h = G.rim - G.floor + 5;
    const s = straw(h); s.position.set(-rimR * 0.35, G.floor + h / 2, -0.4); s.rotation.z = 0.16; vessel.add(s);
  }

  vessel.traverse(o => { if (o.isMesh && !o.material.transparent) o.castShadow = true; });

  // ── Câmera: enquadra o copo com folga para guarnições ──
  const height = G.rim + (spec.garnish?.some(g => /celery|pineapple|mint|basil/.test(g)) || spec.straw ? 4.5 : 2.5);
  const width = Math.max(...G.outer.map(([r]) => r)) * 2 + 5;
  const frame = Math.max(height, width * H / W);
  const camera = new THREE.PerspectiveCamera(28, W / H, 0.1, 400);
  const dist = frame / (2 * Math.tan(THREE.MathUtils.degToRad(28 / 2))) * 1.45;
  camera.position.set(0, height * 0.55 + dist * 0.12, dist);
  camera.lookAt(0, height * 0.44, 0);
  scene.fog = new THREE.Fog(0x000000, dist * 0.95, dist * 1.45);
  return {scene, camera};
}

export async function renderSpec(studio, spec, type = 'image/webp', quality = 0.86) {
  const {scene, camera} = buildDrink(spec, studio.envTex);
  studio.renderer.render(scene, camera);
  const url = studio.renderer.domElement.toDataURL(type, quality);
  scene.traverse(o => { if (o.isMesh) { o.geometry.dispose(); [].concat(o.material).forEach(m => { m.map?.dispose(); m.dispose(); }); } });
  return url;
}
