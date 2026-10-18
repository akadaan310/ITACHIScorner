import { authenticatedRequest, formRedirect } from "@/lib/auth/http";

export async function POST(request: Request) {
  const session = await authenticatedRequest(request, true);
  if (session.error) return session.error;
  const form = await request.formData().catch(() => null);
  if (!form) return formRedirect(request, "/me/settings", "invalid-request");
  const languages = String(form.get("languages") ?? "").split(",").map((x) => x.trim()).filter(Boolean);
  if (languages.length > 10 || languages.some((x) => !/^[\p{L} -]{1,40}$/u.test(x))) return formRedirect(request, "/me/settings", "invalid-languages");
  const { error } = await session.client.from("member_preferences").upsert({ user_id: session.user.id, languages: [...new Set(languages)], reduced_motion: form.get("reduced_motion") === "on", email_updates: form.get("email_updates") === "on" }, { onConflict: "user_id" });
  return formRedirect(request, "/me/settings", error ? "save-failed" : "saved");
}
