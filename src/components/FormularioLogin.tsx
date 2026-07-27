"use client";

import { useActionState } from "react";
import { entrar } from "@/app/actions/auth";
import { AlertaErro } from "@/components/Alerta";
import BotaoEnviar from "@/components/BotaoEnviar";

export default function FormularioLogin({
  redirecionar,
}: {
  redirecionar?: string;
}) {
  const [estado, acao] = useActionState(entrar, {});

  return (
    <form action={acao} className="space-y-4">
      {redirecionar && <input type="hidden" name="redirect" value={redirecionar} />}

      {estado.erro && <AlertaErro>{estado.erro}</AlertaErro>}

      <div>
        <label className="rotulo" htmlFor="email">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="campo"
          placeholder="empresa@email.com"
        />
      </div>

      <div>
        <label className="rotulo" htmlFor="senha">Senha</label>
        <input
          id="senha"
          name="senha"
          type="password"
          required
          autoComplete="current-password"
          className="campo"
          placeholder="••••••••"
        />
      </div>

      <BotaoEnviar carregando="Entrando...">Entrar</BotaoEnviar>
    </form>
  );
}
