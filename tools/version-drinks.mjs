// Depois do build: carimba uma versão (hash do conteúdo) em todos os módulos do Home Tender.
// O index.html ganha um import map que aponta cada arquivo .js para "arquivo.js?v=<hash>",
// e o style.css / app.js também levam o ?v=. Assim o navegador nunca mistura arquivos de
// versões diferentes depois de um deploy (o GitHub Pages guarda cache por 10 minutos).
import {createHash} from 'node:crypto';
import {readFileSync, writeFileSync, readdirSync, statSync, existsSync} from 'node:fs';
import {join, relative} from 'node:path';

const dir = process.argv[2] || 'dist/drinks';
if (!existsSync(join(dir, 'index.html'))) { console.log(`version-drinks: ${dir}/index.html não existe, nada a fazer`); process.exit(0); }

const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? (f === 'img' ? [] : walk(p)) : [p]; });
const files = walk(dir).filter(f => /\.(js|css)$/.test(f)).sort();
const hash = createHash('sha256');
for (const f of files) hash.update(f).update(readFileSync(f));
const v = hash.digest('hex').slice(0, 10);

const rel = f => relative(dir, f).split('\\').join('/');
const imports = Object.fromEntries(files.filter(f => f.endsWith('.js')).map(f => [`./${rel(f)}`, `./${rel(f)}?v=${v}`]));
const map = `<script type="importmap">${JSON.stringify({imports})}</script>`;

const indexPath = join(dir, 'index.html');
let html = readFileSync(indexPath, 'utf8')
  .replace('href="style.css"', `href="style.css?v=${v}"`)
  .replace('<script type="module" src="app.js"></script>', `${map}\n  <script type="module" src="app.js?v=${v}"></script>`);
if (!html.includes(`app.js?v=${v}`)) throw new Error('version-drinks: não encontrei <script type="module" src="app.js">');
writeFileSync(indexPath, html);
console.log(`version-drinks: ${files.length} arquivos, versão ${v}`);
