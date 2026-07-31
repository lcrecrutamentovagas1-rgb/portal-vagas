import Link from "next/link";
import { site } from "@/lib/site";

export const metadata = {
  title: "Planos para empresas",
  description:
    "Escolha o plano ideal para a sua empresa e comece a contratar. Publicação de vagas a partir de R$ 0.",
};

const PLANOS = [
  {
    nome: "Grátis",
    preco: "R$ 0",
    periodo: "para sempre",
    descricao: "Para quem está começando",
    recursos: [
      "1 vaga ativa por 30 dias",
      "Listagem padrão na busca",
      "Acesso aos currículos recebidos",
      "Painel de acompanhamento",
    ],
    botao: "Começar grátis",
    href: "/cadastro",
    destaque: false,
  },
  {
    nome: "Profissional",
    preco: "R$ 99",
    periodo: "por mês",
    descricao: "Para quem contrata com frequência",
    recursos: [
      "Até 10 vagas ativas",
      "Vagas com duração de 3 meses",
      "⭐ Destaque na home e nas buscas",
      "Selo de empresa verificada",
      "Ranking dos melhores candidatos",
      "Suporte prioritário",
    ],
    botao: "Assinar Profissional",
    href: "/contato",
    destaque: true,
  },
  {
    nome: "Corporativo",
    preco: "Sob consulta",
    periodo: "personalizado",
    descricao: "Para grandes volumes",
    recursos: [
      "Vagas ilimitadas",
      "Destaque premium permanente",
      "Gerente de conta dedicado",
      "Relatórios e métricas avançadas",
      "Integração com seu sistema",
    ],
    botao: "Fale conosco",
    href: "/contato",
    destaque: false,
  },
];

export default function PaginaPlanos() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy py-16">
        <div className="brilho-hero" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Planos para <span className="texto-gradiente">empresas</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Comece de graça e evolua quando precisar. Sem fidelidade, cancele
            quando quiser.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANOS.map((p) => (
            <div
              key={p.nome}
              className={`relative flex flex-col rounded-2xl p-7 ${
                p.destaque
                  ? "borda-gradiente shadow-xl lg:-mt-4 lg:mb-4"
                  : "border border-slate-200 bg-white"
              }`}
            >
              {p.destaque && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-white shadow"
                  style={{ background: "var(--grad-quente)" }}
                >
                  MAIS POPULAR
                </span>
              )}

              <h2 className="text-lg font-bold text-slate-900">{p.nome}</h2>
              <p className="text-sm text-slate-500">{p.descricao}</p>

              <div className="mt-5 min-h-[86px]">
                <p
                  className={`text-3xl font-extrabold leading-tight sm:text-4xl ${
                    p.destaque ? "texto-gradiente" : "text-slate-900"
                  }`}
                >
                  {p.preco}
                </p>
                <p className="mt-1 text-sm text-slate-500">{p.periodo}</p>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {p.recursos.map((r) => (
                  <li key={r} className="flex gap-2.5 text-[15px] text-slate-700">
                    <span className="font-bold text-emerald-500">✓</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={p.href}
                className={`mt-7 w-full ${p.destaque ? "btn-primario" : "btn-secundario"}`}
              >
                {p.botao}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Dúvidas sobre qual escolher?{" "}
          <Link href="/contato" className="font-semibold text-marca hover:underline">
            Fale com a gente
          </Link>{" "}
          — respondemos em até 2 dias úteis.
        </p>
      </section>

      {/* Perguntas frequentes */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center text-2xl font-bold text-slate-900">
            Perguntas frequentes
          </h2>

          <div className="mt-8 space-y-3">
            <Pergunta titulo="Candidatos pagam alguma coisa?">
              Não. O {site.nome} é <strong>100% gratuito</strong> para quem
              procura emprego — sempre foi e continuará sendo.
            </Pergunta>
            <Pergunta titulo="Posso começar no plano grátis?">
              Pode, e recomendamos. Publique sua primeira vaga sem pagar nada e
              veja os currículos chegando. Se precisar de mais, é só mudar de
              plano.
            </Pergunta>
            <Pergunta titulo="Existe fidelidade ou multa?">
              Não. Você cancela quando quiser, sem multa e sem burocracia.
            </Pergunta>
            <Pergunta titulo="Como recebo os currículos?">
              Tudo fica organizado no seu painel. Você abre cada currículo,
              acompanha o candidato por etapas e fala direto por e-mail ou
              WhatsApp.
            </Pergunta>
          </div>
        </div>
      </section>
    </>
  );
}

function Pergunta({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <details className="cartao group p-5">
      <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:hidden">
        <span className="flex items-center justify-between gap-3">
          {titulo}
          <span className="text-marca transition group-open:rotate-45">+</span>
        </span>
      </summary>
      <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{children}</p>
    </details>
  );
}
