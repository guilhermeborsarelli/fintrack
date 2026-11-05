import {merchantKey} from './intelligence.js';
export const MCC={5411:['Alimentação','Supermercado'],5812:['Alimentação','Restaurantes'],5814:['Alimentação','Restaurantes'],5912:['Saúde','Farmácia'],5541:['Transporte','Combustível'],5542:['Transporte','Combustível'],4121:['Transporte','Aplicativos'],4111:['Transporte','Transporte público'],4814:['Moradia','Internet'],4900:['Moradia','Contas da casa'],5651:['Compras','Vestuário'],5661:['Compras','Vestuário'],5732:['Compras','Eletrônicos'],5942:['Educação','Livros'],5995:['Pets','Cuidados e produtos'],7011:['Lazer','Viagens'],4511:['Lazer','Viagens'],8299:['Educação','Cursos']};
export function fromMcc(mcc){const hit=MCC[String(mcc)];return hit?{category:hit[0],subcategory:hit[1],classificationSource:`Categoria bancária MCC ${mcc}`,classificationConfidence:'bank_code'}:null;}
export function reviewGroups(rows){
 const groups=new Map();
 for(const row of rows.filter(t=>t.review&&!t.projected)){
  const merchant=merchantKey(row.description)||row.description;const key=merchant+'|'+(row.reviewReason||'category');
  if(!groups.has(key))groups.set(key,{key,merchant,reason:row.reviewReason||'Estabelecimento ainda não identificado',rows:[]});groups.get(key).rows.push(row);
 }
 return [...groups.values()].sort((a,b)=>b.rows.length-a.rows.length);
}
export function reviewMetrics(rows){const actual=rows.filter(t=>!t.projected);const pending=actual.filter(t=>t.review).length;return {total:actual.length,pending,rate:actual.length?pending/actual.length*100:0,groups:reviewGroups(actual).length};}
