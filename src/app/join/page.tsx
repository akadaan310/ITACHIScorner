import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountFrame, AccountNotice } from "@/components/account/frame";
import { getAccountContext } from "@/lib/auth/session";
import { safeNextPath } from "@/lib/auth/validation";

export const metadata: Metadata = { title: "Sign in" };

export default async function JoinPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const context = await getAccountContext(), params = await searchParams;
  if (context.status === "authenticated") redirect("/me");
  const ready = context.status === "signed-out";
  return <AccountFrame title="Your corner starts here.">
    <p className="max-w-xl text-lg text-cream/75">A private place to keep your profile and preferences as this corner grows. Browsing does not require an account.</p>
    <AccountNotice code={params.notice} />
    {!ready ? <section className="card p-6 sm:p-8"><h2 className="text-3xl text-cream">Sign-in is not available yet.</h2><p className="mt-3 text-cream/75">{context.status === "unavailable" ? "We could not reach the account service. Please try again later." : "Account access is being prepared. There is nothing you need to set up."}</p><Link href="/explore" className="btn btn-primary mt-6">Explore the questions</Link></section> : <>
      <form action="/auth/request" method="post" className="card space-y-4 p-6 sm:p-8">
        <h2 className="text-3xl text-cream">Sign in with email</h2>
        <p className="text-sm text-cream/75">We will send a one-time sign-in link. Your first sign-in creates your account.</p>
        <input type="hidden" name="next" value={safeNextPath(params.next)} />
        <label className="block text-sm text-cream" htmlFor="sign-in-email">Email address</label>
        <input id="sign-in-email" className="field" name="email" type="email" autoComplete="email" maxLength={254} required />
        <button className="btn btn-primary" type="submit">Send sign-in email</button>
        <p className="text-sm text-cream/65">Read how your information is used in our <Link className="underline" href="/privacy">privacy notice</Link>.</p>
      </form>
      <details className="card p-6"><summary className="cursor-pointer text-lg text-cream">Have a six digit code?</summary><form action="/auth/verify" method="post" className="mt-5 space-y-4">
        <p className="text-sm text-cream/75">Use this if your sign-in email includes a code.</p><input type="hidden" name="next" value={safeNextPath(params.next)} />
        <label className="block text-sm text-cream" htmlFor="code-email">Email address for the code</label><input id="code-email" name="email" type="email" className="field" autoComplete="email" maxLength={254} required />
        <label className="block text-sm text-cream" htmlFor="sign-in-code">Six digit code</label><input id="sign-in-code" name="token" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" minLength={6} maxLength={6} className="field" required />
        <button className="btn btn-primary" type="submit">Verify code</button>
      </form></details>
    </>}
  </AccountFrame>;
}
