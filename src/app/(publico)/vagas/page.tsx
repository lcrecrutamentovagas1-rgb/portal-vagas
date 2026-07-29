import Link from "next/link";
import BuscaVagas from "@/components/BuscaVagas";
import CartaoVaga from "@/components/CartaoVaga";
import { AvisoConfiguracao } from "@/components/Alerta";
import { criarClienteServidor, supabaseConfigurado } from "@/lib/supabase/server";
import { AREAS, MODALIDADES, TIPOS_CONTRATO, ESTADOS } from "@/lib/site";
import type { Vaga } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Buscar vagas" };

type Busca = {
  q?: string;
  local?: string;
  area?: string;
  modalidade?: string;
  contrato?: string;
  estado?: string;
};

export default async function PaginaVagas({
  searchParams,
}: {
  searchParams: Promise<Busca>;
}) {
  const filtros = await searchParams;

  if (!supabaseConfigurado()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <AvisoConfiguracao />
      </div>
    );
  }

  const supabase = await criarClienteServidor();
  let consulta = supabase
    .from("vagas")
    .select("*")
    .eq("status", "publicada")
    .order("destaque", { ascending: false })
    .order("criado_em", { ascending: false })
    .limit(60);

  if (filtros.q) {
    const t = filtros.q.replace(/[%,]/g, " ");
    consulta = consulta.or(
      `titulo.ilike.%${t}%,descricao.ilike.%${t}%,empresa_nome.ilike.%${t}%,requisitos.ilike.%${t}%`,
    );
  }
  if (filtros.local) {
    const l = filtros.local.replace(/[%,]/g, " ");
    if (/remot|home/i.test(l)) {
      consulta = consulta.eq("modalidade", "remoto");
    } else {
      consulta = consulta.or(`cidade.ilike.%${l}%,estado.ilike.%${l}%`);
    }
  }
  if (filtros.area) consulta = consulta.eq("area", filtros.area);
  if (filtros.modalidade) consulta = consulta.eq("modalidade", filtros.modalidade);
  if (filtros.contrato) consulta = consulta.eq("tipo_contrato", filtros.contrato);
  if (filtros.estado) consulta = consulta.eq("estado", filtros.estado);

  const { data } = await consulta;
  const vagas = (data ?? []) as Vaga[];

  const qs = (mudanca: Partial<Busca>) => {
    const p = new URLSearchParams();
    Object.entries({ ...filtros, ...mudanca }).forEach(([k, v]) => {
      if (v) p.set(k, String(v));
    });
    const s = p.toString();
    return `/vagas${s ? `?${s}` : ""}`;
  };

  const temFiltro = Object.values(filtros).some(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <BuscaVagas qInicial={filtros.q} localInicial={filtros.local} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* ------- FILTROS ------- */}
        <aside className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Filtros</h2>
            {temFiltro && (
              <Link href="/vagas" className="text-sm text-marca hover:underline">
                Limpar
              </Link>
            )}
          </div>

          <Filtro titulo="Modalidade">
            {MODALIDADES.map((m) => (
              <ItemFiltro
                key={m.valor}
                href={qs({ modalidade: filtros.modalidade === m.valor ? "" : m.valor })}
                ativo={filtros.modalidade === m.valor}
              >
                {m.label}
              </ItemFiltro>
            ))}
          </Filtro>

          <Filtro titulo="Tipo de contrato">
            {TIPOS_CONTRATO.map((t) => (
              <ItemFiltro
                key={t.valor}
                href={qs({ contrato: filtros.contrato === t.valor ? "" : t.valor })}
                ativo={filtros.contrato === t.valor}
              >
                {t.label}
              </ItemFiltro>
            ))}
          </Filtro>

          <Filtro titulo="Área">
            {AREAS.map((a) => (
              <ItemFiltro
                key={a}
                href={qs({ area: filtros.area === a ? "" : a })}
                ativo={filtros.area === a}
              >
                {a}
              </ItemFiltro>
            ))}
          </Filtro>

          <Filtro titulo="Estado">
            <div className="flex flex-wrap gap-1.5">
              {ESTADOS.map((uf) => (
                <Link
                  key={uf}
                  href={qs({ estado: filtros.estado === uf ? "" : uf })}
                  className={`rounded border px-2 py-1 text-xs font-medium ${
                    filtros.estado === uf
                      ? "border-marca bg-marca text-white"
                      : "border-slate-300 text-slate-600 hover:border-marca hover:text-marca"
                  }`}
                >
                  {uf}
                </Link>
              ))}
            </div>
          </Filtro>
        </aside>

        {/* ------- RESULTADOS ------- */}
        <div>
          <p className="mb-4 text-sm text-slate-600">
            <strong className="text-slate-900">{vagas.length}</strong>{" "}
            {vagas.length === 1 ? "vaga encontrada" : "vagas encontradas"}
            {filtros.q && <> para “{filtros.q}”</>}
          </p>

          {vagas.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
              <p className="text-lg font-semibold text-slate-700">
                Nenhuma vaga encontrada
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Tente outras palavras-chave ou remova alguns filtros.
              </p>
              <Link href="/vagas" className="btn-secundario mt-5">
                Ver todas as vagas
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {vagas.map((v) => (
                <CartaoVaga key={v.id} vaga={v} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Filtro({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-2.5 text-sm font-bold text-slate-900">{titulo}</h3>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function ItemFiltro({
  href,
  ativo,
  children,
}: {
  href: string;
  ativo: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-md px-2 py-1.5 text-sm transition ${
        ativo
          ? "bg-marca-clara font-semibold text-marca"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      {children}
    </Link>
  );
}
