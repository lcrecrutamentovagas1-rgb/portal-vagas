import Link from "next/link";
import { site } from "@/lib/site";
import Logo from "./Logo";

export default function Rodape() {
  return (
    <footer className="mt-20 bg-navy text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Logo tamanho={32} />
            <span className="text-lg font-extrabold text-white">{site.nome}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            {site.slogan}
          </p>
        </div>

        <Coluna titulo="Candidatos">
          <ItemRodape href="/vagas">Buscar vagas</ItemRodape>
          <ItemRodape href="/vagas-por-setor">Vagas por setor</ItemRodape>
          <ItemRodape href="/vagas?modalidade=remoto">Vagas remotas</ItemRodape>
          <ItemRodape href="/empresas">Empresas contratando</ItemRodape>
        </Coluna>

        <Coluna titulo="Empresas">
          <ItemRodape href="/cadastro">Criar conta grátis</ItemRodape>
          <ItemRodape href="/painel/vagas/nova">Publicar uma vaga</ItemRodape>
          <ItemRodape href="/planos">Planos e preços</ItemRodape>
          <ItemRodape href="/entrar">Acessar painel</ItemRodape>
        </Coluna>

        <Coluna titulo="Institucional">
          <ItemRodape href="/sobre">Sobre nós</ItemRodape>
          <ItemRodape href="/contato">Contato</ItemRodape>
          <ItemRodape href="/admin/login">Área do administrador</ItemRodape>
        </Coluna>
      </div>

      {/* fio com o gradiente da logo */}
      <div className="h-px w-full" style={{ background: "var(--grad-logo)" }} />

      <div className="py-6 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} {site.nome}. Todos os direitos reservados.
      </div>
    </footer>
  );
}

function Coluna({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">
        {titulo}
      </h3>
      <ul className="space-y-2 text-sm">{children}</ul>
    </div>
  );
}

function ItemRodape({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-slate-400 transition hover:text-azul-claro">
        {children}
      </Link>
    </li>
  );
}
