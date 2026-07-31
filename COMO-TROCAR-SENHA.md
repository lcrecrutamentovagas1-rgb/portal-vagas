# 🔑 Como trocar a senha do administrador

## Por que você não achou o botão

O menu **⋯** existe, mas está **escondido fora da tela**. Repare que na sua
imagem há uma **barra de rolagem horizontal** embaixo da tabela — o botão fica
no fim da linha, depois da coluna *Providers*.

Tem duas formas de resolver. **A segunda é mais fácil.**

---

## ✅ JEITO 1 — Achar o botão escondido

1. Na tabela de usuários, **role para o lado** (arraste a barra cinza de baixo
   até o fim, para a direita)
   - Ou: clique na tabela e use a **seta → do teclado**
   - Ou: segure **Shift** e gire a **rodinha do mouse**
2. Na ponta direita da linha do seu e-mail, vai aparecer o **⋯**
3. Clique nele → **Reset password**

> 💡 **Outra dica:** diminua o zoom do navegador com **Ctrl** + **–**
> (aperte 2 ou 3 vezes). A tela "encolhe" e o botão aparece sem precisar rolar.

### Se mesmo assim não aparecer

Clique **em cima do e-mail** `lcrecrutamentovagas1@gmail.com` para abrir a
página daquele usuário. Lá dentro costuma ter o botão de redefinir senha.

---

## ⭐ JEITO 2 — Pelo SQL (mais fácil e garantido)

Já fizemos isso antes e funcionou. Use o arquivo **`TROCAR-SENHA.sql`**:

1. Abra o arquivo `TROCAR-SENHA.sql`
2. **Na linha 15**, troque `MinhaNovaSenha123` pela senha que você quer:

   ```sql
   v_senha text := 'SuaSenhaForte2026';
   ```

3. Copie **tudo** (Ctrl+A, Ctrl+C)
4. Supabase → **SQL Editor** → **New query** → cole → **Run**
5. Deve aparecer: *🎉 Senha trocada!*
6. Entre no site com a senha nova, numa **janela anônima**

> 🛡️ O script tem uma proteção: se você esquecer de trocar a senha na linha 15,
> ele avisa em vez de deixar a senha de exemplo.

> ⚠️ **Depois de rodar, feche/apague essa query** para a senha não ficar
> guardada na tela do Supabase.

### Dica para uma senha boa

Use uma frase que só você sabe, com número:
`PadariaDoJoao2026` · `MinhaVaga#Top99` · `BeloHorizonte@2026`

Evite: `123456`, `admin`, `senha123`, seu nome, sua data de nascimento.

---

## 👀 Reparei em outra coisa na sua tela

Você tem **duas contas** cadastradas:

| E-mail | O que é |
|---|---|
| `lcrecrutamentovagas1@gmail.com` | ✅ seu administrador |
| `vital.comercial@lcrecrutamento.com.br` | ❓ não sei o que é |

### Se a segunda foi um teste seu

Você pode apagá-la (mesma tabela, menu **⋯** → **Delete user**), ou deixar
como está — ela é apenas uma conta de **empresa** comum, sem poderes de admin.

### Se você quer que ela também seja administradora

Rode no SQL Editor:

```sql
select public.promover_admin('vital.comercial@lcrecrutamento.com.br');
```

### Como saber o que cada conta é

```sql
select * from public.listar_contas();
```

Mostra e-mail, se está confirmado e o papel (admin ou empresa) de cada uma.

---

## ✅ Depois de trocar a senha

- [ ] Anote a senha nova num lugar seguro
- [ ] Teste o login numa janela anônima (`Ctrl+Shift+N`)
- [ ] Apague a pasta `_resolvidos` do projeto
- [ ] Apague/feche a query do SQL Editor onde você digitou a senha
