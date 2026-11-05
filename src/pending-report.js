import {merchantKey} from './intelligence.js';
import {reviewMetrics} from './review.js';
function reasonFor(row){
 if(!row.reviewReason)return 'estabelecimento_desconhecido';
 if(/mais de um valor|saldo/i.test(row.reviewReason))return 'valor_ou_saldo_ambiguo';
 if(/PIX|transfer|entrada|saída/i.test(row.reviewReason))return 'sentido_da_movimentacao';
 return 'conferencia_da_leitura';
}
function safeName(row){
 if(row.source==='account'&&(/PIX|TRANSFER|\bTED\b|\bDOC\b|CPF|SALARIO/i.test(row.description)||row.kind!=='expense'))return '[movimentação de conta — nome omitido]';
 const description=row.description.replace(/\S+@\S+/g,'[email omitido]').replace(/(?:R\$\s*)?[+-]?\d[\d.]*,\d{2}/g,'[valor omitido]');
 return merchantKey(description).replace(/\b\d[\d .()/+-]{7,}\d\b/g,'[número omitido]').replace(/\b\d{5,}\b/g,'[número omitido]').replace(/\S+@\S+/g,'[email omitido]').slice(0,140)||'[descrição vazia]';
}
export function pendingReport(rows,{build='local'}={}){
 const actual=rows.filter(t=>!t.projected),pending=actual.filter(t=>t.review),groups=new Map();
 const reasons={};
 for(const row of pending){const reason=reasonFor(row),name=safeName(row),key=reason+'|'+name+'|'+row.source;reasons[reason]=(reasons[reason]||0)+1;
 if(!groups.has(key))groups.set(key,{estabelecimento:name,motivo:reason,tipo_documento:row.source,quantidade:0});groups.get(key).quantidade++;}
 const metrics=reviewMetrics(actual);
 return {versao_relatorio:1,versao_app:build,resumo:{total_lancamentos:metrics.total,pendentes:pending.length,percentual_pendente:Number(metrics.rate.toFixed(2)),motivos:reasons},estabelecimentos:[...groups.values()].sort((a,b)=>b.quantidade-a.quantidade),observacao:'Sem valores, datas, contas, rendas, PDFs ou senhas. Os nomes podem conter informações pessoais; confira antes de compartilhar. Nenhum dado foi enviado automaticamente.'};
}
