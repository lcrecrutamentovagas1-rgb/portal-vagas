"use server";

import { revalidatePath } from "next/cache";
import { criarClienteServidor } from "@/lib/supabase/server";
import type { EstadoFormulario } from "@/lib/types";

function texto(fd: FormData, campo: string) {
  const v = fd.get(campo);
  return typeof v === "string" ? v.trim() : "";
}

/**
 * Registra a candidatura.
 * O arquivo já foi enviado direto do navegador para o Supabase Storage —
 * aqui recebemos apenas o caminho dele. Isso evita o limite de upload
 * das funções serverless (4,5 MB na Vercel).
 */
export async function enviarCandidatura(
  formData: FormData,
): Promise<EstadoFormulario> {
  const vagaId = texto(formData, "vaga_id");
  const nome = texto(formData, "nome");
  const email = texto(formData, "email").toLowerCase();
  const telefone = texto(formData, "telefone");
  const curriculoPath = texto(formData, "curriculo_path");

  if (!vagaId) return { erro: "Vaga não identificada." };
  if (!nome || !email || !telefone) {
    return { erro: "Preencha nome completo, e-mail e telefone." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { erro: "Informe um e-mail válido." };
  }
  if (!curriculoPath) {
    return { erro: "Anexe o seu currículo (PDF, DOC, DOCX, JPG ou PNG)." };
  }

  const supabase = await criarClienteServidor();

  // A vaga existe e está aberta?
  const { data: vaga } = await supabase
    .from("vagas")
    .select("id, status")
    .eq("id", vagaId)
    .maybeSingle();

  if (!vaga) return { erro: "Esta vaga não está mais disponível." };
  if (vaga.status === "encerrada") {
    return { erro: "Esta vaga já foi encerrada." };
  }

  const pretensaoTexto = texto(formData, "pretensao")
    .replace(/\./g, "")
    .replace(",", ".");
  const pretensaoNum = Number(pretensaoTexto);

  const { error } = await supabase.from("candidaturas").insert({
    vaga_id: vagaId,
    nome,
    email,
    telefone,
    cidade: texto(formData, "cidade") || null,
    estado: texto(formData, "estado") || null,
    linkedin: texto(formData, "linkedin") || null,
    cargo_atual: texto(formData, "cargo_atual") || null,
    pretensao:
      pretensaoTexto && !Number.isNaN(pretensaoNum) ? pretensaoNum : null,
    mensagem: texto(formData, "mensagem") || null,
    curriculo_url: curriculoPath,
    curriculo_nome: texto(formData, "curriculo_nome") || null,
  });

  if (error) {
    // 23505 = índice único → já existe candidatura deste e-mail nesta vaga
    if (error.code === "23505") {
      return { erro: "Você já se candidatou a esta vaga com este e-mail." };
    }
    return { erro: error.message };
  }

  revalidatePath(`/vagas/${vagaId}`);
  return {
    sucesso:
      "Candidatura enviada com sucesso! A empresa receberá o seu currículo. Boa sorte!",
  };
}

/** Gera um link temporário (1 hora) para abrir o currículo. */
export async function linkDoCurriculo(caminho: string) {
  const supabase = await criarClienteServidor();
  const { data } = await supabase.storage
    .from("curriculos")
    .createSignedUrl(caminho, 3600);
  return data?.signedUrl ?? null;
}
