import test from 'node:test';
import assert from 'node:assert/strict';
import {pendingReport} from '../src/pending-report.js';
test('61 pendências são agrupadas por causa sem dados financeiros nem identificadores',()=>{
 const rows=Array.from({length:60},(_,i)=>({id:'private-id-'+i,date:'2026-11-22',month:'2026-11',bank:'PRIVATE BANK',account:'PRIVATE ACCOUNT',description:i%2?'PAG*LOJA DESCONHECIDA':'SUMUP*LOJA DESCONHECIDA',amount:987654321,source:'card',kind:'expense',review:true}));
 rows.push({...rows[0],description:'PIX 123.456.789-01 JOAO',source:'account',reviewReason:'PIX ou transferência: confirme a movimentação.'});
 const r=pendingReport(rows,{build:'release-123'});assert.equal(r.resumo.pendentes,61);assert.equal(r.resumo.percentual_pendente,100);assert.equal(r.resumo.motivos.estabelecimento_desconhecido,60);assert.equal(r.resumo.motivos.sentido_da_movimentacao,1);assert.equal(r.estabelecimentos.length,2);assert.equal(r.estabelecimentos[0].quantidade,60);
 const text=JSON.stringify(r);for(const sensitive of ['987654321','2026-11-22','PRIVATE BANK','PRIVATE ACCOUNT','private-id','123.456.789-01','JOAO'])assert.equal(text.includes(sensitive),false,sensitive);
});
test('relatório distingue valor ambíguo de categoria e ignora projeções',()=>{
 const rows=[{description:'LOJA 12345678901234',source:'card',kind:'expense',review:true,reviewReason:'Mais de um valor na linha: confira lançamento e saldo.'},{description:'LOJA',source:'card',kind:'expense',review:true,projected:true}];
 const r=pendingReport(rows);assert.equal(r.resumo.pendentes,1);assert.equal(r.resumo.motivos.valor_ou_saldo_ambiguo,1);assert.equal(JSON.stringify(r).includes('12345678901234'),false);
});
