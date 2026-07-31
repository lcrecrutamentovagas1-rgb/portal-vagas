import Link from "next/link";
import { iconeDaArea } from "@/lib/site";

export default function CartaoSetor({
  area,
  quantidade,
}: {
  area: string;
  quantidade: number;
}) {
  const { icone, cor } = iconeDaArea(area);

  return (
    <Link
      href={`/vagas?area=${encodeURIComponent(area)}`}
      className="group cartao flex flex-col items-center gap-2 p-5 text-center transition hover:-translate-y-0.5 hover:border-marca hover:shadow-lg"
    >
      <span
        className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${cor} text-xl shadow-sm`}
      >
        {icone}
      </span>
      <h3 className="text-sm font-bold leading-tight text-slate-900 group-hover:text-marca">
        {area}
      </h3>
      <p className="text-xs text-slate-500">
        {quantidade} {quantidade === 1 ? "vaga" : "vagas"}
      </p>
    </Link>
  );
}
