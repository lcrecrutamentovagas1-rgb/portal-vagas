import Link from "next/link";
import BuscaVagas from "@/components/BuscaVagas";
import CartaoVaga from "@/components/CartaoVaga";
import CartaoSetor from "@/components/CartaoSetor";
import Depoimentos from "@/components/Depoimentos";
import { AvisoConfiguracao } from "@/components/Alerta";
import { criarClienteServidor, supabaseConfigurado } from "@/lib/supabase/server";
import { AREAS } from "@/lib/site";
import type { Empresa, Vaga } from "@/lib/types";

export const dynamic = "force-dynamic";

async function buscarDados() {
  if (!supabaseConfigurado()) {
    return { vagas: [], total: 0, empresas: [], totalEmpresas: 0, porArea: new Map() };
  }

  try {
    const supabase = await criarClienteServidor();

    const [{ data: vagas, count }, { data: empresas, count: totalEmpresas }, { data: todas }] =
      await Promise.all([
        supabase
          .from("vagas")
          .select("*", { count: "exact" })
          .eq("status", "publicada")
          .order("destaque", { ascending: false })
          .order("criado_em", { ascending: false })
          .limit(6),
        supabase
          .from("empresas")
          .select("*", { count: "exact" })
          .order("criado_em", { ascending: false })
          .limit(4),
        supabase.from("vagas").select("area, empresa_id").eq("status", "publicada"),
      ]);

    // Conta quantas vagas há em cada área
    const porArea = new Map<string, number>();
    (todas ?? []).forEach((v) => {
      if (v.area) porArea.set(v.area, (porArea.get(v.area) ?? 0) + 1);
    });

    return {
      vagas: (vagas ?? []) as Vaga[],
      total: count ?? 0,
      empresas: (empresas ?? []) as Empresa[],
      totalEmpresas: totalEmpresas ?? 0,
      porArea,
    };
  } catch {
    return { vagas: [], total: 0, empresas: [], totalEmpresas: 0, porArea: new Map() };
  }
}

export default async function PaginaInicial() {
  const { vagas, total, empresas, totalEmpresas, porArea } = await buscarDados();
  const configurado = supabaseConfigurado();

  // Mostra as 8 áreas com mais vagas (ou as 8 primeiras, se ainda não houver)
  const areasDestaque = [...AREAS]
    .sort((a, b) => (porArea.get(b) ?? 0) - (porArea.get(a) ?? 0))
    .slice(0, 8);

  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden bg-navy">
        <div className="brilho-hero" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:py-28">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Sua próxima <span className="texto-gradiente">oportunidade</span>
            <br className="hidden sm:block" /> começa aqui
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-300 sm:text-lg">
            Milhares de vagas em todo o Brasil. Candidate-se em poucos cliques —
            grátis, sem cadastro e sem complicação.
          </p>

          <div className="mx-auto mt-9 max-w-3xl">
            <BuscaVagas grande />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
            <Estatistica valor={total} rotulo="vagas abertas" />
            <span className="hidden h-8 w-px bg-white/15 sm:block" />
            <Estatistica valor={totalEmpresas} rotulo="empresas cadastradas" />
            <span className="hidden h-8 w-px bg-white/15 sm:block" />
            <div className="text-left">
              <p className="text-lg font-bold text-white">100%</p>
              <p className="text-slate-400">grátis para candidatos</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SETORES ==================== */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Vagas por setor</h2>
            <p className="mt-1 text-slate-600">
              Encontre oportunidades na sua área de atuação
            </p>
          </div>
          <Link
            href="/vagas-por-setor"
            className="shrink-0 text-sm font-semibold text-marca hover:underline"
          >
            Ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {areasDestaque.map((area) => (
            <CartaoSetor key={area} area={area} quantidade={porArea.get(area) ?? 0} />
          ))}
        </div>
      </section>

      {/* ==================== VAGAS RECENTES ==================== */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Vagas recentes</h2>
              <p className="mt-1 text-slate-600">
                As oportunidades mais novas do portal
              </p>
            </div>
            <Link href="/vagas" className="shrink-0 text-sm font-semibold text-marca hover:underline">
              Ver todas →
            </Link>
          </div>

          {!configurado ? (
            <AvisoConfiguracao />
          ) : vagas.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
              <span className="text-4xl">💼</span>
              <p className="mt-3 text-lg font-semibold text-slate-700">
                Nenhuma vaga publicada ainda
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Assim que uma vaga for publicada, ela aparece aqui.
              </p>
              <Link href="/cadastro" className="btn-primario mt-6">
                Publicar a primeira vaga
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {vagas.map((v) => (
                <CartaoVaga key={v.id} vaga={v} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================== EMPRESAS ==================== */}
      {empresas.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold text-slate-900">Empresas em destaque</h2>
          <p className="mt-1 text-slate-600">Quem está contratando agora</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {empresas.map((e) => (
              <Link
                key={e.id}
                href={`/vagas?q=${encodeURIComponent(e.nome)}`}
                className="cartao group p-5 transition hover:-translate-y-0.5 hover:border-marca hover:shadow-lg"
              >
                <div
                  className="grid h-12 w-12 place-items-center rounded-xl text-lg font-bold text-white"
                  style={{ background: "var(--grad-marca)" }}
                >
                  {e.nome.charAt(0).toUpperCase()}
                </div>
                <h3 className="mt-3 truncate font-bold text-slate-900 group-hover:text-marca">
                  {e.nome}
                </h3>
                <p className="truncate text-sm text-slate-500">
                  {[e.cidade, e.estado].filter(Boolean).join(", ") || "Brasil"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ==================== CHAMADA EMPRESA ==================== */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div
          className="relative overflow-hidden rounded-3xl px-8 py-14 text-center"
          style={{ background: "var(--grad-marca)" }}
        >
          <div className="relative">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              É empresa? Publique sua vaga grátis
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/90">
              Crie sua conta em 1 minuto, publique quantas vagas quiser e receba
              os currículos organizados num painel.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/cadastro"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-bold text-marca shadow-sm transition hover:bg-slate-100"
              >
                Publicar vaga grátis
              </Link>
              <Link href="/planos" className="btn-contorno-claro px-6 py-3">
                Ver planos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== COMO FUNCIONA ==================== */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="cartao p-8">
            <div
              className="grid h-12 w-12 place-items-center rounded-xl text-2xl"
              style={{ background: "var(--marca-clara)" }}
            >
              👤
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              Para candidatos
            </h3>
            <ul className="mt-4 space-y-2.5 text-[15px] text-slate-600">
              <Beneficio>Busque vagas por cargo, cidade ou setor</Beneficio>
              <Beneficio>Preencha seus dados e anexe o currículo</Beneficio>
              <Beneficio>Aceita PDF, Word e até foto do currículo</Beneficio>
              <Beneficio>Sem cadastro e sem mensalidade</Beneficio>
            </ul>
            <Link href="/vagas" className="btn-primario mt-6">
              Buscar vagas
            </Link>
          </div>

          <div className="cartao p-8">
            <div
              className="grid h-12 w-12 place-items-center rounded-xl text-2xl"
              style={{ background: "#fff1e6" }}
            >
              🏢
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              Para empresas
            </h3>
            <ul className="mt-4 space-y-2.5 text-[15px] text-slate-600">
              <Beneficio cor="text-laranja">Crie sua conta gratuitamente</Beneficio>
              <Beneficio cor="text-laranja">Publique quantas vagas quiser</Beneficio>
              <Beneficio cor="text-laranja">Receba currículos organizados</Beneficio>
              <Beneficio cor="text-laranja">Acompanhe cada candidato por etapa</Beneficio>
            </ul>
            <Link href="/cadastro" className="btn-quente mt-6">
              Criar conta de empresa
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== DEPOIMENTOS ==================== */}
      <Depoimentos />
    </>
  );
}

function Estatistica({ valor, rotulo }: { valor: number; rotulo: string }) {
  return (
    <div className="text-left">
      <p className="text-lg font-bold text-white">
        {valor > 0 ? `+${valor}` : valor}
      </p>
      <p className="text-slate-400">{rotulo}</p>
    </div>
  );
}

function Beneficio({
  children,
  cor = "text-marca",
}: {
  children: React.ReactNode;
  cor?: string;
}) {
  return (
    <li className="flex gap-2.5">
      <span className={`font-bold ${cor}`}>✓</span>
      <span>{children}</span>
    </li>
  );
}
