import Link from "next/link";
import { site } from "@/lib/site";
import { SUPABASE_KEY, SUPABASE_URL } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";
export const metadata = { title: "Configuração inicial" };

/** Diagnóstico simples: o que já está certo e o que falta. */
function diagnosticar() {
  const problemas: string[] = [];

  if (!SUPABASE_URL) {
    problemas.push("A URL do projeto (NEXT_PUBLIC_SUPABASE_URL) está vazia.");
  } else if (!/^https:\/\/[a-z0-9-]+\.supabase\.(co|in)$/i.test(SUPABASE_URL)) {
    problemas.push(
      `A URL parece errada: "${SUPABASE_URL}". Ela deve ser parecida com https://abcdefgh.supabase.co (sem barra no final).`,
    );
  }

  if (!SUPABASE_KEY) {
    problemas.push("A chave (NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) está vazia.");
  } else if (
    !SUPABASE_KEY.startsWith("sb_publishable_") &&
    !SUPABASE_KEY.startsWith("eyJ")
  ) {
    problemas.push(
      "A chave não parece uma chave pública do Supabase. Ela começa com sb_publishable_ (projetos novos) ou com eyJ (projetos antigos).",
    );
  } else if (SUPABASE_KEY.startsWith("sb_secret_")) {
    problemas.push(
      "⚠️ Você colou a chave SECRETA. Use a Publishable key (pública) — a secreta nunca deve ir para o site.",
    );
  }

  return problemas;
}

export default function PaginaConfigurar() {
  const problemas = diagnosticar();

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <div className="text-center">
        <span className="text-5xl">⚙️</span>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Falta conectar o banco de dados
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-slate-600">
          O {site.nome} está pronto, mas ainda não sabe onde guardar as vagas e
          os currículos.
        </p>
      </div>

      {/* ---- O QUE ESTÁ FALTANDO ---- */}
      <div className="mt-8 rounded-xl border border-amber-300 bg-amber-50 p-6">
        <h2 className="font-bold text-amber-900">O que falta agora:</h2>
        <ul className="mt-3 space-y-2">
          {problemas.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-amber-900">
              <span>•</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ---- STATUS ---- */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Status
          ok={Boolean(SUPABASE_URL)}
          rotulo="URL do projeto"
          valor={SUPABASE_URL || "não preenchida"}
        />
        <Status
          ok={Boolean(SUPABASE_KEY)}
          rotulo="Chave pública"
          valor={
            SUPABASE_KEY
              ? `${SUPABASE_KEY.slice(0, 18)}...`
              : "não preenchida"
          }
        />
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-900">
          📖 O passo a passo completo
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
          Abra o arquivo <strong>COMECE-AQUI.md</strong> na pasta do projeto.
          Ele explica tudo com detalhes, feito para quem nunca programou — do
          zero até o site no ar.
        </p>

        <h3 className="mt-6 font-bold text-slate-900">Resumo bem rápido:</h3>
        <ol className="mt-3 space-y-3 text-[15px] text-slate-700">
          <li className="flex gap-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-marca text-xs font-bold text-white">1</span>
            <span>
              Crie um projeto grátis em{" "}
              <a href="https://supabase.com" target="_blank" rel="noreferrer" className="font-semibold text-marca hover:underline">
                supabase.com
              </a>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-marca text-xs font-bold text-white">2</span>
            <span>
              No <strong>SQL Editor</strong>, cole todo o conteúdo do arquivo{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">
                supabase/schema.sql
              </code>{" "}
              e clique em <strong>Run</strong>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-marca text-xs font-bold text-white">3</span>
            <span>
              Em <strong>Settings → API Keys</strong>, copie a{" "}
              <strong>URL</strong> e a <strong>Publishable key</strong> e cole
              no arquivo{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">
                .env.local
              </code>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-marca text-xs font-bold text-white">4</span>
            <span>
              Reinicie o site e crie seu admin com{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">
                select public.promover_admin(&apos;seu@email.com&apos;);
              </code>
            </span>
          </li>
        </ol>

        <div className="mt-6 rounded-lg bg-slate-900 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Como o .env.local deve ficar
          </p>
          <pre className="overflow-x-auto text-xs leading-relaxed text-slate-100">
{`NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ABC123...`}
          </pre>
        </div>

        <p className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-900">
          💡 Sempre que mexer no <strong>.env.local</strong>, é preciso parar e
          iniciar o site de novo para ele ler os valores novos.
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="btn-secundario">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}

function Status({
  ok,
  rotulo,
  valor,
}: {
  ok: boolean;
  rotulo: string;
  valor: string;
}) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 ${
        ok ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"
      }`}
    >
      <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <span>{ok ? "✅" : "⬜"}</span>
        {rotulo}
      </p>
      <p className="mt-1 truncate font-mono text-xs text-slate-500">{valor}</p>
    </div>
  );
}
