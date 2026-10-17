"use client";

import Link from "next/link";
import { ReasoningPath } from "@/components/dojo";
import { OrbitSuccess } from "@/components/afterglow/trivia";
import { Tag } from "@/components/ui";
import { dojoPath } from "@/lib/fixtures/dojo";
import { useDemo, useHydrated } from "@/lib/store";

export function DojoResult() {
  const hydrated = useHydrated();
  const dojo = useDemo((s) => s.dojo);
  const xp = useDemo((s) => s.xp.filter((e) => e.key.startsWith("dojo:")).reduce((a, e) => a + e.amount, 0));
  if (!hydrated) return <div className="card p-8 text-cream/70">Loading…</div>;
  const graded = dojoPath.steps.filter((s) => s.type !== "setup" && s.type !== "reflect");
  const strong = graded.filter((s) => dojo.answers[s.id]?.correct).length;
  const accuracy = graded.length ? strong / graded.length : 0;
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="card p-7 text-center">
        <div className="relative">
          <OrbitSuccess accuracy={accuracy} />
          <div className="absolute inset-0 grid place-items-center">
            <p className="font-display text-5xl text-cream">{strong}/{graded.length}</p>
          </div>
        </div>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-teal">Strong choices</p>
        <p className="mt-4 text-cream/75">{dojo.completed ? "Path complete. Checkpoint saved." : "Path in progress — finish the reflection to complete it."}</p>
        <p className="mt-1 text-sm text-cream/60">+{xp} credits from the Simulator (learning participation only)</p>
        {!dojo.completed && <Link href="/dojo/path" className="btn btn-accent mt-5">Continue the path</Link>}
      </div>
      <div className="card p-7">
        <div className="flex items-center gap-2"><h2 className="text-3xl text-cream">Your path of reasoning</h2><Tag kind="sample">Practice</Tag></div>
        <ReasoningPath current={dojoPath.steps.length - 1} done={new Set(Object.keys(dojo.answers))} />
        <ul className="mt-4 space-y-2">
          {dojoPath.steps.map((s) => (
            <li key={s.id} className="flex items-start gap-3 rounded-lg border border-white/10 p-3 text-sm">
              <span className={dojo.answers[s.id]?.correct ? "text-teal" : dojo.answers[s.id] ? "text-amber" : "text-cream/30"} aria-hidden="true">◆</span>
              <span className="flex-1 text-cream/85">
                {s.title}
                {dojo.answers[s.id]?.reasoning && <span className="mt-1 block text-xs italic text-cream/60">“{dojo.answers[s.id]!.reasoning}”</span>}
              </span>
              <span className="text-xs text-cream/65">{s.type === "setup" || s.type === "reflect" ? "—" : dojo.answers[s.id]?.correct ? "strong" : dojo.answers[s.id] ? "review" : "not yet"}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/atlas?star=why-one" className="btn btn-ghost">Next star on the Atlas</Link>
          <Link href="/me/quests" className="btn btn-ghost">My quests</Link>
        </div>
      </div>
    </div>
  );
}
