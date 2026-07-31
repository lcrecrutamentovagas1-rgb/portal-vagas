import Link from "next/link";
import CartaoSetor from "@/components/CartaoSetor";
import CartaoVaga from "@/components/CartaoVaga";
import { AvisoConfiguracao } from "@/components/Alerta";
import { criarClienteServidor, supabaseConfigurado } from "@/lib/supabase/server";
import { AREAS } from "@/lib/site";
import type { Vaga } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Vagas por setor",
  description:
    "Explore oportunidades de emprego por área de atuação: tecnologia, saúde, vendas, administrativo e muito mais.",
};

export default async function VagasPorSetor() {
  if (!supabaseConfigurado()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <AvisoConfiguracao />
      </div>
    );
  }

  const supabase = await criarClienteServidor();

  const [{ data: todas }, { data: recentes }] = await Promise.all([
    supabase.from("vagas").select("area").eq("status", "publicada"),
    supabase
      .from("vagas")
      .select("*")
      .eq("status", "publicada")
      .order("destaque", { ascending: false })
      .order("criado_em", { ascending: false })
      .limit(9),
  ]);

  const porArea = new Map<string, number>();
  (todas ?? []).forEach((v) => {
    if (v.area) porArea.set(v.area, (porArea.get(v.area) ?? 0) + 1);
  });

  const areasOrdenadas = [...AREAS].sort(
    (a, b) => (porArea.get(b) ?? 0) - (porArea.get(a) ?? 0),
  );

  return (
    <>
      <section className="relative overflow-hidden bg-navy py-14">
        <div className="brilho-hero" />
        <div className="relative mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Vagas por <span className="texto-gradiente">setor</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Escolha a sua área e veja as oportunidades disponíveis agora.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {areasOrdenadas.map((area) => (
            <CartaoSetor key={area} area={area} quantidade={porArea.get(area) ?? 0} />
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Todas as vagas</h2>
            <Link href="/vagas" className="text-sm font-semibold text-marca hover:underline">
              Buscar com filtros →
            </Link>
          </div>

          {!recentes || recentes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
              <p className="text-lg font-semibold text-slate-700">
                Nenhuma vaga publicada ainda
              </p>
              <Link href="/cadastro" className="btn-primario mt-5">
                Publicar a primeira vaga
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(recentes as Vaga[]).map((v) => (
                <CartaoVaga key={v.id} vaga={v} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
