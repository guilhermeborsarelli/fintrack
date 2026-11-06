// Home Tender — idiomas (português, inglês, espanhol).
// O português é a fonte (data.js); aqui ficam as traduções da interface e dos dados.

export const LANGS = ['pt', 'en', 'es'];
export const LANG_LABEL = {pt: 'Português', en: 'English', es: 'Español'};

let current = 'pt';
export function detectLang(saved) {
  if (LANGS.includes(saved)) return saved;
  // Produto brasileiro: se o português estiver entre os idiomas do navegador, abre em português.
  const prefs = (globalThis.navigator?.languages?.length ? globalThis.navigator.languages : [globalThis.navigator?.language || 'pt']).map(l => String(l).slice(0, 2).toLowerCase());
  if (prefs.includes('pt')) return 'pt';
  return prefs.find(l => LANGS.includes(l)) || 'en';
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
    search: 'Buscar drink ou ingrediente…', searchShort: 'Buscar drink…', allBases: 'Todas as bases', all: 'Todos', noResults: 'Nenhum drink encontrado.',
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
    language: 'Idioma',
    recipeKicker: 'A receita', recipeTitle: 'Mãos à obra', difficulty: 'Dificuldade', diffLevels: ['Fácil', 'Médio', 'Avançado'], time: 'Tempo', yieldLabel: 'Rende', yieldValue: '1 drink',
    youNeed: 'Você vai precisar', stepByStep: 'Passo a passo', stepsHint: 'Toque em cada passo quando terminar.', tipTitle: 'Dica do bartender', improvise: 'Sem utensílios de bar? Improvise:',
    units: ['colher de sopa', 'colheres de sopa', 'colher de chá', 'colheres de chá'], homeMeasureNote: 'Medidas caseiras aproximadas: 1 colher de sopa ≈ 15 ml.',
    tips: {
      shake: 'Bata com vontade, segurando as duas partes da coqueteleira. Quando ela ficar gelada e embaçada por fora, está no ponto.',
      stir: 'Mexa com calma, girando a colher rente à parede do copo. A ideia é gelar e diluir sem criar bolhas: o drink fica sedoso e transparente.',
      build: 'Gelo primeiro, bebidas depois: o drink já nasce gelado. Use bastante gelo; pouco gelo derrete rápido e deixa o drink aguado.',
      muddle: 'Pressione, não triture: o socador só precisa liberar os sucos e os óleos. Ervas esmagadas demais deixam o drink amargo.',
      blend: 'Use gelo picado e bata em pulsos curtos. Pare assim que ficar cremoso: bater demais derrete o gelo e deixa aguado.',
      egg: 'Use ovo bem fresco e separe só a clara. O primeiro batido, sem gelo, é o que cria a espuma; não pule essa etapa.'
    },
    impro: {coqueteleira: 'Pote de vidro com tampa bem fechada.', dosador: 'Colher de sopa (15 ml) e de chá (5 ml).', socador: 'O cabo de uma colher de pau.', peneira: 'Uma peneirinha de chá.', hawthorne: 'A tampa do pote entreaberta segura o gelo.', julep_strainer: 'Uma colher grande segurando o gelo.', misturador: 'Qualquer copo alto e firme.', bailarina: 'Uma colher comprida ou um hashi.', espremedor: 'Esprema com a mão, sobre uma peneira.', descascador: 'Uma faca pequena, tirando só a parte colorida da casca.', pinca: 'Os dedos limpos, com delicadeza.', chaleira: 'Uma panela no fogo.'}
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
    search: 'Search a drink or ingredient…', searchShort: 'Search drinks…', allBases: 'All bases', all: 'All', noResults: 'No drinks found.',
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
    serveLabel: {up: 'Straight up', neat: 'Neat', rocks: 'On the rocks', big: 'Large ice cube', crushed: 'Crushed ice', hot: 'Hot'},
    language: 'Language',
    recipeKicker: 'The recipe', recipeTitle: 'Let’s make it', difficulty: 'Difficulty', diffLevels: ['Easy', 'Medium', 'Advanced'], time: 'Time', yieldLabel: 'Makes', yieldValue: '1 drink',
    youNeed: 'You will need', stepByStep: 'Step by step', stepsHint: 'Tap each step as you finish it.', tipTitle: 'Bartender’s tip', improvise: 'No bar tools? Improvise:',
    units: ['tbsp', 'tbsp', 'tsp', 'tsp'], homeMeasureNote: 'Approximate kitchen measures: 1 tbsp ≈ 15 ml.',
    tips: {
      shake: 'Shake hard, holding both parts of the shaker. When it feels ice-cold and frosts on the outside, it’s ready.',
      stir: 'Stir calmly, gliding the spoon around the inside of the glass. The goal is to chill and dilute without adding bubbles, so the drink stays silky and clear.',
      build: 'Ice first, then the drinks: it starts cold from the first pour. Use plenty of ice; too little melts fast and waters the drink down.',
      muddle: 'Press, don’t pulverise: the muddler only needs to release juices and oils. Over-crushed herbs turn the drink bitter.',
      blend: 'Use crushed ice and blend in short pulses. Stop as soon as it turns creamy: blending too long melts the ice and waters it down.',
      egg: 'Use a very fresh egg and separate just the white. The first shake, without ice, is what builds the foam, so don’t skip it.'
    },
    impro: {coqueteleira: 'A glass jar with a tight lid.', dosador: 'A tablespoon (15 ml) and teaspoon (5 ml).', socador: 'The handle of a wooden spoon.', peneira: 'A small tea strainer.', hawthorne: 'Hold the ice back with the jar lid slightly open.', julep_strainer: 'A large spoon holding back the ice.', misturador: 'Any tall, sturdy glass.', bailarina: 'A long spoon or a chopstick.', espremedor: 'Squeeze by hand over a sieve.', descascador: 'A small knife, taking only the coloured part of the peel.', pinca: 'Clean fingers and a gentle touch.', chaleira: 'A pan on the stove.'}
  },
  es: {
    tagline: 'El bartender de tu casa', eyebrow: 'Coctelería clásica',
    coverLede: 'Los grandes cócteles del mundo, como los aprenden los bartenders: las recetas oficiales de la International Bartenders Association, la historia de cada cóctel y el paso a paso para servirlos en casa como en el bar de un hotel.',
    feat1: 'El canon oficial', feat1d: 'Los clásicos de la IBA con medidas exactas, cristalería y utensilios.',
    feat2: 'Tu bar', feat2d: 'Di qué tienes en la estantería y recibe la sugerencia de la casa.',
    feat3: 'La historia', feat3d: 'De 1806 a hoy: la cultura detrás de cada cóctel.',
    login: 'Entrar', register: 'Crear cuenta', name: 'Nombre', namePh: 'Cómo quieres que te llamemos', email: 'Correo electrónico', password: 'Contraseña', passwordPh: 'Mínimo 6 caracteres',
    adult: 'Tengo 18 años o más', registerSubmit: 'Crear cuenta y entrar', authNote: 'Tu cuenta y tu bar se guardan en este dispositivo.',
    mustBeAdult: 'Home Tender es solo para mayores de 18 años.', drinkResponsibly: 'Bebe con moderación. Prohibida la venta de alcohol a menores de 18 años.',
    logout: 'Salir', tabHome: 'Inicio', tabClassics: 'Clásicos', tabRiffs: 'Variaciones', tabBar: 'Mi Bar', tabTools: 'Utensilios',
    search: 'Buscar cóctel o ingrediente…', searchShort: 'Buscar cóctel…', allBases: 'Todas las bases', all: 'Todos', noResults: 'No se encontraron cócteles.',
    classicsKicker: 'Lista oficial IBA', classicsTitle: 'Los Clásicos', classicsLede: 'El canon de la International Bartenders Association en tres capítulos: los inolvidables de la Edad de Oro, los clásicos contemporáneos del siglo XX y los cócteles de la nueva era que ya son referencia.',
    riffsKicker: 'Conocidos en todo el mundo', riffsTitle: 'Variaciones consagradas', riffsLede: 'Cócteles que no están en la lista oficial, pero que todo bartender conoce. Cada uno nace de un clásico: se cambia la base, se ajusta el dulzor, se cambia la copa. Cuando tu bar no alcanza para un clásico, o no te gusta un ingrediente, la respuesta está aquí.',
    recipes: n => `${n} receta${n === 1 ? '' : 's'}`,
    barKicker: 'Personalizado', barTitle: 'Mi Bar', barLede: 'Marca lo que hay en tu estantería. Home Tender busca primero un clásico de la IBA; si ninguno encaja, sugiere una variación consagrada.',
    barShelf: 'Tu estantería', barFilter: 'Filtrar ingredientes…', clear: 'Limpiar', selected: n => `${n} seleccionado${n === 1 ? '' : 's'}`,
    presetHome: 'Bar de casa', presetAperitivo: 'Bar de aperitivo', presetWhiskey: 'Bar de whiskey',
    waitingTitle: 'El bartender espera', waitingText: 'Elige al menos un ingrediente y te sugiere un cóctel.',
    housePick: 'Sugerencia de la casa', pickClassic: 'Con lo que tienes, puedes servir un clásico oficial.',
    pickRiff: parent => `Ningún clásico de la IBA encaja con tu estantería, pero la coctelería tiene respuesta: una variación consagrada${parent ? ` ${/a$/i.test(parent) ? 'de la' : 'del'} ${parent}` : ''}.`,
    pickNone: 'Todavía no alcanza para ningún cóctel. Mira abajo qué falta.',
    possibleClassics: 'Clásicos posibles', possibleRiffs: 'Variaciones posibles', almost: 'Casi listo', missing: 'Falta', seeRecipe: 'Ver receta', seeDrinks: n => `Ver ${n} ${n === 1 ? 'cóctel' : 'cócteles'}`, seeSuggestions: 'Ver sugerencias',
    back: 'Volver', story: 'La historia', ingredients: 'Ingredientes', method: 'Preparación', glass: 'Cristalería', whyGlass: 'Por qué esta cristalería', tools: 'Utensilios', garnish: 'Decoración',
    optional: 'opcional', or: 'o', youHave: 'Lo tienes', youLack: 'No lo tienes', canMake: 'Puedes prepararlo con tu bar.', lacks: list => `A tu bar le falta: ${list}`,
    riffOf: name => `Variación ${/a$/i.test(name) ? 'de la' : 'del'} ${name}`, riffPrefix: name => `Variación ${/a$/i.test(name) ? 'de la' : 'del'} `, riffsOfThis: 'Variaciones de este clásico', originClassic: 'El clásico de origen',
    glassesTitle: 'Cristalería', toolsTitle: 'Los utensilios', toolsKicker: 'Detrás de la barra', toolsLede: 'Cada cóctel clásico tiene su copa y sus herramientas. Conoce para qué sirve cada una y en qué recetas aparece.',
    usedIn: n => `Se usa en ${n} receta${n === 1 ? '' : 's'}`, photoCredits: 'Créditos de las fotos',
    methods: {shake: 'Agitado', stir: 'Revuelto', build: 'Directo en la copa', muddle: 'Macerado', blend: 'En licuadora'},
    serveLabel: {up: 'Sin hielo', neat: 'Sin hielo', rocks: 'Con hielo', big: 'Hielo grande', crushed: 'Hielo picado', hot: 'Caliente'},
    language: 'Idioma',
    recipeKicker: 'La receta', recipeTitle: 'Manos a la obra', difficulty: 'Dificultad', diffLevels: ['Fácil', 'Media', 'Avanzada'], time: 'Tiempo', yieldLabel: 'Rinde', yieldValue: '1 cóctel',
    youNeed: 'Vas a necesitar', stepByStep: 'Paso a paso', stepsHint: 'Toca cada paso al terminarlo.', tipTitle: 'Consejo del bartender', improvise: '¿Sin utensilios de bar? Improvisa:',
    units: ['cucharada', 'cucharadas', 'cucharadita', 'cucharaditas'], homeMeasureNote: 'Medidas caseras aproximadas: 1 cucharada ≈ 15 ml.',
    tips: {
      shake: 'Agita con energía, sujetando las dos partes de la coctelera. Cuando esté helada y empañada por fuera, está lista.',
      stir: 'Revuelve con calma, deslizando la cuchara por la pared del vaso. La idea es enfriar y diluir sin crear burbujas: el cóctel queda sedoso y transparente.',
      build: 'Primero el hielo, después las bebidas: el cóctel nace frío. Usa mucho hielo; poco hielo se derrite rápido y lo agua.',
      muddle: 'Presiona, no tritures: el muddler solo tiene que liberar jugos y aceites. Las hierbas demasiado machacadas amargan el cóctel.',
      blend: 'Usa hielo picado y licúa en pulsos cortos. Para en cuanto quede cremoso: licuar de más derrite el hielo y lo agua.',
      egg: 'Usa un huevo muy fresco y separa solo la clara. El primer agitado, sin hielo, es el que crea la espuma: no te lo saltes.'
    },
    impro: {coqueteleira: 'Un frasco de vidrio con tapa bien cerrada.', dosador: 'Una cuchara (15 ml) y una cucharita (5 ml).', socador: 'El mango de una cuchara de madera.', peneira: 'Un colador de té.', hawthorne: 'La tapa del frasco entreabierta retiene el hielo.', julep_strainer: 'Una cuchara grande reteniendo el hielo.', misturador: 'Cualquier vaso alto y firme.', bailarina: 'Una cuchara larga o un palillo chino.', espremedor: 'Exprime a mano, sobre un colador.', descascador: 'Un cuchillo pequeño, quitando solo la parte de color de la cáscara.', pinca: 'Los dedos limpios, con delicadeza.', chaleira: 'Una olla al fuego.'}
  }
};

export const t = (key, ...args) => {
  const v = UI[current][key] ?? UI.pt[key];
  return typeof v === 'function' ? v(...args) : v;
};
export const tm = (group, key) => (UI[current][group] || UI.pt[group])[key];

// ───────────── Dados ─────────────
const ING = {
  grappa: ['Grappa', 'Grappa'], grand_marnier: ['Grand Marnier', 'Grand Marnier'], frangelico: ['Frangelico (hazelnut liqueur)', 'Frangelico (licor de avellana)'],
  licor_maracuja: ['Passion fruit liqueur', 'Licor de maracuyá'], pimenta_jamaica: ['Allspice dram', 'Licor de pimienta de Jamaica (allspice dram)'], cynar: ['Cynar', 'Cynar'],
  jerez: ['Sherry (Amontillado / Palo Cortado)', 'Jerez (amontillado / palo cortado)'], maracuja: ['Passion fruit (purée or syrup)', 'Maracuyá (puré o jarabe)'],
  flor_sabugueiro: ['Elderflower cordial', 'Cordial de flor de saúco'], camomila: ['Chamomile (tea or cordial)', 'Manzanilla (infusión o cordial)'], pimenta_dedo: ['Fresh red chili', 'Chile rojo fresco (ají / guindilla)'], cravo: ['Cloves', 'Clavo de olor'],
  gin: ['Gin', 'Ginebra'], vodka: ['Vodka', 'Vodka'], rum_branco: ['White rum', 'Ron blanco'], rum_escuro: ['Aged or dark rum', 'Ron añejo / oscuro'], cachaca: ['Cachaça', 'Cachaça'],
  tequila: ['100% agave tequila', 'Tequila 100% agave'], mezcal: ['Mezcal', 'Mezcal'], bourbon: ['Bourbon / rye whiskey', 'Bourbon / whiskey de centeno'], scotch: ['Scotch whisky', 'Whisky escocés'],
  scotch_islay: ['Peated Islay Scotch', 'Whisky turbado de Islay'], irish: ['Irish whiskey', 'Whiskey irlandés'], conhaque: ['Cognac / brandy', 'Coñac / brandy'], calvados: ['Calvados (apple brandy)', 'Calvados (brandy de manzana)'],
  pisco: ['Pisco', 'Pisco'], absinto: ['Absinthe / pastis', 'Absenta / pastis'], triple_sec: ['Triple sec / Cointreau / curaçao', 'Triple sec / Cointreau / curazao'], maraschino: ['Maraschino liqueur', 'Licor marrasquino'],
  chartreuse_verde: ['Green Chartreuse', 'Chartreuse verde'], chartreuse_amarelo: ['Yellow Chartreuse', 'Chartreuse amarillo'], violette: ['Crème de violette', 'Crème de violette'], apricot: ['Apricot brandy', 'Apricot brandy (licor de albaricoque)'],
  cacau: ['Crème de cacao', 'Crema de cacao'], menta: ['Crème de menthe', 'Crema de menta'], drambuie: ['Drambuie', 'Drambuie'], benedictine: ['Bénédictine D.O.M.', 'Bénédictine D.O.M.'], amaretto: ['Amaretto', 'Amaretto'],
  galliano: ['Galliano', 'Galliano'], licor_cafe: ['Coffee liqueur', 'Licor de café'], licor_43: ['Licor 43', 'Licor 43'], baileys: ['Baileys Irish Cream', 'Baileys (crema de whisky irlandés)'], cassis: ['Crème de cassis', 'Crème de cassis'], mure: ['Crème de mûre (blackberry)', 'Crème de mûre (mora)'],
  framboesa_licor: ['Raspberry liqueur', 'Licor de frambuesa'], cherry_heering: ['Cherry liqueur (Cherry Heering)', 'Licor de cereza (Cherry Heering)'], pessego_licor: ['Peach schnapps', 'Licor de durazno (melocotón)'], falernum: ['Falernum', 'Falernum'],
  vermute_tinto: ['Sweet vermouth (rosso)', 'Vermut rojo (rosso)'], vermute_seco: ['Dry vermouth', 'Vermut seco'], lillet: ['Lillet Blanc / white vermouth', 'Lillet Blanc / vermut blanco'], campari: ['Campari', 'Campari'], aperol: ['Aperol', 'Aperol'],
  fernet: ['Fernet-Branca', 'Fernet-Branca'], amaro: ['Amaro (Nonino or similar)', 'Amaro (Nonino o similar)'], porto: ['Ruby port', 'Oporto ruby'], vinho_branco: ['Dry white wine', 'Vino blanco seco'], vinho_tinto: ['Red wine', 'Vino tinto'],
  espumante: ['Champagne / sparkling wine / Prosecco', 'Champagne / espumante / Prosecco'], soda: ['Soda water', 'Agua con gas'], tonica: ['Tonic water', 'Agua tónica'], ginger_beer: ['Ginger beer', 'Ginger beer'], ginger_ale: ['Ginger ale', 'Ginger ale'],
  cola: ['Cola', 'Refresco de cola'], soda_toranja: ['Grapefruit soda', 'Refresco de pomelo (toronja)'], limao: ['Lime', 'Lima (limón verde)'], siciliano: ['Lemon', 'Limón (amarillo)'], laranja: ['Orange / orange juice', 'Naranja / jugo de naranja'],
  toranja: ['Grapefruit juice', 'Jugo de pomelo (toronja)'], abacaxi: ['Pineapple juice', 'Jugo de piña'], cranberry: ['Cranberry juice', 'Jugo de arándano rojo'], tomate: ['Tomato juice', 'Jugo de tomate'], pessego_pure: ['White peach purée', 'Puré de durazno blanco (melocotón)'],
  acucar: ['Sugar / simple syrup', 'Azúcar / jarabe simple'], mel: ['Honey', 'Miel'], agave: ['Agave syrup', 'Jarabe de agave'], grenadine: ['Grenadine (pomegranate syrup)', 'Granadina (jarabe de granada)'], orgeat: ['Orgeat (almond syrup)', 'Orgeat (jarabe de almendras)'],
  xarope_framboesa: ['Raspberry syrup', 'Jarabe de frambuesa'], creme_coco: ['Cream of coconut', 'Crema de coco'], canela: ['Cinnamon / cinnamon syrup', 'Canela / jarabe de canela'], angostura: ['Angostura bitters', 'Amargo de Angostura'],
  peychauds: ['Peychaud’s bitters', 'Amargo Peychaud’s'], bitter_laranja: ['Orange bitters', 'Amargo de naranja'], ovo: ['Eggs (white / yolk)', 'Huevos (clara / yema)'], creme_leite: ['Heavy cream', 'Crema de leche (nata)'], cafe: ['Espresso / coffee', 'Espresso / café'],
  flor_laranjeira: ['Orange flower water', 'Agua de azahar'], baunilha: ['Vanilla extract', 'Extracto de vainilla'], molho_ingles: ['Worcestershire sauce', 'Salsa inglesa'], tabasco: ['Tabasco', 'Tabasco'], hortela: ['Mint', 'Hierbabuena'],
  manjericao: ['Basil', 'Albahaca'], gengibre: ['Fresh ginger', 'Jengibre fresco'], sal: ['Salt', 'Sal'], pimenta: ['Black pepper', 'Pimienta negra'], salsao: ['Celery', 'Apio'], noz_moscada: ['Nutmeg', 'Nuez moscada'],
  cereja: ['Maraschino cherries', 'Cerezas al marrasquino'], azeitona: ['Green olive', 'Aceituna verde'], amora: ['Blackberries / raspberries', 'Moras / frambuesas'], agua: ['Water', 'Agua'], agua_quente: ['Hot water', 'Agua caliente']
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
  coupe: {en: ['Coupe', 'the coupe', 'n', 'A shallow, wide-mouthed stemmed glass, the "Champagne saucer" of the 1920s to 1940s. For drinks shaken or stirred and served without ice.'], es: ['Copa coupé', 'la copa coupé', 'f', 'Copa baja de boca ancha, la "copa de champán" de los años 20 a 40. Para cócteles agitados o revueltos que se sirven sin hielo.']},
  martini: {en: ['Cocktail (Martini) glass', 'the cocktail glass', 'n', 'The long-stemmed V-shaped glass. The stem keeps your hand from warming a drink served without ice.'], es: ['Copa de cóctel (Martini)', 'la copa de cóctel', 'f', 'La copa en V de tallo largo. El tallo evita que la mano caliente un cóctel servido sin hielo.']},
  rocks: {en: ['Old fashioned glass', 'the old fashioned glass', 'n', 'A short, heavy tumbler ("rocks glass"). For drinks served over ice or built in the glass.'], es: ['Vaso old fashioned', 'el vaso old fashioned', 'm', 'Vaso bajo y pesado ("rocks"). Para cócteles servidos sobre hielo o montados en el propio vaso.']},
  highball: {en: ['Highball glass', 'the highball glass', 'n', 'A tall, straight glass for a spirit plus a mixer over plenty of ice.'], es: ['Vaso highball', 'el vaso highball', 'm', 'Vaso alto y recto para destilado más refresco o jugo sobre mucho hielo.']},
  collins: {en: ['Collins glass', 'the collins glass', 'n', 'Taller and narrower than the highball. Home of Collinses, fizzes and Mojitos.'], es: ['Vaso collins', 'el vaso collins', 'm', 'Más alto y estrecho que el highball. La casa de los Collins, los Fizz y el Mojito.']},
  flute: {en: ['Champagne flute', 'the flute', 'n', 'A tall, narrow glass that preserves the bubbles of sparkling wine.'], es: ['Copa flauta', 'la copa flauta', 'f', 'Copa alta y estrecha que conserva la burbuja del espumante.']},
  wine: {en: ['Wine glass', 'the wine glass', 'n', 'A rounded glass. Used for the Spritz, the Kir and wine-based drinks.'], es: ['Copa de vino', 'la copa de vino', 'f', 'Copa redondeada. Se usa en el Spritz, el Kir y los cócteles con vino.']},
  mug: {en: ['Copper mug', 'the copper mug', 'n', 'The Moscow Mule mug: copper keeps the drink cold for longer.'], es: ['Taza de cobre', 'la taza de cobre', 'f', 'La taza del Moscow Mule: el cobre mantiene el cóctel frío por más tiempo.']},
  tiki: {en: ['Tiki mug', 'the tiki mug', 'n', 'A carved ceramic mug, icon of the Polynesian bars of the 1930s and 1940s.'], es: ['Taza tiki', 'la taza tiki', 'f', 'Taza de cerámica tallada, ícono de los bares polinesios de los años 30 y 40.']},
  irish: {en: ['Irish coffee glass', 'the Irish coffee glass', 'n', 'A tempered, stemmed glass with a handle, for hot drinks.'], es: ['Copa Irish coffee', 'la copa Irish coffee', 'f', 'Copa de vidrio templado con asa y pie, para cócteles calientes.']},
  julep: {en: ['Julep cup', 'the julep cup', 'n', 'A silver or pewter cup that frosts over from the crushed ice.'], es: ['Vaso julep', 'el vaso julep', 'm', 'Vaso de plata o peltre que se escarcha por fuera con el hielo picado.']},
  hurricane: {en: ['Hurricane glass', 'the hurricane glass', 'n', 'A curvy, lamp-shaped glass for tropical and blended drinks.'], es: ['Copa hurricane', 'la copa hurricane', 'f', 'Copa curvilínea con forma de farol, para cócteles tropicales y frozen.']}
};

const TOOL = {
  coqueteleira: {en: ['Shaker', 'Boston (two-piece) or cobbler (three-piece). For drinks with citrus, egg or cream.'], es: ['Coctelera', 'Boston (dos piezas) o cobbler (tres piezas). Para cócteles con cítricos, huevo o crema.']},
  dosador: {en: ['Jigger', 'A double-cone measure, usually 30/45 ml or 25/50 ml. Classic mixology is precision.'], es: ['Jigger (medidor)', 'Medidor de doble cono, normalmente 30/45 ml o 25/50 ml. La coctelería clásica es precisión.']},
  hawthorne: {en: ['Hawthorne strainer', 'A spring-rimmed strainer that fits the shaker and holds back the ice.'], es: ['Colador Hawthorne', 'Colador con resorte que encaja en la coctelera y retiene el hielo.']},
  peneira: {en: ['Fine strainer', 'Used for double straining: removes ice shards, pulp and herbs for a silky texture.'], es: ['Colador fino', 'Para el doble colado: retira astillas de hielo, pulpa y hierbas para una textura sedosa.']},
  misturador: {en: ['Mixing glass', 'A wide, thick glass for stirred drinks made only of spirits and wines.'], es: ['Vaso mezclador', 'Vaso ancho de vidrio grueso para cócteles revueltos, solo con destilados y vinos.']},
  bailarina: {en: ['Bar spoon', 'A long, twisted spoon for stirring, measuring (1 spoon ≈ 5 ml) and layering.'], es: ['Cuchara bailarina', 'Cuchara de mango largo y torcido para revolver, medir (1 cuchara ≈ 5 ml) y hacer capas.']},
  julep_strainer: {en: ['Julep strainer', 'A perforated, spoon-shaped strainer used with the mixing glass.'], es: ['Colador julep', 'Colador perforado con forma de cuchara, usado con el vaso mezclador.']},
  socador: {en: ['Muddler', 'For pressing lime, sugar and herbs at the bottom of the glass.'], es: ['Muddler (majadero)', 'Para macerar lima, azúcar y hierbas en el fondo del vaso.']},
  espremedor: {en: ['Citrus press', 'Always freshly squeezed. Never boxed juice for citrus.'], es: ['Exprimidor', 'Jugo siempre exprimido al momento. Nunca cítrico de caja.']},
  descascador: {en: ['Peeler / zester', 'Takes the citrus peel without the white pith, for twists and aromatic oils.'], es: ['Pelador / zester', 'Saca la cáscara del cítrico sin la parte blanca, para twists y aceites aromáticos.']},
  faca: {en: ['Knife and board', 'For wheels, wedges and fruit garnishes.'], es: ['Cuchillo y tabla', 'Para rodajas, gajos y decoraciones de fruta.']},
  liquidificador: {en: ['Blender', 'For frozen drinks blended with crushed ice.'], es: ['Licuadora', 'Para cócteles frozen batidos con hielo picado.']},
  chaleira: {en: ['Kettle', 'To heat water and warm the glass for hot drinks.'], es: ['Hervidor', 'Para calentar agua y templar la copa en cócteles calientes.']},
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
  'curaçau': ['curaçao', 'curazao'], 'Old Tom': ['Old Tom', 'Old Tom'], 'cubano': ['Cuban', 'cubano'], '2 colheres bailarina (açúcar refinado)': ['2 bar spoons (superfine sugar)', '2 cucharas bailarina (azúcar fino)'],
  '1 colher de sopa': ['1 tablespoon', '1 cucharada'], 'jamaicano': ['Jamaican', 'jamaicano'], 'xarope de cana': ['cane syrup', 'jarabe de caña'], 'folha de hortelã (opcional)': ['mint leaf (optional)', 'hoja de hierbabuena (opcional)'],
  'âmbar jamaicano': ['amber Jamaican', 'ámbar jamaicano'], 'da Martinica, de melaço': ['Martinique molasses rum', 'de Martinica, de melaza'], 'espeto de abacaxi, folhas de hortelã e casca de limão': ['pineapple spear, mint leaves and lime peel', 'brocheta de piña, hojas de hierbabuena y cáscara de lima'],
  'jamaicano escuro': ['Jamaican dark', 'jamaicano oscuro'], 'dourado de Porto Rico': ['gold Puerto Rican', 'dorado de Puerto Rico'], 'Demerara': ['Demerara', 'Demerara'],
  "15 ml de Donn's Mix (toranja + xarope de canela)": ["15 ml Donn's Mix (grapefruit + cinnamon syrup)", "15 ml de Donn's Mix (pomelo + jarabe de canela)"], 'Shiraz ou Malbec': ['Shiraz or Malbec', 'Shiraz o Malbec'], 'rye': ['rye', 'centeno'],
  'cherry brandy': ['cherry brandy', 'cherry brandy'], '7,5 ml (para perfumar a taça)': ['7.5 ml (to rinse the glass)', '7,5 ml (para perfumar la copa)'], 'casca de limão-siciliano': ['lemon zest', 'cáscara de limón'], 'gomo de laranja': ['orange wedge', 'gajo de naranja'],
  'folhas de hortelã e noz-moscada ralada': ['mint leaves and grated nutmeg', 'hojas de hierbabuena y nuez moscada rallada'], 'dourado jamaicano': ['gold Jamaican', 'dorado jamaicano'], 'xarope': ['syrup', 'jarabe'], 'xarope de mel': ['honey syrup', 'jarabe de miel'],
  'meio maracujá': ['half a passion fruit', 'medio maracuyá'], 'borda de sal marinho e rodela de limão': ['sea-salt rim and lime slice', 'borde de sal marina y rodaja de lima'], 'envelhecido': ['aged', 'añejo'], 'defumado': ['smoky', 'ahumado'], '5 gotas': ['5 drops', '5 gotas'],
  'purê': ['purée', 'puré'], '1 fatia fina': ['1 thin slice', '1 rodaja fina'], 'cítricos e fatia de abacaxi desidratado': ['citrus and a dehydrated pineapple slice', 'cítricos y rodaja de piña deshidratada'], 'espadín': ['espadín', 'espadín'],
  'overproof jamaicano': ['Jamaican overproof', 'overproof jamaicano'], 'blackstrap': ['blackstrap', 'blackstrap'], 'xarope demerara': ['Demerara syrup', 'jarabe demerara'], 'fatia de abacaxi': ['pineapple wedge', 'trozo de piña'], 'peach brandy': ['peach brandy', 'brandy de durazno'],
  '10 folhas': ['10 leaves', '10 hojas'], '5 a 6 folhas': ['5–6 leaves', '5 a 6 hojas'], 'ramos de hortelã': ['mint sprigs', 'ramas de hierbabuena'], '3 a 4 pedaços de abacaxi': ['3 to 4 pineapple chunks', '3 a 4 trozos de piña'], 'ramo de hortelã e fatia de abacaxi': ['mint sprig and pineapple slice', 'rama de hierbabuena y rodaja de piña'], '3 cravos': ['3 cloves', '3 clavos'],
  'de baunilha': ['vanilla', 'de vainilla'], '2 colheres bailarina (açúcar de baunilha)': ['2 bar spoons (vanilla sugar)', '2 cucharas bailarina (azúcar de vainilla)'], 'servido à parte, num copinho': ['served on the side, in a shot glass', 'servido aparte, en un vasito'],
  'meio maracujá polvilhado com açúcar': ['half a passion fruit sprinkled with sugar', 'medio maracuyá espolvoreado con azúcar'], 'amontillado': ['Amontillado', 'amontillado'], 'palo cortado': ['Palo Cortado', 'palo cortado'], '½ rodela': ['½ wheel', '½ rodaja'],
  'frutas vermelhas frescas': ['fresh berries', 'frutos rojos frescos'], 'frutas vermelhas e quartos de rodela de laranja e limão-siciliano': ['fresh berries and quarter wheels of orange and lemon', 'frutos rojos y cuartos de rodaja de naranja y limón'], '2 fatias finas': ['2 thin slices', '2 rodajas finas'],
  'uma pimenta vermelha': ['a red chili pepper', 'un ají rojo'], 'ramo de hortelã e, se quiser, rodela de laranja': ['mint sprig and, optionally, an orange slice', 'rama de hierbabuena y, si quieres, rodaja de naranja'], 'rhum agricole da Martinica': ['Martinique rhum agricole', 'rhum agricole de Martinica'],
  'três cerejas e um pedaço retangular de abacaxi': ['three cherries and a rectangular chunk of pineapple', 'tres cerezas y un trozo rectangular de piña'], 'branca e suave': ['white, smooth', 'blanca y suave'], 'xarope de mel com camomila': ['honey syrup made with chamomile', 'jarabe de miel con manzanilla'],
  'cordial': ['cordial', 'cordial'], 'casca de limão-siciliano e uvas brancas': ['lemon zest and white grapes', 'cáscara de limón y uvas blancas'], 'folha de manjericão': ['basil leaf', 'hoja de albahaca'], 'Cointreau': ['Cointreau', 'Cointreau'], 'espresso recém-tirado': ['freshly pulled espresso', 'espresso recién hecho'], 'chocolate ralado (opcional)': ['grated chocolate (optional)', 'chocolate rallado (opcional)'],
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
