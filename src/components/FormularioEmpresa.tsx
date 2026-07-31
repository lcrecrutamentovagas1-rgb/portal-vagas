"use client";

import { useActionState } from "react";
import { salvarEmpresa } from "@/app/actions/auth";
import { AlertaErro, AlertaSucesso } from "@/components/Alerta";
import BotaoEnviar from "@/components/BotaoEnviar";
import { ESTADOS } from "@/lib/site";
import type { Empresa } from "@/lib/types";

export default function FormularioEmpresa({
  empresa,
  email,
}: {
  empresa: Empresa | null;
  email: string;
}) {
  const [estado, acao] = useActionState(salvarEmpresa, {});

  return (
    <form action={acao} className="space-y-4">
      {estado.erro && <AlertaErro>{estado.erro}</AlertaErro>}
      {estado.sucesso && <AlertaSucesso>{estado.sucesso}</AlertaSucesso>}

      <div>
        <label className="rotulo" htmlFor="nome">Nome da empresa *</label>
        <input id="nome" name="nome" required defaultValue={empresa?.nome ?? ""} className="campo" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="rotulo" htmlFor="cnpj">CNPJ</label>
          <input id="cnpj" name="cnpj" defaultValue={empresa?.cnpj ?? ""} className="campo" placeholder="00.000.000/0001-00" />
        </div>
        <div>
          <label className="rotulo" htmlFor="telefone">Telefone</label>
          <input id="telefone" name="telefone" defaultValue={empresa?.telefone ?? ""} className="campo" placeholder="(31) 3333-0000" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_100px]">
        <div>
          <label className="rotulo" htmlFor="cidade">Cidade</label>
          <input id="cidade" name="cidade" defaultValue={empresa?.cidade ?? ""} className="campo" />
        </div>
        <div>
          <label className="rotulo" htmlFor="estado">UF</label>
          <select id="estado" name="estado" defaultValue={empresa?.estado ?? ""} className="campo">
            <option value="">--</option>
            {ESTADOS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="rotulo" htmlFor="site">Site</label>
        <input id="site" name="site" defaultValue={empresa?.site ?? ""} className="campo" placeholder="https://www.empresa.com.br" />
      </div>

      <div>
        <label className="rotulo" htmlFor="sobre">Sobre a empresa</label>
        <textarea id="sobre" name="sobre" rows={4} defaultValue={empresa?.sobre ?? ""} className="campo resize-y" placeholder="Conte um pouco sobre a sua empresa..." />
      </div>

      <div>
        <label className="rotulo">E-mail de acesso</label>
        <input value={email} disabled className="campo bg-slate-100 text-slate-500" />
      </div>

      <BotaoEnviar carregando="Salvando..." className="btn-primario">
        Salvar dados
      </BotaoEnviar>
    </form>
  );
}
