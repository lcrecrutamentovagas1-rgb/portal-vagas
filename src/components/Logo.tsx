/**
 * Marca do site — o "V" alado com a bolinha, nas cores da logo.
 * Sem texto: o nome fica por conta do arquivo src/lib/site.ts.
 */
export default function Logo({
  tamanho = 36,
  className = "",
}: {
  tamanho?: number;
  className?: string;
}) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-asa-esq" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="logo-asa-dir" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#ffa629" />
          <stop offset="55%" stopColor="#ff5757" />
          <stop offset="100%" stopColor="#e91e8c" />
        </linearGradient>
        <linearGradient id="logo-pena" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e91e8c" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="logo-bola" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#1e90ff" />
        </linearGradient>
      </defs>

      {/* asa esquerda (azul) */}
      <path
        d="M4 10 L20 10 L33 46 L26 58 Z"
        fill="url(#logo-asa-esq)"
        strokeLinejoin="round"
      />
      {/* asa direita (laranja → magenta) */}
      <path
        d="M60 10 L44 10 L28 50 L33 58 Z"
        fill="url(#logo-asa-dir)"
        strokeLinejoin="round"
      />
      {/* penas (magenta → roxo) */}
      <path d="M60 24 L48 24 L40 42 L47 42 Z" fill="url(#logo-pena)" opacity=".95" />
      <path d="M60 38 L50 38 L44 52 L50 52 Z" fill="url(#logo-pena)" opacity=".8" />
      {/* cabeça */}
      <circle cx="32" cy="13" r="9" fill="url(#logo-bola)" />
    </svg>
  );
}
