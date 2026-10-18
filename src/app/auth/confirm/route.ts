import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { formRedirect, PRIVATE_HEADERS } from "@/lib/auth/http";
import { authServiceUnavailable, safeNextPath } from "@/lib/auth/validation";

export async function GET(request: Request) {
  const url = new URL(request.url), token = url.searchParams.get("token_hash");
  if (!token || token.length > 2048) return formRedirect(request, "/join", "expired-code");
  const client = await createServerSupabase();
  if (!client) return formRedirect(request, "/join", "unavailable");
  try {
    const { error } = await client.auth.verifyOtp({ token_hash: token, type: "email" });
    if (error) return formRedirect(request, "/join", authServiceUnavailable(error) ? "unavailable" : "expired-code");
    return NextResponse.redirect(new URL(safeNextPath(url.searchParams.get("next")), request.url), { status: 303, headers: PRIVATE_HEADERS });
  } catch { return formRedirect(request, "/join", "unavailable"); }
}
