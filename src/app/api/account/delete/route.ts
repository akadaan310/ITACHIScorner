import { createAdminSupabase } from "@/lib/supabase/server";
import { authenticatedRequest, formRedirect } from "@/lib/auth/http";

export async function POST(request: Request) {
  const session = await authenticatedRequest(request, true);
  if (session.error) return session.error;
  const form = await request.formData().catch(() => null);
  if (form?.get("confirmation") !== "DELETE") return formRedirect(request, "/me/settings", "confirm-delete");
  const admin = createAdminSupabase();
  if (!admin) return formRedirect(request, "/me/settings", "delete-unavailable");
  try {
    // getSession is transport only here: authenticatedRequest already revalidated getUser.
    const { data, error } = await session.client.auth.getSession();
    if (error || !data.session) return formRedirect(request, "/join", "expired-code");
    const revoked = await admin.auth.admin.signOut(data.session.access_token, "global");
    if (revoked.error) return formRedirect(request, "/me/settings", "delete-failed");
    const deleted = await admin.auth.admin.deleteUser(session.user.id, false);
    if (deleted.error) return formRedirect(request, "/me/settings", "delete-failed");
    await session.client.auth.signOut({ scope: "local" });
    return formRedirect(request, "/join", "deleted");
  } catch { return formRedirect(request, "/me/settings", "delete-failed"); }
}
