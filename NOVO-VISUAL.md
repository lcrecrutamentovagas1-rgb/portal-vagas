# 🎨 Novo visual — cores da sua logo

O site inteiro foi redesenhado com a paleta da sua logo e a estrutura dos
sites que você mandou de referência.

> ✅ **Nenhuma funcionalidade foi alterada.** Tudo o que existia continua
> funcionando igual: importador, banco de talentos, ranking de candidatos,
> painéis e permissões. Só mudou a aparência.

---

## 🎨 A paleta que usei

Tirei as cores direto da sua logo:

| Cor | Código | Onde aparece |
|---|---|---|
| 🔵 Azul | `#1e90ff` | Botões principais, links |
| 🔷 Azul claro | `#38bdf8` | Detalhes, links no rodapé |
| 🟠 Laranja | `#ff8c1a` | Botões de empresa, destaques |
| 🔴 Coral | `#ff5757` | Meio do gradiente |
| 🩷 Magenta | `#e91e8c` | Selos e brilhos |
| 🟣 Roxo | `#7c3aed` | Fim do gradiente |
| 🌑 Navy | `#0a1128` | Fundo do topo e rodapé |

O gradiente da logo (azul → laranja → magenta → roxo) aparece nos títulos
com destaque, nos botões e no fio acima do rodapé.

> 💡 **Não coloquei o nome "Virago"**, como você pediu. Quando quiser usar,
> é só trocar em `src/lib/site.ts`.

---

## 🆕 O que mudou

### Marca
- **Logo em SVG** — recriei o "V" alado com a bolinha, nas cores originais.
  Fica nítida em qualquer tamanho e carrega instantâneo.
- Topo e rodapé em **fundo navy escuro**, como no seu material.

### Página inicial
- **Hero escuro** com brilhos coloridos ao fundo e título em gradiente
- **Busca em destaque**, com sombra, no estilo dos sites de referência
- **Estatísticas**: vagas abertas, empresas, "100% grátis"
- **Vagas por setor** com ícone e cor própria para cada área
- **Cartões de vaga** redesenhados (3 colunas, com salário em destaque)
- **Empresas em destaque**
- **Faixa colorida** convidando empresas a publicar
- **Depoimentos** (leia o aviso abaixo)

### Páginas novas
- **`/vagas-por-setor`** — todas as áreas com contagem de vagas
- **`/planos`** — 3 planos (Grátis, Profissional, Corporativo) + perguntas
  frequentes

### Login e cadastro
- Fundo navy com a logo, formulário em cartão branco flutuante
- Selos de confiança no cadastro ("sem cartão de crédito", etc.)

---

## ⚠️ Dois avisos importantes

### 1. Os depoimentos são exemplos

A seção "Quem usa, recomenda" tem **textos fictícios**, só para você ver como
fica. Coloquei um aviso discreto abaixo deles.

**Antes de divulgar o site, faça uma destas coisas:**
- Substitua por depoimentos reais (arquivo `src/components/Depoimentos.tsx`)
- Ou remova a seção: apague a linha `<Depoimentos />` do arquivo
  `src/app/(publico)/page.tsx`

> Publicar depoimento inventado como se fosse real é propaganda enganosa e
> pode gerar problema com o consumidor.

### 2. Os planos ainda não cobram

A página `/planos` é **informativa**. Os botões levam ao cadastro e ao
contato — **não há cobrança automática**. Para vender de verdade, seria
preciso integrar um meio de pagamento (Mercado Pago, Stripe, Asaas). Me avise
se quiser que eu faça isso.

Os preços (R$ 0 / R$ 99 / sob consulta) são sugestões. Edite em
`src/app/(publico)/planos/page.tsx`.

---

## 🔧 Como ajustar depois

### Trocar as cores
Arquivo **`src/app/globals.css`**, logo no começo:

```css
:root {
  --azul: #1e90ff;
  --laranja: #ff8c1a;
  --magenta: #e91e8c;
  --roxo: #7c3aed;
  --navy: #0a1128;
  --marca: #1e90ff;   /* cor dos botões principais */
}
```

### Trocar o nome (quando quiser usar "Virago")
Arquivo **`src/lib/site.ts`**:

```ts
export const site = {
  nome: "Virago",
  slogan: "Conecta talentos. Gera oportunidades.",
  ...
};
```

### Trocar ícone/cor de um setor
Arquivo **`src/lib/site.ts`**, na lista `ICONES_AREA`.

---

## 📦 Para colocar no ar

Baixe o **`portal-vagas-completo.zip`** atualizado e envie pelo GitHub Desktop
(guia em `GITHUB-DESKTOP-FACIL.md`):

1. Extrair o zip
2. Copiar por cima da pasta `Documents\GitHub\portal-vagas`
3. GitHub Desktop → **Commit** → **Push**

> ℹ️ **Não precisa mexer no banco de dados.** Só mudou o visual.

---

## ✅ Testado antes de entregar

- Lint e build sem nenhum erro ou aviso
- Todas as páginas respondendo (`/`, `/vagas`, `/vagas-por-setor`, `/planos`,
  `/entrar`, `/cadastro`)
- Telas conferidas visualmente em desktop
- Layout responsivo (celular, tablet e computador)
