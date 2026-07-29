"use client";

import { useRef, useState } from "react";
import { criarClienteNavegador } from "@/lib/supabase/client";
import { extrairDoArquivo } from "@/lib/extrair-dados";
import { importarCandidatos } from "@/app/actions/importar";
import { AlertaErro, AlertaSucesso } from "@/components/Alerta";
import { AREAS, ESTADOS } from "@/lib/site";

const EXT_OK = ["pdf", "doc", "docx", "jpg", "jpeg", "png", "webp"];
const TAM_MAX = 10 * 1024 * 1024;

type Linha = {
  id: string;
  arquivo: File;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  cargo_atual: string;
  linkedin: string;
  area: string;
  texto: string;
  confianca: "alta" | "media" | "baixa";
  incluir: boolean;
  situacao: "lendo" | "pronto" | "enviando" | "salvo" | "erro";
  aviso?: string;
};

function limparNomeArquivo(n: string) {
  return n
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.\-_]/g, "_")
    .slice(-80);
}

export default function ImportadorCurriculos() {
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [lendo, setLendo] = useState(false);
  const [progresso, setProgresso] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [resumo, setResumo] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const contadorRef = useRef(0); // gera ids únicos sem usar Date.now() na renderização

  async function aoEscolher(arquivos: FileList | null) {
    if (!arquivos?.length) return;
    setErro(null);
    setResumo(null);
    setLendo(true);

    const novas: Linha[] = [];
    const lista = Array.from(arquivos);

    for (let i = 0; i < lista.length; i++) {
      const arq = lista[i];
      setProgresso(`Lendo ${i + 1} de ${lista.length}: ${arq.name}`);

      const ext = (arq.name.split(".").pop() ?? "").toLowerCase();
      if (!EXT_OK.includes(ext)) continue;
      if (arq.size > TAM_MAX) {
        novas.push(vazia(arq, "Arquivo maior que 10 MB"));
        continue;
      }

      try {
        const d = await extrairDoArquivo(arq);
        novas.push({
          id: `linha-${(contadorRef.current += 1)}`,
          arquivo: arq,
          nome: d.nome,
          email: d.email,
          telefone: d.telefone,
          cidade: d.cidade,
          estado: d.estado,
          cargo_atual: d.cargo_atual,
          linkedin: d.linkedin,
          area: "",
          texto: d.texto,
          confianca: d.confianca,
          incluir: true,
          situacao: "pronto",
          aviso: !d.email
            ? "Não achei o e-mail — preencha à mão"
            : !d.nome
              ? "Não achei o nome — preencha à mão"
              : undefined,
        });
      } catch {
        novas.push(vazia(arq, "Não consegui ler este arquivo"));
      }
    }

    // Marca e-mails repetidos dentro do próprio lote
    const vistos = new Set<string>();
    for (const l of novas) {
      const e = l.email.toLowerCase().trim();
      if (e && vistos.has(e)) {
        l.incluir = false;
        l.aviso = "E-mail repetido neste lote";
      } else if (e) {
        vistos.add(e);
      }
    }

    setLinhas((atual) => [...atual, ...novas]);
    setLendo(false);
    setProgresso("");
  }

  function vazia(arq: File, aviso: string): Linha {
    return {
      id: `linha-${(contadorRef.current += 1)}`,
      arquivo: arq,
      nome: "",
      email: "",
      telefone: "",
      cidade: "",
      estado: "",
      cargo_atual: "",
      linkedin: "",
      area: "",
      texto: "",
      confianca: "baixa",
      incluir: false,
      situacao: "erro",
      aviso,
    };
  }

  function editar(id: string, campo: keyof Linha, valor: string | boolean) {
    setLinhas((atual) =>
      atual.map((l) => (l.id === id ? { ...l, [campo]: valor } : l)),
    );
  }

  const prontos = linhas.filter(
    (l) => l.incluir && l.nome.trim() && l.email.trim() && l.situacao !== "salvo",
  );

  async function salvarTudo() {
    setErro(null);
    setResumo(null);

    if (prontos.length === 0) {
      setErro("Nenhum candidato pronto. Cada um precisa de nome e e-mail.");
      return;
    }

    setSalvando(true);
    const supabase = criarClienteNavegador();
    const paraSalvar = [];

    // 1) Envia os arquivos para o Storage
    for (let i = 0; i < prontos.length; i++) {
      const l = prontos[i];
      setProgresso(`Enviando arquivo ${i + 1} de ${prontos.length}...`);

      let caminho: string | undefined;
      const nomeLimpo = limparNomeArquivo(l.arquivo.name);
      const destino = `banco-de-talentos/${Date.now()}-${i}-${nomeLimpo}`;

      const { error } = await supabase.storage
        .from("curriculos")
        .upload(destino, l.arquivo, {
          contentType: l.arquivo.type || "application/octet-stream",
          upsert: false,
        });

      if (!error) caminho = destino;

      paraSalvar.push({
        nome: l.nome.trim(),
        email: l.email.trim().toLowerCase(),
        telefone: l.telefone.trim(),
        cidade: l.cidade.trim(),
        estado: l.estado.trim(),
        cargo_atual: l.cargo_atual.trim(),
        linkedin: l.linkedin.trim(),
        area: l.area.trim(),
        texto_curriculo: l.texto,
        curriculo_url: caminho,
        curriculo_nome: l.arquivo.name,
      });
    }

    // 2) Grava no banco
    setProgresso("Salvando no banco de dados...");
    const r = await importarCandidatos(paraSalvar);

    setSalvando(false);
    setProgresso("");

    if ("erro" in r) {
      setErro(r.erro);
      return;
    }

    const { salvos, repetidos, falhas } = r;

    setLinhas((atual) =>
      atual.map((l) =>
        prontos.some((p) => p.id === l.id)
          ? { ...l, situacao: "salvo" as const }
          : l,
      ),
    );

    let msg = `${salvos} currículo(s) importado(s) com sucesso!`;
    if (repetidos > 0) msg += ` ${repetidos} já existia(m) e foram ignorados.`;
    if (falhas.length > 0) msg += ` ${falhas.length} com problema.`;
    setResumo(msg);
  }

  const corConfianca = {
    alta: "bg-emerald-100 text-emerald-800",
    media: "bg-amber-100 text-amber-800",
    baixa: "bg-red-100 text-red-700",
  };
  const rotuloConfianca = { alta: "✓ ok", media: "⚠ confira", baixa: "✗ revise" };

  return (
    <div className="space-y-5">
      {/* ---------- SELECIONAR ---------- */}
      <div className="cartao p-5">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
          onChange={(e) => aoEscolher(e.target.files)}
          className="hidden"
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={lendo || salvando}
          className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-10 transition hover:border-marca hover:bg-marca-clara disabled:opacity-60"
        >
          <span className="text-4xl">📂</span>
          <span className="text-lg font-semibold text-slate-800">
            {lendo ? "Lendo arquivos..." : "Selecionar currículos"}
          </span>
          <span className="text-sm text-slate-500">
            PDF, Word ou imagem — pode escolher vários de uma vez (Ctrl+A)
          </span>
        </button>

        {lendo && (
          <p className="mt-3 text-center text-sm text-marca">{progresso}</p>
        )}
      </div>

      {erro && <AlertaErro>{erro}</AlertaErro>}
      {resumo && <AlertaSucesso>{resumo}</AlertaSucesso>}

      {/* ---------- REVISÃO ---------- */}
      {linhas.length > 0 && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-100 px-4 py-3">
            <div className="text-sm text-slate-700">
              <strong>{linhas.length}</strong> arquivo(s) ·{" "}
              <strong className="text-emerald-700">{prontos.length}</strong>{" "}
              pronto(s) para importar
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLinhas([])}
                disabled={salvando}
                className="btn-secundario px-4 py-2 text-sm"
              >
                Limpar lista
              </button>
              <button
                onClick={salvarTudo}
                disabled={salvando || prontos.length === 0}
                className="btn-primario px-5 py-2 text-sm"
              >
                {salvando ? progresso || "Salvando..." : `Importar ${prontos.length}`}
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-600">
            👇 Confira os dados abaixo. Os campos são editáveis — corrija o que
            estiver errado antes de importar.
          </p>

          <div className="space-y-3">
            {linhas.map((l) => (
              <div
                key={l.id}
                className={`cartao p-4 ${
                  l.situacao === "salvo"
                    ? "border-emerald-300 bg-emerald-50"
                    : !l.incluir
                      ? "opacity-60"
                      : ""
                }`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="checkbox"
                    checked={l.incluir}
                    disabled={l.situacao === "salvo" || salvando}
                    onChange={(e) => editar(l.id, "incluir", e.target.checked)}
                    className="h-4 w-4 accent-[#2557a7]"
                  />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
                    📄 {l.arquivo.name}
                  </span>

                  {l.situacao === "salvo" ? (
                    <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white">
                      ✓ importado
                    </span>
                  ) : (
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${corConfianca[l.confianca]}`}
                    >
                      {rotuloConfianca[l.confianca]}
                    </span>
                  )}
                </div>

                {l.aviso && (
                  <p className="mt-2 rounded bg-amber-50 px-3 py-1.5 text-xs text-amber-900">
                    ⚠️ {l.aviso}
                  </p>
                )}

                {l.situacao !== "salvo" && (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <Campo
                      rotulo="Nome *"
                      valor={l.nome}
                      onChange={(v) => editar(l.id, "nome", v)}
                      destaque={!l.nome}
                    />
                    <Campo
                      rotulo="E-mail *"
                      valor={l.email}
                      onChange={(v) => editar(l.id, "email", v)}
                      destaque={!l.email}
                    />
                    <Campo
                      rotulo="Telefone"
                      valor={l.telefone}
                      onChange={(v) => editar(l.id, "telefone", v)}
                    />
                    <Campo
                      rotulo="Cargo"
                      valor={l.cargo_atual}
                      onChange={(v) => editar(l.id, "cargo_atual", v)}
                    />
                    <Campo
                      rotulo="Cidade"
                      valor={l.cidade}
                      onChange={(v) => editar(l.id, "cidade", v)}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">
                          UF
                        </label>
                        <select
                          value={l.estado}
                          onChange={(e) => editar(l.id, "estado", e.target.value)}
                          className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                        >
                          <option value="">--</option>
                          {ESTADOS.map((uf) => (
                            <option key={uf} value={uf}>{uf}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">
                          Área
                        </label>
                        <select
                          value={l.area}
                          onChange={(e) => editar(l.id, "area", e.target.value)}
                          className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                        >
                          <option value="">--</option>
                          {AREAS.map((a) => (
                            <option key={a} value={a}>{a}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={salvarTudo}
              disabled={salvando || prontos.length === 0}
              className="btn-primario"
            >
              {salvando ? progresso || "Salvando..." : `Importar ${prontos.length} currículo(s)`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Campo({
  rotulo,
  valor,
  onChange,
  destaque,
}: {
  rotulo: string;
  valor: string;
  onChange: (v: string) => void;
  destaque?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-600">
        {rotulo}
      </label>
      <input
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded border px-2.5 py-1.5 text-sm ${
          destaque
            ? "border-red-300 bg-red-50"
            : "border-slate-300 bg-white"
        }`}
      />
    </div>
  );
}
