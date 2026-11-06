import {merchantKey} from './intelligence.js';
const clean=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
export function researchName(description){
 if(/@|(?:\d[\s./-]*){8,}/.test(description))return null;
 const name=merchantKey(description);
 if(!name||name.length<4||name.length>80||/\d|@|PIX|TRANSFER|PAGAMENTO|SALARIO|BOLETO|CPF|CNPJ|\b(?:TED|DOC)\b/.test(name))return null;
 if(/^(?:MERCADO PAGO|MERCADOPAGO|PAGSEGURO|PICPAY|PAYPAL|SUMUP|STONE|TON|EBANX)$/.test(name))return null;
 return name;
}
const types=[
 [/supermercad|hipermercad|atacadista de alimentos/i,'Alimentação','Supermercado'],
 [/restaurante|lanchonete|cafeteria|rede de fast.food/i,'Alimentação','Restaurantes'],
 [/farmacia|drogaria|farmaceutic/i,'Saúde','Farmácia'],
 [/vestuario|roupas|calcados|artigos esportivos|confecc|loja de moda/i,'Compras','Vestuário'],
 [/comercio eletronico|e.commerce|loja virtual|marketplace/i,'Compras','Compras online'],
 [/cinema|rede de cinemas/i,'Lazer','Entretenimento'],
 [/companhia aerea|companhia de aviacao|rede hoteleira|hoteis/i,'Lazer','Viagens'],
 [/telecomunicac|telefonia|provedor de internet/i,'Moradia','Internet'],
 [/aulas de tenis|escola de tenis|academia de ginastica|centro esportivo/i,'Lazer','Esportes e aulas'],
 [/eletronicos|informatica|equipamentos de informatica/i,'Compras','Eletrônicos'],
 [/livraria/i,'Educação','Livros'],[/pet shop|produtos para animais/i,'Pets','Cuidados e produtos']
];
export function evidenceCategory(text){return types.find(([re])=>re.test(clean(text)));}
export async function researchMerchant(name,fetcher=fetch){
 if(researchName(name)!==name)throw new Error('Nome não elegível para consulta.');
 const url=new URL('https://pt.wikipedia.org/w/api.php');
 Object.entries({action:'query',format:'json',origin:'*',generator:'search',gsrsearch:`"${name}"`,gsrlimit:'3',prop:'extracts',exintro:'1',explaintext:'1',exsentences:'3',redirects:'1'}).forEach(([k,v])=>url.searchParams.set(k,v));
 const response=await fetcher(url,{signal:AbortSignal.timeout(12000),credentials:'omit',referrerPolicy:'no-referrer'});
 if(!response.ok)throw new Error('Consulta indisponível. Tente mais tarde.');
 const data=await response.json();
 for(const page of Object.values(data.query?.pages||{})){
  const title=merchantKey(page.title.replace(/\([^)]*\)/g,''));
  // Exact organization name plus business context; never infer a shop from a city/person result.
  if(title!==name||!/(empresa|rede|companhia|marca|loja|grupo|plataforma|cooperativa)/i.test(page.extract||''))continue;
  if(/(?:meios de pagamento|pagamentos digitais|instituicao financeira|banco digital)/i.test(clean(page.extract||'')))continue;
  const hit=evidenceCategory(page.extract||'');
  if(hit)return {category:hit[1],subcategory:hit[2],classificationSource:'Pesquisa pública · Wikipédia',classificationConfidence:'supported',evidenceTitle:page.title,evidenceUrl:`https://pt.wikipedia.org/?curid=${Number(page.pageid)}`,evidenceText:page.extract.slice(0,500)};
 }
 return null;
}
