/**
 * ---------------------------------------------------------------
 *  IDENTIDADE DO SITE
 *  Mude o nome, slogan e cores aqui — vale para o site inteiro.
 * ---------------------------------------------------------------
 */
export const site = {
  nome: "VagasBR",
  sigla: "V", // letra do logo
  slogan: "Sua próxima oportunidade começa aqui",
  descricao:
    "Portal de vagas de emprego: empresas publicam suas oportunidades e candidatos enviam o currículo em poucos cliques.",
  email: "contato@seudominio.com.br",
  // Trocar depois de comprar o domínio (ex.: https://www.seudominio.com.br)
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

export const ESTADOS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
  "SP", "SE", "TO",
];

export const MODALIDADES = [
  { valor: "presencial", label: "Presencial" },
  { valor: "hibrido", label: "Híbrido" },
  { valor: "remoto", label: "Remoto (home office)" },
];

export const TIPOS_CONTRATO = [
  { valor: "clt", label: "CLT (efetivo)" },
  { valor: "pj", label: "PJ" },
  { valor: "estagio", label: "Estágio" },
  { valor: "temporario", label: "Temporário" },
  { valor: "freelancer", label: "Freelancer" },
  { valor: "trainee", label: "Trainee" },
  { valor: "aprendiz", label: "Jovem aprendiz" },
];

export const NIVEIS = [
  "Estagiário",
  "Auxiliar",
  "Assistente",
  "Júnior",
  "Pleno",
  "Sênior",
  "Especialista",
  "Coordenador",
  "Gerente",
];

export const AREAS = [
  "Administração",
  "Atendimento ao cliente",
  "Comercial / Vendas",
  "Construção civil",
  "Educação",
  "Financeiro / Contábil",
  "Jurídico",
  "Logística / Transporte",
  "Marketing",
  "Produção / Indústria",
  "Recursos Humanos",
  "Saúde",
  "Serviços gerais",
  "Tecnologia da Informação",
  "Outros",
];

export const STATUS_VAGA: Record<string, { label: string; cor: string }> = {
  pendente: { label: "Aguardando aprovação", cor: "bg-amber-100 text-amber-800" },
  publicada: { label: "Publicada", cor: "bg-emerald-100 text-emerald-800" },
  pausada: { label: "Pausada", cor: "bg-slate-200 text-slate-700" },
  encerrada: { label: "Encerrada", cor: "bg-slate-200 text-slate-700" },
  recusada: { label: "Recusada", cor: "bg-red-100 text-red-700" },
};

export const STATUS_CANDIDATURA: Record<string, { label: string; cor: string }> = {
  nova: { label: "Nova", cor: "bg-blue-100 text-blue-800" },
  em_analise: { label: "Em análise", cor: "bg-amber-100 text-amber-800" },
  entrevista: { label: "Entrevista", cor: "bg-violet-100 text-violet-800" },
  aprovada: { label: "Aprovada", cor: "bg-emerald-100 text-emerald-800" },
  reprovada: { label: "Não selecionado", cor: "bg-slate-200 text-slate-700" },
};
