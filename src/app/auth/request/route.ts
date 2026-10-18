import { createServerSupabase } from "@/lib/supabase/server";
import { formRedirect, rejectedOrigin } from "@/lib/auth/http";
import { isSameOrigin, parseEmail, safeNextPath } from "@/lib/auth/validation";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return rejectedOrigin();
  const form = await request.formData().catch(() => null);
  const email = parseEmail(form?.get("email"));
  if (!email) return formRedirect(request, "/join", "invalid-email");
  const client = await createServerSupabase();
  if (!client) return formRedirect(request, "/join", "unavailable");
  const callback = new URL("/auth/callback", request.url);
  callback.searchParams.set("next", safeNextPath(form?.get("next")));
  try {
    const { error } = await client.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: callback.toString() } });
    return formRedirect(request, "/join", error ? "send-failed" : "sent");
  } catch { return formRedirect(request, "/join", "unavailable"); }
}
