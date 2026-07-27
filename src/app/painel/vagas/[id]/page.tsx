import { notFound } from "next/navigation";
import FormularioVaga from "@/components/FormularioVaga";
import { exigirEmpresa } from "@/lib/auth";
import { criarClienteServidor } from "@/lib/supabase/server";
import type { Vaga } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Editar vaga" };

export default async function EditarVaga({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await exigirEmpresa();
  const { id } = await params;

  const supabase = await criarClienteServidor();
  const { data } = await supabase.from("vagas").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Editar vaga</h1>
        <p className="mt-1 text-slate-600">{(data as Vaga).titulo}</p>
      </div>
      <FormularioVaga vaga={data as Vaga} />
    </div>
  );
}
