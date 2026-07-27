export type Perfil = {
  id: string;
  email: string | null;
  nome: string | null;
  role: "empresa" | "admin";
  criado_em: string;
};

export type Empresa = {
  id: string;
  user_id: string | null;
  nome: string;
  cnpj: string | null;
  site: string | null;
  telefone: string | null;
  cidade: string | null;
  estado: string | null;
  sobre: string | null;
  logo_url: string | null;
  criado_em: string;
};

export type StatusVaga =
  | "pendente"
  | "publicada"
  | "pausada"
  | "encerrada"
  | "recusada";

export type Vaga = {
  id: string;
  empresa_id: string | null;
  criado_por: string | null;
  empresa_nome: string;
  titulo: string;
  descricao: string;
  requisitos: string | null;
  beneficios: string | null;
  area: string | null;
  nivel: string | null;
  cidade: string | null;
  estado: string | null;
  modalidade: "presencial" | "hibrido" | "remoto";
  tipo_contrato: string;
  salario_min: number | null;
  salario_max: number | null;
  salario_combinar: boolean;
  vagas_disponiveis: number;
  email_contato: string | null;
  status: StatusVaga;
  destaque: boolean;
  visualizacoes: number;
  criado_em: string;
  atualizado_em: string;
};

export type StatusCandidatura =
  | "nova"
  | "em_analise"
  | "entrevista"
  | "aprovada"
  | "reprovada";

export type Candidatura = {
  id: string;
  vaga_id: string;
  nome: string;
  email: string;
  telefone: string | null;
  cidade: string | null;
  estado: string | null;
  linkedin: string | null;
  cargo_atual: string | null;
  pretensao: number | null;
  mensagem: string | null;
  curriculo_url: string | null;
  curriculo_nome: string | null;
  status: StatusCandidatura;
  criado_em: string;
  vagas?: { titulo: string; empresa_nome: string } | null;
};

export type EstadoFormulario = {
  erro?: string;
  sucesso?: string;
};
