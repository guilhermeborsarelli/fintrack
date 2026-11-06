// Home Tender — histórias dos drinks e o porquê de cada copo, em três idiomas.
import unforgettables from './unforgettables.js';
import contemporary from './contemporary.js';
import newera from './newera.js';
import variations from './variations.js';
import iba2024 from './iba2024.js';

const L = {pt: 0, en: 1, es: 2};
export const STORIES = {...unforgettables, ...contemporary, ...newera, ...variations, ...iba2024};
export const storyFor = (id, lang) => STORIES[id]?.[L[lang] ?? 0] || '';

// Nomes que mudam de idioma
const NAMES = {
  'gin-tonica': ['Gin Tônica', 'Gin & Tonic', 'Gin Tonic'],
  'corpse-reviver-2': ['Corpse Reviver Nº 2', 'Corpse Reviver No. 2', 'Corpse Reviver Nº 2'],
  'sbagliato-americano': ['Spritz Veneziano al Campari', 'Campari Spritz (Venetian)', 'Spritz Veneziano al Campari']
};
export const nameFor = (drink, lang) => NAMES[drink.id]?.[L[lang] ?? 0] || drink.name;

// Por que este copo — explicação geral por tipo de copo
const GLASS_WHY = {
  coupe: [
    'Drinks servidos sem gelo pedem taça com haste: a mão segura a haste e não aquece o líquido. A coupe, rasa e de boca larga, era a taça de champanhe da Era de Ouro e virou a taça clássica dos coquetéis batidos, porque exibe a espuma e abre os aromas.',
    'Drinks served without ice call for a stemmed glass: your hand holds the stem and doesn’t warm the liquid. The coupe, shallow and wide, was the Champagne glass of the Golden Age and became the classic glass for shaken cocktails, showing off foam and opening the aromas.',
    'Los tragos sin hielo piden copa con tallo: la mano sostiene el tallo y no calienta el líquido. La coupé, baja y de boca ancha, era la copa de champán de la Edad de Oro y se convirtió en la copa clásica de los cócteles agitados, porque luce la espuma y abre los aromas.'
  ],
  martini: [
    'A taça em V surgiu nos anos 1920 como releitura art déco da coupe e virou o símbolo do Martini. A haste longa mantém o drink gelado; a boca larga libera o aroma do destilado, e o formato cônico sustenta guarnições como azeitona ou cereja.',
    'The V-shaped glass appeared in the 1920s as an Art Deco take on the coupe and became the Martini’s symbol. The long stem keeps the drink cold; the wide mouth releases the spirit’s aroma, and the cone holds garnishes such as an olive or cherry.',
    'La copa en V surgió en los años 20 como reinterpretación art déco de la coupé y se volvió el símbolo del Martini. El tallo largo mantiene el trago frío; la boca ancha libera el aroma del destilado, y la forma cónica sostiene decoraciones como la aceituna o la cereza.'
  ],
  rocks: [
    'Copo baixo e de fundo grosso, pensado para drinks fortes servidos sobre gelo ou montados no próprio copo: aguenta o socador, conserva a temperatura e deixa espaço para uma pedra grande de gelo, que derrete devagar. O nome "old fashioned" vem do próprio drink Old Fashioned.',
    'A short, heavy-bottomed glass for strong drinks served over ice or built in the glass: it withstands the muddler, holds the temperature and leaves room for a large ice cube that melts slowly. The name "old fashioned" comes from the Old Fashioned drink itself.',
    'Vaso bajo y de fondo grueso, pensado para tragos fuertes servidos sobre hielo o montados en el propio vaso: aguanta el mortero, conserva la temperatura y deja espacio para un hielo grande que se derrite despacio. El nombre "old fashioned" viene del propio trago Old Fashioned.'
  ],
  highball: [
    'Para destilado com refrigerante, água com gás ou suco sobre bastante gelo. O copo alto e reto conserva o gás, acomoda o gelo e mantém o drink gelado do primeiro ao último gole.',
    'For a spirit with soda, sparkling water or juice over plenty of ice. The tall, straight glass keeps the fizz, fits the ice and keeps the drink cold from first sip to last.',
    'Para destilado con refresco, agua con gas o jugo sobre mucho hielo. El vaso alto y recto conserva el gas, acomoda el hielo y mantiene el trago frío del primer al último sorbo.'
  ],
  collins: [
    'Mais alto e estreito que o highball, guarda melhor as bolhas dos drinks longos e gaseificados. Leva o nome do Collins, o drink que o tornou indispensável nos bares do século XIX.',
    'Taller and narrower than the highball, it holds the bubbles of long, sparkling drinks better. It takes its name from the Collins, the drink that made it essential in 19th-century bars.',
    'Más alto y estrecho que el highball, conserva mejor las burbujas de los tragos largos y gasificados. Lleva el nombre del Collins, el trago que lo volvió imprescindible en los bares del siglo XIX.'
  ],
  flute: [
    'Taça alta e estreita: reduz a superfície do líquido em contato com o ar e conserva o perlage do espumante por muito mais tempo. A haste evita que a mão aqueça a bebida.',
    'Tall and narrow: it reduces the surface exposed to air and keeps the sparkling wine’s bubbles going much longer. The stem keeps your hand from warming the drink.',
    'Alta y estrecha: reduce la superficie del líquido en contacto con el aire y conserva la burbuja del espumante mucho más tiempo. El tallo evita que la mano caliente la bebida.'
  ],
  wine: [
    'A taça bojuda tem espaço para gelo, vinho e soda, e concentra os aromas dos vinhos e aperitivos amargos, como no ritual do aperitivo italiano.',
    'The rounded glass has room for ice, wine and soda, and concentrates the aromas of wines and bitter aperitifs, as in the Italian aperitivo ritual.',
    'La copa redondeada tiene espacio para hielo, vino y soda, y concentra los aromas de los vinos y los aperitivos amargos, como en el ritual del aperitivo italiano.'
  ],
  mug: [
    'A caneca de cobre nasceu com o Moscow Mule, em 1941, como parte da estratégia de marketing do drink. O metal conduz o frio, gela a caneca inteira e mantém o drink gelado por mais tempo; virou a identidade de toda a família dos mules.',
    'The copper mug was born with the Moscow Mule in 1941 as part of the drink’s marketing strategy. The metal conducts cold, chills the whole mug and keeps the drink cold longer; it became the identity of the whole mule family.',
    'La taza de cobre nació con el Moscow Mule en 1941 como parte de la estrategia de marketing del trago. El metal conduce el frío, enfría toda la taza y mantiene el trago frío por más tiempo; se convirtió en la identidad de toda la familia de los mules.'
  ],
  tiki: [
    'As canecas de cerâmica esculpidas, com rostos inspirados nos tikis polinésios, nasceram nos bares de Donn Beach e Trader Vic nos anos 1930 a 1950. Fazem parte do teatro da coquetelaria tiki e escondem drinks de muitas camadas sob gelo picado.',
    'Carved ceramic mugs with faces inspired by Polynesian tikis were born in the bars of Donn Beach and Trader Vic between the 1930s and 1950s. They are part of tiki theatre and hide multilayered drinks under crushed ice.',
    'Las tazas de cerámica talladas, con rostros inspirados en los tikis polinesios, nacieron en los bares de Donn Beach y Trader Vic entre los años 30 y 50. Son parte del teatro de la coctelería tiki y esconden tragos de muchas capas bajo hielo picado.'
  ],
  irish: [
    'Vidro temperado que aguenta o calor, alça para não queimar a mão e pé que mostra as camadas: o drink escuro embaixo e o creme claro por cima.',
    'Tempered glass that withstands heat, a handle so you don’t burn your hand and a stem that shows off the layers: dark drink below, pale cream on top.',
    'Vidrio templado que soporta el calor, asa para no quemarse la mano y pie que luce las capas: el trago oscuro abajo y la crema clara arriba.'
  ],
  julep: [
    'O copo de metal, tradicionalmente de prata, é o símbolo do Mint Julep no sul dos EUA. Com gelo picado, o metal congela e forma uma camada de geada por fora, mantendo o drink gelado no calor. Segure-o pela base ou pela borda para não derreter a geada.',
    'The metal cup, traditionally silver, is the symbol of the Mint Julep in the American South. With crushed ice the metal frosts over on the outside, keeping the drink cold in the heat. Hold it by the base or rim so you don’t melt the frost.',
    'El vaso metálico, tradicionalmente de plata, es el símbolo del Mint Julep en el sur de EE. UU. Con hielo picado, el metal se escarcha por fuera y mantiene el trago frío con el calor. Sostenlo por la base o el borde para no derretir la escarcha.'
  ],
  hurricane: [
    'A taça em forma de lampião de furacão ficou famosa nos anos 1940 no bar Pat O’Brien’s, em Nova Orleans, com o drink Hurricane. É grande para comportar sucos, gelo e drinks batidos, e virou o copo dos drinks tropicais.',
    'The glass shaped like a hurricane lamp became famous in the 1940s at Pat O’Brien’s bar in New Orleans with the Hurricane cocktail. It is large enough for juices, ice and blended drinks, and became the glass of tropical drinks.',
    'La copa con forma de farol de huracán se hizo famosa en los años 40 en el bar Pat O’Brien’s de Nueva Orleans con el trago Hurricane. Es grande para jugos, hielo y tragos frozen, y se volvió la copa de los tragos tropicales.'
  ]
};

// Casos com explicação própria
const DRINK_GLASS_WHY = {
  'sherry-cobbler': [
    'A IBA manda servir em copo julep com gelo picado: o metal gela e conserva o frio, e o gelo picado, novidade dos anos 1830, é parte da identidade do drink, assim como o canudo, que se popularizou junto com o Cobbler.',
    'The IBA calls for a julep cup with crushed ice: the metal chills and holds the cold, and crushed ice, a novelty in the 1830s, is part of the drink’s identity, as is the straw, which became popular along with the Cobbler.',
    'La IBA indica servirlo en vaso julep con hielo picado: el metal enfría y conserva el frío, y el hielo picado, novedad de los años 1830, es parte de la identidad del trago, igual que la pajita, que se popularizó junto con el Cobbler.'
  ],
  'rabo-de-galo': [
    'Como nos botecos, vai num copo baixo com gelo: montado e mexido no próprio copo, sem cerimônia, com uma torção de laranja para perfumar.',
    'As in Brazilian bars, it goes in a short rocks glass with ice: built and stirred in the glass, no fuss, with an orange twist for aroma.',
    'Como en los botecos, va en un vaso bajo con hielo: montado y mezclado en el propio vaso, sin ceremonias, con un twist de naranja para perfumar.'
  ],
  'dry-martini': [
    'A taça em V é o próprio símbolo do Martini. A haste longa mantém o drink gelado, já que ele é servido sem gelo; a boca larga deixa o aroma do gin e do vermute chegar ao nariz, e o cone segura a azeitona no espeto.',
    'The V-shaped glass is the very symbol of the Martini. The long stem keeps the drink cold, since it is served without ice; the wide mouth lets the aroma of gin and vermouth reach your nose, and the cone holds the olive on its pick.',
    'La copa en V es el propio símbolo del Martini. El tallo largo mantiene el trago frío, ya que se sirve sin hielo; la boca ancha deja que el aroma de la ginebra y el vermut llegue a la nariz, y el cono sostiene la aceituna en su palillo.'
  ],
  'old-fashioned': [
    'Este é o drink que deu nome ao copo. O fundo grosso aguenta o socador que dissolve o açúcar com os bitters, e a boca larga acomoda uma pedra grande de gelo, que derrete devagar e dilui o whiskey sem pressa.',
    'This is the drink that named the glass. The heavy base withstands the muddler that dissolves the sugar with the bitters, and the wide mouth fits a large ice cube that melts slowly and dilutes the whiskey without hurry.',
    'Este es el trago que dio nombre al vaso. El fondo grueso aguanta el mortero que disuelve el azúcar con el amargo, y la boca ancha acomoda un hielo grande, que se derrite despacio y diluye el whiskey sin prisa.'
  ],
  'john-collins': [
    'O copo collins leva o nome deste drink. Alto e estreito, guarda as bolhas da água com gás e o gelo abundante deixa o drink refrescante até o fim.',
    'The collins glass is named after this drink. Tall and narrow, it holds the soda’s bubbles, and plenty of ice keeps the drink refreshing to the end.',
    'El vaso collins lleva el nombre de este trago. Alto y estrecho, conserva las burbujas de la soda y el hielo abundante lo mantiene refrescante hasta el final.'
  ],
  'moscow-mule': [
    'A caneca de cobre fez parte da criação do drink em 1941: era o toque de marketing que tornava o Moscow Mule reconhecível em qualquer bar. O cobre gela rápido e conserva o frio do ginger beer.',
    'The copper mug was part of the drink’s creation in 1941: the marketing touch that made the Moscow Mule recognisable in any bar. Copper chills fast and keeps the ginger beer cold.',
    'La taza de cobre formó parte de la creación del trago en 1941: el toque de marketing que hacía reconocible el Moscow Mule en cualquier bar. El cobre se enfría rápido y conserva el frío de la ginger beer.'
  ],
  'mint-julep': [
    'O copo de prata ou estanho é tradição do Kentucky Derby. Com gelo picado, ele congela por fora e forma uma geada branca; o frio intenso equilibra a força do bourbon. Segure-o pela base.',
    'The silver or pewter cup is a Kentucky Derby tradition. With crushed ice it frosts white on the outside; the intense cold balances the strength of the bourbon. Hold it by the base.',
    'El vaso de plata o peltre es tradición del Kentucky Derby. Con hielo picado se escarcha de blanco por fuera; el frío intenso equilibra la fuerza del bourbon. Sostenlo por la base.'
  ],
  'irish-coffee': [
    'O copo com pé e alça foi popularizado pelo Buena Vista Café, em São Francisco, nos anos 1950. O vidro temperado aguenta o café quente, e a transparência mostra o contraste do café escuro com a faixa de creme por cima.',
    'The stemmed, handled glass was popularised by the Buena Vista Café in San Francisco in the 1950s. Tempered glass withstands hot coffee, and its transparency shows the contrast of dark coffee under the band of cream.',
    'La copa con pie y asa fue popularizada por el Buena Vista Café de San Francisco en los años 50. El vidrio templado aguanta el café caliente, y su transparencia muestra el contraste del café oscuro con la franja de crema encima.'
  ],
  zombie: [
    'Na tradição tiki, o Zombie é servido em caneca de cerâmica esculpida ou copo alto, com bastante gelo picado. A caneca faz parte da teatralidade dos bares de Donn Beach, onde a decoração era tão importante quanto o drink.',
    'In tiki tradition the Zombie is served in a carved ceramic mug or tall glass with plenty of crushed ice. The mug is part of the theatre of Donn Beach’s bars, where décor mattered as much as the drink.',
    'En la tradición tiki, el Zombie se sirve en taza de cerámica tallada o vaso alto, con mucho hielo picado. La taza es parte de la teatralidad de los bares de Donn Beach, donde la decoración importaba tanto como el trago.'
  ],
  'mai-tai': [
    'Trader Vic servia o Mai Tai num copo old fashioned duplo, cheio de gelo picado, com a casca do limão espremido e um ramo de hortelã imitando uma pequena ilha com palmeira. O copo baixo concentra o aroma da hortelã a cada gole.',
    'Trader Vic served the Mai Tai in a double old fashioned glass full of crushed ice, with the spent lime shell and a mint sprig mimicking a small island with a palm tree. The short glass brings the mint aroma to every sip.',
    'Trader Vic servía el Mai Tai en un vaso old fashioned doble lleno de hielo picado, con la cáscara de la lima exprimida y una rama de hierbabuena imitando una isla con palmera. El vaso bajo acerca el aroma de la hierbabuena a cada sorbo.'
  ],
  'pina-colada': [
    'Drink batido no liquidificador, cremoso e volumoso, pede uma taça grande e curvilínea como a hurricane, que também traz o clima tropical e espaço para a fatia de abacaxi e a cereja.',
    'A blended, creamy, generous drink needs a large curvy glass like the hurricane, which also brings a tropical mood and room for the pineapple slice and cherry.',
    'Un trago licuado, cremoso y abundante pide una copa grande y curvilínea como la hurricane, que además trae el clima tropical y espacio para la rodaja de piña y la cereza.'
  ],
  margarita: [
    'A Margarita é servida sem gelo em taça larga, que dá espaço para a borda de sal: cada gole passa pelo sal, que realça o limão e suaviza a tequila. A taça própria de margarita, de bojo duplo, é uma versão da coupe.',
    'The Margarita is served straight up in a wide glass that leaves room for the salt rim: every sip passes over the salt, which lifts the lime and softens the tequila. The stepped margarita glass is a variation of the coupe.',
    'La Margarita se sirve sin hielo en copa ancha, que da espacio al borde de sal: cada sorbo pasa por la sal, que realza la lima y suaviza el tequila. La copa margarita, de doble cuenco, es una variación de la coupé.'
  ],
  spritz: [
    'Em Veneza, o Spritz é servido em taça de vinho cheia de gelo: o bojo largo acomoda o gelo e a soda e concentra o aroma cítrico e amargo do aperitivo.',
    'In Venice the Spritz is served in a wine glass full of ice: the wide bowl fits the ice and soda and concentrates the citrusy, bitter aroma of the aperitivo.',
    'En Venecia el Spritz se sirve en copa de vino llena de hielo: el cuenco amplio acomoda el hielo y la soda y concentra el aroma cítrico y amargo del aperitivo.'
  ],
  caipirinha: [
    'A caipirinha é macerada no próprio copo: o copo baixo e firme aguenta o socador, e a boca larga deixa espaço para o limão, o gelo e a colher. É servida no mesmo copo em que foi feita.',
    'The caipirinha is muddled in its own glass: the short, sturdy glass withstands the muddler, and the wide mouth leaves room for the lime, the ice and the spoon. It is served in the glass it was made in.',
    'La caipiriña se macera en el propio vaso: el vaso bajo y firme aguanta el mortero, y la boca ancha deja espacio para la lima, el hielo y la cuchara. Se sirve en el mismo vaso en que se preparó.'
  ]
};

export function glassWhyFor(drink, lang) {
  const i = L[lang] ?? 0;
  return (DRINK_GLASS_WHY[drink.id] || GLASS_WHY[drink.glass])?.[i] || '';
}
