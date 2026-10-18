import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";

async function readCounts(userId: string): Promise<{ notes: number; saves: number } | null> {
  const client = await createServerSupabase();
  if (!client) return null;
  try {
    const [notes, saves] = await Promise.all([
      client.from("learning_notes").select("id", { count: "exact", head: true }).eq("user_id", userId),
      client.from("saved_questions").select("id", { count: "exact", head: true }).eq("user_id", userId),
    ]);
    const valid = (result: typeof notes) => !result.error && typeof result.count === "number" && Number.isSafeInteger(result.count) && result.count >= 0;
    return valid(notes) && valid(saves) ? { notes: notes.count!, saves: saves.count! } : null;
  } catch { return null; }
}

/** Count only first-party owned records; failures must never look like zero activity. */
export async function AccountActivity({ userId }: { userId: string }) {
  const counts = await readCounts(userId);
  if (!counts) return <p role="alert">Your activity could not be loaded. Please try again later.</p>;
  return <section className="card p-6" aria-labelledby="owned-activity"><p className="public-eyebrow">Only what you choose to keep</p><h2 id="owned-activity" className="mt-3 text-3xl text-cream">Your Corner, so far.</h2><dl className="owned-activity"><div><dt>Private notes</dt><dd>{counts.notes}</dd></div><div><dt>Saved questions</dt><dd>{counts.saves}</dd></div></dl><p className="mt-4 text-sm text-cream/75">These are records in your account, not an assessment of your learning or belief. Saving a question does not mean it is currently available to read.</p><Link href="/me/journal" className="chapter-link">Open your private notebook</Link></section>;
}
