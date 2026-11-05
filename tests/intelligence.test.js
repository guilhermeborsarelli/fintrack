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
test('estabelecimentos reais confirmados pelo usuário classificam sem revisão',()=>{
 const cases=[['Mate','Alimentação','Restaurantes'],['PAG*Mate','Alimentação','Restaurantes'],['track and field','Compras','Vestuário'],['TRACK&FIELD IGUATEMI','Compras','Vestuário'],['bf shop','Compras','Vestuário'],['BROOKSFIELD SHOPPING','Compras','Vestuário'],['TENIS LOUNGE JARDINS -','Lazer','Esportes e aulas'],['VIVARA LOJAVIVARA-7448 -','Compras','Joias e acessórios'],['OSKLEN CIDADE SAO PAUL -','Compras','Vestuário']];
 for(const [description,category,subcategory] of cases){const result=classify(description);assert.equal(result.category,category,description);assert.equal(result.subcategory,subcategory,description);assert.equal(result.review,false,description);assert.equal(result.classificationSource,'Estabelecimento confirmado pelo usuário');}
 assert.equal(classify('BF SHOPPING DESCONHECIDO').review,true);
 assert.equal(classify('MATERIAL ELETRICO').review,true);
 assert.equal(classify('MATE COURO').review,true);
 assert.equal(classify('TENIS LOUNGE JARDINS',[],'card','8299').category,'Lazer');
});
test('corrige histórico real sem alterar valores, datas, identidades ou parcelas',()=>{
 const entries=[['Mate','2026-10-04',5000,1,1],['TENIS LOUNGE JARDINS -','2026-10-01',10000,12,12],['VIVARA LOJAVIVARA-7448 -','2026-07-02',20000,5,10],['OSKLEN CIDADE SAO PAUL -','2026-10-03',30000,2,3]];
 const old=entries.map(([description,date,amount,installment,total],i)=>({id:String(i),description,date,amount,installment,total,month:'2026-11',source:'card',kind:'expense',category:'Outros',subcategory:'A classificar',review:true,importKey:'original-'+i}));
 const fixed=repairTransactions(old);
 for(let i=0;i<fixed.length;i++){assert.equal(fixed[i].review,false);for(const key of ['amount','date','month','installment','total','id','importKey'])assert.equal(fixed[i][key],old[i][key],key);}
 assert.equal(summary(fixed).total,65000);
 assert.equal(forMonth(fixed,'2026-12').find(t=>t.description.startsWith('TENIS')),undefined);
 assert.equal(forMonth(fixed,'2026-12').find(t=>t.description.startsWith('VIVARA')).amount,20000);
 assert.equal(forMonth(fixed,'2026-12').find(t=>t.description.startsWith('OSKLEN')).amount,30000);
 const ambiguous={...old[0],reviewReason:'Mais de um valor na linha'};assert.equal(repairTransactions([ambiguous])[0].review,true);
});
test('cobre canais e serviços nacionais e internacionais sem confundir atividade e intermediador',()=>{
 const cases=[['IFD DROGASIL','Saúde','Farmácia'],['MATE DOCE','Alimentação','Restaurantes'],['163 BF SHOP CIDADE','Compras','Vestuário'],['DL HOTEISCOM','Lazer','Viagens'],['E TRAVEL RESERVATION','Lazer','Viagens'],['IBERIA','Lazer','Viagens'],['BILHUNICO','Transporte','Transporte público'],['EMV METRE','Transporte','Transporte público'],['KOZINHA ARABE','Alimentação','Restaurantes'],['LANCHES FREVO','Alimentação','Restaurantes'],['BIG PASTEL','Alimentação','Restaurantes'],['KOPENHAGEN','Alimentação','Doces e lanches'],['PG PAUTA DISTRIBUICAO','Compras','Eletrônicos'],['MLP KABUM KABUM','Compras','Eletrônicos'],['LG ELECTRONICS','Compras','Eletrônicos'],['GLOBO PREMIERE','Lazer','Assinaturas'],['PATREON MEMBERSHIP','Lazer','Assinaturas'],['LIVELO','Lazer','Pontos e milhas'],['CLUBE LIVELO','Lazer','Pontos e milhas'],['OPENAI CHATGPT SUBSCR','Serviços','Software e serviços digitais'],['ANTHROPIC CLAUDE SUB','Serviços','Software e serviços digitais'],['MICROSOFT SUBSCRIPTION','Serviços','Software e serviços digitais'],['RAIL EUROPE','Transporte','Trens e ônibus'],['TRAINLINE','Transporte','Trens e ônibus'],['OMIO','Lazer','Viagens'],['LOTERIASONLINEABC','Lazer','Loterias e apostas'],['CONVENIENCIAS','Compras','Conveniência'],['SHOPPER','Alimentação','Supermercado'],['99FOOD 99FOOD','Alimentação','Delivery'],['ZUL 2 CARTOES','Transporte','Estacionamento'],['SEARA ALIMENTOS','Alimentação','Alimentos e conveniência'],['IFD BAR TESTE','Alimentação','Delivery'],['IFD A COMERCIO TESTE','Alimentação','Delivery'],['IFD CLUBE DE COMEDY','Lazer','Entretenimento'],['IFD DOGS DAY RACOES','Pets','Cuidados e produtos'],['IFD VILLAFRANCA SORVET','Alimentação','Doces e lanches']];
 for(const [description,category,subcategory] of cases){const label=classify(description);assert.equal(label.category,category,description);assert.equal(label.subcategory,subcategory,description);assert.equal(label.review,false,description);}
 assert.equal(classify('RESTAURANTE ANTONIO').subcategory,'Restaurantes');
 assert.equal(classify('NOME SEM RAMO').review,true);assert.equal(classify('MZ SPORTS').review,true);assert.equal(classify('TDF INVEST').review,true);
});
test('categoriza serviços internacionais no histórico mantendo dúvida de valores',()=>{
 const row={id:'fx',month:'2026-11',date:'2026-10-01',source:'card',kind:'expense',description:'OPENAI CHATGPT SUBSCR SA USD 10,00 COTACAO USD',amount:500,review:true,reviewReason:'Mais de um valor na linha: confira lançamento e saldo.',category:'Outros',subcategory:'A classificar',installment:1,total:1};
 const repaired=repairTransactions([row])[0];assert.equal(repaired.subcategory,'Software e serviços digitais');assert.equal(repaired.review,true);assert.equal(repaired.amount,500);assert.equal(repaired.reviewReason,row.reviewReason);
});
