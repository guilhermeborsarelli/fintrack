# Motor mensal de renda líquida — regras br-2026.1

## Estado da verificação

O cálculo é determinístico, versionado e em centavos; não usa respostas de IA para definir tributos. Parâmetros foram confrontados com fontes secundárias abertas e com derivação aritmética independente. A consulta direta às páginas governamentais foi bloqueada pela rede desta sessão. Os links oficiais estão preservados para conferência; isso não foi apresentado como auditoria oficial concluída.

Fontes secundárias consultadas, sem executar seus códigos:

- https://github.com/salgueiroso/impostos-brasil/tree/101142feecb63ecec91ab2d9b03700b1a722092e — recursos e testes de INSS/IRPF.
- https://github.com/Halexandre1/Calculadora_Salario_2026/blob/b3caf66a6a4d6ccda25b77afed2def7526bddaf5/index.html — limites e deduções corroborados.

Outras calculadoras consultadas foram **rejeitadas como referência fiscal**: havia código rotulado “2026” com valores antigos de INSS/IRRF e outra implementação com teto de INSS e deduções inconsistentes. Não foram incorporadas como dependências. Os fatos das tabelas foram implementados separadamente.

Referências primárias para auditoria:

- INSS: https://www.gov.br/inss/pt-br/direitos-e-deveres/inscricao-e-contribuicao/tabela-de-contribuicao-mensal
- IR 2026: https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026
- Reduções e dividendos: Lei 15.270/2025, https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15270.htm
- Simples/MEI: LC 123/2006 e anexos, https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm
- ISS autônomos de São Paulo: Lei municipal 14.864/2008 e enquadramento efetivo no CCM, a confirmar na legislação municipal.

## Tabelas usadas

INSS empregado: até R$ 1.621,00 a 7,5%; faixa até R$ 2.902,84 a 9%; até R$ 4.354,27 a 12%; até R$ 8.475,55 a 14%. Cada percentual incide só na respectiva faixa, com arredondamento do total ao centavo. Teto derivado: R$ 988,09. Demonstrativos de folha podem ter diferenças de centavos conforme regras de arredondamento.

IR mensal: base até R$ 2.428,80 isenta; até R$ 2.826,65, 7,5% menos R$ 182,16; até R$ 3.751,05, 15% menos R$ 394,16; até R$ 4.664,68, 22,5% menos R$ 675,49; acima, 27,5% menos R$ 908,73. Dependente: R$ 189,59/mês. Desconto simplificado: R$ 607,20, alternativo às deduções legais, não cumulativo com elas.

Redução de 2026: imposto mensal zerado para rendimentos tributáveis até R$ 5.000; entre R$ 5.000 e R$ 7.350, redução limitada ao imposto de `978,62 − 0,133145 × rendimento`; acima, sem redução. O rendimento de referência não é confundido com a base após deduções.

Exemplos de referência (salário regular, sem dependentes):

| Bruto | INSS | IR mensal | Líquido antes de benefícios |
|---|---:|---:|---:|
| R$ 5.000,00 | R$ 501,51 | R$ 0,00 | R$ 4.498,49 |
| R$ 6.000,00 | R$ 641,51 | R$ 385,10 | R$ 4.973,39 |
| R$ 10.000,00 | R$ 988,09 | R$ 1.569,55 | R$ 7.442,36 |

Com VT de 1%, o salário bruto de R$ 5.000 resulta em R$ 4.448,49. FGTS não é subtraído do empregado.

## Cenários implementados

### CLT regular

- INSS progressivo e teto; deduções legais ou simplificado, conforme maior dedução; dependentes e pensão judicial.
- VT percentual até 6%, com salário-base e limite pelo custo efetivo do benefício opcionais. Outros descontos fixos/percentuais não reduzem indevidamente a base de IR.
- FGTS apenas informativo como custo do empregador.
- Vínculos automáticos cadastrados são processados de forma estável, com empregados primeiro. Remuneração externa só é usada quando informada; não duplicar o que já foi cadastrado automaticamente no app.
- Não inclui 13º, PLR, férias, rescisão, salário-família ou benefícios especiais. Aportes não são declaração anual.

### Autônomo PF — São Paulo capital como referência

- Recebimentos de PF/exterior: cenário de Carnê-Leão, contribuição normal de 20% sobre base escolhida/mínimo/teto ou simplificada de 11% do mínimo, quando elegível.
- Recebimentos de PJ: cenário de retenção em RPA, INSS de 11% respeitando remuneração já considerada no teto; IR da fonte. Vários pagadores e retenções efetivas podem divergir da simulação agregada.
- Despesas documentadas de livro-caixa e deduções declaradas no cenário; não presume dedutibilidade de qualquer despesa.
- ISS: exige confirmação do enquadramento na isenção de autônomo PF cadastrado em SP, alíquota da atividade ou valor efetivamente apurado. Não inventa uma alíquota municipal única.
- Recebimentos mistos são cadastrados em fontes separadas. Complementação abaixo do mínimo previdenciário, rendimentos especiais e ajuste anual exigem apuração própria.

### MEI comum

- DAS: 5% do mínimo para INSS + R$ 1 de ICMS e/ou R$ 5 de ISS, conforme atividade. Em 2026: comércio R$ 82,05; serviços R$ 86,05; ambos R$ 87,05.
- Limite anual comum R$ 81 mil, proporcional aos meses da abertura até dezembro. A receita acumulada deve incluir o mês. Caminhoneiro e desenquadramento são rejeitados pelo cenário comum.
- Até um empregado; folha bruta, CPP de 3%, FGTS de 8% e outros custos declarados são considerados no caixa. Obrigações trabalhistas especiais e provisões anuais não são inferidas da quantidade de funcionários.
- Não trata faturamento como renda pessoal automaticamente: subtrai custos, folha, DAS e reserva da empresa. Sem escrituração, estima parcela de lucro isenta presumida (8% comércio/indústria; 32% serviços; receita segregada nas atividades mistas) e reserva mensal de IR sobre a parcela potencialmente tributável.
- Essa reserva não equivale ao ajuste anual do titular. Com receita zero ou custos superiores à receita, o app mostra déficit e não inventa renda positiva para o planejamento.

### Simples Nacional

- Anexos I–V até o sublimite de R$ 3,6 milhões; DAS por `(RBT12 × alíquota nominal − parcela a deduzir) / RBT12 × receita do mês`.
- Serviços sujeitos a fator R: III se folha/base >=28%, V caso contrário. A janela de folha e receita é a mesma, inclusive início de atividade. Quantidade de funcionários não substitui folha efetivamente paga.
- Empresa nova: anualização das receitas dos meses anteriores; no primeiro mês usa receita do mês ×12. Fator R usa folha e receita da janela de início, não folha mensal dividida por receita anual.
- Sem escrituração, o limite presumido de lucro isento é reduzido pelo IRPJ incluído no DAS (LC 123, art. 14). Esse cenário exige o componente de IRPJ do extrato do PGDAS; o app não inventa esse valor nem confunde o DAS inteiro com IRPJ.
- Pró-labore: INSS de 11% e IR do cenário. Distribuição de lucro não é pró-labore. Folha dos empregados, FGTS e despesas da empresa não são somadas novamente ao líquido pessoal.
- Anexo IV: CPP de 20% sobre folha/pró-labore, mais RAT/FAP sobre empregados, fora do DAS; o usuário confirma RAT/FAP. Encargos e outras particularidades precisam corresponder à empresa real.
- Lucros mensais do cenário acima de R$ 50 mil incluem retenção de 10%. Transição de lucros antigos e imposto mínimo anual de altas rendas não são simulados.
- Receitas mistas de anexos distintos, exportações, monofásicos, substituição tributária, ISS/ICMS fora do DAS e desonerações não têm apuração automática genérica. O cálculo sinaliza limites e admite dados já apurados.

### Lucro Presumido/Real e dados já apurados

Disponíveis como cadastro por descontos já apurados, com indicação explícita. Não há fórmula automática genérica que transforme faturamento em renda líquida desses regimes sem custos, créditos e base fiscal próprios.

## Várias fontes e planejamento

A função `calculateIncomeSet` coordena contribuições automáticas, recalcula os líquidos e apresenta uma **provisão complementar mensal** quando a soma de retenções isoladas é inferior ao cenário conjunto. Dependentes não são multiplicados cegamente no cálculo conjunto. A provisão é reservada por padrão e pode ser desativada; não é uma declaração anual nem certeza de imposto a pagar. Fontes apenas líquidas/manuais não têm base fiscal suficiente para apurar tributo conjunto com exatidão.

Backups antigos preservam seus líquidos e descontos informados; não são reinterpretados silenciosamente como bruto. Perfis automáticos guardam entradas, versão de regras e memória de cálculo. A edição recalcula dados; hipóteses inválidas não são salvas como se fossem líquidas válidas. Projeções após 2026 mantêm o líquido do cenário anterior até atualização de tabelas; a interface não afirma que as alíquotas futuras foram verificadas.

## Validação e limites da afirmação

Os testes cobrem limites de faixas, redução integral/parcial de IR, teto e vínculos concomitantes, VT, dependentes, PF/RPA, MEI, fator R, início de atividade, folha, Anexo IV e retenção sobre lucros. Há testes funcionais da tela a partir apenas do bruto. Esses testes demonstram o comportamento das regras implementadas, não certificação legal universal nem precisão sobre perfis com informações omitidas.
