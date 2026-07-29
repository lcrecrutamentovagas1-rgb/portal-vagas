import Link from "next/link";
import FormularioLoginAdmin from "@/components/FormularioLoginAdmin";
import { site } from "@/lib/site";

export const metadata = { title: "Área do administrador" };

export default async function LoginAdmin({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <div className="grid min-h-screen place-items-center bg-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-marca text-2xl font-black text-white">
            {site.sigla}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">
            Área do administrador
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Acesso restrito à administração do {site.nome}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-xl">
          {erro === "sem-permissao" && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              Sua conta não tem permissão de administrador.
            </div>
          )}
          <FormularioLoginAdmin />
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          <Link href="/" className="hover:text-white hover:underline">
            ← Voltar para o site
          </Link>
        </p>
      </div>
    </div>
  );
}
