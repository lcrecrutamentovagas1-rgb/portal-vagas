# 🎉 Funcionou! E agora?

Seu portal de vagas está **no ar e funcionando**. Aqui está o que fazer, em
ordem de importância.

---

# 🔴 URGENTE — faça hoje (5 minutos)

## 1. Trocar a senha `Admin2026`

Eu criei essa senha para destravar o login, e ela ficou escrita em vários
arquivos nossos. **Troque agora:**

1. Supabase → **Authentication** → **Users**
2. Ache `lcrecrutamentovagas1@gmail.com`
3. Clique nos **três pontinhos ⋯** → **Reset password**
4. Escolha uma senha forte e **anote num lugar seguro**

## 2. Conferir se o banco está completo

Rode o arquivo **`VERIFICAR-TUDO.sql`** no SQL Editor.

Ele checa as tabelas, a pasta de currículos e as regras de segurança.
**Tem que aparecer tudo ✅.** Se algum item vier ❌, rode o
`supabase/schema.sql` inteiro de novo (é seguro, não apaga nada).

> ⚠️ **Isso é importante:** se a pasta de currículos (bucket) não existir, os
> candidatos vão receber erro na hora de anexar o currículo — e você só
> descobriria quando alguém reclamasse.

## 3. Apagar a pasta `_resolvidos`

Movi para lá todos os arquivos que criamos para resolver o problema do login.
Eles contêm a senha `Admin2026`. **Pode apagar a pasta inteira** — não são mais
necessários.

---

# 🟡 IMPORTANTE — faça esta semana

## 4. Testar o site como se fosse um usuário

Faça o caminho completo, do jeito que seus visitantes vão fazer:

### Como administrador
- [ ] Entre em `/admin/login`
- [ ] Clique em **Cadastrar vaga** e publique uma vaga de teste
- [ ] Veja se ela aparece na página inicial do site

### Como candidato (use uma janela anônima)
- [ ] Abra o site e busque a vaga
- [ ] Clique nela e preencha o formulário
- [ ] **Anexe um currículo** (PDF, Word ou uma foto)
- [ ] Envie

### De volta como administrador
- [ ] Vá em **Todos os currículos**
- [ ] Ache o candidato de teste
- [ ] Clique em **Abrir currículo** — o arquivo tem que abrir

> ✅ Se esse caminho todo funcionar, seu site está 100% operacional.

## 5. Personalizar a marca

O site ainda se chama **VagasBR**. Para trocar, edite direto no GitHub:

1. Repositório → pasta **`src`** → **`lib`** → arquivo **`site.ts`**
2. Clique no **lápis ✏️**
3. Mude o nome, a sigla do logo, o slogan e o e-mail
4. **Commit changes**

A Vercel republica sozinha em ~1 minuto.

Para trocar as cores: **`src`** → **`app`** → **`globals.css`**
(as paletas prontas estão no `COMECE-AQUI.md`, Etapa 5).

## 6. Subir as correções para o GitHub

Durante a resolução do problema, corrigi coisas aqui no projeto que **ainda não
estão no site publicado**:

| Arquivo | O que melhorou |
|---|---|
| `src/app/actions/auth.ts` | Mensagens de erro que explicam a causa real |
| `src/components/FormularioLoginAdmin.tsx` | Não apaga mais o e-mail digitado |
| `src/lib/types.ts` | Suporte à correção acima |
| `supabase/schema.sql` | Funções de manutenção protegidas |

**Não é urgente** (o site funciona sem isso), mas ajuda muito se der problema
no futuro. Para cada arquivo: GitHub → navegue até ele → lápis ✏️ → apague
tudo → cole a versão nova → **Commit changes**.

---

# 🟢 DEPOIS — quando quiser crescer

## 7. Comprar um domínio próprio

Hoje seu site é `portal-vagas-....vercel.app`. Um endereço próprio
(`suasvagas.com.br`) passa muito mais credibilidade.

- **Onde:** [registro.br](https://registro.br) — cerca de **R$ 40/ano**
- **Como conectar:** está na Etapa 6 do `COMECE-AQUI.md`
- O cadeado de segurança (HTTPS) é automático e grátis

## 8. Divulgar

Sem vagas, ninguém visita. Sem visitantes, nenhuma empresa anuncia.
**Você quebra esse ciclo cadastrando as primeiras vagas você mesmo:**

1. Cadastre de 10 a 20 vagas reais da sua região (você é o admin, pode digitar
   o nome de qualquer empresa)
2. Divulgue em grupos de WhatsApp e Facebook de emprego da sua cidade
3. Quando começar a receber currículos, procure as empresas: *"tenho X
   candidatos para essa vaga"*

## 9. Melhorias que posso fazer para você

Quando quiser, é só pedir:

| Melhoria | O que faz |
|---|---|
| 📧 **Aviso por e-mail** | Empresa recebe e-mail a cada currículo novo |
| 📱 **Botão de WhatsApp** | Candidato compartilha a vaga com um clique |
| 🔍 **Aparecer no Google** | Otimização para busca (SEO) |
| 📊 **Relatórios** | Vagas mais vistas, candidatos por período |
| 🖼️ **Logo da empresa** | Empresas enviam a própria logomarca |
| ⭐ **Vagas patrocinadas** | Cobrar para destacar vagas (monetização) |

---

# 📚 Guia rápido do dia a dia

## Endereços

| Endereço | Para quem |
|---|---|
| `/` | Página inicial |
| `/vagas` | Busca de vagas |
| `/admin/login` | **Você** (administrador) |
| `/entrar` | Empresas |
| `/cadastro` | Empresa cria conta |

## Suas tarefas de rotina

**Aprovar vagas das empresas**
Toda vaga enviada por empresa fica *pendente* até você aprovar.
→ `/admin/vagas` → filtro **Pendentes** → **✓ Publicar**

**Cadastrar vagas você mesmo**
→ `/admin` → **Cadastrar vaga** (sai publicada na hora)

**Destacar uma vaga**
→ `/admin/vagas` → **⭐ Destacar** (aparece primeiro na home)

**Ver currículos**
→ `/admin/candidaturas` → clique no candidato → **Abrir currículo**

---

# 🆘 Problemas comuns

| Problema | Solução |
|---|---|
| Esqueci a senha de admin | Supabase → Authentication → Users → ⋯ → Reset password |
| Vaga de empresa não aparece | Está *pendente*: aprove em `/admin/vagas` |
| Erro ao anexar currículo | Rode `VERIFICAR-TUDO.sql`: a pasta do bucket deve estar ✅ |
| Mudei algo e o site não mudou | Espere 2 min e atualize com **Ctrl+F5** |
| Login parou de funcionar | Confira se o projeto Supabase não pausou (planos grátis pausam sem uso) |

> 💡 **Evite que o Supabase pause:** entre no painel dele pelo menos uma vez a
> cada 7 dias. Projetos gratuitos pausam após dias de inatividade — foi um dos
> riscos que investigamos.

---

## ✅ Sua lista de hoje

- [ ] Trocar a senha `Admin2026`
- [ ] Rodar o `VERIFICAR-TUDO.sql` (tudo ✅?)
- [ ] Apagar a pasta `_resolvidos`
- [ ] Cadastrar uma vaga de teste
- [ ] Enviar um currículo de teste e abri-lo no painel

Quando terminar, me conte como foi — e diga qual melhoria quer primeiro.
