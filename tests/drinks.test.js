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
