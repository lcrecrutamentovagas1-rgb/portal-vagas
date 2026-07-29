import { site } from "@/lib/site";

export const metadata = { title: "Contato" };

export default function PaginaContato() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Fale conosco</h1>
      <p className="mt-2 text-slate-600">
        Dúvidas, sugestões ou problemas? Estamos por aqui.
      </p>

      <div className="mt-8 space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-900">E-mail</h2>
          <a
            href={`mailto:${site.email}`}
            className="mt-1 block text-marca hover:underline"
          >
            {site.email}
          </a>
          <p className="mt-2 text-sm text-slate-500">
            Respondemos em até 2 dias úteis.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-900">É uma empresa?</h2>
          <p className="mt-1 text-sm text-slate-600">
            Publicar vagas é gratuito. Crie sua conta e comece agora mesmo.
          </p>
          <a href="/cadastro" className="btn-primario mt-4">Criar conta</a>
        </div>
      </div>
    </div>
  );
}
