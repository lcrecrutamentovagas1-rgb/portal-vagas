import { NextResponse } from "next/server";
import { criarClienteServidor } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await criarClienteServidor();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", request.url));
}
