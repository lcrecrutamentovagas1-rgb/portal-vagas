"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; rotulo: string; icone: string };

export default function NavLateral({ itens }: { itens: Item[] }) {
  const caminho = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
      {itens.map((item) => {
        const ativo =
          caminho === item.href ||
          (item.href !== "/painel" &&
            item.href !== "/admin" &&
            caminho.startsWith(item.href) &&
            !item.href.endsWith("/nova"));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-[15px] font-medium transition ${
              ativo
                ? "bg-marca text-white"
                : "text-slate-700 hover:bg-white hover:text-marca"
            }`}
          >
            <span>{item.icone}</span>
            <span className="whitespace-nowrap">{item.rotulo}</span>
          </Link>
        );
      })}
    </nav>
  );
}
