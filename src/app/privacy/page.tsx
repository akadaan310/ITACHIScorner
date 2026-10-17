import type { Metadata } from "next";
import Link from "next/link";
import { ChapterHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="pb-10">
      <ChapterHeader eyebrow="Transparent policy" title={<>Your data <em className="text-teal">stays with you.</em></>}>Plain-language privacy for the demo.</ChapterHeader>
      <div className="shell">
        <div className="prose-soft max-w-3xl">
        <h2>What the demo stores</h2>
        <p>Your nickname, choices, progress, journal, notes and settings are saved in your browser&rsquo;s localStorage under one key. Nothing is sent to a server. There are no analytics, cookies, trackers or ads.</p>
        <h2>Platform handles</h2>
        <p>If you type a TikTok or YouTube handle, it is labelled “self-entered”. It is never used to read comments, track viewing or infer attendance, and you can unbind it at any time.</p>
        <h2>Live comments &amp; attendance</h2>
        <p>The demo collects none. Any future collection would require lawful authority, platform-compliant access, explicit consent, data minimisation and deletion on request.</p>
        <h2>Sensitive information</h2>
        <ul>
          <li>Religious identity or conversion history is never displayed publicly.</li>
          <li>Reverts HQ notes and questions are private by default; wall questions are anonymous by default.</li>
          <li>Leaderboards are opt-in and pseudonymous.</li>
        </ul>
        <h2>Export &amp; delete</h2>
        <p>Use <Link href="/me/settings">Settings</Link> to download everything as JSON or erase it completely.</p>
        </div>
      </div>
    </div>
  );
}
