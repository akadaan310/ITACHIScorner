"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { starPath } from "@/components/art";
import { QuranPassage, Tag } from "@/components/ui";
import { dojoFeedbackLabels, dojoPath, type ChoiceOption, type DojoStep, type Feedback } from "@/lib/fixtures/dojo";
import { useDemo, useHydrated } from "@/lib/store";

const steps = dojoPath.steps;

function FeedbackBars({ fb }: { fb: Feedback }) {
  return (
    <dl className="mt-3 grid gap-2 sm:grid-cols-2">
      {(Object.keys(dojoFeedbackLabels) as (keyof Feedback)[]).map((k) => (
        <div key={k}>
          <dt className="flex justify-between font-mono text-[0.62rem] uppercase tracking-[0.14em] text-cream/60">
            {dojoFeedbackLabels[k]} <span>{fb[k]}/3</span>
          </dt>
          <dd className="mt-1 flex gap-1" aria-label={`${fb[k]} of 3`}>
            {[0, 1, 2].map((i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-full ${i < fb[k] ? "bg-teal" : "bg-white/10"}`} />
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** The illustrated "path of reasoning": one star per step, lit as you go. */
export function ReasoningPath({ current, done }: { current: number; done: Set<string> }) {
  const W = 640;
  return (
    <svg viewBox={`0 0 ${W} 120`} className="w-full" role="img" aria-label={`Path of reasoning: step ${current + 1} of ${steps.length}`}>
      <path d={`M40 60 ${steps.map((_, i) => `L${40 + (i * (W - 80)) / (steps.length - 1)} ${60 + (i % 2 ? -22 : 22)}`).join(" ")}`} fill="none" stroke="#26C4B3" strokeOpacity="0.35" strokeDasharray="4 6" />
      {steps.map((s, i) => {
        const x = 40 + (i * (W - 80)) / (steps.length - 1);
        const y = 60 + (i % 2 ? -22 : 22);
        const lit = done.has(s.id);
        const here = i === current;
        return (
          <g key={s.id}>
            {here && <circle cx={x} cy={y} r="20" fill="#26C4B3" opacity="0.18" />}
            <path d={starPath(4, lit || here ? 12 : 7, 3, x, y)} fill={lit ? "#26C4B3" : here ? "#F7C65B" : "#5a5470"} />
            <text x={x} y={y + (i % 2 ? -22 : 34)} textAnchor="middle" fontSize="11" fill="#F6EBDC" fillOpacity={here ? 0.95 : 0.55} fontFamily="JetBrains Mono, monospace">
              {String(i + 1).padStart(2, "0")}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ChoiceStep({ step, onDone }: { step: Extract<DojoStep, { type: "next-question" }>; onDone: () => void }) {
  const saved = useDemo((s) => s.dojo.answers[step.id]);
  const answer = useDemo((s) => s.dojoAnswer);
  const [choice, setChoice] = useState<string | null>(saved?.choice ?? null);
  const [reasoning, setReasoning] = useState(saved?.reasoning ?? "");
  const submitted = !!saved?.choice;
  const picked: ChoiceOption | undefined = step.options.find((o) => o.id === (saved?.choice ?? choice));
  const best = step.options.find((o) => o.best)!;
  return (
    <div>
      <p className="rounded-lg border border-white/10 bg-black/25 p-4 text-cream/80">{step.context}</p>
      <form
        className="mt-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!choice) return;
          answer(step.id, { choice, reasoning: reasoning.trim(), correct: !!step.options.find((o) => o.id === choice)?.best });
        }}
      >
        <fieldset disabled={submitted}>
          <legend className="font-display text-3xl leading-tight text-cream">{step.prompt}</legend>
          <div className="mt-4 grid gap-2">
            {step.options.map((o) => (
              <label key={o.id} className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border p-4 text-cream has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber ${submitted && o.best ? "border-teal bg-teal/10" : (saved?.choice ?? choice) === o.id ? "border-amber bg-amber/10" : "border-white/10 bg-black/20 hover:border-white/30"}`}>
                <input type="radio" name={step.id} className="mt-1 h-4 w-4 accent-[#26C4B3]" checked={(saved?.choice ?? choice) === o.id} onChange={() => setChoice(o.id)} />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
          {step.askReason && (
            <div className="mt-4">
              <label htmlFor={`${step.id}-why`} className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-teal">{"// "}Why this one? (optional, private)</label>
              <textarea id={`${step.id}-why`} className="field mt-2 min-h-20" value={reasoning} onChange={(e) => setReasoning(e.target.value)} placeholder="One sentence on your reasoning…" />
            </div>
          )}
        </fieldset>
        {!submitted && (
          <button type="submit" className="btn btn-accent mt-4" disabled={!choice} data-testid="dojo-submit">Check my choice</button>
        )}
      </form>
      {submitted && picked && (
        <div className="rise mt-5 space-y-3" role="status">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="font-semibold text-cream">{picked.best ? "Strong choice ✦" : "Worth another look"}</p>
            <p className="mt-1 text-sm text-cream/75">{picked.note}</p>
            <FeedbackBars fb={picked.feedback} />
          </div>
          {!picked.best && (
            <div className="rounded-lg border border-teal/30 bg-teal/5 p-4">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-teal">{"// "}A stronger option</p>
              <p className="mt-1 text-cream">{best.label}</p>
              <p className="mt-1 text-sm text-cream/70">{best.note}</p>
            </div>
          )}
          <button type="button" className="btn btn-accent" onClick={onDone} data-testid="dojo-next">Continue ⟶</button>
        </div>
      )}
    </div>
  );
}

function AssumptionStep({ step, onDone }: { step: Extract<DojoStep, { type: "assumption" }>; onDone: () => void }) {
  const saved = useDemo((s) => s.dojo.answers[step.id]);
  const answer = useDemo((s) => s.dojoAnswer);
  const picked = saved?.choice;
  return (
    <div>
      <p className="font-display text-3xl leading-tight text-cream">{step.prompt}</p>
      <ol className="mt-5 space-y-2">
        {step.statement.map((st, i) => {
          const isPicked = picked === st.id;
          return (
            <li key={st.id}>
              <button
                type="button"
                disabled={!!picked}
                aria-pressed={isPicked}
                onClick={() => answer(step.id, { choice: st.id, correct: !!st.hidden })}
                className={`flex min-h-12 w-full items-center gap-3 rounded-lg border p-4 text-left text-cream ${picked && st.hidden ? "border-teal bg-teal/10" : isPicked ? "border-ruby bg-ruby/10" : "border-white/10 bg-black/20 hover:border-teal/50"}`}
              >
                <span className="font-mono text-xs text-cream/65">P{i + 1}</span> {st.text}
                {picked && st.hidden && <span className="ml-auto text-xs font-semibold text-teal">Hidden assumption</span>}
              </button>
            </li>
          );
        })}
      </ol>
      {picked && (
        <div className="rise mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-4" role="status">
          <p className="font-semibold text-cream">{saved?.correct ? "You found it ✦" : "Close — look at what has to be true for the conclusion to follow."}</p>
          <p className="mt-1 text-sm text-cream/75">{step.explanation}</p>
          <button type="button" className="btn btn-accent mt-4" onClick={onDone} data-testid="dojo-next">Continue ⟶</button>
        </div>
      )}
    </div>
  );
}

function MatchStep({ step, onDone }: { step: Extract<DojoStep, { type: "match" }>; onDone: () => void }) {
  const saved = useDemo((s) => s.dojo.answers[step.id]);
  const answer = useDemo((s) => s.dojoAnswer);
  const [map, setMap] = useState<Record<string, string>>(() => (saved?.choice ? JSON.parse(saved.choice) : {}));
  const checked = !!saved?.choice;
  const allSet = step.claims.every((c) => map[c.id]);
  const [openRef, setOpenRef] = useState<string | null>(null);
  return (
    <div>
      <p className="font-display text-3xl leading-tight text-cream">{step.prompt}</p>
      <ul className="mt-5 space-y-3">
        {step.claims.map((c) => {
          const ok = checked && map[c.id] === c.evidenceId;
          return (
            <li key={c.id} className={`rounded-lg border p-4 ${checked ? (ok ? "border-teal bg-teal/5" : "border-ruby bg-ruby/5") : "border-white/10 bg-black/20"}`}>
              <label htmlFor={`m-${c.id}`} className="block text-cream">{c.text}</label>
              <select id={`m-${c.id}`} className="field mt-2" value={map[c.id] ?? ""} disabled={checked} onChange={(e) => setMap({ ...map, [c.id]: e.target.value })}>
                <option value="">Choose a passage…</option>
                {step.evidence.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.text}</option>
                ))}
              </select>
              {checked && !ok && <p className="mt-2 text-sm text-cream/75">Best match: {step.evidence.find((e) => e.id === c.evidenceId)?.text}</p>}
            </li>
          );
        })}
      </ul>
      {!checked ? (
        <button type="button" className="btn btn-accent mt-4" disabled={!allSet} data-testid="dojo-submit" onClick={() => answer(step.id, { choice: JSON.stringify(map), correct: step.claims.every((c) => map[c.id] === c.evidenceId) })}>
          Check matches
        </button>
      ) : (
        <div className="rise mt-5 space-y-3" role="status">
          <p className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm text-cream/80">{step.explanation}</p>
          <div className="flex flex-wrap gap-2">
            {step.evidence.map((ev) => ev.refId && (
              <button key={ev.id} type="button" className="chip min-h-9" aria-expanded={openRef === ev.refId} onClick={() => setOpenRef(openRef === ev.refId ? null : ev.refId!)}>
                Read {ev.text.split(" — ")[0]}
              </button>
            ))}
          </div>
          {openRef && <QuranPassage id={openRef} compact />}
          <button type="button" className="btn btn-accent" onClick={onDone} data-testid="dojo-next">Continue ⟶</button>
        </div>
      )}
    </div>
  );
}

function ReflectStep({ step }: { step: Extract<DojoStep, { type: "reflect" }> }) {
  const addJournal = useDemo((s) => s.addJournal);
  const complete = useDemo((s) => s.dojoComplete);
  const completed = useDemo((s) => s.dojo.completed);
  const [text, setText] = useState("");
  if (completed) {
    return (
      <div className="rise text-center" role="status">
        <p className="font-display text-5xl text-cream">Path complete ✦</p>
        <p className="mt-2 text-cream/70">Checkpoint saved. Your reflection is in your private journal.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/dojo/result" className="btn btn-accent" data-testid="dojo-result-link">See your learning result</Link>
          <Link href="/me/journal" className="btn btn-ghost">Open journal</Link>
        </div>
      </div>
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addJournal({ title: "Simulator · Why One? checkpoint", body: text.trim() || "(No reflection written)", prompt: step.prompt });
        complete();
      }}
    >
      <label htmlFor="reflect" className="font-display text-3xl leading-tight text-cream">{step.prompt}</label>
      <textarea id="reflect" className="field mt-4 min-h-28" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write freely — this stays on your device." />
      <details className="mt-3 text-sm text-cream/70">
        <summary className="cursor-pointer text-teal">Need a nudge?</summary>
        <p className="mt-2">{step.suggestion}</p>
      </details>
      <button type="submit" className="btn btn-accent mt-4" data-testid="dojo-finish">Save checkpoint &amp; finish</button>
    </form>
  );
}

export function DojoPathRunner() {
  const hydrated = useHydrated();
  const params = useSearchParams();
  const stored = useDemo((s) => s.dojo);
  const go = useDemo((s) => s.dojoGo);
  const reset = useDemo((s) => s.dojoReset);
  const requested = Number(params.get("step"));
  const [override, setOverride] = useState<number | null>(Number.isFinite(requested) && requested >= 1 && requested <= steps.length ? requested - 1 : null);
  if (!hydrated) return <div className="card p-8 text-cream/70">Loading your path…</div>;

  const current = override ?? stored.step;
  const step = steps[current]!;
  const done = new Set(Object.keys(stored.answers));
  const goTo = (i: number) => {
    setOverride(null);
    go(Math.max(0, Math.min(steps.length - 1, i)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <section className="card card-bar p-6 sm:p-8" aria-labelledby="step-title" data-testid="dojo-step">
        <div className="flex flex-wrap items-center gap-2">
          <p className="eyebrow">Step {current + 1} of {steps.length}</p>
          <Tag kind="sample">Illustrative practice dialogue</Tag>
        </div>
        <h2 id="step-title" className="mt-2 text-4xl text-cream">{step.title}</h2>
        <div className="mt-5">
          {step.type === "setup" && (
            <div>
              <ul className="space-y-3">
                {step.lines.map((l, i) => (
                  <li key={i} className={`flex ${l.who === "Noor" ? "justify-end" : ""}`}>
                    <div className={`max-w-[85%] rounded-xl px-4 py-3 ${l.who === "Noor" ? "rounded-br-sm bg-teal/15 text-cream" : "rounded-bl-sm bg-white/[0.06] text-cream/90"}`}>
                      <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-cream/65">{l.who} · simulated</p>
                      <p className="mt-1">{l.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-cream/65">{step.note}</p>
              <button type="button" className="btn btn-accent mt-5" onClick={() => goTo(current + 1)} data-testid="dojo-next">Begin ⟶</button>
            </div>
          )}
          {step.type === "next-question" && <ChoiceStep key={step.id} step={step} onDone={() => goTo(current + 1)} />}
          {step.type === "assumption" && <AssumptionStep step={step} onDone={() => goTo(current + 1)} />}
          {step.type === "match" && <MatchStep step={step} onDone={() => goTo(current + 1)} />}
          {step.type === "reflect" && <ReflectStep step={step} />}
        </div>
      </section>
      <aside className="space-y-4">
        <div className="card p-5">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-teal">{"// "}Path of reasoning</p>
          <ReasoningPath current={current} done={done} />
          <ol className="mt-2 space-y-1">
            {steps.map((s, i) => (
              <li key={s.id}>
                <button type="button" onClick={() => goTo(i)} className={`flex min-h-10 w-full items-center gap-2 rounded-md px-2 text-left text-sm ${i === current ? "bg-teal/10 text-cream" : "text-cream/65 hover:text-cream"}`} aria-current={i === current ? "step" : undefined}>
                  <span className={done.has(s.id) ? "text-teal" : "text-cream/30"}>{done.has(s.id) ? "◆" : "◇"}</span> {s.title}
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="card p-5 text-sm text-cream/70">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-teal">{"// "}Go deeper</p>
          <ul className="mt-2 space-y-1">
            <li><Link className="underline" href="/afterglow/episodes/sample-episode-01">Source: sample Afterglow episode</Link></li>
            <li><Link className="underline" href="/atlas?star=ikhlas">Qur&rsquo;an reference: Al-Ikhlāṣ</Link></li>
            <li><Link className="underline" href="/atlas?star=assumption">Adjacent topic: Hidden assumptions</Link></li>
          </ul>
          <button type="button" className="btn btn-ghost mt-4 w-full !min-h-10" onClick={() => { reset(); setOverride(null); }}>Reset this path</button>
        </div>
      </aside>
    </div>
  );
}
