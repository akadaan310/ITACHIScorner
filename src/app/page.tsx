import Link from "next/link";
import { ArchFrame, GeoStar, StarField } from "@/components/art";
import { Hero } from "@/components/hero";
import { NextLiveCard, SampleChallenge } from "@/components/live-bits";
import { HexIcon, QuranPassage, SectionTitle, Tag } from "@/components/ui";
import { dialogueCatalog } from "@/lib/fixtures/content";
import { nextEvent } from "@/lib/fixtures/events";

const arsenal = [
  { title: "Afterglow", body: "Every live becomes a lasting map: moments, references, results, journal prompts.", href: "/afterglow", color: "#FA536D", glyph: "☾", cta: "Enter" },
  { title: "Knowledge", body: "The Night Atlas — topics as stars, each one a real page, passage or practice.", href: "/atlas", color: "#F7C65B", glyph: "✦", cta: "Explore" },
  { title: "Simulator", body: "Playable dialogue practice scored on clarity, fairness, evidence and listening.", href: "/dojo", color: "#26C4B3", glyph: "◎", cta: "Train" },
];

const acts = [
  { n: "I", title: "Before", body: "Countdown, a warm-up question, “I'll be there” — then off to the official channel.", href: "/afterglow/before", color: "#F7C65B" },
  { n: "II", title: "During", body: "Optional companion dock: First-30 trivia, question queue, bookmarks. The video stays on TikTok/YouTube.", href: "/afterglow/live", color: "#FA536D" },
  { n: "III", title: "After", body: "The Afterglow: moments, references, results and journal prompts.", href: "/afterglow/episodes/sample-episode-01", color: "#A58BE1" },
];

const personas = [
  { name: "Sami", role: "The curious friend", color: "#26C4B3", level: 1 },
  { name: "Dana", role: "The skeptic", color: "#FA536D", level: 3 },
  { name: "Yusuf", role: "Returning learner", color: "#F7C65B", level: 1 },
  { name: "Maya", role: "Comparative religion student", color: "#A58BE1", level: 2 },
];

const ranks = [
  { name: "Scout", status: "Free forever", body: "Every lesson, the Arsenal, the Simulator, Afterglow recaps, your star card.", cta: "Join free", href: "/join", featured: false },
  { name: "Supporter", status: "Concept preview", body: "Original lesson collections and event archives — learning stays free.", cta: "Preview", href: "/membership", featured: false },
  { name: "Champion", status: "Concept preview", body: "Collectible book editions and cosmetic flair, plus direct creator support.", cta: "Preview", href: "/membership", featured: true },
];

export default function Home() {
  const next = nextEvent()!;
  return (
    <>
      <Hero />

      {/* Your Dawah Arsenal */}
      <section className="relative py-20 sm:py-24" aria-labelledby="arsenal-title">
        <div className="shell">
          <SectionTitle eyebrow="Your Dawah Arsenal" title={<span id="arsenal-title">Three worlds. <em className="text-coral">One night sky.</em></span>}>
            A question can change the course of a night. These are the places where it keeps going.
          </SectionTitle>
          <ul className="grid gap-5 md:grid-cols-3">
            {arsenal.map((a) => (
              <li key={a.title}>
                <Link href={a.href} className="card card-hover group relative block h-full overflow-hidden p-7" style={{ borderTop: `3px solid ${a.color}` }}>
                  <div className="pointer-events-none absolute inset-0 pattern-mashrabiya opacity-0 transition-opacity duration-500 group-hover:opacity-30" />
                  <HexIcon color={a.color} glyph={a.glyph} />
                  <h3 className="mt-5 text-4xl text-cream">{a.title}</h3>
                  <p className="mt-2 text-cream/70">{a.body}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em]" style={{ color: a.color }}>
                    {a.cta} <span aria-hidden="true">⟶</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Live Tonight + three acts */}
      <section className="relative pb-20" aria-labelledby="live-title">
        <div className="shell grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <h2 id="live-title" className="sr-only">Live tonight</h2>
            <NextLiveCard event={next} />
          </div>
          <div className="card card-bar-coral flex flex-col p-6 sm:p-8">
            <p className="eyebrow">How Afterglow works</p>
            <h3 className="mt-3 text-4xl text-cream">Three acts, <em className="text-gold">one night.</em></h3>
            <ol className="mt-6 space-y-3">
              {acts.map((a) => (
                <li key={a.n}>
                  <Link href={a.href} className="group flex gap-4 rounded-lg p-2 hover:bg-white/[0.04]">
                    <span className="hex grid h-12 w-12 shrink-0 font-display text-xl text-[#16070b]" style={{ background: a.color }}>{a.n}</span>
                    <span>
                      <span className="block font-display text-2xl leading-none text-cream group-hover:text-coral">{a.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-cream/65">{a.body}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Recent battles — sample catalogue */}
      <section className="relative border-y border-white/[0.06] bg-[#0d0b14] py-20" aria-labelledby="battles-title">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle eyebrow="Search the Arsenal" title={<span id="battles-title">Recent battles <em className="text-teal">of ideas</em></span>}>
              Sample cards showing how sourced dialogues will be catalogued — every one links back to the original video once verified.
            </SectionTitle>
            <Link href="/watch" className="btn btn-ghost mb-8">Search the Arsenal ⟶</Link>
          </div>
          <ul className="scroll-x -mx-4 flex gap-4 px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
            {dialogueCatalog.slice(0, 4).map((d, i) => (
              <li key={d.id} className="w-[78%] shrink-0 sm:w-auto">
                <Link href="/watch" className="card card-hover group block h-full overflow-hidden">
                  <div className="relative aspect-video overflow-hidden" style={{ background: `linear-gradient(135deg, ${["#3a1426", "#13312f", "#2b1f4a", "#3d2a12"][i]}, #0d0b14)` }}>
                    <StarField seed={40 + i} count={26} width={320} height={180} className="absolute inset-0 h-full w-full" twinkle={false} />
                    <span className="absolute inset-0 m-auto grid h-12 w-12 place-items-center rounded-full border border-coral/60 bg-black/50 text-coral transition-transform group-hover:scale-110" aria-hidden="true">▶</span>
                    <span className="absolute left-3 top-3"><Tag kind="sample">Sample</Tag></span>
                    <span className="absolute bottom-2 right-3 font-mono text-[0.65rem] text-cream/70">{d.minutes} min</span>
                  </div>
                  <div className="p-4">
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-coral">{d.format} · {d.platform === "tiktok" ? "TikTok" : "YouTube"}</p>
                    <h3 className="mt-1 text-xl leading-tight text-cream">{d.title.replace("Sample entry · ", "")}</h3>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Today's discovery + gentle challenge */}
      <section className="relative overflow-hidden py-20" aria-labelledby="today-title">
        <StarField seed={23} count={80} height={600} className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />
        <div className="shell relative">
          <SectionTitle eyebrow="Today in the Observatory" title={<span id="today-title">Today&rsquo;s discovery &amp; <em className="text-teal">a 30-second challenge</em></span>}>
            One passage to sit with, one question to try. No sign-up, no streak to protect.
          </SectionTitle>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <QuranPassage id="3:190" />
              <p className="text-sm leading-relaxed text-cream/70">
                <span className="font-mono text-xs uppercase tracking-wider text-gold">Reflect //</span> When did the night sky last make you pause? What question did it leave you with?
              </p>
            </div>
            <SampleChallenge />
          </div>
        </div>
      </section>

      {/* Welcome home — Reverts HQ */}
      <section className="py-10" aria-labelledby="reverts-title">
        <div className="shell">
          <div data-world="sanctuary" className="relative overflow-hidden rounded-[1.25rem] px-6 py-12 sm:px-12 sm:py-16" style={{ background: "linear-gradient(135deg,#9a7ad6 0%,#b79be8 35%,#ece4fb 75%,#f6e2b8 100%)" }}>
            <ArchFrame className="pointer-events-none absolute -bottom-10 right-6 hidden h-80 opacity-50 sm:block" stroke="#ffffff" />
            <p className="eyebrow" style={{ color: "#2b2140" }}>Reverts HQ · you belong here</p>
            <h2 id="reverts-title" className="mt-3 max-w-2xl text-5xl leading-[0.9] sm:text-7xl" style={{ color: "#1f1733" }}>
              Welcome home, <em style={{ color: "#4f2f99" }}>new Muslim</em> <span aria-hidden="true">☾</span>
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed" style={{ color: "#3b2f55" }}>
              You took the bravest step. Now walk the next ones at your own pace — private notes, gentle journeys, no public rankings and no one asking for your story.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/reverts" className="btn btn-accent">Start your journey</Link>
              <Link href="/reverts/ask/q-silly" className="btn btn-ghost">No silly questions here</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dawah Simulator */}
      <section className="py-14" aria-labelledby="sim-title">
        <div className="shell">
          <div className="relative overflow-hidden rounded-[1.25rem] border border-teal/30 p-7 sm:p-12" data-world="dojo" style={{ background: "linear-gradient(135deg,#0b2a2b 0%,#0d1520 55%,#2a0f1c 100%)" }}>
            <div className="pointer-events-none absolute inset-0 pattern-mashrabiya opacity-20" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div>
                <p className="eyebrow">Dawah Simulator</p>
                <h2 id="sim-title" className="mt-3 text-6xl leading-[0.88] text-cream sm:text-7xl">Train.</h2>
                <p className="mt-3 max-w-md text-cream/75">
                  Practise the conversation before the conversation. Scored on clarity, fair representation, evidence and careful listening — never on “winning”.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/dojo/path" className="btn btn-accent">Start a path</Link>
                  <Link href="/dojo" className="btn btn-ghost">Open the Simulator</Link>
                </div>
              </div>
              <ul className="grid grid-cols-2 gap-3">
                {personas.map((p) => (
                  <li key={p.name}>
                    <Link href="/dojo/path" className="group block rounded-lg border border-white/10 bg-black/30 p-4 transition-colors hover:border-teal/60">
                      <span className="hex grid h-12 w-12 font-display text-2xl text-[#0b1a1a]" style={{ background: p.color }}>{p.name[0]}</span>
                      <span className="mt-3 block font-display text-2xl leading-none text-cream">{p.name}</span>
                      <span className="mt-1 block font-mono text-[0.6rem] uppercase tracking-[0.16em]" style={{ color: p.color }}>{p.role}</span>
                      <span className="mt-2 block text-xs text-cream/65">{"★".repeat(p.level)}{"☆".repeat(3 - p.level)} difficulty</span>
                    </Link>
                  </li>
                ))}
                <li className="col-span-2 text-xs text-cream/65">Fictional, simulated practice partners — not real people, and never a voice for Itachi.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Choose your rank */}
      <section className="py-20" aria-labelledby="rank-title">
        <div className="shell">
          <SectionTitle eyebrow="Membership" title={<span id="rank-title">Choose your rank</span>}>
            Learning is free, forever. Supporter and Champion are concept previews — no billing exists and no prices are set.
          </SectionTitle>
          <ul className="grid gap-5 md:grid-cols-3">
            {ranks.map((r) => (
              <li key={r.name} className={`card relative flex flex-col p-7 ${r.featured ? "border-amber/70 shadow-[0_0_0_1px_rgba(247,198,91,0.4),0_30px_60px_-30px_rgba(247,198,91,0.5)]" : ""}`}>
                {r.featured && <span className="absolute -top-3 right-5 rounded bg-amber px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-[#1a1206]">★ Champion</span>}
                <h3 className="text-4xl text-cream">{r.name}</h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.16em] text-coral">{r.status}</p>
                <p className="mt-4 flex-1 text-cream/70">{r.body}</p>
                <Link href={r.href} className={`btn mt-6 ${r.name === "Scout" ? "btn-primary" : "btn-ghost"}`}>{r.cta}</Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-cream/65">No pay-to-win, no paywalled Qur&rsquo;an, no loot boxes. Levels reflect app participation only — never faith or piety.</p>
        </div>
      </section>

      {/* Shahadah stories — consent only */}
      <section className="pb-10" aria-labelledby="stories-title">
        <div className="shell">
          <div className="card grid gap-6 overflow-hidden p-7 sm:p-10 lg:grid-cols-[1fr_1.2fr] lg:items-center" style={{ borderTop: "3px solid #F7C65B" }}>
            <div>
              <p className="eyebrow">Shahadah Stories</p>
              <h2 id="stories-title" className="mt-3 text-5xl leading-[0.9] text-cream">Stories, <em className="text-amber">told by their owners.</em></h2>
              <p className="mt-3 text-cream/70">
                This wall will only ever hold stories shared with explicit consent — never counted, ranked or turned into a scoreboard. Until then it stays honestly empty.
              </p>
              <Link href="/stories" className="btn btn-gold mt-6">Visit Shahadah Stories</Link>
            </div>
            <div className="grid grid-cols-2 gap-3" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="grid aspect-[4/3] place-items-center rounded-lg border border-dashed border-amber/30 bg-amber/[0.03]">
                  <GeoStar n={[8, 10, 12, 8][i]} size={34} className="text-amber/50" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
