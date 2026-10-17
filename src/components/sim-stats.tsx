"use client";

import { totalXp } from "@/lib/progression";
import { useDemo, useHydrated } from "@/lib/store";

export function SimStats() {
  const hydrated = useHydrated();
  const answers = useDemo((s) => s.dojo.answers);
  const completed = useDemo((s) => s.dojo.completed);
  const credits = useDemo((s) => totalXp(s.xp));
  const graded = Object.values(answers).filter((a) => a.correct !== undefined);
  const strong = graded.filter((a) => a.correct).length;
  const cells = [
    { v: hydrated ? graded.length : 0, l: "Steps", c: "text-cream" },
    { v: hydrated && graded.length ? `${Math.round((strong / graded.length) * 100)}%` : "—", l: "Strong", c: "text-teal" },
    { v: hydrated ? `◆ ${credits}` : "◆ 0", l: "Credits", c: "text-amber" },
  ];
  return (
    <div className="grid grid-cols-3 divide-x divide-white/10 rounded-lg border border-teal/40 bg-black/30">
      {cells.map((c) => (
        <div key={c.l} className="p-4 text-center">
          <p className={`font-display text-4xl leading-none ${c.c}`}>{c.v}</p>
          <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-cream/65">{c.l}</p>
        </div>
      ))}
      {hydrated && completed && <p className="col-span-3 border-t border-white/10 p-2 text-center text-xs text-teal">Oneness path complete ✦</p>}
    </div>
  );
}
