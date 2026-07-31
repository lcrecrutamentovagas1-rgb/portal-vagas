"use client";

import { useFormStatus } from "react-dom";

export default function BotaoEnviar({
  children,
  carregando = "Enviando...",
  className = "btn-primario w-full",
}: {
  children: React.ReactNode;
  carregando?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? (
        <>
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          {carregando}
        </>
      ) : (
        children
      )}
    </button>
  );
}
