// Gera as fotos 3D dos drinks: node tools/render-drinks/render.cjs [id ...]
// Sobe um servidor estático na raiz do repositório, abre render.html no Chromium e salva WebP.
const http = require('node:http'), fs = require('node:fs'), path = require('node:path');
const {chromium} = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'public/drinks/img/drinks');
const TYPES = {'.js': 'text/javascript', '.html': 'text/html', '.json': 'application/json'};
(async () => {
  const server = http.createServer((req, res) => {
    const file = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, {'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream'}); fs.createReadStream(file).pipe(res);
  }).listen(0);
  const port = server.address().port;
  const {DRINKS} = await import(path.join(ROOT, 'public/drinks/data.js'));
  const only = process.argv.slice(2);
  const list = only.length ? DRINKS.filter(d => only.includes(d.id)) : DRINKS;
  fs.mkdirSync(OUT, {recursive: true});
  const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
  const browser = await chromium.launch({executablePath: exe, args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']});
  const page = await browser.newPage();
  page.on('pageerror', e => console.error('pageerror', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('console', m.text()); });
  await page.goto(`http://localhost:${port}/tools/render-drinks/render.html`);
  await page.waitForFunction('window.ready', null, {timeout: 60000});
  for (const d of list) {
    const t = Date.now();
    const spec = {id: d.id, glass: d.glass, color: d.color, color2: d.color2, layerTop: d.layerTop, layerH: d.layerH, foam: d.foam, foamColor: d.foamColor,
      serve: d.serve, garnish: [...(d.garnish || []), ...(d.method === 'muddle' && d.ing.some(l => l.id === 'limao' && /gomo/.test(l.q || '')) ? ['lime_chunks'] : [])], rim: d.rim, bubbles: d.bubbles, straw: d.straw,
      creamy: d.creamy ?? (!d.layerTop && !d.foamColor && d.ing.some(l => !l.opt && ['creme_leite', 'creme_coco'].includes(l.id)) && d.id !== 'ramos-fizz')};
    const url = await page.evaluate(s => window.renderDrink(s), spec);
    fs.writeFileSync(path.join(OUT, d.id + '.webp'), Buffer.from(url.split(',')[1], 'base64'));
    console.log(d.id, ((Date.now() - t) / 1000).toFixed(1) + 's');
  }
  await browser.close(); server.close();
})();
