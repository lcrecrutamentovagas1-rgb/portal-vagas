import Link from "next/link";
import BuscaVagas from "@/components/BuscaVagas";
import CartaoVaga from "@/components/CartaoVaga";
import { AvisoConfiguracao } from "@/components/Alerta";
import { criarClienteServidor, supabaseConfigurado } from "@/lib/supabase/server";
import { AREAS, site } from "@/lib/site";
import type { Vaga } from "@/lib/types";

export const dynamic = "force-dynamic";

async function buscarDados() {
  if (!supabaseConfigurado()) return { vagas: [], total: 0, empresas: 0, erro: false };

  try {
    const supabase = await criarClienteServidor();

    const [{ data: vagas, count }, { count: empresas }] = await Promise.all([
      supabase
        .from("vagas")
        .select("*", { count: "exact" })
        .eq("status", "publicada")
        .order("destaque", { ascending: false })
        .order("criado_em", { ascending: false })
        .limit(8),
      supabase.from("empresas").select("id", { count: "exact", head: true }),
    ]);

    return {
      vagas: (vagas ?? []) as Vaga[],
      total: count ?? 0,
      empresas: empresas ?? 0,
      erro: false,
    };
  } catch {
    return { vagas: [], total: 0, empresas: 0, erro: true };
  }
}

export default async function PaginaInicial() {
  const { vagas, total, empresas } = await buscarDados();
  const configurado = supabaseConfigurado();

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-marca-clara to-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-24">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            {site.slogan}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            Milhares de vagas em todo o Brasil. Candidate-se em poucos cliques —
            grátis e sem complicação.
          </p>

          <div className="mx-auto mt-8 max-w-3xl">
            <BuscaVagas grande />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-600">
            <span><strong className="text-slate-900">{total}</strong> vagas abertas</span>
            <span className="hidden h-4 w-px bg-slate-300 sm:block" />
            <span><strong className="text-slate-900">{empresas}</strong> empresas cadastradas</span>
            <span className="hidden h-4 w-px bg-slate-300 sm:block" />
            <Link href="/cadastro" className="font-semibold text-marca hover:underline">
              É empresa? Publique sua vaga grátis →
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- ÁREAS ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-bold text-slate-900">Vagas por área</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {AREAS.map((area) => (
            <Link
              key={area}
              href={`/vagas?area=${encodeURIComponent(area)}`}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-marca hover:bg-marca-clara hover:text-marca"
            >
              {area}
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------- VAGAS RECENTES ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-xl font-bold text-slate-900">Vagas recentes</h2>
          <Link href="/vagas" className="text-sm font-semibold text-marca hover:underline">
            Ver todas as vagas →
          </Link>
        </div>

        {!configurado ? (
          <AvisoConfiguracao />
        ) : vagas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <p className="text-lg font-semibold text-slate-700">
              Nenhuma vaga publicada ainda
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Assim que uma empresa publicar (ou o administrador aprovar), a vaga
              aparece aqui.
            </p>
            <Link href="/cadastro" className="btn-primario mt-5">
              Publicar a primeira vaga
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {vagas.map((vaga) => (
              <CartaoVaga key={vaga.id} vaga={vaga} />
            ))}
          </div>
        )}
      </section>

      {/* ---------------- COMO FUNCIONA ---------------- */}
      <section className="mx-auto mt-12 max-w-6xl px-4">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <span className="text-3xl">👤</span>
            <h3 className="mt-3 text-xl font-bold text-slate-900">
              Para candidatos
            </h3>
            <ul className="mt-4 space-y-2.5 text-[15px] text-slate-600">
              <li className="flex gap-2"><span className="text-marca">✓</span> Busque vagas por cargo, cidade ou área</li>
              <li className="flex gap-2"><span className="text-marca">✓</span> Preencha seus dados e anexe o currículo</li>
              <li className="flex gap-2"><span className="text-marca">✓</span> Aceita PDF, DOC, DOCX, JPG e PNG</li>
              <li className="flex gap-2"><span className="text-marca">✓</span> Sem cadastro, sem mensalidade</li>
            </ul>
            <Link href="/vagas" className="btn-primario mt-6">
              Buscar vagas
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <span className="text-3xl">🏢</span>
            <h3 className="mt-3 text-xl font-bold text-slate-900">
              Para empresas
            </h3>
            <ul className="mt-4 space-y-2.5 text-[15px] text-slate-600">
              <li className="flex gap-2"><span className="text-marca">✓</span> Crie sua conta gratuitamente</li>
              <li className="flex gap-2"><span className="text-marca">✓</span> Publique quantas vagas quiser</li>
              <li className="flex gap-2"><span className="text-marca">✓</span> Receba currículos organizados no painel</li>
              <li className="flex gap-2"><span className="text-marca">✓</span> Acompanhe cada candidato por etapa</li>
            </ul>
            <Link href="/cadastro" className="btn-primario mt-6">
              Criar conta de empresa
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
