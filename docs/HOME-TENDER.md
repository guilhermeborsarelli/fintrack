# Home Tender · Coquetéis Clássicos

App de drinks independente, em `public/drinks/`, com estética noir dos anos 40. Não usa build nem dependências: são módulos ES estáticos que o Vite copia para `dist/drinks/`.

* Publicado (GitHub Pages): `https://guilhermeborsarelli.github.io/fintrack/drinks/`
* Local: `npm run dev` e abra `http://localhost:5173/drinks/index.html` (em dev, `/drinks/` sem `index.html` cai no app de finanças)

## Referência

As receitas seguem a **lista oficial da IBA (International Bartenders Association)**, a referência da coquetelaria internacional desde 1961, nas três categorias: *The Unforgettables*, *Contemporary Classics* e *New Era Drinks*. Medidas em ml, como na especificação IBA.

As **adaptações reconhecidas** são coquetéis consagrados fora da lista IBA (Savoy Cocktail Book, Harry's ABC, Trader Vic, clássicos modernos de bartenders de referência). Cada uma aponta o clássico IBA de que deriva (`parent`).

## Abas

* **Cardápio**: menu em cartão de papel com ilustração, ingredientes e copo de cada drink. Busca, filtro por categoria e por destilado base.
* **Meu Bar**: o usuário marca os ingredientes que tem (salvo só no aparelho). O app mostra a *sugestão da casa*: um clássico IBA possível; se nenhum fecha, uma adaptação reconhecida. Também lista o que está "quase lá" e qual ingrediente falta.
* **Copos & Utensílios**: glossário ilustrado.

Toda ficha de drink mostra o desenho, o copo, os utensílios, os ingredientes com medidas, o preparo passo a passo e a guarnição.

## Arquivos

| Arquivo | Conteúdo |
| --- | --- |
| `data.js` | Ingredientes, copos, utensílios e receitas |
| `engine.js` | Correspondência com o bar do usuário, utensílios derivados do método, passo a passo |
| `art.js` | Ilustrações SVG em aquarela (copo, líquido, gelo, guarnições, arabescos dourados) |
| `app.js`, `style.css`, `index.html` | Interface |

Testes: `tests/drinks.test.js` (rodam junto com `npm test`).
