import { exigirAdmin } from "@/lib/auth";
import ImportadorCurriculos from "@/components/ImportadorCurriculos";

export const dynamic = "force-dynamic";
export const metadata = { title: "Importar currículos" };

export default async function PaginaImportar() {
  await exigirAdmin();

  return (
    <div className="max-w-4xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Importar currículos
        </h1>
        <p className="mt-1 text-slate-600">
          Selecione os arquivos que você baixou do Google Drive. O sistema lê
          nome, e-mail e telefone de dentro de cada currículo — você confere e
          corrige antes de salvar.
        </p>
      </div>

      <details className="cartao p-5">
        <summary className="cursor-pointer font-semibold text-slate-900">
          📥 Como baixar a pasta do Google Drive
        </summary>
        <ol className="mt-3 space-y-2 pl-5 text-[15px] text-slate-700">
          <li className="list-decimal">
            Abra o <strong>Google Drive</strong> no computador
          </li>
          <li className="list-decimal">
            Clique com o <strong>botão direito</strong> na pasta dos currículos
          </li>
          <li className="list-decimal">
            Escolha <strong>Fazer download</strong> — o Drive gera um arquivo
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-sm">.zip</code>
          </li>
          <li className="list-decimal">
            Na pasta Downloads, clique com o botão direito no .zip →{" "}
            <strong>Extrair tudo</strong>
          </li>
          <li className="list-decimal">
            Volte aqui e selecione os arquivos extraídos
          </li>
        </ol>
        <p className="mt-3 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-900">
          🔒 <strong>Privacidade:</strong> a leitura acontece dentro do seu
          navegador. Os arquivos vão direto para o <strong>seu</strong> Supabase
          — não passam por nenhum outro servidor.
        </p>
      </details>

      <ImportadorCurriculos />
    </div>
  );
}
