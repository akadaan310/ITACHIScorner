import type { Metadata } from "next";
import Link from "next/link";
import { starPath } from "@/components/art";
import { ChapterHeader, SectionTitle, Tag } from "@/components/ui";
import { creator } from "@/lib/config/creator";
import { LEVEL_DISCLAIMER, levels } from "@/lib/progression";

export const metadata: Metadata = { title: "Choose Your Rank", description: "Free forever. Supporter and Champion are concept previews with no billing." };

const tiers = [
  { name: "Scout", status: "Free forever", featured: false, items: ["Every lesson, passage and Atlas star", "Search the Arsenal & the Simulator", "Afterglow recaps, trivia and journal", "Your Explorer's Star Card"], cta: "Join free", href: "/join" },
  { name: "Supporter", status: "Concept preview · coming later", featured: false, items: ["Original lesson collections", "Event & Afterglow anthologies", "Supporter flair (cosmetic)", "Everything in Scout — nothing removed"], cta: "Concept preview", href: "#principles" },
  { name: "Champion", status: "Concept preview · coming later", featured: true, items: ["Collectible printed book edition (future)", "Behind-the-scenes creator notes (if approved)", "Champion orbit flair (cosmetic)", "Direct creator support"], cta: "Concept preview", href: "#principles" },
];

const principles = ["Learning is never paywalled — basic Qur'an access is always free", "No pay-to-win credits or levels", "No loot boxes, gambling mechanics or guilt-based streaks", "Prices are not set; no billing exists in this demo", "Invite codes grant cosmetic flair only"];

export default function MembershipPage() {
  return (
    <div className="pb-10">
      <ChapterHeader eyebrow="Membership" title={<>Choose your <em className="text-coral">rank.</em></>}>
        Join free and stay free. Supporter and Champion show what optional support could offer one day — clearly marked as concepts.
      </ChapterHeader>
      <section className="shell" aria-label="Ranks">
        <ul className="grid gap-5 md:grid-cols-3">
          {tiers.map((t) => (
            <li key={t.name} className={`card relative flex flex-col p-7 ${t.featured ? "border-amber/70 shadow-[0_0_0_1px_rgba(247,198,91,0.4),0_30px_60px_-30px_rgba(247,198,91,0.5)]" : ""}`}>
              {t.featured && <span className="absolute -top-3 right-5 rounded bg-amber px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-[#1a1206]">★ Champion</span>}
              <h2 className="text-5xl text-cream">{t.name}</h2>
              <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-coral">{t.status}</p>
              <p className="mt-4 font-display text-3xl text-cream">{t.name === "Scout" ? "$0 · forever" : <span className="text-cream/65">Price not set</span>}</p>
              <ul className="mt-4 flex-1 space-y-2">
                {t.items.map((i) => (
                  <li key={i} className="flex gap-2 text-sm text-cream/80"><span className="text-coral" aria-hidden="true">✓</span>{i}</li>
                ))}
              </ul>
              <Link href={t.href} className={`btn mt-6 ${t.name === "Scout" ? "btn-primary" : "btn-ghost"}`}>{t.cta}</Link>
              {t.name !== "Scout" && <p className="mt-2 text-center"><Tag kind="planned">Coming later</Tag></p>}
            </li>
          ))}
        </ul>
        <div className="card mt-6 flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-cream/75">Want to support Itachi today? She has an existing, official Patreon — separate from this concept.</p>
          <a href={creator.links.patreon} target="_blank" rel="noopener noreferrer" className="btn btn-gold">Official Patreon ↗</a>
        </div>
      </section>

      <section className="shell mt-16 grid gap-8 lg:grid-cols-[1fr_1.1fr]" aria-labelledby="levels">
        <div>
          <SectionTitle eyebrow="Levels" title={<span id="levels">Ranks earned by <em className="text-gold">learning</em></span>}>{LEVEL_DISCLAIMER}</SectionTitle>
          <ol className="space-y-2">
            {levels.map((l, i) => (
              <li key={l.id} className="flex items-center gap-4 rounded-lg border border-white/10 p-3">
                <span className="hex grid h-11 w-11 shrink-0 font-display text-lg text-[#16070b]" style={{ background: ["#B9B0CF", "#26C4B3", "#F7C65B", "#FA536D", "#D7AD65"][i] }}>{i + 1}</span>
                <span className="flex-1"><span className="block font-display text-2xl leading-none text-cream">{l.name}</span><span className="text-sm text-cream/60">{l.blurb}</span></span>
                <span className="font-mono text-xs text-cream/65">{l.min}+</span>
              </li>
            ))}
          </ol>
        </div>
        <figure className="card p-6">
          <figcaption className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-gold">{"// "}Membership constellation</figcaption>
          <svg viewBox="0 0 400 300" className="mt-4 w-full" role="img" aria-label="Constellation chart: Scout at the centre, Supporter and Champion as optional outer stars">
            <circle cx="200" cy="150" r="120" fill="none" stroke="#D7AD65" strokeOpacity="0.2" strokeDasharray="2 6" />
            <circle cx="200" cy="150" r="70" fill="none" stroke="#D7AD65" strokeOpacity="0.2" strokeDasharray="2 6" />
            <line x1="200" y1="150" x2="290" y2="70" stroke="#A58BE1" strokeOpacity="0.5" strokeDasharray="4 6" />
            <line x1="200" y1="150" x2="95" y2="235" stroke="#F7C65B" strokeOpacity="0.5" strokeDasharray="4 6" />
            <path d={starPath(8, 34, 20, 200, 150)} fill="#FA536D" />
            <text x="200" y="205" textAnchor="middle" fill="#F6EBDC" fontSize="16" fontFamily="Bebas Neue, sans-serif" letterSpacing="2">SCOUT · ALL LEARNING</text>
            <path d={starPath(4, 16, 5, 290, 70)} fill="#A58BE1" />
            <text x="290" y="45" textAnchor="middle" fill="#F6EBDC" fillOpacity="0.8" fontSize="14" fontFamily="Bebas Neue, sans-serif" letterSpacing="2">SUPPORTER (CONCEPT)</text>
            <path d={starPath(4, 16, 5, 95, 235)} fill="#F7C65B" />
            <text x="95" y="272" textAnchor="middle" fill="#F6EBDC" fillOpacity="0.8" fontSize="14" fontFamily="Bebas Neue, sans-serif" letterSpacing="2">CHAMPION (CONCEPT)</text>
          </svg>
        </figure>
      </section>

      <section id="principles" className="shell mt-16 scroll-mt-24" aria-labelledby="pr">
        <SectionTitle eyebrow="Our promises" title={<span id="pr">Fair by design</span>} />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p) => (
            <li key={p} className="card flex gap-3 p-5 text-cream/85"><span className="text-teal" aria-hidden="true">◆</span>{p}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
