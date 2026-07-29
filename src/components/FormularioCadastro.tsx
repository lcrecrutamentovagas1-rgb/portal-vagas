"use client";

import { useActionState } from "react";
import { cadastrarEmpresa } from "@/app/actions/auth";
import { AlertaErro } from "@/components/Alerta";
import BotaoEnviar from "@/components/BotaoEnviar";
import { ESTADOS } from "@/lib/site";

export default function FormularioCadastro() {
  const [estado, acao] = useActionState(cadastrarEmpresa, {});

  if (estado.sucesso) {
    return (
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-600 text-2xl text-white">
          ✓
        </div>
        <h2 className="mt-4 text-lg font-bold text-slate-900">Quase lá!</h2>
        <p className="mt-2 text-slate-600">{estado.sucesso}</p>
        <a href="/entrar" className="btn-primario mt-6">Ir para o login</a>
      </div>
    );
  }

  return (
    <form action={acao} className="space-y-4">
      {estado.erro && <AlertaErro>{estado.erro}</AlertaErro>}

      <div>
        <label className="rotulo" htmlFor="empresa_nome">Nome da empresa *</label>
        <input id="empresa_nome" name="empresa_nome" required className="campo" placeholder="Padaria Pão Quente Ltda" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="rotulo" htmlFor="responsavel">Nome do responsável</label>
          <input id="responsavel" name="responsavel" className="campo" placeholder="João Souza" />
        </div>
        <div>
          <label className="rotulo" htmlFor="cnpj">CNPJ</label>
          <input id="cnpj" name="cnpj" className="campo" placeholder="00.000.000/0001-00" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="rotulo" htmlFor="telefone">Telefone</label>
          <input id="telefone" name="telefone" className="campo" placeholder="(31) 3333-0000" />
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
              {ESTADOS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
            </select>
          </div>
        </div>
      </div>

      <hr className="border-slate-200" />

      <div>
        <label className="rotulo" htmlFor="email">E-mail de acesso *</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="campo" placeholder="contato@empresa.com.br" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="rotulo" htmlFor="senha">Senha *</label>
          <input id="senha" name="senha" type="password" required minLength={6} autoComplete="new-password" className="campo" placeholder="mínimo 6 caracteres" />
        </div>
        <div>
          <label className="rotulo" htmlFor="confirmar">Confirmar senha *</label>
          <input id="confirmar" name="confirmar" type="password" required minLength={6} autoComplete="new-password" className="campo" placeholder="repita a senha" />
        </div>
      </div>

      <BotaoEnviar carregando="Criando conta...">Criar conta grátis</BotaoEnviar>
    </form>
  );
}
