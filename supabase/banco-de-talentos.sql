-- =====================================================================
--  🗂️ BANCO DE TALENTOS — permite guardar currículos SEM vaga
--
--  Necessário para importar os currículos do seu Google Drive, já que
--  eles não pertencem a nenhuma vaga específica.
--
--  COMO USAR: Supabase → SQL Editor → New query → cole tudo → RUN
--  Seguro: não apaga nada do que já existe.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Deixa vaga_id opcional (currículo pode existir sem vaga)
-- ---------------------------------------------------------------------
alter table public.candidaturas
  alter column vaga_id drop not null;


-- ---------------------------------------------------------------------
-- 2. Campos novos para o banco de talentos
-- ---------------------------------------------------------------------
alter table public.candidaturas
  add column if not exists origem text not null default 'site',
  add column if not exists area text,
  add column if not exists observacoes text,
  add column if not exists texto_curriculo text;

comment on column public.candidaturas.origem is
  'site = veio de uma vaga | importado = veio do banco de talentos';


-- ---------------------------------------------------------------------
-- 3. O índice antigo impedia o mesmo e-mail sem vaga. Refazendo:
--    - com vaga: 1 candidatura por vaga (como era)
--    - sem vaga: 1 registro por e-mail no banco de talentos
-- ---------------------------------------------------------------------
drop index if exists public.candidaturas_unica_idx;

create unique index if not exists candidaturas_unica_com_vaga_idx
  on public.candidaturas (vaga_id, lower(email))
  where vaga_id is not null;

create unique index if not exists candidaturas_unica_sem_vaga_idx
  on public.candidaturas (lower(email))
  where vaga_id is null;

-- Busca rápida por nome, cargo ou área
create index if not exists candidaturas_busca_idx
  on public.candidaturas (lower(nome));

create index if not exists candidaturas_origem_idx
  on public.candidaturas (origem, criado_em desc);


-- ---------------------------------------------------------------------
-- 4. Segurança: currículos sem vaga só o ADMIN enxerga
--    (empresas continuam vendo apenas os das próprias vagas)
-- ---------------------------------------------------------------------
drop policy if exists "candidatura: empresa dona ou admin ve" on public.candidaturas;
create policy "candidatura: empresa dona ou admin ve" on public.candidaturas
  for select to authenticated using (
    public.is_admin()
    or (
      vaga_id is not null
      and vaga_id in (
        select id from public.vagas where empresa_id = public.minha_empresa_id()
      )
    )
  );

drop policy if exists "candidatura: empresa dona ou admin atualiza" on public.candidaturas;
create policy "candidatura: empresa dona ou admin atualiza" on public.candidaturas
  for update to authenticated using (
    public.is_admin()
    or (
      vaga_id is not null
      and vaga_id in (
        select id from public.vagas where empresa_id = public.minha_empresa_id()
      )
    )
  );

drop policy if exists "candidatura: empresa dona ou admin apaga" on public.candidaturas;
create policy "candidatura: empresa dona ou admin apaga" on public.candidaturas
  for delete to authenticated using (
    public.is_admin()
    or (
      vaga_id is not null
      and vaga_id in (
        select id from public.vagas where empresa_id = public.minha_empresa_id()
      )
    )
  );

-- Só quem está logado pode INSERIR sem vaga (evita lixo vindo da internet)
drop policy if exists "candidatura: qualquer um envia" on public.candidaturas;
create policy "candidatura: qualquer um envia" on public.candidaturas
  for insert to anon, authenticated with check (
    vaga_id is not null      -- visitante só se candidata a uma vaga real
    or public.is_admin()     -- sem vaga = só o admin (importação)
  );


-- ---------------------------------------------------------------------
-- 5. Currículos importados ficam na pasta "banco-de-talentos".
--    Só o admin pode ler/apagar esses arquivos.
-- ---------------------------------------------------------------------
drop policy if exists "curriculo: leitura restrita" on storage.objects;
create policy "curriculo: leitura restrita" on storage.objects
  for select to authenticated using (
    bucket_id = 'curriculos'
    and (
      public.is_admin()
      or (
        (storage.foldername(name))[1] <> 'banco-de-talentos'
        and (storage.foldername(name))[1] ~
            '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        and (storage.foldername(name))[1]::uuid in (
          select id from public.vagas where empresa_id = public.minha_empresa_id()
        )
      )
    )
  );

drop policy if exists "curriculo: exclusao restrita" on storage.objects;
create policy "curriculo: exclusao restrita" on storage.objects
  for delete to authenticated using (
    bucket_id = 'curriculos'
    and (
      public.is_admin()
      or (
        (storage.foldername(name))[1] <> 'banco-de-talentos'
        and (storage.foldername(name))[1] ~
            '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        and (storage.foldername(name))[1]::uuid in (
          select id from public.vagas where empresa_id = public.minha_empresa_id()
        )
      )
    )
  );


-- =====================================================================
--  ✅ Pronto! Agora acesse  /admin/importar  no seu site.
-- =====================================================================
