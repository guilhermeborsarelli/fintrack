import {CATEGORIES, DRINKS, DRINK_BY_ID, INGREDIENTS, GROUPS, GLASSES, TOOLS, BASICS, BASE_LABEL} from './data.js';
import {analyzeBar, toolsFor, stepsFor, amount, ingredientName, parentOf, childrenOf, searchDrinks, normalize, missingFor} from './engine.js';
import {drinkSVG, glassSVG, toolSVG, ornament, divider, cornerFlourish, artDefs} from './art.js';

const view = document.getElementById('view');
const sheet = document.getElementById('sheet');
const sheetCard = sheet.querySelector('.sheet');
document.body.insertAdjacentHTML('afterbegin', artDefs());
document.getElementById('mast-orn').innerHTML = ornament(240);
const CORNERS = ['tl', 'tr', 'bl', 'br'].map(c => `<span class="corner ${c}" aria-hidden="true">${cornerFlourish(58)}</span>`).join('');

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

// ── Estado (o bar do usuário fica só neste aparelho) ──
const store = {
  get(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* modo privado */ } }
};
const state = {
  bar: new Set(store.get('barnoir.bar', []).filter(id => INGREDIENTS[id])),
  cat: 'all', base: 'all', q: '', barQ: ''
};
const saveBar = () => store.set('barnoir.bar', [...state.bar]);

const PRESETS = {
  'Bar de casa': ['cachaca', 'vodka', 'limao', 'acucar', 'laranja', 'soda', 'cola', 'hortela'],
  'Bar do aperitivo': ['gin', 'campari', 'vermute_tinto', 'vermute_seco', 'aperol', 'espumante', 'soda', 'laranja', 'siciliano'],
  'Bar do whiskey': ['bourbon', 'scotch', 'vermute_tinto', 'angostura', 'acucar', 'siciliano', 'mel', 'cereja', 'soda']
};

const ingredientLine = d => [...new Set(d.ing.filter(l => !l.opt && !BASICS.has(l.id)).map(l => ingredientName(l.id).split(' / ')[0].replace(/\s*\(.*\)$/, '')))].join(' · ');

// ── Cardápio ──
function renderMenu() {
  const bases = [...new Set(DRINKS.map(d => BASE_LABEL[d.base]).filter(Boolean))];
  let list = searchDrinks(state.q);
  if (state.base !== 'all') list = list.filter(d => BASE_LABEL[d.base] === state.base);
  const cats = state.cat === 'all' ? Object.keys(CATEGORIES) : [state.cat];
  const sections = cats.map(cat => {
    const items = list.filter(d => d.cat === cat);
    if (!items.length) return '';
    const c = CATEGORIES[cat];
    return `<section class="menu-card" aria-labelledby="h-${cat}">
      ${CORNERS}
      <p class="menu-script">Cardápio</p>
      <h2 class="menu-cat" id="h-${cat}">${esc(c.label)}</h2>
      <p class="menu-en">${esc(c.en)}${cat === 'adaptation' ? '' : ' · lista oficial IBA'}</p>
      <div class="menu-orn">${ornament(200)}</div>
      <ul class="menu-list">${items.map(menuItem).join('')}</ul>
    </section>`;
  }).join('');
  view.innerHTML = `
    <div class="toolbar" role="search">
      <label class="field"><span class="sr">Buscar</span><input id="q" type="search" placeholder="Buscar drink ou ingrediente…" value="${esc(state.q)}" autocomplete="off"></label>
      <label class="field select"><span class="sr">Destilado base</span><select id="base"><option value="all">Todas as bases</option>${bases.map(b => `<option ${state.base === b ? 'selected' : ''}>${esc(b)}</option>`).join('')}</select></label>
    </div>
    <div class="chips" role="group" aria-label="Categoria">
      ${[['all', 'Todos'], ...Object.entries(CATEGORIES).map(([k, v]) => [k, v.label])].map(([k, label]) => `<button class="chip ${state.cat === k ? 'on' : ''}" data-cat="${k}" aria-pressed="${state.cat === k}">${esc(label)}</button>`).join('')}
    </div>
    ${sections || `<p class="empty">Nenhum drink com esse nome no cardápio da casa.</p>`}`;
  view.querySelector('#q').addEventListener('input', e => { state.q = e.target.value; rerenderMenuKeepFocus(); });
  view.querySelector('#base').addEventListener('change', e => { state.base = e.target.value; renderMenu(); });
  view.querySelectorAll('[data-cat]').forEach(b => b.addEventListener('click', () => { state.cat = b.dataset.cat; renderMenu(); }));
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
  view.innerHTML = `
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
    </section>`;
}

// ── Ficha do drink ──
function openDrink(id) {
  const d = DRINK_BY_ID[id];
  if (!d) { location.hash = '#/cardapio'; return; }
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
  document.title = `${d.name} · Bar Noir`;
}

let lastTab = 'cardapio';
function closeDrink() { location.hash = `#/${lastTab}`; }
function hideSheet() { sheet.hidden = true; document.body.classList.remove('locked'); }
sheet.addEventListener('click', e => { if (e.target === sheet) closeDrink(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !sheet.hidden) closeDrink(); });

// ── Rotas ──
const TABS = {cardapio: renderMenu, bar: renderBar, utensilios: renderGlossary};
let rendered = null;
function route() {
  const [, tab = 'cardapio', id] = location.hash.replace(/^#/, '').split('/');
  if (tab === 'drink') {
    if (!rendered) { TABS[lastTab](); rendered = lastTab; markTab(lastTab); }
    openDrink(decodeURIComponent(id || ''));
    return;
  }
  hideSheet();
  document.title = 'Bar Noir · Coquetéis Clássicos';
  const t = TABS[tab] ? tab : 'cardapio';
  if (rendered !== t) { TABS[t](); rendered = t; }
  if (lastTab !== t) window.scrollTo({top: 0});
  lastTab = t;
  markTab(t);
}
function markTab(t) {
  document.querySelectorAll('[data-tab]').forEach(a => { const on = a.dataset.tab === t; a.classList.toggle('on', on); on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'); });
}
window.addEventListener('hashchange', route);
route();
