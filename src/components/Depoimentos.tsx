/**
 * Depoimentos da página inicial.
 *
 * ⚠️ IMPORTANTE: os textos abaixo são EXEMPLOS, para você ver como fica.
 * Substitua por depoimentos reais assim que tiver — ou apague a seção
 * inteira (basta remover <Depoimentos /> da home).
 * Publicar depoimento inventado como se fosse real é propaganda enganosa.
 */

const DEPOIMENTOS = [
  {
    texto:
      "Encontrei minha vaga ideal em menos de uma semana. O portal é simples de usar e as vagas são atualizadas sempre.",
    nome: "Mariana S.",
    cargo: "Analista de Marketing",
    iniciais: "MS",
  },
  {
    texto:
      "Contratamos 5 profissionais pelo portal nos últimos meses. A qualidade dos candidatos é excelente.",
    nome: "Carlos M.",
    cargo: "Gerente de RH",
    iniciais: "CM",
  },
  {
    texto:
      "Publicamos nossa primeira vaga gratuitamente e já recebemos ótimos currículos no mesmo dia.",
    nome: "Fernando L.",
    cargo: "Diretor Comercial",
    iniciais: "FL",
  },
];

export default function Depoimentos() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Quem usa, recomenda
          </h2>
          <p className="mt-1 text-slate-600">
            O que empresas e candidatos dizem sobre o portal
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {DEPOIMENTOS.map((d) => (
            <figure key={d.nome} className="cartao flex flex-col p-6">
              <div className="text-2xl leading-none text-laranja">&ldquo;</div>
              <blockquote className="mt-2 flex-1 text-[15px] leading-relaxed text-slate-700">
                {d.texto}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
                  style={{ background: "var(--grad-marca)" }}
                >
                  {d.iniciais}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-slate-900">
                    {d.nome}
                  </span>
                  <span className="block truncate text-xs text-slate-500">
                    {d.cargo}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Depoimentos ilustrativos — substitua por relatos reais dos seus
          usuários.
        </p>
      </div>
    </section>
  );
}
