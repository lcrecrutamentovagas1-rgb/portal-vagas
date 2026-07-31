import Link from "next/link";
import { site } from "@/lib/site";
import { usuarioAtual } from "@/lib/auth";
import { sair } from "@/app/actions/auth";
import Logo from "./Logo";
import MenuMobile from "./MenuMobile";

export default async function Cabecalho() {
  const atual = await usuarioAtual().catch(() => null);
  const logado = Boolean(atual);
  const ehAdmin = atual?.perfil?.role === "admin";

  return (
    <header className="sticky top-0 z-50 border-b border-navy-borda bg-navy/95 backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Logo tamanho={34} />
          <span className="text-xl font-extrabold tracking-tight text-white">
            {site.nome}
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          <ItemNav href="/vagas">Vagas</ItemNav>
          <ItemNav href="/vagas-por-setor">Setores</ItemNav>
          <ItemNav href="/empresas">Empresas</ItemNav>
          <ItemNav href="/planos">Planos</ItemNav>
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          {logado ? (
            <>
              <Link
                href={ehAdmin ? "/admin" : "/painel"}
                className="rounded-lg px-3 py-2 text-[15px] font-semibold text-azul-claro hover:bg-white/10"
              >
                {ehAdmin ? "Administração" : "Meu painel"}
              </Link>
              <form action={sair}>
                <button className="rounded-lg px-3 py-2 text-[15px] font-medium text-slate-300 hover:bg-white/10">
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/entrar"
                className="rounded-lg px-3 py-2 text-[15px] font-medium text-slate-200 hover:bg-white/10"
              >
                Entrar
              </Link>
              <Link href="/cadastro" className="btn-primario px-4 py-2 text-sm">
                Publicar vaga
              </Link>
            </>
          )}
        </div>

        <MenuMobile logado={logado} ehAdmin={ehAdmin} />
      </div>
    </header>
  );
}

function ItemNav({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-2 text-[15px] font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </Link>
  );
}
