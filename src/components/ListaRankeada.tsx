"use client";

import { useState, useTransition } from "react";
import { linkDoCurriculo } from "@/app/actions/candidatura";
import { mudarStatusCandidatura } from "@/app/actions/vagas";
import { STATUS_CANDIDATURA } from "@/lib/site";
import { dataCurta, moeda } from "@/lib/format";
import type { Compatibilidade } from "@/lib/compatibilidade";
import type { Candidatura } from "@/lib/types";

type Item = Candidatura & { compatibilidade: Compatibilidade };

export default function ListaRankeada({ candidatos }: { candidatos: Item[] }) {
  const [aberto, setAberto] = useState<string | null>(null);

  const cores = {
    alta: { barra: "bg-emerald-500", texto: "text-emerald-700", fundo: "bg-emerald-50 border-emerald-200" },
    media: { barra: "bg-amber-500", texto: "text-amber-700", fundo: "bg-amber-50 border-amber-200" },
    baixa: { barra: "bg-slate-400", texto: "text-slate-600", fundo: "bg-white border-slate-200" },
  };

  const rotulo = {
    alta: "Boa compatibilidade",
    media: "Compatibilidade média",
    baixa: "Compatibilidade baixa",
  };

  return (
    <div className="space-y-3">
      {candidatos.map((c, i) => {
        const cor = cores[c.compatibilidade.faixa];
        const estaAberto = aberto === c.id;

        return (
          <div key={c.id} className={`overflow-hidden rounded-xl border ${cor.fundo}`}>
            <button
              onClick={() => setAberto(estaAberto ? null : c.id)}
              className="flex w-full items-start gap-4 p-4 text-left hover:bg-black/[0.02]"
            >
              {/* Posição no ranking */}
              <div className="flex w-8 shrink-0 flex-col items-center pt-1">
                <span className={`text-lg font-bold ${i < 3 ? cor.texto : "text-slate-400"}`}>
                  {i + 1}
                </span>
                {i === 0 && <span className="text-sm">🏆</span>}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{c.nome}</h3>
                  {!c.vaga_id && (
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800">
                      🗂️ banco de talentos
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_CANDIDATURA[c.status]?.cor}`}
                  >
                    {STATUS_CANDIDATURA[c.status]?.label}
                  </span>
                </div>

                <p className="mt-0.5 truncate text-sm text-slate-600">
                  {c.cargo_atual || "Cargo não informado"}
                  {c.cidade && ` · ${c.cidade}${c.estado ? `/${c.estado}` : ""}`}
                </p>

                {/* Barra da nota */}
                <div className="mt-2.5 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full ${cor.barra}`}
                      style={{ width: `${c.compatibilidade.nota}%` }}
                    />
                  </div>
                  <span className={`shrink-0 text-sm font-bold ${cor.texto}`}>
                    {c.compatibilidade.nota}%
                  </span>
                </div>
                <p className={`mt-1 text-xs font-medium ${cor.texto}`}>
                  {rotulo[c.compatibilidade.faixa]}
                </p>
              </div>

              <svg
                width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="#64748b" strokeWidth="2"
                className={`mt-1 shrink-0 transition ${estaAberto ? "rotate-180" : ""}`}
              >
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {estaAberto && (
              <div className="border-t border-black/5 bg-white/60 p-5">
                {/* Por que essa nota */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                      ✓ A favor
                    </p>
                    {c.compatibilidade.motivos.length ? (
                      <ul className="mt-1.5 space-y-1">
                        {c.compatibilidade.motivos.map((m, k) => (
                          <li key={k} className="text-sm text-slate-700">• {m}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1.5 text-sm text-slate-500">—</p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                      ⚠ Atenção
                    </p>
                    {c.compatibilidade.alertas.length ? (
                      <ul className="mt-1.5 space-y-1">
                        {c.compatibilidade.alertas.map((a, k) => (
                          <li key={k} className="text-sm text-slate-700">• {a}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1.5 text-sm text-slate-500">nada a apontar</p>
                    )}
                  </div>
                </div>

                {c.compatibilidade.termosEncontrados.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Termos da vaga encontrados no currículo
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {c.compatibilidade.termosEncontrados.map((t) => (
                        <span
                          key={t}
                          className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contato */}
                <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 sm:grid-cols-3">
                  <Dado rotulo="E-mail" valor={c.email} link={`mailto:${c.email}`} />
                  <Dado
                    rotulo="Telefone"
                    valor={c.telefone}
                    link={`https://wa.me/55${(c.telefone ?? "").replace(/\D/g, "")}`}
                  />
                  <Dado
                    rotulo="Pretensão"
                    valor={c.pretensao ? moeda(c.pretensao) : null}
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4">
                  {c.curriculo_url && (
                    <BotaoCurriculo caminho={c.curriculo_url} />
                  )}

                  <form action={mudarStatusCandidatura} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={c.id} />
                    <select
                      name="status"
                      defaultValue={c.status}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    >
                      {Object.entries(STATUS_CANDIDATURA).map(([v, info]) => (
                        <option key={v} value={v}>{info.label}</option>
                      ))}
                    </select>
                    <button className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                      Atualizar
                    </button>
                  </form>

                  <span className="ml-auto text-xs text-slate-400">
                    Recebido em {dataCurta(c.criado_em)}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Dado({
  rotulo,
  valor,
  link,
}: {
  rotulo: string;
  valor?: string | null;
  link?: string;
}) {
  if (!valor) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {rotulo}
      </p>
      {link ? (
        <a href={link} target="_blank" rel="noreferrer" className="text-sm font-medium text-marca hover:underline">
          {valor}
        </a>
      ) : (
        <p className="text-sm font-medium text-slate-800">{valor}</p>
      )}
    </div>
  );
}

function BotaoCurriculo({ caminho }: { caminho: string }) {
  const [pendente, iniciar] = useTransition();

  function abrir() {
    iniciar(async () => {
      const url = await linkDoCurriculo(caminho);
      if (url) window.open(url, "_blank", "noopener");
      else alert("Não foi possível abrir o currículo.");
    });
  }

  return (
    <button onClick={abrir} disabled={pendente} className="btn-primario px-4 py-2 text-sm">
      {pendente ? "Abrindo..." : "📄 Abrir currículo"}
    </button>
  );
}
