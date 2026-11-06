// Home Tender — regras: o que dá para fazer com o bar do usuário, utensílios e preparo.
import {DRINKS, DRINK_BY_ID, INGREDIENTS, GLASSES, TOOLS, BASICS} from './data.js';

const CITRUS = new Set(['limao', 'siciliano', 'laranja', 'toranja']);
const ORDER = {unforgettable: 0, contemporary: 1, newera: 2, adaptation: 3};

const options = line => [line.id, ...(line.alt || [])];

/** Ingredientes obrigatórios que faltam (ids únicos). Opcionais e básicos não contam. */
export function missingFor(drink, have) {
  const missing = [];
  for (const line of drink.ing) {
    if (line.opt) continue;
    if (options(line).some(id => BASICS.has(id) || have.has(id))) continue;
    if (!missing.includes(line.id)) missing.push(line.id);
  }
  return missing;
}

/** Ingredientes distintos (não básicos) usados pelo drink. */
export function requiredIds(drink) {
  return [...new Set(drink.ing.filter(l => !l.opt && !BASICS.has(l.id)).map(l => l.id))];
}

const byRichness = (a, b) => requiredIds(b.drink).length - requiredIds(a.drink).length || ORDER[a.drink.cat] - ORDER[b.drink.cat] || a.drink.name.localeCompare(b.drink.name);

/**
 * Analisa o bar do usuário.
 * - classics: clássicos IBA possíveis
 * - adaptations: adaptações reconhecidas possíveis
 * - near: drinks a 1 (ou 2) ingredientes de distância
 * - featured: a sugestão da casa (clássico se houver; senão, adaptação)
 */
export function analyzeBar(haveList, drinks = DRINKS) {
  const have = haveList instanceof Set ? haveList : new Set(haveList);
  const rows = drinks.map(drink => ({drink, missing: missingFor(drink, have)}));
  const ok = rows.filter(r => r.missing.length === 0);
  const classics = ok.filter(r => r.drink.cat !== 'adaptation').sort(byRichness);
  const adaptations = ok.filter(r => r.drink.cat === 'adaptation').sort(byRichness);
  // "Quase lá" só faz sentido se o usuário já tem algo em comum com o drink.
  const shares = r => requiredIds(r.drink).some(id => have.has(id));
  let near = rows.filter(r => r.missing.length === 1 && shares(r));
  if (near.length < 4) near = near.concat(rows.filter(r => r.missing.length === 2 && shares(r)));
  near.sort((a, b) => a.missing.length - b.missing.length || ORDER[a.drink.cat] - ORDER[b.drink.cat] || a.drink.name.localeCompare(b.drink.name));
  const featured = classics[0] || adaptations[0] || null;
  return {classics, adaptations, near: near.slice(0, 12), featured, mode: classics.length ? 'classic' : adaptations.length ? 'adaptation' : 'none'};
}

/** Utensílios necessários, derivados do método, do serviço e das guarnições. */
export function toolsFor(drink) {
  const list = ['dosador'];
  const add = id => { if (!list.includes(id)) list.push(id); };
  if (drink.method === 'shake') { add('coqueteleira'); add('hawthorne'); if (drink.serve === 'up' || drink.serve === 'neat' || drink.serve === 'crushed') add('peneira'); }
  if (drink.method === 'stir') { add('misturador'); add('bailarina'); add('julep_strainer'); }
  if (drink.method === 'build') add('bailarina');
  if (drink.method === 'muddle') { add('socador'); add('bailarina'); }
  if (drink.method === 'blend') add('liquidificador');
  if (drink.ing.some(l => !l.opt && CITRUS.has(l.id) && (l.ml || /suco|gomo|limão|disco/i.test(l.q || '')))) add('espremedor');
  const g = drink.garnish || [];
  if (g.some(x => /twist|peel/.test(x))) add('descascador');
  if (g.some(x => /wheel|wedge|pineapple|celery/.test(x))) add('faca');
  for (const extra of drink.tools || []) add(extra);
  if (drink.method === 'shake' && (drink.steps || []).some(s => /macere/i.test(s))) add('socador');
  return list.filter(id => TOOLS[id]);
}

export function amount(line) {
  if (line.ml != null) return `${String(line.ml).replace('.', ',')} ml`;
  return line.q || '';
}

export function ingredientName(id) { return INGREDIENTS[id]?.name || id; }

const lower = s => s.charAt(0).toLowerCase() + s.slice(1);
const joinPt = parts => parts.length <= 1 ? parts.join('') : parts.slice(0, -1).join(', ') + ' e ' + parts.at(-1);
const shortName = id => lower(ingredientName(id).split(' / ')[0].replace(/\s*\(.*\)$/, ''));

/** Passo a passo: usa o roteiro próprio do drink ou gera a partir do método. */
export function stepsFor(drink) {
  if (drink.steps) return drink.steps;
  const glass = GLASSES[drink.glass];
  const main = [...new Set(drink.ing.filter(l => !l.top && !l.opt && l.id !== 'ovo').map(l => shortName(l.id)))];
  const tops = drink.ing.filter(l => l.top).map(l => shortName(l.id));
  const garnish = drink.gtext ? `Decore com ${drink.gtext}.` : null;
  const steps = [];
  const up = drink.serve === 'up' || drink.serve === 'neat';
  const cold = glass.the.startsWith('o ') ? 'gelado' : 'gelada';
  if (up) steps.push(`Gele ${glass.the} (com gelo e água ou no congelador).`);
  if (drink.rim === 'salt') steps.push(`Passe limão na borda d${glass.the} e mergulhe a borda no sal.`);
  if (drink.rim === 'sugar') steps.push(`Passe limão na borda d${glass.the} e mergulhe a borda no açúcar.`);
  if (drink.method === 'shake') {
    steps.push(`Na coqueteleira, junte ${joinPt(main)}.`);
    if (drink.egg && drink.ing.some(l => l.id === 'ovo' && !l.opt)) {
      steps.push('Adicione a clara e bata sem gelo por 10 s (dry shake) para emulsionar.');
      steps.push('Encha de gelo e bata vigorosamente por mais 10–12 s.');
    } else if (drink.egg) {
      steps.push('Se usar clara, bata primeiro sem gelo (dry shake). Depois encha de gelo e bata por 10–12 s.');
    } else steps.push('Encha de gelo e bata vigorosamente por 10–12 s.');
    if (up) steps.push(`Faça a dupla coagem (hawthorne + peneira) para ${glass.the} ${cold}, sem gelo.`);
    else if (drink.serve === 'crushed') steps.push(`Coe sobre gelo picado n${glass.the}.`);
    else steps.push(`Coe sobre gelo novo n${glass.the}.`);
  } else if (drink.method === 'stir') {
    steps.push(`No copo misturador, junte ${joinPt(main)}.`);
    steps.push('Encha de gelo e mexa com a colher bailarina por 20–30 s, até gelar e diluir.');
    steps.push(up ? `Coe com o coador julep para ${glass.the} ${cold}.` : `Coe sobre gelo novo n${glass.the}.`);
  } else if (drink.method === 'blend') {
    steps.push(`No liquidificador, junte ${joinPt(main)} e uma concha de gelo picado.`);
    steps.push('Bata até ficar liso e cremoso.');
    steps.push(`Sirva n${glass.the}.`);
  } else {
    if (!up && drink.serve !== 'hot') steps.push(`Encha ${glass.the} com ${drink.serve === 'crushed' ? 'gelo picado' : 'gelo'}.`);
    steps.push(`Adicione ${joinPt(main)}.`);
    if (!tops.length) steps.push('Mexa delicadamente com a colher bailarina.');
  }
  if (tops.length) steps.push(`Complete com ${joinPt(tops)} e misture delicadamente, de baixo para cima.`);
  if (garnish) steps.push(garnish);
  return steps;
}

export function parentOf(drink) { return drink.parent ? DRINK_BY_ID[drink.parent] : null; }

export function childrenOf(drink) { return DRINKS.filter(d => d.parent === drink.id); }

export function searchDrinks(query, drinks = DRINKS) {
  const q = normalize(query.trim());
  if (!q) return drinks;
  return drinks.filter(d => normalize(d.name).includes(q) || d.ing.some(l => normalize(ingredientName(l.id)).includes(q)));
}

export function normalize(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }

/** Coerência da base de dados (usada nos testes). */
export function validateData() {
  const problems = [];
  for (const d of DRINKS) {
    if (!GLASSES[d.glass]) problems.push(`${d.id}: copo ${d.glass}`);
    for (const l of d.ing) for (const id of options(l)) if (!INGREDIENTS[id]) problems.push(`${d.id}: ingrediente ${id}`);
    if (d.parent && !DRINK_BY_ID[d.parent]) problems.push(`${d.id}: parent ${d.parent}`);
    if (d.cat === 'adaptation' && !d.parent) problems.push(`${d.id}: adaptação sem clássico de origem`);
    for (const t of d.tools || []) if (!TOOLS[t]) problems.push(`${d.id}: utensílio ${t}`);
  }
  const ids = DRINKS.map(d => d.id);
  if (new Set(ids).size !== ids.length) problems.push('ids duplicados');
  return problems;
}
