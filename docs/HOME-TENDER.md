# Home Tender

App de coquetéis clássicos em `public/drinks/` (publicado em `/drinks/`). Módulos ES estáticos, sem build; o Vite copia tudo para `dist/drinks/`.

* Publicado (GitHub Pages): `https://guilhermeborsarelli.github.io/fintrack/drinks/`
* Local: `npm run dev` e abra `http://localhost:5173/drinks/index.html`

## Conteúdo

* **Receitas**: lista oficial da IBA (The Unforgettables, Contemporary Classics, New Era Drinks), em ml, mais variações consagradas fora da lista, cada uma ligada ao clássico de origem (`parent`).
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
