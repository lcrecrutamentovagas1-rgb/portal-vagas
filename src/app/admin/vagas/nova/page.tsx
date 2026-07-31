import FormularioVaga from "@/components/FormularioVaga";
import { exigirAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Cadastrar vaga" };

export default async function AdminNovaVaga() {
  await exigirAdmin();

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Cadastrar vaga</h1>
        <p className="mt-1 text-slate-600">
          Como administrador, você publica a vaga direto — sem precisar de
          aprovação.
        </p>
      </div>
      <FormularioVaga modoAdmin />
    </div>
  );
}
