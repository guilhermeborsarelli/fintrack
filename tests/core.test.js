import test from 'node:test';
import assert from 'node:assert/strict';
import {parseStatement,isPayment,summary,forMonth,mergeTransactions,shiftMonth,validateBackup,classify} from '../src/core.js';
const parse=(text,month='2026-11',source='card')=>parseStatement(text,{month,source}).rows;
test('parcela 3/10 conta apenas valor mensal e projeta as sete seguintes',()=>{
 const rows=parse('14/09/2026 AMAZON 03/10 100,00');
 assert.equal(summary(forMonth(rows,'2026-11')).total,10000);
 assert.equal(forMonth(rows,'2026-12')[0].installment,4);
 assert.equal(summary(forMonth(rows,'2027-06')).total,10000);
 assert.equal(summary(forMonth(rows,'2027-07')).total,0);
 assert.equal(rows[0].date,'2026-09-14');
});
test('fatura importada substitui previsão da parcela, sem duplicar',()=>{
 const rows=[...parse('14/09/2026 AMAZON 03/10 100,00'),...parse('14/09/2026 AMAZON 04/10 100,00','2026-12')];
 const dec=forMonth(rows,'2026-12');assert.equal(dec.length,1);assert.equal(dec[0].projected,undefined);
 assert.equal(summary(forMonth(rows,'2027-01')).total,10000);
});
test('pagamentos de fatura são excluídos do gasto e dos gráficos',()=>{
 for(const description of ['PAGAMENTO DE FATURA','PGTO FATURA ANTERIOR','PAGAMENTO RECEBIDO','PAGTO CARTAO','PAGAMENTO EFETUADO']) assert.equal(isPayment(description),true,description);
 const s=summary(parse('01/11 PAGAMENTO FATURA ANTERIOR -1.500,00\n02/11 CARREFOUR 200,00'));
 assert.equal(s.total,20000);assert.deepEqual(s.groups,[['Alimentação',20000]]);
});
test('deduplica reimportação mas preserva duas compras iguais no mesmo documento',()=>{
 const incoming=parse('01/11 IFOOD 25,00\n01/11 IFOOD 25,00');
 assert.equal(mergeTransactions([],incoming).added,2);
 const merged=mergeTransactions(incoming,parse('01/11 IFOOD 25,00\n01/11 IFOOD 25,00'));
 assert.equal(merged.added,0);assert.equal(merged.duplicates,2);
});
test('datas inválidas e linhas ambíguas não viram gastos inventados',()=>{
 const result=parseStatement('31/02 RESTAURANTE 10,00\n01/11 DESCRICAO SEM VALOR\nTOTAL DA FATURA 900,00',{month:'2026-11'});
 assert.equal(result.rows.length,0);assert.equal(result.unparsed.length,2);
});
test('estorno desconta do total e mantém distribuição de compras brutas',()=>{
 const rows=parse('01/11 CARREFOUR 100,00\n02/11 ESTORNO CARREFOUR -25,00');const s=summary(rows);
 assert.equal(s.gross,10000);assert.equal(s.refunds,2500);assert.equal(s.total,7500);
});
test('extrato usa o mês do lançamento, reconhece C e mantém PIX ambíguo para revisão',()=>{
 const rows=parse('30/10 SALARIO 2.000,00 C\n02/11 PIX ENVIADO 50,00 D','2026-11','account');
 assert.equal(rows[0].kind,'income');assert.equal(rows[0].month,'2026-10');assert.equal(rows[1].review,true);
});
test('regras aprendidas e categorias conhecidas dispensam conferência',()=>{
 assert.equal(classify('NETFLIX').review,false);assert.equal(classify('XYZ').review,true);
 assert.equal(classify('XYZ',[{match:'XYZ',kind:'expense',category:'Pets',subcategory:'Ração'}]).category,'Pets');
});
test('virada do ano e inferência de ano preservam data original',()=>{
 assert.equal(shiftMonth('2026-12',1),'2027-01');assert.equal(parse('10/12 AMAZON 02/10 90,00','2027-01')[0].date,'2026-12-10');
});
test('backup aceita dados válidos e rejeita dados de tipo incorreto',()=>{
 const data={version:1,transactions:parse('01/11 IFOOD 25,00'),rules:[]};assert.equal(validateBackup(data),data);
 assert.throws(()=>validateBackup({...data,transactions:[{...data.transactions[0],amount:'2500'}]}));
 assert.throws(()=>validateBackup({version:5,transactions:[],rules:[]}));
});
test('reimportar após editar valor e descrição mantém identificação original',()=>{
 const original=parse('01/11 LOJA ABC 100,00');
 const edited=[{...original[0],description:'Loja corrigida',amount:9000}];
 assert.equal(mergeTransactions(edited,parse('01/11 LOJA ABC 100,00')).added,0);
});
test('duas compras parceladas iguais preservam duas previsões',()=>{
 const rows=parse('01/10 AMAZON 02/04 100,00\n01/10 AMAZON 02/04 100,00');
 assert.equal(forMonth(rows,'2026-12').length,2);
 assert.equal(summary(forMonth(rows,'2026-12')).total,20000);
});
test('mudança no valor mensal da parcela substitui a previsão antiga',()=>{
 const rows=[...parse('01/10 AMAZON 02/04 100,00'),...parse('01/10 AMAZON 03/04 110,00','2026-12')];
 assert.equal(summary(forMonth(rows,'2026-12')).total,11000);
 assert.equal(summary(forMonth(rows,'2027-01')).total,11000);
});
