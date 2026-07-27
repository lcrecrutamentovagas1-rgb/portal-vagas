import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_KEY, SUPABASE_URL, supabaseConfigurado } from "./config";

/** Mantém a sessão do usuário atualizada em todas as requisições. */
export async function atualizarSessao(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!supabaseConfigurado()) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const caminho = request.nextUrl.pathname;
  const rotaProtegida =
    caminho.startsWith("/painel") || caminho.startsWith("/admin");
  const rotaDeLogin =
    caminho === "/admin/login" ||
    caminho === "/entrar" ||
    caminho === "/cadastro";

  if (!user && rotaProtegida && !rotaDeLogin) {
    const url = request.nextUrl.clone();
    url.pathname = caminho.startsWith("/admin") ? "/admin/login" : "/entrar";
    url.searchParams.set("redirect", caminho);
    return NextResponse.redirect(url);
  }

  return response;
}
