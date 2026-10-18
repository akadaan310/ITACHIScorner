import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/art";
import { PublicHeader, PendingPanel } from "@/components/public-content";

export const metadata: Metadata = { title: "Dialogue Practice", description: "Thoughtful dialogue practice, pending source review and approval." };

export default function PracticePage() {
  return <div className="public-page"><PublicHeader label="Dialogue Practice" title={<>Listen closely.<br /><em>Respond thoughtfully.</em></>}><p>A place to practise clarity, careful listening and fair representation.</p></PublicHeader><div className="shell">
    <PendingPanel label="Awaiting reviewed material" title="Real conversations come first."><p>Source-based exercises are not available yet. They require approved conversations and review before anyone practises with them.</p><p className="mt-3">Future feedback will focus on reasoning and care in dialogue. It will never score faith, conversion or debate victory.</p></PendingPanel>
    <section className="route-now" aria-labelledby="practice-now"><p className="public-eyebrow">What you can do now</p><h2 id="practice-now">Give your own words a second look.</h2><p>The homepage desk lets you write a question, add a reflection, then review and edit the same words. Copy the draft if you want to keep it. It stays only in the current page and disappears on refresh.</p><p>This is your own writing, without automated answers, assessment or an attributed Itachi method.</p><Link href="/#question-desk" className="chapter-link">Use the question desk <Arrow /></Link></section>
    <section className="quiet-section"><p className="public-eyebrow">For notes you choose to keep</p><h2>Continue in your own space.</h2><p><Link href="/me" className="inline-link">My Corner</Link> explains private account notes and current account availability. The homepage draft is separate: it is never transferred to an account automatically.</p></section>
  </div></div>;
}
