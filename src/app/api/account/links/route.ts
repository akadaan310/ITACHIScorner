import { authenticatedRequest, formRedirect } from "@/lib/auth/http";
import { parseHandle } from "@/lib/auth/validation";

export async function POST(request: Request) {
  const session = await authenticatedRequest(request, true);
  if (session.error) return session.error;
  const form = await request.formData().catch(() => null);
  if (form?.get("action") === "remove") {
    const id = String(form.get("id") ?? "");
    if (!/^[0-9a-f-]{36}$/i.test(id)) return formRedirect(request, "/me/settings", "invalid-request");
    const { error } = await session.client.from("account_links").delete().eq("id", id).eq("user_id", session.user.id);
    return formRedirect(request, "/me/settings", error ? "save-failed" : "saved");
  }
  const platform = form?.get("platform"), handle = parseHandle(form?.get("handle"));
  if (!["youtube", "tiktok"].includes(String(platform)) || !handle) return formRedirect(request, "/me/settings", "invalid-handle");
  const { error } = await session.client.from("account_links").upsert({ user_id: session.user.id, platform, handle, verification: "self-entered" }, { onConflict: "user_id,platform" });
  return formRedirect(request, "/me/settings", error ? "save-failed" : "saved");
}
