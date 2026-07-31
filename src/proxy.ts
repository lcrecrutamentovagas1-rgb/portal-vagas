import { type NextRequest } from "next/server";
import { atualizarSessao } from "@/lib/supabase/middleware";

/**
 * Mantém a sessão do Supabase válida em toda requisição
 * e protege as rotas /painel e /admin.
 */
export default async function proxy(request: NextRequest) {
  return atualizarSessao(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
