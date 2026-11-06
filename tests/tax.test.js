import test from 'node:test';
import assert from 'node:assert/strict';
import {inssEmployee,incomeTax,calculateIncome,calculateIncomeSet} from '../src/tax/engine.js';
import {incomeFor} from '../src/planning.js';
import {validateFinance,emptyFinance} from '../src/finance-schema.js';
const calc=p=>calculateIncome({competence:'2026-11',regime:'clt',...p});
test('INSS 2026 usa faixas marginais e teto; não aplica 14% ao salário todo',()=>{
 assert.equal(inssEmployee(162100).total,12158);assert.equal(inssEmployee(290284).total,23694);assert.equal(inssEmployee(435427).total,41111);assert.equal(inssEmployee(847555).total,98809);assert.equal(inssEmployee(2000000).total,98809);
 assert.equal(inssEmployee(0).total,0);assert.throws(()=>inssEmployee(-1));
});
test('CLT de R$ 5 mil tem INSS R$ 501,51 e IR zero após redução 2026',()=>{const r=calc({gross:500000});assert.equal(r.inss,50151);assert.equal(r.ir,0);assert.equal(r.net,449849);assert.equal(r.details.ir.deductionMethod,'Desconto simplificado');});
test('IR aplica redução parcial até 7350 e não isenta integralmente acima de 5000',()=>{
 const r=calc({gross:600000});assert.equal(r.details.ir.before,56485);assert.equal(r.details.ir.reduction,17975);assert.equal(r.ir,38510);assert.equal(r.net,497339);
 assert.equal(calc({gross:735000}).details.ir.reduction,0);assert.equal(calc({gross:735001}).details.ir.reduction,0);
 assert.equal(incomeTax(500000).total,0);assert.equal(incomeTax(0).total,0);
});
test('vale-transporte de 1% e custo real são respeitados; FGTS não reduz salário',()=>{
 const r=calc({gross:500000,transportPercent:1});assert.equal(r.details.transport,5000);assert.equal(r.net,444849);assert.equal(r.details.fgtsEmployer,40000);
 assert.equal(calc({gross:500000,transportPercent:6,transportCost:15000}).details.transport,15000);assert.throws(()=>calc({gross:500000,transportPercent:7}));
 assert.equal(calc({gross:1000000,dependents:2}).ir,146527);
});
test('autônomo PF exige situação do ISS e diferencia contribuição normal, simplificada e RPA',()=>{
 const common={regime:'pf',gross:300000,issMode:'sp_exempt',spCcmConfirmed:true};
 assert.throws(()=>calc({regime:'pf',gross:300000,payer:'pf'}));
 const normal=calc({...common,payer:'pf'});assert.equal(normal.inss,60000);assert.equal(normal.ir,0);assert.equal(normal.net,240000);
 const simplified=calc({...common,payer:'pf',inssPlan:'simplified'});assert.equal(simplified.inss,17831);
 const rpa=calc({...common,payer:'pj',issMode:'rate',issPercent:2});assert.equal(rpa.inss,33000);assert.equal(rpa.iss,6000);assert.equal(rpa.net,261000);
 assert.throws(()=>calc({...common,payer:'mixed'}));
});
test('MEI usa contribuição fixa de 2026 e limites proporcionais, sem tratar todo faturamento como salário',()=>{
 const base={regime:'mei',gross:500000,annualRevenue:6000000,activity:'services',accounting:true,businessCosts:100000};
 const r=calc(base);assert.equal(r.das,8605);assert.equal(r.net,391395);assert.equal(r.details.profit,391395);
 assert.equal(calc({...base,activity:'commerce'}).das,8205);assert.equal(calc({...base,activity:'mixed'}).das,8705);
 assert.throws(()=>calc({...base,annualRevenue:8200000}));assert.throws(()=>calc({...base,employees:2,payrollMonthly:300000}));assert.throws(()=>calc({...base,monthsInYear:2,annualRevenue:2000000}));
});
test('Simples calcula faixa efetiva, fator R e pró-labore sem dupla contagem',()=>{
 const base={regime:'simples',gross:2000000,activity:'factorR',rbt12:24000000,folha12:7200000,prolabore:500000,accounting:true};
 const r=calc(base);assert.equal(r.details.annex,'III');assert.equal(r.details.factorR,.3);assert.equal(r.das,146000);assert.equal(r.inss,55000);assert.equal(r.net,1799000);
 const lower=calc({...base,folha12:6000000});assert.equal(lower.details.annex,'V');assert.equal(lower.das,322500);
 assert.equal(calc({...base,folha12:6720000}).details.annex,'III');assert.equal(calc({...base,folha12:6719999}).details.annex,'V');
 assert.throws(()=>calc({...base,rbt12:400000000}));assert.throws(()=>calc({...base,prolabore:3000000}));
});
test('Anexo IV calcula CPP fora do DAS, RAT/FAP e FGTS como custos da empresa',()=>{
 const r=calc({regime:'simples',gross:2000000,activity:'serviceIV',rbt12:18000000,prolabore:300000,employees:1,payrollMonthly:200000,ratPercent:1,fap:1,accounting:true});
 assert.equal(r.das,90000);assert.equal(r.details.companyCpp,102000);assert.equal(r.details.fgts,16000);assert.equal(r.inss,33000);assert.equal(r.net,1559000);
});
test('empresa nova anualiza a receita para a faixa em vez de assumir imposto zero',()=>{
 const r=calc({regime:'simples',gross:2000000,activity:'serviceIII',newBusiness:true,pastMonths:0,accounting:true});assert.equal(r.das,146000);
});
test('lucros mensais acima de 50 mil incluem a retenção de dividendos de 2026',()=>{
 const r=calc({regime:'simples',gross:10000000,activity:'commerce',rbt12:120000000,accounting:true});assert.ok(r.details.dividendWithholding>0);assert.equal(r.ir,r.details.dividendWithholding);
});
test('dois vínculos CLT coordenam teto e geram provisão conjunta de IR',()=>{
 const incomes=[1,2].map(n=>{const tax=calc({gross:500000});return {id:String(n),name:'CLT '+n,amount:tax.net,tax,start:'2026-11',frequency:'monthly'};});
 const r=calculateIncomeSet(incomes,'2026-11');assert.equal([...r.results.values()].reduce((s,t)=>s+t.inss,0),98809);assert.equal(r.complementaryReserve,156955);
 assert.equal(incomeFor({...emptyFinance(),incomes},'2026-11'),744236);assert.equal(incomeFor({...emptyFinance(),incomes,taxReserveEnabled:false},'2026-11'),901191);
});
test('CLT e autônomo respeitam base máxima de contribuição e validam backup automático',()=>{
 const salary=calc({gross:800000}),pf=calc({regime:'pf',gross:200000,payer:'pj',issMode:'amount',issAmount:0});
 const incomes=[salary,pf].map((tax,index)=>({id:'i'+index,name:'Renda '+index,amount:tax.net,tax,start:'2026-11',frequency:'monthly'}));
 const set=calculateIncomeSet(incomes,'2026-11');assert.equal(set.results.get('i1').details.contributionBase,47555);assert.equal(set.results.get('i1').inss,5231);
 assert.equal(validateFinance({...emptyFinance(),incomes}).incomes.length,2);
 assert.throws(()=>calc({competence:'2027-01',gross:500000}));
});
test('fator R em empresa nova compara folha e receita da mesma janela',()=>{
 const common={regime:'simples',gross:2000000,activity:'factorR',newBusiness:true,pastMonths:0,accounting:true};
 assert.equal(calc({...common,folha12:600000}).details.annex,'III');assert.equal(calc({...common,folha12:500000}).details.annex,'V');
 assert.equal(calc({...common,pastMonths:2,pastRevenue:4000000,folha12:1120000}).details.annex,'III');
});
test('MEI misto segrega comércio e serviços para estimar parcela isenta',()=>{
 const r=calc({regime:'mei',gross:500000,annualRevenue:6000000,activity:'mixed',serviceRevenue:400000,accounting:false});assert.equal(r.das,8705);assert.equal(r.details.exemptProfit,136000);assert.equal(r.net,491295);
 assert.throws(()=>calc({regime:'mei',gross:500000,annualRevenue:6000000,activity:'mixed',serviceRevenue:600000}));
});
test('Simples sem escrituração deduz IRPJ do DAS do limite de lucro isento',()=>{
 const base={regime:'simples',gross:1000000,activity:'commerce',rbt12:12000000,accounting:false};
 assert.throws(()=>calc(base),/IRPJ/);
 const r=calc({...base,irpjInDas:2200});assert.equal(r.details.exemptProfit,77800);
 assert.throws(()=>calc({...base,irpjInDas:50000}),/superar/);
});
test('competências futuras não recalculam provisão conjunta com tabelas de 2026',()=>{
 const incomes=[1,2].map(n=>{const tax=calc({gross:500000});return {id:String(n),name:'CLT '+n,amount:tax.net,tax,start:'2026-11',frequency:'monthly'};});
 const r=calculateIncomeSet(incomes,'2027-01');assert.equal(r.complementaryReserve,0);assert.equal(r.total,899698);assert.equal(r.warnings.length,2);
});
