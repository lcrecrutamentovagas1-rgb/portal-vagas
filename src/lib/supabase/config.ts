/**
 * ---------------------------------------------------------------
 *  CHAVES DO SUPABASE
 *
 *  O Supabase mudou o nome das chaves em 2025:
 *   - Projetos NOVOS usam a "Publishable key"  → sb_publishable_...
 *   - Projetos ANTIGOS usam a "anon public"    → eyJhbGci...
 *
 *  As duas funcionam igual. Aqui aceitamos qualquer uma das duas,
 *  para você não errar na hora de copiar.
 * ---------------------------------------------------------------
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

/** true quando as duas variáveis já foram preenchidas. */
export function supabaseConfigurado() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}
