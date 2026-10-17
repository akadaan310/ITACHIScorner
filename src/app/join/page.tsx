import type { Metadata } from "next";
import Link from "next/link";
import { ArchFrame, Mark, StarField } from "@/components/art";
import { LEVEL_DISCLAIMER } from "@/lib/progression";

export const metadata: Metadata = { title: "Join the Ranks", description: "A celestial invitation. Free forever — membership never gates learning." };

const perks = [
  ["Your Explorer's Star Card", "A unique constellation that grows with your learning."],
  ["Progress that's kept", "Quests, badges, saved moments and your journal — across visits."],
  ["Truthful streaks", "In-app check-ins and self-reports, each labelled for what it is."],
  ["Privacy controls", "Mute rankings, hide achievements, export or delete anytime."],
];

export default function JoinPage() {
  return (
    <div className="relative overflow-hidden pb-16">
      <StarField seed={5} count={140} height={900} className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />
      <div className="shell relative grid gap-12 pt-14 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div className="portal-enter">
          <p className="eyebrow">Join the ranks</p>
          <h1 className="mt-4 text-7xl leading-[0.85] text-cream sm:text-8xl">An invitation <em className="text-gold">under the stars.</em></h1>
          <p className="mt-5 max-w-lg text-lg text-cream/75">Free forever. Browse everything without an account — join only to keep your progress, your star card and your journal.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/onboarding" className="btn btn-primary min-h-[3.25rem] px-7" data-testid="begin-onboarding">Open your Star Card</Link>
            <Link href="/membership" className="btn btn-ghost min-h-[3.25rem] px-7">Choose your rank</Link>
          </div>
          <p className="mt-4 text-xs text-cream/65">{LEVEL_DISCLAIMER}</p>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <div className="hud card relative overflow-hidden p-8 text-center" style={{ background: "linear-gradient(160deg,#21183c,#0b0a14 60%,#3a1426)" }}>
            <ArchFrame className="pointer-events-none absolute inset-x-0 -top-4 mx-auto h-[115%] opacity-30" stroke="#D7AD65" />
            <div className="relative">
              <Mark size={64} title="" />
              <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.3em] text-coral">You are invited</p>
              <p className="mt-2 font-display text-5xl leading-none text-cream">Itachi&rsquo;s Corner</p>
              <p lang="ar" className="ar mt-1 text-2xl text-amber">كُلُّ سُؤَالٍ يَفْتَحُ سَمَاءً جَدِيدَةً</p>
              <ul className="mt-6 space-y-3 text-left">
                {perks.map(([t, b]) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-1 text-amber" aria-hidden="true">◆</span>
                    <span><span className="block font-semibold text-cream">{t}</span><span className="text-sm text-cream/65">{b}</span></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
