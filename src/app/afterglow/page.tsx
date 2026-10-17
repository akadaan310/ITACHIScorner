import type { Metadata } from "next";
import Link from "next/link";
import { ArchFrame, Crescent, GeoStar, StarField, starPath } from "@/components/art";
import { ChapterHeader, SectionTitle, Tag, WatchButtons } from "@/components/ui";
import { completedEvents, liveEvent, nextEvent } from "@/lib/fixtures/events";

export const metadata: Metadata = { title: "Afterglow — after the live", description: "Turn a fast-moving live into a lasting adventure: before, during and after." };

const acts = [
  {
    n: "I",
    name: "Before",
    title: "The anticipation lounge",
    body: "Schedule cards that say whether they're verified, a countdown, a gentle reminder, “I'll be there”, a warm-up poll and trivia.",
    href: "/afterglow/before",
    color: "#F7C65B",
    cta: "Open the lounge",
  },
  {
    n: "II",
    name: "During",
    title: "The companion dock",
    body: "Watch on TikTok or YouTube. If you like, keep this dock beside it: the First-30 challenge, a question queue, bookmarks and discussion.",
    href: "/afterglow/live",
    color: "#FA536D",
    cta: "Try the demo live",
  },
  {
    n: "III",
    name: "After",
    title: "The Afterglow",
    body: "An illustrated episode constellation: moments, references, results with explanations, journal prompts and newly unlocked challenges.",
    href: "/afterglow/episodes/sample-episode-01",
    color: "#A58BE1",
    cta: "Open a recap",
  },
];

export default function AfterglowPage() {
  const next = nextEvent()!;
  const live = liveEvent()!;
  const eps = completedEvents();
  return (
    <div data-world="afterglow">
      <ChapterHeader
        eyebrow="The signature experience"
        title={<>After the live, <em className="text-coral">the Afterglow.</em></>}
        arabic="وَهَجُ مَا بَعْدَ البَثّ"
        aside={
          <div className="card p-6">
            <p className="text-sm text-cream/70">Lives stream only on the official channels. Afterglow is the before, alongside and after.</p>
            <div className="mt-4"><WatchButtons /></div>
          </div>
        }
      >
        A live moves fast. The Afterglow keeps it: every question worth saving, every verse mentioned, every thought you had at 1am —
        gathered into a beautiful map you can return to.
      </ChapterHeader>

      {/* Three acts */}
      <section className="shell py-10" aria-label="Three acts">
        <ol className="grid gap-5 lg:grid-cols-3">
          {acts.map((a, i) => (
            <li key={a.n} className={`rise rise-${i + 1}`}>
              <Link href={a.href} className="card card-hover group relative flex h-full flex-col overflow-hidden p-7">
                <ArchFrame className="pointer-events-none absolute -right-6 -top-4 h-56 opacity-25 transition-transform duration-700 group-hover:scale-105" stroke={a.color} />
                <span className="font-display text-6xl italic" style={{ color: a.color }}>{a.n}</span>
                <span className="mt-2 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: a.color }}>{a.name} the live</span>
                <span className="mt-3 block font-display text-3xl text-cream">{a.title}</span>
                <span className="mt-3 block flex-1 text-cream/70">{a.body}</span>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold" style={{ color: a.color }}>{a.cta} <span aria-hidden="true">→</span></span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Now / next */}
      <section className="shell grid gap-5 py-10 md:grid-cols-2" aria-label="Now and next">
        <Link href="/afterglow/live" className="card card-hover relative overflow-hidden p-7">
          <StarField seed={3} count={40} width={600} height={300} className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />
          <div className="relative">
            <div className="flex gap-2"><Tag kind="simulated">Simulated live</Tag><Tag kind="demo">Demo</Tag></div>
            <h2 className="mt-3 font-display text-3xl text-cream">{live.title}</h2>
            <p className="mt-2 text-cream/70">A fictional scenario so you can try the First-30 challenge right now.</p>
            <span className="mt-5 inline-flex font-semibold text-coral">Open the companion dock →</span>
          </div>
        </Link>
        <Link href="/afterglow/before" className="card card-hover relative overflow-hidden p-7">
          <Crescent size={120} className="pointer-events-none absolute -right-4 -top-4 opacity-60" />
          <div className="relative">
            <Tag kind="sample">Sample schedule</Tag>
            <h2 className="mt-3 font-display text-3xl text-cream">{next.title}</h2>
            <p className="mt-2 text-cream/70">See how an upcoming live is announced — with honesty about what&rsquo;s confirmed.</p>
            <span className="mt-5 inline-flex font-semibold text-amber">Visit the lounge →</span>
          </div>
        </Link>
      </section>

      {/* Episodes */}
      <section className="shell py-14" aria-labelledby="eps">
        <SectionTitle eyebrow="Recent Afterglows" title={<span id="eps">Episodes to revisit</span>}>
          Sample recaps showing the full after-live artifact. <Link href="/afterglow/vault" className="text-coral underline">Open the vault calendar</Link>.
        </SectionTitle>
        <ul className="grid gap-5 md:grid-cols-2">
          {eps.map((e) => (
            <li key={e.id}>
              <Link href={`/afterglow/episodes/${e.id}`} className="card card-hover group block overflow-hidden">
                <div className="relative h-44 overflow-hidden" style={{ background: `radial-gradient(circle at 70% 40%, ${e.palette[0]}55, transparent 60%), linear-gradient(135deg,#141025,#21183C)` }}>
                  <svg viewBox="0 0 400 180" className="absolute inset-0 h-full w-full" aria-hidden="true">
                    {e.recap!.moments.map((m, i) => {
                      const x = 50 + i * (300 / Math.max(1, e.recap!.moments.length - 1));
                      const y = 90 + Math.sin(i * 1.7) * 45;
                      return <path key={m.id} d={starPath(4, 9, 2.5, x, y)} fill={e.palette[i % 2]} />;
                    })}
                    <polyline
                      points={e.recap!.moments.map((_, i) => `${50 + i * (300 / Math.max(1, e.recap!.moments.length - 1))},${90 + Math.sin(i * 1.7) * 45}`).join(" ")}
                      fill="none"
                      stroke="#F6EBDC"
                      strokeOpacity="0.35"
                      strokeDasharray="3 5"
                    />
                  </svg>
                  <div className="absolute left-4 top-4"><Tag kind="sample">{e.kicker}</Tag></div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl text-cream group-hover:underline">{e.title}</h3>
                  <p className="mt-2 text-sm text-cream/70">{e.recap!.summary}</p>
                  <p className="mt-3 text-xs text-cream/65">{e.recap!.moments.length} moments · {e.recap!.journalPrompts.length} journal prompts</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Truthful streaks */}
      <section className="shell py-10" aria-labelledby="truth">
        <div className="card grid gap-8 p-7 md:grid-cols-[1fr_1.4fr] md:p-10">
          <div>
            <GeoStar n={8} size={40} className="text-coral" />
            <h2 id="truth" className="mt-3 font-display text-3xl text-cream">Streaks that tell the truth</h2>
            <p className="mt-3 text-cream/70">
              We never claim you attended something we can&rsquo;t know about. Every count says where it came from.
            </p>
            <Link href="/afterglow/gallery" className="btn btn-ghost mt-5">See every Afterglow state</Link>
          </div>
          <ul className="grid gap-3">
            <li className="rounded-2xl border border-teal/30 bg-teal/5 p-4">
              <Tag kind="verified">In-app check-in</Tag>
              <p className="mt-2 text-sm text-cream/80">You pressed “I&rsquo;m here” in this app during a live. The app can verify its own button. This powers the Corner streak.</p>
            </li>
            <li className="rounded-2xl border border-sand/30 bg-sand/5 p-4">
              <Tag kind="self-entered">Self-reported</Tag>
              <p className="mt-2 text-sm text-cream/80">“I watched on TikTok/YouTube.” Your word, always labelled as such, and never upgraded to verified.</p>
            </li>
            <li className="rounded-2xl border border-white/10 p-4">
              <Tag kind="unavailable">Platform-verified · not connected</Tag>
              <p className="mt-2 text-sm text-cream/80">Only possible with an approved, authorised integration and your consent. None exists today, so this stays at zero.</p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
