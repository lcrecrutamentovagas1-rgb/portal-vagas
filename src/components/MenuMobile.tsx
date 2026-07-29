"use client";

import Link from "next/link";
import { useState } from "react";

export default function MenuMobile({
  logado,
  ehAdmin,
}: {
  logado: boolean;
  ehAdmin: boolean;
}) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="ml-auto md:hidden">
      <button
        onClick={() => setAberto((a) => !a)}
        aria-label="Abrir menu"
        className="grid h-10 w-10 place-items-center rounded-lg hover:bg-slate-100"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {aberto ? (
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          ) : (
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {aberto && (
        <div className="absolute left-0 right-0 top-16 border-b border-slate-200 bg-white p-4 shadow-lg">
          <nav className="flex flex-col gap-1">
            <Link href="/vagas" onClick={() => setAberto(false)} className="rounded-lg px-3 py-2.5 font-medium text-slate-700 hover:bg-slate-100">
              Buscar vagas
            </Link>
            <Link href="/empresas" onClick={() => setAberto(false)} className="rounded-lg px-3 py-2.5 font-medium text-slate-700 hover:bg-slate-100">
              Empresas
            </Link>
            <hr className="my-2 border-slate-200" />
            {logado ? (
              <>
                <Link href={ehAdmin ? "/admin" : "/painel"} onClick={() => setAberto(false)} className="rounded-lg px-3 py-2.5 font-semibold text-marca hover:bg-marca-clara">
                  {ehAdmin ? "Administração" : "Meu painel"}
                </Link>
                <Link href="/api/sair" onClick={() => setAberto(false)} className="rounded-lg px-3 py-2.5 font-medium text-slate-600 hover:bg-slate-100">
                  Sair
                </Link>
              </>
            ) : (
              <>
                <Link href="/entrar" onClick={() => setAberto(false)} className="rounded-lg px-3 py-2.5 font-medium text-slate-700 hover:bg-slate-100">
                  Entrar
                </Link>
                <Link href="/cadastro" onClick={() => setAberto(false)} className="rounded-lg bg-marca px-3 py-2.5 text-center font-semibold text-white">
                  Publicar vaga
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
