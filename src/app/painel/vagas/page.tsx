import Link from "next/link";
import { exigirEmpresa } from "@/lib/auth";
import { criarClienteServidor } from "@/lib/supabase/server";
import { STATUS_VAGA } from "@/lib/site";
import { dataCurta, localDaVaga } from "@/lib/format";
import { mudarStatusVaga, excluirVaga } from "@/app/actions/vagas";
import { AlertaSucesso } from "@/components/Alerta";
import type { Vaga } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Minhas vagas" };

export default async function MinhasVagas({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  await exigirEmpresa();

  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("vagas")
    .select("*")
    .order("criado_em", { ascending: false });
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
          <h1 className="text-2xl font-bold text-slate-900">Minhas vagas</h1>
          <p className="mt-1 text-slate-600">{vagas.length} vaga(s) cadastrada(s)</p>
        </div>
        <Link href="/painel/vagas/nova" className="btn-primario">
          ➕ Nova vaga
        </Link>
      </div>

      {ok && <AlertaSucesso>Vaga salva com sucesso!</AlertaSucesso>}

      {vagas.length === 0 ? (
        <div className="cartao p-12 text-center">
          <p className="text-lg font-semibold text-slate-700">
            Você ainda não publicou vagas
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Publique a primeira e comece a receber currículos.
          </p>
          <Link href="/painel/vagas/nova" className="btn-primario mt-5">
            Publicar vaga
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {vagas.map((v) => {
            const qtd = contagem.get(v.id) ?? 0;
            return (
              <div key={v.id} className="cartao p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-slate-900">{v.titulo}</h2>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_VAGA[v.status]?.cor}`}>
                        {STATUS_VAGA[v.status]?.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {localDaVaga(v)} · criada em {dataCurta(v.criado_em)} ·{" "}
                      {v.visualizacoes} visualizações
                    </p>
                  </div>

                  <Link
                    href={`/painel/candidaturas?vaga=${v.id}`}
                    className="shrink-0 rounded-lg bg-marca-clara px-3 py-2 text-sm font-semibold text-marca hover:bg-marca hover:text-white"
                  >
                    {qtd} currículo(s)
                  </Link>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                  <Link href={`/vagas/${v.id}`} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Ver página
                  </Link>
                  <Link href={`/painel/vagas/${v.id}`} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Editar
                  </Link>

                  {v.status === "publicada" && (
                    <BotaoStatus id={v.id} status="pausada" rotulo="Pausar" />
                  )}
                  {(v.status === "pausada" || v.status === "encerrada") && (
                    <BotaoStatus id={v.id} status="publicada" rotulo="Reativar" />
                  )}
                  {v.status !== "encerrada" && v.status !== "pendente" && (
                    <BotaoStatus id={v.id} status="encerrada" rotulo="Encerrar" />
                  )}

                  <form action={excluirVaga} className="ml-auto">
                    <input type="hidden" name="id" value={v.id} />
                    <button className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50">
                      Excluir
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BotaoStatus({ id, status, rotulo }: { id: string; status: string; rotulo: string }) {
  return (
    <form action={mudarStatusVaga}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
        {rotulo}
      </button>
    </form>
  );
}
