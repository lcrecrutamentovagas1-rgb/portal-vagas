import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="text-6xl font-black text-marca">404</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Página não encontrada
        </h1>
        <p className="mt-2 text-slate-600">
          A vaga pode ter sido encerrada ou o endereço está incorreto.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="btn-primario">Ir para o início</Link>
          <Link href="/vagas" className="btn-secundario">Ver vagas</Link>
        </div>
      </div>
    </div>
  );
}
