import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/art";
import { PublicHeader, PendingPanel } from "@/components/public-content";

export const metadata: Metadata = { title: "Community", description: "A respectful space for questions, pending moderation readiness." };

export default function CommunityPage() {
  return <div className="public-page"><PublicHeader label="Community" title={<>Room for questions.<br /><em>Care for people.</em></>}><p>A welcoming space for curiosity and respectful disagreement.</p></PublicHeader><div className="shell">
    <PendingPanel label="Not open for submissions" title="Good conversation needs good care."><p>Member questions and discussions will open when moderation and privacy controls are ready. No public questions or stories have been collected here.</p><p className="mt-3">Mentorship is not currently available. Personal identity and faith journeys will always be yours to share, or keep private.</p></PendingPanel>
    <section className="quiet-section" aria-labelledby="community-principles"><p className="public-eyebrow">Participation principles</p><h2 id="community-principles">Make space for the person.</h2><p>These are the participation principles for this independent concept. They are not quotations from Itachi or a claim of her endorsement.</p></section>
    <div className="route-principles"><article><h3>Listen with care</h3><p>Make room for a question to be fully expressed. Ask for clarification before assigning someone a belief or intention.</p></article><article><h3>Respect a boundary</h3><p>No one owes a public account of their identity or faith journey. Keep another person&rsquo;s private words private.</p></article><article><h3>Disagree with dignity</h3><p>Discuss an idea without making a person a target. A future discussion space will need active moderation to uphold that care.</p></article></div>
    <section className="route-now" aria-labelledby="community-now"><p className="public-eyebrow">What you can do now</p><h2 id="community-now">A question can begin with you.</h2><p>Use the homepage desk to gather your own thoughts. It does not post to a community, collect submissions or send your writing anywhere. Copy anything you choose to keep before leaving.</p><Link href="/#question-desk" className="chapter-link">Reflect in your own words <Arrow /></Link></section>
  </div></div>;
}
