# 📥 Importar os currículos do seu Google Drive

Sim, dá para fazer! Seu site agora tem um **importador em lote** que lê nome,
e-mail e telefone de dentro de cada currículo automaticamente.

> ⚠️ **Uma limitação honesta:** eu não consigo acessar seu Google Drive
> (não tenho como fazer login na sua conta). Mas você baixa a pasta inteira
> com 3 cliques, e o site faz todo o resto.

---

## 🔧 PASSO 1 — Preparar o banco (uma vez só)

Os currículos do seu Drive não pertencem a nenhuma vaga, então o banco precisa
aceitar currículos "soltos".

1. Supabase → **SQL Editor** → **New query**
2. Abra o arquivo **`supabase/banco-de-talentos.sql`**, copie tudo e cole
3. Clique em **Run**

✅ Seguro: não apaga nada do que já existe.

---

## 📂 PASSO 2 — Baixar a pasta do Google Drive

1. Abra o **Google Drive** no computador
2. Clique com o **botão direito** na pasta dos currículos
3. Escolha **Fazer download**
   - O Drive compacta tudo num arquivo `.zip` (pode demorar se forem muitos)
4. Na pasta **Downloads**, clique com o botão direito no `.zip`
5. Escolha **Extrair tudo** → **Extrair**

Agora você tem uma pasta comum com todos os currículos.

---

## 🚀 PASSO 3 — Importar no site

1. Entre no site → **`/admin/importar`**
   *(ou menu lateral → **📥 Importar currículos**)*
2. Clique em **Selecionar currículos**
3. Abra a pasta que você extraiu
4. Selecione **todos** os arquivos: clique em um e aperte **Ctrl + A**
5. Clique em **Abrir**

O site vai ler um por um e mostrar o que encontrou.

---

## ✏️ PASSO 4 — Conferir e corrigir

Cada currículo aparece numa ficha, com uma etiqueta de confiança:

| Etiqueta | O que significa |
|---|---|
| 🟢 **✓ ok** | Achou nome e e-mail — provavelmente está certo |
| 🟡 **⚠ confira** | Achou parte dos dados — dê uma olhada |
| 🔴 **✗ revise** | Não conseguiu ler — preencha à mão |

**Todos os campos são editáveis.** Corrija o que estiver errado direto ali.

Campos em **vermelho** estão vazios e são obrigatórios (nome e e-mail).
Sem eles, o candidato não é importado.

> 💡 Se um currículo estiver muito bagunçado, é só **desmarcar a caixinha**
> dele e seguir com os outros.

Quando terminar, clique em **Importar X currículo(s)**.

---

## 🔍 PASSO 5 — Usar o banco de talentos

Vá em **🗂️ Banco de talentos** no menu lateral.

Lá você pode:
- **Buscar** por nome, cargo, cidade — e até por **palavras de dentro do
  currículo** (ex.: buscar "Excel" acha quem tem Excel no currículo)
- **Filtrar por área**
- **Abrir o currículo** original com um clique
- **Mudar o status** de cada candidato (Em análise, Entrevista, Aprovado...)

---

## ❓ Dúvidas comuns

**O que ele consegue ler?**

| Tipo | Lê os dados sozinho? |
|---|---|
| PDF com texto | ✅ Sim |
| Word (.docx) | ✅ Sim |
| PDF escaneado (foto) | ❌ Não — preencha à mão |
| Foto (JPG/PNG) | ❌ Não — preencha à mão |

> Mesmo quando não consegue ler, o **arquivo é guardado normalmente**. Você só
> digita os dados.

**E se o mesmo currículo já tiver sido importado?**
O sistema detecta pelo e-mail e ignora, sem duplicar. Ele avisa quantos foram
pulados.

**Quantos posso importar de uma vez?**
Até 200 por lote. Se tiver mais, faça em partes.

**Isso é seguro? Meus currículos vão parar em algum lugar estranho?**
Não. A leitura acontece **dentro do seu navegador**, e os arquivos vão direto
para o **seu** Supabase. Não passam por nenhum outro servidor.

**As empresas vão ver esses currículos?**
Não. Currículos do banco de talentos são **exclusivos do administrador**.
As empresas só veem os candidatos das próprias vagas. Isso está garantido nas
regras de segurança do banco.

---

## ⚖️ Um cuidado importante (LGPD)

Esses currículos são de pessoas reais e você passa a ser responsável por eles.
Na prática:

- ✅ **Pode:** guardar e usar para recrutamento — foi para isso que enviaram
- ✅ **Deve:** atender quem pedir para ser removido do banco
- ❌ **Não pode:** vender, repassar ou usar para outra finalidade

Sugestão: quando repassar um candidato para uma empresa, avise a pessoa. Além
de ser o certo, gera confiança.

---

## 🆘 Se algo der errado

| Problema | Solução |
|---|---|
| "Falta preparar o banco" | Rode o `banco-de-talentos.sql` (Passo 1) |
| Não lê nenhum dado | O PDF deve ser escaneado — preencha à mão |
| Erro ao enviar arquivo | Confira se o arquivo tem menos de 10 MB |
| Nome vem errado | Edite direto no campo antes de importar |
| Página não abre | Faça o deploy das mudanças no GitHub/Vercel |

---

## 📤 Para funcionar no site publicado

Estas novidades estão aqui no projeto, mas **ainda não no site da Vercel**.
Você precisa enviar os arquivos novos para o GitHub:

**Arquivos novos:**
- `src/lib/extrair-dados.ts`
- `src/app/actions/importar.ts`
- `src/app/admin/importar/page.tsx`
- `src/app/admin/talentos/page.tsx`
- `src/components/ImportadorCurriculos.tsx`
- `supabase/banco-de-talentos.sql`

**Arquivos alterados:**
- `src/app/admin/layout.tsx`
- `src/components/ListaCandidaturas.tsx`
- `src/lib/types.ts`
- `package.json` e `package-lock.json` *(bibliotecas de leitura de PDF/Word)*

**Como enviar:** GitHub → **Add file** → **Upload files** → arraste os arquivos
(mantendo as pastas) → **Commit changes**. A Vercel republica sozinha.

> 💬 Se preferir, me peça que eu monte um passo a passo detalhado desse envio.
