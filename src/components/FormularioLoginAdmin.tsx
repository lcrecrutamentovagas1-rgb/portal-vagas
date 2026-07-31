"use client";

import { useActionState } from "react";
import { entrarAdmin } from "@/app/actions/auth";
import { AlertaErro } from "@/components/Alerta";
import BotaoEnviar from "@/components/BotaoEnviar";

export default function FormularioLoginAdmin() {
  const [estado, acao] = useActionState(entrarAdmin, {});

  return (
    <form action={acao} className="space-y-4">
      {estado.erro && <AlertaErro>{estado.erro}</AlertaErro>}

      <div>
        <label className="rotulo" htmlFor="email">E-mail do administrador</label>
        {/* defaultValue mantém o e-mail digitado quando o login falha */}
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={estado.email ?? ""}
          className="campo"
          placeholder="admin@seudominio.com.br"
        />
      </div>

      <div>
        <label className="rotulo" htmlFor="senha">Senha</label>
        <input id="senha" name="senha" type="password" required autoComplete="current-password" className="campo" placeholder="••••••••" />
      </div>

      <BotaoEnviar carregando="Entrando...">Acessar administração</BotaoEnviar>
    </form>
  );
}
