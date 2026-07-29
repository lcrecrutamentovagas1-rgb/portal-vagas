export function AlertaErro({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
      </svg>
      <span>{children}</span>
    </div>
  );
}

export function AlertaSucesso({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12.5 2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{children}</span>
    </div>
  );
}

export function AvisoConfiguracao() {
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-6">
      <h2 className="text-lg font-bold text-amber-900">
        ⚙️ Falta conectar o banco de dados
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-amber-900">
        Crie o arquivo <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono">.env.local</code>{" "}
        na raiz do projeto com as chaves do Supabase:
      </p>
      <pre className="mt-3 overflow-x-auto rounded-lg bg-amber-900 p-4 text-xs text-amber-50">
{`NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...`}
      </pre>
      <p className="mt-3 text-sm text-amber-900">
        Depois rode o arquivo <strong>supabase/schema.sql</strong> no SQL Editor do
        Supabase. O passo a passo completo está no <strong>LEIA-ME.md</strong>.
      </p>
    </div>
  );
}
