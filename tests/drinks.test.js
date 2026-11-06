import test from 'node:test';
import assert from 'node:assert/strict';
import {DRINKS, DRINK_BY_ID} from '../public/drinks/data.js';
import {analyzeBar, missingFor, toolsFor, stepsFor, validateData} from '../public/drinks/engine.js';
import {drinkSVG} from '../public/drinks/art.js';

const names = rows => rows.map(r => r.drink.id);

test('base de drinks é coerente (copos, ingredientes, clássico de origem)', () => {
  assert.deepEqual(validateData(), []);
  assert.ok(DRINKS.filter(d => d.cat !== 'adaptation').length >= 60);
});

test('Negroni sai exato com gin, Campari e vermute tinto', () => {
  const r = analyzeBar(['gin', 'campari', 'vermute_tinto']);
  assert.ok(names(r.classics).includes('negroni'));
  assert.equal(r.mode, 'classic');
  assert.equal(r.featured.drink.cat === 'adaptation', false);
});

test('sem clássico possível, sugere adaptação reconhecida', () => {
  const r = analyzeBar(['vodka', 'limao', 'acucar']);
  assert.equal(r.classics.length, 0);
  assert.equal(r.mode, 'adaptation');
  assert.ok(names(r.adaptations).includes('caipiroska'));
  assert.equal(r.featured.drink.cat, 'adaptation');
});

test('ingredientes opcionais e substitutos não bloqueiam o drink', () => {
  assert.deepEqual(missingFor(DRINK_BY_ID['whiskey-sour'], new Set(['bourbon', 'siciliano', 'acucar'])), []);
  assert.deepEqual(missingFor(DRINK_BY_ID['pisco-sour'], new Set(['pisco', 'limao', 'acucar', 'ovo', 'angostura'])), []);
  assert.deepEqual(missingFor(DRINK_BY_ID['manhattan'], new Set(['bourbon', 'vermute_tinto'])), ['angostura']);
});

test('quase lá aponta o ingrediente que falta', () => {
  const r = analyzeBar(['cachaca', 'limao']);
  const caipi = r.near.find(x => x.drink.id === 'caipirinha');
  assert.deepEqual(caipi.missing, ['acucar']);
});

test('todo drink tem copo, utensílios, preparo e desenho', () => {
  for (const d of DRINKS) {
    const tools = toolsFor(d);
    assert.ok(tools.includes('dosador'), d.id);
    if (d.method === 'shake') assert.ok(tools.includes('coqueteleira'), d.id);
    if (d.method === 'stir') assert.ok(tools.includes('misturador'), d.id);
    if (d.method === 'muddle') assert.ok(tools.includes('socador'), d.id);
    const steps = stepsFor(d);
    assert.ok(steps.length >= 2, d.id);
    for (const s of steps) assert.doesNotMatch(s, /undefined|\$\{| em a | em o | de a | de o /, `${d.id}: ${s}`);
    const svg = drinkSVG(d);
    assert.match(svg, /^<svg[\s\S]*<\/svg>$/);
    assert.doesNotMatch(svg, /NaN|undefined/, d.id);
  }
});

import {createAuth} from '../public/drinks/auth.js';
const memoryStorage = () => { const m = new Map(); return {getItem: k => m.has(k) ? m.get(k) : null, setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k), dump: m}; };

test('conta local: cria, entra, recusa senha errada e não guarda a senha', async () => {
  const storage = memoryStorage();
  const auth = createAuth(storage);
  assert.equal(auth.current(), null);
  const user = await auth.register({name: 'Ana Brito', email: ' Ana@Exemplo.com ', password: 'segredo1'});
  assert.deepEqual(user, {email: 'ana@exemplo.com', name: 'Ana Brito'});
  assert.equal(auth.current().name, 'Ana Brito');
  assert.doesNotMatch([...storage.dump.values()].join(''), /segredo1/);
  auth.logout();
  assert.equal(auth.current(), null);
  await assert.rejects(auth.login({email: 'ana@exemplo.com', password: 'errada'}), /incorretos/);
  await assert.rejects(auth.login({email: 'ninguem@exemplo.com', password: 'segredo1'}), /incorretos/);
  assert.equal((await auth.login({email: 'ANA@exemplo.com', password: 'segredo1'})).name, 'Ana Brito');
  await assert.rejects(auth.register({name: 'Ana', email: 'ana@exemplo.com', password: 'outra123'}), /Já existe/);
  await assert.rejects(auth.register({name: 'Bia', email: 'bia@', password: 'segredo1'}), /e-mail/);
  await assert.rejects(auth.register({name: 'Bia', email: 'bia@exemplo.com', password: '123'}), /6 caracteres/);
});

import {existsSync} from 'node:fs';
import {STORIES, storyFor, glassWhyFor} from '../public/drinks/stories/index.js';
import {setLang, trIngredient, trPhrase, _dictionaries} from '../public/drinks/i18n.js';
import {INGREDIENTS} from '../public/drinks/data.js';

test('todo drink tem foto 3D, história e porquê do copo nos três idiomas', () => {
  for (const d of DRINKS) {
    assert.ok(existsSync(new URL(`../public/drinks/img/drinks/${d.id}.webp`, import.meta.url)), `foto ${d.id}`);
    assert.ok(STORIES[d.id], `história ${d.id}`);
    for (const lang of ['pt', 'en', 'es']) {
      assert.ok(storyFor(d.id, lang).length > 80, `${d.id} ${lang}`);
      assert.ok(glassWhyFor(d, lang).length > 40, `copo ${d.id} ${lang}`);
    }
  }
  assert.equal(Object.keys(STORIES).length, DRINKS.length);
});

test('preparo e dados traduzidos em inglês e espanhol, sem lacunas', () => {
  for (const lang of ['en', 'es']) {
    setLang(lang);
    for (const id of Object.keys(INGREDIENTS)) assert.ok(_dictionaries.ING[id], `ingrediente ${id}`);
    for (const d of DRINKS) {
      const steps = stepsFor(d, lang);
      assert.ok(steps.length >= 2, `${d.id} ${lang}`);
      for (const s of steps) assert.doesNotMatch(s, /undefined|\$\{/, `${d.id} ${lang}: ${s}`);
      if (d.gtext) assert.ok(_dictionaries.PHRASE[d.gtext], `guarnição sem tradução: ${d.gtext}`);
      for (const l of d.ing) {
        if (l.q) assert.ok(_dictionaries.PHRASE[l.q], `quantidade sem tradução: ${l.q}`);
        if (l.note) assert.ok(_dictionaries.PHRASE[l.note], `nota sem tradução: ${l.note}`);
      }
    }
  }
  setLang('pt');
  assert.equal(trIngredient('limao', 'Limão taiti (lime)'), 'Limão taiti (lime)');
  assert.equal(trPhrase('a gosto'), 'a gosto');
});

import {readFileSync} from 'node:fs';
test('lista oficial IBA completa: 102 coquetéis, 34 por categoria, todos com ficha oficial', () => {
  const specs = JSON.parse(readFileSync(new URL('../tools/generate-photos/iba-specs.json', import.meta.url), 'utf8'));
  const iba = DRINKS.filter(d => d.cat !== 'adaptation');
  assert.equal(iba.length, 102);
  for (const cat of ['unforgettable', 'contemporary', 'newera']) assert.equal(iba.filter(d => d.cat === cat).length, 34, cat);
  const catName = {unforgettable: 'The unforgettables', contemporary: 'Contemporary Classics', newera: 'New Era'};
  for (const d of iba) { assert.ok(specs[d.id], `ficha ${d.id}`); assert.equal(specs[d.id].category, catName[d.cat], `categoria ${d.id}`); }
});

test('nome da marca não muda e o preparo traduzido sai sem resíduos', async () => {
  const html = readFileSync(new URL('../public/drinks/index.html', import.meta.url), 'utf8');
  assert.match(html, /<h1 id="cover-title" class="brand-title">Home Tender<\/h1>/);
  assert.match(html, /<title>Home Tender<\/title>/);
  const {t} = await import('../public/drinks/i18n.js');
  for (const lang of ['pt', 'en', 'es']) {
    setLang(lang);
    assert.match(t('mustBeAdult'), /Home Tender/, `${lang}: marca preservada`);
    for (const d of DRINKS) {
      for (const s of stepsFor(d, lang)) {
        assert.equal((s.match(/\(/g) || []).length, (s.match(/\)/g) || []).length, `${lang} ${d.id}: parênteses em "${s}"`);
        assert.doesNotMatch(s, /\bde el\b|\btrago/, `${lang} ${d.id}: "${s}"`);
      }
    }
  }
  setLang('pt');
});

test('lista de roteiros das fotos cobre todos os drinks sem foto real', () => {
  const numbers = JSON.parse(readFileSync(new URL('../tools/generate-photos/numbers.json', import.meta.url), 'utf8'));
  const photos = JSON.parse(readFileSync(new URL('../public/drinks/img/drinks/photos.json', import.meta.url), 'utf8'));
  const mapped = new Set(Object.values(numbers));
  for (const id of mapped) assert.ok(DRINK_BY_ID[id], `numbers.json aponta para drink inexistente: ${id}`);
  for (const d of DRINKS) assert.ok(mapped.has(d.id) || photos.includes(d.id), `${d.id} sem número na lista de fotos`);
});

test('service worker e manifesto prontos para instalar o app', () => {
  const sw = readFileSync(new URL('../public/drinks/sw.js', import.meta.url), 'utf8');
  assert.match(sw, /__HT_VERSION__/); assert.match(sw, /__HT_FILES__/);
  const manifest = JSON.parse(readFileSync(new URL('../public/drinks/manifest.webmanifest', import.meta.url), 'utf8'));
  for (const icon of manifest.icons) assert.ok(existsSync(new URL(`../public/drinks/${icon.src}`, import.meta.url)), icon.src);
  assert.ok(manifest.icons.some(i => i.purpose === 'maskable'));
});
