import type { Metadata } from "next";
import Link from "next/link";
import { AccountFrame, AccountNotice, AccountUnavailable } from "@/components/account/frame";
import { AccountActivity } from "@/components/account/activity";
import { SavedQuestions } from "@/components/account/saved-questions";
import { getAccountContext } from "@/lib/auth/session";

export const metadata: Metadata = { title: "My Corner", robots: { index: false } };

export default async function MyCornerPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const context = await getAccountContext(), params = await searchParams;
  return <AccountFrame title="My Corner"><AccountNotice code={params.notice} />{context.status !== "authenticated" ? <AccountUnavailable context={context} /> : <>
    <section className="card p-6"><h2 className="text-3xl text-cream">{context.profile ? `Welcome, ${context.profile.nickname}.` : "Choose what we call you."}</h2><p className="mt-3 text-cream/75">Signed in as {context.user.email ?? "a member"}. Your nickname stays private.</p>
      <form action="/api/account/profile" method="post" className="mt-6 space-y-3"><label className="block text-sm text-cream" htmlFor="nickname">Your nickname</label><input id="nickname" name="nickname" className="field" autoComplete="nickname" defaultValue={context.profile?.nickname ?? ""} minLength={2} maxLength={40} required /><button className="btn btn-primary" type="submit">Save nickname</button></form>
    </section>
    <AccountActivity userId={context.user.id} />
    <SavedQuestions userId={context.user.id} />
    <section className="card p-6"><h2 className="text-3xl text-cream">Room to grow</h2><p className="mt-3 text-cream/75">Your learning space is waiting for reviewed material. Progress tracking awaits approved lessons.</p><Link href="/me/journal" className="btn btn-ghost mt-5 mr-2">Private notes</Link><Link href="/me/settings" className="btn btn-ghost mt-5">Settings &amp; privacy</Link>{context.staffRoles.length > 0 && <Link href="/studio/creator" className="btn btn-ghost mt-5 ml-2">Creator workspace</Link>}</section>
    <form action="/auth/logout" method="post"><button className="btn btn-ghost" type="submit">Sign out</button></form>
  </>}</AccountFrame>;
}
