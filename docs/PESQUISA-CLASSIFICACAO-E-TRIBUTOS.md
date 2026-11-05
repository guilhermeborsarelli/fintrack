# Pesquisa e decisões — 5 de novembro de 2026

## Fontes efetivamente consultadas

1. **Actual Budget, regras**: https://actualbudget.org/docs/budgeting/rules/ — texto consultado no repositório oficial https://github.com/actualbudget/docs/blob/8ad6e1440cb9ff78926f708cdd14d17a62a13792/docs/budgeting/rules/index.md.
   - Aprende regras a partir de classificações e renomeações do usuário.
   - Regras mais específicas prevalecem, há estágios e edição em lote.
   - Pode limpar o nome original antes de aplicar uma categoria por estabelecimento.
2. **Actual Budget, estabelecimentos**: https://github.com/actualbudget/docs/blob/8ad6e1440cb9ff78926f708cdd14d17a62a13792/docs/transactions/payees.md.
   - Correspondência exata, regras de nomes e categoria padrão.
   - União de variações de um mesmo estabelecimento para evitar decisões repetidas.
3. **Plaid, especificação oficial OpenAPI**: https://github.com/plaid/plaid-openapi/blob/master/2020-09-14.yml, schema `PersonalFinanceCategory` (arquivo consultado via raw.githubusercontent.com).
   - Taxonomia em dois níveis e confiança por transação: VERY_HIGH (>98%), HIGH (>90%), MEDIUM, LOW, UNKNOWN.
   - Esses percentuais são definições do produto Plaid, **não desempenho medido do Meu Bolso**, nem garantem 95% de cobertura. Plaid é infraestrutura de enriquecimento, não um app brasileiro equivalente nem uma integração já implementada.

A documentação web de outros produtos e as fontes governamentais não puderam ser consultadas: o proxy retornou `CONNECT tunnel failed: 403 Forbidden`. Não se trata de uma revisão completa do mercado. Não foram inventadas citações, resultados de benchmarks ou garantias de acurácia.

## Aplicação no produto

- Separar taxa de pendências por lançamento de número de decisões: 66 compras do mesmo estabelecimento podem exigir uma classificação em lote, mas continuam sendo 66 pendências até serem resolvidas.
- Usar identidade normalizada, correções aprendidas e regras determinísticas; pagamentos/transferências não são compras.
- Importar MCC de CSV/OFX, quando fornecido, para atribuir categorias pelo ramo bancário. O parser de PDF não fabrica MCC que não existe no documento. O mapa inicial é limitado a códigos conhecidos, não uma taxonomia completa ou certificada pela bandeira.
- Mostrar taxa efetiva de revisão e quantidade de grupos. A meta é <=5%; o software não descarta pendências para aparentar sucesso.
- Conservar dúvidas financeiras (valor, débito/crédito, saldo, transferência própria) mesmo quando há categoria conhecida.
- A pesquisa atual pela Wikipédia é complementar, não um serviço de enriquecimento universal. Empresas locais e descrições truncadas frequentemente exigem outra fonte.

## O que falta para sustentar 3–5% com evidência

1. Conjunto representativo de transações reais, com categorias confirmadas e dados pessoais removidos; separar conjunto de ajuste e avaliação para evitar memorização.
2. Medir cobertura automática, precisão nas decisões automáticas, taxa de revisão por lançamento, decisões por grupo e erros financeiros (duplicatas, pagamentos, parcelas).
3. Escolher e contratar/integrar, quando necessário, uma fonte apropriada de identificação de estabelecimentos/CNPJ/CNAE ou enriquecimento bancário; avaliar cobertura brasileira, LGPD, latência, custo e rastreabilidade. Nome de estabelecimento, valor e MCC não são sempre suficientes para inferir o produto comprado.
4. Calibrar confiança com resultados reais; não converter rótulos heurísticos em probabilidades inventadas.
5. Não atingir cobertura à custa de erros: Mercado Pago, PIX e lojas com múltiplos ramos exigem contexto adicional.

## Rendas e tributos — estado e escopo

A aba Rendas permite CLT, autônomo PF (clientes PF, PJ/RPA ou ambos), MEI e PJ Simples. O planejamento recebe o líquido calculado por **bruto menos valores de descontos/custos informados**, sem dupla contagem com o extrato. Isso não é cálculo automático da tributação.

O usuário informou pessoa física e São Paulo capital como primeiro município. Para uma apuração automática confiável, ainda é necessário confirmar:

- INSS progressivo CLT, teto e vínculos concomitantes, dependentes, pensão e descontos de folha;
- tabela IRRF, desconto simplificado versus deduções legais, reduções vigentes na competência, rendimentos de múltiplas fontes e ajuste anual;
- autônomo PF: contratante PF/PJ, retenções, contribuição previdenciária efetiva, livro-caixa/deduções admitidas, Carnê-Leão e ISS municipal/condição de profissional autônomo;
- MEI: ocupação, elegibilidade, DAS conforme atividade, faturamento e limite, parcela tributável/isenta dos rendimentos da pessoa física;
- Simples: atividade, anexo, RBT12, fator R quando aplicável, faixa e parcela a deduzir, pró-labore/INSS e distribuição de lucros. Faturamento da PJ não é automaticamente renda disponível da pessoa física.

Não foi inserida uma tabela fiscal de memória nem apresentada subtração de descontos como apuração exata. O cálculo anual de CLT + autônomo não é a simples soma dos impostos isolados mensais.

### Fontes cuja consulta permanece bloqueada

- Receita Federal, tabelas: https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026
- Portal da legislação federal: https://www.planalto.gov.br/
- Legislação municipal: https://legislacao.prefeitura.sp.gov.br/
- Prefeitura de São Paulo: https://capital.sp.gov.br/

Domínios foram acrescentados ao rascunho de rede, preservando os anteriores. É necessário revisar, salvar e publicar o ambiente para aplicar o rascunho. Salvar o rascunho não libera a rede da instância atual automaticamente. Até lá, a pesquisa fiscal e o cálculo automático de alíquotas permanecem bloqueados.
