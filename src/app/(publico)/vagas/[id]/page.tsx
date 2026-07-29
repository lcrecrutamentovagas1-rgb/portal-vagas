import Link from "next/link";
import { notFound } from "next/navigation";
import FormularioCandidatura from "@/components/FormularioCandidatura";
import CartaoVaga from "@/components/CartaoVaga";
import { criarClienteServidor, supabaseConfigurado } from "@/lib/supabase/server";
import {
  formatarSalario,
  localDaVaga,
  rotuloContrato,
  rotuloModalidade,
  tempoRelativo,
} from "@/lib/format";
import type { Vaga } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!supabaseConfigurado()) return { title: "Vaga" };
  const { id } = await params;
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("vagas")
    .select("titulo, empresa_nome, cidade, estado")
    .eq("id", id)
    .maybeSingle();

  if (!data) return { title: "Vaga não encontrada" };
  return {
    title: `${data.titulo} — ${data.empresa_nome}`,
    description: `Vaga de ${data.titulo} na empresa ${data.empresa_nome}. Candidate-se agora.`,
  };
}

export default async function PaginaVaga({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!supabaseConfigurado()) notFound();

  const { id } = await params;
  const supabase = await criarClienteServidor();

  const { data } = await supabase.from("vagas").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const vaga = data as Vaga;

  // conta visualização (sem travar a página se falhar)
  supabase.rpc("incrementar_visualizacao", { vaga: id }).then(() => {});

  const { data: relacionadas } = await supabase
    .from("vagas")
    .select("*")
    .eq("status", "publicada")
    .neq("id", id)
    .limit(4);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-5 flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/" className="hover:text-marca">Início</Link>
        <span>/</span>
        <Link href="/vagas" className="hover:text-marca">Vagas</Link>
        <span>/</span>
        <span className="truncate text-slate-700">{vaga.titulo}</span>
      </nav>

      {vaga.status !== "publicada" && (
        <div className="mb-5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Esta vaga está com status <strong>{vaga.status}</strong> e ainda não
          aparece na busca pública. Você a vê por ser a empresa dona ou o
          administrador.
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* --------- CONTEÚDO --------- */}
        <article>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-marca-clara text-xl font-bold text-marca">
                {vaga.empresa_nome.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold leading-tight text-slate-900">
                  {vaga.titulo}
                </h1>
                <p className="mt-1 text-[15px] font-medium text-slate-700">
                  {vaga.empresa_nome}
                </p>
                <p className="text-sm text-slate-500">{localDaVaga(vaga)}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="chip">{rotuloModalidade(vaga.modalidade)}</span>
              <span className="chip">{rotuloContrato(vaga.tipo_contrato)}</span>
              {vaga.nivel && <span className="chip">{vaga.nivel}</span>}
              {vaga.area && <span className="chip">{vaga.area}</span>}
              <span className="chip bg-emerald-50 text-emerald-800">
                {formatarSalario(vaga)}
              </span>
              {vaga.vagas_disponiveis > 1 && (
                <span className="chip">{vaga.vagas_disponiveis} vagas</span>
              )}
            </div>

            <p className="mt-4 text-xs text-slate-400">
              {tempoRelativo(vaga.criado_em)} · {vaga.visualizacoes} visualizações
            </p>

            <a href="#candidatar" className="btn-primario mt-5 w-full sm:w-auto sm:px-10 lg:hidden">
              Candidatar-se agora
            </a>
          </div>

          <Secao titulo="Descrição da vaga" texto={vaga.descricao} />
          {vaga.requisitos && <Secao titulo="Requisitos" texto={vaga.requisitos} />}
          {vaga.beneficios && <Secao titulo="Benefícios" texto={vaga.beneficios} />}
        </article>

        {/* --------- FORMULÁRIO --------- */}
        <aside id="candidatar" className="lg:sticky lg:top-20 lg:self-start">
          <FormularioCandidatura vagaId={vaga.id} tituloVaga={vaga.titulo} />
        </aside>
      </div>

      {relacionadas && relacionadas.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            Outras vagas para você
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {(relacionadas as Vaga[]).map((v) => (
              <CartaoVaga key={v.id} vaga={v} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Secao({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="mb-3 text-lg font-bold text-slate-900">{titulo}</h2>
      <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-700">
        {texto}
      </div>
    </section>
  );
}
