import test from 'node:test';
import assert from 'node:assert/strict';
import {reviewGroups,reviewMetrics} from '../src/review.js';
import {netFromDeductions} from '../src/incomes.js';
import {importText} from '../src/importers.js';
import {validateFinance,emptyFinance} from '../src/finance-schema.js';
test('66 lançamentos equivalentes viram uma decisão sem esconder taxa de revisão',()=>{
 const rows=Array.from({length:66},(_,i)=>({id:String(i),kind:'expense',review:true,description:i%2?'PAG*LOJA TESTE':'SUMUP*LOJA TESTE',amount:10000}));
 assert.equal(reviewGroups(rows).length,1);assert.equal(reviewGroups(rows)[0].rows.length,66);assert.deepEqual(reviewMetrics(rows),{total:66,pending:66,rate:100,groups:1});
});
test('MCC fornecido pelo CSV e SIC do OFX atribuem ramo sem pesquisa textual',()=>{
 const options={month:'2026-11',source:'card',bank:'C6',account:'Principal'};
 const csv=importText('Data;Descrição;Valor;MCC\n01/11/2026;ESTABELECIMENTO ABC;100,00;5411','csv',options);assert.equal(csv.rows[0].subcategory,'Supermercado');assert.equal(csv.rows[0].review,false);assert.equal(csv.rows[0].mcc,'5411');
 const ofx=importText('<STMTTRN><DTPOSTED>20261101<TRNAMT>-100.00<FITID>1<NAME>DESCONHECIDO<SIC>5912</STMTTRN>','ofx',options);assert.equal(ofx.rows[0].subcategory,'Farmácia');
});
test('descontos conhecidos calculam líquido em centavos e rejeitam saldo impossível',()=>{
 assert.deepEqual(netFromDeductions(1000000,[90886,156270,20000]),{gross:1000000,deductions:267156,net:732844});
 assert.throws(()=>netFromDeductions(10000,[10001]));assert.throws(()=>netFromDeductions(10000,[-1]));
});
test('backup conserva memória dos descontos e rejeita líquido inconsistente',()=>{
 const tax={regime:'clt',gross:100000,inss:10000,ir:5000,iss:0,das:0,other:1000,deductions:16000,net:84000};
 const f={...emptyFinance(),incomes:[{id:'i',name:'CLT',amount:84000,start:'2026-11',frequency:'monthly',tax}]};assert.equal(validateFinance(f),f);assert.throws(()=>validateFinance({...f,incomes:[{...f.incomes[0],amount:100000}]}));
});
