import {parseStatement,classify,parseMoney,normalize} from './core.js';
export const BANKS=['C6','Nubank','Itaú','Banco do Brasil','Bradesco','Santander','Caixa','Inter','BTG Pactual','Sicoob','Sicredi','Mercado Pago','PicPay','PagBank','Neon','Outro banco'];
export function detectBank(text){const s=normalize(text.slice(0,12000));const matches=[['C6',/\bC6\b/],['Nubank',/NUBANK|NU PAGAMENTOS/],['Itaú',/ITAU/],['Banco do Brasil',/BANCO DO BRASIL/],['Bradesco',/BRADESCO/],['Santander',/SANTANDER/],['Caixa',/CAIXA ECONOMICA/],['Inter',/BANCO INTER/],['BTG Pactual',/BTG PACTUAL/],['Sicoob',/SICOOB/],['Sicredi',/SICREDI/],['Mercado Pago',/MERCADO PAGO/],['PicPay',/PICPAY/],['PagBank',/PAGBANK|PAGSEGURO/],['Neon',/BANCO NEON|NEON PAGAMENTOS/]];return matches.find(([,re])=>re.test(s))?.[0]||null;}
function splitCsv(text){
  const first=text.replace(/^\uFEFF/,'').split(/\r?\n/)[0];const delimiter=(first.match(/;/g)||[]).length>(first.match(/,/g)||[]).length?';':',';
  const rows=[];let row=[],cell='',quoted=false;
  const s=text.replace(/^\uFEFF/,'');
  for(let i=0;i<s.length;i++){const c=s[i];if(c==='"'){if(quoted&&s[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(c===delimiter&&!quoted){row.push(cell.trim());cell='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&s[i+1]==='\n')i++;row.push(cell.trim());if(row.some(Boolean))rows.push(row);row=[];cell='';}else cell+=c;}
  if(quoted)throw new Error('CSV com aspas não fechadas.');row.push(cell.trim());if(row.some(Boolean))rows.push(row);return rows;
}
export function decodeBankText(bytes){try{return new TextDecoder('utf-8',{fatal:true}).decode(bytes);}catch{return new TextDecoder('windows-1252').decode(bytes);}}
function decimal(s){
 s=s.replace(/R\$|\s/g,'');const par=/^\(.*\)$/.test(s);s=s.replace(/[()]/g,'');
 if(!/^[+-]?\d[\d.,]*$/.test(s))throw new Error('Valor inválido.');
 if(s.includes(',')&&s.includes('.'))s=s.lastIndexOf(',')>s.lastIndexOf('.')?s.replace(/\./g,'').replace(',','.'):s.replace(/,/g,'');
 else if(s.includes(','))s=s.replace(',','.');
 else if(/^[+-]?\d{1,3}(?:\.\d{3})+$/.test(s))s=s.replace(/\./g,'');
 const n=Math.round(Number(s)*100);return par?-Math.abs(n):n;
}
function validDate(s,month){s=s.trim().split(/[T ]/)[0];if(/^\d{4}-\d{2}-\d{2}$/.test(s))return s;const m=s.match(/^(\d{1,2})[/.](\d{1,2})(?:[/.](\d{2,4}))?$/);if(!m)return null;return `${m[3]?(m[3].length===2?'20'+m[3]:m[3]):String(+month.slice(0,4)-(+m[2]>+month.slice(5)?1:0))}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`;}
function rowFrom({date,description,amount,externalId},options){
  const {source='account',month,bank='Outro banco',account='Principal',rules=[],signMode='signed'}=options;
  if(!date||!description||!Number.isSafeInteger(amount)||!amount)throw new Error('Data, descrição ou valor inválido.');
  const d=new Date(`${date}T12:00:00Z`);if(isNaN(d)||d.toISOString().slice(0,10)!==date)throw new Error('Data inválida.');
  const value=Number(Math.abs(amount)/100).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  // Use the same installment parsing and classification as PDF imports.
  const row=parseStatement(`${date.slice(8)}/${date.slice(5,7)}/${date.slice(0,4)} ${description} ${value}`,{...options,bank,account,source,month}).rows[0];
  if(!row)throw new Error('Não foi possível interpretar a linha.');
  let label=classify(row.description,rules,source);
  const credit=source==='account'?(signMode==='signed'?amount>0:amount<0):amount<0;
  if(credit&&!['payment','transfer'].includes(label.kind))label={kind:source==='card'?'refund':'income',category:'Movimentações',subcategory:source==='card'?'Estorno':'Receita',review:false};
  if(source==='account'&&!credit&&!['payment','transfer'].includes(label.kind)&&label.kind==='income')label={...classify(row.description,[],source),review:true};
  Object.assign(row,label,{bank,account});
  // Keep original imported identity immutable when a user later edits the transaction.
  delete row.importKey;row.importKey=externalId?`ofx:${source}:${externalId}`:`${source}|${row.month}|${row.date}|${normalize(row.description)}|${row.amount}|${row.installment}|${row.total}`;
  return row;
}
export function parseCsv(text,options){
  const all=splitCsv(text);if(all.length<2)throw new Error('O CSV precisa de cabeçalho e lançamentos.');
  const headers=all.shift().map(normalize);
  const find=names=>headers.findIndex(h=>names.includes(h));
  const date=find(['DATA','DATE','DATA DA COMPRA','DATA LANCAMENTO','DATA DO LANCAMENTO']);
  const desc=find(['DESCRICAO','DESCRIPTION','TITLE','HISTORICO','LANCAMENTO','ESTABELECIMENTO']);
  const value=find(['VALOR','AMOUNT','VALOR (R$)','VALOR R$']);
  const debit=find(['DEBITO','SAIDA','DEBIT']),credit=find(['CREDITO','ENTRADA','CREDIT']);
  if(date<0||desc<0||(value<0&&(debit<0||credit<0)))throw new Error('Cabeçalhos não reconhecidos. Use Data, Descrição e Valor (ou Débito e Crédito).');
  const rows=[],unparsed=[];
  for(const cells of all){try{const amount=value>=0?decimal(cells[value]||''):decimal(cells[credit]||'0')-Math.abs(decimal(cells[debit]||'0'));const row=rowFrom({date:validDate(cells[date]||'',options.month),description:cells[desc],amount},value<0?{...options,signMode:'signed'}:options);rows.push(row);}catch{unparsed.push(cells.join(' | '));}}
  return {rows,unparsed};
}
export function parseOfx(text,options){
  const blocks=text.match(/<STMTTRN>[\s\S]*?<\/STMTTRN>/gi)||[];
  if(!blocks.length)throw new Error('Nenhuma transação OFX encontrada.');
  const rows=[],unparsed=[];
  const val=(s,k)=>(s.match(new RegExp(`<${k}[^>]*>\\s*([^<\\r\\n]+)`,'i'))?.[1]||'').trim().replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  for(const b of blocks)try{const dt=val(b,'DTPOSTED').slice(0,8);const description=[val(b,'NAME'),val(b,'MEMO')].filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i).join(' · ');rows.push(rowFrom({date:`${dt.slice(0,4)}-${dt.slice(4,6)}-${dt.slice(6,8)}`,description,amount:decimal(val(b,'TRNAMT'))*(options.source==='card'?-1:1),externalId:val(b,'FITID')}, {...options,signMode:'signed'}));}catch{unparsed.push('Transação OFX sem data, descrição ou valor válido.');}
  return {rows,unparsed};
}
export function importText(text,format,options){if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(options.month))throw new Error('Informe um mês válido.');if(format==='csv')return parseCsv(text,options);if(format==='ofx')return parseOfx(text,options);return parseStatement(text,options);}
