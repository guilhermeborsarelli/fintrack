export const emptyFinance=()=>({incomes:[],budgets:[],goals:[],contributions:[],buffer:0});
const monthPattern=/^\d{4}-(0[1-9]|1[0-2])$/;
const cash=n=>Number.isSafeInteger(n)&&n>=0&&n<=100_000_000_000;
export function validateFinance(f) {
  if(!f||!['incomes','budgets','goals'].every(k=>Array.isArray(f[k])&&f[k].length<=1000)||!cash(f.buffer)) throw new Error('Planejamento inválido no backup.');
  if(f.contributions===undefined)f.contributions=[];
  if(!Array.isArray(f.contributions)||f.contributions.length>100000)throw new Error('Aportes inválidos.');
  for(const c of f.contributions)if(typeof c.id!=='string'||typeof c.goalId!=='string'||!monthPattern.test(c.month)||!cash(c.amount)||c.amount===0)throw new Error('Aporte inválido.');
  const ids=new Set();
  for(const item of [...f.incomes,...f.budgets,...f.goals,...f.contributions]) {
    if(typeof item.id!=='string'||ids.has(item.id))throw new Error('Identificador de planejamento inválido.');ids.add(item.id);
  }
  for(const i of f.incomes) if(typeof i.name!=='string'||!i.name.trim()||i.name.length>100||!cash(i.amount)||!monthPattern.test(i.start)||!['monthly','once'].includes(i.frequency)||(i.end&&(!monthPattern.test(i.end)||i.end<i.start)))throw new Error('Renda inválida no backup.');
  for(const i of f.incomes)if(i.tax){
    const t=i.tax;
    if(!['clt','pf','mei','simples','pj_other'].includes(t.regime)||!['gross','inss','ir','iss','das','other','deductions','net'].every(k=>cash(t[k]))||t.deductions!==t.inss+t.ir+t.iss+t.das+t.other||t.net!==t.gross-t.deductions||i.amount!==t.net)throw new Error('Memória de descontos da renda inválida.');
    if(t.calculationMode==='automatic'&&(!t.inputs||t.inputs.regime!==t.regime||t.rulesVersion!=='br-2026.1'))throw new Error('Perfil fiscal automático inválido.');
  }
  if(f.taxReserveEnabled!==undefined&&typeof f.taxReserveEnabled!=='boolean')throw new Error('Configuração de reserva fiscal inválida.');
  const cats=new Set();
  for(const b of f.budgets) {if(typeof b.category!=='string'||!b.category.trim()||b.category.length>80||cats.has(b.category)||!cash(b.amount))throw new Error('Orçamento inválido no backup.');cats.add(b.category);}
  for(const g of f.goals) if(typeof g.name!=='string'||!g.name.trim()||g.name.length>100||!cash(g.target)||g.target===0||!cash(g.saved)||!monthPattern.test(g.deadline)||![1,2,3].includes(g.priority))throw new Error('Meta inválida no backup.');
  return f;
}
