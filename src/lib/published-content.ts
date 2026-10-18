import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/supabase/config";

export interface PublishedQuestion {
  id: string; title: string; summary: string; sourceUrl: string; videoId: string;
  startMs: number; endMs: number; speaker: string; confidence: number; reviewedAt: string;
}
export interface PublishedQuestionsResult { items: PublishedQuestion[]; status: "unconfigured" | "ready" | "unavailable" }

function safeQuestion(row: Record<string, unknown>): PublishedQuestion | null {
  const { id, title, summary, source_url: sourceUrl, video_id: videoId, start_ms: startMs, end_ms: endMs, speaker, confidence, reviewed_at: reviewedAt } = row;
  if (![id, title, summary, sourceUrl, videoId, speaker, reviewedAt].every((v) => typeof v === "string" && v.trim().length > 0)) return null;
  if (typeof startMs !== "number" || typeof endMs !== "number" || !Number.isSafeInteger(startMs) || !Number.isSafeInteger(endMs) || startMs < 0 || endMs <= startMs) return null;
  if (typeof confidence !== "number" || confidence < 0 || confidence > 1 || !Number.isFinite(confidence) || !Number.isFinite(Date.parse(reviewedAt as string))) return null;
  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId as string)) return null;
  try {
    const url = new URL(sourceUrl as string);
    if (url.protocol !== "https:" || url.host !== "www.youtube.com" || url.username || url.password || url.pathname !== "/watch" || url.searchParams.get("v") !== videoId) return null;
  } catch { return null; }
  const timestampUrl = `https://www.youtube.com/watch?v=${videoId}&t=${Math.floor(startMs / 1000)}s`;
  return { id, title, summary, sourceUrl: timestampUrl, videoId, startMs, endMs, speaker, confidence, reviewedAt } as PublishedQuestion;
}

/** Server-rendered pages consume only this reviewed public read model, never transcripts. */
export async function getPublishedQuestions(query?: string): Promise<PublishedQuestionsResult> {
  const config = getSupabaseConfig();
  if (!config) return { items: [], status: "unconfigured" };
  try {
    const client = createClient(config.url, config.publishableKey, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) } });
    let request = client.from("published_questions").select("id,title,summary,source_url,video_id,start_ms,end_ms,speaker,confidence,reviewed_at");
    const needle = (query ?? "").trim().slice(0, 160);
    if (needle) request = request.textSearch("search_document", needle, { type: "websearch", config: "simple" });
    const { data, error } = await request.order("reviewed_at", { ascending: false }).limit(100).abortSignal(AbortSignal.timeout(8000));
    if (error || !data) return { items: [], status: "unavailable" };
    const items = data.map((row) => safeQuestion(row as Record<string, unknown>));
    if (items.some((item) => item === null)) return { items: [], status: "unavailable" };
    return { items: items as PublishedQuestion[], status: "ready" };
  } catch { return { items: [], status: "unavailable" }; }
}
