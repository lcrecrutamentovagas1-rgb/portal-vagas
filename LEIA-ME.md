# 🇧🇷 Portal de Vagas — Referência técnica

Um clone simplificado do Indeed feito em **Next.js + Supabase**.
**Custo: R$ 0,00** até você decidir comprar o domínio.

> 👋 **É a sua primeira vez? Não leia este arquivo.**
> Abra o **[COMECE-AQUI.md](./COMECE-AQUI.md)** — é o guia passo a passo,
> escrito para quem não programa, sem precisar de terminal.
>
> Este arquivo aqui é a referência técnica, útil depois que o site já estiver
> no ar.

---

## 📋 O que o site já faz

### Para o candidato (não precisa criar conta)
- Busca vagas por cargo, cidade, área, modalidade e tipo de contrato
- Abre a vaga e vê descrição, requisitos, benefícios e salário
- Preenche os dados pessoais e **anexa o currículo em PDF, DOC, DOCX, JPG ou PNG** (até 10 MB)
- Recebe confirmação na hora

### Para a empresa (com login)
- Cria conta gratuita
- Publica vagas ilimitadas
- Recebe os currículos organizados no painel
- Move cada candidato entre etapas: Nova → Em análise → Entrevista → Aprovada / Reprovada
- Baixa o currículo com link seguro e temporário
- Pausa, encerra ou edita as vagas

### Para você, o administrador
- Painel separado em **`/admin`** com senha própria
- **Cadastra vagas você mesmo** (digitando o nome de qualquer empresa)
- Aprova ou recusa as vagas enviadas pelas empresas
- Marca vagas como ⭐ **destaque** (aparecem primeiro)
- Vê **todos** os currículos de **todas** as empresas
- Vê a lista de empresas cadastradas e as estatísticas do portal

---

## 🚀 PARTE 1 — Colocar para funcionar na sua máquina

### Passo 1.1 — Instalar o Node.js
Baixe em [nodejs.org](https://nodejs.org) a versão **LTS** e instale (Avançar, Avançar, Concluir).

### Passo 1.2 — Instalar as dependências
Abra o terminal na pasta do projeto e rode:

```bash
npm install
```

---

## 🗄️ PARTE 2 — Criar o banco de dados grátis (Supabase)

### Passo 2.1 — Criar a conta
1. Vá em [supabase.com](https://supabase.com) e clique em **Start your project**
2. Entre com o GitHub ou com e-mail
3. Clique em **New Project**
   - **Name:** portal-vagas
   - **Database Password:** crie uma senha forte e **guarde**
   - **Region:** `South America (São Paulo)` — mais rápido no Brasil
4. Clique em **Create new project** e espere ~2 minutos

### Passo 2.2 — Criar as tabelas
1. No menu lateral, clique em **SQL Editor**
2. Clique em **New query**
3. Abra o arquivo **`supabase/schema.sql`** deste projeto, copie **tudo** e cole lá
4. Clique em **Run** (ou `Ctrl+Enter`)
5. Deve aparecer *Success. No rows returned* ✅

> Isso cria as tabelas, as regras de segurança (RLS) e a pasta dos currículos automaticamente.

### Passo 2.3 — Pegar as chaves
1. Menu lateral → ⚙️ **Project Settings** → **API**
2. Copie:
   - **Project URL** → algo como `https://abcdefgh.supabase.co`
   - **Publishable key** (aba *API Keys*) → começa com `sb_publishable_...`
     *(projetos antigos: use a chave **anon public**, que começa com `eyJ...` —
     as duas funcionam)*

### Passo 2.4 — Colar as chaves no projeto
Abra o arquivo **`.env.local`** na raiz do projeto e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ABC123...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ Sem espaços, sem aspas. Salve o arquivo.

### Passo 2.5 — Desligar a confirmação de e-mail (facilita os testes)
No Supabase: **Authentication → Sign In / Providers → Email** →
desmarque **Confirm email** → **Save**.

> Assim as empresas entram direto após o cadastro. Depois, em produção, você pode religar.

### Passo 2.6 — (Opcional) Colocar vagas de exemplo
Quer ver o site cheio para testar a busca e os filtros? No **SQL Editor**, rode
o conteúdo do arquivo **`supabase/dados-exemplo.sql`** — ele cria 8 vagas
fictícias. Dá para apagar tudo depois com uma linha (está comentada no fim do
arquivo).

### Passo 2.7 — Rodar o site

```bash
npm run dev
```

Abra **http://localhost:3000** 🎉

---

## 👑 PARTE 3 — Criar o SEU usuário de administrador

### Passo 3.1 — Criar o usuário
1. Supabase → **Authentication** → **Users** → botão **Add user** → **Create new user**
2. Preencha seu e-mail e uma senha forte
3. **Marque a caixinha `Auto Confirm User`** ✅
4. Clique em **Create user**

### Passo 3.2 — Transformar em administrador
1. Vá em **SQL Editor** → **New query**
2. Cole (trocando pelo SEU e-mail):

```sql
select public.promover_admin('seu@email.com');
```

3. Clique em **Run** — deve responder *"seu@email.com agora é ADMINISTRADOR"* ✅

### Passo 3.3 — Entrar
Acesse **http://localhost:3000/admin/login** com esse e-mail e senha.

Pronto! Você já pode cadastrar vagas em **Administração → Cadastrar vaga**.

---

## 🌐 PARTE 4 — Publicar o site na internet (grátis)

### Passo 4.1 — Subir o código para o GitHub
1. Crie uma conta em [github.com](https://github.com)
2. Crie um repositório novo (pode ser **Private**), ex.: `portal-vagas`
3. Na pasta do projeto, rode:

```bash
git init
git add .
git commit -m "Portal de vagas"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/portal-vagas.git
git push -u origin main
```

> O arquivo `.env.local` **não** vai para o GitHub (está no `.gitignore`) — isso é proposital e correto.

### Passo 4.2 — Publicar na Vercel
1. Vá em [vercel.com](https://vercel.com) e entre com o GitHub
2. **Add New → Project** → escolha o repositório `portal-vagas` → **Import**
3. Antes de clicar em Deploy, abra **Environment Variables** e adicione as 3:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://abcdefgh.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_ABC123...` |
| `NEXT_PUBLIC_SITE_URL` | `https://portal-vagas.vercel.app` |

4. Clique em **Deploy** e espere ~2 minutos

Seu site estará no ar em `https://portal-vagas.vercel.app` — **de graça, para sempre.**

### Passo 4.3 — Avisar o Supabase do novo endereço
Supabase → **Authentication → URL Configuration**:
- **Site URL:** `https://portal-vagas.vercel.app`
- **Redirect URLs:** adicione `https://portal-vagas.vercel.app/**`

---

## 🏷️ PARTE 5 — Quando você comprar o domínio

### Onde comprar
| Registrador | Preço aproximado/ano |
|---|---|
| [registro.br](https://registro.br) (`.com.br`) | R$ 40 |
| [Hostinger](https://hostinger.com.br) (`.com`) | R$ 50 |
| [Cloudflare](https://cloudflare.com) (`.com`) | ~R$ 55 (preço de custo) |

### Como conectar na Vercel
1. Vercel → seu projeto → **Settings** → **Domains** → **Add**
2. Digite `seudominio.com.br` → a Vercel mostra os registros DNS
3. No registro.br (ou onde comprou), aponte:
   - Tipo `A` → `@` → `76.76.21.21`
   - Tipo `CNAME` → `www` → `cname.vercel-dns.com`
4. Espere de 10 min a 24 h. O **HTTPS é automático e grátis**.
5. Atualize a variável `NEXT_PUBLIC_SITE_URL` na Vercel e o **Site URL** no Supabase.

---

## ✏️ PARTE 6 — Personalizar

### Trocar o nome e o slogan
Abra **`src/lib/site.ts`** e edite:

```ts
export const site = {
  nome: "VagasBR",          // ← nome do seu portal
  sigla: "V",               // ← letra do logo
  slogan: "Sua próxima oportunidade começa aqui",
  email: "contato@seudominio.com.br",
};
```

### Trocar a cor principal
Abra **`src/app/globals.css`** e mude:

```css
:root {
  --marca: #2557a7;         /* azul (padrão) */
  --marca-escura: #1a3d78;
  --marca-clara: #e8f0fe;
}
```

Sugestões: verde `#0d8050` · roxo `#6d28d9` · laranja `#ea580c` · vermelho `#dc2626`

### Adicionar áreas, níveis ou tipos de contrato
Tudo no mesmo arquivo **`src/lib/site.ts`** — basta acrescentar itens nas listas.

---

## 📁 Mapa do projeto

```
portal-vagas/
├── supabase/
│   ├── schema.sql               ← O SCRIPT DO BANCO (rode no Supabase)
│   └── dados-exemplo.sql        ← 8 vagas fictícias (opcional)
├── .env.local                   ← SUAS CHAVES (nunca compartilhe)
│
└── src/
    ├── lib/
    │   ├── site.ts              ← nome, cores, áreas, listas  ⭐ EDITE AQUI
    │   ├── format.ts            ← formatação de datas e salário
    │   └── supabase/            ← conexão com o banco
    │
    ├── components/              ← peças visuais reutilizadas
    │
    └── app/
        ├── (publico)/           ← o site que todo mundo vê
        │   ├── page.tsx         ← home
        │   ├── vagas/           ← busca e página da vaga
        │   ├── entrar/          ← login da empresa
        │   └── cadastro/        ← cadastro da empresa
        │
        ├── painel/              ← ÁREA DA EMPRESA (login)
        │   ├── vagas/           ← publicar e gerenciar vagas
        │   └── candidaturas/    ← currículos recebidos
        │
        ├── admin/               ← ÁREA DO ADMINISTRADOR (você)
        │   ├── vagas/           ← cadastrar/aprovar todas as vagas
        │   ├── candidaturas/    ← todos os currículos
        │   └── empresas/        ← lista de empresas
        │
        └── actions/             ← as regras de negócio (servidor)
```

---

## 🔐 Segurança

O banco usa **Row Level Security** do PostgreSQL. Na prática:

- Vaga só aparece publicamente se o status for `publicada`
- Uma empresa **nunca** vê os currículos de outra empresa
- Currículos ficam em bucket **privado** — o acesso é por link assinado que expira em 1 hora
- O papel de `admin` só pode ser dado direto no banco (ninguém vira admin pelo site)
- Suas chaves ficam no `.env.local`, fora do GitHub

---

## 🧯 Problemas comuns

| Problema | Solução |
|---|---|
| "Falta conectar o banco de dados" | Preencha o `.env.local` e reinicie: `Ctrl+C` e `npm run dev` |
| Cadastro pede confirmação de e-mail | Desligue *Confirm email* (Passo 2.5) |
| "Esta conta não tem permissão de administrador" | Rode `select public.promover_admin('seu@email.com');` no SQL Editor |
| Vaga da empresa não aparece no site | Está como *pendente* — aprove em `/admin/vagas` |
| Erro ao enviar currículo | Confirme que o `schema.sql` rodou inteiro (ele cria o bucket) |
| Mudei o `.env.local` e não funcionou | Sempre reinicie o servidor após mexer nesse arquivo |

---

## 💰 Custos

| Item | Custo |
|---|---|
| Banco de dados (Supabase Free) | **R$ 0** — 500 MB + 1 GB de arquivos |
| Hospedagem (Vercel Hobby) | **R$ 0** — 100 GB de tráfego/mês |
| HTTPS / SSL | **R$ 0** — automático |
| Domínio `.com.br` | ~R$ 40/ano (opcional) |

O plano grátis aguenta tranquilamente **milhares de vagas e currículos**.

---

## ⚡ Comandos

```bash
npm run dev      # rodar em modo desenvolvimento (localhost:3000)
npm run build    # gerar a versão de produção
npm start        # rodar a versão de produção
npm run lint     # verificar o código
```

---

Feito com Next.js 16, React 19, Tailwind CSS 4 e Supabase.
