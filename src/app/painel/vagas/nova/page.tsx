import Link from "next/link";
import FormularioVaga from "@/components/FormularioVaga";
import { exigirEmpresa } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Publicar vaga" };

export default async function NovaVaga() {
  const { empresa } = await exigirEmpresa();

  if (!empresa) {
    return (
      <div className="cartao p-8 text-center">
        <p className="text-lg font-semibold text-slate-800">
          Complete o cadastro da empresa
        </p>
        <p className="mt-1 text-slate-600">
          Precisamos dos dados da sua empresa antes de publicar vagas.
        </p>
        <Link href="/painel/empresa" className="btn-primario mt-5">
          Preencher dados
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Publicar nova vaga</h1>
        <p className="mt-1 text-slate-600">
          Quanto mais completa a descrição, melhores os candidatos.
        </p>
      </div>
      <FormularioVaga />
    </div>
  );
}
