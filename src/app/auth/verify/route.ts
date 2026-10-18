import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { formRedirect, PRIVATE_HEADERS, rejectedOrigin } from "@/lib/auth/http";
import { isSameOrigin, parseEmail, parseOtp, safeNextPath } from "@/lib/auth/validation";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return rejectedOrigin();
  const form = await request.formData().catch(() => null);
  const email = parseEmail(form?.get("email")), token = parseOtp(form?.get("token"));
  if (!email || !token) return formRedirect(request, "/join", "invalid-code");
  const client = await createServerSupabase();
  if (!client) return formRedirect(request, "/join", "unavailable");
  try {
    const { error } = await client.auth.verifyOtp({ email, token, type: "email" });
    if (error) return formRedirect(request, "/join", "expired-code");
    return NextResponse.redirect(new URL(safeNextPath(form?.get("next")), request.url), { status: 303, headers: PRIVATE_HEADERS });
  } catch { return formRedirect(request, "/join", "unavailable"); }
}
