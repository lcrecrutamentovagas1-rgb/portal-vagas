import Link from "next/link";
import FormularioCadastro from "@/components/FormularioCadastro";

export const metadata = { title: "Cadastrar empresa" };

export default function PaginaCadastro() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-center text-2xl font-bold text-slate-900">
        Cadastre sua empresa grátis
      </h1>
      <p className="mx-auto mt-2 max-w-lg text-center text-slate-600">
        Publique vagas ilimitadas e receba os currículos organizados em um
        painel. Sem mensalidade.
      </p>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <FormularioCadastro />
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">
        Já tem conta?{" "}
        <Link href="/entrar" className="font-semibold text-marca hover:underline">
          Fazer login
        </Link>
      </p>
    </div>
  );
}
