// Monetary values in cents. This is a versioned rules snapshot, never a live scrape.
export const RULES_2026=Object.freeze({
 id:'br-2026.1',validFrom:'2026-01',validTo:'2026-12',minimum:162100,ceiling:847555,
 inss:[[162100,750],[290284,900],[435427,1200],[847555,1400]],
 ir:[[242880,0,0],[282665,750,18216],[375105,1500,39416],[466468,2250,67549],[Infinity,2750,90873]],
 dependent:18959,simplified:60720,fullExemption:500000,reductionLimit:735000,
 reductionConstant:97862,reductionRate:0.133145,
 sources:[
 {title:'Tabela INSS',url:'https://www.gov.br/inss/pt-br/direitos-e-deveres/inscricao-e-contribuicao/tabela-de-contribuicao-mensal'},
 {title:'Receita Federal — tabelas 2026',url:'https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026'},
 {title:'Lei 15.270/2025 — redução do IR',url:'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15270.htm'},
 {title:'Lei Complementar 123 — Simples/MEI',url:'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm'}
 ],
 verification:'Parâmetros confrontados com implementações abertas e aritmética independente; consulta direta às fontes governamentais bloqueada nesta sessão. Simulação mensal, não declaração ou guia de recolhimento.'
});
// LC 123, annexes I–V. We deliberately stop before the ISS/ICMS sublimit complexity.
export const SIMPLE_BANDS=[18000000,36000000,72000000,180000000,360000000];
export const SIMPLE_TABLES={
 I:[[400,0],[730,594000],[950,1386000],[1070,2250000],[1430,8730000]],
 II:[[450,0],[780,594000],[1000,1386000],[1120,2250000],[1470,8550000]],
 III:[[600,0],[1120,936000],[1350,1764000],[1600,3564000],[2100,12564000]],
 IV:[[450,0],[900,810000],[1020,1242000],[1400,3978000],[2200,18378000]],
 V:[[1550,0],[1800,450000],[1950,990000],[2050,1710000],[2300,6210000]]
};
