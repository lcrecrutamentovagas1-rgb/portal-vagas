import Link from "next/link";
import { site } from "@/lib/site";

export default function Rodape() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-marca font-black text-white">
              {site.sigla}
            </span>
            <span className="text-lg font-bold text-marca">{site.nome}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {site.slogan}
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-900">Candidatos</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/vagas" className="hover:text-marca">Buscar vagas</Link></li>
            <li><Link href="/vagas?modalidade=remoto" className="hover:text-marca">Vagas remotas</Link></li>
            <li><Link href="/empresas" className="hover:text-marca">Empresas contratando</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-900">Empresas</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/cadastro" className="hover:text-marca">Criar conta grátis</Link></li>
            <li><Link href="/painel/vagas/nova" className="hover:text-marca">Publicar uma vaga</Link></li>
            <li><Link href="/entrar" className="hover:text-marca">Acessar painel</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-900">Institucional</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/sobre" className="hover:text-marca">Sobre nós</Link></li>
            <li><Link href="/contato" className="hover:text-marca">Contato</Link></li>
            <li><Link href="/admin/login" className="hover:text-marca">Área do administrador</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} {site.nome}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
