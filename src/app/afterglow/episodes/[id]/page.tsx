import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JournalPrompts, MomentList, ParticipationCompare, RecapCard } from "@/components/afterglow/recap";
import { StarField, starPath } from "@/components/art";
import { PlatformIcon, Tag } from "@/components/ui";
import { creator } from "@/lib/config/creator";
import { getNode } from "@/lib/fixtures/atlas";
import { completedEvents, getEvent } from "@/lib/fixtures/events";

export function generateStaticParams() {
  return completedEvents().map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const e = getEvent(id);
  return { title: e ? `Afterglow · ${e.title}` : "Afterglow", description: e?.recap?.summary };
}

const unlockCopy: Record<string, { label: string; href: string }> = {
  "dojo-path-oneness": { label: "Simulator path · Why One?", href: "/dojo/path" },
  "atlas-oneness": { label: "Night Atlas · The Oneness cluster", href: "/atlas" },
  "dojo-assumption": { label: "Simulator drill · Hidden assumptions", href: "/dojo/path?step=3" },
};

export default async function EpisodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEvent(id);
  if (!event || !event.recap) notFound();
  const recap = event.recap;
  const eps = completedEvents();
  const previous = eps[eps.findIndex((e) => e.id === id) + 1];
  const [c1, c2] = event.palette;
  const W = 900;
  const H = 300;
  const stars = recap.moments.map((m, i) => ({
    m,
    x: 80 + (i * (W - 160)) / Math.max(1, recap.moments.length - 1),
    y: 150 + Math.sin(i * 1.9 + 0.4) * 80,
  }));

  return (
    <div data-world="afterglow" className="pb-10">
      {/* Episode constellation header */}
      <header className="relative overflow-hidden border-b border-white/10" style={{ background: `radial-gradient(ellipse at 75% 30%, ${c1}40, transparent 55%), linear-gradient(180deg,#0b0a14,#1a1230)` }}>
        <StarField seed={id.length * 7} count={110} height={500} className="pointer-events-none absolute inset-0 h-full w-full" />
        <div className="shell relative pt-8">
          <nav aria-label="Breadcrumb" className="font-mono text-xs uppercase tracking-wider text-cream/60">
            <Link href="/afterglow" className="hover:text-cream">Afterglow</Link> <span aria-hidden="true">{"//"}</span>{" "}
            <Link href="/afterglow/vault" className="hover:text-cream">Vault</Link> <span aria-hidden="true">{"//"}</span> <span className="text-cream">{event.kicker}</span>
          </nav>
          <div className="mt-6 flex flex-wrap gap-2">
            <Tag kind="sample">{event.kicker}</Tag>
            <Tag kind="demo">Not a real broadcast</Tag>
          </div>
          <h1 className="portal-enter mt-4 max-w-4xl text-5xl leading-[0.9] text-cream sm:text-7xl">{event.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-cream/75">{recap.summary}</p>
          <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 w-full" role="group" aria-label={`Episode constellation with ${recap.moments.length} moments`}>
            <polyline points={stars.map((s) => `${s.x},${s.y}`).join(" ")} fill="none" stroke={c2} strokeOpacity="0.5" strokeDasharray="4 7" />
            {stars.map((s, i) => (
              <a key={s.m.id} href={`#${s.m.id}`} aria-label={`Moment ${i + 1}: ${s.m.label}`}>
                <circle cx={s.x} cy={s.y} r="26" fill={i % 2 ? c2 : c1} opacity="0.14" />
                <path d={starPath(4, 14, 4, s.x, s.y)} fill={i % 2 ? c2 : c1} />
                <text x={s.x} y={s.y + 46} textAnchor="middle" fill="#F6EBDC" fillOpacity="0.8" fontSize="14" fontFamily="JetBrains Mono, monospace">
                  {String(i + 1).padStart(2, "0")}
                </text>
              </a>
            ))}
          </svg>
          <div className="flex flex-wrap items-center gap-3 pb-8">
            {recap.replay.status === "public" && recap.replay.url ? (
              <a href={recap.replay.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <PlatformIcon platform={recap.replay.platform} /> Watch the replay ↗
              </a>
            ) : (
              <a href={recap.replay.platform === "youtube" ? creator.links.youtube : creator.links.tiktok} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <PlatformIcon platform={recap.replay.platform} /> Visit the official channel ↗
              </a>
            )}
            <span className="text-xs text-cream/60">
              {recap.replay.status === "sample" ? "Sample episode — no replay exists. Real recaps link the original video when it's public." : "Replay not publicly available."}
            </span>
          </div>
        </div>
      </header>

      <div className="shell mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="moments">
          <h2 id="moments" className="text-4xl text-cream">Moments <em className="text-coral">&amp; highlights</em></h2>
          <p className="mb-6 mt-2 text-sm text-cream/60">Timestamps appear only when sourced from a public replay. These are sample moments.</p>
          <MomentList event={event} />
        </section>
        <aside className="space-y-6">
          <RecapCard event={event} />
          <div className="card p-6">
            <h3 className="text-2xl text-cream">Trivia results</h3>
            <p className="mt-1 text-sm text-cream/65">Answer explanations live with your attempt from the companion dock.</p>
            <Link href="/afterglow/live" className="btn btn-ghost mt-4">Open the First-30 results</Link>
          </div>
          <div className="card p-6">
            <h3 className="text-2xl text-cream">Newly unlocked</h3>
            <ul className="mt-3 space-y-2">
              {recap.unlocked.map((u) => (
                <li key={u}>
                  <Link href={unlockCopy[u]?.href ?? "/discover"} className="flex min-h-11 items-center gap-3 rounded-lg border border-white/10 px-3 text-sm text-cream hover:border-coral/60">
                    <span className="text-amber" aria-hidden="true">◆</span> {unlockCopy[u]?.label ?? u}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="text-2xl text-cream">On the Night Atlas</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {recap.atlasNodes.map((n) => {
                const node = getNode(n);
                return node ? (
                  <Link key={n} href={`/atlas?star=${n}`} className="chip min-h-9 hover:text-cream">✦ {node.label}</Link>
                ) : null;
              })}
            </div>
          </div>
        </aside>
      </div>

      <div className="shell mt-10 grid gap-6 lg:grid-cols-2">
        <JournalPrompts event={event} />
        <ParticipationCompare event={event} previousId={previous?.id} />
      </div>
    </div>
  );
}
