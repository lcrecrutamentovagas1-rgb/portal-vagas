import Link from "next/link";
import FormularioLogin from "@/components/FormularioLogin";
import Logo from "@/components/Logo";

export const metadata = { title: "Entrar" };

export default async function PaginaEntrar({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <div className="relative overflow-hidden bg-navy py-16">
      <div className="brilho-hero" />

      <div className="relative mx-auto max-w-md px-4">
        <div className="text-center">
          <div className="mx-auto flex w-fit items-center gap-2">
            <Logo tamanho={40} />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-white">
            Entrar como <span className="texto-gradiente">empresa</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Acesse seu painel para gerenciar vagas e currículos
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-7 shadow-2xl">
          <FormularioLogin redirecionar={redirect} />

          <p className="mt-5 border-t border-slate-100 pt-5 text-center text-sm text-slate-600">
            Ainda não tem conta?{" "}
            <Link href="/cadastro" className="font-semibold text-marca hover:underline">
              Cadastre-se grátis
            </Link>
          </p>
        </div>

        <div className="mt-6 space-y-2 text-center text-sm">
          <p className="text-slate-400">
            É candidato?{" "}
            <Link href="/vagas" className="text-azul-claro hover:underline">
              Não precisa de conta — veja as vagas
            </Link>
          </p>
          <p className="text-slate-500">
            É administrador?{" "}
            <Link href="/admin/login" className="hover:text-slate-300 hover:underline">
              Acesse aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
