-- =====================================================================
--  🔑 TROCAR A SENHA DO ADMINISTRADOR
--
--  COMO USAR:
--    1. Na linha 15, troque  MinhaNovaSenha123  pela senha que você quer
--       (mínimo 6 caracteres — capriche, é a senha de dono do site)
--    2. Supabase → SQL Editor → New query → cole tudo → RUN
--    3. Entre no site com a senha nova
-- =====================================================================

do $$
declare
  v_id    uuid;
  v_email text := 'lcrecrutamentovagas1@gmail.com';

  -- 👇 TROQUE AQUI PELA SUA SENHA NOVA 👇
  v_senha text := 'MinhaNovaSenha123';

begin
  if length(v_senha) < 6 then
    raise exception 'A senha precisa ter pelo menos 6 caracteres.';
  end if;

  if v_senha = 'MinhaNovaSenha123' then
    raise exception
      'Você esqueceu de trocar a senha na linha 15! Escolha uma senha sua.';
  end if;

  select u.id into v_id
  from auth.users u
  where lower(u.email) = lower(trim(v_email));

  if v_id is null then
    raise exception 'Não existe conta com o e-mail %', v_email;
  end if;

  -- Grava a senha nova (o Supabase guarda criptografada)
  begin
    update auth.users
       set encrypted_password = extensions.crypt(v_senha, extensions.gen_salt('bf')),
           updated_at         = now()
     where id = v_id;
  exception
    when undefined_function or invalid_schema_name then
      update auth.users
         set encrypted_password = crypt(v_senha, gen_salt('bf')),
             updated_at         = now()
       where id = v_id;
  end;
end $$;


-- ---------- Conferência ----------
select
  u.email                          as email,
  coalesce(p.role, '(sem perfil)') as papel,
  '🎉 Senha trocada! Entre com a senha nova numa janela anônima.' as resultado
from auth.users u
left join public.profiles p on p.id = u.id
where lower(u.email) = lower('lcrecrutamentovagas1@gmail.com');


-- =====================================================================
--  ⚠️ DEPOIS DE RODAR:
--     Apague esta query do SQL Editor (ou feche a aba), para a senha
--     não ficar salva na tela do Supabase.
-- =====================================================================
