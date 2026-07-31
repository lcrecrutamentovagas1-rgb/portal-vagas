/**
 * ---------------------------------------------------------------
 *  COMPATIBILIDADE CANDIDATO × VAGA
 *
 *  Compara o texto do currículo com o texto da vaga e dá uma nota
 *  de 0 a 100, explicando o motivo.
 *
 *  ⚠️ IMPORTANTE: isto é uma AJUDA para organizar a fila, não um
 *  juiz. A decisão final é sempre humana. Veja "limites" no fim.
 * ---------------------------------------------------------------
 */

import type { Candidatura, Vaga } from "@/lib/types";

/* Palavras muito comuns que não ajudam a diferenciar ninguém */
const IRRELEVANTES = new Set([
  "a","o","as","os","de","da","do","das","dos","e","ou","em","no","na","nos",
  "nas","um","uma","uns","umas","para","por","com","sem","que","se","ao","aos",
  "à","às","pelo","pela","este","esta","esse","essa","isso","como","mais",
  "menos","muito","também","já","não","sim","ser","ter","estar","fazer","ir",
  "vaga","empresa","candidato","candidata","trabalho","emprego","área","area",
  "profissional","atividades","função","funcao","cargo","nível","nivel",
  "conhecimento","conhecimentos","experiência","experiencia","anos","ano",
  "será","serão","deve","desejável","desejavel","diferencial","requisitos",
  "benefícios","beneficios","salário","salario","horário","horario",
]);

/** Quebra um texto em palavras úteis (sem acento, minúsculas). */
function palavras(texto: string): string[] {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s+#.]/g, " ")
    .split(/\s+/)
    .filter((p) => p.length >= 3 && !IRRELEVANTES.has(p));
}

function semAcento(t: string) {
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export type Compatibilidade = {
  nota: number;                 // 0 a 100
  faixa: "alta" | "media" | "baixa";
  motivos: string[];            // o que contou a favor
  alertas: string[];            // o que faltou
  termosEncontrados: string[];  // palavras da vaga achadas no currículo
};

/**
 * Compara um candidato com uma vaga.
 * Só usa o que existe: se o currículo não tem texto lido, avisa.
 */
export function compararComVaga(
  candidato: Pick<
    Candidatura,
    "texto_curriculo" | "cargo_atual" | "cidade" | "estado" | "area" | "pretensao"
  >,
  vaga: Pick<
    Vaga,
    | "titulo" | "descricao" | "requisitos" | "area" | "nivel"
    | "cidade" | "estado" | "modalidade" | "salario_max"
  >,
): Compatibilidade {
  const motivos: string[] = [];
  const alertas: string[] = [];

  const textoCandidato = [
    candidato.texto_curriculo ?? "",
    candidato.cargo_atual ?? "",
    candidato.area ?? "",
  ].join(" ");

  const temTexto = (candidato.texto_curriculo ?? "").trim().length > 50;

  /* ---------- 1. Palavras-chave da vaga no currículo (peso 50) ---------- */
  const termosVaga = Array.from(
    new Set(palavras(`${vaga.titulo} ${vaga.requisitos ?? ""} ${vaga.descricao}`)),
  );
  const textoCand = semAcento(textoCandidato);

  const encontrados = termosVaga.filter((t) => textoCand.includes(t));
  const proporcao = termosVaga.length ? encontrados.length / termosVaga.length : 0;
  const pontosPalavras = Math.round(Math.min(proporcao * 2.5, 1) * 50);

  if (!temTexto) {
    alertas.push("Currículo sem texto legível (PDF escaneado ou imagem)");
  } else if (encontrados.length > 0) {
    motivos.push(
      `${encontrados.length} termo(s) da vaga aparecem no currículo`,
    );
  } else {
    alertas.push("Nenhum termo da vaga foi encontrado no currículo");
  }

  /* ---------- 2. Cargo parecido com o título da vaga (peso 20) ---------- */
  let pontosCargo = 0;
  const cargo = semAcento(candidato.cargo_atual ?? "");
  if (cargo) {
    const palavrasTitulo = palavras(vaga.titulo);
    const batem = palavrasTitulo.filter((p) => cargo.includes(p));
    if (batem.length > 0) {
      pontosCargo = Math.min(batem.length / Math.max(palavrasTitulo.length, 1), 1) * 20;
      motivos.push(`Cargo declarado combina: "${candidato.cargo_atual}"`);
    }
  }
  pontosCargo = Math.round(pontosCargo);

  /* ---------- 3. Mesma área (peso 15) ---------- */
  let pontosArea = 0;
  if (candidato.area && vaga.area) {
    if (semAcento(candidato.area) === semAcento(vaga.area)) {
      pontosArea = 15;
      motivos.push(`Mesma área: ${vaga.area}`);
    } else {
      alertas.push(`Área diferente (candidato: ${candidato.area})`);
    }
  }

  /* ---------- 4. Localização (peso 15) ---------- */
  let pontosLocal = 0;
  if (vaga.modalidade === "remoto") {
    pontosLocal = 15;
    motivos.push("Vaga remota — local não é problema");
  } else if (candidato.cidade && vaga.cidade) {
    if (semAcento(candidato.cidade) === semAcento(vaga.cidade)) {
      pontosLocal = 15;
      motivos.push(`Mora na mesma cidade: ${vaga.cidade}`);
    } else if (
      candidato.estado && vaga.estado &&
      candidato.estado.toUpperCase() === vaga.estado.toUpperCase()
    ) {
      pontosLocal = 8;
      motivos.push(`Mesmo estado (${vaga.estado}), cidade diferente`);
    } else {
      alertas.push(
        `Mora em ${candidato.cidade}${candidato.estado ? `/${candidato.estado}` : ""} — vaga em ${vaga.cidade}`,
      );
    }
  } else if (candidato.estado && vaga.estado) {
    if (candidato.estado.toUpperCase() === vaga.estado.toUpperCase()) {
      pontosLocal = 10;
      motivos.push(`Mesmo estado: ${vaga.estado}`);
    }
  }

  /* ---------- 5. Pretensão dentro do orçamento (aviso, não pontua) -------- */
  if (candidato.pretensao && vaga.salario_max) {
    if (candidato.pretensao > vaga.salario_max * 1.15) {
      alertas.push(
        `Pretensão (R$ ${candidato.pretensao.toLocaleString("pt-BR")}) acima do teto da vaga`,
      );
    }
  }

  /* ---------- Nota final ---------- */
  let nota = pontosPalavras + pontosCargo + pontosArea + pontosLocal;

  // Sem texto legível, a nota não é confiável: limita a 40
  if (!temTexto) nota = Math.min(nota, 40);

  nota = Math.max(0, Math.min(100, Math.round(nota)));

  const faixa: Compatibilidade["faixa"] =
    nota >= 60 ? "alta" : nota >= 35 ? "media" : "baixa";

  return {
    nota,
    faixa,
    motivos,
    alertas,
    termosEncontrados: encontrados.slice(0, 12),
  };
}

/** Ordena uma lista de candidatos pela compatibilidade com a vaga. */
export function rankearCandidatos<
  T extends Pick<
    Candidatura,
    "texto_curriculo" | "cargo_atual" | "cidade" | "estado" | "area" | "pretensao"
  >,
>(
  candidatos: T[],
  vaga: Parameters<typeof compararComVaga>[1],
): Array<T & { compatibilidade: Compatibilidade }> {
  return candidatos
    .map((c) => ({ ...c, compatibilidade: compararComVaga(c, vaga) }))
    .sort((a, b) => b.compatibilidade.nota - a.compatibilidade.nota);
}
