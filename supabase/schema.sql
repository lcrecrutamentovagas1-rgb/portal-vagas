-- =====================================================================
--  PORTAL DE VAGAS - ESTRUTURA DO BANCO DE DADOS (Supabase / PostgreSQL)
--  Cole este arquivo inteiro no SQL Editor do Supabase e clique em RUN.
--  Pode rodar mais de uma vez sem quebrar nada.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. TABELA DE PERFIS (todo usuário que loga tem um perfil)
--    role = 'empresa' ou 'admin'
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users on delete cascade,
  email      text,
  nome       text,
  role       text not null default 'empresa' check (role in ('empresa', 'admin')),
  criado_em  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 2. EMPRESAS
-- ---------------------------------------------------------------------
create table if not exists public.empresas (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid unique references auth.users on delete cascade,
  nome       text not null,
  cnpj       text,
  site       text,
  telefone   text,
  cidade     text,
  estado     text,
  sobre      text,
  logo_url   text,
  criado_em  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3. VAGAS
-- ---------------------------------------------------------------------
create table if not exists public.vagas (
  id                 uuid primary key default gen_random_uuid(),
  empresa_id         uuid references public.empresas on delete cascade,
  criado_por         uuid references auth.users on delete set null,
  empresa_nome       text not null,
  titulo             text not null,
  descricao          text not null,
  requisitos         text,
  beneficios         text,
  area               text,
  nivel              text,
  cidade             text,
  estado             text,
  modalidade         text not null default 'presencial'
                     check (modalidade in ('presencial', 'hibrido', 'remoto')),
  tipo_contrato      text not null default 'clt'
                     check (tipo_contrato in ('clt', 'pj', 'estagio', 'temporario', 'freelancer', 'trainee', 'aprendiz')),
  salario_min        numeric,
  salario_max        numeric,
  salario_combinar   boolean not null default true,
  vagas_disponiveis  integer not null default 1,
  email_contato      text,
  status             text not null default 'pendente'
                     check (status in ('pendente', 'publicada', 'pausada', 'encerrada', 'recusada')),
  destaque           boolean not null default false,
  visualizacoes      integer not null default 0,
  criado_em          timestamptz not null default now(),
  atualizado_em      timestamptz not null default now()
);

create index if not exists vagas_status_idx     on public.vagas (status, criado_em desc);
create index if not exists vagas_empresa_idx    on public.vagas (empresa_id);
create index if not exists vagas_modalidade_idx on public.vagas (modalidade);

-- ---------------------------------------------------------------------
-- 4. CANDIDATURAS (currículo do candidato)
--    O candidato NÃO precisa de login: preenche os dados e anexa o arquivo.
-- ---------------------------------------------------------------------
create table if not exists public.candidaturas (
  id             uuid primary key default gen_random_uuid(),
  vaga_id        uuid not null references public.vagas on delete cascade,
  nome           text not null,
  email          text not null,
  telefone       text,
  cidade         text,
  estado         text,
  linkedin       text,
  cargo_atual    text,
  pretensao      numeric,
  mensagem       text,
  curriculo_url  text,           -- caminho do arquivo no Storage
  curriculo_nome text,           -- nome original do arquivo
  status         text not null default 'nova'
                 check (status in ('nova', 'em_analise', 'entrevista', 'aprovada', 'reprovada')),
  criado_em      timestamptz not null default now()
);

create index if not exists candidaturas_vaga_idx on public.candidaturas (vaga_id, criado_em desc);

-- Impede que a mesma pessoa se candidate duas vezes à mesma vaga
create unique index if not exists candidaturas_unica_idx
  on public.candidaturas (vaga_id, lower(email));

-- ---------------------------------------------------------------------
-- 5. FUNÇÃO AUXILIAR: o usuário logado é admin?
--    (security definer evita recursão infinita nas policies)
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Empresa (id) do usuário logado
create or replace function public.minha_empresa_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select id from public.empresas where user_id = auth.uid() limit 1;
$$;

-- ---------------------------------------------------------------------
-- 6. TRIGGER: ao criar usuário, cria o perfil (e a empresa, se for empresa)
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text := coalesce(new.raw_user_meta_data ->> 'role', 'empresa');
begin
  insert into public.profiles (id, email, nome, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'nome', new.email),
    v_role
  )
  on conflict (id) do nothing;

  if v_role = 'empresa' then
    insert into public.empresas (user_id, nome, cnpj, telefone, cidade, estado)
    values (
      new.id,
      coalesce(new.raw_user_meta_data ->> 'empresa_nome', new.email),
      new.raw_user_meta_data ->> 'cnpj',
      new.raw_user_meta_data ->> 'telefone',
      new.raw_user_meta_data ->> 'cidade',
      new.raw_user_meta_data ->> 'estado'
    )
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Atualiza automaticamente o campo atualizado_em das vagas
create or replace function public.touch_vaga()
returns trigger language plpgsql as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists vagas_touch on public.vagas;
create trigger vagas_touch before update on public.vagas
  for each row execute function public.touch_vaga();

-- Contador de visualizações (usado na página da vaga)
create or replace function public.incrementar_visualizacao(vaga uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.vagas set visualizacoes = visualizacoes + 1 where id = vaga;
$$;

-- ---------------------------------------------------------------------
-- 7. SEGURANÇA (Row Level Security)
-- ---------------------------------------------------------------------
alter table public.profiles     enable row level security;
alter table public.empresas     enable row level security;
alter table public.vagas        enable row level security;
alter table public.candidaturas enable row level security;

-- ---------- PROFILES ----------
drop policy if exists "perfil: ver o proprio ou admin ve todos" on public.profiles;
create policy "perfil: ver o proprio ou admin ve todos" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "perfil: editar o proprio" on public.profiles;
create policy "perfil: editar o proprio" on public.profiles
  for update using (id = auth.uid() or public.is_admin());

-- ---------- EMPRESAS ----------
drop policy if exists "empresa: leitura publica" on public.empresas;
create policy "empresa: leitura publica" on public.empresas
  for select using (true);

drop policy if exists "empresa: dono ou admin edita" on public.empresas;
create policy "empresa: dono ou admin edita" on public.empresas
  for update using (user_id = auth.uid() or public.is_admin());

drop policy if exists "empresa: criar" on public.empresas;
create policy "empresa: criar" on public.empresas
  for insert to authenticated with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "empresa: admin apaga" on public.empresas;
create policy "empresa: admin apaga" on public.empresas
  for delete using (public.is_admin());

-- ---------- VAGAS ----------
drop policy if exists "vaga: publicadas sao publicas" on public.vagas;
create policy "vaga: publicadas sao publicas" on public.vagas
  for select using (
    status = 'publicada'
    or public.is_admin()
    or empresa_id = public.minha_empresa_id()
  );

drop policy if exists "vaga: empresa ou admin cria" on public.vagas;
create policy "vaga: empresa ou admin cria" on public.vagas
  for insert to authenticated with check (
    public.is_admin() or empresa_id = public.minha_empresa_id()
  );

drop policy if exists "vaga: empresa ou admin edita" on public.vagas;
create policy "vaga: empresa ou admin edita" on public.vagas
  for update to authenticated using (
    public.is_admin() or empresa_id = public.minha_empresa_id()
  );

drop policy if exists "vaga: empresa ou admin apaga" on public.vagas;
create policy "vaga: empresa ou admin apaga" on public.vagas
  for delete to authenticated using (
    public.is_admin() or empresa_id = public.minha_empresa_id()
  );

-- ---------- CANDIDATURAS ----------
-- Qualquer visitante pode se candidatar...
drop policy if exists "candidatura: qualquer um envia" on public.candidaturas;
create policy "candidatura: qualquer um envia" on public.candidaturas
  for insert to anon, authenticated with check (true);

-- ...mas só a empresa dona da vaga (ou o admin) enxerga os dados.
drop policy if exists "candidatura: empresa dona ou admin ve" on public.candidaturas;
create policy "candidatura: empresa dona ou admin ve" on public.candidaturas
  for select to authenticated using (
    public.is_admin()
    or vaga_id in (select id from public.vagas where empresa_id = public.minha_empresa_id())
  );

drop policy if exists "candidatura: empresa dona ou admin atualiza" on public.candidaturas;
create policy "candidatura: empresa dona ou admin atualiza" on public.candidaturas
  for update to authenticated using (
    public.is_admin()
    or vaga_id in (select id from public.vagas where empresa_id = public.minha_empresa_id())
  );

drop policy if exists "candidatura: empresa dona ou admin apaga" on public.candidaturas;
create policy "candidatura: empresa dona ou admin apaga" on public.candidaturas
  for delete to authenticated using (
    public.is_admin()
    or vaga_id in (select id from public.vagas where empresa_id = public.minha_empresa_id())
  );

-- ---------------------------------------------------------------------
-- 8. STORAGE: bucket dos currículos (PDF, DOC, DOCX, JPG, PNG)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'curriculos', 'curriculos', false, 10485760,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg', 'image/png', 'image/webp', 'image/heic'
  ]
)
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Qualquer candidato (mesmo sem login) pode ANEXAR o currículo.
-- O bucket já limita o tamanho (10 MB) e os formatos aceitos.
drop policy if exists "curriculo: envio publico" on storage.objects;
create policy "curriculo: envio publico" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'curriculos');

-- Mas só LÊ quem tem direito: o admin, ou a empresa dona daquela vaga.
-- O arquivo é salvo como  {vaga_id}/{arquivo}, então a 1ª pasta identifica a vaga.
drop policy if exists "curriculo: leitura autenticada" on storage.objects;
drop policy if exists "curriculo: leitura restrita" on storage.objects;
create policy "curriculo: leitura restrita" on storage.objects
  for select to authenticated using (
    bucket_id = 'curriculos'
    and (
      public.is_admin()
      or (storage.foldername(name))[1]::uuid in (
        select id from public.vagas where empresa_id = public.minha_empresa_id()
      )
    )
  );

-- Apagar currículo: só admin ou a empresa dona da vaga.
drop policy if exists "curriculo: exclusao restrita" on storage.objects;
create policy "curriculo: exclusao restrita" on storage.objects
  for delete to authenticated using (
    bucket_id = 'curriculos'
    and (
      public.is_admin()
      or (storage.foldername(name))[1]::uuid in (
        select id from public.vagas where empresa_id = public.minha_empresa_id()
      )
    )
  );

-- ---------------------------------------------------------------------
-- 9. ATALHO PARA CRIAR O ADMINISTRADOR
-- ---------------------------------------------------------------------
create or replace function public.promover_admin(p_email text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  select id into v_id from auth.users where lower(email) = lower(p_email);

  if v_id is null then
    return 'Usuário não encontrado. Crie-o antes em Authentication > Users > Add user.';
  end if;

  insert into public.profiles (id, email, nome, role)
  values (v_id, p_email, p_email, 'admin')
  on conflict (id) do update set role = 'admin';

  -- remove a "empresa" criada automaticamente para esta conta
  delete from public.empresas
  where user_id = v_id
    and not exists (select 1 from public.vagas where empresa_id = empresas.id);

  return p_email || ' agora é ADMINISTRADOR. Acesse /admin/login';
end;
$$;

-- =====================================================================
-- 10. COMO CRIAR O SEU ADMINISTRADOR
--
--   a) Authentication > Users > Add user  (marque "Auto Confirm User")
--   b) Volte aqui no SQL Editor, troque o e-mail e rode:
--
--        select public.promover_admin('seu@email.com');
--
--   c) Pronto! Entre em  /admin/login
-- =====================================================================
