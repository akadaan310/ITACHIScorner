import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { NightAtlas } from "@/components/atlas";
import { ChapterHeader, Tag } from "@/components/ui";
import { atlasClusters, atlasNodes } from "@/lib/fixtures/atlas";

export const metadata: Metadata = { title: "Night Atlas", description: "Knowledge as stars: every star is a real destination — a passage, practice, episode or path." };

export default function AtlasPage() {
  return (
    <div data-world="atlas" className="pb-10">
      <ChapterHeader eyebrow="Knowledge · the Night Atlas" title={<>Every star is <em className="text-violet">somewhere to go.</em></>} arabic="أَطْلَسُ اللَّيْل">
        Constellations here are a navigation map — curated learning relationships between real pages. Not astrology, not divination: just a beautiful way to find your next question.
      </ChapterHeader>
      <div className="shell">
        <Suspense fallback={<div className="card aspect-[2/1] p-8 text-cream/70">Loading the sky…</div>}>
          <NightAtlas />
        </Suspense>
      </div>

      {/* Accessible list equivalent — also the no-JavaScript experience */}
      <section className="shell mt-16" aria-labelledby="star-list">
        <h2 id="star-list" className="text-4xl text-cream">Star list</h2>
        <p className="mt-1 text-sm text-cream/60">Every destination on the map, grouped by constellation.</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {atlasClusters.map((c) => (
            <div key={c.id} id={c.id} className="card scroll-mt-24 p-5" style={{ borderTop: `3px solid ${c.color}` }}>
              <h3 className="text-2xl" style={{ color: c.color }}>{c.name}</h3>
              <ul className="mt-3 space-y-2">
                {atlasNodes.filter((n) => n.cluster === c.id).map((n) => (
                  <li key={n.id} className="flex items-start justify-between gap-2 text-sm">
                    {n.status === "planned" ? (
                      <span className="text-cream/60">{n.label}</span>
                    ) : (
                      <Link href={n.href} className="text-cream underline-offset-2 hover:underline">{n.label}</Link>
                    )}
                    <span className="flex shrink-0 gap-1">
                      {n.status === "planned" && <Tag kind="planned">Planned</Tag>}
                      <Link href={`/atlas?star=${n.id}`} className="font-mono text-[0.6rem] uppercase text-cream/65 hover:text-cream" aria-label={`Show ${n.label} on the map`}>map</Link>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
