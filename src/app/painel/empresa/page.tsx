import { exigirEmpresa } from "@/lib/auth";
import FormularioEmpresa from "@/components/FormularioEmpresa";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dados da empresa" };

export default async function DadosEmpresa() {
  const { empresa, user } = await exigirEmpresa();

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dados da empresa</h1>
        <p className="mt-1 text-slate-600">
          Essas informações aparecem para os candidatos.
        </p>
      </div>

      <div className="cartao p-6">
        <FormularioEmpresa empresa={empresa} email={user.email ?? ""} />
      </div>
    </div>
  );
}
