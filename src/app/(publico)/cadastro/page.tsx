import Link from "next/link";
import FormularioCadastro from "@/components/FormularioCadastro";
import Logo from "@/components/Logo";

export const metadata = { title: "Cadastrar empresa" };

export default function PaginaCadastro() {
  return (
    <div className="relative overflow-hidden bg-navy py-14">
      <div className="brilho-hero" />

      <div className="relative mx-auto max-w-2xl px-4">
        <div className="text-center">
          <div className="mx-auto w-fit">
            <Logo tamanho={40} />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">
            Cadastre sua empresa <span className="texto-gradiente">grátis</span>
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-slate-300">
            Publique vagas e receba os currículos organizados num painel. Sem
            mensalidade, sem fidelidade.
          </p>
        </div>

        {/* selos de confiança */}
        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
          <span>✓ Grátis para começar</span>
          <span>✓ Sem cartão de crédito</span>
          <span>✓ Pronto em 1 minuto</span>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-7 shadow-2xl sm:p-8">
          <FormularioCadastro />
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Já tem conta?{" "}
          <Link href="/entrar" className="font-semibold text-azul-claro hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
