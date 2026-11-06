# Pesquisa de estabelecimentos com fontes

A consulta limitada à Wikipédia permanece como opção. A pesquisa ampliada é implementada em `server/research.js`, via API Tavily, com análise contextual opcional pela API OpenAI. Credenciais ficam somente no processo do servidor. Não há chave no JavaScript publicado.

## Fluxo

1. Normalizar a descrição e excluir PIX, números de documentos/cartão, e-mails e descrições sensíveis. Essa filtragem não garante que todo nome de pessoa seja detectado; o usuário confere e autoriza a lista na primeira pesquisa.
2. Pesquisar `cobrança cartão de crédito "NOME" CIDADE estabelecimento` e `"NOME" CIDADE razão social CNPJ atividade`.
3. Preservar título, URL, trecho e horário da consulta. Não executar instruções contidas nas páginas/trechos. O servidor não acessa URLs arbitrárias fornecidas pelo usuário.
4. Retornar até três hipóteses por nome, com explicação curta e fontes. Resultados sem correspondência de nome/atividade ficam sem classificação.
5. Correspondência automática exige ramo identificado, nome composto, CNPJ válido repetido em fontes de domínios independentes e uma fonte cadastral reconhecida. Essa política é conservadora e não equivale a probabilidade calibrada ou garantia de identidade da compra. Hipóteses de uma fonte ou análise da IA sempre exigem confirmação.
6. A confirmação aplica a categoria ao grupo equivalente e memoriza a regra. Dúvidas sobre valores/saldo permanecem pendentes. Nunca altera o valor para “caber” numa classificação.
7. Após autorização, a pesquisa automática pode tratar nomes novos ao importar ou reabrir o app. Processa até 50 nomes por rodada, sequencialmente, e registra tentativas bem-sucedidas por sete dias para evitar repetição. A aba pode continuar em uso. Fechar o navegador interrompe o processamento; não existe processamento em segundo plano com a aba fechada.

O provedor de busca não é gratuito por definição: disponibilidade, preços e quotas dependem da conta contratada. Há cache local em memória de sete dias e limites locais de requisições (30/minuto por IP e 60/hora por instância por padrão). Em múltiplas instâncias, substituir esse controle por cache/rate limit compartilhado antes de escalar. Reiniciar o servidor limpa o cache em memória. Em deploy com proxy reverso, o IP visto pode ser o do proxy; o limite global permanece ativo. Não confiar cegamente em cabeçalhos X-Forwarded-For.

## Executar o serviço

Requer Node 24.5+.

```sh
npm ci
npm run build
npm start
```

O build padrão usa base `/`, adequada para o servidor Node. O build do GitHub Pages continua usando `/fintrack/`. Defina os valores no ambiente da hospedagem ou em `.env` local ignorado pelo Git:

- `RESEARCH_SEARCH_KEY`: chave Tavily (necessária para pesquisa ampliada).
- `RESEARCH_AI_KEY`: chave OpenAI opcional; habilita análise contextual dos trechos encontrados. O modelo nunca cria URLs de fontes; citações são verificadas contra os resultados da busca e continuam sendo sugestões.
- `RESEARCH_PASSWORD`: obrigatória em `NODE_ENV=production`. O navegador pede usuário **fintrack** e a senha definida. Não compartilhe a senha pelo chat nem a coloque em código, URL ou VITE_*. Autenticação HTTP Basic deve ser usada apenas por HTTPS em hospedagem pública.
- `RESEARCH_MAX_HOURLY`: limite de requisições por hora; padrão 60.
- `HOST=0.0.0.0` e `PORT` conforme a hospedagem; desenvolvimento usa 127.0.0.1:8787.
- `RESEARCH_ALLOWED_ORIGINS`: origens HTTPS explícitas se o frontend for hospedado separadamente. Prefira frontend e API na mesma origem. Não use wildcard com credenciais.

`npm start` usa o proxy de ambiente suportado pelo Node; preserva verificação TLS e configuração de certificados. Não desabilitar a validação TLS.

GET `/api/research/health` informa apenas se o serviço foi configurado. POST `/api/research` aceita somente nome/cidade, até 2 KiB. Em produção, a autenticação protege o app e a quota; nenhuma chave é retornada. Erros, limites ou ausência de fontes não produzem uma classificação fictícia.

## Publicação e migração

GitHub Pages executa somente arquivos estáticos e **não hospeda a API**. Os cálculos de renda e regras locais funcionam lá; a busca ampliada fica indicada como não conectada. O servidor está preparado e testado localmente, mas ainda precisa de credencial e hospedagem.

`render.yaml` é um blueprint opcional para uma hospedagem Node, sem criar recursos automaticamente. Revise disponibilidade/plano/custo e informe as credenciais de forma segura no painel. Outra hospedagem Node/contêiner também é possível. Não há autenticação de hospedagem nem credencial real de busca disponíveis nesta sessão, portanto a implantação remota e consultas ao vivo ainda não foram verificadas.

Ao mudar do endereço GitHub Pages para o endereço com servidor, os dados do navegador **não migram automaticamente**, porque a origem mudou. Exporte o backup JSON no endereço antigo e restaure no novo. Essa restauração é feita pelo próprio navegador; o servidor de pesquisa não recebe PDFs ou movimentações. Preserve o backup e o armazenamento antigo até validar os dados no novo endereço.

Se mantiver frontend separado, a variável de build pública `VITE_RESEARCH_API_URL` pode apontar para a API, com CORS e autenticação corretamente configurados. Nunca colocar credenciais nessa variável. Para uso pessoal, a mesma origem evita problemas de cookies/autenticação entre sites.

## Validação

- `npm run test:server`: autenticação, CORS, tamanho de payload, limites de uso, cache, fontes, CNPJ e citações verificadas, com provedor simulado.
- `npm run test:e2e`: interação com hipóteses/fontes, aplicação ao grupo e fila automática, com respostas externas simuladas.
- Acesso real a Tavily/OpenAI depende de credenciais e rede; não foi descrito como validado.

A meta de 3–5% de revisão precisa ser medida em dados reais depois de conectar o provedor. Cobertura do serviço não é garantia de acurácia: nomes truncados, homônimos e intermediadores sem estabelecimento podem continuar ambíguos.
