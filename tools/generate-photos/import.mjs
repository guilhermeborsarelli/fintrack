// Importa as fotos geradas à mão (ChatGPT etc.) para o Home Tender.
//   node tools/generate-photos/import.mjs <pasta-ou-arquivo.zip> [--dry]
// Cada arquivo é ligado ao drink pelo número da lista docs/FOTOS-ROTEIROS.txt
// (ex.: 001.png, "17 - Negroni.jpg") ou pelo nome do drink no arquivo (ex.: negroni.png).
// A imagem é recortada em 4:5, reduzida para 960×1200 e salva em WebP
// (public/drinks/img/drinks/<id>.webp); o id entra em photos.json, que protege a foto
// de ser sobrescrita pelos renders 3D. Precisa do ImageMagick (comando "convert").
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const OUT = path.join(ROOT, 'public/drinks/img/drinks');
const PHOTOS = path.join(OUT, 'photos.json');
const NUMBERS = JSON.parse(fs.readFileSync(path.join(HERE, 'numbers.json'), 'utf8'));
const {DRINKS} = await import(path.join(ROOT, 'public/drinks/data.js'));

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const src = args.find(a => !a.startsWith('--'));
if (!src) { console.error('uso: node tools/generate-photos/import.mjs <pasta-ou-zip> [--dry]'); process.exit(1); }

let dir = path.resolve(src);
if (/\.zip$/i.test(src)) {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ht-fotos-'));
  execFileSync('unzip', ['-q', '-o', path.resolve(src), '-d', dir]);
}
const walk = d => fs.readdirSync(d, {withFileTypes: true}).flatMap(e => e.isDirectory() ? (e.name.startsWith('__MACOSX') ? [] : walk(path.join(d, e.name))) : [path.join(d, e.name)]);
const files = walk(dir).filter(f => /\.(png|jpe?g|webp)$/i.test(f) && !path.basename(f).startsWith('.'));

const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const byName = DRINKS.map(d => [norm(d.name), d.id]).concat(DRINKS.map(d => [norm(d.id), d.id])).sort((a, b) => b[0].length - a[0].length);
function idFor(file) {
  const base = path.basename(file).replace(/\.[^.]+$/, '');
  const num = base.match(/^\D*?(\d{1,3})(?!\d)/);
  if (num && NUMBERS[num[1].padStart(3, '0')]) return NUMBERS[num[1].padStart(3, '0')];
  const n = norm(base);
  return byName.find(([key]) => key && n.includes(key))?.[1] || null;
}

const photos = new Set(JSON.parse(fs.readFileSync(PHOTOS, 'utf8')));
const done = [], unknown = [], seen = new Map();
for (const f of files.sort()) {
  const id = idFor(f);
  if (!id) { unknown.push(path.basename(f)); continue; }
  if (seen.has(id)) console.log(`aviso: ${path.basename(f)} e ${seen.get(id)} são do mesmo drink (${id}); fica a última.`);
  seen.set(id, path.basename(f));
  if (!dry) {
    execFileSync('convert', [f, '-auto-orient', '-resize', '960x1200^', '-gravity', 'center', '-extent', '960x1200', '-strip', '-quality', '86', path.join(OUT, `${id}.webp`)]);
    photos.add(id);
  }
  done.push(`${path.basename(f)} → ${id}`);
}
if (!dry) fs.writeFileSync(PHOTOS, JSON.stringify([...photos].sort()));
console.log(done.join('\n'));
console.log(`\n${done.length} foto(s) ${dry ? 'reconhecida(s) (simulação)' : 'importada(s)'}.`);
if (unknown.length) console.log(`Sem drink identificado (renomeie com o número da lista): ${unknown.join(', ')}`);
