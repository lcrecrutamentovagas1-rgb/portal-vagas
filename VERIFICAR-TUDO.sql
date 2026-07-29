-- =====================================================================
--  🩺 CHECK-UP COMPLETO — está tudo pronto para usar?
--
--  Verifica se as tabelas, a pasta de currículos e as regras de
--  segurança foram criadas direitinho.
--
--  COMO USAR: SQL Editor → New query → cole tudo → RUN
--  Leia a coluna "situacao": tem que ser tudo ✅
-- =====================================================================

select 'Tabela: vagas' as item,
  case when to_regclass('public.vagas') is not null
       then '✅ ok' else '❌ FALTA — rode o schema.sql' end as situacao
union all
select 'Tabela: empresas',
  case when to_regclass('public.empresas') is not null
       then '✅ ok' else '❌ FALTA — rode o schema.sql' end
union all
select 'Tabela: candidaturas',
  case when to_regclass('public.candidaturas') is not null
       then '✅ ok' else '❌ FALTA — rode o schema.sql' end
union all
select 'Tabela: profiles',
  case when to_regclass('public.profiles') is not null
       then '✅ ok' else '❌ FALTA — rode o schema.sql' end
union all

-- A pasta dos currículos precisa existir, senão o envio falha
select 'Pasta dos currículos (bucket)',
  case when exists (select 1 from storage.buckets where id = 'curriculos')
       then '✅ ok' else '❌ FALTA — rode o schema.sql inteiro' end
union all
select 'Currículos são privados?',
  case when exists (select 1 from storage.buckets
                    where id = 'curriculos' and public = false)
       then '✅ sim (seguro)' else '⚠️ estão públicos — rode o schema.sql' end
union all

-- Segurança das tabelas (RLS)
select 'Segurança RLS: vagas',
  case when (select relrowsecurity from pg_class where oid = 'public.vagas'::regclass)
       then '✅ ligada' else '🚨 DESLIGADA — rode o schema.sql' end
union all
select 'Segurança RLS: candidaturas',
  case when (select relrowsecurity from pg_class where oid = 'public.candidaturas'::regclass)
       then '✅ ligada' else '🚨 DESLIGADA — rode o schema.sql' end
union all
select 'Regras de acesso aos currículos',
  case when (select count(*) from pg_policies
             where schemaname = 'storage' and policyname like 'curriculo%') >= 3
       then '✅ ok' else '❌ FALTAM — rode o schema.sql' end
union all

-- Conteúdo
select 'Administradores cadastrados',
  coalesce((select count(*)::text from public.profiles where role = 'admin'), '0')
  || ' conta(s)'
union all
select 'Vagas publicadas',
  coalesce((select count(*)::text from public.vagas where status = 'publicada'), '0')
union all
select 'Vagas aguardando aprovação',
  coalesce((select count(*)::text from public.vagas where status = 'pendente'), '0')
union all
select 'Currículos recebidos',
  coalesce((select count(*)::text from public.candidaturas), '0')
union all
select 'Empresas cadastradas',
  coalesce((select count(*)::text from public.empresas), '0');


-- =====================================================================
--  Se aparecer algum ❌ ou 🚨:
--     → Rode o arquivo supabase/schema.sql INTEIRO de novo.
--       Ele é seguro: não apaga vagas nem currículos já existentes.
-- =====================================================================
