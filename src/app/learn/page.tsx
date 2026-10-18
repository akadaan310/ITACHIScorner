import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/art";
import { PublicHeader, PendingPanel } from "@/components/public-content";

export const metadata: Metadata = { title: "Learn", description: "Learning journeys are being prepared from verified conversations." };

export default function LearnPage() {
  return <div className="public-page"><PublicHeader label="Learn" title={<>Understanding takes<br /><em>a little time.</em></>}><p>Learning journeys are being prepared from verified conversations.</p></PublicHeader><div className="shell">
    <PendingPanel label="Awaiting evidence and approval" title="A thoughtful beginning is worth waiting for."><p>Lessons will follow source review and creator approval. There is no published course yet.</p></PendingPanel>
    <section className="route-now" aria-labelledby="learn-now"><p className="public-eyebrow">What you can do now</p><h2 id="learn-now">Start with what you want to understand.</h2><p>Use the homepage writing desk to put your own question and reflection into words. It does not teach or answer; it gives you a place to prepare a thought before looking for reliable guidance.</p><Link href="/#question-desk" className="chapter-link">Write your own question <Arrow /></Link></section>
    <section id="new-muslims" className="quiet-section scroll-mt-24"><p className="public-eyebrow">New Muslims · start here</p><h2>A gentle place to begin.</h2><p>You are welcome to take things at your own pace. Reviewed introductory resources and support routes are still being prepared. For personal religious guidance, speak with a qualified teacher you trust.</p><p>You can keep your own notes in <Link href="/me" className="inline-link">My Corner</Link> when account access is configured. The page explains availability and privacy before you sign in.</p></section>
    <div className="route-principles" aria-label="How learning is being prepared"><article><h3>Original context</h3><p>Learning material must begin with real conversations and traceable source moments.</p></article><article><h3>Careful review</h3><p>Source permission, editorial review and creator approval come before publication.</p></article><article><h3>Your own pace</h3><p>There is no course to enrol in or progress to complete yet. You can return when reviewed material is ready.</p></article></div>
  </div></div>;
}
