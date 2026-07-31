# 🖥️ GitHub Desktop — nunca mais sofra para enviar arquivos

## Primeiro, por que não posso fazer por você

Você ofereceu me dar acesso ao seu GitHub. Agradeço a confiança, mas
**preciso recusar** — e quero explicar o porquê, para você aplicar essa regra
com qualquer serviço ou assistente:

- 🔐 **Senhas e tokens são pessoais.** Se você me passar um, ele fica
  registrado nesta conversa. Não é seguro.
- 🔑 Um token do GitHub permitiria **apagar seu repositório**, ver tudo o que
  há nele e agir como você.
- ✅ Nenhum serviço confiável pede sua senha por chat. Se algum dia alguém
  pedir, desconfie.

**A boa notícia:** o GitHub Desktop resolve o seu problema melhor do que eu
resolveria, e você fica no controle.

---

## 🎯 O que muda com o GitHub Desktop

| Hoje (pelo navegador) | Com o GitHub Desktop |
|---|---|
| Arrastar arquivo por arquivo | Copia a pasta e pronto |
| Estrutura de pastas achata ❌ | **Nunca achata** ✅ |
| Precisa saber onde cada um vai | Ele descobre sozinho |
| ~20 minutos e vários erros | ~2 minutos, sem erro |

É um programa **gratuito e oficial** do GitHub, feito para quem não usa
terminal. Tudo com botões.

---

# PASSO 1 — Instalar (5 minutos, só uma vez)

1. Acesse **[desktop.github.com](https://desktop.github.com)**
2. Clique em **Download for Windows** (ou macOS)
3. Abra o arquivo baixado e instale (Avançar, Avançar)
4. Ao abrir, clique em **Sign in to GitHub.com**
5. Vai abrir o navegador → clique em **Authorize** → volte ao programa
6. Ele pede seu nome e e-mail → confirme → **Finish**

> 🔒 Você faz login **direto no site do GitHub**, na sua máquina. Nem eu nem
> ninguém tem acesso.

---

# PASSO 2 — Baixar seu repositório

1. Na tela inicial, clique em **Clone a repository from the Internet**
2. Na lista, escolha **`lcrecrutamentovagas1-rgb/portal-vagas`**
3. Em *Local path*, anote onde ele vai salvar
   (normalmente `C:\Users\SeuNome\Documents\GitHub\portal-vagas`)
4. Clique em **Clone** e aguarde

Pronto: você tem uma cópia do site no seu computador.

---

# PASSO 3 — Substituir pelos arquivos novos

## 3.1 — Limpar o que está errado lá

Abra a pasta que foi criada (`Documents\GitHub\portal-vagas`) e **apague**:

- A pasta **`src`**
- A pasta **`supabase`**
- Os arquivos soltos: `ImportadorCurriculos.tsx`, `ListaCandidaturas.tsx`,
  `extrair-dados.ts`, `importar.ts`, `layout.tsx`, `types.ts`, `page.tsx`,
  `page (1).tsx`, `banco-de-talentos.sql`

> ⚠️ **NÃO apague** a pasta oculta **`.git`** (se você a estiver vendo). É ela
> que liga a pasta ao GitHub.

## 3.2 — Colocar os novos

1. Extraia o **`portal-vagas-completo.zip`**
2. Entre na pasta `portal-vagas` de dentro dele
3. Selecione **tudo** (Ctrl+A) e **copie** (Ctrl+C)
4. Vá até `Documents\GitHub\portal-vagas` e **cole** (Ctrl+V)
5. Se perguntar sobre substituir: **Sim, substituir todos**

---

# PASSO 4 — Enviar (a parte fácil)

Volte ao **GitHub Desktop**. Ele já detectou tudo sozinho:

1. À esquerda, aparece a lista de arquivos alterados
2. Embaixo à esquerda, no campo **Summary**, escreva:
   `Projeto completo com importador e ranking`
3. Clique no botão azul **Commit to main**
4. No topo, clique em **Push origin**

⏱️ Uns 30 segundos. **A estrutura de pastas vai perfeita, sempre.**

A Vercel republica sozinha em ~2 minutos.

---

# 🔄 Nas próximas vezes

Sempre que eu te mandar um zip atualizado:

1. Extrair o zip
2. Copiar por cima da pasta `Documents\GitHub\portal-vagas`
3. GitHub Desktop → escrever o resumo → **Commit** → **Push**

Só isso. Sem arrastar, sem achatar, sem erro.

---

## 🆘 Se algo der errado

| Problema | Solução |
|---|---|
| Não aparece o repositório na lista | Clique em **URL** e cole: `lcrecrutamentovagas1-rgb/portal-vagas` |
| "Não há alterações" | Você colou na pasta errada — confira o caminho em *Local path* |
| Não consigo ver a pasta `.git` | Normal, ela é oculta. Só não apague nada que comece com ponto |
| Erro ao dar Push | Clique em **Fetch origin** primeiro, depois **Push** de novo |

---

## 💬 O que eu ainda posso fazer por você

Mesmo sem acessar seu GitHub, eu:

- ✅ Escrevo e testo todo o código
- ✅ Monto os zips prontos
- ✅ Verifico se compila antes de te entregar
- ✅ Analiso erros pelos prints que você manda
- ✅ Te guio passo a passo

O que você faz: **os 3 cliques finais** — e mantém o controle total da sua
conta. É assim que deve ser.
