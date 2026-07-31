import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirAdmin } from "@/lib/auth";
import { criarClienteServidor } from "@/lib/supabase/server";
import { rankearCandidatos } from "@/lib/compatibilidade";
import ListaRankeada from "@/components/ListaRankeada";
import { localDaVaga, rotuloModalidade } from "@/lib/format";
import type { Candidatura, Vaga } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Melhores candidatos" };

export default async function MelhoresCandidatos({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ incluir_talentos?: string }>;
}) {
  await exigirAdmin();
  const { id } = await params;
  const { incluir_talentos } = await searchParams;
  const usarTalentos = incluir_talentos !== "0";

  const supabase = await criarClienteServidor();

  const { data: vagaData } = await supabase
    .from("vagas")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!vagaData) notFound();
  const vaga = vagaData as Vaga;

  // Quem se candidatou a esta vaga
  const { data: inscritos } = await supabase
    .from("candidaturas")
    .select("*")
    .eq("vaga_id", id);

  // Banco de talentos (currículos sem vaga)
  const { data: talentos } = usarTalentos
    ? await supabase.from("candidaturas").select("*").is("vaga_id", null).limit(500)
    : { data: [] };

  const todos = [
    ...((inscritos ?? []) as Candidatura[]),
    ...((talentos ?? []) as Candidatura[]),
  ];

  const rankeados = rankearCandidatos(todos, vaga);
  const altas = rankeados.filter((c) => c.compatibilidade.faixa === "alta").length;

  return (
    <div className="space-y-5">
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/admin/vagas" className="hover:text-marca">Vagas</Link>
        <span>/</span>
        <span className="truncate text-slate-700">{vaga.titulo}</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Melhores candidatos
        </h1>
        <p className="mt-1 text-slate-600">
          Para a vaga <strong>{vaga.titulo}</strong> — {vaga.empresa_nome} ·{" "}
          {localDaVaga(vaga)} · {rotuloModalidade(vaga.modalidade)}
        </p>
      </div>

      {/* Aviso honesto sobre o que a nota é e não é */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-relaxed text-blue-900">
        <strong>ℹ️ Como ler a nota:</strong> ela compara as palavras da vaga com
        o texto do currículo e considera cargo, área e cidade. É um{" "}
        <strong>atalho para organizar a fila</strong>, não um julgamento.
        Um ótimo candidato pode ter nota baixa só porque o currículo é enxuto ou
        escaneado. <strong>Leia sempre os melhores antes de decidir.</strong>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-100 px-4 py-3">
        <div className="text-sm text-slate-700">
          <strong>{rankeados.length}</strong> candidato(s) analisado(s) ·{" "}
          <strong className="text-emerald-700">{altas}</strong> com boa
          compatibilidade
          <span className="block text-xs text-slate-500">
            {(inscritos ?? []).length} inscrito(s) na vaga
            {usarTalentos && ` + ${(talentos ?? []).length} do banco de talentos`}
          </span>
        </div>
        <Link
          href={`/admin/vagas/${id}/candidatos?incluir_talentos=${usarTalentos ? "0" : "1"}`}
          className="btn-secundario px-4 py-2 text-sm"
        >
          {usarTalentos ? "Ver só os inscritos" : "Incluir banco de talentos"}
        </Link>
      </div>

      {rankeados.length === 0 ? (
        <div className="cartao p-12 text-center">
          <span className="text-4xl">🔍</span>
          <p className="mt-3 text-lg font-semibold text-slate-700">
            Nenhum candidato ainda
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Quando alguém se candidatar — ou você importar currículos — eles
            aparecem aqui já ordenados.
          </p>
          <Link href="/admin/importar" className="btn-primario mt-5">
            Importar currículos
          </Link>
        </div>
      ) : (
        <ListaRankeada candidatos={rankeados} />
      )}
    </div>
  );
}
