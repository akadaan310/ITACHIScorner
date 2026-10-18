import { authenticatedRequest, formRedirect } from "@/lib/auth/http";

export async function POST(request: Request) {
  const session = await authenticatedRequest(request, true);
  if (session.error) return session.error;
  const form = await request.formData().catch(() => null), scope = form?.get("scope");
  if (!["community-publication", "product-updates"].includes(String(scope))) return formRedirect(request, "/me/settings", "invalid-request");
  const { error } = await session.client.from("consents").insert({ user_id: session.user.id, scope, granted: form?.get("granted") === "on" });
  return formRedirect(request, "/me/settings", error ? "save-failed" : "saved");
}
