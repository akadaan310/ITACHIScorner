"use client";

import { useState } from "react";
import { TriviaChallenge } from "@/components/afterglow/trivia";
import { CheckInControls } from "@/components/live-bits";
import { Tag, WatchButtons } from "@/components/ui";
import { liveEvent } from "@/lib/fixtures/events";
import { totalXp } from "@/lib/progression";
import { useDemo, useHydrated } from "@/lib/store";

const timeline = [
  { from: 0, to: 10, label: "Welcome & warm-up" },
  { from: 10, to: 30, label: "First-30 challenge window" },
  { from: 30, to: 50, label: "Open questions" },
  { from: 50, to: 65, label: "Reflection & references" },
  { from: 65, to: 75, label: "Closing & what's next" },
];

const sampleQueue = [
  { id: "sq1", text: "How do you explain ‘One’ to a child?", votes: 14 },
  { id: "sq2", text: "Which verse would you read first to someone curious?", votes: 9 },
  { id: "sq3", text: "How do I ask a hard question without sounding rude?", votes: 7 },
];

const sampleThread = [
  { id: "t1", who: "Demo · Nightjar", minute: 4, text: "Here from the lunar side of the world ✦" },
  { id: "t2", who: "Demo · Lantern-9", minute: 9, text: "Saving the question about kindness for my journal." },
  { id: "t3", who: "Demo · Wayfarer", minute: 13, text: "Loved the reminder to restate before replying." },
];

const demoBoard = [
  { name: "Demo · Nightjar", xp: 420 },
  { name: "Demo · Lantern-9", xp: 365 },
  { name: "Demo · Saffron", xp: 240 },
  { name: "Demo · Wayfarer", xp: 180 },
];

export function CompanionDock() {
  const event = liveEvent()!;
  const hydrated = useHydrated();
  const [minute, setMinute] = useState(12);
  const [queue, setQueue] = useState(sampleQueue);
  const [voted, setVoted] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [mark, setMark] = useState("");
  const thread = useDemo((s) => s.thread);
  const marks = useDemo((s) => s.liveMarks);
  const post = useDemo((s) => s.postThread);
  const markLive = useDemo((s) => s.markLive);
  const settings = useDemo((s) => s.settings);
  const update = useDemo((s) => s.updateSettings);
  const profile = useDemo((s) => s.profile);
  const xp = useDemo((s) => totalXp(s.xp));

  const board = [...demoBoard, ...(hydrated && settings.leaderboardOptIn && profile ? [{ name: `${profile.nickname} (you)`, xp }] : [])].sort((a, b) => b.xp - a.xp);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
      <div className="space-y-6">
        {/* Dock header */}
        <section className="card overflow-hidden p-6" aria-labelledby="dock-title" style={{ background: "linear-gradient(135deg, rgba(250,83,109,0.16), rgba(20,16,37,0.8) 55%)" }}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-2 rounded-full bg-coral px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1a0c12]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#1a0c12]" /> Simulated live
            </span>
            <Tag kind="demo">Demo scenario</Tag>
          </div>
          <h2 id="dock-title" className="mt-3 font-display text-3xl text-cream sm:text-4xl">{event.title}</h2>
          <p className="mt-2 max-w-2xl text-cream/70">
            The video plays only on the official channel. Keep it open there — this dock is optional, and it&rsquo;s fine to ignore it and simply watch.
          </p>
          <div className="mt-5"><WatchButtons /></div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4">
            <label htmlFor="demo-minute" className="flex items-center justify-between text-sm text-cream/80">
              <span>Demo clock · minute <strong className="tabular-nums text-cream" data-testid="demo-minute">{minute}</strong> of {event.durationMin}</span>
              <Tag kind="simulated">Simulated timeline</Tag>
            </label>
            <input id="demo-minute" type="range" min={0} max={event.durationMin} value={minute} onChange={(e) => setMinute(Number(e.target.value))} className="mt-3 w-full accent-[#FA536D]" />
            <ol className="mt-3 grid grid-cols-5 gap-1 text-[0.65rem] text-cream/60" aria-label="Follow-along timeline (simulated)">
              {timeline.map((t) => {
                const active = minute >= t.from && minute < t.to;
                return (
                  <li key={t.label} className={`rounded-lg border px-1.5 py-1.5 leading-tight ${active ? "border-coral bg-coral/15 text-cream" : "border-white/10"}`} aria-current={active ? "step" : undefined}>
                    <span className="block tabular-nums">{t.from}′</span>
                    {t.label}
                  </li>
                );
              })}
            </ol>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className="btn btn-ghost !min-h-10 text-sm" onClick={() => setMinute(12)}>Jump to minute 12</button>
              <button type="button" className="btn btn-ghost !min-h-10 text-sm" data-testid="jump-closed" onClick={() => setMinute(31)}>Jump past the First-30</button>
            </div>
          </div>
          <div className="mt-5"><CheckInControls event={event} /></div>
        </section>

        <section aria-label="First-30 trivia challenge">
          <TriviaChallenge setId={event.triviaSetId!} demoMinute={minute} />
        </section>

        {/* Discussion */}
        <section className="card p-6" aria-labelledby="thread-title">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 id="thread-title" className="font-display text-2xl text-cream">Respectful discussion</h3>
            <Tag kind="demo">Demo thread · stored on your device</Tag>
          </div>
          <p className="mt-1 text-sm text-cream/60">Kindness first. This thread is not moderated in real time by the creator.</p>
          <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1" aria-live="polite">
            {[...sampleThread, ...(hydrated ? thread.map((t) => ({ id: t.id, who: profile?.nickname ?? "You (guest)", minute: t.minute, text: t.body })) : [])].map((m) => (
              <li key={m.id} className="rounded-2xl bg-white/[0.04] px-4 py-3">
                <p className="text-xs text-cream/65">{m.who} · minute {m.minute}</p>
                <p className="text-cream/90">{m.text}</p>
              </li>
            ))}
          </ul>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (draft.trim()) post(draft.trim(), minute);
              setDraft("");
            }}
          >
            <label htmlFor="thread-input" className="sr-only">Add to the discussion</label>
            <input id="thread-input" className="field" maxLength={280} placeholder="Share a thought, kindly…" value={draft} onChange={(e) => setDraft(e.target.value)} />
            <button className="btn btn-primary" type="submit">Post</button>
          </form>
        </section>
      </div>

      <aside className="space-y-6">
        <section className="card p-6" aria-labelledby="queue-title">
          <div className="flex items-center justify-between gap-2">
            <h3 id="queue-title" className="font-display text-2xl text-cream">Question queue</h3>
            <Tag kind="demo">Demo</Tag>
          </div>
          <p className="mt-1 text-sm text-cream/60">Upvote what you&rsquo;d love to see explored. Queues are suggestions, never promises.</p>
          <ul className="mt-4 space-y-2">
            {[...queue].sort((a, b) => b.votes - a.votes).map((q) => (
              <li key={q.id} className="flex items-center gap-3 rounded-2xl border border-white/10 p-3">
                <button
                  type="button"
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border text-sm font-bold ${voted.includes(q.id) ? "border-amber bg-amber/15 text-amber" : "border-white/15 text-cream/80"}`}
                  aria-pressed={voted.includes(q.id)}
                  aria-label={`Upvote: ${q.text}`}
                  onClick={() => {
                    const on = voted.includes(q.id);
                    setVoted(on ? voted.filter((v) => v !== q.id) : [...voted, q.id]);
                    setQueue(queue.map((x) => (x.id === q.id ? { ...x, votes: x.votes + (on ? -1 : 1) } : x)));
                  }}
                >
                  ▲<span className="sr-only"> {q.votes}</span>
                </button>
                <span className="flex-1 text-sm text-cream/90">{q.text}</span>
                <span className="text-xs tabular-nums text-cream/65" aria-hidden="true">{q.votes}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-6" aria-labelledby="marks-title">
          <h3 id="marks-title" className="font-display text-2xl text-cream">Mark this moment</h3>
          <p className="mt-1 text-sm text-cream/60">Bookmarks use the demo clock, not the real video time.</p>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              markLive(minute, mark.trim() || "Bookmarked moment");
              setMark("");
            }}
          >
            <label htmlFor="mark-input" className="sr-only">Note for this moment</label>
            <input id="mark-input" className="field" placeholder="Optional note" value={mark} onChange={(e) => setMark(e.target.value)} />
            <button className="btn btn-gold" type="submit" data-testid="mark-moment">✦ Mark</button>
          </form>
          {hydrated && marks.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-cream/80">
              {marks.slice(-5).map((m) => (
                <li key={m.id}>
                  <span className="tabular-nums text-gold">min {m.minute}</span> · {m.note}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-6" aria-labelledby="board-title">
          <div className="flex items-center justify-between gap-2">
            <h3 id="board-title" className="font-display text-2xl text-cream">Ranks board</h3>
            <Tag kind="demo">Fictional players</Tag>
          </div>
          {hydrated && !settings.showRankings ? (
            <p className="mt-3 text-sm text-cream/60">You&rsquo;ve muted rankings. They&rsquo;ll stay hidden until you turn them back on in Settings.</p>
          ) : (
            <ol className="mt-4 space-y-1">
              {board.map((b, i) => (
                <li key={b.name} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${b.name.includes("(you)") ? "bg-amber/10 text-amber" : "text-cream/85"}`}>
                  <span className="w-5 tabular-nums text-cream/65">{i + 1}</span>
                  <span className="flex-1 truncate">{b.name}</span>
                  <span className="tabular-nums">{b.xp} XP</span>
                </li>
              ))}
            </ol>
          )}
          <label className="mt-4 flex min-h-11 cursor-pointer items-center gap-3 text-sm text-cream/80">
            <input type="checkbox" className="h-5 w-5 accent-[#F7C65B]" checked={hydrated && settings.leaderboardOptIn} onChange={(e) => update({ leaderboardOptIn: e.target.checked })} data-testid="leaderboard-optin" />
            Show me on the board (pseudonym, opt-in)
          </label>
          <p className="text-xs text-cream/65">Ranks learning participation only. Never faith, piety or conversions.</p>
        </section>
      </aside>
    </div>
  );
}
