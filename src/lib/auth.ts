import { redirect } from "next/navigation";
import { criarClienteServidor, supabaseConfigurado } from "@/lib/supabase/server";
import type { Empresa, Perfil } from "@/lib/types";

/** Usuário logado + perfil (ou null). */
export async function usuarioAtual() {
  if (!supabaseConfigurado()) return null;

  try {
    const supabase = await criarClienteServidor();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: perfil } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    return { user, perfil: perfil as Perfil | null };
  } catch {
    return null;
  }
}

/** Exige login de empresa; devolve também o registro da empresa. */
export async function exigirEmpresa() {
  if (!supabaseConfigurado()) redirect("/configurar");

  const atual = await usuarioAtual();
  if (!atual) redirect("/entrar");

  const supabase = await criarClienteServidor();
  const { data: empresa } = await supabase
    .from("empresas")
    .select("*")
    .eq("user_id", atual.user.id)
    .maybeSingle();

  return { ...atual, empresa: empresa as Empresa | null };
}

/** Exige login de administrador. */
export async function exigirAdmin() {
  if (!supabaseConfigurado()) redirect("/configurar");

  const atual = await usuarioAtual();
  if (!atual) redirect("/admin/login");
  if (atual.perfil?.role !== "admin") redirect("/admin/login?erro=sem-permissao");
  return atual;
}
