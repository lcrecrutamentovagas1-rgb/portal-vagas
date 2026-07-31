"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BuscaVagas({
  qInicial = "",
  localInicial = "",
  grande = false,
}: {
  qInicial?: string;
  localInicial?: string;
  grande?: boolean;
}) {
  const router = useRouter();
  const [q, setQ] = useState(qInicial);
  const [local, setLocal] = useState(localInicial);

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (local.trim()) params.set("local", local.trim());
    router.push(`/vagas${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form
      onSubmit={buscar}
      className={`flex flex-col gap-2 rounded-xl border border-slate-300 bg-white p-2 shadow-sm sm:flex-row ${
        grande ? "sm:p-2.5" : ""
      }`}
    >
      <label className="flex flex-1 items-center gap-2 rounded-lg px-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" className="shrink-0">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cargo, palavra-chave ou empresa"
          className="w-full bg-transparent py-2.5 text-[15px] outline-none placeholder:text-slate-400"
        />
      </label>

      <span className="hidden w-px bg-slate-200 sm:block" />

      <label className="flex flex-1 items-center gap-2 rounded-lg px-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" className="shrink-0">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <input
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          placeholder="Cidade, estado ou remoto"
          className="w-full bg-transparent py-2.5 text-[15px] outline-none placeholder:text-slate-400"
        />
      </label>

      <button type="submit" className="btn-primario shrink-0 sm:px-8">
        Buscar vagas
      </button>
    </form>
  );
}
