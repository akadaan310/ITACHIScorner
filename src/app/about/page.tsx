import type { Metadata } from "next";
import Link from "next/link";
import { ChapterHeader } from "@/components/ui";
import { creator } from "@/lib/config/creator";

export const metadata: Metadata = { title: "About this concept", description: creator.disclosureLong };

export default function AboutPage() {
  return (
    <div className="pb-10">
      <ChapterHeader eyebrow="About Itachi's Corner" title={<>An independent concept, <em className="text-gold">made as a gift.</em></>}>
        {creator.disclosureLong}
      </ChapterHeader>
      <div className="shell">
        <div className="prose-soft max-w-3xl">
        <h2>What this is</h2>
        <p>A fully navigable product demo imagining a companion for the community around Da&rsquo;wah x Dialogues: before, during and after the lives that happen on TikTok and YouTube. It is unaffiliated and has not been endorsed. It does not speak for Itachi and never invents her words.</p>
        <h2>What is real, and what is demo</h2>
        <ul>
          <li>Real: links to her official public channels (checked {creator.linksCheckedAt}), the Qur&rsquo;an text (Tanzil) and translation (Saheeh International), all pending editorial review.</li>
          <li>Demo: every event, episode, trivia set, catalogue entry, practice dialogue, persona, leaderboard name and number — each one labelled.</li>
          <li>Not built: billing, accounts, OAuth, live-chat or attendance integrations, mentorship, the book.</li>
        </ul>
        <h2>The portrait</h2>
        <p>The masked portrait used as the main image was supplied by the project owner from an earlier design exploration. It must be replaced with an original, high-resolution file and approved in writing by the creator before any public launch.</p>
        <h2>Principles</h2>
        <ul>
          <li>Learning is free. Levels measure app participation — never faith, piety or conversions.</li>
          <li>Truthful data: a typed handle proves nothing; attendance always names its evidence.</li>
          <li>Dignity for sacred text: exact Arabic, no ornament over it, sources shown.</li>
          <li>Kind dialogue: the Simulator rewards clarity, fairness, evidence and listening.</li>
        </ul>
        <p><Link href="/faq">Read the FAQ</Link> · <Link href="/privacy">Privacy</Link> · <Link href="/terms">Concept terms</Link></p>
        </div>
      </div>
    </div>
  );
}
