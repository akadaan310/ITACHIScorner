import Link from "next/link";
import { Mark, Separator, StarField } from "@/components/art";
import { PlatformIcon } from "@/components/ui";
import { creator } from "@/lib/config/creator";

const cols = [
  { title: "Worlds", links: [["/discover", "Explore"], ["/afterglow", "Afterglow"], ["/watch", "Search the Arsenal"], ["/dojo", "Dawah Simulator"], ["/atlas", "Night Atlas"], ["/reverts", "Reverts HQ"], ["/stories", "Shahadah Stories"], ["/library", "The Library"]] },
  { title: "Join", links: [["/membership", "Choose Your Rank"], ["/join", "Join the Ranks"], ["/me", "My Profile"], ["/events", "Live Tonight"]] },
  { title: "Trust", links: [["/about", "About this concept"], ["/faq", "FAQ"], ["/privacy", "Privacy"], ["/terms", "Concept terms"], ["/studio", "Studio (internal)"]] },
] as const;

const socials = [
  ["tiktok", creator.links.tiktok, "TikTok"],
  ["youtube", creator.links.youtube, "YouTube"],
  ["instagram", creator.links.instagram, "Instagram"],
  ["x", creator.links.x, "X"],
  ["patreon", creator.links.patreon, "Patreon"],
] as const;

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-gold/15 bg-[#0a0912] pb-28 lg:pb-12">
      <StarField seed={99} count={60} height={400} className="pointer-events-none absolute inset-0 h-full w-full opacity-50" twinkle={false} />
      <div className="shell relative pt-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <Mark size={48} />
              <div>
                <p className="font-display text-3xl leading-none text-cream">Itachi&rsquo;s <span className="text-coral">Corner</span></p>
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-gold/80">Where truth meets dialogue</p>
                <p lang="ar" className="ar text-lg leading-tight text-gold">كُلُّ سُؤَالٍ يَفْتَحُ سَمَاءً جَدِيدَةً</p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/65">
              Faith // Knowledge // Reason. Every question opens a new sky — a companion for before, during and after the live. The lives themselves stay on the official channels.
            </p>
            <ul className="mt-5 flex gap-2" aria-label="Official channels">
              {socials.map(([p, href, label]) => (
                <li key={p}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-cream/80 hover:border-gold hover:text-gold" aria-label={`${label} (official, opens in new tab)`}>
                    <PlatformIcon platform={p} />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[0.7rem] text-cream/60">Links checked against the public hub on {creator.linksCheckedAt}.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {cols.map((c) => (
              <div key={c.title}>
                <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-gold/80">{c.title}</h2>
                <ul className="mt-3 space-y-1">
                  {c.links.map(([href, label]) => (
                    <li key={href}>
                      <Link href={href} className="inline-flex min-h-9 items-center text-sm text-cream/75 hover:text-cream">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <Separator className="my-10 text-gold/50" />
        <div className="flex flex-col gap-3 text-xs leading-relaxed text-cream/65 md:flex-row md:items-center md:justify-between">
          <p>
            <strong className="text-cream/80">{creator.disclosure}</strong> {creator.disclosureLong}
          </p>
          <p className="shrink-0">Demo build · no live data · no billing</p>
        </div>
      </div>
    </footer>
  );
}
