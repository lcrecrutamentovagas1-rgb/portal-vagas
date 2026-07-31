"use server";

import { revalidatePath } from "next/cache";
import { criarClienteServidor } from "@/lib/supabase/server";

export type CandidatoImportar = {
  nome: string;
  email: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  cargo_atual?: string;
  linkedin?: string;
  area?: string;
  observacoes?: string;
  texto_curriculo?: string;
  curriculo_url?: string;
  curriculo_nome?: string;
};

async function exigirAdmin() {
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

  return perfil?.role === "admin" ? supabase : null;
}

/** Salva um lote de currículos no banco de talentos (somente admin). */
export type ResultadoImportacao =
  | { erro: string }
  | { salvos: number; repetidos: number; falhas: string[] };

export async function importarCandidatos(
  lista: CandidatoImportar[],
): Promise<ResultadoImportacao> {
  const supabase = await exigirAdmin();
  if (!supabase) {
    return { erro: "Apenas o administrador pode importar currículos." };
  }
  if (!Array.isArray(lista) || lista.length === 0) {
    return { erro: "Nenhum candidato para importar." };
  }
  if (lista.length > 200) {
    return { erro: "Importe no máximo 200 por vez." };
  }

  let salvos = 0;
  let repetidos = 0;
  const falhas: string[] = [];

  for (const c of lista) {
    const nome = (c.nome ?? "").trim();
    const email = (c.email ?? "").trim().toLowerCase();

    if (!nome || !email) {
      falhas.push(`${nome || c.curriculo_nome || "sem nome"}: falta nome ou e-mail`);
      continue;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      falhas.push(`${nome}: e-mail inválido`);
      continue;
    }

    const { error } = await supabase.from("candidaturas").insert({
      vaga_id: null,
      origem: "importado",
      nome,
      email,
      telefone: c.telefone?.trim() || null,
      cidade: c.cidade?.trim() || null,
      estado: c.estado?.trim() || null,
      cargo_atual: c.cargo_atual?.trim() || null,
      linkedin: c.linkedin?.trim() || null,
      area: c.area?.trim() || null,
      observacoes: c.observacoes?.trim() || null,
      texto_curriculo: c.texto_curriculo?.slice(0, 4000) || null,
      curriculo_url: c.curriculo_url || null,
      curriculo_nome: c.curriculo_nome || null,
      status: "nova",
    });

    if (error) {
      if (error.code === "23505") repetidos++;
      else falhas.push(`${nome}: ${error.message}`);
    } else {
      salvos++;
    }
  }

  revalidatePath("/admin/candidaturas");
  revalidatePath("/admin/talentos");
  revalidatePath("/admin");

  return { salvos, repetidos, falhas };
}
