import type { Metadata } from "next";
import Link from "next/link";
import { ArchFrame, Crescent, GeoStar, Mark, Medallion, Separator, Skyline, StarField, Wordmark } from "@/components/art";
import { HexIcon, QuranPassage, Tag } from "@/components/ui";

export const metadata: Metadata = { title: "Studio · design system", description: "Internal living design system for the Celestial Majlis.", robots: { index: false } };

const palette = [
  ["Cosmic black", "#0B0A14", "Global background"],
  ["Midnight ink", "#141025", "Surfaces"],
  ["Deep indigo", "#21183C", "Raised surfaces"],
  ["Itachi coral", "#FA536D", "Primary action, live, v1 identity"],
  ["Ruby", "#BE314C", "Simulator, emphasis"],
  ["Warm gold", "#D7AD65", "Celestial accents, Atlas"],
  ["Amber", "#F7C65B", "Highlights, credits, focus ring"],
  ["Nile teal", "#26C4B3", "Simulator, success, verified"],
  ["Twilight violet", "#A58BE1", "Atlas, sample tags"],
  ["Cairo cream", "#F6EBDC", "Text on dark"],
  ["Papyrus", "#EFE3C6", "Library world"],
  ["Lavender", "#ECE4FB", "Reverts HQ world"],
];

const motion = [
  ["Portal", "Chapter entry: pointed-arch clip-path unfolds (0.9s, glide easing)."],
  ["Rise", "Staggered content reveal, 18px, 80ms steps."],
  ["Orbit", "Single-ring success: one star orbits into place. No strobe."],
  ["Twinkle", "Stars breathe 4s; only a third of stars animate to save GPU."],
  ["Parallax", "Hero sky/portrait via CSS scroll-timeline — no JS, disabled under reduced motion."],
  ["Marquee", "v1 red ticker, 38s linear; static when motion is reduced."],
];

const voice = [
  ["Sign up", "Join the Ranks", "Bold · welcoming"],
  ["Watch", "Watch live now ⟶", "Always external, always official"],
  ["Points", "Credits", "Learning participation only"],
  ["Debate", "Battle of ideas · Simulator", "Nonviolent scoring: clarity, fairness, evidence, listening"],
  ["Error", "No stars here yet.", "Warm, never blaming"],
  ["Demo", "Sample · Demo · Simulated", "Visible honesty, always"],
];

export default function StudioPage() {
  return (
    <div className="pb-10">
      <header className="relative overflow-hidden border-b border-coral/40">
        <StarField seed={4} count={80} height={400} className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />
        <div className="shell relative flex flex-wrap items-end justify-between gap-6 pb-10 pt-12">
          <div>
            <p className="eyebrow">Internal studio · not public marketing</p>
            <h1 className="mt-3 text-7xl leading-[0.85] text-cream sm:text-8xl">Design <span className="text-coral">system</span></h1>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-gold">The Celestial Majlis × Pocket Warrior · bridge v2</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/studio/creator" className="btn btn-primary">Creator console (demo)</Link>
            <Link href="/afterglow/gallery" className="btn btn-ghost">Afterglow states</Link>
          </div>
        </div>
      </header>

      <section className="shell mt-12" aria-labelledby="color">
        <h2 id="color" className="text-4xl text-cream"><span className="font-mono text-base text-coral">{"// "}</span>Color system</h2>
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {palette.map(([n, hex, use]) => (
            <li key={hex} className="overflow-hidden rounded-lg border border-white/10 bg-ink">
              <div className="h-20" style={{ background: hex }} />
              <div className="p-3">
                <p className="text-sm font-semibold text-cream">{n}</p>
                <p className="font-mono text-[0.65rem] text-cream/60">{hex}</p>
                <p className="mt-1 text-[0.7rem] text-cream/65">{use}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-cream/60">Worlds: Afterglow (coral + amber) · Simulator (teal + ruby) · Atlas (violet + gold) · Reverts HQ (lavender, ivory, dawn gold — light) · Library (papyrus, oxblood — light).</p>
      </section>

      <section className="shell mt-14 grid gap-6 lg:grid-cols-2" aria-labelledby="type">
        <div className="card card-bar-coral p-7">
          <h2 id="type" className="font-mono text-sm uppercase tracking-[0.2em] text-coral">{"// "}Typography</h2>
          <p className="mt-4 font-display text-6xl uppercase leading-[0.88] text-cream">Where truth meets <em className="text-gold">dialogue.</em></p>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-coral">Faith // Knowledge // Reason</p>
          <p lang="ar" className="ar mt-3 text-3xl text-amber">كُلُّ سُؤَالٍ يَفْتَحُ سَمَاءً جَدِيدَةً</p>
          <p className="mt-3 text-cream/75">Body copy in Inter: comfortable 1.7 leading, never all-caps for paragraphs.</p>
        </div>
        <div className="card p-7">
          <dl className="space-y-4 text-sm">
            {[
              ["Display", "Bebas Neue — v1 arsenal condensed caps (OFL)"],
              ["Emphasis", "Fraunces italic — the celestial editorial voice (OFL)"],
              ["Labels", "JetBrains Mono, // prefixed — the HUD layer (OFL)"],
              ["UI / body", "Inter variable (OFL)"],
              ["Arabic", "Amiri — Naskh with full tashkīl support, line-height 2.1 (OFL)"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-white/5 pb-3"><dt className="font-mono text-xs uppercase tracking-wider text-gold">{k}</dt><dd className="text-right text-cream/80">{v}</dd></div>
            ))}
          </dl>
          <div className="mt-5"><QuranPassage id="112" compact /></div>
          <p className="mt-2 text-xs text-cream/65">RTL sample: multi-verse Arabic with diacritics, ayah markers, no ornament over the text.</p>
        </div>
      </section>

      <section className="shell mt-14" aria-labelledby="comp">
        <h2 id="comp" className="text-4xl text-cream"><span className="font-mono text-base text-coral">{"// "}</span>Buttons · badges · states</h2>
        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <div className="card space-y-4 p-6">
            <div className="flex flex-wrap gap-2"><button className="btn btn-primary" type="button">Watch live now</button><button className="btn btn-gold" type="button">Accept</button><button className="btn btn-ghost" type="button">Browse</button><button className="btn btn-primary" type="button" disabled>Disabled</button></div>
            <div className="flex flex-wrap gap-2"><Tag kind="demo" /><Tag kind="sample" /><Tag kind="simulated" /><Tag kind="verified" /><Tag kind="self-entered" /><Tag kind="planned" /><Tag kind="unavailable" /><Tag kind="pending-review" /></div>
            <div className="flex flex-wrap gap-3">{["#FA536D", "#F7C65B", "#26C4B3", "#A58BE1", "#BE314C"].map((c, i) => <HexIcon key={c} color={c} glyph={["☾", "✦", "◎", "✧", "⬢"][i]!} />)}</div>
            <input className="field" placeholder="Field · focus shows amber ring" aria-label="Sample field" />
          </div>
          <div className="card space-y-4 p-6">
            <div className="flex items-center gap-4"><Mark size={56} /><Wordmark /></div>
            <div className="flex items-center gap-4 text-gold"><GeoStar n={8} size={40} /><GeoStar n={10} size={40} /><GeoStar n={12} size={40} /><Crescent size={60} /></div>
            <div className="grid grid-cols-3 gap-3"><Medallion className="w-full" /><div className="hud grid place-items-center rounded-lg border border-white/10 p-4 text-xs text-cream/60">HUD frame</div><ArchFrame className="h-28 w-full" /></div>
            <Separator className="text-gold" />
          </div>
        </div>
        <div className="mt-6 overflow-hidden rounded-lg border border-white/10"><Skyline className="h-24 w-full" fill="#1b1530" /></div>
      </section>

      <section className="shell mt-14 grid gap-6 lg:grid-cols-2" aria-labelledby="motion">
        <div className="card p-6">
          <h2 id="motion" className="text-4xl text-cream">Motion grammar</h2>
          <ul className="mt-4 space-y-3">{motion.map(([k, v]) => <li key={k} className="text-sm"><span className="font-mono text-xs uppercase tracking-wider text-coral">{k} {"//"}</span> <span className="text-cream/75">{v}</span></li>)}</ul>
          <p className="mt-4 text-xs text-cream/65">prefers-reduced-motion and the member “Reduce motion” toggle collapse every animation to its end state.</p>
        </div>
        <div className="card p-6">
          <h2 className="text-4xl text-cream">Voice · microcopy</h2>
          <table className="mt-4 w-full text-sm">
            <thead><tr className="text-left font-mono text-[0.6rem] uppercase tracking-wider text-cream/65"><th className="pb-2">Instead of</th><th className="pb-2">Say</th><th className="pb-2">Tone</th></tr></thead>
            <tbody>{voice.map(([a, b, c]) => <tr key={a} className="border-t border-white/5"><td className="py-2 text-cream/65">{a}</td><td className="py-2 text-cream">{b}</td><td className="py-2 text-cream/60">{c}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
