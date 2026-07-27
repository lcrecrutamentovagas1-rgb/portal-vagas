import Link from "next/link";
import { site } from "@/lib/site";

export const metadata = { title: "Sobre nós" };

export default function PaginaSobre() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Sobre o {site.nome}</h1>

      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-700">
        <p>
          O {site.nome} é um portal de vagas que conecta empresas e profissionais
          em todo o Brasil, de forma simples e gratuita.
        </p>
        <p>
          <strong>Para o candidato:</strong> não é preciso criar conta. Basta
          encontrar a vaga, preencher seus dados e anexar o currículo — em PDF,
          Word ou até uma foto. A empresa recebe tudo organizado.
        </p>
        <p>
          <strong>Para a empresa:</strong> crie uma conta gratuita, publique
          quantas vagas quiser e acompanhe cada candidato pelo painel, mudando o
          status conforme avança no processo seletivo.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/vagas" className="btn-primario">Buscar vagas</Link>
        <Link href="/cadastro" className="btn-secundario">Cadastrar empresa</Link>
      </div>
    </div>
  );
}
