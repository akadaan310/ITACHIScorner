import { authenticatedRequest, formRedirect } from "@/lib/auth/http";
import { safeNextPath } from "@/lib/auth/validation";

export async function POST(request: Request) {
  const session = await authenticatedRequest(request, true);
  if (session.error) return session.error;
  const form = await request.formData().catch(() => null);
  const questionId = String(form?.get("question_id") ?? "").trim(), action = String(form?.get("action") ?? "toggle"), next = safeNextPath(form?.get("next"));
  if (!questionId || questionId.length > 200 || /[\x00-\x1f\x7f]/.test(questionId) || !["save", "remove", "toggle"].includes(action)) return formRedirect(request, next, "question-unavailable");
  try {
    const existing = await session.client.from("saved_questions").select("id").eq("user_id", session.user.id).eq("question_id", questionId).maybeSingle();
    if (existing.error) return formRedirect(request, next, "save-failed");
    if (action === "remove" || (action === "toggle" && existing.data)) {
      const { error } = await session.client.from("saved_questions").delete().eq("user_id", session.user.id).eq("question_id", questionId);
      return formRedirect(request, next, error ? "save-failed" : "question-removed");
    }
    // RLS returns no publication when source permission/review/hash gates fail.
    const approved = await session.client.from("published_questions").select("id").eq("id", questionId).maybeSingle();
    if (approved.error || !approved.data) return formRedirect(request, next, "question-unavailable");
    if (existing.data) return formRedirect(request, next, "question-saved");
    const { error } = await session.client.from("saved_questions").insert({ user_id: session.user.id, question_id: questionId });
    return formRedirect(request, next, error ? "save-failed" : "question-saved");
  } catch { return formRedirect(request, next, "save-failed"); }
}
