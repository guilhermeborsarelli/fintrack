import {DRINKS, DRINK_BY_ID, INGREDIENTS, GROUPS, GLASSES, TOOLS, BASICS, BASE_LABEL} from './data.js';
import {analyzeBar, toolsFor, stepsFor, amount, ingredientName, parentOf, childrenOf, searchDrinks, normalize, missingFor} from './engine.js';
import {toolSVG} from './art.js';
import {createAuth} from './auth.js';
import {introHTML, creditsHTML} from './content.js';
import {storyFor, glassWhyFor, nameFor} from './stories/index.js';
import {LANGS, detectLang, setLang, getLang, t, tm, trIngredient, trGroup, trPhrase, trBase, trGlass, trTool, catLabel, catShort} from './i18n.js';

const view = document.getElementById('view');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

// ── Armazenamento local ──
const store = {
  get(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* modo privado */ } }
};

const auth = createAuth();
const IBA_CATS = ['unforgettable', 'contemporary', 'newera'];
const state = {user: null, bar: new Set(), cat: 'all', base: 'all', q: '', barQ: '', lastList: 'classicos'};
setLang(detectLang(store.get('hometender.lang', null)));

const barKey = () => `hometender.bar.${state.user?.email || 'convidado'}`;
function loadBar() {
  const saved = store.get(barKey(), null) ?? store.get('barnoir.bar', []);
  state.bar = new Set(saved.filter(id => INGREDIENTS[id]));
}
const saveBar = () => store.set(barKey(), [...state.bar]);

// ── Textos traduzidos ──
const dName = d => nameFor(d, getLang());
const ingName = id => trIngredient(id, ingredientName(id));
const shortIng = id => ingName(id).split(' / ')[0].replace(/\s*\(.*\)$/, '');
const ingredientLine = d => [...new Set(d.ing.filter(l => !l.opt && !BASICS.has(l.id)).map(l => shortIng(l.id)))].join(' · ');
const glassOf = d => trGlass(d.glass, GLASSES[d.glass]);
const img = id => `img/drinks/${id}.webp`;
const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

let authMode = 'login';
function applyStaticTexts() {
  document.documentElement.lang = {pt: 'pt-BR', en: 'en', es: 'es'}[getLang()];
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll('[data-lang-switch]').forEach(box => {
    box.innerHTML = LANGS.map(l => `<button type="button" data-lang="${l}" aria-pressed="${l === getLang()}">${l.toUpperCase()}</button>`).join('');
  });
  document.getElementById('auth-submit').textContent = authMode === 'register' ? t('registerSubmit') : t('login');
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-lang]'); if (!b) return;
  setLang(b.dataset.lang); store.set('hometender.lang', getLang());
  applyStaticTexts(); rendered = null;
  if (state.user) route();
});

// ── Componentes ──
const pageHead = (kicker, title, lede) => `<header class="page-head"><p class="kicker">${esc(kicker)}</p><h1>${esc(title)}</h1>${lede ? `<p>${esc(lede)}</p>` : ''}</header>`;

function card(d, {sub = null} = {}) {
  const parent = parentOf(d);
  const kicker = sub ?? (d.cat === 'adaptation' ? t('riffOf', parent ? dName(parent) : '') : catShort(d.cat));
  return `<a class="card" href="#/drink/${d.id}">
    <span class="card-img"><img src="${img(d.id)}" alt="${esc(dName(d))}" loading="lazy" decoding="async"></span>
    <span class="card-body">${kicker ? `<span class="card-kicker">${esc(kicker)}</span>` : ''}<span class="card-name">${esc(dName(d))}</span><span class="card-ing">${esc(ingredientLine(d))}</span></span>
  </a>`;
}

// ── Início ──
function renderIntro() {
  const iba = DRINKS.filter(d => d.cat !== 'adaptation').length;
  const showcase = ['negroni', 'dry-martini', 'old-fashioned', 'margarita', 'mojito', 'espresso-martini'].map(id => ({id, name: dName(DRINK_BY_ID[id])}));
  view.innerHTML = introHTML({name: state.user?.name, counts: {iba, adapt: DRINKS.length - iba}, showcase, labels: {classics: t('classicsTitle'), riffs: t('riffsTitle'), bar: t('barTitle')}});
  view.querySelectorAll('.intro-index a').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); view.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior: 'smooth', block: 'start'});
  }));
}

// ── Catálogo (Clássicos IBA ou Variações) ──
let menuMode = 'classicos';
function renderMenu(mode = menuMode) {
  if (mode !== menuMode) { state.q = ''; state.base = 'all'; state.cat = 'all'; }
  menuMode = mode; state.lastList = mode;
  const riffs = mode === 'variacoes';
  const pool = DRINKS.filter(d => riffs ? d.cat === 'adaptation' : d.cat !== 'adaptation');
  const bases = [...new Set(pool.map(d => BASE_LABEL[d.base]).filter(Boolean))];
  let list = searchDrinks(state.q, pool);
  if (state.base !== 'all') list = list.filter(d => BASE_LABEL[d.base] === state.base);
  const cats = riffs ? ['adaptation'] : state.cat === 'all' ? IBA_CATS : [state.cat];
  const sections = cats.map(cat => {
    const items = list.filter(d => d.cat === cat).sort((a, b) => dName(a).localeCompare(dName(b)));
    if (!items.length) return '';
    return `<section class="shelf" aria-labelledby="h-${cat}">
      ${riffs ? '' : `<div class="shelf-head"><h2 id="h-${cat}">${esc(catLabel(cat))}</h2><span>${esc(t('recipes', items.length))}</span></div>`}
      <div class="grid">${items.map(d => card(d, riffs ? {} : {sub: ''})).join('')}</div>
    </section>`;
  }).join('');
  const head = riffs ? pageHead(t('riffsKicker'), t('riffsTitle'), t('riffsLede')) : pageHead(t('classicsKicker'), t('classicsTitle'), t('classicsLede'));
  const chips = riffs ? '' : `<div class="chips" role="group">${[['all', t('all')], ...IBA_CATS.map(k => [k, catLabel(k)])].map(([k, label]) => `<button class="chip ${state.cat === k ? 'on' : ''}" data-cat="${k}" aria-pressed="${state.cat === k}">${esc(label)}</button>`).join('')}</div>`;
  view.innerHTML = `${head}
    <div class="toolbar" role="search">
      <label class="field"><span class="sr">${esc(t('search'))}</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 L21 21"/></svg><input id="q" type="search" placeholder="${esc(t('search'))}" value="${esc(state.q)}" autocomplete="off"></label>
      <label class="field select"><span class="sr">${esc(t('allBases'))}</span><select id="base"><option value="all">${esc(t('allBases'))}</option>${bases.map(b => `<option value="${esc(b)}" ${state.base === b ? 'selected' : ''}>${esc(trBase(b))}</option>`).join('')}</select></label>
    </div>
    ${chips}
    ${sections || `<p class="empty">${esc(t('noResults'))}</p>`}`;
  view.querySelector('#q').addEventListener('input', e => {
    state.q = e.target.value; const pos = e.target.selectionStart; renderMenu();
    const q = view.querySelector('#q'); q.focus(); q.setSelectionRange(pos, pos);
  });
  view.querySelector('#base').addEventListener('change', e => { state.base = e.target.value; renderMenu(); });
  view.querySelectorAll('[data-cat]').forEach(b => b.addEventListener('click', () => { state.cat = b.dataset.cat; renderMenu(); }));
}

// ── Página do drink ──
function renderDrink(id) {
  const d = DRINK_BY_ID[id];
  if (!d) { location.hash = '#/classicos'; return; }
  const lang = getLang();
  const parent = parentOf(d);
  const kids = childrenOf(d);
  const g = glassOf(d);
  const showHave = state.bar.size > 0;
  const missing = showHave ? missingFor(d, state.bar) : [];
  const ingRows = d.ing.filter(l => !(l.id === 'agua' && !l.q && !l.ml)).map(l => {
    const has = BASICS.has(l.id) || [l.id, ...(l.alt || [])].some(x => state.bar.has(x));
    const mark = showHave ? `<span class="have ${has ? 'yes' : l.opt ? 'opt' : 'no'}" title="${esc(has ? t('youHave') : t('youLack'))}"></span>` : '';
    const alt = l.alt ? ` <em>${esc(t('or'))} ${esc(l.alt.map(ingName).join(' / '))}</em>` : '';
    const note = l.note ? ` <em>(${esc(trPhrase(l.note))})</em>` : '';
    const qty = l.ml != null ? `${String(l.ml).replace('.', lang === 'en' ? '.' : ',')} ml` : trPhrase(amount(l));
    return `<li>${mark}<span class="ing-name">${esc(l.note ? ingName(l.id).replace(/\s*\([^()]*\/[^()]*\)$/, '') : ingName(l.id))}${alt}${note}${l.opt ? ` <em>· ${esc(t('optional'))}</em>` : ''}</span><span class="ing-qty">${esc(qty)}</span></li>`;
  }).join('');
  view.innerHTML = `
    <article class="drink">
      <a class="back" href="#/${state.lastList}">← ${esc(t('back'))}</a>
      <header class="drink-hero">
        <div class="drink-photo"><img src="${img(d.id)}" alt="${esc(dName(d))}"></div>
        <div class="drink-intro">
          <p class="kicker">${esc(catShort(d.cat))}</p>
          <h1>${esc(dName(d))}</h1>
          ${parent ? `<p class="drink-parent">${esc(t('riffPrefix', dName(parent)))}<a href="#/drink/${parent.id}">${esc(dName(parent))}</a></p>` : ''}
          <p class="drink-ing">${esc(ingredientLine(d))}</p>
          <dl class="facts">
            <div><dt>${esc(t('glass'))}</dt><dd>${esc(g.name)}</dd></div>
            <div><dt>${esc(t('method'))}</dt><dd>${esc(tm('methods', d.method))}</dd></div>
            <div><dt>${esc(t('garnish'))}</dt><dd>${esc(d.gtext ? cap(trPhrase(d.gtext)) : '—')}</dd></div>
            <div><dt>${esc({pt: 'Serviço', en: 'Serve', es: 'Servicio'}[lang])}</dt><dd>${esc(tm('serveLabel', d.serve))}</dd></div>
          </dl>
          ${showHave ? `<p class="status ${missing.length ? 'no' : 'yes'}">${esc(missing.length ? t('lacks', missing.map(ingName).join(', ')) : t('canMake'))}</p>` : ''}
        </div>
      </header>

      <section class="drink-sec story"><h2>${esc(t('story'))}</h2><p>${esc(storyFor(d.id, lang))}</p></section>

      <div class="drink-cols">
        <section class="drink-sec"><h2>${esc(t('ingredients'))}</h2><ul class="ing-list">${ingRows}</ul></section>
        <section class="drink-sec"><h2>${esc(t('method'))}</h2><ol class="steps">${stepsFor(d, lang).map(s => `<li>${esc(s)}</li>`).join('')}</ol></section>
      </div>

      <div class="drink-cols">
        <section class="drink-sec glass-sec"><h2>${esc(t('whyGlass'))}</h2><h3>${esc(g.name)}</h3><p>${esc(glassWhyFor(d, lang))}</p></section>
        <section class="drink-sec"><h2>${esc(t('tools'))}</h2><ul class="tool-list">${toolsFor(d).map(tid => `<li>${toolSVG(tid, 26)}<span>${esc(trTool(tid, TOOLS[tid]).name)}</span></li>`).join('')}</ul></section>
      </div>

      ${parent ? `<section class="drink-sec related"><h2>${esc(t('originClassic'))}</h2><div class="grid small">${card(parent)}</div></section>` : ''}
      ${kids.length ? `<section class="drink-sec related"><h2>${esc(t('riffsOfThis'))}</h2><div class="grid small">${kids.map(k => card(k)).join('')}</div></section>` : ''}
    </article>`;
  document.title = `${dName(d)} · Home Tender`;
}

// ── Meu Bar ──
const PRESETS = {
  presetHome: ['cachaca', 'vodka', 'limao', 'acucar', 'laranja', 'soda', 'cola', 'hortela'],
  presetAperitivo: ['gin', 'campari', 'vermute_tinto', 'vermute_seco', 'aperol', 'espumante', 'soda', 'laranja', 'siciliano'],
  presetWhiskey: ['bourbon', 'scotch', 'vermute_tinto', 'angostura', 'acucar', 'siciliano', 'mel', 'cereja', 'soda']
};

function renderBar() {
  const q = normalize(state.barQ);
  const groups = GROUPS.map(gp => {
    const ids = Object.entries(INGREDIENTS).filter(([id, v]) => v.group === gp && !BASICS.has(id) && (!q || normalize(v.name).includes(q) || normalize(ingName(id)).includes(q)));
    if (!ids.length) return '';
    return `<fieldset class="ing-group"><legend>${esc(trGroup(gp))}</legend><div class="ing-chips">${ids.map(([id]) => `<button type="button" class="ing ${state.bar.has(id) ? 'on' : ''}" data-ing="${id}" aria-pressed="${state.bar.has(id)}">${esc(ingName(id))}</button>`).join('')}</div></fieldset>`;
  }).join('');
  view.innerHTML = `${pageHead(t('barKicker'), t('barTitle'), t('barLede'))}
    <div class="bar-layout">
      <section class="panel bar-picker" aria-labelledby="bar-h">
        <div class="panel-head"><h2 id="bar-h">${esc(t('barShelf'))}</h2><span id="bar-count">${esc(t('selected', state.bar.size))}</span></div>
        <div class="presets">${Object.keys(PRESETS).map(p => `<button type="button" class="chip ghost" data-preset="${p}">+ ${esc(t(p))}</button>`).join('')}<button type="button" class="chip ghost danger" id="clear" ${state.bar.size ? '' : 'disabled'}>${esc(t('clear'))}</button></div>
        <label class="field"><span class="sr">${esc(t('barFilter'))}</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 L21 21"/></svg><input id="barq" type="search" placeholder="${esc(t('barFilter'))}" value="${esc(state.barQ)}" autocomplete="off"></label>
        <div id="groups">${groups || `<p class="empty">${esc(t('noResults'))}</p>`}</div>
      </section>
      <section class="bar-results" id="results" aria-live="polite"></section>
    </div>
    <a href="#results" class="results-fab" id="fab"></a>`;
  view.querySelector('#barq').addEventListener('input', e => {
    const pos = e.target.selectionStart; state.barQ = e.target.value; renderBar();
    const el = view.querySelector('#barq'); el.focus(); el.setSelectionRange(pos, pos);
  });
  view.querySelector('#groups').addEventListener('click', e => {
    const b = e.target.closest('[data-ing]'); if (!b) return;
    const id = b.dataset.ing;
    state.bar.has(id) ? state.bar.delete(id) : state.bar.add(id);
    b.classList.toggle('on'); b.setAttribute('aria-pressed', state.bar.has(id));
    saveBar(); renderResults();
    view.querySelector('#clear').disabled = !state.bar.size;
    view.querySelector('#bar-count').textContent = t('selected', state.bar.size);
  });
  view.querySelectorAll('[data-preset]').forEach(b => b.addEventListener('click', () => { PRESETS[b.dataset.preset].forEach(id => state.bar.add(id)); saveBar(); renderBar(); }));
  view.querySelector('#clear').addEventListener('click', () => { state.bar.clear(); saveBar(); renderBar(); });
  view.querySelector('#fab').addEventListener('click', e => { e.preventDefault(); view.querySelector('#results').scrollIntoView({behavior: 'smooth'}); });
  renderResults();
}

function resultRow(row, near = false) {
  const d = row.drink; const parent = parentOf(d);
  const tag = near ? `<span class="tag miss">${esc(t('missing'))}: ${esc(row.missing.map(ingName).join(', '))}</span>`
    : d.cat === 'adaptation' ? `<span class="tag riff">${esc(t('riffOf', parent ? dName(parent) : ''))}</span>` : `<span class="tag iba">${esc(catShort(d.cat))}</span>`;
  return `<li><a class="result" href="#/drink/${d.id}"><img src="${img(d.id)}" alt="" loading="lazy"><span class="result-body"><span class="result-name">${esc(dName(d))}</span>${tag}</span></a></li>`;
}

function renderResults() {
  const box = view.querySelector('#results'); const fab = view.querySelector('#fab');
  if (!state.bar.size) {
    box.innerHTML = `<div class="panel waiting"><img src="${img('dry-martini')}" alt=""><h3>${esc(t('waitingTitle'))}</h3><p>${esc(t('waitingText'))}</p></div>`;
    fab.hidden = true; return;
  }
  const r = analyzeBar(state.bar);
  const total = r.classics.length + r.adaptations.length;
  fab.hidden = false; fab.textContent = total ? t('seeDrinks', total) : t('seeSuggestions');
  let html = '';
  if (r.featured) {
    const d = r.featured.drink; const parent = parentOf(d);
    html += `<article class="featured">
      <a href="#/drink/${d.id}" class="featured-img"><img src="${img(d.id)}" alt="${esc(dName(d))}"></a>
      <div class="featured-body">
        <p class="kicker">${esc(t('housePick'))}</p>
        <h3>${esc(dName(d))}</h3>
        <p class="verdict">${esc(r.mode === 'adaptation' ? t('pickRiff', parent ? dName(parent) : '') : t('pickClassic'))}</p>
        <p class="drink-ing">${esc(ingredientLine(d))}</p>
        <a class="btn" href="#/drink/${d.id}">${esc(t('seeRecipe'))}</a>
      </div>
    </article>`;
  } else html += `<article class="panel"><p class="verdict">${esc(t('pickNone'))}</p></article>`;
  if (r.classics.length) html += `<h3 class="res-h">${esc(t('possibleClassics'))} <span>${r.classics.length}</span></h3><ul class="results">${r.classics.map(x => resultRow(x)).join('')}</ul>`;
  if (r.adaptations.length) html += `<h3 class="res-h">${esc(t('possibleRiffs'))} <span>${r.adaptations.length}</span></h3><ul class="results">${r.adaptations.map(x => resultRow(x)).join('')}</ul>`;
  if (r.near.length) html += `<h3 class="res-h">${esc(t('almost'))} <span>${r.near.length}</span></h3><ul class="results">${r.near.map(x => resultRow(x, true)).join('')}</ul>`;
  box.innerHTML = html;
}

// ── Copos e utensílios ──
function renderGlossary() {
  const usage = id => DRINKS.filter(d => d.glass === id);
  const toolUse = id => DRINKS.filter(d => toolsFor(d).includes(id)).length;
  view.innerHTML = `${pageHead(t('toolsKicker'), t('tabTools'), t('toolsLede'))}
    <section class="shelf"><div class="shelf-head"><h2>${esc(t('glassesTitle'))}</h2></div>
      <div class="grid glasses">${Object.keys(GLASSES).map(id => { const g = trGlass(id, GLASSES[id]); const u = usage(id); return `<article class="gloss">
        <span class="card-img"><img src="${img(u[0].id)}" alt="" loading="lazy"></span>
        <div class="gloss-body"><h3>${esc(g.name)}</h3><p>${esc(g.desc)}</p><p class="uses">${u.slice(0, 5).map(d => `<a href="#/drink/${d.id}">${esc(dName(d))}</a>`).join(' · ')}</p></div>
      </article>`; }).join('')}</div>
    </section>
    <section class="shelf"><div class="shelf-head"><h2>${esc(t('toolsTitle'))}</h2></div>
      <div class="tools-grid">${Object.keys(TOOLS).map(id => { const tl = trTool(id, TOOLS[id]); return `<article class="tool"><span class="tool-ico">${toolSVG(id, 40)}</span><div><h3>${esc(tl.name)}</h3><p>${esc(tl.desc)}</p><p class="uses">${esc(t('usedIn', toolUse(id)))}</p></div></article>`; }).join('')}</div>
    </section>
    ${creditsHTML()}`;
}

// ── Capa e login ──
const cover = document.getElementById('cover');
const shell = document.getElementById('shell');
const form = document.getElementById('auth-form');
const authError = document.getElementById('auth-error');

function setAuthMode(mode) {
  authMode = mode;
  document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.mode === mode)));
  form.querySelectorAll('[data-only="register"]').forEach(el => { el.hidden = mode !== 'register'; });
  form.elements['password'].autocomplete = mode === 'register' ? 'new-password' : 'current-password';
  document.getElementById('auth-submit').textContent = mode === 'register' ? t('registerSubmit') : t('login');
  authError.hidden = true;
}
document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => setAuthMode(b.dataset.mode)));

form.addEventListener('submit', async e => {
  e.preventDefault();
  const submit = document.getElementById('auth-submit');
  authError.hidden = true; submit.disabled = true;
  try {
    const f = form.elements;
    const data = {name: f['name'].value, email: f['email'].value, password: f['password'].value};
    if (authMode === 'register' && !f['adult'].checked) throw new Error(t('mustBeAdult'));
    state.user = authMode === 'register' ? await auth.register(data) : await auth.login(data);
    form.reset();
    enterApp();
  } catch (err) { authError.textContent = err.message; authError.hidden = false; }
  finally { submit.disabled = false; }
});

document.getElementById('logout').addEventListener('click', () => {
  auth.logout(); state.user = null; rendered = null; state.bar = new Set();
  location.hash = '#/inicio'; showCover();
});

function showCover() {
  shell.hidden = true; cover.hidden = false;
  setAuthMode(auth.hasAccounts() ? 'login' : 'register');
  document.title = 'Home Tender';
}

function enterApp() {
  cover.hidden = true; shell.hidden = false;
  document.getElementById('user-name').textContent = state.user.name.split(' ')[0];
  loadBar(); rendered = null;
  if (!location.hash || location.hash === '#/') location.hash = '#/inicio';
  route(); window.scrollTo({top: 0});
}

// ── Rotas ──
const TABS = {inicio: renderIntro, classicos: () => renderMenu('classicos'), variacoes: () => renderMenu('variacoes'), bar: renderBar, utensilios: renderGlossary};
const ALIASES = {cardapio: 'classicos', adaptacoes: 'variacoes'};
const TAB_TITLE = {inicio: 'tabHome', classicos: 'tabClassics', variacoes: 'tabRiffs', bar: 'tabBar', utensilios: 'tabTools'};
let rendered = null;
const scrollMemo = {};
function route() {
  if (!state.user) { showCover(); return; }
  let [, tab = 'inicio', id] = location.hash.replace(/^#/, '').split('/');
  tab = ALIASES[tab] || tab;
  if (rendered && rendered !== 'drink') scrollMemo[rendered] = window.scrollY;
  if (tab === 'drink') {
    if (rendered && rendered !== 'drink') state.lastList = rendered;
    renderDrink(decodeURIComponent(id || '')); rendered = 'drink';
    markTab(state.lastList); window.scrollTo({top: 0}); return;
  }
  const tabName = TABS[tab] ? tab : 'inicio';
  document.title = `Home Tender · ${t(TAB_TITLE[tabName])}`;
  const fromDrink = rendered === 'drink';
  if (rendered !== tabName) TABS[tabName]();
  rendered = tabName;
  window.scrollTo({top: fromDrink ? (scrollMemo[tabName] || 0) : 0});
  markTab(tabName);
}
function markTab(tab) {
  document.querySelectorAll('[data-tab]').forEach(a => { const on = a.dataset.tab === tab; a.classList.toggle('on', on); on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'); });
}
window.addEventListener('hashchange', route);
applyStaticTexts();
state.user = auth.current();
if (state.user) enterApp(); else showCover();
