import type { Metadata } from "next";
import Link from "next/link";
import { GeoStar } from "@/components/art";
import { ChapterHeader, Tag } from "@/components/ui";

export const metadata: Metadata = { title: "Shahadah Stories", description: "Stories told by their owners, with explicit consent — never counted or ranked." };

const principles = [
  ["Consent first", "A story appears only after its owner submits it and approves the final wording."],
  ["Never counted", "No conversion tallies, scoreboards or “souls” counters — a person is not a statistic."],
  ["Revocable", "Owners can remove their story at any time, and it disappears everywhere."],
  ["No pressure", "Reverts HQ never asks anyone to share. Privacy is the default."],
];

export default function StoriesPage() {
  return (
    <div className="pb-10">
      <ChapterHeader eyebrow="Shahadah Stories" title={<>Stories, <em className="text-amber">told by their owners.</em></>} arabic="أَشْهَدُ">
        This wall is intentionally empty in the concept. We will not invent testimonies, use real people&rsquo;s stories without consent, or turn faith into a number.
      </ChapterHeader>
      <div className="shell">
        <div className="flex flex-wrap gap-2"><Tag kind="planned">Planned · consent workflow</Tag><Tag kind="demo">No stories collected</Tag></div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map(([t, b], i) => (
            <li key={t} className="card p-6" style={{ borderTop: "3px solid #F7C65B" }}>
              <GeoStar n={[8, 10, 12, 8][i]} size={30} className="text-amber" />
              <h2 className="mt-3 text-3xl text-cream">{t}</h2>
              <p className="mt-1 text-sm text-cream/70">{b}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="grid aspect-video place-items-center rounded-xl border border-dashed border-amber/30 bg-amber/[0.03]">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber/60">Awaiting a consented story</span>
            </div>
          ))}
        </div>
        <div className="card mt-10 flex flex-col items-start gap-3 p-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-cream/75">New to Islam and looking for support rather than a stage?</p>
          <Link href="/reverts" className="btn btn-gold">Visit Reverts HQ</Link>
        </div>
      </div>
    </div>
  );
}
