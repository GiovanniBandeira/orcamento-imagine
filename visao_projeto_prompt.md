# PROMPT BASE DO PROJETO - IMAGINE HUB

Este é o escopo técnico e a visão de design da plataforma **Imagine Hub**, uma ferramenta interna para uma empresa de Impressão 3D. Utilize este prompt como base para entender o sistema atual e expandi-lo em conversas futuras com Inteligências Artificiais.

---

## 🏛️ ARQUITETURA E ESTRUTURA
**Stack:** React.js (Vite), Tailwind CSS, React Router DOM, ESModules (html-to-image, jspdf).
**Objetivo:** Consolidar 4 ferramentas vitais de operação em apenas um painel administrativo ágil, focado em alta conversão visual, UI Limpa e zero quebras na exportação.

**Navegação Lateral (Sidebar):**
1. `/` (Orçamento): Gerador de orçamentos visuais.
2. `/social` (Redes Sociais): Gerador de Artes para Instagram (Feed/Story).
3. `/card` (Cartão Impresso): Exportador de Cartões (10x15cm) p/ envio físico.
4. `/pricing` (Precificador): Calculadora matemática de custos e margem de lucro.

---

## 🎨 IDENTIDADE VISUAL
A estética de todo o sistema e das artes geradas por ele (especialmente os Templates de Texto) segue a identidade oficial da Imagine Hub (visto em `www.imaginehub.site`):
- **Core Tema:** Dark/Tech (Preto `#111` ou fundo Cinza Claro `#EBEBEB` para contrastar as peças).
- **Cor de Destaque Primária:** Verde Neon (`#00FF55`).
- **Fontes Base:** `Bebas Neue` (Títulos Giga, Impacto Visual) e Sistema Sans-serif padrão para legibilidade (Roboto/Inter).
- **Elementos Visuais:** Letreiros Vazados, Grids Tecnológicos (grid neon de fundo), Sombras Pesadas sob as peças (Drop Shadows pra saltar na tela) e minimalismo funcional. *Proibida poluição visual e excesso de variações das antigas logos caso a imagem do produto já contenha a logo do estúdio.*

---

## 🛠️ COMPONENTES E LÓGICA DAS PÁGINAS

### 1. Orçamento (`/src/pages/Orcamento.jsx`)
- **Desafio Superado:** O `html-to-image` costumava quebrar quando o usuário mudava o zoom do navegador ou estava no celular. 
- **Solução Atual:** A "Área de Impressão" possui uma escala simulada no CSS (`transform scale`), enquanto o documento original real (`print-area`) fica travado matematicamente com `width: 595px` e `height: 842px` (escala fiel ao A4). A ferramenta exporta ignorando a lente do monitor.
- **Integração:** Recebe variáveis como "Preço Unitário" e "Modelo" automaticamente se o usuário vier direto da tela de Precificação (via `useLocation` state no React Router).

### 2. Redes Sociais (`/src/pages/SocialMedia.jsx` e `/src/components/templates`)
Painel único que replica os dados em 3 Views Simultâneas usando Tabs.
- **Templates Dinâmicos:** `FeedSquare.jsx` (1:1 Texto), `FeedPortrait.jsx` (4:5 Produto ou misto), `StoryPortrait.jsx` (9:16 Produto Sidebar).
- **Textos Automáticos:** Para gerar avisos rápidos nas redes, os templates possuem gatilhos `isTextOnly`. Se ativados, o design muda de um plano "Light" (que abriga a imagem em PNG da peça) para um plano "Dark/Neon Tech" exibindo apenas as *props* `postTitle` e `postText` preenchidas no painel.

### 3. Cartão Impresso (`/src/pages/PrintCard.jsx`)
Gerador para enviar na embalagem junto com os colecionáveis 3D. 
- Formato Vertical (`100x150mm`).
- Renderizado em uma tela longa via JS (`width: 1080px`, `height: 3240px`) que encapsula Frente e Verso de uma só vez para facilitar a emissão de 1 só PDF contínuo.
- **Frente:** Contém a chamada "Sua Imaginação Tomou Forma", o Cupom dinâmico e Instagram da loja.
- **Verso:** Área instrutiva com 3 marcadores (Evite sol excessivo, umidade e use pincel seco).

### 4. Precificador (`/src/pages/PricingCalculator.jsx`)
Coração financeiro da ferramenta.
- Baseado em uma Planilha Mestra Excel ("Custos 3D.xlsx").
- **Campos cruciais inputados:** Custo de resina/filamento KG, Tempo de Impressão, Consumo Energético (watts), Vida útil da máquina, Tintas Base Acrílicas, Horas de mão de obra (Simples, Média, Complexa).
- **Lógica Computada:** Dilui o custo fixo do estúdio na receita esperada do mês, gera a depreciação exata da máquina, soma o custo físico (resina) + elétrico, embuti a margem de erro (Ex: 20% de falha nas resinas), junta um Custo Bruto e atrela os Markups, emitindo por fim preços recomendados para ML e Shopee.

---

## ⚡ COMO CONTINUAR ESSE PROJETO
1. Utilize o comando `npm run dev` para subir o vite local.
2. Analise os componentes de templates para mexer diretamente em fontes ou padding das artes geradas. NUNCA quebre as tags e classes matemáticas que fixam o Width/Height dos moldes ocultos, elas garantem as conversões A4 ou FullHD.
3. Não use Tailwind para criar novos plugins ou pacotes exóticos, continue usando as classes atômicas inline via `className` para facilidade de refatoração do DOM Virtual do React.
