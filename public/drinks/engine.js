// Home Tender — regras: o que dá para fazer com o bar do usuário, utensílios e preparo.
import {DRINKS, DRINK_BY_ID, INGREDIENTS, GLASSES, TOOLS, BASICS} from './data.js';
import {getLang, setLang, trGlass, trIngredient, trPhrase} from './i18n.js';
import {STEPS, TEMPLATES} from './steps-i18n.js';

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

// Marcas e nomes próprios mantêm a maiúscula dentro da frase (Campari, Angostura, Scotch...).
const PROPER = /^(Campari|Aperol|Cynar|Fernet|Drambuie|Bénédictine|Galliano|Grand Marnier|Frangelico|Angostura|Peychaud|Lillet|Tabasco|Worcestershire|Scotch|Irish|Champagne|Cointreau|Chartreuse|Prosecco|Cherry Heering)/;
const lower = s => PROPER.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1);

/** Passo a passo no idioma pedido: roteiro próprio do drink (traduzido) ou gerado a partir do método. */
export function stepsFor(drink, lang = getLang()) {
  if (drink.steps) return lang === 'pt' ? drink.steps : (STEPS[drink.id]?.[lang] || drink.steps);
  const T = TEMPLATES[lang] || TEMPLATES.pt;
  const prevLang = getLang(); setLang(lang);
  try {
    const glass = trGlass(drink.glass, GLASSES[drink.glass]);
    const shortName = id => lower(trIngredient(id, ingredientName(id)).replace(/\s*\(.*\)$/, '').split(' / ')[0]);
    const joinL = parts => parts.length <= 1 ? parts.join('') : parts.slice(0, -1).join(', ') + ` ${T.and} ` + parts.at(-1);
    const main = [...new Set(drink.ing.filter(l => !l.top && !l.side && !l.opt && l.id !== 'ovo').map(l => shortName(l.id)))];
    const tops = drink.ing.filter(l => l.top).map(l => shortName(l.id));
    const steps = [];
    const up = drink.serve === 'up' || drink.serve === 'neat';
    if (up) steps.push(T.chill(glass));
    if (drink.rim === 'salt') steps.push(T.rimSalt(glass));
    if (drink.rim === 'sugar') steps.push(T.rimSugar(glass));
    if (drink.method === 'shake') {
      steps.push(T.shakeIn(joinL(main)));
      if (drink.egg && drink.ing.some(l => l.id === 'ovo' && !l.opt)) { steps.push(T.dryShake); steps.push(T.shakeAfterDry); }
      else if (drink.egg) steps.push(T.optionalEgg);
      else steps.push(T.shake);
      if (up) steps.push(T.doubleStrain(glass));
      else if (drink.serve === 'crushed') steps.push(T.strainCrushed(glass));
      else steps.push(T.strainRocks(glass));
    } else if (drink.method === 'stir') {
      steps.push(T.stirIn(joinL(main)));
      steps.push(T.stir);
      steps.push(up ? T.stirStrainUp(glass) : T.strainRocks(glass));
    } else if (drink.method === 'blend') {
      steps.push(T.blendIn(joinL(main)));
      steps.push(T.blend);
      steps.push(T.serveIn(glass));
    } else {
      if (!up && drink.serve !== 'hot') steps.push(T.fill(glass, drink.serve === 'crushed'));
      steps.push(T.add(joinL(main)));
      if (!tops.length) steps.push(T.stirGently);
    }
    if (tops.length) steps.push(T.top(joinL(tops)));
    const sides = drink.ing.filter(l => l.side).map(l => shortName(l.id));
    if (sides.length) steps.push(T.side(joinL(sides)));
    if (drink.gtext) steps.push(T.garnish(trPhrase(drink.gtext)));
    return steps;
  } finally { setLang(prevLang); }
}

export function parentOf(drink) { return drink.parent ? DRINK_BY_ID[drink.parent] : null; }

export function childrenOf(drink) { return DRINKS.filter(d => d.parent === drink.id); }

export function searchDrinks(query, drinks = DRINKS) {
  const q = normalize(query.trim());
  if (!q) return drinks;
  return drinks.filter(d => normalize(d.name).includes(q) || d.ing.some(l => normalize(ingredientName(l.id)).includes(q) || normalize(trIngredient(l.id, ingredientName(l.id))).includes(q)));
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
