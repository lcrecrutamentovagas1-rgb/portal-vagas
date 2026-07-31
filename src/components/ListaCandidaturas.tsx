"use client";

import { useState, useTransition } from "react";
import { linkDoCurriculo } from "@/app/actions/candidatura";
import { mudarStatusCandidatura, excluirCandidatura } from "@/app/actions/vagas";
import { STATUS_CANDIDATURA } from "@/lib/site";
import { dataHora, moeda } from "@/lib/format";
import type { Candidatura } from "@/lib/types";

export default function ListaCandidaturas({
  candidaturas,
}: {
  candidaturas: Candidatura[];
}) {
  const [aberto, setAberto] = useState<string | null>(null);

  if (candidaturas.length === 0) {
    return (
      <div className="cartao p-12 text-center">
        <p className="text-lg font-semibold text-slate-700">
          Nenhum currículo recebido ainda
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Assim que alguém se candidatar, o currículo aparece aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {candidaturas.map((c) => (
        <div key={c.id} className="cartao overflow-hidden">
          <button
            onClick={() => setAberto(aberto === c.id ? null : c.id)}
            className="flex w-full items-center gap-3 p-4 text-left hover:bg-slate-50"
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-marca-clara font-bold text-marca">
              {c.nome.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-slate-900">{c.nome}</p>
              <p className="truncate text-sm text-slate-500">
                {c.vaga_id
                  ? (c.vagas?.titulo ?? "Vaga")
                  : `🗂️ Banco de talentos${c.area ? ` · ${c.area}` : ""}`}{" "}
                · {dataHora(c.criado_em)}
              </p>
            </div>

            <span className={`hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold sm:inline ${STATUS_CANDIDATURA[c.status]?.cor}`}>
              {STATUS_CANDIDATURA[c.status]?.label}
            </span>

            <svg
              width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#64748b" strokeWidth="2"
              className={`shrink-0 transition ${aberto === c.id ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {aberto === c.id && (
            <div className="border-t border-slate-100 bg-slate-50 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Dado rotulo="E-mail" valor={c.email} link={`mailto:${c.email}`} />
                <Dado rotulo="Telefone" valor={c.telefone} link={`https://wa.me/55${(c.telefone ?? "").replace(/\D/g, "")}`} />
                <Dado rotulo="Cidade" valor={[c.cidade, c.estado].filter(Boolean).join(", ")} />
                <Dado rotulo="Cargo atual/desejado" valor={c.cargo_atual} />
                <Dado rotulo="Pretensão salarial" valor={c.pretensao ? moeda(c.pretensao) : null} />
                <Dado rotulo="LinkedIn" valor={c.linkedin} link={c.linkedin ?? undefined} />
              </div>

              {c.mensagem && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Mensagem
                  </p>
                  <p className="mt-1 whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                    {c.mensagem}
                  </p>
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4">
                {c.curriculo_url && (
                  <BotaoCurriculo caminho={c.curriculo_url} nome={c.curriculo_nome} />
                )}

                <form action={mudarStatusCandidatura} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={c.id} />
                  <select
                    name="status"
                    defaultValue={c.status}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  >
                    {Object.entries(STATUS_CANDIDATURA).map(([valor, info]) => (
                      <option key={valor} value={valor}>{info.label}</option>
                    ))}
                  </select>
                  <button className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                    Atualizar
                  </button>
                </form>

                <form action={excluirCandidatura} className="ml-auto">
                  <input type="hidden" name="id" value={c.id} />
                  <button className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                    Excluir
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      ))}
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

function BotaoCurriculo({
  caminho,
  nome,
}: {
  caminho: string;
  nome?: string | null;
}) {
  const [pendente, iniciar] = useTransition();

  function abrir() {
    iniciar(async () => {
      const url = await linkDoCurriculo(caminho);
      if (url) window.open(url, "_blank", "noopener");
      else alert("Não foi possível abrir o currículo. Tente novamente.");
    });
  }

  return (
    <button onClick={abrir} disabled={pendente} className="btn-primario px-4 py-2 text-sm">
      {pendente ? "Abrindo..." : `📄 Abrir currículo${nome ? ` (${nome.split(".").pop()?.toUpperCase()})` : ""}`}
    </button>
  );
}
