import Link from "next/link";
import { redirect } from "next/navigation";
import { site } from "@/lib/site";
import { usuarioAtual } from "@/lib/auth";
import { supabaseConfigurado } from "@/lib/supabase/server";
import { sair } from "@/app/actions/auth";
import NavLateral from "@/components/NavLateral";

export const dynamic = "force-dynamic";

const ITENS = [
  { href: "/admin", rotulo: "Visão geral", icone: "📊" },
  { href: "/admin/vagas", rotulo: "Todas as vagas", icone: "💼" },
  { href: "/admin/vagas/nova", rotulo: "Cadastrar vaga", icone: "➕" },
  { href: "/admin/candidaturas", rotulo: "Todos os currículos", icone: "📄" },
  { href: "/admin/empresas", rotulo: "Empresas", icone: "🏢" },
];

export default async function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!supabaseConfigurado()) redirect("/configurar");

  const atual = await usuarioAtual();
  if (!atual) redirect("/admin/login");
  if (atual.perfil?.role !== "admin") redirect("/admin/login?erro=sem-permissao");

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-700 bg-slate-900">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-marca font-black text-white">
              {site.sigla}
            </span>
            <span className="hidden text-lg font-bold text-white sm:block">
              {site.nome}
            </span>
          </Link>
          <span className="rounded-md bg-amber-500 px-2.5 py-1 text-xs font-bold text-slate-900">
            ADMINISTRADOR
          </span>

          <div className="ml-auto flex items-center gap-3">
            <Link href="/" target="_blank" className="hidden text-sm text-slate-300 hover:text-white sm:block">
              Ver site ↗
            </Link>
            <span className="hidden max-w-[180px] truncate text-sm text-slate-400 md:block">
              {atual.perfil?.email}
            </span>
            <form action={sair}>
              <button className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-800">
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
