# Meu Bolso · Fintrack

Aplicativo de finanças pessoais em português para navegador, com interface para iPhone e computador. Organiza gastos de diferentes bancos, renda líquida, orçamentos e projetos futuros. Dados ficam no aparelho: não há backend, conta, sincronização nem conexão com APIs bancárias ou de IA.

## Executar e validar

Requer Node.js 22.12+ (validado em Node 24) e npm.

```sh
cd /workspace/fintrack
npm ci
npm run dev
```

O servidor usa a porta 5173. `npm run build` gera `dist`, publicável em hospedagem estática HTTPS. `npm run preview` permite conferir o build local. O projeto não foi publicado nem enviado ao GitHub automaticamente.

```sh
npm test           # lógica financeira, importadores e migração de backups
npm run build
npm run test:e2e   # fluxos reais no Chromium
```

O Playwright inicia/reutiliza o servidor. Usa `/usr/bin/chromium` quando disponível; em outra máquina, instale com `npx playwright install chromium`. Os PDFs em `tests/fixtures` são fictícios, gerados com ReportLab e protegidos com pypdf AES-256; a senha do fixture é `senha-teste`.

## Importação de bancos

Use **Importar arquivo**, selecione o tipo de documento e identifique banco e conta/cartão. O seletor inclui C6, Nubank, Itaú, Banco do Brasil, Bradesco, Santander, Caixa, Inter, BTG Pactual, Sicoob, Sicredi, Mercado Pago, PicPay, PagBank, Neon e Outro banco. Há detecção textual quando o documento contém evidência da instituição. **Uma instituição aparecer na lista não garante compatibilidade com todos os seus layouts de PDF.**

Formatos:

- **PDF com texto**, inclusive protegido por senha: desbloqueado com PDF.js no próprio aparelho. Senhas, arquivos originais e texto extraído não são persistidos. Reconhece datas numéricas, ISO e abreviações brasileiras, descrição, valor com sinal/D/C e parcelas `03/10` ou `3 de 10`. Uma continuação de descrição na linha seguinte pode ser reunida. Em extratos com dois valores, usa o primeiro e exige conferência para distinguir lançamento de saldo.
- **CSV** separado por vírgula ou ponto e vírgula, com aspas: cabeçalhos Data/Date, Descrição/Histórico/Title/Description e Valor/Amount, ou colunas Débito e Crédito. Aceita formatos monetários brasileiro e internacional e datas ISO ou brasileiras. Arquivos UTF-8 e Windows-1252 são decodificados localmente.
- **OFX** SGML/XML: lê transações, datas, valores, NAME/MEMO e FITID. O tipo conta/cartão é inferido de CCSTMTRS no fluxo de importação. O sinal OFX negativo é débito; em cartão ele é uma compra. FITID ajuda a deduplicar arquivos da mesma conta.

Para extratos PDF/CSV de coluna única, escolha a convenção de sinais. Marcadores D/C, colunas explícitas e padrão OFX prevalecem. **Confira receitas, saídas e total com o documento na prévia.** Linhas inválidas são reportadas. PDFs digitalizados não têm OCR. Arquivos podem ter até 25 MB e PDFs até 150 páginas.

Use nomes distintos para diferentes contas/cartões do mesmo banco. A identidade de importação e o vínculo das parcelas incluem banco e conta para não fundir compras legítimas de origens diferentes. Reimportar o mesmo arquivo não duplica lançamentos; compras iguais dentro do próprio arquivo são preservadas. Imports antigos sem banco/conta continuam associados a C6/Principal. Não há reconciliação automática garantida entre arquivos de formatos diferentes ou documentos parcialmente sobrepostos.

Nenhuma fatura real de todos esses bancos foi validada. Os testes usam layouts sintéticos. PDFs podem ter colunas extras, descrições quebradas e formatos diferentes dos suportados; será necessário validar amostras e adaptar o parser. Não há conexão por Open Finance nem leitura automática do app do banco.

## Gastos, categorias e parcelas

A classificação é feita por regras de estabelecimentos e correções aprendidas por descrição exata, com categorias e subcategorias personalizadas. Leituras ambíguas ficam para conferir; datas, valores, tipo e classificação podem ser editados.

Pagamentos de fatura e transferências identificados ficam fora dos gastos e gráficos. Em extrato, “pagamento recebido” isolado não é considerado pagamento de cartão: é necessário contexto de fatura/cartão. PIX ambíguo exige conferência para identificar transferências próprias.

Cada parcela conta somente pelo valor mensal no mês da fatura selecionado. Ex.: parcela 3/10 de R$ 100 na fatura de novembro = R$ 100 em novembro + sete parcelas futuras. A data original é preservada. A cobrança importada substitui a previsão correspondente, usando banco, conta, descrição, data original, total de parcelas e início estimado do parcelamento. Divergências de descrição/data podem exigir ajuste manual. Estornos reduzem o total líquido; percentuais por categoria mostram compras brutas.

## Planejamento

Na aba **Planejamento**:

1. Em **Salário e rendas**, cadastre valores **líquidos**: salário, aluguel, freelas etc., mensais ou pontuais, com início e fim opcionais. Receitas importadas continuam disponíveis em Análises, mas não são adicionadas novamente à renda planejada.
2. Em **Orçamento**, defina limites mensais por categoria, incluindo contas fixas. Categorias sem limite usam a média dos meses com despesas disponíveis na janela de três meses até a referência selecionada. Histórico parcial pode subestimar despesas; o app informa quantos meses estão disponíveis.
3. Ajuste a **margem de segurança** mensal que deve ficar fora dos aportes.
4. Em **Projetos e metas**, inclua viagem, casamento, reserva ou qualquer projeto com custo, valor já reservado, prazo e prioridade.
5. Veja o **Plano mensal** com renda, despesas, margem, aportes sugeridos e saldo livre dos próximos 12 meses. O motor simula até 120 meses para estimar conclusão das metas.

O cálculo usa o maior valor entre orçamento/histórico por categoria e compras/parcelas conhecidas para cada mês. Parcelas não são adicionadas novamente ao orçamento da mesma categoria. Despesas reais não são reduzidas quando você diminui um limite. Não são projetados inflação, juros, rendimentos ou novas compras não informadas.

O saldo disponível é renda planejada menos despesas estimadas, margem e aportes já registrados naquele mês. Metas de prioridade alta recebem primeiro, com desempate por prazo e identificador. Cada meta pede o saldo que falta dividido pelos meses até o prazo, incluindo o mês selecionado. Quando o valor não cabe, o plano não inventa renda nem usa o mesmo dinheiro em duas metas: mostra a diferença e uma conclusão simulada posterior (ou sem conclusão na janela de 120 meses).

**Aportes sugeridos não movimentam dinheiro.** Registre o que realmente guardou. O registro aumenta o progresso e reduz o saldo disponível daquele mês. É possível desfazer o registro. O valor inicialmente guardado ao criar a meta é tratado como reserva prévia; não o inclua na renda novamente. Excluir uma meta não apaga aportes que já comprometeram dinheiro do mês.

### Sugestões de cortes e alertas

Sugestões usam a média de gastos flexíveis identificados: delivery, restaurantes, assinaturas, compras online, vestuário e entretenimento. Não sugerem cortar saúde/moradia básica e não tratam parcelas existentes como gastos canceláveis. **Simular cortes** mostra novos limites e o impacto na disponibilidade e nas metas; aplicar altera apenas o orçamento, sem reduzir gastos reais ou executar cancelamentos.

A aba **Alertas** aponta limites a partir de 80%, estouros, déficit, projetos fora do prazo, falta de renda/movimentações e lançamentos pendentes. São avisos **dentro do app**, atualizados ao abri-lo/alterar dados. Não há notificações push ou execução em segundo plano.

## Dados, backup e iPhone

Apenas lançamentos, regras e planejamento ficam no localStorage. PDFs e senhas não são guardados. Em **Dados e backup**, exporte JSON regularmente: limpar o armazenamento do navegador pode apagar os dados. O backup inclui rendas, orçamentos, metas e aportes; a restauração substitui o conteúdo atual. Backups da versão anterior migram com planejamento vazio. CSV exporta os lançamentos do mês para planilhas.

A demonstração usa dados fictícios separados; edições não são permitidas nela. No iPhone, abra a hospedagem HTTPS no Safari → Compartilhar → Adicionar à Tela de Início. Não há garantia de funcionamento offline, service worker ou compartilhamento entre aparelhos.

## Possíveis próximas etapas

- Reserva de emergência com alvo baseado nas despesas essenciais.
- Simulador do impacto de uma nova compra parcelada antes de assumir a dívida.
- Provisão mensal para IPVA, IPTU, seguros e outras despesas anuais.
- Acompanhamento de assinaturas e reajustes recorrentes.
- Limite diário de gastos flexíveis, considerando dias restantes no mês.
- Metas compartilhadas e sincronização, com backend e permissões próprios.
- Open Finance por integração autorizada, como etapa separada da importação manual.
