import Link from "next/link";
import type { Vaga } from "@/lib/types";
import {
  formatarSalario,
  localDaVaga,
  rotuloContrato,
  rotuloModalidade,
  tempoRelativo,
} from "@/lib/format";

export default function CartaoVaga({ vaga }: { vaga: Vaga }) {
  return (
    <Link
      href={`/vagas/${vaga.id}`}
      className="group block rounded-xl border border-slate-200 bg-white p-5 transition hover:border-marca hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-marca-clara text-lg font-bold text-marca">
          {vaga.empresa_nome.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[17px] font-semibold leading-snug text-slate-900 group-hover:text-marca">
              {vaga.titulo}
            </h3>
            {vaga.destaque && (
              <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                Destaque
              </span>
            )}
          </div>

          <p className="mt-1 text-[15px] font-medium text-slate-700">
            {vaga.empresa_nome}
          </p>

          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {localDaVaga(vaga)}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="chip">{rotuloModalidade(vaga.modalidade)}</span>
            <span className="chip">{rotuloContrato(vaga.tipo_contrato)}</span>
            {vaga.nivel && <span className="chip">{vaga.nivel}</span>}
            <span className="chip bg-emerald-50 text-emerald-800">
              {formatarSalario(vaga)}
            </span>
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
            {vaga.descricao}
          </p>

          <p className="mt-3 text-xs text-slate-400">{tempoRelativo(vaga.criado_em)}</p>
        </div>
      </div>
    </Link>
  );
}
