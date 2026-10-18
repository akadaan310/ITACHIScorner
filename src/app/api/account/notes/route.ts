import { authenticatedRequest, formRedirect } from "@/lib/auth/http";

export async function POST(request: Request) {
  const session = await authenticatedRequest(request, true);
  if (session.error) return session.error;
  const form = await request.formData().catch(() => null);
  const action = String(form?.get("action") ?? "create"), id = String(form?.get("id") ?? "");
  if (!["create", "update", "delete"].includes(action) || (action !== "create" && !/^[0-9a-f-]{36}$/i.test(id))) return formRedirect(request, "/me/journal", "invalid-note");
  const body = String(form?.get("body") ?? "").trim();
  if (action !== "delete" && (!body || body.length > 10000 || body.includes("\0"))) return formRedirect(request, "/me/journal", "invalid-note");
  try {
    if (action === "create") {
      const { error } = await session.client.from("learning_notes").insert({ user_id: session.user.id, unit_id: null, body });
      return formRedirect(request, "/me/journal", error ? "save-failed" : "note-saved");
    }
    const change = action === "delete" ? session.client.from("learning_notes").delete() : session.client.from("learning_notes").update({ body });
    const { data, error } = await change.eq("id", id).eq("user_id", session.user.id).select("id").maybeSingle();
    return formRedirect(request, "/me/journal", error ? "save-failed" : !data ? "missing-note" : action === "delete" ? "note-deleted" : "note-saved");
  } catch { return formRedirect(request, "/me/journal", "save-failed"); }
}
