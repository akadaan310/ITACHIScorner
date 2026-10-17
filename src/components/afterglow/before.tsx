"use client";

import { starPath } from "@/components/art";
import { Tag } from "@/components/ui";
import { useDemo, useHydrated } from "@/lib/store";

const poll = {
  id: "poll-next-live",
  q: "What would you most like explored next time?",
  options: [
    { id: "a", label: "How to explain Oneness simply" },
    { id: "b", label: "Questions from new Muslims" },
    { id: "c", label: "How to disagree kindly" },
  ],
};

/** Personal anticipation constellation: lights up as you prepare. */
export function BeforeLounge({ eventId }: { eventId: string }) {
  const hydrated = useHydrated();
  const reminders = useDemo((s) => s.reminders);
  const checkIns = useDemo((s) => s.checkIns);
  const polls = useDemo((s) => s.polls);
  const vote = useDemo((s) => s.vote);
  const voted = hydrated ? polls[poll.id] : undefined;

  const steps = [
    { label: "Reminder", done: hydrated && reminders.includes(eventId) },
    { label: "I'll be there", done: hydrated && checkIns.some((c) => c.eventId === eventId && c.kind === "intent") },
    { label: "Prompt poll", done: !!voted },
  ];
  const lit = steps.filter((s) => s.done).length;
  const pts = [
    [60, 120],
    [150, 50],
    [250, 100],
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="card p-6" aria-labelledby="poll-title">
        <div className="flex items-center justify-between gap-2">
          <h3 id="poll-title" className="font-display text-2xl text-cream">Rolling prompt poll</h3>
          <Tag kind="demo">Demo poll</Tag>
        </div>
        <p className="mt-1 text-sm text-cream/60">{poll.q}</p>
        <div className="mt-4 grid gap-2" role="radiogroup" aria-label={poll.q}>
          {poll.options.map((o) => (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={voted === o.id}
              onClick={() => vote(poll.id, o.id)}
              className={`min-h-12 rounded-2xl border px-4 text-left text-cream ${voted === o.id ? "border-amber bg-amber/10" : "border-white/10 bg-black/20 hover:border-white/30"}`}
            >
              {o.label} {voted === o.id && <span className="text-amber">✓</span>}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-cream/65">No vote totals are shown: this demo has no real audience to count.</p>
      </section>

      <section className="card p-6" aria-labelledby="ant-title">
        <h3 id="ant-title" className="font-display text-2xl text-cream">Your anticipation constellation</h3>
        <p className="mt-1 text-sm text-cream/60">{lit}/3 stars lit. Purely personal — nothing is compared or ranked.</p>
        <svg viewBox="0 0 310 170" className="mt-4 w-full" role="img" aria-label={`${lit} of 3 preparation stars lit`}>
          <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="#F7C65B" strokeOpacity={0.15 + lit * 0.25} strokeDasharray="4 6" />
          {pts.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="18" fill={steps[i]!.done ? "#F7C65B" : "transparent"} opacity="0.15" />
              <path d={starPath(4, steps[i]!.done ? 14 : 8, 3.5, x, y)} fill={steps[i]!.done ? "#F7C65B" : "#6b6385"} />
              <text x={x} y={y! + 36} textAnchor="middle" fill="#F6EBDC" fillOpacity="0.7" fontSize="11" fontFamily="Inter, sans-serif">{steps[i]!.label}</text>
            </g>
          ))}
        </svg>
      </section>
    </div>
  );
}
