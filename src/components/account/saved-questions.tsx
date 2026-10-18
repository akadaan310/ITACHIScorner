import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { parsePublishedQuestion } from "@/lib/published-content";

interface SavedRow { id: string; question_id: string; published_questions: Record<string, unknown> | null }

export async function SavedQuestions({ userId }: { userId: string }) {
  const client = await createServerSupabase();
  if (!client) return null;
  const { data, error } = await client.from("saved_questions").select("id,question_id,published_questions(id,title,summary,source_url,video_id,start_ms,end_ms,speaker,confidence,reviewed_at)").eq("user_id", userId).order("created_at", { ascending: false }).order("id").limit(50);
  const rows = (data ?? []) as unknown as SavedRow[];
  return <section className="card p-6" aria-labelledby="saved-questions"><h2 id="saved-questions" className="text-3xl text-cream">Saved questions</h2>{error ? <p role="alert" className="mt-3 text-cream/75">Your saved questions could not be loaded. Please try again later.</p> : rows.length === 0 ? <p className="mt-3 text-cream/75">Save a reviewed question from Explore when one becomes available.</p> : <><p className="mt-3 text-sm text-cream/65">Your most recent saved questions, up to 50.</p><ul className="mt-4 divide-y divide-white/10">{rows.map((row) => {
    const question = row.published_questions ? parsePublishedQuestion(row.published_questions) : null;
    return <li key={row.id} className="space-y-3 py-4">{question ? <><h3 className="text-xl text-cream">{question.title}</h3><p className="text-sm text-cream/75">{question.summary}</p><a className="text-sm text-coral underline" href={question.sourceUrl} target="_blank" rel="noopener noreferrer">View the original source<span className="sr-only"> (opens YouTube in a new tab)</span></a></> : <p className="text-sm text-cream/75">This saved question is not currently public.</p>}<form action="/api/account/saved-questions" method="post"><input type="hidden" name="question_id" value={row.question_id} /><input type="hidden" name="action" value="remove" /><input type="hidden" name="next" value="/me" /><button className="btn btn-ghost" type="submit">Remove saved question</button></form></li>;
  })}</ul></>}<Link href="/explore" className="btn btn-ghost mt-5">Explore questions</Link></section>;
}
