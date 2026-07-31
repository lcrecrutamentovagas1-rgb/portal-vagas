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
  const fechar = () => setAberto(false);

  return (
    <div className="ml-auto md:hidden">
      <button
        onClick={() => setAberto((a) => !a)}
        aria-label="Abrir menu"
        className="grid h-10 w-10 place-items-center rounded-lg text-white hover:bg-white/10"
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
        <div className="absolute left-0 right-0 top-[68px] border-b border-navy-borda bg-navy p-4 shadow-xl">
          <nav className="flex flex-col gap-1">
            <Item href="/vagas" onClick={fechar}>Vagas</Item>
            <Item href="/vagas-por-setor" onClick={fechar}>Setores</Item>
            <Item href="/empresas" onClick={fechar}>Empresas</Item>
            <Item href="/planos" onClick={fechar}>Planos</Item>

            <hr className="my-2 border-navy-borda" />

            {logado ? (
              <>
                <Item href={ehAdmin ? "/admin" : "/painel"} onClick={fechar} destaque>
                  {ehAdmin ? "Administração" : "Meu painel"}
                </Item>
                <Item href="/api/sair" onClick={fechar}>Sair</Item>
              </>
            ) : (
              <>
                <Item href="/entrar" onClick={fechar}>Entrar</Item>
                <Link
                  href="/cadastro"
                  onClick={fechar}
                  className="btn-primario mt-1 w-full"
                >
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

function Item({
  href,
  onClick,
  children,
  destaque,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
  destaque?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`rounded-lg px-3 py-2.5 font-medium transition hover:bg-white/10 ${
        destaque ? "text-azul-claro" : "text-slate-200"
      }`}
    >
      {children}
    </Link>
  );
}
