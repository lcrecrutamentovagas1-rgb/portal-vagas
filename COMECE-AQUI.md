# 👋 COMECE AQUI — Guia para quem nunca programou

Este guia coloca o seu site de vagas no ar **sem instalar nada** e **sem usar
terminal**. Tudo pelo navegador, com o mouse.

> ⏱️ **Tempo:** cerca de 40 minutos
> 💰 **Custo:** R$ 0,00
> 🎓 **Precisa saber programar?** Não.

---

## 🗺️ O caminho que vamos fazer

```
   VOCÊ ESTÁ AQUI
        │
        ▼
   ┌─────────┐    ┌──────────┐    ┌────────┐    ┌──────────┐
   │ 1.GitHub│ →  │2.Supabase│ →  │3.Vercel│ →  │ 4. Admin │
   │ guardar │    │  banco   │    │ site no│    │ sua conta│
   │ o código│    │  de dados│    │   ar   │    │  de chefe│
   └─────────┘    └──────────┘    └────────┘    └──────────┘
```

**Em português claro:**
- **GitHub** = o armário onde o código fica guardado
- **Supabase** = o banco de dados (onde ficam as vagas e os currículos)
- **Vercel** = quem coloca o site no ar para o mundo ver
- **Admin** = a sua conta de dono, para cadastrar vagas

Todos são **gratuitos**. Você vai criar uma conta em cada um. Pode usar o mesmo
e-mail nos três.

> 💡 **Dica:** vá fazendo na ordem. Não pule etapas. Se travar em algum ponto,
> a seção "Deu problema?" no fim do arquivo resolve os casos mais comuns.

---

# 📦 ETAPA 1 — Guardar o código no GitHub

O GitHub é onde o código vai morar. A Vercel (etapa 3) vai buscar o código lá.

### 1.1 — Criar sua conta
1. Abra **[github.com](https://github.com)**
2. Clique em **Sign up** (canto superior direito)
3. Preencha e-mail, senha e um nome de usuário
4. Confirme o e-mail que eles enviarem

### 1.2 — Criar o repositório (a "pasta" do projeto)
1. Já logado, clique no **`+`** no canto superior direito → **New repository**
2. Preencha:
   - **Repository name:** `portal-vagas`
   - Marque **Private** (só você vê) — ou Public, tanto faz
   - ⚠️ **NÃO marque** nenhuma caixinha de "Add a README" / "Add .gitignore"
3. Clique no botão verde **Create repository**

### 1.3 — Enviar os arquivos
Você vai ver uma página quase vazia com instruções. Ignore os comandos e:

1. Procure o link **"uploading an existing file"** (no meio da página)
   *(ou vá em **Add file** → **Upload files**)*
2. Abra a pasta **`portal-vagas`** no seu computador
3. Selecione **tudo que está dentro** dela e **arraste para a área pontilhada**
   do navegador

   ✅ **Arraste estes:** as pastas `src` e `supabase`, e os arquivos
   `package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`,
   `postcss.config.mjs`, `eslint.config.mjs`, `next-env.d.ts`,
   `COMECE-AQUI.md`, `LEIA-ME.md`, `.gitignore`

   ❌ **NÃO arraste:** as pastas `node_modules` e `.next` (são enormes e
   desnecessárias), nem o arquivo `.env.local` (tem suas senhas!)

4. Espere as barrinhas de progresso terminarem (pode demorar 1-2 min)
5. Lá embaixo, clique no botão verde **Commit changes**

> 💡 Se aparecer erro de "too many files", é sinal de que a pasta
> `node_modules` foi junto. Cancele e tente de novo sem ela.

✅ **Pronto!** Seu código está guardado. Deve aparecer a lista de arquivos.

---

# 🗄️ ETAPA 2 — Criar o banco de dados (Supabase)

Aqui é onde as vagas, as empresas e os currículos vão ficar guardados.

### 2.1 — Criar a conta
1. Abra **[supabase.com](https://supabase.com)**
2. Clique em **Start your project**
3. Clique em **Continue with GitHub** (usa a conta que você acabou de criar)
4. Autorize o acesso

### 2.2 — Criar o projeto
1. Clique em **New project**
2. Preencha:
   - **Name:** `portal-vagas`
   - **Database Password:** clique em **Generate a password** e depois em
     **Copy** — **cole num bloco de notas e guarde**
   - **Region:** escolha **South America (São Paulo)** — deixa o site mais
     rápido no Brasil
3. Clique em **Create new project**
4. ☕ Espere uns 2 minutos enquanto ele monta tudo

### 2.3 — Criar as tabelas (o passo mais importante)
1. No menu da esquerda, clique no ícone **SQL Editor** (parece `>_`)
2. Clique em **New query** (ou no `+`)
3. Agora abra o arquivo **`supabase/schema.sql`** da pasta do projeto:
   - Clique com o botão direito nele → **Abrir com** → **Bloco de Notas**
     (Windows) ou **TextEdit** (Mac)
   - Aperte **Ctrl+A** (Windows) ou **Cmd+A** (Mac) para selecionar tudo
   - Aperte **Ctrl+C** / **Cmd+C** para copiar
4. Volte ao Supabase, clique dentro da área preta grande e cole (**Ctrl+V**)
5. Clique no botão verde **Run** (canto inferior direito)

✅ Deve aparecer **"Success. No rows returned"** — está certo!

> ⚠️ Se aparecer erro vermelho, você provavelmente colou só um pedaço.
> Apague tudo e copie o arquivo **inteiro** de novo.

### 2.4 — (Opcional, mas recomendado) Colocar vagas de exemplo
Para ver o site cheio e testar a busca:
1. **SQL Editor** → **New query**
2. Copie e cole todo o conteúdo de **`supabase/dados-exemplo.sql`**
3. Clique em **Run** — pronto, 8 vagas fictícias criadas

### 2.5 — Copiar as duas chaves
1. No menu da esquerda, vá em **Settings** (⚙️ lá embaixo) → **API Keys**
2. Você precisa de **dois valores**:

| O que copiar | Onde está | Como se parece |
|---|---|---|
| **Project URL** | aba *API Settings* ou no topo | `https://abcdefgh.supabase.co` |
| **Publishable key** | aba *API Keys* | `sb_publishable_ABC123...` |

> 📌 **Se o seu projeto for mais antigo** e não tiver "Publishable key",
> procure a aba **Legacy API Keys** e use a chave **`anon` `public`**
> (começa com `eyJ...`). As duas funcionam neste site.
>
> 🚨 **NUNCA** copie a chave **`secret`** ou **`service_role`**. Essa é a chave
> mestra — se ela vazar, qualquer pessoa apaga seu banco inteiro.

3. Cole as duas num bloco de notas — você vai usar na próxima etapa.

### 2.6 — Desligar a confirmação de e-mail
Isso faz as empresas entrarem direto após o cadastro, sem esperar e-mail:

1. Menu esquerdo → **Authentication** → **Sign In / Providers**
2. Clique em **Email**
3. **Desmarque** a opção **Confirm email**
4. Clique em **Save**

---

# 🚀 ETAPA 3 — Colocar o site no ar (Vercel)

### 3.1 — Criar a conta
1. Abra **[vercel.com](https://vercel.com)**
2. Clique em **Sign Up** → **Continue with GitHub** → autorize
3. Escolha o plano **Hobby** (o gratuito) e siga

### 3.2 — Importar o projeto
1. Clique em **Add New...** → **Project**
2. Na lista, encontre **`portal-vagas`** e clique em **Import**
   - *Se não aparecer:* clique em **Adjust GitHub App Permissions** e
     autorize o acesso ao repositório

### 3.3 — Colar as chaves (não pule!)
Ainda **antes** de clicar em Deploy:

1. Clique para expandir **Environment Variables**
2. Adicione **três variáveis**, uma de cada vez (nome no primeiro campo, valor
   no segundo, e clique em **Add**):

| Key (nome) | Value (valor) |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | cole a URL do Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | cole a Publishable key |
| `NEXT_PUBLIC_SITE_URL` | deixe `https://portal-vagas.vercel.app` por enquanto |

> ⚠️ Cuidado ao colar: sem espaços antes/depois e **sem aspas**.

### 3.4 — Publicar
1. Clique no botão preto **Deploy**
2. ☕ Espere uns 2 minutos (vai passar um monte de texto — é normal)
3. Quando aparecer a animação de parabéns, clique em **Continue to Dashboard**
4. No topo, você verá o endereço do seu site, algo como
   **`portal-vagas.vercel.app`** — **clique nele!**

🎉 **SEU SITE ESTÁ NO AR!** Qualquer pessoa no mundo já consegue acessar.

### 3.5 — Avisar o Supabase do endereço novo
1. Copie o endereço do seu site (ex.: `https://portal-vagas.vercel.app`)
2. No Supabase: **Authentication** → **URL Configuration**
3. Em **Site URL**, cole o endereço → **Save**
4. Em **Redirect URLs**, clique em **Add URL** e cole o endereço com `/**` no
   final: `https://portal-vagas.vercel.app/**` → **Save**

---

# 👑 ETAPA 4 — Criar a SUA conta de administrador

Esta é a conta de dono, que cadastra vagas e aprova tudo.

### 4.1 — Criar o usuário
1. No Supabase: **Authentication** → **Users**
2. Botão **Add user** → **Create new user**
3. Preencha:
   - **Email:** seu e-mail
   - **Password:** uma senha forte (**anote!**)
   - ✅ **Marque a caixinha `Auto Confirm User`** — importante!
4. Clique em **Create user**

### 4.2 — Virar administrador
1. Vá em **SQL Editor** → **New query**
2. Cole isto, **trocando pelo seu e-mail**:

```sql
select public.promover_admin('seu@email.com');
```

3. Clique em **Run**

✅ Deve responder: *"seu@email.com agora é ADMINISTRADOR"*

### 4.3 — Entrar no painel
1. Abra o seu site e acrescente `/admin/login` no fim do endereço:
   `https://portal-vagas.vercel.app/admin/login`
2. Entre com o e-mail e a senha que você criou

🎉 **Pronto!** Clique em **Cadastrar vaga** e publique a primeira.

---

# 🎨 ETAPA 5 — Personalizar o site

### Trocar o nome, o slogan e o e-mail
Dá para editar **direto no GitHub**, sem baixar nada:

1. No GitHub, entre no seu repositório
2. Navegue até **`src`** → **`lib`** → clique em **`site.ts`**
3. Clique no **lápis** ✏️ (canto superior direito)
4. Mude o que quiser:

```ts
export const site = {
  nome: "VagasBR",        // ← nome do seu portal
  sigla: "V",             // ← letra que aparece no logo
  slogan: "Sua próxima oportunidade começa aqui",
  email: "contato@seudominio.com.br",
};
```

5. Role até o fim e clique em **Commit changes** → **Commit changes**
6. A Vercel republica sozinha em ~1 minuto. Atualize o site e veja! ✨

### Trocar a cor principal
Mesmo caminho, mas o arquivo é **`src`** → **`app`** → **`globals.css`**.
Logo no começo:

```css
:root {
  --marca: #2557a7;        /* azul (padrão) */
  --marca-escura: #1a3d78; /* tom mais escuro */
  --marca-clara: #e8f0fe;  /* tom bem claro */
}
```

Paletas prontas — é só copiar as 3 linhas:

| Cor | `--marca` | `--marca-escura` | `--marca-clara` |
|---|---|---|---|
| 🔵 Azul (padrão) | `#2557a7` | `#1a3d78` | `#e8f0fe` |
| 🟢 Verde | `#0d8050` | `#095c39` | `#e6f4ee` |
| 🟣 Roxo | `#6d28d9` | `#4c1d95` | `#f3e8ff` |
| 🟠 Laranja | `#ea580c` | `#c2410c` | `#fff1e6` |
| 🔴 Vermelho | `#dc2626` | `#991b1b` | `#fee2e2` |

---

# 🏷️ ETAPA 6 — Quando comprar o domínio

Só faça isso quando quiser um endereço próprio, tipo `www.suasvagas.com.br`.

### Onde comprar
| Site | Tipo | Preço/ano |
|---|---|---|
| [registro.br](https://registro.br) | `.com.br` | ~R$ 40 |
| [Hostinger](https://hostinger.com.br) | `.com` / `.com.br` | ~R$ 50 |
| [Cloudflare](https://cloudflare.com) | `.com` | ~R$ 55 (preço de custo) |

### Como conectar
1. Na Vercel: seu projeto → **Settings** → **Domains** → **Add**
2. Digite seu domínio e clique em **Add**
3. A Vercel mostra o que configurar. No site onde você comprou, procure
   **"Gerenciar DNS"** ou **"Editar zona"** e crie:

| Tipo | Nome | Valor |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

4. Espere de 10 minutos a 24 horas. O **cadeado de segurança (HTTPS) é
   automático e grátis**.
5. **Não esqueça:** atualize `NEXT_PUBLIC_SITE_URL` na Vercel e o **Site URL**
   no Supabase para o novo endereço.

---

# 🖥️ Quero mexer no site no meu computador (opcional)

Só se quiser testar mudanças antes de publicar. **Não é obrigatório** —
tudo funciona editando pelo GitHub.

1. Instale o **Node.js** (versão LTS) em [nodejs.org](https://nodejs.org)
2. Abra a pasta do projeto no terminal e rode:
   ```bash
   npm install
   ```
3. Crie o arquivo **`.env.local`** com as mesmas chaves da Etapa 2.5
4. Rode:
   ```bash
   npm run dev
   ```
5. Abra **http://localhost:3000**

Sempre que mudar o `.env.local`, pare (**Ctrl+C**) e rode `npm run dev` de novo.

---

# 🆘 Deu problema?

| O que apareceu | O que fazer |
|---|---|
| **"Falta conectar o banco de dados"** | As chaves estão erradas ou vazias. Acesse `/configurar` no seu site — ele mostra exatamente o que está faltando. |
| **Erro vermelho ao rodar o SQL** | Você colou só um pedaço. Apague tudo e copie o `schema.sql` **inteiro**. |
| **"Esta conta não tem permissão de administrador"** | Rode `select public.promover_admin('seu@email.com');` com o e-mail exato que você cadastrou. |
| **Não consigo criar conta de empresa** | Desligue o *Confirm email* (Etapa 2.6). |
| **Vaga da empresa não aparece no site** | É de propósito: ela fica *pendente* até você aprovar em `/admin/vagas`. |
| **Erro ao enviar currículo** | O `schema.sql` não rodou inteiro — ele é quem cria a pasta dos arquivos. Rode de novo. |
| **Mudei algo e o site não mudou** | Espere 1-2 min (a Vercel republica sozinha) e atualize com **Ctrl+F5**. |
| **A Vercel falhou no deploy** | Clique no deploy que falhou e leia a última linha vermelha. Quase sempre é uma variável de ambiente faltando ou com espaço sobrando. |

---

# 💰 Quanto isso custa?

| Item | Custo |
|---|---|
| GitHub | **R$ 0** |
| Supabase (banco) | **R$ 0** — 500 MB de dados + 1 GB de currículos |
| Vercel (hospedagem) | **R$ 0** — 100 GB de tráfego/mês |
| Cadeado HTTPS | **R$ 0** — automático |
| Domínio próprio | ~R$ 40/ano — **opcional** |

O plano gratuito aguenta **milhares de vagas e currículos** tranquilamente.
Só faz sentido pensar em pagar quando o site já estiver bem movimentado.

---

# 📚 Como o site funciona

### Quem faz o quê

| Pessoa | Onde entra | O que pode fazer |
|---|---|---|
| **Candidato** | Não precisa de conta | Busca vagas e envia currículo (PDF, Word ou foto) |
| **Empresa** | `/entrar` | Publica vagas e vê os currículos que recebeu |
| **Você (admin)** | `/admin/login` | Cadastra vagas, aprova as das empresas, vê tudo |

### O caminho de uma vaga
```
Empresa publica  →  fica PENDENTE  →  você aprova em /admin/vagas  →  PUBLICADA
Você cadastra    →  já sai PUBLICADA na hora
```

### Endereços importantes
- `/` — página inicial
- `/vagas` — busca de vagas
- `/entrar` — login das empresas
- `/cadastro` — empresa cria conta
- `/admin/login` — **seu** login de administrador
- `/configurar` — diagnóstico se algo estiver errado

---

## ✅ Lista de conferência

Vá marcando conforme avança:

- [ ] Conta no GitHub criada
- [ ] Código enviado para o repositório
- [ ] Projeto criado no Supabase
- [ ] `schema.sql` rodado com sucesso
- [ ] Chaves copiadas (URL + Publishable key)
- [ ] *Confirm email* desligado
- [ ] Site publicado na Vercel
- [ ] Site URL configurada no Supabase
- [ ] Usuário admin criado e promovido
- [ ] Consegui entrar em `/admin/login`
- [ ] Cadastrei minha primeira vaga
- [ ] Testei enviar um currículo
- [ ] Troquei o nome e a cor do site

---

**Travou em alguma etapa?** Me diga em qual número você está e o que apareceu
na tela — a gente resolve.
