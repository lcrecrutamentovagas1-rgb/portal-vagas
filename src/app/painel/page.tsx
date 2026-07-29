import Link from "next/link";
import { exigirEmpresa } from "@/lib/auth";
import { criarClienteServidor } from "@/lib/supabase/server";
import { STATUS_VAGA } from "@/lib/site";
import { dataCurta } from "@/lib/format";
import type { Candidatura, Vaga } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Painel da empresa" };

export default async function PainelInicio() {
  const { empresa } = await exigirEmpresa();
  const supabase = await criarClienteServidor();

  const { data: vagasData } = await supabase
    .from("vagas")
    .select("*")
    .order("criado_em", { ascending: false });
  const vagas = (vagasData ?? []) as Vaga[];

  const { data: candData } = await supabase
    .from("candidaturas")
    .select("*, vagas(titulo, empresa_nome)")
    .order("criado_em", { ascending: false })
    .limit(5);
  const candidaturas = (candData ?? []) as Candidatura[];

  const { count: totalCandidaturas } = await supabase
    .from("candidaturas")
    .select("id", { count: "exact", head: true });

  const publicadas = vagas.filter((v) => v.status === "publicada").length;
  const pendentes = vagas.filter((v) => v.status === "pendente").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Olá, {empresa?.nome ?? "empresa"}! 👋
        </h1>
        <p className="mt-1 text-slate-600">
          Acompanhe suas vagas e os currículos recebidos.
        </p>
      </div>

      {!empresa && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Complete o{" "}
          <Link href="/painel/empresa" className="font-semibold underline">
            cadastro da sua empresa
          </Link>{" "}
          para poder publicar vagas.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metrica rotulo="Vagas publicadas" valor={publicadas} cor="text-emerald-600" />
        <Metrica rotulo="Aguardando aprovação" valor={pendentes} cor="text-amber-600" />
        <Metrica rotulo="Total de vagas" valor={vagas.length} cor="text-marca" />
        <Metrica rotulo="Currículos recebidos" valor={totalCandidaturas ?? 0} cor="text-violet-600" />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/painel/vagas/nova" className="btn-primario">
          ➕ Publicar nova vaga
        </Link>
        <Link href="/painel/candidaturas" className="btn-secundario">
          Ver currículos
        </Link>
      </div>

      <section className="cartao p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Vagas recentes</h2>
          <Link href="/painel/vagas" className="text-sm font-semibold text-marca hover:underline">
            Ver todas
          </Link>
        </div>

        {vagas.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            Você ainda não publicou nenhuma vaga.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {vagas.slice(0, 5).map((v) => (
              <li key={v.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <Link href={`/painel/vagas/${v.id}`} className="truncate font-medium text-slate-900 hover:text-marca">
                    {v.titulo}
                  </Link>
                  <p className="text-xs text-slate-500">{dataCurta(v.criado_em)}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_VAGA[v.status]?.cor}`}>
                  {STATUS_VAGA[v.status]?.label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="cartao p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Últimos currículos</h2>
          <Link href="/painel/candidaturas" className="text-sm font-semibold text-marca hover:underline">
            Ver todos
          </Link>
        </div>

        {candidaturas.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            Nenhum currículo recebido ainda.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {candidaturas.map((c) => (
              <li key={c.id} className="flex items-center gap-3 py-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-marca-clara text-sm font-bold text-marca">
                  {c.nome.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900">{c.nome}</p>
                  <p className="truncate text-xs text-slate-500">
                    {c.vagas?.titulo ?? "Vaga"} · {dataCurta(c.criado_em)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Metrica({ rotulo, valor, cor }: { rotulo: string; valor: number; cor: string }) {
  return (
    <div className="cartao p-5">
      <p className="text-sm text-slate-500">{rotulo}</p>
      <p className={`mt-1 text-3xl font-bold ${cor}`}>{valor}</p>
    </div>
  );
}
