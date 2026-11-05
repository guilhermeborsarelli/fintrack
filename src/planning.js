import {forMonth,summary,shiftMonth,money} from './core.js';
export {emptyFinance,validateFinance} from './finance-schema.js';
export function incomeFor(f,month){return f.incomes.filter(i=>i.start<=month&&(!i.end||i.end>=month)&&(i.frequency==='monthly'||i.start===month)).reduce((a,i)=>a+i.amount,0);}
export const monthDiff=(from,to)=>(+to.slice(0,4)- +from.slice(0,4))*12+ +to.slice(5)- +from.slice(5);
export function spendingBaseline(transactions,month){
  // Only imported months in the latest three-month window; partial history is explicit in the UI.
  const months=[-2,-1,0].map(d=>shiftMonth(month,d)).filter(m=>transactions.some(t=>t.month===m&&t.kind==='expense'));
  const totals=new Map();
  for(const t of transactions)if(months.includes(t.month)&&t.kind==='expense')totals.set(t.category,(totals.get(t.category)||0)+t.amount);
  return {months,groups:new Map([...totals].map(([k,v])=>[k,Math.ceil(v/(months.length||1))]))};
}
export function outlook(f,transactions,month,baseline) {
  const observed=summary(forMonth(transactions,month));
  const expected=new Map(baseline.groups);
  for(const b of f.budgets)expected.set(b.category,b.amount);
  // Budget/category baseline includes installments: use the greater amount rather than adding them twice.
  for(const [cat,amount] of observed.groups)expected.set(cat,Math.max(expected.get(cat)||0,amount));
  const spending=[...expected.values()].reduce((a,b)=>a+b,0);
  const income=incomeFor(f,month);
  const committed=(f.contributions||[]).filter(c=>c.month===month).reduce((s,c)=>s+c.amount,0);
  return {month,income,spending,buffer:f.buffer,committed,available:Math.max(0,income-spending-f.buffer-committed),balance:income-spending-f.buffer-committed,observedIncome:observed.income,groups:expected};
}
export function buildPlan(f,transactions,start,horizon=120) {
  const baseline=spendingBaseline(transactions,start);
  const goals=[...f.goals].sort((a,b)=>a.priority-b.priority||a.deadline.localeCompare(b.deadline)||a.id.localeCompare(b.id));
  const left=new Map(goals.map(g=>[g.id,Math.max(0,g.target-g.saved)]));
  const completion=new Map(goals.filter(g=>g.saved>=g.target).map(g=>[g.id,start]));
  const schedule=[];
  for(let n=0;n<horizon;n++) {
    const month=shiftMonth(start,n),o=outlook(f,transactions,month,baseline);let available=o.available;
    const allocations=[];
    for(const g of goals) {
      const remaining=left.get(g.id),months=Math.max(1,monthDiff(month,g.deadline)+1);
      const required=Math.ceil(remaining/months),amount=Math.min(available,required);
      available-=amount;left.set(g.id,remaining-amount);
      if(remaining>0&&remaining===amount)completion.set(g.id,month);
      allocations.push({id:g.id,required,amount,remaining:remaining-amount});
    }
    schedule.push({...o,allocations,unallocated:available});
  }
  const current=schedule[0];
  const targets=goals.map(g=>{const a=current.allocations.find(a=>a.id===g.id);const complete=completion.get(g.id)||null;return {...g,required:a.required,allocation:a.amount,gap:a.required-a.amount,completion:complete,onTime:g.saved>=g.target||!!complete&&complete<=g.deadline};});
  return {baseline,schedule,targets,current,required:targets.reduce((a,g)=>a+g.required,0),allocated:targets.reduce((a,g)=>a+g.allocation,0)};
}
export function suggestions(transactions,month) {
  const baseline=spendingBaseline(transactions,month);const groups=new Map();
  const flexible=new Map([['Delivery',.25],['Restaurantes',.2],['Assinaturas',.2],['Compras online',.15],['Vestuário',.15],['Entretenimento',.2]]);
  for(const t of transactions)if(t.kind==='expense'&&baseline.months.includes(t.month)&&flexible.has(t.subcategory)&&t.total===1)groups.set(t.subcategory,(groups.get(t.subcategory)||0)+t.amount);
  return [...groups].map(([name,total])=>{const average=Math.ceil(total/(baseline.months.length||1));return {name,average,percent:Math.round(flexible.get(name)*100),saving:Math.floor(average*flexible.get(name))};}).sort((a,b)=>b.saving-a.saving);
}
export function alertsFor(f,transactions,month) {
  const plan=buildPlan(f,transactions,month),alerts=[];
  if(!f.incomes.length)alerts.push({tone:'info',title:'Informe sua renda líquida',text:'Cadastre salário e outras rendas para calcular quanto cabe nas suas metas.'});
  for(const b of f.budgets) {
    const actual=summary(forMonth(transactions,month)).groups.find(([cat])=>cat===b.category)?.[1]||0;
    if(actual>0&&(b.amount===0||actual>=b.amount*.8))alerts.push({tone:actual>b.amount?'danger':'warning',title:`${b.category}: ${actual>b.amount?'orçamento ultrapassado':'atenção ao limite'}`,text:`${money(actual)} em compras e parcelas previstas, de ${money(b.amount)} planejados.`});
  }
  if(plan.current.balance<0)alerts.push({tone:'danger',title:'O mês não fecha no planejamento',text:`Faltam ${money(-plan.current.balance)} para cobrir despesas estimadas e margem de segurança, antes das metas.`});
  for(const g of plan.targets)if(!g.onTime)alerts.push({tone:'warning',title:`${g.name}: prazo precisa de ajuste`,text:`Aporte sugerido agora: ${money(g.allocation)} de ${money(g.required)} necessários. ${g.completion?`Conclusão estimada em ${g.completion.split('-').reverse().join('/')}.`:'Sem conclusão estimada nos próximos 120 meses com este cenário.'}`});
  const reviews=transactions.filter(t=>t.month===month&&t.review).length;
  if(reviews)alerts.push({tone:'info',title:`${reviews} lançamento(s) para conferir`,text:'A classificação e o sinal de entrada/saída podem alterar seu orçamento.'});
  if(!transactions.some(t=>t.month===month))alerts.push({tone:'info',title:'Ainda sem movimentações neste mês',text:'As projeções não substituem seu extrato. Importe os documentos para acompanhar os gastos reais.'});
  return alerts;
}
