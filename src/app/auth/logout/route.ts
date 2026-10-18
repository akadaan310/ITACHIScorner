import { createServerSupabase } from "@/lib/supabase/server";
import { formRedirect, rejectedOrigin } from "@/lib/auth/http";
import { isSameOrigin } from "@/lib/auth/validation";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return rejectedOrigin();
  const client = await createServerSupabase();
  if (!client) return formRedirect(request, "/me", "unavailable");
  try {
    const { error } = await client.auth.signOut({ scope: "local" });
    return formRedirect(request, error ? "/me" : "/join", error ? "save-failed" : "signed-out");
  } catch { return formRedirect(request, "/me", "unavailable"); }
}
