import Link from "next/link";
import { exigirAdmin } from "@/lib/auth";
import { criarClienteServidor } from "@/lib/supabase/server";
import ListaCandidaturas from "@/components/ListaCandidaturas";
import { AREAS } from "@/lib/site";
import type { Candidatura } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Banco de talentos" };

export default async function BancoDeTalentos({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; area?: string }>;
}) {
  const { q, area } = await searchParams;
  await exigirAdmin();

  const supabase = await criarClienteServidor();

  let consulta = supabase
    .from("candidaturas")
    .select("*")
    .is("vaga_id", null)
    .order("criado_em", { ascending: false })
    .limit(300);

  if (q) {
    const t = q.replace(/[%,]/g, " ");
    consulta = consulta.or(
      `nome.ilike.%${t}%,email.ilike.%${t}%,cargo_atual.ilike.%${t}%,cidade.ilike.%${t}%,texto_curriculo.ilike.%${t}%`,
    );
  }
  if (area) consulta = consulta.eq("area", area);

  const { data, error } = await consulta;
  const candidatos = (data ?? []) as Candidatura[];

  // A tabela ainda não tem os campos novos?
  const precisaAtualizar =
    error?.message?.includes("column") || error?.code === "42703";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Banco de talentos
          </h1>
          <p className="mt-1 text-slate-600">
            {candidatos.length} currículo(s) guardado(s), sem vaga vinculada
          </p>
        </div>
        <Link href="/admin/importar" className="btn-primario">
          📥 Importar currículos
        </Link>
      </div>

      {precisaAtualizar && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          ⚠️ Falta preparar o banco. Rode o arquivo{" "}
          <strong>supabase/banco-de-talentos.sql</strong> no SQL Editor do
          Supabase.
        </div>
      )}

      {/* Busca */}
      <form className="cartao flex flex-wrap gap-3 p-4" action="/admin/talentos">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar por nome, cargo, cidade ou conteúdo do currículo..."
          className="campo min-w-[240px] flex-1"
        />
        <select name="area" defaultValue={area ?? ""} className="campo w-auto">
          <option value="">Todas as áreas</option>
          {AREAS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <button className="btn-primario px-6">Buscar</button>
        {(q || area) && (
          <Link href="/admin/talentos" className="btn-secundario">
            Limpar
          </Link>
        )}
      </form>

      {candidatos.length === 0 && !precisaAtualizar ? (
        <div className="cartao p-12 text-center">
          <span className="text-4xl">🗂️</span>
          <p className="mt-3 text-lg font-semibold text-slate-700">
            {q || area
              ? "Nenhum candidato encontrado"
              : "Seu banco de talentos está vazio"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {q || area
              ? "Tente outra busca."
              : "Importe os currículos que você já tem guardados."}
          </p>
          {!q && !area && (
            <Link href="/admin/importar" className="btn-primario mt-5">
              Importar currículos
            </Link>
          )}
        </div>
      ) : (
        <ListaCandidaturas candidaturas={candidatos} />
      )}
    </div>
  );
}
