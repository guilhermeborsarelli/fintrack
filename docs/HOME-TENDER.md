# Home Tender · Coquetéis Clássicos

App de drinks independente, em `public/drinks/`, com estética noir dos anos 40. Não usa build nem dependências: são módulos ES estáticos que o Vite copia para `dist/drinks/`.

* Publicado (GitHub Pages): `https://guilhermeborsarelli.github.io/fintrack/drinks/`
* Local: `npm run dev` e abra `http://localhost:5173/drinks/index.html` (em dev, `/drinks/` sem `index.html` cai no app de finanças)

## Referência

As receitas seguem a **lista oficial da IBA (International Bartenders Association)**, a referência da coquetelaria internacional desde 1961, nas três categorias: *The Unforgettables*, *Contemporary Classics* e *New Era Drinks*. Medidas em ml, como na especificação IBA.

As **adaptações reconhecidas** são coquetéis consagrados fora da lista IBA (Savoy Cocktail Book, Harry's ABC, Trader Vic, clássicos modernos de bartenders de referência). Cada uma aponta o clássico IBA de que deriva (`parent`).

## Capa e login

Ao abrir, o app mostra a capa (foto, apresentação e login). A conta é **local**: nome, e-mail e um hash PBKDF2-SHA256 da senha ficam no `localStorage` do aparelho, e cada conta tem o seu "Meu Bar". Não há servidor: isso separa perfis no mesmo aparelho, mas não protege o conteúdo (o site continua público) e a conta não passa para outro aparelho. Login entre aparelhos exigiria um backend de autenticação.

## Abas

* **Início**: introdução editorial ao mundo da coquetelaria (o que é um coquetel, linha do tempo de 1806 a 2024, a IBA, anatomia, famílias, técnica, bar em casa), com fotos.
* **Clássicos**: os clássicos IBA em cartões de cardápio, com busca e filtro por categoria e destilado base.
* **Adaptações**: as adaptações reconhecidas, cada uma ligada ao clássico de origem.
* **Meu Bar**: o usuário marca os ingredientes que tem (salvo só no aparelho). O app mostra a *sugestão da casa*: um clássico IBA possível; se nenhum fecha, uma adaptação reconhecida. Também lista o que está "quase lá" e qual ingrediente falta.
* **Copos & Utensílios**: glossário ilustrado.

Toda ficha de drink mostra o desenho, o copo, os utensílios, os ingredientes com medidas, o preparo passo a passo e a guarnição.

## Arquivos

| Arquivo | Conteúdo |
| --- | --- |
| `data.js` | Ingredientes, copos, utensílios e receitas |
| `engine.js` | Correspondência com o bar do usuário, utensílios derivados do método, passo a passo |
| `art.js` | Ilustrações SVG em aquarela (copo, líquido, gelo, guarnições, arabescos dourados) |
| `auth.js` | Contas locais (PBKDF2 via WebCrypto) |
| `content.js` | Textos da capa e da introdução, créditos das fotos |
| `img/` | Fotos de Wikimedia Commons (licenças livres; créditos no app, em "Créditos das fotos") |
| `app.js`, `style.css`, `index.html` | Interface |

Testes: `tests/drinks.test.js` (rodam junto com `npm test`).
