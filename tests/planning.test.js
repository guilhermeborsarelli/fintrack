import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyFinance,buildPlan,incomeFor,alertsFor,suggestions,validateFinance} from '../src/planning.js';
import {parseStatement,validateBackup} from '../src/core.js';
const income=(amount,start='2026-11',frequency='monthly',end='')=>({id:crypto.randomUUID(),name:'Salário',amount,start,frequency,end});
const goal=(name,target,deadline='2027-01',priority=2,saved=0)=>({id:crypto.randomUUID(),name,target,saved,deadline,priority});
const budget=(category,amount)=>({id:crypto.randomUUID(),category,amount});
test('rendas mensais respeitam início/fim e renda pontual só entra uma vez',()=>{
 const f={...emptyFinance(),incomes:[income(500000,'2026-11','monthly','2027-01'),income(100000,'2026-12','once')]};
 assert.equal(incomeFor(f,'2026-10'),0);assert.equal(incomeFor(f,'2026-11'),500000);assert.equal(incomeFor(f,'2026-12'),600000);assert.equal(incomeFor(f,'2027-02'),0);
});
test('renda cadastrada não soma novamente receitas importadas do extrato',()=>{
 const f={...emptyFinance(),incomes:[income(500000)],budgets:[budget('Moradia',300000)]};
 const tx=parseStatement('01/11 SALARIO 5.000,00 C',{month:'2026-11',source:'account'}).rows;
 const p=buildPlan(f,tx,'2026-11');assert.equal(p.current.income,500000);assert.equal(p.current.observedIncome,500000);assert.equal(p.current.available,200000);
});
test('metas competem pela mesma capacidade e prioridade alta recebe antes',()=>{
 const high=goal('Viagem',600000,'2027-01',1),low=goal('Casamento',1200000,'2027-01',3);
 const f={...emptyFinance(),incomes:[income(500000)],budgets:[budget('Moradia',300000)],goals:[low,high]};
 const p=buildPlan(f,[],'2026-11');assert.equal(p.required,600000);assert.equal(p.allocated,200000);assert.equal(p.targets.find(g=>g.id===high.id).allocation,200000);assert.equal(p.targets.find(g=>g.id===low.id).allocation,0);
 assert.equal(p.targets.find(g=>g.id===high.id).completion,'2027-01');assert.equal(p.targets.find(g=>g.id===low.id).onTime,false);
 for(const m of p.schedule)assert.ok(m.allocations.reduce((s,a)=>s+a.amount,0)<=m.available);
});
test('margem e aportes já realizados reduzem o saldo; meta usa só valor restante',()=>{
 const g=goal('Viagem',600000,'2027-01',1,100000);
 const f={...emptyFinance(),incomes:[income(500000)],budgets:[budget('Moradia',300000)],buffer:50000,goals:[g],contributions:[{id:'c',goalId:g.id,month:'2026-11',amount:100000}]};
 const p=buildPlan(f,[],'2026-11');assert.equal(p.current.available,50000);assert.equal(p.current.committed,100000);assert.equal(p.required,166667);assert.equal(p.allocated,50000);assert.equal(p.schedule[1].available,150000);
});
test('parcelas não são adicionadas duas vezes ao orçamento e previsão diminui depois',()=>{
 const tx=parseStatement('01/10 AMAZON 02/03 100,00',{month:'2026-11'}).rows;
 const f={...emptyFinance(),incomes:[income(500000)],budgets:[budget('Compras',5000)]};
 const p=buildPlan(f,tx,'2026-11');assert.equal(p.current.spending,10000);assert.equal(p.schedule[1].spending,10000);assert.equal(p.schedule[2].spending,5000);
});
test('sem renda ou com déficit, plano nunca sugere aporte negativo ou dinheiro inventado',()=>{
 const f={...emptyFinance(),budgets:[budget('Moradia',300000)],goals:[goal('Reserva',100000)]};
 const p=buildPlan(f,[],'2026-11');assert.equal(p.current.balance,-300000);assert.equal(p.allocated,0);assert.equal(p.targets[0].completion,null);assert.ok(alertsFor(f,[],'2026-11').some(a=>a.tone==='danger'));
});
test('orçamento zero alerta ao gastar; orçamento a 80% alerta antes de ultrapassar',()=>{
 const tx=parseStatement('01/11 IFOOD 80,00',{month:'2026-11'}).rows;
 const f={...emptyFinance(),budgets:[budget('Alimentação',10000)]};assert.ok(alertsFor(f,tx,'2026-11').some(a=>a.title.includes('atenção ao limite')));
 f.budgets[0].amount=0;assert.ok(alertsFor(f,tx,'2026-11').some(a=>a.title.includes('ultrapassado')));
});
test('sugestões cortam só despesas flexíveis não parceladas',()=>{
 const tx=parseStatement('01/11 IFOOD 100,00\n02/11 DROGASIL 200,00\n03/11 AMAZON 02/10 300,00',{month:'2026-11'}).rows;
 const cuts=suggestions(tx,'2026-11');assert.equal(cuts.length,1);assert.equal(cuts[0].name,'Delivery');assert.equal(cuts[0].saving,2500);
});
test('backup antigo migra e backup novo preserva rendas, metas e aportes',()=>{
 const old=validateBackup({version:1,transactions:[],rules:[]});assert.deepEqual(old.finance,emptyFinance());
 const finance={...emptyFinance(),incomes:[income(500000)],goals:[goal('Reserva',100000)]};
 assert.deepEqual(validateBackup(JSON.parse(JSON.stringify({...old,finance}))).finance,finance);
 assert.throws(()=>validateFinance({...finance,buffer:-1}));assert.throws(()=>validateFinance({...finance,budgets:[budget('Moradia',1),budget('Moradia',2)]}));
});
