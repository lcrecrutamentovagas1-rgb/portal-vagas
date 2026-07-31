import Link from "next/link";
import type { Vaga } from "@/lib/types";
import { iconeDaArea } from "@/lib/site";
import {
  formatarSalario,
  localDaVaga,
  rotuloContrato,
  rotuloModalidade,
  tempoRelativo,
} from "@/lib/format";

export default function CartaoVaga({ vaga }: { vaga: Vaga }) {
  const { icone, cor } = iconeDaArea(vaga.area);

  return (
    <Link
      href={`/vagas/${vaga.id}`}
      className="group relative flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-marca hover:shadow-lg"
    >
      {vaga.destaque && (
        <span
          className="absolute -top-2 right-4 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white shadow"
          style={{ background: "var(--grad-quente)" }}
        >
          ⭐ Destaque
        </span>
      )}

      <div className="flex items-start gap-3">
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${cor} text-lg shadow-sm`}
        >
          {icone}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[16px] font-bold leading-snug text-slate-900 group-hover:text-marca">
            {vaga.titulo}
          </h3>
          <p className="mt-0.5 truncate text-sm font-medium text-slate-600">
            {vaga.empresa_nome}
          </p>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span className="truncate">{localDaVaga(vaga)}</span>
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="chip">{rotuloModalidade(vaga.modalidade)}</span>
        <span className="chip">{rotuloContrato(vaga.tipo_contrato)}</span>
        {vaga.nivel && <span className="chip">{vaga.nivel}</span>}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-sm font-bold text-emerald-600">
          {formatarSalario(vaga)}
        </span>
        <span className="text-xs text-slate-400">{tempoRelativo(vaga.criado_em)}</span>
      </div>
    </Link>
  );
}
