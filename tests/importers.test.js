import test from 'node:test';
import assert from 'node:assert/strict';
import {detectBank,importText,parseOfx} from '../src/importers.js';
import {mergeTransactions,parseStatement,summary,forMonth} from '../src/core.js';
const options={month:'2026-11',source:'account',bank:'Itaú',account:'Principal',signMode:'signed'};
test('detecta instituições por evidência e mantém desconhecido como desconhecido',()=>{assert.equal(detectBank('Fatura ITAÚ'), 'Itaú');assert.equal(detectBank('Nu Pagamentos S.A.'),'Nubank');assert.equal(detectBank('Extrato banco qualquer'),null);});
test('CSV separado por ponto e vírgula reconhece valores brasileiros e aspas',()=>{
 const r=importText('Data;Descrição;Valor\n01/11/2026;Salário;5.000,00\n02/11/2026;"Restaurante; Jardim";-150,50','csv',options);
 assert.equal(r.rows.length,2);assert.equal(r.rows[0].kind,'income');assert.equal(r.rows[1].amount,15050);assert.equal(r.rows[1].kind,'expense');assert.equal(r.rows[1].bank,'Itaú');
});
test('CSV estilo Nubank reconhece ISO e ponto decimal e parcelas',()=>{
 const r=importText('date,title,amount\n2026-11-01,Amazon 2/4,123.45\n2026-11-02,Estorno,-20.00','csv',{...options,source:'card',bank:'Nubank'});
 assert.equal(r.rows[0].amount,12345);assert.equal(r.rows[0].installment,2);assert.equal(r.rows[1].kind,'refund');assert.equal(summary(r.rows).total,10345);
});
test('CSV com Débito e Crédito explícitos prevalece sobre convenção de sinais',()=>{
 const r=importText('Data;Histórico;Débito;Crédito\n01/11/2026;Aluguel;1.200,00;\n02/11/2026;Salário;;5.000,00','csv',{...options,signMode:'legacy'});
 assert.equal(r.rows[0].kind,'expense');assert.equal(r.rows[1].kind,'income');
});
test('OFX SGML/XML usa sinal e FITID para ignorar reimportação',()=>{
 const text='<OFX><BANKMSGSRSV1><STMTTRN><DTPOSTED>20261101120000[-3:BRT]\n<TRNAMT>-120.50\n<FITID>42\n<NAME>IFOOD\n</STMTTRN><STMTTRN><DTPOSTED>20261102<TRNAMT>5000.00<FITID>43<NAME>SALARIO</STMTTRN></BANKMSGSRSV1></OFX>';
 const a=parseOfx(text,options),b=parseOfx(text,options);assert.equal(a.rows.length,2);assert.equal(a.rows[0].kind,'expense');assert.equal(a.rows[1].kind,'income');assert.equal(mergeTransactions(a.rows,b.rows).duplicates,2);
});
test('OFX de cartão usa débito negativo como compra e crédito como estorno',()=>{const text='<STMTTRN><DTPOSTED>20261101<TRNAMT>-100.00<FITID>x<NAME>AMAZON</STMTTRN>';const rows=parseOfx(text,{...options,source:'card'}).rows;assert.equal(rows[0].kind,'expense');assert.equal(rows[0].amount,10000);});
test('mesma compra em bancos ou contas diferentes não é descartada nem substitui projeção alheia',()=>{
 const a=parseStatement('01/10 AMAZON 02/04 100,00',{...options,bank:'C6',source:'card'}).rows;
 const b=parseStatement('01/10 AMAZON 02/04 100,00',{...options,bank:'Nubank',source:'card'}).rows;
 assert.equal(mergeTransactions(a,b).added,1);
 assert.equal(forMonth([...a,...b],'2026-12').length,2);
 const other=parseStatement('01/10 AMAZON 02/04 100,00',{...options,bank:'C6',account:'Adicional',source:'card'}).rows;assert.equal(mergeTransactions(a,other).added,1);
});
test('PDF suporta data por extenso abreviada, ISO e descrição na linha seguinte',()=>{
 const text='05 NOV 2026 IFOOD 100,00\n2026-11-06 AMAZON 2 DE 4 50,00\n07/11 LOJA ABC\nCOMPRA TESTE 10,00';
 const r=parseStatement(text,{...options,source:'card'});assert.equal(r.rows.length,3);assert.equal(r.rows[1].installment,2);assert.equal(r.rows[2].description,'LOJA ABC COMPRA TESTE');
});
test('pagamento recebido de cliente em conta é renda; fatura anterior é excluída',()=>{
 const r=parseStatement('01/11 PAGAMENTO RECEBIDO CLIENTE 100,00 C\n02/11 PAGAMENTO FATURA 500,00 D',options);assert.equal(r.rows[0].kind,'income');assert.equal(r.rows[1].kind,'payment');
});
test('saldo em coluna extra não vira gasto; linha é marcada para conferência',()=>{
 const r=parseStatement('01/11 IFOOD 10,00 D 2.500,00 C',options);assert.equal(r.rows[0].amount,1000);assert.equal(r.rows[0].kind,'expense');assert.equal(r.rows[0].review,true);
});
test('CSV malformado ou linhas inválidas não são convertidas em lançamentos',()=>{
 assert.throws(()=>importText('foo;bar\nx;y','csv',options));assert.throws(()=>importText('Data;Descrição;Valor\n01/11;"teste;1,00','csv',options));
 const r=importText('Data;Descrição;Valor\n31/02/2026;Loja;20,00\n01/11/2026;Loja;ABC','csv',options);assert.equal(r.rows.length,0);assert.equal(r.unparsed.length,2);
});
test('CSV aceita milhares no padrão internacional sem alterar ordem de grandeza',()=>{
 const r=importText('date,title,amount\n2026-11-01,Salary,"1,234.56"','csv',options);assert.equal(r.rows[0].amount,123456);
});
