# Meu Bolso · Fintrack

Aplicativo de finanças pessoais em português para navegador, com interface para iPhone e computador. Organiza gastos de diferentes bancos, renda líquida, orçamentos e projetos futuros. Os lançamentos, PDFs e cálculos ficam no aparelho, sem sincronização bancária. Há um servidor opcional de pesquisa de estabelecimentos, com API de busca e análise contextual opcional; ele recebe nomes/cidade, nunca PDFs, valores ou dados de conta.

> **Home Tender:** este repositório também publica um app de coquetéis clássicos (lista oficial IBA) em `/drinks/`. Veja docs/HOME-TENDER.md.

## Executar e validar

Requer Node.js 24.5+ (validado em Node 24) e npm. O servidor usa o suporte nativo a proxy HTTPS do Node.

```sh
cd /workspace/fintrack
npm ci
npm run dev
```

O servidor usa a porta 5173. `npm run build` gera `dist`, publicável em hospedagem estática HTTPS. `npm run preview` permite conferir o build local. O código foi enviado ao GitHub para preparar a publicação. O frontend usa GitHub Pages. A API de pesquisa exige hospedagem Node; o GitHub Pages não executa a API. Consulte PUBLICACAO.md e docs/PESQUISA-WEB.md.

```sh
npm test           # lógica financeira, importadores e migração de backups
npm run build
npm run test:server
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

1. Em **Rendas**, informe o bruto e escolha cálculo automático de 2026 para CLT, autônomo PF, MEI ou Simples; ou use líquido/descontos já conhecidos. O formulário calcula o líquido, que alimenta o planejamento. Receitas importadas continuam em Análises e não são somadas novamente.
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

## Atualização de classificação e parcelas

- “Inclusão de Pagamento”, abreviações e outras descrições de pagamento de cartão ficam fora dos gastos. O carregamento reclassifica lançamentos antigos reconhecidos, sem exigir reimportação; correções explicitamente travadas pelo usuário são preservadas.
- Nomes são normalizados para reconhecer intermediadores como `PAG*`/`SUMUP*`. Correções aprendidas resolvem descrições equivalentes. Intermediador sem estabelecimento continua ambíguo. Evidência de classificação não elimina pendências financeiras de saldo, PIX ou valores ambíguos.
- Na prévia há consulta limitada pela Wikipédia. Em Lançamentos, a pesquisa ampliada usa consultas sobre cobrança de cartão/estabelecimento, retorna fontes e hipóteses e pode ser autorizada para próximas importações. Ela exige o servidor e credencial de busca; a versão estática indica quando não está conectada. Citações e CNPJ são verificados pelo serviço antes de permitir aplicação automática. Veja [docs/PESQUISA-WEB.md](docs/PESQUISA-WEB.md).
- Em documentos cujos valores parcelados já são mensais (padrão), não dividimos novamente. A tela mostra a parcela atual e total, como “3 de 10”. Ao importar ou editar, é possível informar explicitamente que o valor é o **custo total da compra**, para dividi-lo pelas parcelas. Restos de centavos são distribuídos nas primeiras parcelas. Essa conversão não é aplicada automaticamente ao histórico, pois não é seguro inferir se um valor antigo é mensal ou total.

## Revisão em lote e aba Rendas

A aba Lançamentos mostra a taxa real de pendências e, em **Para conferir**, agrupa estabelecimentos equivalentes: uma decisão pode classificar várias compras de uma vez. Isso não equivale a atingir automaticamente 95–97% de cobertura. Pendências financeiras exigem confirmação explícita de valores/sentido de movimentação. CSV com `MCC` e OFX com `SIC` usam um mapa inicial de ramos bancários; PDFs sem esse código continuam dependendo de nomes e regras.

A aba **Rendas** oferece:

- **CLT:** INSS progressivo, teto, IR com dedução mais favorável e redução de 2026, dependentes, pensão e VT percentual/custo real. Um salário bruto de R$ 5.000 com VT de 1% resulta em R$ 4.448,49 no cenário regular.
- **Autônomo PF:** cenários separados para PF/exterior e PJ/RPA, contribuição previdenciária, despesas documentadas e situação do ISS em São Paulo.
- **MEI:** DAS fixo por atividade, limite proporcional, custos da empresa e provisão pessoal sobre a parcela de lucro potencialmente tributável.
- **Simples:** anexos I–V dentro do sublimite suportado, fator R, início de atividade, folha, encargos e pró-labore; separa lucro e caixa da empresa do dinheiro do sócio.
- **Várias fontes:** coordenação de contribuições automáticas e provisão complementar mensal de IR, reservada no orçamento por padrão.
- **Descontos já apurados / outros regimes:** opção explícita para casos com dados fiscais próprios. Backups antigos preservam o líquido informado, sem interpretar líquido como bruto.

É uma simulação mensal versionada, não declaração anual nem apuração universal de todo CNPJ. Não gera guias ou recolhimentos. Parâmetros foram corroborados em fontes secundárias abertas e por aritmética independente; a verificação direta das páginas governamentais permaneceu bloqueada nesta sessão. Detalhes, fontes, regras e limites em [docs/MOTOR-FISCAL.md](docs/MOTOR-FISCAL.md).

A pesquisa comparativa e critérios de cobertura estão em [docs/PESQUISA-CLASSIFICACAO-E-TRIBUTOS.md](docs/PESQUISA-CLASSIFICACAO-E-TRIBUTOS.md). A arquitetura e os pré-requisitos reais de busca estão em [docs/PESQUISA-WEB.md](docs/PESQUISA-WEB.md).

### Analisar todas as pendências de uma vez

Em **Lançamentos → Compartilhar pendências**, o app gera uma prévia editável e um arquivo `meu-bolso-pendencias.json`, agrupado por estabelecimento e motivo. O relatório inclui a versão do app, contagens e nomes, sem campos de valores, datas, contas, rendas, PDFs ou senhas. Movimentações de conta potencialmente pessoais e identificadores numéricos longos são omitidos; nomes ainda podem conter informações pessoais, então revise antes de compartilhar. Nada é enviado automaticamente. O arquivo pode ser anexado à conversa de suporte para analisar os casos em conjunto, sem copiar um por um. Essa exportação não resolve ou oculta pendências por si só.

### Ampliação do reconhecimento por ramo

O catálogo reconhece assinaturas de software e criadores, reservas de viagem, companhias aéreas, trens, transporte público, pontos/milhas, loterias, eletrônicos, delivery, doces e lojas de conveniência. Prefixos numéricos são removidos para marcas já confirmadas; por exemplo, um identificador de filial antes de BF Shop não impede a correspondência com Brooksfield. O intermediador `TON` é tratado como prefixo, não como qualquer ocorrência dessas letras dentro de outro estabelecimento. Em compras com prefixo IFD, atividades específicas como farmácia, produtos para pets e entretenimento têm precedência sobre o canal de delivery.

Essas regras também reclassificam o histórico pendente ao carregar o app, preservando valores, datas, parcelas e correções manuais. Reconhecer o estabelecimento não encerra pendências sobre valor em reais, cotação ou saldo. A redução das pendências depende das descrições de cada arquivo; não há garantia de atingir a meta de 5% em todo extrato.

## Versão com pesquisa integrada

```sh
npm run build
npm start
```

O servidor usa a porta 8787 e serve o frontend com a API na mesma origem. Configure as credenciais somente no ambiente do servidor, conforme `.env.example`; senha é obrigatória em produção e a hospedagem pública deve fornecer HTTPS. O blueprint `render.yaml` é opcional e não foi implantado nesta sessão. Falta credencial real de busca e hospedagem para verificar consultas ao vivo. Uma integração de provedor não deve ser descrita como ativa apenas porque os testes com respostas simuladas passaram.

Dados de navegador não acompanham mudança de origem: exporte o backup no endereço antigo e restaure no novo antes de limpar qualquer armazenamento.
