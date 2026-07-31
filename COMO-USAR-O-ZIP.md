# 📦 Substituir tudo no GitHub pelo ZIP

O arquivo **`portal-vagas-completo.zip`** tem o projeto inteiro, testado e
funcionando.

> ✅ **Já testei para você:** extraí o zip num ambiente limpo e rodei o mesmo
> build que a Vercel roda. Compilou sem nenhum erro. As telas
> `/admin/importar` e `/admin/talentos` estão lá.

---

## 🔒 Antes de tudo: o que NÃO está no zip (de propósito)

| Item | Por quê |
|---|---|
| `.env.local` | Tem **suas chaves secretas**. Nunca pode ir para o GitHub. |
| `node_modules` | 300 MB de bibliotecas. A Vercel baixa sozinha. |
| `.next` | Arquivos temporários de build. |

Suas chaves continuam salvas na Vercel — **você não precisa mexer nelas**.

---

# PASSO 1 — Baixar e extrair

1. Baixe o **`portal-vagas-completo.zip`**
2. Vá até a pasta **Downloads**
3. Clique com o **botão direito** no zip → **Extrair tudo** → **Extrair**
4. Vai aparecer uma pasta `portal-vagas-completo`, e **dentro dela** outra
   pasta chamada `portal-vagas`

⚠️ **Preste atenção nesta parte** — é onde a maioria erra.

Você precisa entrar até ver estes arquivos:

```
📁 portal-vagas
   ├── 📁 public
   ├── 📁 src            ← precisa ver esta
   ├── 📁 supabase       ← e esta
   ├── package.json      ← e este
   ├── next.config.ts
   └── tsconfig.json
```

**É o conteúdo DESSA pasta que vai para o GitHub** — não a pasta em si.

---

# PASSO 2 — Apagar os arquivos antigos do GitHub

Vamos limpar a bagunça que ficou na raiz.

### Apagar os arquivos soltos

Para **cada** um destes que está na raiz do repositório:

- `ImportadorCurriculos.tsx`
- `ListaCandidaturas.tsx`
- `extrair-dados.ts`
- `importar.ts`
- `layout.tsx`
- `types.ts`
- `page.tsx`
- `page (1).tsx`
- `banco-de-talentos.sql`

Faça assim:

1. Clique no arquivo
2. Clique no ícone de **lixeira 🗑️** (canto superior direito)
   - Se não achar, clique nos **três pontinhos ⋯** → **Delete file**
3. Role até o fim → **Commit changes**

> 💡 Dá para apagar vários numa tacada só? Infelizmente não pelo site do
> GitHub. Mas são 9 cliques rápidos.

### E as pastas `src` e `supabase` que já existem?

**Deixe como estão.** Ao enviar os arquivos novos, o GitHub **substitui** os
que têm o mesmo nome e mantém o resto. Não precisa apagar as pastas.

---

# PASSO 3 — Enviar os arquivos novos

## ⭐ O jeito que funciona (arrastar da janela do Explorador)

1. No GitHub, clique em **Add file** → **Upload files**
2. Abra a pasta `portal-vagas` extraída (aquela com `src`, `supabase`,
   `package.json`)
3. Clique em **um** item e aperte **Ctrl + A** para selecionar tudo
4. **Arraste** para a área pontilhada do GitHub
5. Aguarde o upload (pode levar 1-2 minutos)

### 🔍 CONFIRA ANTES DE COMMITAR

Abaixo da área de upload, o GitHub lista o que vai enviar. **Os caminhos
precisam aparecer assim:**

```
✅ CERTO:
   src/lib/extrair-dados.ts
   src/components/ImportadorCurriculos.tsx
   src/app/admin/importar/page.tsx
```

```
❌ ERRADO (achatou de novo):
   extrair-dados.ts
   ImportadorCurriculos.tsx
   page.tsx
```

**Se aparecer errado**, saia da página sem confirmar e use o Jeito 2 abaixo.

6. Em *Commit changes*, escreva: `Projeto completo com importador`
7. Clique no botão verde **Commit changes**

---

## 🛟 JEITO 2 — Se o arrastar achatar de novo

Alguns navegadores não preservam as pastas. Neste caso, envie **uma pasta por
vez** (o GitHub costuma preservar melhor assim):

1. **Add file** → **Upload files**
2. Arraste **só a pasta `src`** → confira os caminhos → **Commit changes**
3. Repita: **Add file** → **Upload files**
4. Arraste **só a pasta `supabase`** → **Commit changes**
5. Repita para os arquivos soltos (`package.json`, `package-lock.json`,
   `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`,
   `eslint.config.mjs`, `next-env.d.ts`, `.gitignore`)

> 💡 **Dica:** use o **Google Chrome**. Ele preserva a estrutura de pastas
> melhor que os outros navegadores.

---

# PASSO 4 — Conferir se ficou certo

Na página principal do repositório, você deve ver **só isto**:

```
📁 public
📁 src
📁 supabase
📄 .gitignore
📄 COMECE-AQUI.md
📄 LEIA-ME.md
📄 (outros arquivos .md e .sql)
📄 eslint.config.mjs
📄 next-env.d.ts
📄 next.config.ts
📄 package-lock.json
📄 package.json
📄 postcss.config.mjs
📄 tsconfig.json
```

**Nenhum arquivo `.tsx` ou `.ts` solto na raiz.**

Agora clique em **`src`** → **`lib`**. Deve conter:

```
extrair-dados.ts    ← o que estava faltando
format.ts
site.ts
types.ts
📁 supabase
```

---

# PASSO 5 — Acompanhar o deploy

A Vercel republica sozinha em ~2 minutos.

Vercel → seu projeto → **Deployments**

| Status | O que fazer |
|---|---|
| 🟢 **Ready** | 🎉 Funcionou! |
| 🔴 **Error** | Clique no deploy e me mande a mensagem vermelha |

---

# PASSO 6 — Preparar o banco (não esqueça!)

O importador só funciona depois disto:

1. Supabase → **SQL Editor** → **New query**
2. Cole todo o conteúdo de **`supabase/banco-de-talentos.sql`**
3. **Run**

Depois acesse **`/admin/importar`** no seu site. 🎉

---

## 📁 O que veio no zip

**Site completo:**
- Página inicial, busca de vagas, página da vaga com formulário
- Cadastro e login de empresas
- Painel da empresa (publicar vagas, ver currículos)
- Painel do administrador (aprovar vagas, ver tudo)

**As novidades:**
- 📥 Importador de currículos em lote (`/admin/importar`)
- 🗂️ Banco de talentos com busca (`/admin/talentos`)
- Leitor automático de PDF e Word

**Guias:**
- `COMECE-AQUI.md` — guia geral
- `IMPORTAR-CURRICULOS.md` — como importar do Drive
- `PROXIMOS-PASSOS.md` — o que fazer agora
- `COMO-TROCAR-SENHA.md` — trocar senha do admin
- `VERIFICAR-TUDO.sql` — check-up do banco
- `TROCAR-SENHA.sql` — trocar senha pelo SQL

---

## 🆘 Deu errado?

| Problema | Solução |
|---|---|
| Caminhos achatados de novo | Use o Jeito 2 (uma pasta por vez), no Chrome |
| "Cannot find module" | Algum arquivo não subiu — me mande o print |
| Upload muito lento | Normal, são 123 arquivos. Aguarde. |
| GitHub reclamou de arquivo grande | Você incluiu `node_modules` por engano |
