// Home Tender — gera as fotos dos drinks com IA de imagem, no estilo de referência:
// fundo preto, spot de cima, bancada preta espelhada, condensação, vidro cristalino.
//
// Uso:
//   OPENAI_API_KEY=... node tools/generate-photos/generate.mjs            # todos os que faltam
//   node tools/generate-photos/generate.mjs negroni mojito                 # só alguns
//   node tools/generate-photos/generate.mjs --force negroni                # refaz mesmo se já for foto
//   node tools/generate-photos/generate.mjs --prompts                      # só mostra os roteiros
//
// As fotos aprovadas ficam listadas em public/drinks/img/drinks/photos.json e não são
// sobrescritas sem --force. Drinks sem foto continuam com a renderização 3D.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = path.join(ROOT, 'public/drinks/img/drinks');
const DONE_FILE = path.join(OUT, 'photos.json');
const {DRINKS, GLASSES} = await import(path.join(ROOT, 'public/drinks/data.js'));
const {setLang, trIngredient, trPhrase, trGlass} = await import(path.join(ROOT, 'public/drinks/i18n.js'));
const {ingredientName} = await import(path.join(ROOT, 'public/drinks/engine.js'));
setLang('en');

const GLASS_SHOT = {
  coupe: 'a crystal-clear stemmed coupe glass',
  martini: 'a crystal-clear V-shaped martini glass with a long thin stem',
  rocks: 'a heavy crystal old fashioned rocks glass with a thick cut-glass base',
  highball: 'a tall straight crystal highball glass',
  collins: 'a tall slim crystal collins glass',
  flute: 'a tall crystal Champagne flute',
  wine: 'a large crystal wine glass',
  mug: 'a polished hammered copper mug',
  tiki: 'a carved ceramic tiki mug',
  irish: 'a clear stemmed Irish coffee glass with a handle',
  julep: 'a frosted silver julep cup',
  hurricane: 'a curvy hurricane glass'
};
const ICE = {
  rocks: 'with clear ice cubes', big: 'with one large clear ice cube', crushed: 'packed with crushed ice',
  up: 'served straight up without ice', neat: 'without ice', hot: 'served hot, without ice'
};

function colorWord(hex) {
  const n = parseInt(hex.slice(1), 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 510, s = max === min ? 0 : (max - min) / (255 - Math.abs(max + min - 255));
  if (l > .86 && s < .5) return 'crystal-clear, almost colorless';
  if (l < .2) return 'very dark, almost black';
  let h = 0;
  if (max !== min) { h = max === r ? ((g - b) / (max - min)) % 6 : max === g ? (b - r) / (max - min) + 2 : (r - g) / (max - min) + 4; h *= 60; if (h < 0) h += 360; }
  const base = h < 15 || h >= 345 ? 'red' : h < 40 ? 'amber-orange' : h < 60 ? 'golden amber' : h < 80 ? 'pale yellow' : h < 160 ? 'pale green' : h < 250 ? 'pale blue-lilac' : h < 300 ? 'violet' : 'pink-red';
  return `${l < .4 ? 'deep ' : l > .7 ? 'light ' : ''}${base}`;
}

export function shortPrompt(d) {
  return promptFor(d).split(' Pure black seamless background.')[0].replace('Professional studio product photograph of the ', '');
}

export function promptFor(d) {
  const glass = GLASS_SHOT[d.glass] || trGlass(d.glass, GLASSES[d.glass]).name;
  const ings = [...new Set(d.ing.filter(l => !l.opt && !['agua', 'agua_quente', 'gelo'].includes(l.id)).map(l => trIngredient(l.id, ingredientName(l.id)).split(' / ')[0]))].join(', ');
  const look = [
    `${colorWord(d.color)} liquid`,
    d.color2 && !d.layerTop ? `fading to ${colorWord(d.color2)} at the bottom` : '',
    d.layerTop && d.color2 ? `with a ${colorWord(d.color2)} layer floating on top` : '',
    d.foam ? 'with a smooth, velvety foam on top' : '',
    d.bubbles ? 'with fine rising bubbles' : '',
    d.rim === 'salt' ? 'salt-rimmed' : d.rim === 'sugar' ? 'sugar-rimmed' : ''
  ].filter(Boolean).join(', ');
  const garnish = d.gtext ? `Garnish: ${trPhrase(d.gtext)}.` : 'No garnish.';
  return [
    `Professional studio product photograph of the ${d.name} cocktail (${ings}) in ${glass}, ${ICE[d.serve] || ''}, ${look}.`,
    garnish,
    'Pure black seamless background. Dramatic overhead spotlight with soft rim light outlining the glass, the liquid glowing from within.',
    'Glossy black reflective surface with a subtle mirror reflection under the glass. Fine condensation droplets on cold glass, crystal-clear glass with sharp highlights.',
    'Hyperrealistic, high-end commercial cocktail photography, centered, full glass visible with space around it, vertical 4:5 composition, shallow depth of field, no text, no logo, no hands, no props.'
  ].join(' ');
}

async function generateOpenAI(prompt) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY || 'sk-placeholder'}`},
    body: JSON.stringify({model: process.env.IMAGE_MODEL || 'gpt-image-1', prompt, size: '1024x1536', quality: process.env.IMAGE_QUALITY || 'high', n: 1})
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = await res.json();
  return Buffer.from(json.data[0].b64_json, 'base64');
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force'), onlyPrompts = args.includes('--prompts');
  const ids = args.filter(a => !a.startsWith('--'));
  const done = new Set(fs.existsSync(DONE_FILE) ? JSON.parse(fs.readFileSync(DONE_FILE, 'utf8')) : []);
  const list = DRINKS.filter(d => (!ids.length || ids.includes(d.id)) && (force || !done.has(d.id)));
  if (onlyPrompts) { for (const d of list) console.log(`\n# ${d.id}\n${promptFor(d)}`); return; }
  if (args.includes('--list')) { // lista curta para gerar à mão num chat (o estilo vai uma vez só, no início)
    list.forEach((d, k) => console.log(`${String(k + 1).padStart(3, '0')} · ${d.name} [${d.id}]\n${shortPrompt(d)}\n`));
    return;
  }
  const {default: sharp} = await import('sharp').catch(() => ({default: null}));
  for (const d of list) {
    const t = Date.now();
    try {
      const png = await generateOpenAI(promptFor(d));
      const raw = path.join(OUT, `${d.id}.png`);
      fs.writeFileSync(raw, png);
      if (sharp) { // 4:5, 960×1200, WebP
        await sharp(png).resize(960, 1200, {fit: 'cover', position: 'centre'}).webp({quality: 86}).toFile(path.join(OUT, `${d.id}.webp`));
        fs.unlinkSync(raw);
      }
      done.add(d.id); fs.writeFileSync(DONE_FILE, JSON.stringify([...done].sort(), null, 1));
      console.log(`${d.id} ok ${((Date.now() - t) / 1000).toFixed(0)}s`);
    } catch (e) { console.error(`${d.id} falhou: ${e.message}`); }
  }
}
main();
