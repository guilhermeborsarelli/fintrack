// Home Tender — idiomas (português, inglês, espanhol).
// O português é a fonte (data.js); aqui ficam as traduções da interface e dos dados.

export const LANGS = ['pt', 'en', 'es'];
export const LANG_LABEL = {pt: 'Português', en: 'English', es: 'Español'};

let current = 'pt';
export function detectLang(saved) {
  if (LANGS.includes(saved)) return saved;
  const nav = (globalThis.navigator?.language || 'pt').slice(0, 2).toLowerCase();
  return LANGS.includes(nav) ? nav : 'en';
}
export const setLang = l => { current = LANGS.includes(l) ? l : 'pt'; };
export const getLang = () => current;

// ───────────── Interface ─────────────
const UI = {
  pt: {
    tagline: 'O bartender da sua casa', eyebrow: 'Coquetelaria clássica',
    coverLede: 'Os grandes coquetéis do mundo, como os bartenders aprendem a fazer: as receitas oficiais da International Bartenders Association, a história de cada copo e o passo a passo para servir em casa como num bar de hotel.',
    feat1: 'O cânone oficial', feat1d: 'Os clássicos da IBA com medidas exatas, copo e utensílios.',
    feat2: 'O seu bar', feat2d: 'Diga o que tem na prateleira e receba a sugestão da casa.',
    feat3: 'A história', feat3d: 'De 1806 aos dias de hoje: a cultura por trás de cada drink.',
    login: 'Entrar', register: 'Criar conta', name: 'Nome', namePh: 'Como devemos chamar você', email: 'E-mail', password: 'Senha', passwordPh: 'Mínimo de 6 caracteres',
    adult: 'Tenho 18 anos ou mais', registerSubmit: 'Criar conta e entrar', authNote: 'Sua conta e o seu bar ficam guardados neste aparelho.',
    mustBeAdult: 'O Home Tender é para maiores de 18 anos.', drinkResponsibly: 'Beba com moderação. Venda de bebidas alcoólicas proibida para menores de 18 anos.',
    logout: 'Sair', tabHome: 'Início', tabClassics: 'Clássicos', tabRiffs: 'Variações', tabBar: 'Meu Bar', tabTools: 'Utensílios',
    search: 'Buscar drink ou ingrediente…', allBases: 'Todas as bases', all: 'Todos', noResults: 'Nenhum drink encontrado.',
    classicsKicker: 'Lista oficial IBA', classicsTitle: 'Os Clássicos', classicsLede: 'O cânone da International Bartenders Association em três capítulos: os inesquecíveis da Era de Ouro, os clássicos contemporâneos do século XX e os drinks da nova era que já viraram referência.',
    riffsKicker: 'Conhecidos no mundo todo', riffsTitle: 'Variações consagradas', riffsLede: 'Drinks que não estão na lista oficial, mas que qualquer bartender conhece. Cada um nasce de um clássico: troca-se a base, ajusta-se o doce, muda-se o copo. Quando o seu bar não fecha um clássico, ou quando você não gosta de um ingrediente, é daqui que vem a resposta.',
    recipes: n => `${n} receita${n === 1 ? '' : 's'}`,
    barKicker: 'Personalizado', barTitle: 'Meu Bar', barLede: 'Marque o que existe na sua prateleira. O Home Tender procura primeiro um clássico da IBA; se nenhum fechar, sugere uma variação consagrada.',
    barShelf: 'Sua prateleira', barFilter: 'Filtrar ingredientes…', clear: 'Limpar', selected: n => `${n} selecionado${n === 1 ? '' : 's'}`,
    presetHome: 'Bar de casa', presetAperitivo: 'Bar do aperitivo', presetWhiskey: 'Bar do whiskey',
    waitingTitle: 'O bartender aguarda', waitingText: 'Escolha ao menos um ingrediente e ele sugere o drink.',
    housePick: 'Sugestão da casa', pickClassic: 'Com o que você tem, dá para servir um clássico oficial.',
    pickRiff: parent => `Nenhum clássico da IBA fecha com a sua prateleira, mas a coquetelaria tem resposta: uma variação consagrada${parent ? ` ${/a$/i.test(parent) ? 'da' : 'do'} ${parent}` : ''}.`,
    pickNone: 'Ainda não fecha nenhum drink. Veja abaixo o que falta para chegar lá.',
    possibleClassics: 'Clássicos possíveis', possibleRiffs: 'Variações possíveis', almost: 'Quase lá', missing: 'Falta', seeRecipe: 'Ver receita', seeDrinks: n => `Ver ${n} drink${n === 1 ? '' : 's'}`, seeSuggestions: 'Ver sugestões',
    back: 'Voltar', story: 'A história', ingredients: 'Ingredientes', method: 'Preparo', glass: 'O copo', whyGlass: 'Por que este copo', tools: 'Utensílios', garnish: 'Guarnição',
    optional: 'opcional', or: 'ou', youHave: 'Você tem', youLack: 'Você não tem', canMake: 'Dá para fazer com o seu bar.', lacks: list => `Para o seu bar falta: ${list}`,
    riffOf: name => `Variação ${/a$/i.test(name) ? 'da' : 'do'} ${name}`, riffPrefix: name => `Variação ${/a$/i.test(name) ? 'da' : 'do'} `, riffsOfThis: 'Variações deste clássico', originClassic: 'O clássico de origem',
    glassesTitle: 'Os copos', toolsTitle: 'Os utensílios', toolsKicker: 'Atrás do balcão', toolsLede: 'Cada drink clássico tem o seu copo e as suas ferramentas. Conheça o que cada um faz e em quais receitas aparece.',
    usedIn: n => `Usado em ${n} receita${n === 1 ? '' : 's'}`, photoCredits: 'Créditos das fotos',
    methods: {shake: 'Batido', stir: 'Mexido', build: 'Montado no copo', muddle: 'Macerado', blend: 'Batido no liquidificador'},
    serveLabel: {up: 'Sem gelo', neat: 'Sem gelo', rocks: 'Com gelo', big: 'Pedra de gelo', crushed: 'Gelo picado', hot: 'Quente'},
    language: 'Idioma'
  },
  en: {
    tagline: 'Your bartender at home', eyebrow: 'Classic mixology',
    coverLede: 'The world’s great cocktails, made the way bartenders learn them: the official recipes of the International Bartenders Association, the story behind every glass and a step-by-step guide to serving them at home like a hotel bar.',
    feat1: 'The official canon', feat1d: 'IBA classics with exact measures, glassware and tools.',
    feat2: 'Your bar', feat2d: 'Tell us what’s on your shelf and get the house suggestion.',
    feat3: 'The history', feat3d: 'From 1806 to today: the culture behind every drink.',
    login: 'Sign in', register: 'Create account', name: 'Name', namePh: 'What should we call you', email: 'Email', password: 'Password', passwordPh: 'At least 6 characters',
    adult: 'I am of legal drinking age', registerSubmit: 'Create account and sign in', authNote: 'Your account and your bar are stored on this device.',
    mustBeAdult: 'Home Tender is for adults of legal drinking age.', drinkResponsibly: 'Please drink responsibly. Alcohol is for adults of legal drinking age only.',
    logout: 'Sign out', tabHome: 'Home', tabClassics: 'Classics', tabRiffs: 'Variations', tabBar: 'My Bar', tabTools: 'Tools',
    search: 'Search a drink or ingredient…', allBases: 'All bases', all: 'All', noResults: 'No drinks found.',
    classicsKicker: 'Official IBA list', classicsTitle: 'The Classics', classicsLede: 'The International Bartenders Association canon in three chapters: the unforgettables of the Golden Age, the contemporary classics of the 20th century and the new-era drinks that have already become references.',
    riffsKicker: 'Known worldwide', riffsTitle: 'Renowned variations', riffsLede: 'Drinks that are not on the official list but every bartender knows. Each one is born from a classic: swap the base, adjust the sweetness, change the glass. When your bar can’t make a classic, or you dislike an ingredient, this is where the answer comes from.',
    recipes: n => `${n} recipe${n === 1 ? '' : 's'}`,
    barKicker: 'Personalised', barTitle: 'My Bar', barLede: 'Tick what you have on your shelf. Home Tender looks for an IBA classic first; if none fits, it suggests a renowned variation.',
    barShelf: 'Your shelf', barFilter: 'Filter ingredients…', clear: 'Clear', selected: n => `${n} selected`,
    presetHome: 'Home bar', presetAperitivo: 'Aperitivo bar', presetWhiskey: 'Whiskey bar',
    waitingTitle: 'The bartender is waiting', waitingText: 'Pick at least one ingredient and get a suggestion.',
    housePick: 'House suggestion', pickClassic: 'With what you have, you can serve an official classic.',
    pickRiff: parent => `No IBA classic fits your shelf, but mixology has an answer: a renowned variation${parent ? ` of the ${parent}` : ''}.`,
    pickNone: 'Nothing fits yet. See below what is missing.',
    possibleClassics: 'Classics you can make', possibleRiffs: 'Variations you can make', almost: 'Almost there', missing: 'Missing', seeRecipe: 'See recipe', seeDrinks: n => `See ${n} drink${n === 1 ? '' : 's'}`, seeSuggestions: 'See suggestions',
    back: 'Back', story: 'The story', ingredients: 'Ingredients', method: 'Method', glass: 'The glass', whyGlass: 'Why this glass', tools: 'Tools', garnish: 'Garnish',
    optional: 'optional', or: 'or', youHave: 'You have it', youLack: 'You don’t have it', canMake: 'You can make it with your bar.', lacks: list => `Your bar is missing: ${list}`,
    riffOf: name => `Variation of the ${name}`, riffPrefix: () => 'Variation of the ', riffsOfThis: 'Variations of this classic', originClassic: 'The original classic',
    glassesTitle: 'The glasses', toolsTitle: 'The tools', toolsKicker: 'Behind the bar', toolsLede: 'Every classic drink has its glass and its tools. Learn what each one does and which recipes use it.',
    usedIn: n => `Used in ${n} recipe${n === 1 ? '' : 's'}`, photoCredits: 'Photo credits',
    methods: {shake: 'Shaken', stir: 'Stirred', build: 'Built in the glass', muddle: 'Muddled', blend: 'Blended'},
    serveLabel: {up: 'Straight up', neat: 'No ice', rocks: 'On the rocks', big: 'Large ice cube', crushed: 'Crushed ice', hot: 'Hot'},
    language: 'Language'
  },
  es: {
    tagline: 'El bartender de tu casa', eyebrow: 'Coctelería clásica',
    coverLede: 'Los grandes cócteles del mundo, como los aprenden los bartenders: las recetas oficiales de la International Bartenders Association, la historia de cada copa y el paso a paso para servirlos en casa como en el bar de un hotel.',
    feat1: 'El canon oficial', feat1d: 'Los clásicos de la IBA con medidas exactas, copa y utensilios.',
    feat2: 'Tu bar', feat2d: 'Di qué tienes en la estantería y recibe la sugerencia de la casa.',
    feat3: 'La historia', feat3d: 'De 1806 a hoy: la cultura detrás de cada trago.',
    login: 'Entrar', register: 'Crear cuenta', name: 'Nombre', namePh: 'Cómo quieres que te llamemos', email: 'Correo', password: 'Contraseña', passwordPh: 'Mínimo 6 caracteres',
    adult: 'Tengo 18 años o más', registerSubmit: 'Crear cuenta y entrar', authNote: 'Tu cuenta y tu bar se guardan en este dispositivo.',
    mustBeAdult: 'Home Tender es solo para mayores de 18 años.', drinkResponsibly: 'Bebe con moderación. Prohibida la venta de alcohol a menores de 18 años.',
    logout: 'Salir', tabHome: 'Inicio', tabClassics: 'Clásicos', tabRiffs: 'Variaciones', tabBar: 'Mi Bar', tabTools: 'Utensilios',
    search: 'Buscar trago o ingrediente…', allBases: 'Todas las bases', all: 'Todos', noResults: 'No se encontraron tragos.',
    classicsKicker: 'Lista oficial IBA', classicsTitle: 'Los Clásicos', classicsLede: 'El canon de la International Bartenders Association en tres capítulos: los inolvidables de la Edad de Oro, los clásicos contemporáneos del siglo XX y los tragos de la nueva era que ya son referencia.',
    riffsKicker: 'Conocidos en todo el mundo', riffsTitle: 'Variaciones consagradas', riffsLede: 'Tragos que no están en la lista oficial, pero que todo bartender conoce. Cada uno nace de un clásico: se cambia la base, se ajusta el dulzor, se cambia la copa. Cuando tu bar no alcanza para un clásico, o no te gusta un ingrediente, la respuesta está aquí.',
    recipes: n => `${n} receta${n === 1 ? '' : 's'}`,
    barKicker: 'Personalizado', barTitle: 'Mi Bar', barLede: 'Marca lo que hay en tu estantería. Home Tender busca primero un clásico de la IBA; si ninguno encaja, sugiere una variación consagrada.',
    barShelf: 'Tu estantería', barFilter: 'Filtrar ingredientes…', clear: 'Limpiar', selected: n => `${n} seleccionado${n === 1 ? '' : 's'}`,
    presetHome: 'Bar de casa', presetAperitivo: 'Bar de aperitivo', presetWhiskey: 'Bar de whiskey',
    waitingTitle: 'El bartender espera', waitingText: 'Elige al menos un ingrediente y te sugiere un trago.',
    housePick: 'Sugerencia de la casa', pickClassic: 'Con lo que tienes, puedes servir un clásico oficial.',
    pickRiff: parent => `Ningún clásico de la IBA encaja con tu estantería, pero la coctelería tiene respuesta: una variación consagrada${parent ? ` ${/a$/i.test(parent) ? 'de la' : 'del'} ${parent}` : ''}.`,
    pickNone: 'Todavía no alcanza para ningún trago. Mira abajo qué falta.',
    possibleClassics: 'Clásicos posibles', possibleRiffs: 'Variaciones posibles', almost: 'Casi listo', missing: 'Falta', seeRecipe: 'Ver receta', seeDrinks: n => `Ver ${n} trago${n === 1 ? '' : 's'}`, seeSuggestions: 'Ver sugerencias',
    back: 'Volver', story: 'La historia', ingredients: 'Ingredientes', method: 'Preparación', glass: 'La copa', whyGlass: 'Por qué esta copa', tools: 'Utensilios', garnish: 'Decoración',
    optional: 'opcional', or: 'o', youHave: 'Lo tienes', youLack: 'No lo tienes', canMake: 'Puedes prepararlo con tu bar.', lacks: list => `A tu bar le falta: ${list}`,
    riffOf: name => `Variación ${/a$/i.test(name) ? 'de la' : 'del'} ${name}`, riffPrefix: name => `Variación ${/a$/i.test(name) ? 'de la' : 'del'} `, riffsOfThis: 'Variaciones de este clásico', originClassic: 'El clásico de origen',
    glassesTitle: 'Las copas', toolsTitle: 'Los utensilios', toolsKicker: 'Detrás de la barra', toolsLede: 'Cada trago clásico tiene su copa y sus herramientas. Conoce para qué sirve cada una y en qué recetas aparece.',
    usedIn: n => `Se usa en ${n} receta${n === 1 ? '' : 's'}`, photoCredits: 'Créditos de las fotos',
    methods: {shake: 'Agitado', stir: 'Mezclado', build: 'Directo en la copa', muddle: 'Macerado', blend: 'En licuadora'},
    serveLabel: {up: 'Sin hielo', neat: 'Sin hielo', rocks: 'Con hielo', big: 'Hielo grande', crushed: 'Hielo picado', hot: 'Caliente'},
    language: 'Idioma'
  }
};

export const t = (key, ...args) => {
  const v = UI[current][key] ?? UI.pt[key];
  return typeof v === 'function' ? v(...args) : v;
};
export const tm = (group, key) => (UI[current][group] || UI.pt[group])[key];

// ───────────── Dados ─────────────
const ING = {
  gin: ['Gin', 'Ginebra'], vodka: ['Vodka', 'Vodka'], rum_branco: ['White rum', 'Ron blanco'], rum_escuro: ['Aged / dark rum', 'Ron añejo / oscuro'], cachaca: ['Cachaça', 'Cachaça'],
  tequila: ['100% agave tequila', 'Tequila 100% agave'], mezcal: ['Mezcal', 'Mezcal'], bourbon: ['Bourbon / rye whiskey', 'Bourbon / whiskey de centeno'], scotch: ['Scotch whisky', 'Whisky escocés'],
  scotch_islay: ['Peated Islay Scotch', 'Whisky turbado de Islay'], irish: ['Irish whiskey', 'Whiskey irlandés'], conhaque: ['Cognac / brandy', 'Coñac / brandy'], calvados: ['Calvados (apple brandy)', 'Calvados (brandy de manzana)'],
  pisco: ['Pisco', 'Pisco'], absinto: ['Absinthe / pastis', 'Absenta / pastis'], triple_sec: ['Triple sec / Cointreau / curaçao', 'Triple sec / Cointreau / curazao'], maraschino: ['Maraschino liqueur', 'Licor marrasquino'],
  chartreuse_verde: ['Green Chartreuse', 'Chartreuse verde'], chartreuse_amarelo: ['Yellow Chartreuse', 'Chartreuse amarillo'], violette: ['Crème de violette', 'Crème de violette'], apricot: ['Apricot brandy', 'Licor de albaricoque'],
  cacau: ['Crème de cacao', 'Crema de cacao'], menta: ['Crème de menthe', 'Crema de menta'], drambuie: ['Drambuie', 'Drambuie'], benedictine: ['Bénédictine D.O.M.', 'Bénédictine D.O.M.'], amaretto: ['Amaretto', 'Amaretto'],
  galliano: ['Galliano', 'Galliano'], licor_cafe: ['Coffee liqueur', 'Licor de café'], cassis: ['Crème de cassis', 'Crema de casis'], mure: ['Crème de mûre (blackberry)', 'Crème de mûre (mora)'],
  framboesa_licor: ['Raspberry liqueur', 'Licor de frambuesa'], cherry_heering: ['Cherry liqueur (Cherry Heering)', 'Licor de cereza (Cherry Heering)'], pessego_licor: ['Peach schnapps', 'Licor de durazno'], falernum: ['Falernum', 'Falernum'],
  vermute_tinto: ['Sweet (rosso) vermouth', 'Vermut rojo'], vermute_seco: ['Dry vermouth', 'Vermut seco'], lillet: ['Lillet Blanc / white vermouth', 'Lillet Blanc / vermut blanco'], campari: ['Campari', 'Campari'], aperol: ['Aperol', 'Aperol'],
  fernet: ['Fernet-Branca', 'Fernet-Branca'], amaro: ['Amaro (Nonino or similar)', 'Amaro (Nonino o similar)'], porto: ['Ruby port', 'Oporto tinto'], vinho_branco: ['Dry white wine', 'Vino blanco seco'], vinho_tinto: ['Red wine', 'Vino tinto'],
  espumante: ['Champagne / sparkling wine / Prosecco', 'Champagne / espumante / Prosecco'], soda: ['Soda water', 'Agua con gas'], tonica: ['Tonic water', 'Agua tónica'], ginger_beer: ['Ginger beer', 'Ginger beer'], ginger_ale: ['Ginger ale', 'Ginger ale'],
  cola: ['Cola', 'Refresco de cola'], soda_toranja: ['Grapefruit soda', 'Refresco de pomelo'], limao: ['Lime', 'Lima'], siciliano: ['Lemon', 'Limón'], laranja: ['Orange / orange juice', 'Naranja / jugo de naranja'],
  toranja: ['Grapefruit juice', 'Jugo de pomelo'], abacaxi: ['Pineapple juice', 'Jugo de piña'], cranberry: ['Cranberry juice', 'Jugo de arándano rojo'], tomate: ['Tomato juice', 'Jugo de tomate'], pessego_pure: ['White peach purée', 'Puré de durazno blanco'],
  acucar: ['Sugar / simple syrup', 'Azúcar / jarabe simple'], mel: ['Honey', 'Miel'], agave: ['Agave syrup', 'Jarabe de agave'], grenadine: ['Grenadine (pomegranate syrup)', 'Granadina (jarabe de granada)'], orgeat: ['Orgeat (almond syrup)', 'Orgeat (jarabe de almendras)'],
  xarope_framboesa: ['Raspberry syrup', 'Jarabe de frambuesa'], creme_coco: ['Cream of coconut', 'Crema de coco'], canela: ['Cinnamon / cinnamon syrup', 'Canela / jarabe de canela'], angostura: ['Angostura bitters', 'Amargo de Angostura'],
  peychauds: ['Peychaud’s bitters', 'Amargo Peychaud’s'], bitter_laranja: ['Orange bitters', 'Amargo de naranja'], ovo: ['Eggs (white / yolk)', 'Huevos (clara / yema)'], creme_leite: ['Fresh cream', 'Crema de leche'], cafe: ['Espresso / coffee', 'Espresso / café'],
  flor_laranjeira: ['Orange flower water', 'Agua de azahar'], baunilha: ['Vanilla extract', 'Extracto de vainilla'], molho_ingles: ['Worcestershire sauce', 'Salsa inglesa'], tabasco: ['Tabasco', 'Tabasco'], hortela: ['Mint', 'Hierbabuena'],
  manjericao: ['Basil', 'Albahaca'], gengibre: ['Fresh ginger', 'Jengibre fresco'], sal: ['Salt', 'Sal'], pimenta: ['Black pepper', 'Pimienta negra'], salsao: ['Celery', 'Apio'], noz_moscada: ['Nutmeg', 'Nuez moscada'],
  cereja: ['Cocktail / maraschino cherry', 'Cereza al marrasquino'], azeitona: ['Green olive', 'Aceituna verde'], amora: ['Blackberries / raspberries', 'Moras / frambuesas'], agua: ['Water', 'Agua'], agua_quente: ['Hot water', 'Agua caliente']
};

const GROUP = {
  'Destilados': ['Spirits', 'Destilados'], 'Licores': ['Liqueurs', 'Licores'], 'Vermutes, amaros e vinhos': ['Vermouths, amari and wines', 'Vermuts, amaros y vinos'],
  'Espumantes e refrigerantes': ['Sparkling wines and sodas', 'Espumantes y refrescos'], 'Cítricos e sucos': ['Citrus and juices', 'Cítricos y jugos'], 'Adoçantes e xaropes': ['Sweeteners and syrups', 'Endulzantes y jarabes'],
  'Bitters, laticínios e outros': ['Bitters, dairy and others', 'Amargos, lácteos y otros'], 'Ervas, frutas e temperos': ['Herbs, fruit and spices', 'Hierbas, frutas y especias']
};

const CAT = {
  unforgettable: {pt: ['Os Inesquecíveis', 'IBA · Inesquecível'], en: ['The Unforgettables', 'IBA · Unforgettable'], es: ['Los Inolvidables', 'IBA · Inolvidable']},
  contemporary: {pt: ['Clássicos Contemporâneos', 'IBA · Contemporâneo'], en: ['Contemporary Classics', 'IBA · Contemporary'], es: ['Clásicos Contemporáneos', 'IBA · Contemporáneo']},
  newera: {pt: ['Nova Era', 'IBA · Nova Era'], en: ['New Era Drinks', 'IBA · New Era'], es: ['Nueva Era', 'IBA · Nueva Era']},
  adaptation: {pt: ['Variações Consagradas', 'Variação consagrada'], en: ['Renowned Variations', 'Renowned variation'], es: ['Variaciones Consagradas', 'Variación consagrada']}
};

// Copos: [nome, artigo+nome (para o preparo), gênero 'm'|'f', descrição]
const GLASS = {
  coupe: {en: ['Coupe', 'the coupe', 'n', 'A shallow, wide-mouthed stemmed glass, the "Champagne saucer" of the 1920s to 1940s. For drinks shaken or stirred and served without ice.'], es: ['Copa coupé', 'la copa coupé', 'f', 'Copa baja de boca ancha, la "copa de champán" de los años 20 a 40. Para tragos agitados o mezclados que se sirven sin hielo.']},
  martini: {en: ['Cocktail (Martini) glass', 'the cocktail glass', 'n', 'The long-stemmed V-shaped glass. The stem keeps your hand from warming a drink served without ice.'], es: ['Copa de cóctel (Martini)', 'la copa de cóctel', 'f', 'La copa en V de tallo largo. El tallo evita que la mano caliente un trago servido sin hielo.']},
  rocks: {en: ['Old fashioned glass', 'the old fashioned glass', 'n', 'A short, heavy tumbler ("rocks glass"). For drinks served over ice or built in the glass.'], es: ['Vaso old fashioned', 'el vaso old fashioned', 'm', 'Vaso bajo y pesado ("rocks"). Para tragos servidos sobre hielo o montados en el propio vaso.']},
  highball: {en: ['Highball glass', 'the highball glass', 'n', 'A tall, straight glass for a spirit plus a mixer over plenty of ice.'], es: ['Vaso highball', 'el vaso highball', 'm', 'Vaso alto y recto para destilado más refresco o jugo sobre mucho hielo.']},
  collins: {en: ['Collins glass', 'the collins glass', 'n', 'Taller and narrower than the highball. Home of Collinses, fizzes and Mojitos.'], es: ['Vaso collins', 'el vaso collins', 'm', 'Más alto y estrecho que el highball. La casa de los Collins, los Fizz y el Mojito.']},
  flute: {en: ['Champagne flute', 'the flute', 'n', 'A tall, narrow glass that preserves the bubbles of sparkling wine.'], es: ['Copa flauta', 'la copa flauta', 'f', 'Copa alta y estrecha que conserva la burbuja del espumante.']},
  wine: {en: ['Wine glass', 'the wine glass', 'n', 'A rounded glass. Used for the Spritz, the Kir and wine-based drinks.'], es: ['Copa de vino', 'la copa de vino', 'f', 'Copa redondeada. Se usa en el Spritz, el Kir y los tragos con vino.']},
  mug: {en: ['Copper mug', 'the copper mug', 'n', 'The Moscow Mule mug: copper keeps the drink cold for longer.'], es: ['Taza de cobre', 'la taza de cobre', 'f', 'La taza del Moscow Mule: el cobre mantiene el trago frío por más tiempo.']},
  tiki: {en: ['Tiki mug', 'the tiki mug', 'n', 'A carved ceramic mug, icon of the Polynesian bars of the 1930s and 1940s.'], es: ['Taza tiki', 'la taza tiki', 'f', 'Taza de cerámica tallada, ícono de los bares polinesios de los años 30 y 40.']},
  irish: {en: ['Irish coffee glass', 'the Irish coffee glass', 'n', 'A tempered, stemmed glass with a handle, for hot drinks.'], es: ['Copa Irish coffee', 'la copa Irish coffee', 'f', 'Copa de vidrio templado con asa y pie, para tragos calientes.']},
  julep: {en: ['Julep cup', 'the julep cup', 'n', 'A silver or pewter cup that frosts over from the crushed ice.'], es: ['Vaso julep', 'el vaso julep', 'm', 'Vaso de plata o peltre que se escarcha por fuera con el hielo picado.']},
  hurricane: {en: ['Hurricane glass', 'the hurricane glass', 'n', 'A curvy, lamp-shaped glass for tropical and blended drinks.'], es: ['Copa hurricane', 'la copa hurricane', 'f', 'Copa curvilínea con forma de farol, para tragos tropicales y frozen.']}
};

const TOOL = {
  coqueteleira: {en: ['Shaker', 'Boston (two-piece) or cobbler (three-piece). For drinks with citrus, egg or cream.'], es: ['Coctelera', 'Boston (dos piezas) o cobbler (tres piezas). Para tragos con cítricos, huevo o crema.']},
  dosador: {en: ['Jigger', 'A double-cone measure, usually 30/45 ml or 25/50 ml. Classic mixology is precision.'], es: ['Jigger (medidor)', 'Medidor de doble cono, normalmente 30/45 ml o 25/50 ml. La coctelería clásica es precisión.']},
  hawthorne: {en: ['Hawthorne strainer', 'A spring-rimmed strainer that fits the shaker and holds back the ice.'], es: ['Colador Hawthorne', 'Colador con resorte que encaja en la coctelera y retiene el hielo.']},
  peneira: {en: ['Fine strainer', 'Used for double straining: removes ice shards, pulp and herbs for a silky texture.'], es: ['Colador fino', 'Para el doble colado: retira astillas de hielo, pulpa y hierbas para una textura sedosa.']},
  misturador: {en: ['Mixing glass', 'A wide, thick glass for stirred drinks made only of spirits and wines.'], es: ['Vaso mezclador', 'Vaso ancho de vidrio grueso para tragos mezclados, solo con destilados y vinos.']},
  bailarina: {en: ['Bar spoon', 'A long, twisted spoon for stirring, measuring (1 spoon ≈ 5 ml) and layering.'], es: ['Cuchara bailarina', 'Cuchara de mango largo y torcido para mezclar, medir (1 cuchara ≈ 5 ml) y hacer capas.']},
  julep_strainer: {en: ['Julep strainer', 'A perforated, spoon-shaped strainer used with the mixing glass.'], es: ['Colador julep', 'Colador perforado con forma de cuchara, usado con el vaso mezclador.']},
  socador: {en: ['Muddler', 'For pressing lime, sugar and herbs at the bottom of the glass.'], es: ['Mortero (muddler)', 'Para macerar lima, azúcar y hierbas en el fondo del vaso.']},
  espremedor: {en: ['Citrus press', 'Always freshly squeezed. Never boxed juice for citrus.'], es: ['Exprimidor', 'Jugo siempre exprimido al momento. Nunca cítrico de caja.']},
  descascador: {en: ['Peeler / zester', 'Takes the citrus peel without the white pith, for twists and aromatic oils.'], es: ['Pelador / zester', 'Saca la cáscara del cítrico sin la parte blanca, para twists y aceites aromáticos.']},
  faca: {en: ['Knife and board', 'For wheels, wedges and fruit garnishes.'], es: ['Cuchillo y tabla', 'Para rodajas, gajos y decoraciones de fruta.']},
  liquidificador: {en: ['Blender', 'For frozen drinks blended with crushed ice.'], es: ['Licuadora', 'Para tragos frozen batidos con hielo picado.']},
  chaleira: {en: ['Kettle', 'To heat water and warm the glass for hot drinks.'], es: ['Hervidor', 'Para calentar agua y templar la copa en tragos calientes.']},
  pinca: {en: ['Bar tweezers', 'To place garnishes with precision.'], es: ['Pinza de bar', 'Para colocar decoraciones con precisión.']}
};

// Frases livres de quantidade, notas e guarnições: português → [inglês, espanhol]
const PHRASE = {
  'ralada na hora': ['freshly grated', 'recién rallada'], 'um toque': ['a splash', 'un chorrito'], '1 colher bailarina': ['1 bar spoon', '1 cuchara bailarina'], '1 unidade': ['1', '1 unidad'],
  '1 colher bailarina de xarope': ['1 bar spoon of syrup', '1 cuchara bailarina de jarabe'], '2 dashes': ['2 dashes', '2 golpes'], 'para crustar a borda': ['to crust the rim', 'para escarchar el borde'],
  'algumas gotas de clara': ['a few drops of egg white', 'unas gotas de clara'], '1 dash': ['1 dash', '1 golpe'], '2 gotas': ['2 drops', '2 gotas'], '1 cubo de açúcar': ['1 sugar cube', '1 terrón de azúcar'],
  'alguns dashes': ['a few dashes', 'unos golpes'], '3 dashes': ['3 dashes', '3 golpes'], '10 ml de gema': ['10 ml egg yolk', '10 ml de yema'], '30 ml de clara': ['30 ml egg white', '30 ml de clara'],
  'para completar': ['to top', 'para completar'], '10 ml (para perfumar o copo)': ['10 ml (to rinse the glass)', '10 ml (para perfumar el vaso)'], '½ colher bailarina': ['½ bar spoon', '½ cuchara bailarina'],
  '¼ de colher bailarina': ['¼ bar spoon', '¼ de cuchara bailarina'], '20 ml de clara (opcional)': ['20 ml egg white (optional)', '20 ml de clara (opcional)'], 'a gosto': ['to taste', 'al gusto'],
  'sal de aipo ou sal a gosto': ['celery salt or salt to taste', 'sal de apio o sal al gusto'], '1 talo': ['1 stalk', '1 rama'], '1 limão cortado em gomos': ['1 lime cut into wedges', '1 lima cortada en gajos'],
  '4 colheres de chá de açúcar': ['4 teaspoons sugar', '4 cucharaditas de azúcar'], '1 folha': ['1 leaf', '1 hoja'], '1 dash (opcional)': ['1 dash (optional)', '1 golpe (opcional)'],
  '1 colher de chá (mascavo)': ['1 teaspoon (brown sugar)', '1 cucharadita (azúcar morena)'], '1 ramo': ['1 sprig', '1 rama'], 'para a borda (opcional)': ['for the rim (optional)', 'para el borde (opcional)'],
  '4 ramos': ['4 sprigs', '4 ramas'], '1 colher de chá': ['1 teaspoon', '1 cucharadita'], '2 colheres de chá': ['2 teaspoons', '2 cucharaditas'], '6 folhas': ['6 leaves', '6 hojas'], '1 clara': ['1 egg white', '1 clara'],
  'algumas gotas por cima': ['a few drops on top', 'unas gotas encima'], '7,5 ml de xarope de canela': ['7.5 ml cinnamon syrup', '7,5 ml de jarabe de canela'], '6 gotas': ['6 drops', '6 gotas'],
  '2 colheres de chá (xarope de mel)': ['2 teaspoons (honey syrup)', '2 cucharaditas (jarabe de miel)'], 'amoras frescas': ['fresh blackberries', 'moras frescas'], '1 espresso curto': ['1 short espresso', '1 espresso corto'],
  'para a borda': ['for the rim', 'para el borde'], '1 pitada': ['1 pinch', '1 pizca'], '22,5 ml de xarope de mel e gengibre': ['22.5 ml honey-ginger syrup', '22,5 ml de jarabe de miel y jengibre'], 'para o xarope': ['for the syrup', 'para el jarabe'],
  '2 ramos': ['2 sprigs', '2 ramas'], '1 rodela': ['1 wheel', '1 rodaja'], '20 ml de clara': ['20 ml egg white', '20 ml de clara'], '15 ml de clara': ['15 ml egg white', '15 ml de clara'], '1 limão em gomos': ['1 lime in wedges', '1 lima en gajos'],
  '4 colheres de chá': ['4 teaspoons', '4 cucharaditas'], '1 disco de casca com polpa': ['1 coin of peel with some flesh', '1 disco de cáscara con pulpa'], '1 colher de chá (xarope de cana)': ['1 teaspoon (cane syrup)', '1 cucharadita (jarabe de caña)'],
  '1 cubo ou 5 ml de xarope': ['1 cube or 5 ml syrup', '1 terrón o 5 ml de jarabe'], '22,5 ml de xarope de mel': ['22.5 ml honey syrup', '22,5 ml de jarabe de miel'], '15 ml de xarope de mel': ['15 ml honey syrup', '15 ml de jarabe de miel'],
  '½ limão-siciliano em gomos': ['½ lemon in wedges', '½ limón en gajos'], '1 punhado de folhas': ['1 handful of leaves', '1 puñado de hojas'], 'borda de sal = Salty Dog': ['salt rim = Salty Dog', 'borde de sal = Salty Dog'],
  '1 gota / lavagem da taça': ['1 drop / glass rinse', '1 gota / enjuague de la copa'], '1 pau': ['1 stick', '1 rama'],
  // notas
  'de preferência cítrica': ['citrus vodka preferred', 'de preferencia cítrico'], 'verde': ['green', 'verde'], 'branco': ['white', 'blanco'], 'quente': ['hot', 'caliente'], 'levemente batido': ['lightly whipped', 'ligeramente batida'],
  '30 ml jamaicano + 30 ml da Martinica, ou só um rum envelhecido': ['30 ml Jamaican + 30 ml Martinique, or just one aged rum', '30 ml jamaicano + 30 ml de Martinica, o un solo ron añejo'], 'curaçau laranja': ['orange curaçao', 'curazao de naranja'],
  '45 ml jamaicano + 30 ml dourado': ['45 ml Jamaican + 30 ml gold', '45 ml jamaicano + 30 ml dorado'], 'rum forte (overproof) para flutuar': ['overproof rum to float', 'ron overproof para flotar'],
  'aguardiente cubana ou rum branco': ['Cuban aguardiente or white rum', 'aguardiente cubano o ron blanco'], 'para flutuar': ['to float', 'para flotar'], 'à moda de Jeffrey Morgenthaler': ['Jeffrey Morgenthaler style', 'al estilo de Jeffrey Morgenthaler'],
  'idealmente rhum agricole': ['ideally rhum agricole', 'idealmente rhum agricole'], 'reposado': ['reposado', 'reposado'],
  // guarnições
  'noz-moscada ralada': ['grated nutmeg', 'nuez moscada rallada'], 'meia rodela de laranja e casca de limão': ['half orange wheel and lemon peel', 'media rodaja de naranja y cáscara de limón'],
  'cereja marrasquino (opcional)': ['maraschino cherry (optional)', 'cereza al marrasquino (opcional)'], 'torção de laranja': ['orange twist', 'twist de naranja'],
  'borda de açúcar e uma longa casca de limão-siciliano forrando a taça': ['sugar rim and a long lemon peel lining the glass', 'borde de azúcar y una larga cáscara de limón forrando la copa'],
  'casca de limão-siciliano e cereja': ['lemon peel and cherry', 'cáscara de limón y cereza'], 'framboesas frescas': ['fresh raspberries', 'frambuesas frescas'],
  'azeitona verde ou torção de limão-siciliano': ['green olive or lemon twist', 'aceituna verde o twist de limón'], 'rodela de limão-siciliano': ['lemon wheel', 'rodaja de limón'],
  'rodela de limão-siciliano e cereja': ['lemon wheel and cherry', 'rodaja de limón y cereza'], 'cereja marrasquino': ['maraschino cherry', 'cereza al marrasquino'], 'torção de limão-siciliano': ['lemon twist', 'twist de limón'],
  'meia rodela de laranja': ['half orange wheel', 'media rodaja de naranja'], 'casca de laranja e cereja': ['orange peel and cherry', 'cáscara de naranja y cereza'], 'casca de laranja': ['orange peel', 'cáscara de naranja'],
  'casca de limão-siciliano (esprema e descarte ou mantenha)': ['lemon peel (express, then discard or keep)', 'cáscara de limón (exprímela y descártala o déjala)'],
  'cereja e torção de limão-siciliano': ['cherry and lemon twist', 'cereza y twist de limón'], 'meia rodela de laranja e cereja': ['half orange wheel and cherry', 'media rodaja de naranja y cereza'],
  'talo de salsão e gomo de limão-siciliano': ['celery stalk and lemon wedge', 'rama de apio y gajo de limón'], 'gomo de limão': ['lime wedge', 'gajo de lima'], 'folha de hortelã': ['mint leaf', 'hoja de hierbabuena'],
  'uma longa espiral de casca de limão-siciliano': ['a long spiral of lemon peel', 'una larga espiral de cáscara de limón'],
  'ramo de hortelã, casca de limão e espeto de abacaxi': ['mint sprig, lime shell and pineapple spear', 'rama de hierbabuena, cáscara de lima y brocheta de piña'], 'meia borda de sal': ['half salt rim', 'medio borde de sal'],
  'torção de laranja (opcional)': ['orange twist (optional)', 'twist de naranja (opcional)'], 'buquê de hortelã': ['mint bouquet', 'ramillete de hierbabuena'], 'ramo de hortelã e rodela de limão': ['mint sprig and lime wheel', 'rama de hierbabuena y rodaja de lima'],
  'rodela de limão': ['lime wheel', 'rodaja de lima'], 'fatia de abacaxi e cereja': ['pineapple slice and cherry', 'rodaja de piña y cereza'], 'gotas de Angostura sobre a espuma': ['drops of Angostura on the foam', 'gotas de Angostura sobre la espuma'],
  'longa torção de limão-siciliano': ['long lemon twist', 'twist largo de limón'], 'ramo de hortelã': ['mint sprig', 'rama de hierbabuena'], 'torção de laranja ou limão': ['orange or lemon twist', 'twist de naranja o limón'],
  'amoras e rodela de limão-siciliano': ['blackberries and lemon wheel', 'moras y rodaja de limón'], 'três grãos de café': ['three coffee beans', 'tres granos de café'], 'borda de açúcar e rodela de limão-siciliano': ['sugar rim and lemon wheel', 'borde de azúcar y rodaja de limón'],
  'rodela de limão (borda de sal opcional)': ['lime wheel (salt rim optional)', 'rodaja de lima (borde de sal opcional)'], 'gengibre cristalizado': ['candied ginger', 'jengibre confitado'], 'rodela de limão-siciliano e amora': ['lemon wheel and blackberry', 'rodaja de limón y mora'],
  'cereja': ['cherry', 'cereza'], 'azeitona ou torção de limão-siciliano': ['olive or lemon twist', 'aceituna o twist de limón'], 'casca de laranja flambada': ['flamed orange peel', 'cáscara de naranja flameada'], 'torção de toranja': ['grapefruit twist', 'twist de pomelo'],
  'ramo de manjericão': ['basil sprig', 'rama de albahaca'], 'hortelã e rodela de limão': ['mint and lime wheel', 'hierbabuena y rodaja de lima'], 'borda de sal e gomo de limão': ['salt rim and lime wedge', 'borde de sal y gajo de lima'],
  'rodela de laranja': ['orange wheel', 'rodaja de naranja'], 'borda de sal (versão Salty Dog)': ['salt rim (Salty Dog version)', 'borde de sal (versión Salty Dog)'],
  'rodela de limão-siciliano e pau de canela': ['lemon wheel and cinnamon stick', 'rodaja de limón y rama de canela']
};

const BASE = {
  'Gin': ['Gin', 'Ginebra'], 'Vodka': ['Vodka', 'Vodka'], 'Rum': ['Rum', 'Ron'], 'Cachaça': ['Cachaça', 'Cachaça'], 'Tequila & Mezcal': ['Tequila & Mezcal', 'Tequila y Mezcal'], 'Whiskey': ['Whiskey', 'Whiskey'],
  'Conhaque & Brandy': ['Cognac & Brandy', 'Coñac y Brandy'], 'Vinhos & Espumantes': ['Wines & Sparkling', 'Vinos y Espumantes'], 'Aperitivos & Licores': ['Aperitifs & Liqueurs', 'Aperitivos y Licores']
};

const idx = () => current === 'en' ? 0 : 1;
export const trIngredient = (id, pt) => current === 'pt' ? pt : (ING[id]?.[idx()] ?? pt);
export const trGroup = pt => current === 'pt' ? pt : (GROUP[pt]?.[idx()] ?? pt);
export const trPhrase = pt => !pt || current === 'pt' ? pt : (PHRASE[pt]?.[idx()] ?? pt);
export const trBase = pt => current === 'pt' ? pt : (BASE[pt]?.[idx()] ?? pt);
export const trCategory = (cat, pt) => current === 'pt' ? pt : CAT[cat][current];
export const catLabel = cat => CAT[cat][current][0];
export const catShort = cat => CAT[cat][current][1];
export function trGlass(id, ptGlass) {
  if (current === 'pt') return {name: ptGlass.name, the: ptGlass.the, gender: ptGlass.the.startsWith('o ') ? 'm' : 'f', desc: ptGlass.desc};
  const [name, the, gender, desc] = GLASS[id][current];
  return {name, the, gender, desc};
}
export function trTool(id, ptTool) {
  if (current === 'pt') return ptTool;
  const [name, desc] = TOOL[id][current];
  return {name, desc};
}
export const _dictionaries = {ING, GROUP, GLASS, TOOL, PHRASE, UI};
