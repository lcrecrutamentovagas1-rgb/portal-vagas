import Link from "next/link";
import { criarClienteServidor, supabaseConfigurado } from "@/lib/supabase/server";
import { AvisoConfiguracao } from "@/components/Alerta";
import type { Empresa } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Empresas contratando" };

export default async function PaginaEmpresas() {
  if (!supabaseConfigurado()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <AvisoConfiguracao />
      </div>
    );
  }

  const supabase = await criarClienteServidor();
  const { data: empresas } = await supabase
    .from("empresas")
    .select("*")
    .order("criado_em", { ascending: false })
    .limit(60);

  const { data: vagas } = await supabase
    .from("vagas")
    .select("empresa_id")
    .eq("status", "publicada");

  const contagem = new Map<string, number>();
  (vagas ?? []).forEach((v) => {
    if (v.empresa_id) contagem.set(v.empresa_id, (contagem.get(v.empresa_id) ?? 0) + 1);
  });

  const lista = (empresas ?? []) as Empresa[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Empresas cadastradas</h1>
      <p className="mt-1 text-slate-600">
        Conheça as empresas que estão contratando pelo portal.
      </p>

      {lista.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-lg font-semibold text-slate-700">
            Nenhuma empresa cadastrada ainda
          </p>
          <Link href="/cadastro" className="btn-primario mt-5">
            Cadastrar minha empresa
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((e) => {
            const qtd = contagem.get(e.id) ?? 0;
            return (
              <div key={e.id} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-marca-clara font-bold text-marca">
                    {e.nome.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold text-slate-900">{e.nome}</h2>
                    <p className="truncate text-sm text-slate-500">
                      {[e.cidade, e.estado].filter(Boolean).join(", ") || "Brasil"}
                    </p>
                  </div>
                </div>

                {e.sobre && (
                  <p className="mt-3 line-clamp-2 text-sm text-slate-600">{e.sobre}</p>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    {qtd} {qtd === 1 ? "vaga aberta" : "vagas abertas"}
                  </span>
                  {qtd > 0 && (
                    <Link
                      href={`/vagas?q=${encodeURIComponent(e.nome)}`}
                      className="text-sm font-semibold text-marca hover:underline"
                    >
                      Ver vagas →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
