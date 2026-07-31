import Link from "next/link";
import { site } from "@/lib/site";
import { usuarioAtual } from "@/lib/auth";
import { sair } from "@/app/actions/auth";
import MenuMobile from "./MenuMobile";

export default async function Cabecalho() {
  const atual = await usuarioAtual().catch(() => null);
  const logado = Boolean(atual);
  const ehAdmin = atual?.perfil?.role === "admin";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-marca text-lg font-black text-white">
            {site.sigla}
          </span>
          <span className="text-xl font-bold tracking-tight text-marca">
            {site.nome}
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          <Link
            href="/vagas"
            className="rounded-lg px-3 py-2 text-[15px] font-medium text-slate-700 hover:bg-slate-100"
          >
            Buscar vagas
          </Link>
          <Link
            href="/empresas"
            className="rounded-lg px-3 py-2 text-[15px] font-medium text-slate-700 hover:bg-slate-100"
          >
            Empresas
          </Link>
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          {logado ? (
            <>
              <Link
                href={ehAdmin ? "/admin" : "/painel"}
                className="rounded-lg px-3 py-2 text-[15px] font-semibold text-marca hover:bg-marca-clara"
              >
                {ehAdmin ? "Administração" : "Meu painel"}
              </Link>
              <form action={sair}>
                <button className="rounded-lg px-3 py-2 text-[15px] font-medium text-slate-600 hover:bg-slate-100">
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/entrar"
                className="rounded-lg px-3 py-2 text-[15px] font-medium text-slate-700 hover:bg-slate-100"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="rounded-lg border border-marca px-4 py-2 text-[15px] font-semibold text-marca transition hover:bg-marca-clara"
              >
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
