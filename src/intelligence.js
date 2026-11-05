const norm=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/\s+/g,' ').trim();
export function paymentDescription(description,source='card') {
 const s=norm(description).replace(/[^A-Z0-9 ]/g,' ').replace(/\b(?:PGTO|PAGTO|PGT|PGT0)\b/g,'PAGAMENTO').replace(/\s+/g,' ');
 const pay=/\b(?:PAGAMENTO|PAG|PAGO|PAGA|PAGOU|QUITACAO|LIQUIDACAO)\b/.test(s);
 const invoice=/\b(?:FATURA|FAT|CARTAO|CARTOES)\b/.test(s);
 if(pay&&invoice)return true;
 return source==='card'&&(/\bINCLUSAO (?:DE |DO )?PAGAMENTO\b/.test(s)||/\bPAGAMENTO\s+(?:RECEBIDO|EFETUADO|CONFIRMADO)\b/.test(s)||pay&&/\bDEBITO AUTOMATICO\b/.test(s));
}
// Confirmed by the owner from real statement descriptors; no online lookup is claimed.
const confirmedMerchants=[
 {pattern:/^PC BENEDITA$/,name:'PC BENEDITA',category:'Alimentação',subcategory:'Restaurantes'},
 {pattern:/^MATE(?: DOCE)?$/,name:'MATE',category:'Alimentação',subcategory:'Restaurantes'},
 {pattern:/^(?:TRACK(?: AND| E)? FIELD|TRACKANDFIELD)(?:\s|$)/,name:'TRACK AND FIELD',category:'Compras',subcategory:'Vestuário'},
 {pattern:/^(?:BF ?SHOP|BROOKSFIELD)(?:\s|$)/,name:'BROOKSFIELD',category:'Compras',subcategory:'Vestuário'},
 {pattern:/^TENIS LOUNGE JARDINS(?:\s|$)/,name:'TENIS LOUNGE JARDINS',category:'Lazer',subcategory:'Esportes e aulas'},
 {pattern:/^(?:VIVARA(?:\s|$)|LOJA ?VIVARA(?:\s|\d|$))/,name:'VIVARA',category:'Compras',subcategory:'Joias e acessórios'},
 {pattern:/^OSKLEN(?:\s|$)/,name:'OSKLEN',category:'Compras',subcategory:'Vestuário'}
];
export function merchantKey(description){
 const key=norm(description).replace(/\b(?:PARC(?:ELA)?\.?\s*)?\d{1,2}\s*\/\s*\d{1,2}\b/g,' ')
 .replace(/^(?:(?:COMPRA|COMPRAS)\s+(?:NO\s+)?(?:DEBITO|CREDITO)\s*[-:*]?\s*)/,'')
 .replace(/^(?:(?:PAG\*?|PAGSEGURO|PICPAY|MERCADOPAGO|MERCADO PAGO|MP|SUMUP|TON|STONE|IZ|EBANX|PAYPAL)\s*[*:]\s*)/,'')
 .replace(/\b(?:LTDA|EIRELI|S\.?A\.?)\s*$/,'').replace(/[^A-Z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
 const confirmed=confirmedMerchants.find(m=>m.pattern.test(key)||m.pattern.test(key.replace(/^\d{1,4}\s+/,'')));
 return confirmed?.name||key;
}
export function confirmedMerchantSuggestion(description){
 const key=merchantKey(description),hit=confirmedMerchants.find(m=>m.name===key);
 return hit?{category:hit.category,subcategory:hit.subcategory,classificationSource:'Estabelecimento confirmado pelo usuário',classificationConfidence:'user_confirmed'}:null;
}
const catalog=[
 // Specific activity takes precedence over a checkout/delivery channel.
 [/\b(?:PETSHOP|PET SHOP|PETZ|COBASI|PETLOVE|VETERINAR|RACOES|DOGS DAY)\b/,'Pets','Cuidados e produtos'],
 [/\b(?:COMEDY|COMEDIA|STAND UP)\b/,'Lazer','Entretenimento'],
 [/\b(?:OPENAI|CHATGPT|ANTHROPIC|CLAUDE)\b|MICROSOFT\s+(?:SUBSCRIPTION|365)|OFFICE\s*365/,'Serviços','Software e serviços digitais'],
 [/\b(?:PREMIERE|PATREON)\b/,'Lazer','Assinaturas'],
 [/\b(?:LIVELO|CLUBE LIV)\b/,'Lazer','Pontos e milhas'],
 [/\b(?:IBERIA|OMIO|HOTEISCOM|HOTEIS COM|HOTELS COM|TRAVEL RESERVATION)\b/,'Lazer','Viagens'],
 [/\b(?:RAIL EUROPE|TRAINLINE)\b/,'Transporte','Trens e ônibus'],
 [/\b(?:BILHUNICO|BILHETE UNICO|EMV METRE|EMV METRO)\b/,'Transporte','Transporte público'],
 [/^ZUL(?:\s+\d+)?\s+CARTOES\b|\bZUL DIGITAL\b/,'Transporte','Estacionamento'],
 [/\b(?:KABUM|LG ELECTRONICS|PAUTA DISTRIBUICAO)\b/,'Compras','Eletrônicos'],
 [/\bSHOPPER\b/,'Alimentação','Supermercado'],
 [/\b(?:KOPENHAGEN|SORVET|SORVETERIA)\w*/,'Alimentação','Doces e lanches'],
 [/\b(?:KOZINHA|COZINHA|LANCHES|PASTEL)\b/,'Alimentação','Restaurantes'],
 [/\bSEARA ALIMENTOS\b/,'Alimentação','Alimentos e conveniência'],
 [/^CONVENIENCIAS$/,'Compras','Conveniência'],
 [/\bLOTERIASONLINE\w*/,'Lazer','Loterias e apostas'],
 [/\b99FOOD\b/,'Alimentação','Delivery'],
 [/\b(?:UBER EATS|IFOOD|RAPPI|ZÉ DELIVERY|ZE DELIVERY|AIQFOME|DELIVERY)\b/,'Alimentação','Delivery'],
 [/\b(?:CARREFOUR|ATACADAO|ASSAI|PAO DE ACUCAR|EXTRA MERCADO|SUPERMERCADOS?|SUPERMERCADO|MERCADO(?!\s+(?:LIVRE|PAGO))|ATACADISTA|ATACADO|HORTIFRUTI?|GPA|BEM BARATO|SONDA|DIA SUPERMERCADO|SAVEGNAGO|BISTEK|MUFFATO|ANGELONI|ZAFFARI|GIASSI|BOURBON|SUPER NOSSO|PREZUNIC)\b/,'Alimentação','Supermercado'],
 [/RESTAUR|LANCHON|BURGER|PIZZA|CHURRASC|SUSHI|STEAK|BOTECO|MC ?DONALD|MCDONALD|OUTBACK|SUBWAY|STARBUCKS|\bCAFE\b/,'Alimentação','Restaurantes'],
 [/PADARIA|PANIFIC|CONFEITARIA/,'Alimentação','Padaria'],
 [/\bUBER\b|\b99(?:APP|POP)?\b|\b99 POP\b|\bCABIFY\b/,'Transporte','Aplicativos'],
 [/\bPOSTO\b|COMBUST|\bSHELL\b|\bIPIRANGA\b/,'Transporte','Combustível'],
 [/ESTACION|ESTAPAR|ZONA AZUL|SEM PARAR|CONECTCAR|PEDAGIO/,'Transporte','Estacionamento'],
 [/DROGA|FARMAC|PACHECO|PAGUE MENOS|RAIA/,'Saúde','Farmácia'],
 [/CLINICA|CONSULTORIO|LABORATOR|FLEURY|DASA|DR CONSULTA/,'Saúde','Consultas'],
 [/UNIMED|AMIL|SULAMERICA SAUDE|HAPVIDA|NOTREDAME/,'Saúde','Plano de saúde'],
 [/NETFLIX|SPOTIFY|DISNEY|HBO|YOUTUBE|APPLE COM BILL|AMAZON PRIME|GLOBOPLAY|DEEZER|PARAMOUNT/,'Lazer','Assinaturas'],
 [/\bAMAZON\b|MERCADO ?LIVRE|SHOPEE|ALIEXPRESS|MAGAZINE LUIZA|MAGALU|CASAS BAHIA|PONTO FRIO|\bSHEIN\b/,'Compras','Compras online'],
 [/RENNER|\bZARA\b|RIACHUELO|\bC A\b|\bNIKE\b|ADIDAS|CENTAURO|DECATHLON|NETSHOES|MARISA/,'Compras','Vestuário'],
 [/ESCOLA|UDEMY|CURSO|FACULDADE|UNIVERSIDADE|ALURA|HOTMART/,'Educação','Cursos'],
 [/LIVRARIA|SARAIVA|LEITURA LIVROS/,'Educação','Livros'],
 [/ENEL|ENERGIA|SABESP|COPASA|CONDOMINIO|CPFL|CEMIG|LIGHT|SANEAMENTO/,'Moradia','Contas da casa'],
 [/\bVIVO\b|\bCLARO\b|\bTIM\b|INTERNET|TELEFONICA|\bOI TELECOM\b/,'Moradia','Internet'],
 [/\bALUGUEL\b|LOCACAO RESIDENCIAL/,'Moradia','Aluguel'],
 [/CINEMA|CINEMARK|CINEPOLIS|INGRESSO COM|SYMPLA|TEATRO/,'Lazer','Entretenimento'],
 [/LATAM|AZUL LINHAS|GOL LINHAS|AIRBNB|BOOKING|HOTEL|POUSADA|DECOLAR/,'Lazer','Viagens'],
 [/PETSHOP|PET SHOP|PETZ|COBASI|PETLOVE|VETERINAR/,'Pets','Cuidados e produtos'],
 [/TARIFA|ANUIDADE|\bIOF\b|\bJUROS\b/,'Serviços','Tarifas'],
 [/^IFD\s+/,'Alimentação','Delivery']
];
export function merchantSuggestion(description){
 const confirmed=confirmedMerchantSuggestion(description);if(confirmed)return confirmed;
 const s=merchantKey(description);
 // A payment facilitator alone does not reveal what was purchased.
 if(/^(?:MERCADO PAGO|MERCADOPAGO|PAGSEGURO|PICPAY|PAYPAL|SUMUP|TON|STONE|EBANX)(?:\s|$)/.test(s))return null;
 const hit=catalog.find(([re])=>re.test(s));
 return hit?{category:hit[1],subcategory:hit[2],classificationSource:'Regras de estabelecimento',classificationConfidence:'high'}:null;
}
export function repairTransactions(transactions,rules=[]){
 return transactions.map(t=>{
  if(t.classificationLocked)return t;
  if(paymentDescription(t.description,t.source))return {...t,kind:'payment',category:'Movimentações',subcategory:'Pagamento de fatura',review:false,reviewReason:undefined,classificationSource:'Identificação de pagamento de fatura'};
  if(t.kind!=='expense'||!t.review&&t.category!=='Outros')return t;
  const rule=rules.find(r=>r.kind==='expense'&&merchantKey(r.match)===merchantKey(t.description));
  const suggestion=rule?{category:rule.category,subcategory:rule.subcategory,classificationSource:'Sua classificação aprendida'}:merchantSuggestion(t.description);
  if(!suggestion)return t;
  return {...t,...suggestion,review:!!t.reviewReason};
 });
}
