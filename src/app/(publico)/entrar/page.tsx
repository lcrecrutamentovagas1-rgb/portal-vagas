import Link from "next/link";
import FormularioLogin from "@/components/FormularioLogin";

export const metadata = { title: "Entrar" };

export default async function PaginaEntrar({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-center text-2xl font-bold text-slate-900">
        Entrar na sua conta
      </h1>
      <p className="mt-1 text-center text-slate-600">
        Área da empresa para gerenciar vagas e currículos.
      </p>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <FormularioLogin redirecionar={redirect} />
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-semibold text-marca hover:underline">
          Cadastre sua empresa grátis
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-slate-400">
        É administrador?{" "}
        <Link href="/admin/login" className="hover:text-marca hover:underline">
          Acesse aqui
        </Link>
      </p>
    </div>
  );
}
