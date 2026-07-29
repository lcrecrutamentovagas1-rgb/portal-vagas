import Link from "next/link";
import { redirect } from "next/navigation";
import { site } from "@/lib/site";
import { usuarioAtual } from "@/lib/auth";
import { supabaseConfigurado } from "@/lib/supabase/server";
import { sair } from "@/app/actions/auth";
import NavLateral from "@/components/NavLateral";

export const dynamic = "force-dynamic";

const ITENS = [
  { href: "/painel", rotulo: "Visão geral", icone: "📊" },
  { href: "/painel/vagas", rotulo: "Minhas vagas", icone: "💼" },
  { href: "/painel/vagas/nova", rotulo: "Publicar vaga", icone: "➕" },
  { href: "/painel/candidaturas", rotulo: "Currículos recebidos", icone: "📄" },
  { href: "/painel/empresa", rotulo: "Dados da empresa", icone: "🏢" },
];

export default async function LayoutPainel({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!supabaseConfigurado()) redirect("/configurar");

  const atual = await usuarioAtual();
  if (!atual) redirect("/entrar?redirect=/painel");
  if (atual.perfil?.role === "admin") redirect("/admin");

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-marca font-black text-white">
              {site.sigla}
            </span>
            <span className="hidden text-lg font-bold text-marca sm:block">
              {site.nome}
            </span>
          </Link>
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            Painel da empresa
          </span>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden max-w-[200px] truncate text-sm text-slate-600 sm:block">
              {atual.perfil?.nome ?? atual.user.email}
            </span>
            <form action={sair}>
              <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[230px_1fr]">
        <NavLateral itens={ITENS} />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
