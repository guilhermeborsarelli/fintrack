import {fromMcc} from './review.js';
import {paymentDescription,merchantKey,merchantSuggestion,confirmedMerchantSuggestion} from './intelligence.js';
import {emptyFinance,validateFinance} from './finance-schema.js';
export const CATEGORIES = {
  'Alimentação': ['Supermercado', 'Restaurantes', 'Delivery', 'Padaria', 'Doces e lanches', 'Alimentos e conveniência'],
  'Moradia': ['Aluguel', 'Contas da casa', 'Internet', 'Casa e decoração'],
  'Transporte': ['Aplicativos', 'Combustível', 'Estacionamento', 'Transporte público', 'Trens e ônibus'],
  'Saúde': ['Farmácia', 'Consultas', 'Plano de saúde'],
  'Compras': ['Conveniência', 'Joias e acessórios', 'Vestuário', 'Eletrônicos', 'Compras online', 'Outros'],
  'Lazer': ['Esportes e aulas', 'Pontos e milhas', 'Loterias e apostas', 'Assinaturas', 'Viagens', 'Entretenimento'],
  'Educação': ['Cursos', 'Livros'], 'Serviços': ['Serviços gerais', 'Tarifas', 'Software e serviços digitais'],
  'Pets':['Cuidados e produtos'], 'Outros': ['A classificar'], 'Movimentações': ['Pagamento de fatura', 'Transferência', 'Receita', 'Estorno']
};
export const normalize = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/\s+/g, ' ').trim();
export const money = cents => new Intl.NumberFormat('pt-BR', {style:'currency',currency:'BRL'}).format(cents/100);
export function parseMoney(s) { return Math.round(Number(s.replace(/R\$/g,'').replace(/\s/g,'').replace(/\./g,'').replace(',','.'))*100); }
export function shiftMonth(month, delta) { const [y,m] = month.split('-').map(Number); const d = new Date(Date.UTC(y,m-1+delta,1)); return d.toISOString().slice(0,7); }
export function monthLabel(month) { return new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${month}-01T12:00:00Z`)); }
export const isPayment=paymentDescription;
export function classify(description,rules=[],source='card',mcc) {
 const s=normalize(description);
 if(isPayment(s,source))return {kind:'payment',category:'Movimentações',subcategory:'Pagamento de fatura',review:false,classificationSource:'Identificação de pagamento de fatura'};
 const rule=rules.find(r=>normalize(r.match)===s||(r.kind==='expense'&&merchantKey(r.match)&&merchantKey(r.match)===merchantKey(s)));
 if(rule)return {kind:rule.kind,category:rule.category,subcategory:rule.subcategory,review:false,classificationSource:rule.classificationSource||'Sua classificação aprendida',evidenceUrl:rule.evidenceUrl,evidenceTitle:rule.evidenceTitle};
 if(/TRANSFERENCIA ENTRE (?:MINHAS )?CONTAS|APLICACAO|RESGATE|INVESTIMENTO/.test(s))return {kind:'transfer',category:'Movimentações',subcategory:'Transferência',review:false};
 const hit=confirmedMerchantSuggestion(s)||fromMcc(mcc)||merchantSuggestion(s);
 return hit?{kind:'expense',...hit,review:false}:{kind:'expense',category:'Outros',subcategory:'A classificar',review:true};
}
export function family(t) { return `${t.bank||'C6'}|${t.account||'Principal'}|${normalize(t.description)}|${t.date}|${t.total||1}|${shiftMonth(t.month,-((t.installment||1)-1))}`; }
const rawIdentity=t=>`${t.source}|${t.month}|${t.date}|${normalize(t.description)}|${t.amount}|${t.installment||1}|${t.total||1}`;
export function identity(t) { return `${t.bank||'C6'}|${t.account||'Principal'}|${t.importKey||rawIdentity(t)}`; }
export function mergeTransactions(existing, incoming) {
  const counts=new Map(); const have=new Map();
  existing.forEach(t=>have.set(identity(t),(have.get(identity(t))||0)+1));
  const added=[];
  incoming.forEach(t=>{const key=identity(t), n=(counts.get(key)||0)+1; counts.set(key,n); if(n>(have.get(key)||0)) added.push(t);});
  return {transactions:[...existing,...added], added:added.length, duplicates:incoming.length-added.length};
}
export function installmentValue(total,parts,index){const base=Math.floor(total/parts),extra=total%parts;return base+(index<=extra?1:0);}
export function parseStatement(text, {installmentBasis='monthly',month,source='card',rules=[],bank='C6',account='Principal',signMode='legacy'}) {
  if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw new Error('Informe o mês da fatura.');
  const rows=[],unparsed=[];
  const monthNames={JAN:'01',FEV:'02',MAR:'03',ABR:'04',MAI:'05',JUN:'06',JUL:'07',AGO:'08',SET:'09',OUT:'10',NOV:'11',DEZ:'12'};
  const lines=text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean).map(line=>line.replace(/^(\d{4})-(\d{2})-(\d{2})\s+/,'$3/$2/$1 ').replace(/^(\d{1,2})\s+([A-Za-zÇç]{3})\.?\s+(?:(\d{4})\s+)?/,(all,d,m,y)=>monthNames[normalize(m)]?`${d.padStart(2,'0')}/${monthNames[normalize(m)]}${y?'/'+y:''} `:all));
  const dateStart=/^(\d{1,2})[/.](\d{1,2})(?:[/.](\d{4}|\d{2}))?\s+(.+)$/;
  for(let index=0;index<lines.length;index++) {
    let line=lines[index];
    let dateMatch=line.match(dateStart);
    if(!dateMatch) continue;
    if(!/\d,\d{2}/.test(line)&&lines[index+1]&&!dateStart.test(lines[index+1])&&!/^(TOTAL|SALDO|LIMITE|VENCIMENTO|FATURA)\b/.test(normalize(lines[index+1]))&&/\d,\d{2}/.test(lines[index+1])){line+=' '+lines[++index];dateMatch=line.match(dateStart);}
    let [,dd,mm,yy,body]=dateMatch;dd=dd.padStart(2,'0');mm=mm.padStart(2,'0');
    const amounts=[...body.matchAll(/(?:R\$\s*)?([+-]?\s*\(?\d[\d.]*,\d{2}\)?)\s*([DC-])?(?=\s|$)/gi)];
    // In account statements, a second trailing amount is often a balance; never silently treat it as the transaction.
    const amountMatch=source==='account'?amounts[0]:amounts.at(-1);
    if(!amountMatch){unparsed.push(line);continue;}
    let desc=body.slice(0,amountMatch.index).trim();
    if(!desc||/^(?:SALDO|TOTAL|LIMITE|VENCIMENTO|VALOR TOTAL)\b/.test(normalize(desc))) continue;
    const raw=amountMatch[1],marker=amountMatch[2]?.toUpperCase();
    let amount=parseMoney(raw.replace(/[()+]/g,''));if(raw.includes('('))amount=-Math.abs(amount);
    if(!Number.isSafeInteger(amount)||amount===0){unparsed.push(line);continue;}
    if(marker==='-')amount=-Math.abs(amount);
    const year=yy?Number(yy.length===2?'20'+yy:yy):Number(month.slice(0,4))-(Number(mm)>Number(month.slice(5))?1:0);
    const date=`${year}-${mm}-${dd}`,parsedDate=new Date(`${date}T12:00:00Z`);
    if(isNaN(parsedDate)||parsedDate.toISOString().slice(0,10)!==date){unparsed.push(line);continue;}
    const part=desc.match(/(?:PARC(?:ELA)?\.?\s*)?(\d{1,2})\s*(?:\/| DE )\s*(\d{1,2})(?!\d)/i);
    let installment=1,total=1;
    if(source==='card'&&part&&+part[1]>=1&&+part[1]<=+part[2]){installment=+part[1];total=+part[2];desc=(desc.slice(0,part.index)+desc.slice(part.index+part[0].length)).replace(/\s+/g,' ').trim();}
    let label=classify(desc,rules,source);
    const credit=marker==='C'||marker!=='D'&&(source==='account'&&signMode==='signed'?amount>0:amount<0);
    if(credit&&!['payment','transfer'].includes(label.kind))label={kind:source==='account'?'income':'refund',category:'Movimentações',subcategory:source==='account'?'Receita':'Estorno',review:false};
    if(source==='account'&&/PIX|TED|DOC\b/.test(normalize(desc))&&label.kind==='expense')label={...label,review:true,reviewReason:'PIX ou transferência: confirme se é gasto ou movimentação entre suas contas.'};
    if(amounts.length>1)label={...label,review:true,reviewReason:'Mais de um valor na linha: confira lançamento e saldo.'};
    const purchaseTotal=total>1&&installmentBasis==='total'?Math.abs(amount):undefined;
    rows.push({purchaseTotal,installmentBasis:purchaseTotal!==undefined?'total':'monthly',id:crypto.randomUUID(),date,month:source==='card'?month:date.slice(0,7),description:desc,amount:purchaseTotal!==undefined?installmentValue(purchaseTotal,total,installment):Math.abs(amount),installment,total,source,bank,account,...label});
  }
  for(const row of rows)row.importKey=rawIdentity(row);
  return {rows,unparsed};
}
export function forMonth(transactions,month) {
  const actual=transactions.filter(t=>t.month===month);
  const series=new Map();
  for(const t of transactions) {
    if(t.source!=='card'||t.kind!=='expense'||t.total<=1||t.month>=month) continue;
    const key=family(t);const entry=series.get(key);
    if(!entry||entry.month<t.month) series.set(key,{month:t.month,rows:[t]});
    else if(entry.month===t.month) entry.rows.push(t);
  }
  const actualCounts=new Map();
  actual.filter(t=>t.source==='card').forEach(t=>actualCounts.set(family(t),(actualCounts.get(family(t))||0)+1));
  const projections=[];
  for(const [key,entry] of series) {
    const diff=(Number(month.slice(0,4))-Number(entry.month.slice(0,4)))*12+Number(month.slice(5))-Number(entry.month.slice(5));
    const candidates=entry.rows.filter(t=>t.installment+diff<=t.total);
    for(const t of candidates.slice(actualCounts.get(key)||0)) projections.push({...t,id:`forecast-${t.id}-${month}`,month,amount:t.purchaseTotal!==undefined?installmentValue(t.purchaseTotal,t.total,t.installment+diff):t.amount,installment:t.installment+diff,projected:true,originMonth:t.month});
  }
  return [...actual,...projections];
}
export function summary(rows) {
  const expenses=rows.filter(t=>t.kind==='expense');
  const gross=expenses.reduce((s,t)=>s+t.amount,0);
  const refunds=rows.filter(t=>t.kind==='refund').reduce((s,t)=>s+t.amount,0);
  const groups=Object.entries(expenses.reduce((a,t)=>(a[t.category]=(a[t.category]||0)+t.amount,a),Object.create(null))).sort((a,b)=>b[1]-a[1]);
  return {gross,refunds,total:gross-refunds,groups,forecast:expenses.filter(t=>t.projected).reduce((s,t)=>s+t.amount,0),income:rows.filter(t=>t.kind==='income').reduce((s,t)=>s+t.amount,0)};
}
export function validateBackup(data) {
  if(data?.version!==1||!Array.isArray(data.transactions)||!Array.isArray(data.rules)||data.transactions.length>100000) throw new Error('Backup inválido ou incompatível.');
  for(const t of data.transactions) {
    if(typeof t.id!=='string'||typeof t.description!=='string'||t.description.length>2000||!/^\d{4}-\d{2}-\d{2}$/.test(t.date)||!/^\d{4}-(0[1-9]|1[0-2])$/.test(t.month)||!Number.isSafeInteger(t.amount)||t.amount<0||!['expense','payment','transfer','income','refund'].includes(t.kind)||!['card','account'].includes(t.source)||!Number.isInteger(t.installment)||!Number.isInteger(t.total)||t.installment<1||t.total<t.installment||t.total>99||typeof t.category!=='string'||typeof t.subcategory!=='string') throw new Error('O backup contém lançamentos inválidos.');
  }
  for(const r of data.rules) if(typeof r.match!=='string'||typeof r.category!=='string'||typeof r.subcategory!=='string'||!['expense','payment','transfer','income','refund'].includes(r.kind)) throw new Error('Regras inválidas no backup.');
  for(const t of data.transactions)if(t.purchaseTotal!==undefined&&(!Number.isSafeInteger(t.purchaseTotal)||t.purchaseTotal<0))throw new Error('Valor total de parcela inválido.');
  if(data.finance!==undefined)validateFinance(data.finance);
  else data.finance=emptyFinance();
  for(const t of data.transactions)if((t.bank!==undefined&&typeof t.bank!=='string')||(t.account!==undefined&&typeof t.account!=='string')||(t.importKey!==undefined&&typeof t.importKey!=='string'))throw new Error('Identificação bancária inválida.');
  return data;
}
