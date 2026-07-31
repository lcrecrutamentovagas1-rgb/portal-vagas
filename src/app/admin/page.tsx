import Link from "next/link";
import { exigirAdmin } from "@/lib/auth";
import { criarClienteServidor } from "@/lib/supabase/server";
import { STATUS_VAGA } from "@/lib/site";
import { dataCurta } from "@/lib/format";
import { mudarStatusVaga } from "@/app/actions/vagas";
import type { Candidatura, Vaga } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Administração" };

export default async function AdminInicio() {
  await exigirAdmin();
  const supabase = await criarClienteServidor();

  const [
    { data: vagasData },
    { count: totalCandidaturas },
    { count: totalEmpresas },
    { data: ultimas },
  ] = await Promise.all([
    supabase.from("vagas").select("*").order("criado_em", { ascending: false }),
    supabase.from("candidaturas").select("id", { count: "exact", head: true }),
    supabase.from("empresas").select("id", { count: "exact", head: true }),
    supabase
      .from("candidaturas")
      .select("*, vagas(titulo, empresa_nome)")
      .order("criado_em", { ascending: false })
      .limit(6),
  ]);

  const vagas = (vagasData ?? []) as Vaga[];
  const pendentes = vagas.filter((v) => v.status === "pendente");
  const publicadas = vagas.filter((v) => v.status === "publicada").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Visão geral</h1>
        <p className="mt-1 text-slate-600">
          Tudo o que acontece no portal em um só lugar.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metrica rotulo="Vagas publicadas" valor={publicadas} cor="text-emerald-600" />
        <Metrica rotulo="Aguardando aprovação" valor={pendentes.length} cor="text-amber-600" destaque={pendentes.length > 0} />
        <Metrica rotulo="Empresas" valor={totalEmpresas ?? 0} cor="text-marca" />
        <Metrica rotulo="Currículos recebidos" valor={totalCandidaturas ?? 0} cor="text-violet-600" />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/vagas/nova" className="btn-primario">
          ➕ Cadastrar vaga
        </Link>
        <Link href="/admin/vagas?status=pendente" className="btn-secundario">
          Revisar pendentes ({pendentes.length})
        </Link>
      </div>

      {/* --------- APROVAÇÕES --------- */}
      <section className="cartao p-5">
        <h2 className="mb-4 font-bold text-slate-900">
          Vagas aguardando aprovação
        </h2>

        {pendentes.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            Nenhuma vaga pendente. Tudo em dia! ✅
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {pendentes.slice(0, 8).map((v) => (
              <li key={v.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/vagas/${v.id}`} className="truncate font-medium text-slate-900 hover:text-marca">
                    {v.titulo}
                  </Link>
                  <p className="truncate text-xs text-slate-500">
                    {v.empresa_nome} · {dataCurta(v.criado_em)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Acao id={v.id} status="publicada" rotulo="Aprovar" classe="bg-emerald-600 text-white hover:bg-emerald-700" />
                  <Acao id={v.id} status="recusada" rotulo="Recusar" classe="border border-slate-300 text-slate-700 hover:bg-slate-50" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* --------- ÚLTIMOS CURRÍCULOS --------- */}
      <section className="cartao p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Últimos currículos</h2>
          <Link href="/admin/candidaturas" className="text-sm font-semibold text-marca hover:underline">
            Ver todos
          </Link>
        </div>

        {!ultimas || ultimas.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            Nenhum currículo recebido ainda.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {(ultimas as Candidatura[]).map((c) => (
              <li key={c.id} className="flex items-center gap-3 py-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-marca-clara text-sm font-bold text-marca">
                  {c.nome.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900">{c.nome}</p>
                  <p className="truncate text-xs text-slate-500">
                    {c.vagas?.titulo} — {c.vagas?.empresa_nome}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-slate-400">
                  {dataCurta(c.criado_em)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* --------- TODAS AS VAGAS --------- */}
      <section className="cartao p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Vagas recentes</h2>
          <Link href="/admin/vagas" className="text-sm font-semibold text-marca hover:underline">
            Gerenciar
          </Link>
        </div>

        {vagas.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            Nenhuma vaga cadastrada.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {vagas.slice(0, 6).map((v) => (
              <li key={v.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900">{v.titulo}</p>
                  <p className="truncate text-xs text-slate-500">{v.empresa_nome}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_VAGA[v.status]?.cor}`}>
                  {STATUS_VAGA[v.status]?.label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Metrica({
  rotulo,
  valor,
  cor,
  destaque,
}: {
  rotulo: string;
  valor: number;
  cor: string;
  destaque?: boolean;
}) {
  return (
    <div className={`cartao p-5 ${destaque ? "border-amber-400 bg-amber-50" : ""}`}>
      <p className="text-sm text-slate-500">{rotulo}</p>
      <p className={`mt-1 text-3xl font-bold ${cor}`}>{valor}</p>
    </div>
  );
}

function Acao({
  id,
  status,
  rotulo,
  classe,
}: {
  id: string;
  status: string;
  rotulo: string;
  classe: string;
}) {
  return (
    <form action={mudarStatusVaga}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${classe}`}>
        {rotulo}
      </button>
    </form>
  );
}
