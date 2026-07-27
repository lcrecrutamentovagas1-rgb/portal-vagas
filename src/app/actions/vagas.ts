"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import type { EstadoFormulario, StatusVaga } from "@/lib/types";

function texto(fd: FormData, campo: string) {
  const v = fd.get(campo);
  return typeof v === "string" ? v.trim() : "";
}

function numero(fd: FormData, campo: string) {
  const v = texto(fd, campo).replace(/\./g, "").replace(",", ".");
  const n = Number(v);
  return v && !Number.isNaN(n) ? n : null;
}

async function contexto() {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: perfil } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const { data: empresa } = await supabase
    .from("empresas")
    .select("id, nome")
    .eq("user_id", user.id)
    .maybeSingle();

  return { supabase, user, ehAdmin: perfil?.role === "admin", empresa };
}

/** Cria ou edita uma vaga (empresa ou admin) */
export async function salvarVaga(
  _estado: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const ctx = await contexto();
  if (!ctx) return { erro: "Sessão expirada. Entre novamente." };
  const { supabase, user, ehAdmin, empresa } = ctx;

  const id = texto(formData, "id");
  const titulo = texto(formData, "titulo");
  const descricao = texto(formData, "descricao");

  if (!titulo || !descricao) {
    return { erro: "Título e descrição da vaga são obrigatórios." };
  }

  const combinar = formData.get("salario_combinar") === "on";
  const empresaNomeManual = texto(formData, "empresa_nome");

  const dados: Record<string, unknown> = {
    titulo,
    descricao,
    requisitos: texto(formData, "requisitos") || null,
    beneficios: texto(formData, "beneficios") || null,
    area: texto(formData, "area") || null,
    nivel: texto(formData, "nivel") || null,
    cidade: texto(formData, "cidade") || null,
    estado: texto(formData, "estado") || null,
    modalidade: texto(formData, "modalidade") || "presencial",
    tipo_contrato: texto(formData, "tipo_contrato") || "clt",
    salario_combinar: combinar,
    salario_min: combinar ? null : numero(formData, "salario_min"),
    salario_max: combinar ? null : numero(formData, "salario_max"),
    vagas_disponiveis: Number(texto(formData, "vagas_disponiveis") || 1),
    email_contato: texto(formData, "email_contato") || user.email,
  };

  if (ehAdmin) {
    // Admin publica direto e pode digitar o nome da empresa manualmente.
    dados.empresa_nome = empresaNomeManual || empresa?.nome || "Empresa";
    dados.destaque = formData.get("destaque") === "on";
    const statusEscolhido = texto(formData, "status") as StatusVaga;
    dados.status = statusEscolhido || "publicada";
  } else {
    if (!empresa) return { erro: "Complete o cadastro da sua empresa primeiro." };
    dados.empresa_id = empresa.id;
    dados.empresa_nome = empresa.nome;
  }

  if (id) {
    const { error } = await supabase.from("vagas").update(dados).eq("id", id);
    if (error) return { erro: error.message };
  } else {
    dados.criado_por = user.id;
    if (!ehAdmin) dados.status = "pendente";
    const { error } = await supabase.from("vagas").insert(dados);
    if (error) return { erro: error.message };
  }

  revalidatePath("/");
  revalidatePath("/vagas");
  revalidatePath("/painel/vagas");
  revalidatePath("/admin/vagas");
  redirect(ehAdmin ? "/admin/vagas?ok=1" : "/painel/vagas?ok=1");
}

/** Muda o status de uma vaga */
export async function mudarStatusVaga(formData: FormData) {
  const supabase = await criarClienteServidor();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !status) return;

  await supabase.from("vagas").update({ status }).eq("id", id);

  revalidatePath("/");
  revalidatePath("/vagas");
  revalidatePath("/painel/vagas");
  revalidatePath("/admin/vagas");
}

/** Marca/desmarca destaque (somente admin, garantido pela RLS) */
export async function alternarDestaque(formData: FormData) {
  const supabase = await criarClienteServidor();
  const id = String(formData.get("id") ?? "");
  const atual = String(formData.get("destaque") ?? "") === "true";
  if (!id) return;

  await supabase.from("vagas").update({ destaque: !atual }).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/vagas");
}

export async function excluirVaga(formData: FormData) {
  const supabase = await criarClienteServidor();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("vagas").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath("/vagas");
  revalidatePath("/painel/vagas");
  revalidatePath("/admin/vagas");
}

/** Muda o status de uma candidatura */
export async function mudarStatusCandidatura(formData: FormData) {
  const supabase = await criarClienteServidor();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !status) return;

  await supabase.from("candidaturas").update({ status }).eq("id", id);
  revalidatePath("/painel/candidaturas");
  revalidatePath("/admin/candidaturas");
}

export async function excluirCandidatura(formData: FormData) {
  const supabase = await criarClienteServidor();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await supabase.from("candidaturas").delete().eq("id", id);
  revalidatePath("/painel/candidaturas");
  revalidatePath("/admin/candidaturas");
}
