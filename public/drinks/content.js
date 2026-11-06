// Home Tender — textos editoriais (capa e introdução) e créditos das fotos.

export const PHOTOS = {
  cover: {src: 'img/cover.jpg', alt: 'Um Manhattan com cereja à luz de vela, sobre o balcão escuro de um bar', author: 'Gary J. Wood', license: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Manhattan_Cocktail_(6973831603).jpg'},
  shaker: {src: 'img/shaker.jpg', alt: 'Bartender batendo um coquetel na coqueteleira diante da prateleira de garrafas', author: 'Achim Schleuning', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Barkeeper_Shaking.jpg'},
  jerry: {src: 'img/jerry-thomas-1862.jpg', alt: 'Gravura de 1862 do guia de Jerry Thomas mostrando um Brandy Punch', author: 'Jerry Thomas (texto) e Samuel Putnam Avery (ilustração), 1862', license: 'Domínio público', url: 'https://commons.wikimedia.org/wiki/File:The_Bar-tender%27s_Guide_-_Brandy_Punch.png'},
  ny1931: {src: 'img/nova-york-1931.jpg', alt: 'Vista aérea de Manhattan, Nova York, em 1931', author: 'Autor desconhecido, 1931', license: 'Domínio público', url: 'https://commons.wikimedia.org/wiki/File:Manhattan_1931.jpg'},
  martini: {src: 'img/martini.jpg', alt: 'Dry Martini em taça coquetel, visto de baixo, sobre um balcão de madeira', author: 'Douglas Perkins', license: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:Martini_glass_low_angle.jpg'},
  sourCoupe: {src: 'img/sour-coupe.jpg', alt: 'Coquetel sour vermelho em taça coupe sobre fundo escuro', author: 'Erich Wagner (eventografie.de)', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Whiskey_Sour1.jpg'},
  sourBalcao: {src: 'img/sour-balcao.jpg', alt: 'Whiskey Sour com espuma servido em taça, no balcão', author: 'Will Shenton', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Whiskey_Sour_Served_Up.jpg'},
  noite: {src: 'img/sours-noite.jpg', alt: 'Dois drinks em copos lapidados, com luzes de bar desfocadas ao fundo', author: 'Dktue', license: 'CC0', url: 'https://commons.wikimedia.org/wiki/File:Whiskey_Sour_im_Collegium_in_T%C3%BCbingen.jpg'},
  prateleira: {src: 'img/prateleira.jpg', alt: 'Prateleira iluminada de um bar com destilados, vermutes e licores', author: '4028mdk09', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Barbestand.JPG'},
  oldFashioned: {src: 'img/old-fashioned.jpg', alt: 'Old Fashioned com gelo, casca de laranja e cereja', author: 'Edcross', license: 'Domínio público', url: 'https://commons.wikimedia.org/wiki/File:Oldfashioned-cocktail.png'}
};

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

export function figure(key, {cls = '', caption = ''} = {}) {
  const p = PHOTOS[key];
  return `<figure class="photo ${cls}" data-photo="${key}"><span class="photo-frame"><img src="${p.src}" alt="${esc(p.alt)}" loading="lazy" decoding="async"></span>${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
}

const link = (id, label) => `<a href="#/drink/${id}">${label}</a>`;

const TIMELINE = [
  ['1806', 'A primeira definição', `O jornal <em>The Balance and Columbian Repository</em>, de Hudson, Nova York, explica a um leitor o que é um <em>cock-tail</em>: destilado de qualquer tipo, açúcar, água e bitters. Mais de dois séculos depois, a fórmula segue intacta no ${link('old-fashioned', 'Old Fashioned')}.`],
  ['1862', 'O primeiro manual', `Jerry Thomas, o bartender-showman de Nova York, publica <em>How to Mix Drinks, or The Bon-Vivant’s Companion</em>, o primeiro guia de bar impresso nos Estados Unidos. Pela primeira vez, as receitas saem da cabeça dos bartenders e vão para o papel.`, 'jerry'],
  ['1860–1919', 'A Era de Ouro', `O vermute italiano e francês chega aos balcões americanos, o gelo passa a ser produzido em escala e nascem os pilares mexidos: ${link('martinez', 'Martinez')}, ${link('manhattan', 'Manhattan')} e, por fim, o ${link('dry-martini', 'Dry Martini')}. Em Nova Orleans, o ${link('sazerac', 'Sazerac')} ganha forma.`],
  ['1920–1933', 'Lei Seca e o exílio', `Com a proibição do álcool nos Estados Unidos, o bar vai para a clandestinidade dos <em>speakeasies</em> e os grandes bartenders emigram. Harry Craddock leva o ofício ao American Bar do Savoy, em Londres, e publica o <em>Savoy Cocktail Book</em> (1930). Em Paris, o Harry’s New York Bar vira endereço obrigatório. Em Havana, o El Floridita eterniza o ${link('daiquiri', 'Daiquiri')}.`, 'ny1931'],
  ['1934–1950', 'A febre tiki', `Donn Beach (o “Don the Beachcomber”) abre seu bar em Hollywood e inventa um paraíso polinésio feito de runs, especiarias e sucos. Trader Vic responde com o ${link('mai-tai', 'Mai Tai')} (1944). Em Los Angeles, o ${link('moscow-mule', 'Moscow Mule')} apresenta a vodca aos americanos, servido na caneca de cobre.`],
  ['1951', 'Nasce a IBA', `Bartenders de vários países fundam a International Bartenders Association em Torquay, na Inglaterra. Dez anos depois, em 1961, sai a primeira lista oficial de coquetéis: uma linguagem comum para balcões do mundo inteiro.`],
  ['1970–1985', 'Os anos das misturas prontas', `Sucos industrializados, “sour mix” em garrafa e drinks coloridos dominam os bares. A técnica perde espaço para a conveniência.`],
  ['1987–hoje', 'O renascimento', `Dale DeGroff, no Rainbow Room de Nova York, volta ao suco espremido na hora e às receitas antigas. Em Londres, Dick Bradsell cria o ${link('bramble', 'Bramble')} e o ${link('espresso-martini', 'Espresso Martini')}. Em 1999, Sasha Petraske abre o Milk & Honey e inaugura a era dos bares de coquetelaria artesanal, que se espalha pelo mundo.`],
  ['2024', 'O cânone atual', `A IBA revisa a lista e chega a 102 coquetéis oficiais, divididos em três categorias de 34: The Unforgettables, Contemporary Classics e New Era Drinks.`]
];

const ANATOMY = [
  ['I', 'A base', 'O destilado que dá nome e espinha ao drink: gin, whiskey, rum, cachaça, tequila, conhaque.'],
  ['II', 'O modificador', 'Vermutes, licores e amaros. Arredondam, dão corpo e complexidade à base.'],
  ['III', 'O doce', 'Açúcar, xaropes e mel. Não servem para “adoçar”, e sim para equilibrar o ácido e o álcool.'],
  ['IV', 'O ácido', 'Limão e outros cítricos, sempre espremidos na hora. Trazem frescor e tensão.'],
  ['V', 'Os aromáticos', 'Bitters, cascas de cítricos e ervas. Poucas gotas que mudam tudo.'],
  ['VI', 'A água', 'O ingrediente invisível: o gelo que derrete ao bater ou mexer dilui de 20% a 30% e dá maciez ao drink.']
];

const FAMILIES = [
  ['Old Fashioned', 'Destilado, açúcar, bitters e água. A forma original do coquetel.', 'old-fashioned'],
  ['Sours', 'Destilado, cítrico e doce, às vezes com clara de ovo para a espuma.', 'whiskey-sour'],
  ['Martini & Manhattan', 'Destilado e vermute, mexidos e servidos sem gelo. Elegância pura.', 'manhattan'],
  ['Aperitivos amargos', 'Campari, vermute e companhia: o ritual italiano antes do jantar.', 'negroni'],
  ['Highballs', 'Destilado e refrigerante sobre muito gelo. Simples e perfeitos.', 'cuba-libre'],
  ['Fizz & Collins', 'Um sour alongado com água com gás. Refrescância no copo alto.', 'gin-fizz'],
  ['Juleps & Smashes', 'Hortelã, açúcar e destilado sobre gelo picado.', 'mint-julep'],
  ['Tiki', 'Runs, especiarias, frutas e camadas de sabor. Exuberância tropical.', 'mai-tai'],
  ['Espumantes', 'Champagne ou prosecco como protagonista: celebração no copo.', 'french-75']
];

/** Página "Início": a introdução ao mundo da coquetelaria. */
export function introHTML({name, counts}) {
  const first = String(name || '').split(' ')[0];
  return `
  <article class="intro">
    <header class="intro-hero">
      <img src="${PHOTOS.noite.src}" alt="" aria-hidden="true">
      <div class="intro-hero-text">
        <p class="eyebrow">${first ? `Boa noite, ${esc(first)}` : 'Boa noite'}</p>
        <h1>O mundo da coquetelaria</h1>
        <p class="intro-lede">Uma arte de equilíbrio nascida nos balcões do século XIX e lapidada por gerações de bartenders. Antes de pegar a coqueteleira, um pouco de história.</p>
      </div>
    </header>

    <nav class="intro-index" aria-label="Nesta página">
      <a href="#sec-coquetel">O coquetel</a><a href="#sec-historia">História</a><a href="#sec-iba">A IBA</a><a href="#sec-anatomia">Anatomia</a><a href="#sec-familias">Famílias</a><a href="#sec-tecnica">Técnica</a><a href="#sec-casa">Bar em casa</a>
    </nav>

    <section class="intro-sec split" id="sec-coquetel">
      <div class="prose">
        <p class="kicker">Capítulo I</p>
        <h2>O que é um coquetel</h2>
        <p class="dropcap">Um coquetel é uma composição. Pega-se um destilado, que tem caráter, força e às vezes arestas, e ele é colocado em diálogo com outros elementos: algo doce, algo ácido, algo amargo e, sempre, a água que vem do gelo. Quando dá certo, o resultado é maior que a soma das partes: nenhum ingrediente grita, todos conversam.</p>
        <p>É por isso que a coquetelaria clássica é tão precisa. Uma diferença de dez mililitros transforma um drink equilibrado em um drink enjoativo ou agressivo. As receitas que chegaram até nós sobreviveram exatamente porque encontraram esse ponto, e foram repetidas, copiadas e refinadas por mais de 150 anos.</p>
        <blockquote>Um bom drink é como uma boa conversa: ninguém fala mais alto que ninguém.<cite>Máxima da casa</cite></blockquote>
      </div>
      ${figure('shaker', {cls: 'tall', caption: 'A coqueteleira em ação: gelo, ar e diluição em dez segundos.'})}
    </section>

    <section class="intro-sec" id="sec-historia">
      <p class="kicker">Capítulo II</p>
      <h2>Uma breve história</h2>
      <p class="sec-lede">De um jornal do interior de Nova York ao renascimento dos bares artesanais: os momentos que moldaram o que bebemos hoje.</p>
      <ol class="timeline">
        ${TIMELINE.map(([year, title, text, photo]) => `<li>
          <span class="tl-year">${year}</span>
          <div class="tl-body"><h3>${title}</h3><p>${text}</p>${photo ? figure(photo, {cls: 'tl-photo', caption: photo === 'jerry' ? 'Brandy Punch, gravura do guia de Jerry Thomas (1862).' : 'Manhattan, Nova York, em 1931: a cidade dos speakeasies.'}) : ''}</div>
        </li>`).join('')}
      </ol>
    </section>

    <section class="intro-sec split reverse" id="sec-iba">
      <div class="prose">
        <p class="kicker">Capítulo III</p>
        <h2>A IBA e o cânone</h2>
        <p class="dropcap">A International Bartenders Association reúne associações de bartenders de dezenas de países e mantém a lista oficial de coquetéis, a referência que escolas e competições do mundo inteiro usam. A ideia é simples e poderosa: um Negroni pedido em Tóquio, em Milão ou em São Paulo deve ser o mesmo drink.</p>
        <p>A lista se divide em três capítulos:</p>
        <ul class="cat-list">
          <li><strong>The Unforgettables</strong> <span>Os inesquecíveis: os pilares da Era de Ouro e da Lei Seca, como Martini, Manhattan, Negroni e Daiquiri.</span></li>
          <li><strong>Contemporary Classics</strong> <span>Os clássicos contemporâneos: drinks do século XX que conquistaram o mundo, como Mojito, Margarita e Caipirinha.</span></li>
          <li><strong>New Era Drinks</strong> <span>A nova era: criações do renascimento da coquetelaria que já viraram clássicos, como Penicillin, Paper Plane e Espresso Martini.</span></li>
        </ul>
        <p>E um orgulho nacional: a ${link('caipirinha', 'Caipirinha')} é o único drink brasileiro da lista oficial.</p>
        <p class="note">No Home Tender você encontra ${counts.iba} clássicos da IBA com medidas oficiais, e mais ${counts.adapt} adaptações reconhecidas: drinks consagrados fora da lista, cada um ligado ao clássico de onde vem.</p>
      </div>
      ${figure('sourCoupe', {cls: 'tall', caption: 'A taça coupe, ícone dos anos 20 a 40.'})}
    </section>

    <section class="intro-sec" id="sec-anatomia">
      <p class="kicker">Capítulo IV</p>
      <h2>Anatomia de um coquetel</h2>
      <p class="sec-lede">Quase todo drink clássico se constrói com os mesmos seis elementos. Entender o papel de cada um é o primeiro passo para entender qualquer receita.</p>
      <ol class="anatomy">${ANATOMY.map(([n, t, d]) => `<li><span class="num">${n}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>
    </section>

    <section class="intro-sec" id="sec-familias">
      <p class="kicker">Capítulo V</p>
      <h2>As grandes famílias</h2>
      <p class="sec-lede">Os bartenders pensam em famílias. Conheça a estrutura de uma e você entende dezenas de drinks.</p>
      <ul class="families">${FAMILIES.map(([t, d, id]) => `<li><a href="#/drink/${id}"><h3>${t}</h3><p>${d}</p><span class="fam-ex">Exemplo: ${id.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')} →</span></a></li>`).join('')}</ul>
    </section>

    <section class="intro-sec split" id="sec-tecnica">
      <div class="prose">
        <p class="kicker">Capítulo VI</p>
        <h2>Bater ou mexer?</h2>
        <p class="dropcap">A regra de ouro é antiga e nunca falha. <strong>Bata</strong> na coqueteleira tudo que leva cítrico, ovo, creme ou suco: a agitação incorpora ar, emulsiona e deixa a textura viva. <strong>Mexa</strong> no copo misturador tudo que leva só destilados, vermutes e licores: assim o drink fica sedoso, translúcido e sem bolhas.</p>
        <p>Três hábitos separam um drink caseiro de um drink de bar:</p>
        <ul class="rules">
          <li><strong>Gelo em abundância.</strong> Gelo pouco derrete rápido e aguada o drink. Encha a coqueteleira e o copo.</li>
          <li><strong>Copo gelado.</strong> Drinks servidos sem gelo pedem taça que passou pelo congelador ou por gelo e água.</li>
          <li><strong>Medida sempre.</strong> Use o dosador. A coquetelaria clássica é uma receita, não um improviso.</li>
        </ul>
      </div>
      ${figure('martini', {cls: 'tall', caption: 'O Dry Martini: mexido, nunca batido (desculpe, Sr. Bond).'})}
    </section>

    <section class="intro-sec split reverse" id="sec-casa">
      <div class="prose">
        <p class="kicker">Capítulo VII</p>
        <h2>O bar em casa</h2>
        <p class="dropcap">Não é preciso uma prateleira enorme. Com um gin, um bourbon, um rum branco, um vermute tinto, um Campari, um vidro de Angostura, limões e açúcar, você já serve ${link('negroni', 'Negroni')}, ${link('boulevardier', 'Boulevardier')}, ${link('old-fashioned', 'Old Fashioned')}, ${link('manhattan', 'Manhattan')}, ${link('daiquiri', 'Daiquiri')} e ${link('whiskey-sour', 'Whiskey Sour')}.</p>
        <p>Nos utensílios, o essencial cabe numa gaveta: coqueteleira, dosador, colher bailarina, coador e socador. O resto vem com o tempo e com a curiosidade.</p>
        <p>Na aba <a href="#/bar">Meu Bar</a>, marque o que você tem e o Home Tender mostra o que dá para preparar agora.</p>
      </div>
      ${figure('prateleira', {cls: 'tall'})}
    </section>

    <section class="intro-sec next" aria-labelledby="next-h">
      <h2 id="next-h">Por onde começar</h2>
      <div class="next-grid">
        <a class="next-card" href="#/classicos">${figure('oldFashioned')}<span class="next-body"><span class="kicker">${counts.iba} receitas</span><strong>Clássicos IBA</strong><span>A lista oficial, com medidas, copo, utensílios e preparo.</span></span></a>
        <a class="next-card" href="#/adaptacoes">${figure('sourBalcao')}<span class="next-body"><span class="kicker">${counts.adapt} receitas</span><strong>Adaptações reconhecidas</strong><span>Variações consagradas, cada uma ligada ao seu clássico.</span></span></a>
        <a class="next-card" href="#/bar">${figure('prateleira')}<span class="next-body"><span class="kicker">Personalizado</span><strong>Meu Bar</strong><span>Diga o que você tem e receba a sugestão da casa.</span></span></a>
      </div>
    </section>

    ${creditsHTML()}
  </article>`;
}

export function creditsHTML() {
  return `<details class="credits"><summary>Créditos das fotos</summary><ul>${Object.values(PHOTOS).map(p => `<li>${esc(p.alt)}: ${esc(p.author)}, <a href="${p.url}" target="_blank" rel="noopener">${esc(p.license)}</a>, via Wikimedia Commons.</li>`).join('')}</ul></details>`;
}
