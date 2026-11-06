// Home Tender — textos editoriais (introdução) e créditos das fotos, em três idiomas.
import {getLang} from './i18n.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const pick = v => Array.isArray(v) ? v[{pt: 0, en: 1, es: 2}[getLang()] ?? 0] : v;

export const PHOTOS = {
  cover: {src: 'img/cover.jpg', alt: ['Um Manhattan com cereja à luz de vela', 'A Manhattan with a cherry by candlelight', 'Un Manhattan con cereza a la luz de una vela'], author: 'Gary J. Wood', license: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Manhattan_Cocktail_(6973831603).jpg'},
  shaker: {src: 'img/shaker.jpg', alt: ['Bartender batendo um coquetel diante da prateleira de garrafas', 'A bartender shaking a cocktail in front of the back bar', 'Un bartender agitando un cóctel frente a la estantería de botellas'], author: 'Achim Schleuning', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Barkeeper_Shaking.jpg'},
  jerry: {src: 'img/jerry-thomas-1862.jpg', alt: ['Gravura de 1862 do guia de Jerry Thomas', 'An 1862 engraving from Jerry Thomas’s guide', 'Grabado de 1862 de la guía de Jerry Thomas'], author: 'Jerry Thomas / Samuel Putnam Avery, 1862', license: 'Domínio público / Public domain', url: 'https://commons.wikimedia.org/wiki/File:The_Bar-tender%27s_Guide_-_Brandy_Punch.png'},
  ny1931: {src: 'img/nova-york-1931.jpg', alt: ['Vista aérea de Manhattan em 1931', 'Aerial view of Manhattan in 1931', 'Vista aérea de Manhattan en 1931'], author: '1931', license: 'Domínio público / Public domain', url: 'https://commons.wikimedia.org/wiki/File:Manhattan_1931.jpg'},
  martini: {src: 'img/martini.jpg', alt: ['Dry Martini em taça coquetel sobre um balcão', 'A Dry Martini in a cocktail glass on a bar', 'Un Dry Martini en copa de cóctel sobre la barra'], author: 'Douglas Perkins', license: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:Martini_glass_low_angle.jpg'},
  sourCoupe: {src: 'img/sour-coupe.jpg', alt: ['Coquetel sour vermelho em taça coupe', 'A red sour cocktail in a coupe', 'Un cóctel sour rojo en copa coupé'], author: 'Erich Wagner (eventografie.de)', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Whiskey_Sour1.jpg'},
  sourBalcao: {src: 'img/sour-balcao.jpg', alt: ['Whiskey Sour com espuma no balcão', 'A Whiskey Sour with foam on the bar', 'Un Whiskey Sour con espuma en la barra'], author: 'Will Shenton', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Whiskey_Sour_Served_Up.jpg'},
  noite: {src: 'img/sours-noite.jpg', alt: ['Dois drinks com luzes de bar ao fundo', 'Two drinks with bar lights behind', 'Dos tragos con luces de bar al fondo'], author: 'Dktue', license: 'CC0', url: 'https://commons.wikimedia.org/wiki/File:Whiskey_Sour_im_Collegium_in_T%C3%BCbingen.jpg'},
  prateleira: {src: 'img/prateleira.jpg', alt: ['Prateleira iluminada de um bar', 'An illuminated back bar', 'Estantería iluminada de un bar'], author: '4028mdk09', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Barbestand.JPG'},
  oldFashioned: {src: 'img/old-fashioned.jpg', alt: ['Old Fashioned com gelo e casca de laranja', 'An Old Fashioned with ice and orange peel', 'Un Old Fashioned con hielo y cáscara de naranja'], author: 'Edcross', license: 'Domínio público / Public domain', url: 'https://commons.wikimedia.org/wiki/File:Oldfashioned-cocktail.png'}
};

export function figure(key, {cls = '', caption = ''} = {}) {
  const p = PHOTOS[key];
  return `<figure class="photo ${cls}" data-photo="${key}"><span class="photo-frame"><img src="${p.src}" alt="${esc(pick(p.alt))}" loading="lazy" decoding="async"></span>${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
}

const link = (id, label) => `<a href="#/drink/${id}">${label}</a>`;

// ───────────── Textos ─────────────
const TXT = {
  pt: {
    hello: n => n ? `Boa noite, ${n}` : 'Boa noite',
    heroTitle: 'A arte de misturar',
    heroLede: 'Um coquetel é uma pequena obra de equilíbrio, nascida nos balcões do século XIX e lapidada por gerações de bartenders. Antes de pegar a coqueteleira, vale entender de onde ela vem e por que ela voltou para dentro de casa.',
    index: ['O conceito', 'História', 'A biblioteca', 'Em casa', 'Técnica'],
    c1k: 'Capítulo I', c1t: 'O que é um coquetel',
    c1p: [
      'Um coquetel é uma composição. Pega-se um destilado, que tem caráter, força e às vezes arestas, e ele é colocado em diálogo com outros elementos: algo doce, algo ácido, algo amargo e, sempre, a água que vem do gelo. Quando dá certo, nenhum ingrediente grita; todos conversam, e o resultado é maior que a soma das partes.',
      'É por isso que a coquetelaria clássica é tão precisa. Dez mililitros a mais de açúcar transformam um drink equilibrado num drink enjoativo; dez a menos de limão, num drink pesado. As receitas que chegaram até nós sobreviveram porque encontraram esse ponto e foram repetidas, copiadas e refinadas por mais de 150 anos.',
      'Os bartenders do Death & Co, em Nova York, resumiram essa ideia no livro Cocktail Codex (2018): quase todo drink do mundo descende de seis raízes, Old Fashioned, Martini, Daiquiri, Sidecar, Highball e Flip. Entender essas seis estruturas é entender a coquetelaria inteira, e é assim que o Home Tender organiza o que você vai aprender.'
    ],
    quote: 'Um bom drink é como uma boa conversa: ninguém fala mais alto que ninguém.', quoteCite: 'Máxima da casa',
    shakerCap: 'A coqueteleira em ação: gelo, ar e diluição em dez segundos.',
    c2k: 'Capítulo II', c2t: 'Uma breve história', c2l: 'De um jornal do interior de Nova York ao renascimento dos bares artesanais: os momentos que moldaram o que bebemos hoje.',
    jerryCap: 'Brandy Punch, gravura do guia de Jerry Thomas (1862).', nyCap: 'Nova York em 1931: a cidade dos speakeasies.',
    timeline: [
      ['1806', 'A primeira definição', `O jornal <em>The Balance and Columbian Repository</em>, de Hudson, Nova York, explica o que é um <em>cock-tail</em>: destilado, açúcar, água e bitters. A fórmula segue viva no ${link('old-fashioned', 'Old Fashioned')}.`],
      ['1862', 'O primeiro manual', `Jerry Thomas publica <em>How to Mix Drinks</em>, o primeiro guia de bar impresso nos EUA. As receitas saem da cabeça dos bartenders e vão para o papel.`, 'jerry'],
      ['1860–1919', 'A Era de Ouro', `O vermute chega aos balcões, o gelo passa a ser produzido em escala e nascem os pilares mexidos: ${link('martinez', 'Martinez')}, ${link('manhattan', 'Manhattan')} e ${link('dry-martini', 'Dry Martini')}.`],
      ['1920–1933', 'Lei Seca e exílio', `Com a proibição nos EUA, os bartenders emigram. Harry Craddock leva o ofício ao Savoy, em Londres; Harry MacElhone abre o Harry’s New York Bar, em Paris; Havana eterniza o ${link('daiquiri', 'Daiquiri')}.`, 'ny1931'],
      ['1934–1950', 'A febre tiki', `Donn Beach e Trader Vic inventam um paraíso polinésio de runs e especiarias: ${link('zombie', 'Zombie')}, ${link('mai-tai', 'Mai Tai')}. O ${link('moscow-mule', 'Moscow Mule')} apresenta a vodca aos americanos.`],
      ['1951', 'Nasce a IBA', `A International Bartenders Association é fundada em Torquay, na Inglaterra. Em 1961 sai a primeira lista oficial de coquetéis.`],
      ['1970–1985', 'Os anos das misturas prontas', `Sucos industrializados e "sour mix" em garrafa dominam os bares. A técnica perde espaço para a conveniência.`],
      ['1987–hoje', 'O renascimento', `Dale DeGroff volta ao suco espremido na hora no Rainbow Room; Dick Bradsell cria o ${link('bramble', 'Bramble')} e o ${link('espresso-martini', 'Espresso Martini')} em Londres; em 1999, Sasha Petraske abre o Milk & Honey e inaugura a era dos bares artesanais.`],
      ['2024', 'O cânone atual', `A IBA revisa a lista e chega a 102 coquetéis oficiais, em três categorias de 34.`]
    ],
    c3k: 'Capítulo III', c3t: 'A biblioteca do bartender',
    c3l: 'Os livros que todo profissional respeita. O Home Tender se apoia neles e na lista oficial da IBA.',
    books: [
      ['1862', 'How to Mix Drinks', 'Jerry Thomas', 'O primeiro manual impresso de coquetelaria dos EUA. Registrou sours, fizzes, flips e o Brandy Crusta.'],
      ['1930', 'The Savoy Cocktail Book', 'Harry Craddock', 'Considerado o livro de coquetéis mais importante já publicado: o retrato da era do jazz no American Bar do Savoy, em Londres.'],
      ['1948', 'The Fine Art of Mixing Drinks', 'David A. Embury', 'Um advogado que pensava como engenheiro: organizou os drinks por estrutura e criou a proporção 8:2:1 para os sours.'],
      ['2002', 'The Craft of the Cocktail', 'Dale DeGroff', 'O manifesto do renascimento: suco fresco, técnica e respeito às receitas clássicas.'],
      ['2007', 'Imbibe!', 'David Wondrich', 'A biografia de Jerry Thomas e a pesquisa histórica que devolveu as receitas originais aos bares.'],
      ['2014', 'Liquid Intelligence', 'Dave Arnold', 'A ciência da coquetelaria: diluição, temperatura, gelo e carbonatação explicados com rigor de laboratório.'],
      ['2018', 'Cocktail Codex', 'Alex Day, Nick Fauchald e David Kaplan', 'Os seis drinks-raiz que explicam quase todos os outros. Uma aula de estrutura premiada com o James Beard.']
    ],
    c4k: 'Capítulo IV', c4t: 'O bar voltou para casa',
    c4p: [
      'Durante décadas, coquetel foi coisa de bar: a técnica ficava atrás do balcão, e o que se fazia em casa raramente passava de um destilado com refrigerante. Isso mudou. Em 2020, com os bares fechados pela pandemia, milhões de pessoas transformaram a sala em balcão. No Reino Unido, uma pesquisa encomendada pela Bacardi indicou que 43% dos entrevistados tentaram aperfeiçoar coquetéis em casa durante o lockdown, e um estudo da CGA apontou que 60% de quem fazia drinks em casa pretendia continuar mesmo com os bares reabertos.',
      'E continuaram. Comprar uma garrafa de vermute, um vidro de Angostura e uma boa coqueteleira deixou de ser excentricidade. Vídeos de bartenders ensinando técnicas acumulam milhões de visualizações, as lojas vendem kits de bar, e receber os amigos com um Negroni bem feito virou uma forma de hospitalidade. A tendência é beber menos, mas melhor: menos quantidade, mais qualidade, mais entendimento do que está no copo.',
      'A boa notícia é que você não precisa ser profissional para chegar lá. Com técnica, medida e meia dúzia de garrafas, dá para servir em casa os mesmos clássicos dos grandes bares do mundo. O Home Tender foi feito para isso: para o curioso que gosta de fazer drinks e quer acertar, sem perder a graça de aprender.'
    ],
    c5k: 'Capítulo V', c5t: 'Bater ou mexer?',
    c5p: 'A regra de ouro é antiga e nunca falha. <strong>Bata</strong> na coqueteleira tudo que leva cítrico, ovo, creme ou suco: a agitação incorpora ar e deixa a textura viva. <strong>Mexa</strong> no copo misturador tudo que leva só destilados, vermutes e licores: o drink fica sedoso, translúcido e sem bolhas.',
    rules: [['Gelo em abundância.', 'Gelo pouco derrete rápido e aguada o drink. Encha a coqueteleira e o copo.'], ['Copo gelado.', 'Drinks sem gelo pedem taça que passou pelo congelador ou por gelo e água.'], ['Medida sempre.', 'Use o dosador. A coquetelaria clássica é uma receita, não um improviso.'], ['Cítrico na hora.', 'Limão espremido na hora; nunca suco de caixinha.']],
    martiniCap: 'O Dry Martini: mexido, nunca batido.',
    c6k: 'Capítulo VI', c6t: 'O bar em casa',
    c6p: `Com um gin, um bourbon, um rum branco, um vermute tinto, um Campari, Angostura, limões e açúcar, você já serve ${link('negroni', 'Negroni')}, ${link('boulevardier', 'Boulevardier')}, ${link('old-fashioned', 'Old Fashioned')}, ${link('manhattan', 'Manhattan')}, ${link('daiquiri', 'Daiquiri')} e ${link('whiskey-sour', 'Whiskey Sour')}. Nos utensílios, o essencial cabe numa gaveta: coqueteleira, dosador, colher bailarina, coador e socador. Na aba <a href="#/bar">Meu Bar</a>, marque o que você tem e o Home Tender mostra o que dá para preparar agora.`,
    nextT: 'Por onde começar', nextClassics: 'A lista oficial, com história, copo, utensílios e preparo.', nextRiffs: 'Variações conhecidas no mundo todo, cada uma ligada ao seu clássico.', nextBar: 'Diga o que você tem e receba a sugestão da casa.',
    recipes: n => `${n} receitas`, personal: 'Personalizado', credits: 'Créditos das fotos'
  },
  en: {
    hello: n => n ? `Good evening, ${n}` : 'Good evening',
    heroTitle: 'The art of mixing',
    heroLede: 'A cocktail is a small work of balance, born on 19th-century bar tops and refined by generations of bartenders. Before you pick up the shaker, it is worth knowing where it comes from and why it has come back home.',
    index: ['The concept', 'History', 'The library', 'At home', 'Technique'],
    c1k: 'Chapter I', c1t: 'What a cocktail is',
    c1p: [
      'A cocktail is a composition. You take a spirit, with character, strength and sometimes rough edges, and put it in conversation with other elements: something sweet, something sour, something bitter and, always, the water that comes from the ice. When it works, no ingredient shouts; they all talk, and the result is greater than the sum of its parts.',
      'That is why classic mixology is so precise. Ten millilitres too much sugar turns a balanced drink cloying; ten too little lemon makes it heavy. The recipes that reached us survived because they found that point, and were repeated, copied and refined for over 150 years.',
      'The bartenders of Death & Co in New York summed it up in Cocktail Codex (2018): almost every drink in the world descends from six roots, the Old Fashioned, Martini, Daiquiri, Sidecar, Highball and Flip. Understand those six structures and you understand mixology, which is how Home Tender organises what you will learn.'
    ],
    quote: 'A good drink is like a good conversation: nobody speaks louder than anyone else.', quoteCite: 'House motto',
    shakerCap: 'The shaker at work: ice, air and dilution in ten seconds.',
    c2k: 'Chapter II', c2t: 'A short history', c2l: 'From an upstate New York newspaper to the craft-bar revival: the moments that shaped what we drink today.',
    jerryCap: 'Brandy Punch, an engraving from Jerry Thomas’s guide (1862).', nyCap: 'New York in 1931: the city of speakeasies.',
    timeline: [
      ['1806', 'The first definition', `The newspaper <em>The Balance and Columbian Repository</em>, in Hudson, New York, explains what a <em>cock-tail</em> is: spirit, sugar, water and bitters. The formula lives on in the ${link('old-fashioned', 'Old Fashioned')}.`],
      ['1862', 'The first manual', `Jerry Thomas publishes <em>How to Mix Drinks</em>, the first bar guide printed in the US. Recipes move from bartenders’ heads onto paper.`, 'jerry'],
      ['1860–1919', 'The Golden Age', `Vermouth reaches the bars, ice is produced at scale and the stirred pillars are born: the ${link('martinez', 'Martinez')}, the ${link('manhattan', 'Manhattan')} and the ${link('dry-martini', 'Dry Martini')}.`],
      ['1920–1933', 'Prohibition and exile', `With Prohibition in the US, bartenders emigrate. Harry Craddock takes the craft to the Savoy in London; Harry MacElhone runs Harry’s New York Bar in Paris; Havana immortalises the ${link('daiquiri', 'Daiquiri')}.`, 'ny1931'],
      ['1934–1950', 'The tiki craze', `Donn Beach and Trader Vic invent a Polynesian paradise of rums and spices: the ${link('zombie', 'Zombie')}, the ${link('mai-tai', 'Mai Tai')}. The ${link('moscow-mule', 'Moscow Mule')} introduces America to vodka.`],
      ['1951', 'The IBA is born', `The International Bartenders Association is founded in Torquay, England. In 1961 the first official cocktail list is published.`],
      ['1970–1985', 'The years of pre-mixes', `Industrial juices and bottled sour mix take over the bars. Technique gives way to convenience.`],
      ['1987–today', 'The revival', `Dale DeGroff brings back fresh-squeezed juice at the Rainbow Room; Dick Bradsell creates the ${link('bramble', 'Bramble')} and the ${link('espresso-martini', 'Espresso Martini')} in London; in 1999 Sasha Petraske opens Milk & Honey and starts the craft-bar era.`],
      ['2024', 'Today’s canon', `The IBA revises its list to 102 official cocktails in three categories of 34.`]
    ],
    c3k: 'Chapter III', c3t: 'The bartender’s library',
    c3l: 'The books every professional respects. Home Tender builds on them and on the official IBA list.',
    books: [
      ['1862', 'How to Mix Drinks', 'Jerry Thomas', 'The first printed cocktail manual in the US. It recorded sours, fizzes, flips and the Brandy Crusta.'],
      ['1930', 'The Savoy Cocktail Book', 'Harry Craddock', 'Considered the most important cocktail book ever published: a portrait of the Jazz Age at the Savoy’s American Bar in London.'],
      ['1948', 'The Fine Art of Mixing Drinks', 'David A. Embury', 'A lawyer who thought like an engineer: he organised drinks by structure and created the 8:2:1 ratio for sours.'],
      ['2002', 'The Craft of the Cocktail', 'Dale DeGroff', 'The manifesto of the revival: fresh juice, technique and respect for classic recipes.'],
      ['2007', 'Imbibe!', 'David Wondrich', 'The biography of Jerry Thomas and the historical research that brought the original recipes back to bars.'],
      ['2014', 'Liquid Intelligence', 'Dave Arnold', 'The science of mixology: dilution, temperature, ice and carbonation explained with laboratory rigour.'],
      ['2018', 'Cocktail Codex', 'Alex Day, Nick Fauchald & David Kaplan', 'The six root drinks that explain almost all others. A James Beard Award-winning lesson in structure.']
    ],
    c4k: 'Chapter IV', c4t: 'The bar came home',
    c4p: [
      'For decades, cocktails belonged to bars: the technique stayed behind the counter, and what people made at home rarely went beyond a spirit and a mixer. That changed. In 2020, with bars closed by the pandemic, millions turned their living rooms into bars. In the UK, a survey commissioned by Bacardi found that 43% of respondents had tried to perfect cocktails at home during lockdown, and a CGA study found that 60% of people making drinks at home intended to keep doing so after bars reopened.',
      'And they did. Buying a bottle of vermouth, a bottle of Angostura and a good shaker is no longer eccentric. Videos of bartenders teaching technique gather millions of views, shops sell home-bar kits, and welcoming friends with a well-made Negroni has become a form of hospitality. The trend is to drink less but better: less quantity, more quality, more understanding of what is in the glass.',
      'The good news is you don’t have to be a professional to get there. With technique, measures and half a dozen bottles, you can serve at home the same classics as the world’s great bars. Home Tender was made for exactly that: for the curious home mixer who wants to get it right, without losing the joy of learning.'
    ],
    c5k: 'Chapter V', c5t: 'Shaken or stirred?',
    c5p: 'The golden rule is old and never fails. <strong>Shake</strong> anything with citrus, egg, cream or juice: the agitation adds air and a lively texture. <strong>Stir</strong> anything made only of spirits, vermouths and liqueurs: the drink stays silky, clear and free of bubbles.',
    rules: [['Plenty of ice.', 'Too little ice melts fast and waters the drink down. Fill the shaker and the glass.'], ['Chilled glass.', 'Drinks served without ice need a glass from the freezer or chilled with ice water.'], ['Always measure.', 'Use the jigger. Classic mixology is a recipe, not an improvisation.'], ['Fresh citrus.', 'Squeeze it to order; never boxed juice.']],
    martiniCap: 'The Dry Martini: stirred, never shaken.',
    c6k: 'Chapter VI', c6t: 'The home bar',
    c6p: `With a gin, a bourbon, a white rum, a sweet vermouth, a Campari, Angostura, lemons, limes and sugar, you can already serve the ${link('negroni', 'Negroni')}, ${link('boulevardier', 'Boulevardier')}, ${link('old-fashioned', 'Old Fashioned')}, ${link('manhattan', 'Manhattan')}, ${link('daiquiri', 'Daiquiri')} and ${link('whiskey-sour', 'Whiskey Sour')}. The essential tools fit in a drawer: shaker, jigger, bar spoon, strainer and muddler. In <a href="#/bar">My Bar</a>, tick what you have and Home Tender shows what you can make right now.`,
    nextT: 'Where to start', nextClassics: 'The official list, with story, glass, tools and method.', nextRiffs: 'Variations known worldwide, each linked to its classic.', nextBar: 'Tell us what you have and get the house suggestion.',
    recipes: n => `${n} recipes`, personal: 'Personalised', credits: 'Photo credits'
  },
  es: {
    hello: n => n ? `Buenas noches, ${n}` : 'Buenas noches',
    heroTitle: 'El arte de mezclar',
    heroLede: 'Un cóctel es una pequeña obra de equilibrio, nacida en las barras del siglo XIX y pulida por generaciones de bartenders. Antes de tomar la coctelera, vale la pena entender de dónde viene y por qué volvió a casa.',
    index: ['El concepto', 'Historia', 'La biblioteca', 'En casa', 'Técnica'],
    c1k: 'Capítulo I', c1t: 'Qué es un cóctel',
    c1p: [
      'Un cóctel es una composición. Se toma un destilado, con carácter, fuerza y a veces aristas, y se lo pone a dialogar con otros elementos: algo dulce, algo ácido, algo amargo y, siempre, el agua que viene del hielo. Cuando funciona, ningún ingrediente grita; todos conversan, y el resultado es mayor que la suma de las partes.',
      'Por eso la coctelería clásica es tan precisa. Diez mililitros de más de azúcar vuelven empalagoso un trago equilibrado; diez de menos de limón, pesado. Las recetas que llegaron hasta nosotros sobrevivieron porque encontraron ese punto y fueron repetidas, copiadas y refinadas durante más de 150 años.',
      'Los bartenders de Death & Co, en Nueva York, lo resumieron en Cocktail Codex (2018): casi todos los tragos del mundo descienden de seis raíces, Old Fashioned, Martini, Daiquiri, Sidecar, Highball y Flip. Entender esas seis estructuras es entender la coctelería, y así organiza Home Tender lo que vas a aprender.'
    ],
    quote: 'Un buen trago es como una buena conversación: nadie habla más fuerte que nadie.', quoteCite: 'Máxima de la casa',
    shakerCap: 'La coctelera en acción: hielo, aire y dilución en diez segundos.',
    c2k: 'Capítulo II', c2t: 'Una breve historia', c2l: 'De un periódico del interior de Nueva York al renacimiento de los bares artesanales: los momentos que moldearon lo que bebemos hoy.',
    jerryCap: 'Brandy Punch, grabado de la guía de Jerry Thomas (1862).', nyCap: 'Nueva York en 1931: la ciudad de los speakeasies.',
    timeline: [
      ['1806', 'La primera definición', `El periódico <em>The Balance and Columbian Repository</em>, de Hudson, Nueva York, explica qué es un <em>cock-tail</em>: destilado, azúcar, agua y amargo. La fórmula sigue viva en el ${link('old-fashioned', 'Old Fashioned')}.`],
      ['1862', 'El primer manual', `Jerry Thomas publica <em>How to Mix Drinks</em>, la primera guía de bar impresa en EE. UU. Las recetas pasan de la cabeza de los bartenders al papel.`, 'jerry'],
      ['1860–1919', 'La Edad de Oro', `El vermut llega a las barras, el hielo se produce a escala y nacen los pilares mezclados: ${link('martinez', 'Martinez')}, ${link('manhattan', 'Manhattan')} y ${link('dry-martini', 'Dry Martini')}.`],
      ['1920–1933', 'Ley Seca y exilio', `Con la prohibición en EE. UU., los bartenders emigran. Harry Craddock lleva el oficio al Savoy de Londres; Harry MacElhone dirige el Harry’s New York Bar en París; La Habana inmortaliza el ${link('daiquiri', 'Daiquiri')}.`, 'ny1931'],
      ['1934–1950', 'La fiebre tiki', `Donn Beach y Trader Vic inventan un paraíso polinesio de rones y especias: ${link('zombie', 'Zombie')}, ${link('mai-tai', 'Mai Tai')}. El ${link('moscow-mule', 'Moscow Mule')} presenta el vodka a los estadounidenses.`],
      ['1951', 'Nace la IBA', `La International Bartenders Association se funda en Torquay, Inglaterra. En 1961 sale la primera lista oficial de cócteles.`],
      ['1970–1985', 'Los años de las mezclas preparadas', `Jugos industriales y "sour mix" embotellado dominan los bares. La técnica cede ante la comodidad.`],
      ['1987–hoy', 'El renacimiento', `Dale DeGroff recupera el jugo recién exprimido en el Rainbow Room; Dick Bradsell crea el ${link('bramble', 'Bramble')} y el ${link('espresso-martini', 'Espresso Martini')} en Londres; en 1999 Sasha Petraske abre Milk & Honey e inaugura la era de los bares artesanales.`],
      ['2024', 'El canon actual', `La IBA revisa su lista y llega a 102 cócteles oficiales, en tres categorías de 34.`]
    ],
    c3k: 'Capítulo III', c3t: 'La biblioteca del bartender',
    c3l: 'Los libros que todo profesional respeta. Home Tender se apoya en ellos y en la lista oficial de la IBA.',
    books: [
      ['1862', 'How to Mix Drinks', 'Jerry Thomas', 'El primer manual impreso de coctelería de EE. UU. Registró sours, fizz, flips y el Brandy Crusta.'],
      ['1930', 'The Savoy Cocktail Book', 'Harry Craddock', 'Considerado el libro de cócteles más importante jamás publicado: el retrato de la era del jazz en el American Bar del Savoy, en Londres.'],
      ['1948', 'The Fine Art of Mixing Drinks', 'David A. Embury', 'Un abogado que pensaba como ingeniero: organizó los tragos por estructura y creó la proporción 8:2:1 para los sours.'],
      ['2002', 'The Craft of the Cocktail', 'Dale DeGroff', 'El manifiesto del renacimiento: jugo fresco, técnica y respeto por las recetas clásicas.'],
      ['2007', 'Imbibe!', 'David Wondrich', 'La biografía de Jerry Thomas y la investigación histórica que devolvió las recetas originales a los bares.'],
      ['2014', 'Liquid Intelligence', 'Dave Arnold', 'La ciencia de la coctelería: dilución, temperatura, hielo y carbonatación explicados con rigor de laboratorio.'],
      ['2018', 'Cocktail Codex', 'Alex Day, Nick Fauchald y David Kaplan', 'Los seis tragos raíz que explican casi todos los demás. Una lección de estructura premiada con el James Beard.']
    ],
    c4k: 'Capítulo IV', c4t: 'El bar volvió a casa',
    c4p: [
      'Durante décadas, el cóctel fue cosa de bar: la técnica se quedaba detrás de la barra, y lo que se hacía en casa rara vez pasaba de un destilado con refresco. Eso cambió. En 2020, con los bares cerrados por la pandemia, millones de personas convirtieron la sala en barra. En el Reino Unido, una encuesta encargada por Bacardi indicó que el 43% de los encuestados intentó perfeccionar cócteles en casa durante el confinamiento, y un estudio de CGA señaló que el 60% de quienes preparaban tragos en casa pensaba seguir haciéndolo con los bares reabiertos.',
      'Y siguieron. Comprar una botella de vermut, un frasco de Angostura y una buena coctelera dejó de ser una excentricidad. Los videos de bartenders enseñando técnicas suman millones de visualizaciones, las tiendas venden kits de bar, y recibir a los amigos con un Negroni bien hecho se volvió una forma de hospitalidad. La tendencia es beber menos, pero mejor: menos cantidad, más calidad, más comprensión de lo que hay en la copa.',
      'La buena noticia es que no hace falta ser profesional para llegar ahí. Con técnica, medida y media docena de botellas, puedes servir en casa los mismos clásicos que los grandes bares del mundo. Home Tender fue hecho para eso: para el curioso al que le gusta preparar tragos y quiere acertar, sin perder el placer de aprender.'
    ],
    c5k: 'Capítulo V', c5t: '¿Agitado o mezclado?',
    c5p: 'La regla de oro es antigua y nunca falla. <strong>Agita</strong> en la coctelera todo lo que lleva cítrico, huevo, crema o jugo: la agitación incorpora aire y da una textura viva. <strong>Mezcla</strong> en el vaso mezclador todo lo que lleva solo destilados, vermuts y licores: el trago queda sedoso, translúcido y sin burbujas.',
    rules: [['Hielo en abundancia.', 'Poco hielo se derrite rápido y agua el trago. Llena la coctelera y el vaso.'], ['Copa fría.', 'Los tragos sin hielo piden copa enfriada en el congelador o con hielo y agua.'], ['Mide siempre.', 'Usa el jigger. La coctelería clásica es una receta, no una improvisación.'], ['Cítrico al momento.', 'Exprime al momento; nunca jugo de caja.']],
    martiniCap: 'El Dry Martini: mezclado, nunca agitado.',
    c6k: 'Capítulo VI', c6t: 'El bar en casa',
    c6p: `Con una ginebra, un bourbon, un ron blanco, un vermut rojo, un Campari, Angostura, limones, limas y azúcar ya puedes servir ${link('negroni', 'Negroni')}, ${link('boulevardier', 'Boulevardier')}, ${link('old-fashioned', 'Old Fashioned')}, ${link('manhattan', 'Manhattan')}, ${link('daiquiri', 'Daiquiri')} y ${link('whiskey-sour', 'Whiskey Sour')}. Los utensilios esenciales caben en un cajón: coctelera, jigger, cuchara bailarina, colador y mortero. En <a href="#/bar">Mi Bar</a>, marca lo que tienes y Home Tender te muestra qué puedes preparar ahora.`,
    nextT: 'Por dónde empezar', nextClassics: 'La lista oficial, con historia, copa, utensilios y preparación.', nextRiffs: 'Variaciones conocidas en todo el mundo, cada una ligada a su clásico.', nextBar: 'Di qué tienes y recibe la sugerencia de la casa.',
    recipes: n => `${n} recetas`, personal: 'Personalizado', credits: 'Créditos de las fotos'
  }
};

const T = () => TXT[getLang()] || TXT.pt;

/** Página "Início": introdução ao mundo da coquetelaria. */
export function introHTML({name, counts, showcase = [], labels}) {
  const x = T();
  const first = String(name || '').split(' ')[0];
  const ids = ['sec-conceito', 'sec-historia', 'sec-biblioteca', 'sec-casa', 'sec-tecnica'];
  return `
  <article class="intro">
    <header class="intro-hero">
      <img src="${PHOTOS.noite.src}" alt="" aria-hidden="true">
      <div class="intro-hero-text">
        <p class="eyebrow">${esc(x.hello(first))}</p>
        <h1>${x.heroTitle}</h1>
        <p class="intro-lede">${x.heroLede}</p>
      </div>
    </header>

    <nav class="intro-index" aria-label="Index">${x.index.map((l, k) => `<a href="#${ids[k]}">${l}</a>`).join('')}</nav>

    <section class="intro-sec split" id="sec-conceito">
      <div class="prose">
        <p class="kicker">${x.c1k}</p><h2>${x.c1t}</h2>
        ${x.c1p.map((p, k) => `<p${k === 0 ? ' class="dropcap"' : ''}>${p}</p>`).join('')}
        <blockquote>${x.quote}<cite>${x.quoteCite}</cite></blockquote>
      </div>
      ${figure('shaker', {cls: 'tall', caption: x.shakerCap})}
    </section>

    ${showcase.length ? `<section class="showcase" aria-label="${esc(labels.classics)}">${showcase.map(d => `<a href="#/drink/${d.id}" class="show-card"><img src="img/drinks/${d.id}.webp" alt="${esc(d.name)}" loading="lazy"><span>${esc(d.name)}</span></a>`).join('')}</section>` : ''}

    <section class="intro-sec" id="sec-historia">
      <p class="kicker">${x.c2k}</p><h2>${x.c2t}</h2>
      <p class="sec-lede">${x.c2l}</p>
      <ol class="timeline">
        ${x.timeline.map(([year, title, text, photo]) => `<li>
          <span class="tl-year">${year}</span>
          <div class="tl-body"><h3>${title}</h3><p>${text}</p>${photo ? figure(photo, {cls: 'tl-photo', caption: photo === 'jerry' ? x.jerryCap : x.nyCap}) : ''}</div>
        </li>`).join('')}
      </ol>
    </section>

    <section class="intro-sec" id="sec-biblioteca">
      <p class="kicker">${x.c3k}</p><h2>${x.c3t}</h2>
      <p class="sec-lede">${x.c3l}</p>
      <ol class="books">${x.books.map(([y, title, author, text]) => `<li><span class="book-year">${y}</span><h3>${title}</h3><p class="book-author">${author}</p><p>${text}</p></li>`).join('')}</ol>
    </section>

    <section class="intro-sec split reverse" id="sec-casa">
      <div class="prose">
        <p class="kicker">${x.c4k}</p><h2>${x.c4t}</h2>
        ${x.c4p.map((p, k) => `<p${k === 0 ? ' class="dropcap"' : ''}>${p}</p>`).join('')}
      </div>
      ${figure('prateleira', {cls: 'tall'})}
    </section>

    <section class="intro-sec split" id="sec-tecnica">
      <div class="prose">
        <p class="kicker">${x.c5k}</p><h2>${x.c5t}</h2>
        <p class="dropcap">${x.c5p}</p>
        <ul class="rules">${x.rules.map(([a, b]) => `<li><strong>${a}</strong> ${b}</li>`).join('')}</ul>
        <p class="kicker" style="margin-top:34px">${x.c6k}</p><h2>${x.c6t}</h2>
        <p>${x.c6p}</p>
      </div>
      ${figure('martini', {cls: 'tall', caption: x.martiniCap})}
    </section>

    <section class="intro-sec next" aria-labelledby="next-h">
      <h2 id="next-h">${x.nextT}</h2>
      <div class="next-grid">
        <a class="next-card" href="#/classicos">${figure('oldFashioned')}<span class="next-body"><span class="kicker">${x.recipes(counts.iba)}</span><strong>${esc(labels.classics)}</strong><span>${x.nextClassics}</span></span></a>
        <a class="next-card" href="#/variacoes">${figure('sourBalcao')}<span class="next-body"><span class="kicker">${x.recipes(counts.adapt)}</span><strong>${esc(labels.riffs)}</strong><span>${x.nextRiffs}</span></span></a>
        <a class="next-card" href="#/bar">${figure('prateleira')}<span class="next-body"><span class="kicker">${x.personal}</span><strong>${esc(labels.bar)}</strong><span>${x.nextBar}</span></span></a>
      </div>
    </section>
    ${creditsHTML()}
  </article>`;
}

export function creditsHTML() {
  return `<details class="credits"><summary>${T().credits}</summary><ul>${Object.values(PHOTOS).map(p => `<li>${esc(pick(p.alt))}: ${esc(p.author)}, <a href="${p.url}" target="_blank" rel="noopener">${esc(p.license)}</a>, Wikimedia Commons.</li>`).join('')}<li>${{pt: 'Fotos dos drinks: renderizações 3D próprias do Home Tender.', en: 'Drink photos: Home Tender’s own 3D renders.', es: 'Fotos de los tragos: renders 3D propios de Home Tender.'}[getLang()]}</li></ul></details>`;
}
