import type { Metadata } from "next";
import Link from "next/link";
import { ArchFrame, GeoStar } from "@/components/art";
import { ChapterHeader, HexIcon, QuranPassage, SectionTitle } from "@/components/ui";
import { constellations } from "@/lib/progression";

export const metadata: Metadata = { title: "Explore the Corner", description: "Every world of Itachi's Corner — pick a door." };

const worlds = [
  { name: "Afterglow", sub: "After the live", body: "Turn every live into a lasting map of moments.", href: "/afterglow", color: "#FA536D", glyph: "☾" },
  { name: "Search the Arsenal", sub: "Dialogues & sources", body: "Find conversations, references and drills.", href: "/watch", color: "#F7C65B", glyph: "⌕" },
  { name: "Dawah Simulator", sub: "Train", body: "Playable dialogue practice — kind, fair, well-sourced.", href: "/dojo", color: "#26C4B3", glyph: "◎" },
  { name: "Night Atlas", sub: "Knowledge as stars", body: "Every topic a star, every star a real destination.", href: "/atlas", color: "#A58BE1", glyph: "✦" },
  { name: "Reverts HQ", sub: "Welcome home", body: "A calmer room for first steps. No rankings.", href: "/reverts", color: "#E7C8F5", glyph: "♡" },
  { name: "Shahadah Stories", sub: "Consent-only", body: "Stories told by their owners, never counted.", href: "/stories", color: "#D7AD65", glyph: "❖" },
  { name: "The Library", sub: "Book concept", body: "The planned illustrated book, previewed.", href: "/library", color: "#EFE3C6", glyph: "❦" },
  { name: "Choose Your Rank", sub: "Membership", body: "Free forever. Supporter & Champion previews.", href: "/membership", color: "#F0657A", glyph: "⬢" },
];

const pathHref: Record<string, string> = { oneness: "/atlas?star=oneness", asking: "/dojo", signs: "/atlas?star=signs", "first-steps": "/reverts" };

export default function DiscoverPage() {
  return (
    <div className="pb-10">
      <ChapterHeader eyebrow="Explore" title={<>Pick a door. <em className="text-gold">Every one opens a sky.</em></>} arabic="كُلُّ بَابٍ سَمَاء">
        Eight worlds, one identity. Browse freely — no account needed. Join only when you want to keep your progress.
      </ChapterHeader>

      <section className="shell" aria-label="Worlds">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {worlds.map((w, i) => (
            <li key={w.href} className={`rise rise-${(i % 4) + 1}`}>
              <Link href={w.href} className="card card-hover group relative flex h-full flex-col overflow-hidden p-6" style={{ borderTop: `3px solid ${w.color}` }}>
                <ArchFrame className="pointer-events-none absolute -right-8 -top-6 h-44 opacity-20 transition-transform duration-700 group-hover:scale-110" stroke={w.color} />
                <HexIcon color={w.color} glyph={w.glyph} size="h-12 w-12" />
                <span className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.18em]" style={{ color: w.color }}>{w.sub}</span>
                <span className="mt-1 font-display text-3xl leading-none text-cream">{w.name}</span>
                <span className="mt-2 flex-1 text-sm text-cream/70">{w.body}</span>
                <span className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-cream/60 group-hover:text-cream">Enter ⟶</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="discovery" className="shell mt-20 grid scroll-mt-24 gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center" aria-labelledby="disc">
        <div>
          <SectionTitle eyebrow="Today's discovery" title={<span id="disc">Night &amp; day, <em className="text-violet">as signs.</em></span>}>
            One verse to carry with you today. Read it slowly, in Arabic if you can, then write down the question it leaves you with.
          </SectionTitle>
          <div className="flex flex-wrap gap-3">
            <Link href="/me/journal" className="btn btn-primary">Write in my journal</Link>
            <Link href="/atlas?star=night-day" className="btn btn-ghost">Find it on the Atlas</Link>
          </div>
        </div>
        <QuranPassage id="3:190" />
      </section>

      <section className="shell mt-20" aria-labelledby="paths">
        <SectionTitle eyebrow="Star paths" title={<span id="paths">Pick a constellation to begin</span>} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {constellations.map((c, i) => (
            <li key={c.id}>
              <Link href={pathHref[c.id] ?? "/atlas"} className="card card-hover group block h-full p-6">
                <GeoStar n={[8, 10, 12, 8][i]} size={40} color={c.color} />
                <p lang="ar" className="ar mt-3 text-xl" style={{ color: c.color }}>{c.arabic}</p>
                <h3 className="text-3xl text-cream">{c.name}</h3>
                <p className="mt-1 text-sm text-cream/70">{c.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
