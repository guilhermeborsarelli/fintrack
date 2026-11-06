// Home Tender — service worker: deixa o app abrir e mostrar as receitas sem internet.
// O build (tools/version-drinks.mjs) troca os marcadores abaixo pela versão e pela lista de arquivos.
// Página: rede primeiro (sempre a versão mais nova), com a cópia guardada como reserva.
// Arquivos do app e imagens: cache primeiro (os .js/.css vêm com ?v=<versão>).
const VERSION = '__HT_VERSION__';
const PRECACHE = '__HT_FILES__'.split('|').filter(Boolean);
const CACHE = `ht-${VERSION}`;
const RUNTIME = `ht-rt-${VERSION}`;
const SCOPE = self.registration.scope;
const INDEX = new URL('./', SCOPE).href;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll([INDEX, ...PRECACHE.map(f => new URL(f, SCOPE).href)])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('ht-') && k !== CACHE && k !== RUNTIME).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

const keep = (cacheName, req, res) => { if (res && res.ok) { const copy = res.clone(); caches.open(cacheName).then(c => c.put(req, copy)); } return res; };

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then(res => keep(CACHE, INDEX, res)).catch(() => caches.match(INDEX)));
    return;
  }
  if (url.origin === self.location.origin) {
    event.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => keep(RUNTIME, req, res))));
    return;
  }
  if (/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    event.respondWith(caches.match(req).then(hit => {
      const net = fetch(req).then(res => keep(RUNTIME, req, res)).catch(() => hit);
      return hit || net;
    }));
  }
});
