# Home Tender

App de coquetéis clássicos em `public/drinks/` (publicado em `/drinks/`). Módulos ES estáticos, sem build; o Vite copia tudo para `dist/drinks/`.

* Publicado (GitHub Pages): `https://guilhermeborsarelli.github.io/fintrack/drinks/`
* Local: `npm run dev` e abra `http://localhost:5173/drinks/index.html`

## Conteúdo

* **Receitas**: os 102 coquetéis da lista oficial da IBA (34 em cada categoria: The Unforgettables, Contemporary Classics, New Era Drinks), conferidos um a um com as fichas de iba-world.com (copo, medidas, guarnição; cópia em `tools/generate-photos/iba-specs.json`), em ml, mais variações consagradas fora da lista, cada uma ligada ao clássico de origem (`parent`).
* **Histórias e "por que este copo"**: `stories/` (português, inglês e espanhol). Origens disputadas são apresentadas como tal.
* **Introdução**: `content.js`. Conceito, linha do tempo, livros de referência (Jerry Thomas, Savoy, Embury, DeGroff, Wondrich, Dave Arnold, Cocktail Codex) e a tendência de fazer drinks em casa.

## Idiomas

`i18n.js` traz a interface e os dados traduzidos; `steps-i18n.js`, os passos de preparo. O seletor PT/EN/ES fica no canto superior direito e a escolha é salva no aparelho.

## Fotos dos drinks

`img/drinks/<id>.webp` são renderizações 3D próprias: estúdio com fundo preto, bancada espelhada, spot de cima e halo atrás do copo. Para regenerar depois de mudar receitas ou cores:

```sh
npm run render:drinks            # todos
npm run render:drinks -- negroni # só alguns
```

O script (`tools/render-drinks/`) monta a cena em Three.js e renderiza no Chromium headless. A cor do líquido vem de `color`/`color2` em `data.js`; copo, gelo, espuma e guarnições também vêm dos dados do drink.

## Login

Hoje a conta é **local**: nome, e-mail e um hash PBKDF2-SHA256 da senha ficam no `localStorage` do aparelho, e cada conta tem o seu "Meu Bar". Isso não fecha o conteúdo (os arquivos do site são públicos) e a conta não acompanha o usuário em outro aparelho.

Para um app pago é preciso um backend:

1. **Autenticação**: Supabase Auth ou Firebase Auth (e-mail/senha, Google, Apple).
2. **Conteúdo protegido**: receitas, histórias e fotos servidas por API ou banco com regra de acesso por assinatura (por exemplo, Supabase com Row Level Security), não como arquivos públicos.
3. **Pagamento**: Stripe ou Mercado Pago (assinatura), com webhook que marca o usuário como assinante.
4. **Hospedagem**: Vercel, Netlify ou Cloudflare Pages com funções serverless; para lojas de aplicativos, empacotar como PWA/TWA ou com Capacitor.

## Arquivos

| Arquivo | Conteúdo |
| --- | --- |
| `data.js` | Ingredientes, copos, utensílios e receitas |
| `engine.js` | Correspondência com o bar do usuário, utensílios, preparo em 3 idiomas |
| `i18n.js`, `steps-i18n.js` | Traduções |
| `stories/` | Histórias e o porquê de cada copo |
| `content.js` | Introdução e créditos das fotos |
| `auth.js` | Contas locais |
| `art.js` | Ícones dos utensílios |
| `img/` | Fotos de abertura (Wikimedia Commons, créditos no app) e renders 3D dos drinks |

Testes: `tests/drinks.test.js` (rodam com `npm test`).

## Fotos feitas à mão (ChatGPT ou outra ferramenta)

1. Os roteiros estão em `docs/FOTOS-ROTEIROS.txt`, numerados de 001 a 143.
2. Salve cada imagem com o número do roteiro (ex.: `017.png`) ou com o nome do drink (ex.: `negroni.jpg`) e junte tudo num `.zip`.
3. Importe com `node tools/generate-photos/import.mjs fotos.zip` (use `--dry` para só conferir).
   Cada imagem é recortada em 4:5, reduzida para 960×1200, salva em WebP em `public/drinks/img/drinks/<id>.webp`
   e entra em `photos.json`, que impede o render 3D de sobrescrevê-la. O número → drink está em
   `tools/generate-photos/numbers.json`. Precisa do ImageMagick (`convert`).

## App instalável e sem internet

- `manifest.webmanifest` com ícones PNG (192, 512 e maskable) e `apple-touch-icon.png` para o iPhone.
- `sw.js` (service worker): a página vem da rede quando há conexão; módulos, imagens e ícones ficam guardados no aparelho.
  O build (`tools/version-drinks.mjs`) carimba a versão e a lista de arquivos; versões antigas são apagadas sozinhas.
  O service worker só é registrado na versão publicada (com import map), nunca no servidor de desenvolvimento.
- Na tela Início aparece o convite para instalar (botão no Android/Chrome; instruções no iPhone). Fechar o convite é lembrado.

## Favoritos, "Já fiz", quantidade e próxima compra

- Favoritos e "Já fiz" ficam por usuário em `hometender.fav.<email>` e `hometender.done.<email>`; aparecem em "Meus drinks", no topo do Meu Bar.
  Concluir todos os passos da receita marca "Já fiz" sozinho.
- A folha da receita tem o seletor 1 / 2 / 4 / 6 drinks: multiplica as medidas em ml e a medida caseira; doses em texto ganham "× n".
- "Próxima compra" (Meu Bar): os ingredientes que, comprados, completam mais receitas com o que a pessoa já tem.

## Entrada sem cadastro (só durante o desenvolvimento)

`DEV_FREE_ENTRY = true` em `public/drinks/app.js` mostra na capa o botão "Entrar sem cadastro (versão de teste)".
Mude para `false` antes do lançamento.
