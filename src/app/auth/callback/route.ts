import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { formRedirect, PRIVATE_HEADERS } from "@/lib/auth/http";
import { safeNextPath } from "@/lib/auth/validation";

export async function GET(request: Request) {
  const url = new URL(request.url), code = url.searchParams.get("code");
  const client = await createServerSupabase();
  if (!client) return formRedirect(request, "/join", "unavailable");
  if (!code || code.length > 2048) return formRedirect(request, "/join", "expired-code");
  try {
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (error) return formRedirect(request, "/join", "expired-code");
    return NextResponse.redirect(new URL(safeNextPath(url.searchParams.get("next")), request.url), { status: 303, headers: PRIVATE_HEADERS });
  } catch { return formRedirect(request, "/join", "unavailable"); }
}
