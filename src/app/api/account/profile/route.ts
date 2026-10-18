import { authenticatedRequest, formRedirect } from "@/lib/auth/http";
import { parseNickname } from "@/lib/auth/validation";

export async function POST(request: Request) {
  const session = await authenticatedRequest(request, true);
  if (session.error) return session.error;
  const form = await request.formData().catch(() => null), nickname = parseNickname(form?.get("nickname"));
  if (!nickname) return formRedirect(request, "/me", "invalid-nickname");
  const { error } = await session.client.from("profiles").upsert({ id: session.user.id, nickname }, { onConflict: "id" });
  return formRedirect(request, "/me", error ? "save-failed" : "saved");
}
