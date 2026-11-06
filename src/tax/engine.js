import {RULES_2026 as R,SIMPLE_BANDS,SIMPLE_TABLES} from './rules-2026.js';
export {RULES_2026} from './rules-2026.js';
const cents=(n,name)=>{if(!Number.isSafeInteger(n)||n<0||n>100_000_000_000)throw new Error(`${name}: informe um valor válido.`);return n;};
const val=(i,k)=>cents(i[k]??0,k);
const percent=(n,name,max=100)=>{if(typeof n!=='number'||!Number.isFinite(n)||n<0||n>max)throw new Error(`${name}: percentual inválido.`);return n;};
const count=(n,name,max=100)=>{if(!Number.isInteger(n)||n<0||n>max)throw new Error(`${name}: quantidade inválida.`);return n;};
const rate=(n,bps)=>Math.round(n*bps/10000);
export function inssEmployee(gross){
 cents(gross,'Salário');const base=Math.min(gross,R.ceiling);let previous=0,numerator=0;const bands=[];
 for(const [ceiling,bps] of R.inss){const amount=Math.max(0,Math.min(base,ceiling)-previous);if(amount){numerator+=amount*bps;bands.push({base:amount,rate:bps/100,amount:rate(amount,bps)});}previous=ceiling;}
 return {base,total:Math.round(numerator/10000),bands};
}
export function incomeTax(gross,{inss=0,dependents=0,pension=0,book=0}={}){
 cents(gross,'Rendimento');[inss,pension,book].forEach(n=>cents(n,'Dedução'));count(dependents,'Dependentes',30);
 const legal=inss+dependents*R.dependent+pension+book,deduction=Math.max(legal,R.simplified),base=Math.max(0,gross-deduction);
 const [,bps,subtract]=R.ir.find(([limit])=>base<=limit);const before=Math.max(0,rate(base,bps)-subtract);
 const reduction=gross<=R.fullExemption?before:gross<=R.reductionLimit?Math.min(before,Math.max(0,Math.round(R.reductionConstant-R.reductionRate*gross))):0;
 return {base,legal,simplified:R.simplified,deduction,deductionMethod:legal>=R.simplified?'Deduções legais':'Desconto simplificado',marginalRate:bps/100,before,reduction,total:before-reduction,effectiveRate:gross?(before-reduction)/gross*100:0};
}
function finish(regime,gross,parts,details,inputs,warnings=[]){
 const {inss=0,ir=0,iss=0,das=0,other=0}=parts;const deductions=inss+ir+iss+das+other;
 if(deductions>gross)throw new Error('Despesas, tributos e reservas superam o bruto. Ajuste o cenário antes de usar esta renda no orçamento.');
 return {schema:2,calculationMode:'automatic',rulesVersion:R.id,competence:inputs.competence,regime,gross,inss,ir,iss,das,other,deductions,net:gross-deductions,inputs:{...inputs},details,warnings};
}
export function calculateIncome(i,context={}){
 if(!/^2026-(0[1-9]|1[0-2])$/.test(i.competence||''))throw new Error('As tabelas automáticas disponíveis são de 2026. Para outra competência, use líquido conhecido até atualizar as tabelas.');
 const gross=val(i,'gross'),dependents=count(i.dependents??0,'Dependentes',30),pension=val(i,'pension'),fixed=val(i,'fixedDiscount');
 const external=val(i,'otherContributionBase');
 const otherBase=Math.min(R.ceiling,external+(context.contributionBase||0));
 const commonWarnings=['Simulação mensal de rendimentos regulares. Não inclui 13º, férias, PLR, rescisão nem ajuste anual.'];
 if(i.regime==='clt'){
  const otherWages=Math.min(R.ceiling,external+(context.employeeGross||0));
  const payroll=inssEmployee(gross+otherWages),previous=inssEmployee(otherWages),inss=payroll.total-previous.total;
  const ir=incomeTax(gross,{inss,dependents,pension});const vtPercent=percent(i.transportPercent??0,'Vale-transporte',6);
  const transportBase=i.transportBase===undefined?gross:val(i,'transportBase');let transport=Math.round(transportBase*vtPercent/100);
  if(i.transportCost!==undefined)transport=Math.min(transport,val(i,'transportCost'));
  const extra=Math.round(gross*percent(i.discountPercent??0,'Outros descontos percentuais')/100);
  return finish('clt',gross,{inss,ir:ir.total,other:pension+transport+fixed+extra},{contributionBase:Math.max(0,Math.min(gross,R.ceiling-otherWages)),employeeGross:gross,personalGross:gross,personalInss:inss,pension,dependents,inssBands:payroll.bands,ir,transport,extra,fgtsEmployer:rate(gross,800)},i,commonWarnings);
 }
 if(i.regime==='pf'){
  if(!['pf','pj'].includes(i.payer))throw new Error('Separe recebimentos de pessoas físicas/exterior e de pessoas jurídicas em fontes distintas.');
  const book=val(i,'bookExpenses');const available=Math.max(0,R.ceiling-otherBase);let contributionBase=0,inss=0;
  if(gross&&available){
   if(i.payer==='pj'){contributionBase=Math.min(gross,available);inss=rate(contributionBase,1100);}
   else if(i.inssPlan==='simplified'){
    if(otherBase)throw new Error('Plano simplificado de 11% não é combinado automaticamente com outros vínculos. Use plano normal ou os descontos efetivamente apurados.');
    contributionBase=R.minimum;inss=rate(R.minimum,1100);
   }else{
    const chosen=i.contributionBase===undefined||i.contributionBase===0?Math.max(R.minimum,gross):val(i,'contributionBase');
    if(chosen<R.minimum)throw new Error('No plano normal, a base escolhida não pode ser inferior ao salário mínimo.');
    contributionBase=Math.min(chosen,available);inss=rate(contributionBase,2000);
   }
  }
  let iss;
  if(i.issMode==='sp_exempt'&&i.spCcmConfirmed===true)iss=0;
  else if(i.issMode==='rate')iss=Math.round(gross*percent(i.issPercent??0,'ISS',5)/100);
  else if(i.issMode==='amount')iss=val(i,'issAmount');
  else throw new Error('Confirme seu enquadramento no ISS: cadastro de autônomo PF de São Paulo, alíquota da atividade ou valor apurado.');
  const ir=incomeTax(gross,{inss,dependents,pension,book:i.payer==='pf'?book:0});
  return finish('pf',gross,{inss,ir:ir.total,iss,other:book+pension+fixed},{contributionBase,personalGross:gross,personalInss:inss,pension,dependents,ir,book,collection:i.payer==='pf'?'Provisão de Carnê-Leão':'Provisão de retenção em RPA'},i,[...commonWarnings,'Recebimentos de vários pagadores podem exigir ajuste e recolhimento complementar. Despesas de livro-caixa pressupõem documentação e dedutibilidade legal.','ISS de autônomo PF cadastrado em São Paulo depende do efetivo enquadramento; a opção de isenção deve ser confirmada pelo usuário.']);
 }
 if(!['mei','simples'].includes(i.regime))throw new Error('Regime automático não suportado.');
 const employees=count(i.employees??0,'Funcionários',10000),businessCosts=val(i,'businessCosts'),payroll=val(i,'payrollMonthly'),retained=val(i,'retained');
 if(employees>0&&payroll===0)throw new Error('Informe a folha bruta dos funcionários para incluir o custo no caixa.');
 if(employees===0&&payroll>0)throw new Error('A folha foi informada, mas a quantidade de funcionários está zerada.');
 const payrollExtras=val(i,'payrollExtras');let das=0,companyCpp=0,fgts=rate(payroll,800),annex=null,effectiveRate=0,factorR=null,prolabore=val(i,'prolabore'),meiInss=0;
 if(i.regime==='mei'){
  if(employees>1)throw new Error('O cenário MEI comum suporta no máximo um empregado.');
  if(!['commerce','services','mixed'].includes(i.activity))throw new Error('Escolha comércio, serviços ou ambos. MEI caminhoneiro não está incluído neste cálculo.');
  if(val(i,'annualRevenue')<gross)throw new Error('O faturamento anual acumulado deve incluir a receita deste mês.');
  const months=count(i.monthsInYear??12,'Meses de atividade no ano',12);if(!months)throw new Error('Informe pelo menos um mês de atividade no ano.');
  if(val(i,'annualRevenue')>Math.round(8100000*months/12))throw new Error('O faturamento informado supera o limite proporcional do MEI comum. É necessário avaliar desenquadramento.');
  meiInss=rate(R.minimum,500);das=meiInss+(i.activity!=='services'?100:0)+(i.activity!=='commerce'?500:0);
  companyCpp=rate(payroll,300);prolabore=0;
 }else{
  const activities={commerce:'I',industry:'II',serviceIII:'III',serviceIV:'IV',factorR:'V'};
  annex=activities[i.activity];if(!annex)throw new Error('Selecione a atividade/anexo confirmado da empresa. Não inferimos o anexo apenas pelo número de funcionários.');
  let rbt12=val(i,'rbt12');
  if(i.newBusiness===true){const pastMonths=count(i.pastMonths??0,'Meses completos anteriores',11);rbt12=pastMonths?Math.round(val(i,'pastRevenue')/pastMonths*12):gross*12;}
  if(rbt12>360000000)throw new Error('RBT12 acima de R$ 3,6 milhões exige regras de sublimite e ISS/ICMS fora do DAS; use apuração específica.');
  if(i.activity==='factorR'){
   if(i.folha12===undefined)throw new Error('Informe a folha dos últimos 12 meses para calcular o fator R.');
   const factorBase=i.newBusiness===true?((i.pastMonths||0)>0?val(i,'pastRevenue'):gross):rbt12;
   factorR=factorBase?val(i,'folha12')/factorBase:0;annex=val(i,'folha12')*100>=factorBase*28&&factorBase>0?'III':'V';
  }
  const band=Math.max(0,SIMPLE_BANDS.findIndex(limit=>rbt12<=limit));const [bps,subtract]=SIMPLE_TABLES[annex][band];
  effectiveRate=rbt12?Math.max(0,(rbt12*bps/10000-subtract)/rbt12):bps/10000;das=Math.round(gross*effectiveRate);
  if(annex==='IV'){
   const rat=percent(i.ratPercent??1,'RAT',3),fap=i.fap??1;if(![1,2,3].includes(rat))throw new Error('RAT deve ser 1%, 2% ou 3%, conforme atividade.');if(typeof fap!=='number'||fap<0.5||fap>2)throw new Error('FAP deve estar entre 0,5 e 2.');
   companyCpp=rate(payroll+prolabore,2000)+Math.round(payroll*rat*fap/100);
  }
 }
 const companyBeforeOwner=gross-das-businessCosts-payroll-payrollExtras-companyCpp-fgts-retained;
 if(prolabore>companyBeforeOwner)throw new Error('O pró-labore não cabe no caixa após custos, folha, tributos e reserva da empresa.');
 const profit=Math.max(0,companyBeforeOwner-prolabore);
 const ownerBase=Math.min(prolabore,Math.max(0,R.ceiling-otherBase)),inss=i.regime==='simples'?rate(ownerBase,1100):0;
 // Without accounting-backed profit, reserve personal IR on the portion above the presumed exempt fraction.
 const exemptRate=i.activity==='commerce'||i.activity==='industry'?8:32;
 const services=i.regime==='mei'&&i.activity==='mixed'?val(i,'serviceRevenue'):0;
 if(services>gross)throw new Error('A receita de serviços não pode superar o faturamento total.');
 const presumed=i.regime==='mei'&&i.activity==='mixed'?rate(services,3200)+rate(gross-services,800):Math.floor(gross*exemptRate/100);
 // LC 123 art. 14: without accounting, subtract the IRPJ included in the DAS
 // from the presumed exempt amount. Do not guess this component from total DAS.
 let irpjInDas=0;
 if(i.regime==='simples'&&i.accounting!==true){
  if(i.irpjInDas===undefined)throw new Error('Sem escrituração contábil, informe a parcela de IRPJ do DAS no extrato do PGDAS para estimar o lucro isento.');
  irpjInDas=val(i,'irpjInDas');if(irpjInDas>das)throw new Error('A parcela de IRPJ não pode superar o DAS calculado.');
 }
 const exempt=i.accounting===true?profit:Math.min(profit,Math.max(0,presumed-irpjInDas));
 const taxableProfit=Math.max(0,profit-exempt);const ir=incomeTax(prolabore+taxableProfit,{inss:i.regime==='mei'?meiInss:inss,dependents,pension});
 const dividendWithholding=profit>5000000?rate(profit,1000):0;
 const other=businessCosts+payroll+payrollExtras+companyCpp+fgts+retained+pension+fixed;
 return finish(i.regime,gross,{inss,ir:ir.total+dividendWithholding,das,other},{dividendWithholding,contributionBase:ownerBase,personalGross:prolabore+taxableProfit,personalInss:i.regime==='mei'?meiInss:inss,pension,dependents,ir,annex,effectiveRate:effectiveRate*100,factorR,companyCpp,fgts,payroll,prolabore,profit,exemptProfit:exempt,taxableProfit,ownerNetProlabore:Math.max(0,prolabore-inss-incomeTax(prolabore,{inss,dependents,pension}).total)},i,[...commonWarnings,'Faturamento da empresa não é salário do sócio. O líquido abaixo desconta custos, folha, tributos, reservas da empresa e provisão pessoal de IR.','Distribuições mensais acima de R$ 50 mil por esta empresa incluem retenção de 10% sobre os lucros do cenário. Exceções e regras de transição de lucros antigos não foram simuladas.',
 'A provisão pessoal sobre lucro sem escrituração não é a apuração anual do IRPF. Isenção de lucro depende de escrituração e condições legais; tributação mínima de altas rendas não foi simulada.','Receitas mistas de anexos distintos do Simples, atividades especiais, receitas monofásicas, substituição tributária, exportação, retenções e regimes de desoneração exigem apuração específica.']);
}
export function activeIncome(i,month){return i.start<=month&&(!i.end||i.end>=month)&&(i.frequency==='monthly'||i.start===month);}
export function calculateIncomeSet(incomes,month){
 let contributionBase=0,employeeGross=0;const results=new Map(),warnings=[];
 const ordered=incomes.filter(i=>activeIncome(i,month)).map((i,index)=>({i,index})).sort((a,b)=>(a.i.tax?.inputs?.regime==='clt'?0:1)-(b.i.tax?.inputs?.regime==='clt'?0:1)||a.index-b.index);
 for(const {i} of ordered){
  if(i.tax?.calculationMode==='automatic'&&month.startsWith('2026-')){
   try{const result=calculateIncome({...i.tax.inputs,competence:month},{contributionBase,employeeGross});results.set(i.id,result);contributionBase+=result.details.contributionBase||0;employeeGross+=result.details.employeeGross||0;}catch(err){results.set(i.id,{...i.tax,net:i.amount,stale:true});warnings.push(`${i.name}: ${err.message}`);}
  }else{results.set(i.id,{net:i.amount,...i.tax});if(i.tax?.calculationMode==='automatic')warnings.push(`${i.name}: não há tabela automática para ${month}. O líquido salvo é apenas uma referência do cenário anterior.`);}
 }
 const automatic=month.startsWith('2026-')?[...results.values()].filter(r=>r.calculationMode==='automatic'&&!r.stale):[];
 const gross=automatic.reduce((s,r)=>s+(r.details.personalGross||0),0),inss=automatic.reduce((s,r)=>s+(r.details.personalInss||0),0);
 const deps=Math.max(0,...automatic.map(r=>r.details.dependents||0)),pension=automatic.reduce((s,r)=>s+(r.details.pension||0),0);
 const book=automatic.reduce((s,r)=>s+(r.regime==='pf'&&r.inputs.payer==='pf'?r.details.book||0:0),0);
 const retained=automatic.reduce((s,r)=>s+r.ir,0);const combined=automatic.length>1?incomeTax(gross,{inss,dependents:deps,pension,book}).total:retained;
 const complementaryReserve=Math.max(0,combined-retained);
 return {results,total:[...results.values()].reduce((s,r)=>s+r.net,0),complementaryReserve,warnings};
}
