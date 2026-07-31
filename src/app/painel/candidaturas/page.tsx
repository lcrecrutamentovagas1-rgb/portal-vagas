import Link from "next/link";
import { exigirEmpresa } from "@/lib/auth";
import { criarClienteServidor } from "@/lib/supabase/server";
import ListaCandidaturas from "@/components/ListaCandidaturas";
import type { Candidatura, Vaga } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Currículos recebidos" };

export default async function Candidaturas({
  searchParams,
}: {
  searchParams: Promise<{ vaga?: string }>;
}) {
  const { vaga } = await searchParams;
  await exigirEmpresa();

  const supabase = await criarClienteServidor();

  let consulta = supabase
    .from("candidaturas")
    .select("*, vagas(titulo, empresa_nome)")
    .order("criado_em", { ascending: false });

  if (vaga) consulta = consulta.eq("vaga_id", vaga);

  const { data } = await consulta;
  const candidaturas = (data ?? []) as Candidatura[];

  const { data: vagasData } = await supabase
    .from("vagas")
    .select("id, titulo")
    .order("criado_em", { ascending: false });
  const vagas = (vagasData ?? []) as Pick<Vaga, "id" | "titulo">[];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Currículos recebidos</h1>
        <p className="mt-1 text-slate-600">
          {candidaturas.length} candidatura(s)
        </p>
      </div>

      {vagas.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Link
            href="/painel/candidaturas"
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${
              !vaga ? "border-marca bg-marca text-white" : "border-slate-300 bg-white text-slate-700 hover:border-marca"
            }`}
          >
            Todas
          </Link>
          {vagas.map((v) => (
            <Link
              key={v.id}
              href={`/painel/candidaturas?vaga=${v.id}`}
              className={`max-w-[240px] truncate rounded-full border px-3.5 py-1.5 text-sm font-medium ${
                vaga === v.id ? "border-marca bg-marca text-white" : "border-slate-300 bg-white text-slate-700 hover:border-marca"
              }`}
            >
              {v.titulo}
            </Link>
          ))}
        </div>
      )}

      <ListaCandidaturas candidaturas={candidaturas} />
    </div>
  );
}
