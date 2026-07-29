import { MODALIDADES, TIPOS_CONTRATO } from "@/lib/site";
import type { Vaga } from "@/lib/types";

export function moeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function formatarSalario(v: Pick<Vaga, "salario_min" | "salario_max" | "salario_combinar">) {
  if (v.salario_combinar || (!v.salario_min && !v.salario_max)) return "A combinar";
  if (v.salario_min && v.salario_max && v.salario_min !== v.salario_max) {
    return `${moeda(v.salario_min)} - ${moeda(v.salario_max)}`;
  }
  return moeda((v.salario_min ?? v.salario_max) as number);
}

export function rotuloModalidade(valor: string) {
  return MODALIDADES.find((m) => m.valor === valor)?.label ?? valor;
}

export function rotuloContrato(valor: string) {
  return TIPOS_CONTRATO.find((t) => t.valor === valor)?.label ?? valor;
}

export function localDaVaga(v: Pick<Vaga, "cidade" | "estado" | "modalidade">) {
  if (v.modalidade === "remoto" && !v.cidade) return "Remoto - Brasil";
  const partes = [v.cidade, v.estado].filter(Boolean);
  return partes.length ? partes.join(", ") : "Brasil";
}

export function tempoRelativo(dataISO: string) {
  const data = new Date(dataISO);
  const dias = Math.floor((Date.now() - data.getTime()) / 86_400_000);
  if (dias <= 0) return "Publicada hoje";
  if (dias === 1) return "Há 1 dia";
  if (dias < 30) return `Há ${dias} dias`;
  const meses = Math.floor(dias / 30);
  return meses === 1 ? "Há 1 mês" : `Há ${meses} meses`;
}

export function dataCurta(dataISO: string) {
  return new Date(dataISO).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function dataHora(dataISO: string) {
  return new Date(dataISO).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
