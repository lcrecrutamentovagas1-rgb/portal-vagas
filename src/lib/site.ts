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


/**
 * Ícone e cor de cada área — usados nos cartões de "Vagas por setor".
 * As cores seguem a paleta da logo.
 */
export const ICONES_AREA: Record<string, { icone: string; cor: string }> = {
  "Administração": { icone: "📋", cor: "from-blue-500 to-blue-600" },
  "Atendimento ao cliente": { icone: "🎧", cor: "from-sky-400 to-blue-500" },
  "Comercial / Vendas": { icone: "🛒", cor: "from-orange-400 to-orange-600" },
  "Construção civil": { icone: "🏗️", cor: "from-amber-500 to-orange-600" },
  "Educação": { icone: "📚", cor: "from-violet-500 to-purple-600" },
  "Financeiro / Contábil": { icone: "💰", cor: "from-emerald-500 to-teal-600" },
  "Jurídico": { icone: "⚖️", cor: "from-slate-500 to-slate-700" },
  "Logística / Transporte": { icone: "🚚", cor: "from-cyan-500 to-blue-600" },
  "Marketing": { icone: "📢", cor: "from-pink-500 to-rose-600" },
  "Produção / Indústria": { icone: "⚙️", cor: "from-zinc-500 to-slate-700" },
  "Recursos Humanos": { icone: "👥", cor: "from-fuchsia-500 to-purple-600" },
  "Saúde": { icone: "🏥", cor: "from-red-400 to-pink-600" },
  "Serviços gerais": { icone: "🧰", cor: "from-teal-500 to-cyan-600" },
  "Tecnologia da Informação": { icone: "💻", cor: "from-blue-500 to-violet-600" },
  "Outros": { icone: "✨", cor: "from-indigo-500 to-purple-600" },
};

export function iconeDaArea(area?: string | null) {
  return (area && ICONES_AREA[area]) || { icone: "💼", cor: "from-blue-500 to-violet-600" };
}

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
