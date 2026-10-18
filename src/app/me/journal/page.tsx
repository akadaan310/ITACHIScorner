import type { Metadata } from "next";
import Link from "next/link";
import { AccountFrame, AccountNotice, AccountUnavailable } from "@/components/account/frame";
import { getAccountContext } from "@/lib/auth/session";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Private notes", robots: { index: false } };

export default async function PrivateNotesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const context = await getAccountContext(), params = await searchParams;
  if (context.status !== "authenticated") return <AccountFrame title="Private notes"><AccountUnavailable context={context} /></AccountFrame>;
  const requestedPage = typeof params.page === "string" ? Number(params.page) : 0;
  const page = Number.isSafeInteger(requestedPage) && requestedPage >= 0 ? Math.min(requestedPage, 1000) : 0;
  const client = (await createServerSupabase())!;
  const { data, error } = await client.from("learning_notes").select("id,body,created_at").eq("user_id", context.user.id).order("created_at", { ascending: false }).order("id").range(page * 20, page * 20 + 20);
  return <AccountFrame title="Private notes"><AccountNotice code={params.notice} /><p className="text-cream/75">Keep a question, thought or reminder for yourself. These notes are private to your account and are never published as teaching material.</p><Link href="/me" className="text-sm text-coral underline">Back to My Corner</Link>
    <form action="/api/account/notes" method="post" className="card space-y-4 p-6"><h2 className="text-3xl text-cream">A little room to think</h2><label className="block text-sm text-cream" htmlFor="new-note">Your private note</label><textarea id="new-note" name="body" className="field min-h-36" maxLength={10000} required /><button type="submit" className="btn btn-primary">Save private note</button></form>
    <section className="space-y-4" aria-labelledby="saved-notes"><h2 id="saved-notes" className="text-3xl text-cream">Your notes</h2>{error ? <p role="alert" className="card p-6 text-cream/75">Your notes could not be loaded. Please try again later.</p> : !data?.length ? <p className="card p-6 text-cream/75">No notes on this page yet.</p> : data.slice(0, 20).map((note) => <article key={note.id} className="card space-y-4 p-6"><p className="whitespace-pre-wrap break-words text-cream">{note.body}</p><time dateTime={note.created_at} className="block text-xs text-cream/65">{new Date(note.created_at).toLocaleDateString("en-GB", { timeZone: "UTC" })}</time><details><summary className="cursor-pointer text-sm text-coral">Edit this note</summary><form action="/api/account/notes" method="post" className="mt-4 space-y-3"><input type="hidden" name="action" value="update" /><input type="hidden" name="id" value={note.id} /><label className="sr-only" htmlFor={`edit-${note.id}`}>Edit private note</label><textarea id={`edit-${note.id}`} name="body" className="field min-h-32" defaultValue={note.body} maxLength={10000} required /><button className="btn btn-ghost" type="submit">Save note changes</button></form></details><form action="/api/account/notes" method="post"><input type="hidden" name="action" value="delete" /><input type="hidden" name="id" value={note.id} /><button type="submit" className="btn btn-ghost">Delete note</button></form></article>)}</section>
    {!error && <nav className="flex flex-wrap gap-3" aria-label="Note pages">{page > 0 && <Link className="btn btn-ghost" href={`/me/journal?page=${page - 1}`}>Newer notes</Link>}{(data?.length ?? 0) > 20 && <Link className="btn btn-ghost" href={`/me/journal?page=${page + 1}`}>Older notes</Link>}</nav>}
  </AccountFrame>;
}
