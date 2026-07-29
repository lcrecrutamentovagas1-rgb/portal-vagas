import Link from "next/link";
import { exigirAdmin } from "@/lib/auth";
import { criarClienteServidor } from "@/lib/supabase/server";
import { STATUS_VAGA } from "@/lib/site";
import { dataCurta, localDaVaga } from "@/lib/format";
import { mudarStatusVaga, excluirVaga, alternarDestaque } from "@/app/actions/vagas";
import { AlertaSucesso } from "@/components/Alerta";
import type { Vaga } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Todas as vagas" };

const FILTROS = [
  { valor: "", rotulo: "Todas" },
  { valor: "pendente", rotulo: "Pendentes" },
  { valor: "publicada", rotulo: "Publicadas" },
  { valor: "pausada", rotulo: "Pausadas" },
  { valor: "encerrada", rotulo: "Encerradas" },
  { valor: "recusada", rotulo: "Recusadas" },
];

export default async function AdminVagas({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; ok?: string }>;
}) {
  const { status, ok } = await searchParams;
  await exigirAdmin();

  const supabase = await criarClienteServidor();
  let consulta = supabase.from("vagas").select("*").order("criado_em", { ascending: false });
  if (status) consulta = consulta.eq("status", status);

  const { data } = await consulta;
  const vagas = (data ?? []) as Vaga[];

  const { data: cands } = await supabase.from("candidaturas").select("vaga_id");
  const contagem = new Map<string, number>();
  (cands ?? []).forEach((c) =>
    contagem.set(c.vaga_id, (contagem.get(c.vaga_id) ?? 0) + 1),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Todas as vagas</h1>
          <p className="mt-1 text-slate-600">{vagas.length} vaga(s)</p>
        </div>
        <Link href="/admin/vagas/nova" className="btn-primario">
          ➕ Cadastrar vaga
        </Link>
      </div>

      {ok && <AlertaSucesso>Vaga salva com sucesso!</AlertaSucesso>}

      <div className="flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <Link
            key={f.valor}
            href={f.valor ? `/admin/vagas?status=${f.valor}` : "/admin/vagas"}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${
              (status ?? "") === f.valor
                ? "border-marca bg-marca text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-marca"
            }`}
          >
            {f.rotulo}
          </Link>
        ))}
      </div>

      {vagas.length === 0 ? (
        <div className="cartao p-12 text-center">
          <p className="text-lg font-semibold text-slate-700">
            Nenhuma vaga encontrada
          </p>
          <Link href="/admin/vagas/nova" className="btn-primario mt-5">
            Cadastrar a primeira vaga
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {vagas.map((v) => (
            <div key={v.id} className="cartao p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-slate-900">{v.titulo}</h2>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_VAGA[v.status]?.cor}`}>
                      {STATUS_VAGA[v.status]?.label}
                    </span>
                    {v.destaque && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                        ⭐ Destaque
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {v.empresa_nome}
                  </p>
                  <p className="text-sm text-slate-500">
                    {localDaVaga(v)} · {dataCurta(v.criado_em)} · {v.visualizacoes} visualizações
                  </p>
                </div>

                <Link
                  href={`/admin/candidaturas?vaga=${v.id}`}
                  className="shrink-0 rounded-lg bg-marca-clara px-3 py-2 text-sm font-semibold text-marca hover:bg-marca hover:text-white"
                >
                  {contagem.get(v.id) ?? 0} currículo(s)
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                <Link href={`/vagas/${v.id}`} target="_blank" className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Ver ↗
                </Link>
                <Link href={`/admin/vagas/${v.id}`} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Editar
                </Link>

                {v.status !== "publicada" && (
                  <Acao id={v.id} status="publicada" rotulo="✓ Publicar" classe="bg-emerald-600 text-white hover:bg-emerald-700" />
                )}
                {v.status === "publicada" && (
                  <Acao id={v.id} status="pausada" rotulo="Pausar" classe="border border-slate-300 text-slate-700 hover:bg-slate-50" />
                )}
                {v.status === "pendente" && (
                  <Acao id={v.id} status="recusada" rotulo="Recusar" classe="border border-slate-300 text-slate-700 hover:bg-slate-50" />
                )}

                <form action={alternarDestaque}>
                  <input type="hidden" name="id" value={v.id} />
                  <input type="hidden" name="destaque" value={String(v.destaque)} />
                  <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    {v.destaque ? "Remover destaque" : "⭐ Destacar"}
                  </button>
                </form>

                <form action={excluirVaga} className="ml-auto">
                  <input type="hidden" name="id" value={v.id} />
                  <button className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50">
                    Excluir
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
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
