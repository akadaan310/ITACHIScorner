import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSameOrigin } from "@/lib/auth/validation";

export const PRIVATE_HEADERS = { "Cache-Control": "private, no-store, max-age=0", Pragma: "no-cache" };

export function rejectedOrigin() { return NextResponse.json({ error: "Request origin rejected." }, { status: 403, headers: PRIVATE_HEADERS }); }

export function formRedirect(request: Request, path: string, code: string) {
  const url = new URL(path, request.url);
  url.searchParams.set("notice", code);
  return NextResponse.redirect(url, { status: 303, headers: PRIVATE_HEADERS });
}

export async function authenticatedRequest(request: Request, mutation = false) {
  if (mutation && !isSameOrigin(request)) return { error: rejectedOrigin() };
  const client = await createServerSupabase();
  if (!client) return { error: NextResponse.json({ error: "Accounts are not configured." }, { status: 503, headers: PRIVATE_HEADERS }) };
  try {
    const { data: { user }, error } = await client.auth.getUser();
    if (error && error.name !== "AuthSessionMissingError" && (!error.status || error.status >= 500 || error.status === 429)) return { error: NextResponse.json({ error: "Account service unavailable." }, { status: 503, headers: PRIVATE_HEADERS }) };
    if (error || !user || user.is_anonymous) return { error: NextResponse.json({ error: "Sign in again to continue." }, { status: 401, headers: PRIVATE_HEADERS }) };
    return { client, user };
  } catch { return { error: NextResponse.json({ error: "Account service unavailable." }, { status: 503, headers: PRIVATE_HEADERS }) }; }
}
