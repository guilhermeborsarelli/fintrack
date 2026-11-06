import {CATEGORIES, DRINKS, DRINK_BY_ID, INGREDIENTS, GROUPS, GLASSES, TOOLS, BASICS, BASE_LABEL} from './data.js';
import {analyzeBar, toolsFor, stepsFor, amount, ingredientName, parentOf, childrenOf, searchDrinks, normalize, missingFor} from './engine.js';
import {drinkSVG, glassSVG, toolSVG, ornament, divider, cornerFlourish, artDefs} from './art.js';
import {createAuth} from './auth.js';
import {introHTML, creditsHTML} from './content.js';

const view = document.getElementById('view');
const sheet = document.getElementById('sheet');
const sheetCard = sheet.querySelector('.sheet');
document.body.insertAdjacentHTML('afterbegin', artDefs());
const CORNERS = ['tl', 'tr', 'bl', 'br'].map(c => `<span class="corner ${c}" aria-hidden="true">${cornerFlourish(58)}</span>`).join('');

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

// ── Estado (o bar do usuário fica só neste aparelho) ──
const store = {
  get(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* modo privado */ } }
};
const auth = createAuth();
const state = {
  user: null, bar: new Set(),
  cat: {classicos: 'all', adaptacoes: 'adaptation'}, base: 'all', q: '', barQ: ''
};
const barKey = () => `hometender.bar.${state.user?.email || 'convidado'}`;
function loadBar() {
  // O bar de cada pessoa fica separado; o bar salvo antes das contas passa para a primeira conta.
  const saved = store.get(barKey(), null) ?? store.get('barnoir.bar', []);
  state.bar = new Set(saved.filter(id => INGREDIENTS[id]));
}
const saveBar = () => store.set(barKey(), [...state.bar]);
const IBA_CATS = ['unforgettable', 'contemporary', 'newera'];

const PRESETS = {
  'Bar de casa': ['cachaca', 'vodka', 'limao', 'acucar', 'laranja', 'soda', 'cola', 'hortela'],
  'Bar do aperitivo': ['gin', 'campari', 'vermute_tinto', 'vermute_seco', 'aperol', 'espumante', 'soda', 'laranja', 'siciliano'],
  'Bar do whiskey': ['bourbon', 'scotch', 'vermute_tinto', 'angostura', 'acucar', 'siciliano', 'mel', 'cereja', 'soda']
};

const ingredientLine = d => [...new Set(d.ing.filter(l => !l.opt && !BASICS.has(l.id)).map(l => ingredientName(l.id).split(' / ')[0].replace(/\s*\(.*\)$/, '')))].join(' · ');

// ── Cabeçalho editorial das páginas ──
const pageHead = (kicker, title, lede) => `<header class="page-head"><p class="kicker">${kicker}</p><h1>${title}</h1>${lede ? `<p>${lede}</p>` : ''}<div class="page-orn">${ornament(200)}</div></header>`;

// ── Início ──
function renderIntro() {
  const iba = DRINKS.filter(d => d.cat !== 'adaptation').length;
  view.innerHTML = introHTML({name: state.user?.name, counts: {iba, adapt: DRINKS.length - iba}});
  view.querySelectorAll('.intro-index a').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); view.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior: 'smooth', block: 'start'});
  }));
}

// ── Cardápio (Clássicos IBA ou Adaptações) ──
let menuMode = 'classicos';
function renderMenu(mode = menuMode) {
  if (mode !== menuMode) { state.q = ''; state.base = 'all'; }
  menuMode = mode;
  const adapt = mode === 'adaptacoes';
  const pool = DRINKS.filter(d => adapt ? d.cat === 'adaptation' : d.cat !== 'adaptation');
  const bases = [...new Set(pool.map(d => BASE_LABEL[d.base]).filter(Boolean))];
  let list = searchDrinks(state.q, pool);
  if (state.base !== 'all') list = list.filter(d => BASE_LABEL[d.base] === state.base);
  const sel = state.cat[mode];
  const cats = adapt ? ['adaptation'] : sel === 'all' ? IBA_CATS : [sel];
  const sections = cats.map(cat => {
    const items = list.filter(d => d.cat === cat);
    if (!items.length) return '';
    const c = CATEGORIES[cat];
    return `<section class="menu-card" aria-labelledby="h-${cat}">
      ${CORNERS}
      <p class="menu-script">${adapt ? 'Fora da lista, dentro do cânone' : 'Lista oficial IBA'}</p>
      <h2 class="menu-cat" id="h-${cat}">${esc(c.label)}</h2>
      <p class="menu-en">${esc(c.en)} · ${items.length} receita${items.length > 1 ? 's' : ''}</p>
      <div class="menu-orn">${ornament(200)}</div>
      <ul class="menu-list">${items.map(menuItem).join('')}</ul>
    </section>`;
  }).join('');
  const head = adapt
    ? pageHead('Variações consagradas', 'Adaptações reconhecidas', 'Drinks que não estão na lista oficial da IBA, mas que qualquer bartender de respeito conhece. Cada um nasce de um clássico: troca-se a base, ajusta-se o doce, muda-se o copo. Quando o seu bar não fecha um clássico, é daqui que vem a resposta.')
    : pageHead('O cânone', 'Clássicos IBA', 'A lista oficial da International Bartenders Association em três capítulos: os inesquecíveis da Era de Ouro, os clássicos contemporâneos do século XX e os drinks da nova era que já viraram referência. Toque em um drink para ver copo, utensílios e preparo.');
  const chips = adapt ? '' : `<div class="chips" role="group" aria-label="Categoria">
      ${[['all', 'Todos'], ...IBA_CATS.map(k => [k, CATEGORIES[k].label])].map(([k, label]) => `<button class="chip ${sel === k ? 'on' : ''}" data-cat="${k}" aria-pressed="${sel === k}">${esc(label)}</button>`).join('')}
    </div>`;
  view.innerHTML = `${head}
    <div class="toolbar" role="search">
      <label class="field"><span class="sr">Buscar</span><input id="q" type="search" placeholder="Buscar drink ou ingrediente…" value="${esc(state.q)}" autocomplete="off"></label>
      <label class="field select"><span class="sr">Destilado base</span><select id="base"><option value="all">Todas as bases</option>${bases.map(b => `<option ${state.base === b ? 'selected' : ''}>${esc(b)}</option>`).join('')}</select></label>
    </div>
    ${chips}
    ${sections || `<p class="empty">Nenhum drink com esse nome por aqui.</p>`}`;
  view.querySelector('#q').addEventListener('input', e => { state.q = e.target.value; rerenderMenuKeepFocus(); });
  view.querySelector('#base').addEventListener('change', e => { state.base = e.target.value; renderMenu(); });
  view.querySelectorAll('[data-cat]').forEach(b => b.addEventListener('click', () => { state.cat[mode] = b.dataset.cat; renderMenu(); }));
}

function rerenderMenuKeepFocus() {
  const pos = view.querySelector('#q').selectionStart;
  renderMenu();
  const q = view.querySelector('#q'); q.focus(); q.setSelectionRange(pos, pos);
}

function menuItem(d) {
  return `<li><a class="menu-item" href="#/drink/${d.id}">
    <span class="menu-art">${drinkSVG(d, {size: 104})}</span>
    <span class="menu-text">
      <span class="menu-name">${esc(d.name)}</span>
      <span class="menu-rule" aria-hidden="true"></span>
      <span class="menu-ing">${esc(ingredientLine(d))}</span>
      <span class="menu-glass">${esc(GLASSES[d.glass].name)}</span>
    </span>
  </a><span class="menu-div">${divider(220)}</span></li>`;
}

// ── Meu Bar ──
function renderBar() {
  const q = normalize(state.barQ);
  const groups = GROUPS.map(g => {
    const ids = Object.entries(INGREDIENTS).filter(([id, v]) => v.group === g && !BASICS.has(id) && (!q || normalize(v.name).includes(q)));
    if (!ids.length) return '';
    return `<fieldset class="ing-group"><legend>${esc(g)}</legend><div class="ing-chips">${ids.map(([id, v]) => `<button type="button" class="ing ${state.bar.has(id) ? 'on' : ''}" data-ing="${id}" aria-pressed="${state.bar.has(id)}">${esc(v.name)}</button>`).join('')}</div></fieldset>`;
  }).join('');
  view.innerHTML = `
    ${pageHead('Personalizado', 'Meu Bar', 'Marque o que existe na sua prateleira. O Home Tender procura primeiro um clássico da IBA; se nenhum fechar, sugere uma adaptação reconhecida.')}
    <div class="bar-layout">
      <section class="bar-picker paper" aria-labelledby="bar-h">
        <p class="menu-script">Meu Bar</p>
        <h2 id="bar-h" class="menu-cat">O que há na sua prateleira?</h2>
        <p class="lede">Marque o que você tem. Gelo e água a casa já providencia. O bartender responde com um clássico da IBA ou, se não fechar, com uma adaptação reconhecida.</p>
        <div class="presets">${Object.keys(PRESETS).map(p => `<button type="button" class="chip ghost" data-preset="${esc(p)}">+ ${esc(p)}</button>`).join('')}<button type="button" class="chip ghost danger" id="clear" ${state.bar.size ? '' : 'disabled'}>Limpar</button></div>
        <label class="field"><span class="sr">Filtrar ingredientes</span><input id="barq" type="search" placeholder="Filtrar ingredientes…" value="${esc(state.barQ)}" autocomplete="off"></label>
        <div id="groups">${groups || '<p class="empty">Nenhum ingrediente com esse nome.</p>'}</div>
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
  });
  view.querySelectorAll('[data-preset]').forEach(b => b.addEventListener('click', () => { PRESETS[b.dataset.preset].forEach(id => state.bar.add(id)); saveBar(); renderBar(); }));
  view.querySelector('#clear').addEventListener('click', () => { state.bar.clear(); saveBar(); renderBar(); });
  view.querySelector('#fab').addEventListener('click', e => { e.preventDefault(); view.querySelector('#results').scrollIntoView({behavior: 'smooth'}); });
  renderResults();
}

function resultCard(row, kind) {
  const d = row.drink;
  const parent = parentOf(d);
  const tag = kind === 'near'
    ? `<span class="tag miss">Falta: ${esc(row.missing.map(ingredientName).join(', '))}</span>`
    : d.cat === 'adaptation' ? `<span class="tag adapt">Adaptação de ${esc(parent?.name || '')}</span>` : `<span class="tag iba">${esc(CATEGORIES[d.cat].short)}</span>`;
  return `<li><a class="result" href="#/drink/${d.id}">
    <span class="result-art">${drinkSVG(d, {size: 64})}</span>
    <span class="result-body"><span class="result-name">${esc(d.name)}</span>${tag}<span class="result-meta">${esc(GLASSES[d.glass].name)}</span></span>
  </a></li>`;
}

function renderResults() {
  const box = view.querySelector('#results');
  const fab = view.querySelector('#fab');
  if (!state.bar.size) {
    box.innerHTML = `<div class="paper results-empty"><p class="menu-script">À espera</p><p class="lede">O bartender aguarda. Escolha ao menos um ingrediente e ele sugere o drink.</p>${drinkSVG(DRINK_BY_ID['dry-martini'], {size: 110})}</div>`;
    fab.hidden = true; return;
  }
  const r = analyzeBar(state.bar);
  const total = r.classics.length + r.adaptations.length;
  fab.hidden = false;
  fab.textContent = total ? `Ver ${total} drink${total > 1 ? 's' : ''} ↓` : 'Ver sugestões ↓';
  let html = '';
  if (r.featured) {
    const d = r.featured.drink; const parent = parentOf(d);
    html += `<article class="featured paper">
      ${CORNERS}
      <p class="menu-script">Sugestão da casa</p>
      ${r.mode === 'adaptation' ? `<p class="verdict">Nenhum clássico da IBA fecha com a sua prateleira. Mas a coquetelaria tem resposta: uma adaptação reconhecida${parent ? ` do <strong>${esc(parent.name)}</strong>` : ''}.</p>` : `<p class="verdict">Com o que você tem, dá para servir um clássico oficial.</p>`}
      <a class="featured-link" href="#/drink/${d.id}">
        ${drinkSVG(d, {size: 150})}
        <span class="featured-name">${esc(d.name)}</span>
        <span class="menu-ing">${esc(ingredientLine(d))}</span>
        <span class="menu-glass">${esc(GLASSES[d.glass].name)} · ${esc(toolsFor(d).map(t => TOOLS[t].name).slice(0, 3).join(', '))}</span>
        <span class="btn">Ver receita completa</span>
      </a>
    </article>`;
  } else {
    html += `<article class="featured paper"><p class="menu-script">Hmm…</p><p class="verdict">Ainda não fecha nenhum clássico nem adaptação reconhecida. Veja abaixo o que falta para chegar lá.</p></article>`;
  }
  if (r.classics.length) html += `<h3 class="res-h">Clássicos IBA possíveis <span>${r.classics.length}</span></h3><ul class="results">${r.classics.map(x => resultCard(x)).join('')}</ul>`;
  if (r.adaptations.length) html += `<h3 class="res-h">Adaptações reconhecidas <span>${r.adaptations.length}</span></h3><ul class="results">${r.adaptations.map(x => resultCard(x)).join('')}</ul>`;
  if (r.near.length) html += `<h3 class="res-h">Quase lá <span>${r.near.length}</span></h3><ul class="results">${r.near.map(x => resultCard(x, 'near')).join('')}</ul>`;
  box.innerHTML = html;
}

// ── Copos e utensílios ──
function renderGlossary() {
  const usage = id => DRINKS.filter(d => d.glass === id);
  const toolUse = id => DRINKS.filter(d => toolsFor(d).includes(id)).length;
  view.innerHTML = `${pageHead('Atrás do balcão', 'Copos & Utensílios', 'Cada drink clássico tem o seu copo e as suas ferramentas. Conheça o que cada um faz e em quais receitas aparece.')}
    <section class="menu-card">
      ${CORNERS}
      <p class="menu-script">A casa</p><h2 class="menu-cat">Os Copos</h2><p class="menu-en">Glassware</p>
      <div class="menu-orn">${ornament(200)}</div>
      <ul class="gloss-grid">${Object.entries(GLASSES).map(([id, g]) => `<li class="gloss">
        <span class="gloss-art">${glassSVG(id, 72)}</span>
        <h3>${esc(g.name)}</h3><p>${esc(g.desc)}</p>
        <p class="gloss-uses">${usage(id).slice(0, 6).map(d => `<a href="#/drink/${d.id}">${esc(d.name)}</a>`).join(' · ')}</p>
      </li>`).join('')}</ul>
    </section>
    <section class="menu-card">
      ${CORNERS}
      <p class="menu-script">Atrás do balcão</p><h2 class="menu-cat">Os Utensílios</h2><p class="menu-en">Barware</p>
      <div class="menu-orn">${ornament(200)}</div>
      <ul class="gloss-grid tools">${Object.entries(TOOLS).map(([id, t]) => `<li class="gloss">
        <span class="gloss-art tool">${toolSVG(id, 48)}</span>
        <h3>${esc(t.name)}</h3><p>${esc(t.desc)}</p><p class="gloss-uses">Usado em ${toolUse(id)} receita${toolUse(id) === 1 ? '' : 's'}</p>
      </li>`).join('')}</ul>
    </section>
    ${creditsHTML()}`;
}

// ── Ficha do drink ──
function openDrink(id) {
  const d = DRINK_BY_ID[id];
  if (!d) { location.hash = '#/classicos'; return; }
  const parent = parentOf(d);
  const kids = childrenOf(d);
  const tools = toolsFor(d);
  const g = GLASSES[d.glass];
  const showHave = state.bar.size > 0;
  const missing = showHave ? missingFor(d, state.bar) : [];
  const ingRows = d.ing.filter(l => !(l.id === 'agua' && !l.q && !l.ml)).map(l => {
    const has = BASICS.has(l.id) || [l.id, ...(l.alt || [])].some(x => state.bar.has(x));
    const mark = showHave ? `<span class="have ${has ? 'yes' : l.opt ? 'opt' : 'no'}" aria-label="${has ? 'Você tem' : 'Você não tem'}">${has ? '✓' : l.opt ? '–' : '✕'}</span>` : '';
    const alt = l.alt ? ` <em>ou ${esc(l.alt.map(ingredientName).join(' / '))}</em>` : '';
    const note = l.note ? ` <em>(${esc(l.note)})</em>` : '';
    return `<li>${mark}<span class="ing-name">${esc(ingredientName(l.id))}${alt}${note}${l.opt ? ' <em>· opcional</em>' : ''}</span><span class="dots" aria-hidden="true"></span><span class="ing-qty">${esc(amount(l))}</span></li>`;
  }).join('');
  sheetCard.innerHTML = `
    <button class="close" type="button" aria-label="Fechar">✕</button>
    <div class="sheet-inner">
    ${CORNERS}
    <p class="sheet-cat">${esc(CATEGORIES[d.cat].short)}</p>
    <div class="sheet-art">${drinkSVG(d, {size: 190})}</div>
    <h2 id="sheet-title" class="sheet-title">${esc(d.name)}</h2>
    ${parent ? `<p class="sheet-parent">Adaptação reconhecida do <a href="#/drink/${parent.id}">${esc(parent.name)}</a></p>` : ''}
    ${d.note ? `<p class="sheet-note">${esc(d.note)}</p>` : ''}
    ${showHave ? `<p class="sheet-status ${missing.length ? 'no' : 'yes'}">${missing.length ? `Para o seu bar falta: ${esc(missing.map(ingredientName).join(', '))}` : 'Dá para fazer com o seu bar.'}</p>` : ''}
    <div class="menu-orn">${ornament(180)}</div>
    <div class="sheet-grid">
      <section class="sheet-block glass-block">
        <h3>O Copo</h3>
        <div class="glass-row"><span class="glass-mini">${glassSVG(d.glass, 46)}</span><div><strong>${esc(g.name)}</strong><p>${esc(g.desc)}</p></div></div>
      </section>
      <section class="sheet-block">
        <h3>Os Utensílios</h3>
        <ul class="tool-list">${tools.map(t => `<li>${toolSVG(t, 26)}<span>${esc(TOOLS[t].name)}</span></li>`).join('')}</ul>
      </section>
    </div>
    <section class="sheet-block">
      <h3>Ingredientes</h3>
      <ul class="ing-list">${ingRows}</ul>
    </section>
    <section class="sheet-block">
      <h3>Preparo</h3>
      <ol class="steps">${stepsFor(d).map(s => `<li>${esc(s)}</li>`).join('')}</ol>
      ${d.gtext ? `<p class="garnish"><span>Guarnição</span> ${esc(d.gtext.charAt(0).toUpperCase() + d.gtext.slice(1))}</p>` : ''}
    </section>
    ${kids.length ? `<section class="sheet-block"><h3>Adaptações reconhecidas</h3><p class="kids">${kids.map(k => `<a class="chip" href="#/drink/${k.id}">${esc(k.name)}</a>`).join(' ')}</p></section>` : ''}
    </div>
  `;
  sheet.hidden = false;
  document.body.classList.add('locked');
  sheetCard.scrollTop = 0;
  sheetCard.querySelector('.close').addEventListener('click', closeDrink);
  sheetCard.querySelector('.close').focus({preventScroll: true});
  document.title = `${d.name} · Home Tender`;
}

let lastTab = 'inicio';
function closeDrink() { location.hash = `#/${lastTab}`; }
function hideSheet() { sheet.hidden = true; document.body.classList.remove('locked'); }
sheet.addEventListener('click', e => { if (e.target === sheet) closeDrink(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !sheet.hidden) closeDrink(); });

// ── Capa e login ──
const cover = document.getElementById('cover');
const shell = document.getElementById('shell');
const form = document.getElementById('auth-form');
const authError = document.getElementById('auth-error');
let authMode = 'login';

function setAuthMode(mode) {
  authMode = mode;
  document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.mode === mode)));
  form.querySelectorAll('[data-only="register"]').forEach(el => { el.hidden = mode !== 'register'; });
  form.elements['password'].autocomplete = mode === 'register' ? 'new-password' : 'current-password';
  document.getElementById('auth-submit').textContent = mode === 'register' ? 'Criar conta e entrar' : 'Entrar';
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
    if (authMode === 'register' && !f['adult'].checked) throw new Error('O Home Tender é para maiores de 18 anos.');
    state.user = authMode === 'register' ? await auth.register(data) : await auth.login(data);
    form.reset();
    enterApp();
  } catch (err) {
    authError.textContent = err.message; authError.hidden = false;
  } finally { submit.disabled = false; }
});

document.getElementById('logout').addEventListener('click', () => {
  auth.logout(); state.user = null; rendered = null; state.bar = new Set();
  location.hash = '#/inicio'; showCover();
});

function showCover() {
  hideSheet();
  shell.hidden = true; cover.hidden = false;
  setAuthMode(auth.hasAccounts() ? 'login' : 'register');
  document.title = 'Home Tender · O bartender da sua casa';
}

function enterApp() {
  cover.hidden = true; shell.hidden = false;
  document.getElementById('user-name').textContent = state.user.name.split(' ')[0];
  loadBar(); rendered = null;
  if (!location.hash || location.hash === '#/' ) location.hash = '#/inicio';
  route();
  window.scrollTo({top: 0});
}

// ── Rotas ──
const TABS = {inicio: renderIntro, classicos: () => renderMenu('classicos'), adaptacoes: () => renderMenu('adaptacoes'), bar: renderBar, utensilios: renderGlossary};
const ALIASES = {cardapio: 'classicos'};
let rendered = null;
function route() {
  if (!state.user) { showCover(); return; }
  let [, tab = 'inicio', id] = location.hash.replace(/^#/, '').split('/');
  tab = ALIASES[tab] || tab;
  if (tab === 'drink') {
    if (!rendered) { TABS[lastTab](); rendered = lastTab; markTab(lastTab); }
    openDrink(decodeURIComponent(id || ''));
    return;
  }
  hideSheet();
  document.title = 'Home Tender · Coquetéis Clássicos';
  const t = TABS[tab] ? tab : 'inicio';
  if (rendered !== t) { TABS[t](); rendered = t; }
  if (lastTab !== t) window.scrollTo({top: 0});
  lastTab = t;
  markTab(t);
}
function markTab(t) {
  document.querySelectorAll('[data-tab]').forEach(a => { const on = a.dataset.tab === t; a.classList.toggle('on', on); on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'); });
}
window.addEventListener('hashchange', route);
state.user = auth.current();
if (state.user) enterApp(); else showCover();
