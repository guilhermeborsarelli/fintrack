# Acessar o Meu Bolso no iPhone

O código e o fluxo `.github/workflows/pages.yml` estão no repositório `guilhermeborsarelli/fintrack`, branch `main`. Não é necessário comprar domínio.

1. Abra https://github.com/guilhermeborsarelli/fintrack/settings/pages e, em **Build and deployment → Source**, selecione **GitHub Actions**.
2. Abra https://github.com/guilhermeborsarelli/fintrack/actions/workflows/pages.yml e clique em **Run workflow**, selecionando **main**.
3. Aguarde a execução terminar com sucesso. O job `deploy` mostrará o endereço do site, esperado em https://guilhermeborsarelli.github.io/fintrack/.

O endereço esperado não confirma uma publicação. Confirme o sucesso do deploy e abra a URL antes de considerar o app disponível. A API do GitHub foi bloqueada pela política de rede deste ambiente durante a configuração; por isso, a ativação e a execução remotas não foram confirmadas pelo agente.

O workflow instala as dependências, executa os testes e gera o build com base `/fintrack/`, necessário para os assets e o PDF worker funcionarem no Pages. O manifest usa caminhos relativos. O build nesse caminho foi validado localmente, incluindo importação de PDF protegido e navegação para Planejamento no tamanho de tela do iPhone.

No Safari, você pode usar **Compartilhar → Adicionar à Tela de Início**. Comece pela demonstração ou cadastre rendas e metas. Os arquivos financeiros continuam sendo processados localmente; o workflow publica apenas o código do app, não movimentações do seu navegador.

Os domínios `api.github.com` e `guilhermeborsarelli.github.io` foram adicionados ao rascunho de rede do ambiente para permitir configurar e conferir a publicação por aqui. O rascunho só entra em vigor após revisão, salvamento e publicação do ambiente pelo produto. Isso é independente da ativação do GitHub Pages acima.
