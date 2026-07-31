import Link from "next/link";
import { exigirAdmin } from "@/lib/auth";
import { criarClienteServidor } from "@/lib/supabase/server";
import { dataCurta } from "@/lib/format";
import type { Empresa } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Empresas" };

export default async function AdminEmpresas() {
  await exigirAdmin();
  const supabase = await criarClienteServidor();

  const { data } = await supabase
    .from("empresas")
    .select("*")
    .order("criado_em", { ascending: false });
  const empresas = (data ?? []) as Empresa[];

  const { data: vagas } = await supabase.from("vagas").select("empresa_id, status");
  const contagem = new Map<string, { total: number; publicadas: number }>();
  (vagas ?? []).forEach((v) => {
    if (!v.empresa_id) return;
    const atual = contagem.get(v.empresa_id) ?? { total: 0, publicadas: 0 };
    atual.total += 1;
    if (v.status === "publicada") atual.publicadas += 1;
    contagem.set(v.empresa_id, atual);
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Empresas cadastradas</h1>
        <p className="mt-1 text-slate-600">{empresas.length} empresa(s)</p>
      </div>

      {empresas.length === 0 ? (
        <div className="cartao p-12 text-center">
          <p className="text-lg font-semibold text-slate-700">
            Nenhuma empresa cadastrada ainda
          </p>
        </div>
      ) : (
        <div className="cartao overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">Empresa</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Local</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Contato</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Vagas</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Cadastro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {empresas.map((e) => {
                const c = contagem.get(e.id) ?? { total: 0, publicadas: 0 };
                return (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{e.nome}</p>
                      {e.cnpj && <p className="text-xs text-slate-500">{e.cnpj}</p>}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {[e.cidade, e.estado].filter(Boolean).join(", ") || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{e.telefone || "-"}</td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/vagas`} className="font-medium text-marca hover:underline">
                        {c.publicadas} pub. / {c.total} total
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{dataCurta(e.criado_em)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
