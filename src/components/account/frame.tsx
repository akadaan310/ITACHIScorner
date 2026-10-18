import Link from "next/link";
import type { ReactNode } from "react";
import type { AccountContext } from "@/lib/auth/session";

export function AccountFrame({ title, children }: { title: string; children: ReactNode }) {
  return <div className="shell py-12 sm:py-16"><div className="mx-auto max-w-3xl"><p className="eyebrow">A place for your questions</p><h1 className="mt-4 text-5xl leading-tight text-cream sm:text-7xl">{title}</h1><div className="mt-8 space-y-6">{children}</div></div></div>;
}

export function AccountUnavailable({ context }: { context: AccountContext }) {
  if (context.status === "authenticated") return null;
  return <section className="card p-6 sm:p-8" aria-labelledby="account-state">
    <h2 id="account-state" className="text-3xl text-cream">{context.status === "unconfigured" ? "Your account is not connected yet." : context.status === "unavailable" ? "Your account could not be loaded." : "Make room for your questions."}</h2>
    <p className="mt-3 text-cream/75">{context.status === "unconfigured" ? "Account access is being prepared. You can explore the site while this becomes available." : context.status === "unavailable" ? "Please try again later. Your saved information has not been replaced." : "Sign in to keep a private profile and manage your preferences."}</p>
    <Link className="btn btn-primary mt-6" href={context.status === "signed-out" ? "/join" : "/explore"}>{context.status === "signed-out" ? "Sign in" : "Explore the questions"}</Link>
  </section>;
}

const notices: Record<string, string> = {
  "note-saved": "Your private note was saved.", "note-deleted": "Your private note was deleted.",
  "invalid-note": "Write a note between 1 and 10,000 characters.", "missing-note": "That note could not be found in your account.",
  "question-saved": "The reviewed question was saved to My Corner.", "question-removed": "The question was removed from your saved list.",
  "question-unavailable": "That question is not currently available to save.",
  saved: "Your changes were saved.", sent: "Check your email for a sign-in link. If your email includes a code, you can enter it below.",
  "send-failed": "We could not send your sign-in email. Please wait a moment and try again.",
  "expired-code": "That sign-in link or code could not be verified. It may have expired; request a new email.",
  "invalid-code": "Enter your email address and its six digit sign-in code.",
  "invalid-email": "Enter a valid email address.", "invalid-request": "The request could not be verified. Please try again from this page.",
  "invalid-nickname": "Choose a nickname of 2–40 letters, numbers, spaces or simple punctuation.",
  "invalid-handle": "Choose a platform and enter a handle with letters, numbers, dots, underscores or dashes.",
  "invalid-languages": "Enter up to ten languages, separated by commas.",
  "save-failed": "Your changes could not be saved. Please try again later.",
  unavailable: "Account access is temporarily unavailable. Please try again later.",
  "signed-out": "You have signed out on this device.",
  "confirm-delete": "Type DELETE exactly to confirm permanent account deletion.",
  "delete-unavailable": "Account deletion is temporarily unavailable. Your account has not been erased.",
  "delete-failed": "Your account could not be deleted. You may need to sign in again before retrying. No successful deletion has been confirmed.",
  deleted: "Your account and its personal records were deleted.",
};

export function AccountNotice({ code }: { code?: string | string[] }) {
  const text = typeof code === "string" ? notices[code] : undefined;
  if (!text) return null;
  const success = ["saved", "sent", "signed-out", "deleted", "note-saved", "note-deleted", "question-saved", "question-removed"].includes(code as string);
  return <p role={success ? "status" : "alert"} className="rounded-lg border border-white/20 p-4 text-sm text-cream">{text}</p>;
}
