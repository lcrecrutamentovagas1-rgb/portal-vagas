"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import type { EstadoFormulario } from "@/lib/types";

function texto(fd: FormData, campo: string) {
  const v = fd.get(campo);
  return typeof v === "string" ? v.trim() : "";
}

/** Cadastro de EMPRESA */
export async function cadastrarEmpresa(
  _estado: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const email = texto(formData, "email").toLowerCase();
  const senha = texto(formData, "senha");
  const confirmar = texto(formData, "confirmar");
  const empresaNome = texto(formData, "empresa_nome");
  const responsavel = texto(formData, "responsavel");

  if (!email || !senha || !empresaNome) {
    return { erro: "Preencha nome da empresa, e-mail e senha." };
  }
  if (senha.length < 6) return { erro: "A senha precisa ter ao menos 6 caracteres." };
  if (senha !== confirmar) return { erro: "As senhas não conferem." };

  const supabase = await criarClienteServidor();
  const { error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      data: {
        role: "empresa",
        nome: responsavel || empresaNome,
        empresa_nome: empresaNome,
        cnpj: texto(formData, "cnpj"),
        telefone: texto(formData, "telefone"),
        cidade: texto(formData, "cidade"),
        estado: texto(formData, "estado"),
      },
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { erro: "Este e-mail já está cadastrado. Faça login." };
    }
    return { erro: error.message };
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      sucesso:
        "Conta criada! Confirme o e-mail que enviamos para você e depois faça login.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/painel");
}

/** Login (empresa ou admin) */
export async function entrar(
  _estado: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const email = texto(formData, "email").toLowerCase();
  const senha = texto(formData, "senha");
  const destinoInformado = texto(formData, "redirect");

  if (!email || !senha) return { erro: "Informe e-mail e senha." };

  const supabase = await criarClienteServidor();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) return { erro: "E-mail ou senha inválidos." };

  const { data: perfil } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  const ehAdmin = perfil?.role === "admin";
  const destino =
    destinoInformado && destinoInformado.startsWith("/")
      ? destinoInformado
      : ehAdmin
        ? "/admin"
        : "/painel";

  revalidatePath("/", "layout");
  redirect(destino);
}

/** Login exclusivo do painel de administrador */
export async function entrarAdmin(
  _estado: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const email = texto(formData, "email").toLowerCase();
  const senha = texto(formData, "senha");
  if (!email || !senha) return { erro: "Informe e-mail e senha." };

  const supabase = await criarClienteServidor();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });
  if (error) return { erro: "E-mail ou senha inválidos." };

  const { data: perfil } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (perfil?.role !== "admin") {
    await supabase.auth.signOut();
    return { erro: "Esta conta não tem permissão de administrador." };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function sair() {
  const supabase = await criarClienteServidor();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

/** Atualiza os dados públicos da empresa */
export async function salvarEmpresa(
  _estado: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { erro: "Sessão expirada. Entre novamente." };

  const nome = texto(formData, "nome");
  if (!nome) return { erro: "O nome da empresa é obrigatório." };

  const dados = {
    nome,
    cnpj: texto(formData, "cnpj") || null,
    site: texto(formData, "site") || null,
    telefone: texto(formData, "telefone") || null,
    cidade: texto(formData, "cidade") || null,
    estado: texto(formData, "estado") || null,
    sobre: texto(formData, "sobre") || null,
  };

  const { data: existente } = await supabase
    .from("empresas")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const { error } = existente
    ? await supabase.from("empresas").update(dados).eq("id", existente.id)
    : await supabase.from("empresas").insert({ ...dados, user_id: user.id });

  if (error) return { erro: error.message };

  revalidatePath("/painel/empresa");
  return { sucesso: "Dados da empresa atualizados!" };
}
