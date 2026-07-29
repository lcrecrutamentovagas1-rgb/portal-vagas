"use client";

import { useActionState, useState } from "react";
import { salvarVaga } from "@/app/actions/vagas";
import { AlertaErro } from "@/components/Alerta";
import BotaoEnviar from "@/components/BotaoEnviar";
import { AREAS, ESTADOS, MODALIDADES, NIVEIS, TIPOS_CONTRATO } from "@/lib/site";
import type { Vaga } from "@/lib/types";

export default function FormularioVaga({
  vaga,
  modoAdmin = false,
}: {
  vaga?: Vaga | null;
  modoAdmin?: boolean;
}) {
  const [estado, acao] = useActionState(salvarVaga, {});
  const [combinar, setCombinar] = useState(vaga?.salario_combinar ?? true);

  return (
    <form action={acao} className="space-y-6">
      {vaga && <input type="hidden" name="id" value={vaga.id} />}

      {estado.erro && <AlertaErro>{estado.erro}</AlertaErro>}

      {/* ---------- BÁSICO ---------- */}
      <fieldset className="cartao p-5">
        <legend className="px-2 text-sm font-bold text-slate-900">
          Informações da vaga
        </legend>

        <div className="space-y-4">
          {modoAdmin && (
            <div>
              <label className="rotulo" htmlFor="empresa_nome">Nome da empresa *</label>
              <input
                id="empresa_nome"
                name="empresa_nome"
                required
                defaultValue={vaga?.empresa_nome ?? ""}
                className="campo"
                placeholder="Ex.: Supermercado Bom Preço"
              />
              <p className="mt-1 text-xs text-slate-500">
                Como administrador, você digita o nome da empresa manualmente.
              </p>
            </div>
          )}

          <div>
            <label className="rotulo" htmlFor="titulo">Título da vaga *</label>
            <input
              id="titulo"
              name="titulo"
              required
              defaultValue={vaga?.titulo ?? ""}
              className="campo"
              placeholder="Ex.: Auxiliar administrativo"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="rotulo" htmlFor="area">Área</label>
              <select id="area" name="area" defaultValue={vaga?.area ?? ""} className="campo">
                <option value="">Selecione...</option>
                {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="rotulo" htmlFor="nivel">Nível</label>
              <select id="nivel" name="nivel" defaultValue={vaga?.nivel ?? ""} className="campo">
                <option value="">Selecione...</option>
                {NIVEIS.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="rotulo" htmlFor="vagas_disponiveis">Nº de vagas</label>
              <input
                id="vagas_disponiveis"
                name="vagas_disponiveis"
                type="number"
                min={1}
                defaultValue={vaga?.vagas_disponiveis ?? 1}
                className="campo"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="rotulo" htmlFor="modalidade">Modalidade *</label>
              <select id="modalidade" name="modalidade" defaultValue={vaga?.modalidade ?? "presencial"} className="campo">
                {MODALIDADES.map((m) => <option key={m.valor} value={m.valor}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label className="rotulo" htmlFor="tipo_contrato">Tipo de contrato *</label>
              <select id="tipo_contrato" name="tipo_contrato" defaultValue={vaga?.tipo_contrato ?? "clt"} className="campo">
                {TIPOS_CONTRATO.map((t) => <option key={t.valor} value={t.valor}>{t.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_100px]">
            <div>
              <label className="rotulo" htmlFor="cidade">Cidade</label>
              <input id="cidade" name="cidade" defaultValue={vaga?.cidade ?? ""} className="campo" placeholder="Belo Horizonte" />
            </div>
            <div>
              <label className="rotulo" htmlFor="estado">UF</label>
              <select id="estado" name="estado" defaultValue={vaga?.estado ?? ""} className="campo">
                <option value="">--</option>
                {ESTADOS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </div>
          </div>
        </div>
      </fieldset>

      {/* ---------- SALÁRIO ---------- */}
      <fieldset className="cartao p-5">
        <legend className="px-2 text-sm font-bold text-slate-900">Remuneração</legend>

        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            name="salario_combinar"
            checked={combinar}
            onChange={(e) => setCombinar(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 accent-[#2557a7]"
          />
          <span className="text-[15px] text-slate-700">Salário a combinar</span>
        </label>

        {!combinar && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="rotulo" htmlFor="salario_min">Salário mínimo (R$)</label>
              <input id="salario_min" name="salario_min" inputMode="decimal" defaultValue={vaga?.salario_min ?? ""} className="campo" placeholder="1800" />
            </div>
            <div>
              <label className="rotulo" htmlFor="salario_max">Salário máximo (R$)</label>
              <input id="salario_max" name="salario_max" inputMode="decimal" defaultValue={vaga?.salario_max ?? ""} className="campo" placeholder="2500" />
            </div>
          </div>
        )}
      </fieldset>

      {/* ---------- DETALHES ---------- */}
      <fieldset className="cartao p-5">
        <legend className="px-2 text-sm font-bold text-slate-900">Detalhes</legend>

        <div className="space-y-4">
          <div>
            <label className="rotulo" htmlFor="descricao">Descrição da vaga *</label>
            <textarea
              id="descricao"
              name="descricao"
              required
              rows={6}
              defaultValue={vaga?.descricao ?? ""}
              className="campo resize-y"
              placeholder="Descreva as atividades do dia a dia, o time e o que a pessoa vai fazer..."
            />
          </div>

          <div>
            <label className="rotulo" htmlFor="requisitos">Requisitos</label>
            <textarea
              id="requisitos"
              name="requisitos"
              rows={4}
              defaultValue={vaga?.requisitos ?? ""}
              className="campo resize-y"
              placeholder={"- Ensino médio completo\n- Experiência de 6 meses na função\n- Conhecimento em Excel"}
            />
          </div>

          <div>
            <label className="rotulo" htmlFor="beneficios">Benefícios</label>
            <textarea
              id="beneficios"
              name="beneficios"
              rows={4}
              defaultValue={vaga?.beneficios ?? ""}
              className="campo resize-y"
              placeholder={"- Vale-transporte\n- Vale-refeição\n- Plano de saúde"}
            />
          </div>

          <div>
            <label className="rotulo" htmlFor="email_contato">E-mail para receber avisos</label>
            <input id="email_contato" name="email_contato" type="email" defaultValue={vaga?.email_contato ?? ""} className="campo" placeholder="rh@empresa.com.br" />
          </div>
        </div>
      </fieldset>

      {/* ---------- ADMIN ---------- */}
      {modoAdmin && (
        <fieldset className="cartao border-marca/30 bg-marca-clara/40 p-5">
          <legend className="px-2 text-sm font-bold text-marca">
            Opções do administrador
          </legend>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="rotulo" htmlFor="status">Status da vaga</label>
              <select id="status" name="status" defaultValue={vaga?.status ?? "publicada"} className="campo">
                <option value="publicada">Publicada (visível a todos)</option>
                <option value="pendente">Pendente (aguardando aprovação)</option>
                <option value="pausada">Pausada</option>
                <option value="encerrada">Encerrada</option>
                <option value="recusada">Recusada</option>
              </select>
            </div>
            <label className="flex cursor-pointer items-end gap-2.5 pb-3">
              <input
                type="checkbox"
                name="destaque"
                defaultChecked={vaga?.destaque ?? false}
                className="h-4 w-4 rounded border-slate-300 accent-[#2557a7]"
              />
              <span className="text-[15px] text-slate-700">
                Marcar como vaga em destaque
              </span>
            </label>
          </div>
        </fieldset>
      )}

      <div className="flex flex-wrap gap-3">
        <BotaoEnviar carregando="Salvando..." className="btn-primario">
          {vaga ? "Salvar alterações" : "Publicar vaga"}
        </BotaoEnviar>
        <a href={modoAdmin ? "/admin/vagas" : "/painel/vagas"} className="btn-secundario">
          Cancelar
        </a>
      </div>

      {!modoAdmin && !vaga && (
        <p className="text-sm text-slate-500">
          ℹ️ Sua vaga passará por uma aprovação rápida do administrador antes de
          aparecer publicamente.
        </p>
      )}
    </form>
  );
}
