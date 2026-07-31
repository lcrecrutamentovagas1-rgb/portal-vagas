import Link from "next/link";
import { exigirAdmin } from "@/lib/auth";
import { criarClienteServidor } from "@/lib/supabase/server";
import ListaCandidaturas from "@/components/ListaCandidaturas";
import type { Candidatura, Vaga } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Todos os currículos" };

export default async function AdminCandidaturas({
  searchParams,
}: {
  searchParams: Promise<{ vaga?: string }>;
}) {
  const { vaga } = await searchParams;
  await exigirAdmin();

  const supabase = await criarClienteServidor();

  let consulta = supabase
    .from("candidaturas")
    .select("*, vagas(titulo, empresa_nome)")
    .order("criado_em", { ascending: false })
    .limit(300);

  if (vaga) consulta = consulta.eq("vaga_id", vaga);

  const { data } = await consulta;
  const candidaturas = (data ?? []) as Candidatura[];

  const { data: vagasData } = await supabase
    .from("vagas")
    .select("id, titulo, empresa_nome")
    .order("criado_em", { ascending: false })
    .limit(40);
  const vagas = (vagasData ?? []) as Pick<Vaga, "id" | "titulo" | "empresa_nome">[];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Currículos recebidos</h1>
        <p className="mt-1 text-slate-600">
          {candidaturas.length} candidatura(s) no portal
        </p>
      </div>

      {vagas.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/candidaturas"
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${
              !vaga ? "border-marca bg-marca text-white" : "border-slate-300 bg-white text-slate-700 hover:border-marca"
            }`}
          >
            Todas
          </Link>
          {vagas.map((v) => (
            <Link
              key={v.id}
              href={`/admin/candidaturas?vaga=${v.id}`}
              className={`max-w-[260px] truncate rounded-full border px-3.5 py-1.5 text-sm font-medium ${
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
