"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { enviarCandidatura } from "@/app/actions/candidatura";
import { criarClienteNavegador } from "@/lib/supabase/client";
import { AlertaErro } from "@/components/Alerta";
import { ESTADOS } from "@/lib/site";

const EXTENSOES_OK = ["pdf", "doc", "docx", "jpg", "jpeg", "png", "webp", "heic"];
const TAMANHO_MAX = 10 * 1024 * 1024;

function limparNome(nome: string) {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.\-_]/g, "_")
    .slice(-80);
}

export default function FormularioCandidatura({
  vagaId,
  tituloVaga,
}: {
  vagaId: string;
  tituloVaga: string;
}) {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [progresso, setProgresso] = useState<string | null>(null);
  const [pendente, iniciar] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function escolherArquivo(f: File | null) {
    setErro(null);
    if (!f) return setArquivo(null);

    const ext = (f.name.split(".").pop() ?? "").toLowerCase();
    if (!EXTENSOES_OK.includes(ext)) {
      setArquivo(null);
      setErro("Formato não aceito. Envie PDF, DOC, DOCX, JPG ou PNG.");
      return;
    }
    if (f.size > TAMANHO_MAX) {
      setArquivo(null);
      setErro("O arquivo passa de 10 MB. Envie um menor.");
      return;
    }
    setArquivo(f);
  }

  async function aoEnviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro(null);

    const form = evento.currentTarget;
    const dados = new FormData(form);

    if (!arquivo) {
      setErro("Anexe o seu currículo (PDF, DOC, DOCX, JPG ou PNG).");
      return;
    }

    iniciar(async () => {
      try {
        // 1) Envia o arquivo direto do navegador para o Supabase Storage.
        setProgresso("Enviando currículo...");
        const supabase = criarClienteNavegador();
        const caminho = `${vagaId}/${Date.now()}-${limparNome(arquivo.name)}`;

        const { error: erroUpload } = await supabase.storage
          .from("curriculos")
          .upload(caminho, arquivo, {
            contentType: arquivo.type || "application/octet-stream",
            upsert: false,
          });

        if (erroUpload) {
          setProgresso(null);
          setErro(`Não foi possível enviar o arquivo: ${erroUpload.message}`);
          return;
        }

        // 2) Salva os dados da candidatura no banco.
        setProgresso("Registrando candidatura...");
        dados.set("curriculo_path", caminho);
        dados.set("curriculo_nome", arquivo.name);

        const resposta = await enviarCandidatura(dados);
        setProgresso(null);

        if (resposta.erro) {
          setErro(resposta.erro);
          await supabase.storage.from("curriculos").remove([caminho]);
          return;
        }
        setSucesso(resposta.sucesso ?? "Candidatura enviada!");
      } catch {
        setProgresso(null);
        setErro("Algo deu errado. Verifique sua conexão e tente novamente.");
      }
    });
  }

  if (sucesso) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-600 text-2xl text-white">
          ✓
        </div>
        <h2 className="mt-4 text-lg font-bold text-emerald-900">
          Currículo enviado!
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-emerald-800">{sucesso}</p>
        <Link href="/vagas" className="btn-secundario mt-5">
          Ver outras vagas
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={aoEnviar} className="rounded-xl border border-slate-200 bg-white p-6">
      <input type="hidden" name="vaga_id" value={vagaId} />

      <h2 className="text-lg font-bold text-slate-900">Candidate-se a esta vaga</h2>
      <p className="mt-1 text-sm text-slate-500">
        Preencha seus dados e anexe o currículo. Não precisa criar conta.
      </p>

      {erro && (
        <div className="mt-4">
          <AlertaErro>{erro}</AlertaErro>
        </div>
      )}

      <div className="mt-5 space-y-4">
        <div>
          <label className="rotulo" htmlFor="nome">Nome completo *</label>
          <input id="nome" name="nome" required className="campo" placeholder="Maria da Silva" />
        </div>

        <div>
          <label className="rotulo" htmlFor="email">E-mail *</label>
          <input id="email" name="email" type="email" required className="campo" placeholder="maria@email.com" />
        </div>

        <div>
          <label className="rotulo" htmlFor="telefone">Telefone / WhatsApp *</label>
          <input id="telefone" name="telefone" required className="campo" placeholder="(31) 99999-0000" />
        </div>

        <div className="grid grid-cols-[1fr_90px] gap-3">
          <div>
            <label className="rotulo" htmlFor="cidade">Cidade</label>
            <input id="cidade" name="cidade" className="campo" placeholder="Belo Horizonte" />
          </div>
          <div>
            <label className="rotulo" htmlFor="estado">UF</label>
            <select id="estado" name="estado" className="campo" defaultValue="">
              <option value="">--</option>
              {ESTADOS.map((uf) => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="rotulo" htmlFor="cargo_atual">Cargo atual / desejado</label>
          <input id="cargo_atual" name="cargo_atual" className="campo" placeholder="Auxiliar administrativo" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="rotulo" htmlFor="pretensao">Pretensão (R$)</label>
            <input id="pretensao" name="pretensao" inputMode="decimal" className="campo" placeholder="2500" />
          </div>
          <div>
            <label className="rotulo" htmlFor="linkedin">LinkedIn</label>
            <input id="linkedin" name="linkedin" className="campo" placeholder="linkedin.com/in/..." />
          </div>
        </div>

        {/* ---------- ANEXO DO CURRÍCULO ---------- */}
        <div>
          <label className="rotulo">
            Currículo * (PDF, DOC, DOCX, JPG ou PNG — até 10 MB)
          </label>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.heic,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
            onChange={(e) => escolherArquivo(e.target.files?.[0] ?? null)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={`flex w-full flex-col items-center gap-1.5 rounded-lg border-2 border-dashed px-4 py-6 text-center transition ${
              arquivo
                ? "border-emerald-400 bg-emerald-50"
                : "border-slate-300 bg-slate-50 hover:border-marca hover:bg-marca-clara"
            }`}
          >
            {arquivo ? (
              <>
                <span className="text-2xl">📄</span>
                <span className="max-w-full truncate text-sm font-semibold text-emerald-800">
                  {arquivo.name}
                </span>
                <span className="text-xs text-emerald-700">
                  {(arquivo.size / 1024 / 1024).toFixed(2)} MB · clique para trocar
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl">📎</span>
                <span className="text-sm font-semibold text-slate-700">
                  Clique para anexar o currículo
                </span>
                <span className="text-xs text-slate-500">
                  PDF, Word ou foto do currículo
                </span>
              </>
            )}
          </button>
        </div>

        <div>
          <label className="rotulo" htmlFor="mensagem">Mensagem para a empresa</label>
          <textarea
            id="mensagem"
            name="mensagem"
            rows={3}
            className="campo resize-y"
            placeholder={`Por que você é a pessoa certa para a vaga de ${tituloVaga}?`}
          />
        </div>

        <button type="submit" disabled={pendente} className="btn-primario w-full">
          {pendente ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              {progresso ?? "Enviando..."}
            </>
          ) : (
            "Enviar candidatura"
          )}
        </button>

        <p className="text-center text-xs leading-relaxed text-slate-400">
          Ao enviar, você concorda que seus dados sejam compartilhados com a
          empresa responsável por esta vaga.
        </p>
      </div>
    </form>
  );
}
