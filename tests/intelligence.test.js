import test from 'node:test';
import assert from 'node:assert/strict';
import {classify,parseStatement,summary,forMonth} from '../src/core.js';
import {repairTransactions,merchantKey} from '../src/intelligence.js';
import {researchMerchant,researchName} from '../src/merchant-research.js';
test('caso reportado Inclusão de Pagamento de R$ 13.526,94 fica fora dos gastos',()=>{
 const tx=parseStatement('05/10 Inclusao de Pagamento 13.526,94\n06/10 IFOOD 100,00',{month:'2026-10'}).rows;
 assert.equal(tx[0].kind,'payment');assert.equal(summary(tx).total,10000);
 const old={...tx[0],kind:'expense',category:'Outros',subcategory:'A classificar',review:true};
 assert.equal(repairTransactions([old])[0].kind,'payment');assert.equal(repairTransactions([old])[0].review,false);
});
test('pagamentos com abreviação, pontuação e ordem invertida são reconhecidos',()=>{
 for(const d of ['PGTO. DE FATURA','Pagamento - fatura anterior','FATURA ANTERIOR: PAGAMENTO','Inclusão de pagamento','PGTO EM DEBITO AUTOMATICO'])assert.equal(classify(d).kind,'payment',d);
 assert.equal(classify('PAGAMENTO RECEBIDO CLIENTE',[],'account').kind,'expense');
});
test('estabelecimentos e intermediadores não são confundidos',()=>{
 assert.equal(classify('MERCADO LIVRE').subcategory,'Compras online');assert.equal(classify('UBER EATS').subcategory,'Delivery');
 assert.equal(classify('MERCADO PAGO').review,true);assert.equal(classify('MERCADO PAGO DESCONHECIDO').review,true);
 assert.equal(classify('PAG*DROGASIL').subcategory,'Farmácia');assert.equal(classify('Petz').category,'Pets');
});
test('aprende uma vez e agrupa variações sem suprimir ambiguidade de valor',()=>{
 const rule={match:'PAG*LOJA TESTE LTDA',kind:'expense',category:'Pets',subcategory:'Cuidados e produtos'};
 assert.equal(classify('SUMUP*LOJA TESTE',[rule]).category,'Pets');
 const old={id:'x',description:'DROGASIL',kind:'expense',review:true,reviewReason:'Mais de um valor',category:'Outros'};
 assert.equal(repairTransactions([old])[0].review,true);
 const manual={...old,classificationLocked:true,category:'Meu ajuste'};assert.equal(repairTransactions([manual])[0],manual);
});
test('pesquisa envia só nome e exige evidência comercial com nome exato',async()=>{
 assert.equal(researchName('PIX JOAO SILVA'),null);assert.equal(researchName('LOJA 12345678900'),null);
 assert.equal(researchName('MERCADO PAGO'),null);assert.equal(merchantKey('PAG*FARMACIA TESTE LTDA'),'FARMACIA TESTE');
 let request;
 const mock=async url=>{request=String(url);return {ok:true,json:async()=>({query:{pages:{1:{pageid:1,title:'Loja Teste',extract:'Loja Teste é uma empresa brasileira de comércio eletrônico.'}}}})}};
 const r=await researchMerchant('LOJA TESTE',mock);assert.equal(r.subcategory,'Compras online');assert.equal(r.evidenceUrl,'https://pt.wikipedia.org/?curid=1');assert.ok(!request.includes('amount'));
 const city=async()=>({ok:true,json:async()=>({query:{pages:{1:{pageid:1,title:'Loja Teste',extract:'Uma cidade brasileira de belas paisagens.'}}}})});
 assert.equal(await researchMerchant('LOJA TESTE',city),null);
 const mismatch=async()=>({ok:true,json:async()=>({query:{pages:{1:{pageid:1,title:'Outra Loja',extract:'Uma empresa de supermercados.'}}}})});
 assert.equal(await researchMerchant('LOJA TESTE',mismatch),null);
 await assert.rejects(()=>researchMerchant('LOJA TESTE',async()=>({ok:false})));
});
test('parcelas mensais não são divididas outra vez e exibem índice correto',()=>{
 const rows=parseStatement('01/09 AMAZON 03/10 100,00',{month:'2026-11'}).rows;
 assert.equal(summary(rows).total,10000);assert.equal(rows[0].installment,3);assert.equal(rows[0].total,10);
 assert.equal(forMonth(rows,'2026-12')[0].amount,10000);assert.equal(forMonth(rows,'2026-12')[0].installment,4);
});
test('custo total explícito é convertido em parcelas sem perder centavos',()=>{
 const rows=parseStatement('01/09 AMAZON 01/03 100,00',{month:'2026-11',installmentBasis:'total'}).rows;
 assert.equal(rows[0].amount,3334);assert.equal(forMonth(rows,'2026-12')[0].amount,3333);assert.equal(forMonth(rows,'2027-01')[0].amount,3333);
 assert.equal(rows[0].amount+forMonth(rows,'2026-12')[0].amount+forMonth(rows,'2027-01')[0].amount,10000);
});
