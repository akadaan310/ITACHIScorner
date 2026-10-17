import type { Metadata } from "next";
import Link from "next/link";
import { ChapterHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Afterglow state gallery", description: "Every Afterglow UI state, navigable." };

const states = [
  { n: "01", name: "Anticipation", body: "Sample schedule card, demo countdown, reminder, poll, anticipation constellation.", href: "/afterglow/before", color: "#F7C65B" },
  { n: "02", name: "Join / check-in", body: "“I'll be there” intent vs. in-app check-in vs. self-reported — each labelled.", href: "/afterglow/live", color: "#FA536D" },
  { n: "03", name: "Challenge", body: "Timed First-30 trivia: timer ring, locked answers, keyboard path.", href: "/afterglow/live#main", color: "#FA536D" },
  { n: "04", name: "Challenge closed", body: "Use “Jump past the First-30” on the demo clock to see the closed + practice state.", href: "/afterglow/live", color: "#F0657A" },
  { n: "05", name: "Results", body: "Orbit-ring accuracy, XP for participation, per-question explanations and sources.", href: "/afterglow/live", color: "#26C4B3" },
  { n: "06", name: "Episode recap", body: "Episode constellation, moments, references, unlocked challenges, recap card.", href: "/afterglow/episodes/sample-episode-01", color: "#A58BE1" },
  { n: "07", name: "Saved highlights", body: "Moments you starred across episodes.", href: "/me/afterglow", color: "#D7AD65" },
  { n: "08", name: "Week calendar", body: "The vault calendar and archive.", href: "/afterglow/vault", color: "#F7C65B" },
  { n: "09", name: "Attendance history", body: "Truthful streaks with evidence source per entry.", href: "/me/afterglow", color: "#26C4B3" },
  { n: "10", name: "Link identity", body: "Self-entered TikTok/YouTube handles, clearly not verified, with unbind.", href: "/me/settings#handles", color: "#E3CBA5" },
  { n: "11", name: "Creator controls", body: "Demo-gated event builder, trivia composer, approvals, provenance, moderation.", href: "/studio/creator", color: "#F0657A" },
  { n: "12", name: "Unavailable integration", body: "How missing YouTube/TikTok integrations fail honestly.", href: "/studio/creator#integrations", color: "#B9B0CF" },
];

export default function GalleryPage() {
  return (
    <div data-world="afterglow" className="pb-10">
      <ChapterHeader eyebrow="Afterglow · state gallery" title={<>Every state, <em className="text-coral">one tap away.</em></>}>
        A map of the Afterglow interface for reviewers. Every card opens the real, working screen.
      </ChapterHeader>
      <ul className="shell grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {states.map((s) => (
          <li key={s.n}>
            <Link href={s.href} className="card card-hover block h-full p-6" style={{ borderTop: `3px solid ${s.color}` }}>
              <span className="font-mono text-xs text-cream/65">{s.n}</span>
              <span className="mt-1 block font-display text-3xl leading-none text-cream">{s.name}</span>
              <span className="mt-2 block text-sm text-cream/70">{s.body}</span>
              <span className="mt-4 inline-block font-mono text-[0.65rem] uppercase tracking-[0.18em]" style={{ color: s.color }}>Open ⟶</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
