"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Tag, WatchButtons } from "@/components/ui";
import { resolveStart } from "@/lib/fixtures/events";
import { useDemo, useHydrated } from "@/lib/store";
import type { LiveEvent } from "@/lib/types";

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function Countdown({ event }: { event: LiveEvent }) {
  const now = useNow();
  if (!now) {
    return <p className="text-sm text-cream/60">Countdown appears once the page loads.</p>;
  }
  const start = resolveStart(event, now);
  const diff = Math.max(0, start.getTime() - now.getTime());
  const parts = [
    ["days", Math.floor(diff / 86_400_000)],
    ["hrs", Math.floor(diff / 3_600_000) % 24],
    ["min", Math.floor(diff / 60_000) % 60],
    ["sec", Math.floor(diff / 1000) % 60],
  ] as const;
  return (
    <div>
      <div className="flex gap-2" role="timer" aria-label={`Sample countdown: ${parts.map(([l, v]) => `${v} ${l}`).join(", ")}`}>
        {parts.map(([label, v]) => (
          <div key={label} className="min-w-[3.6rem] rounded-2xl border border-white/10 bg-black/30 px-2 py-2 text-center">
            <span className="block font-display text-2xl tabular-nums text-cream sm:text-3xl">{String(v).padStart(2, "0")}</span>
            <span className="text-[0.65rem] uppercase tracking-widest text-cream/65">{label}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-cream/60">
        {start.toLocaleString(undefined, { weekday: "long", hour: "numeric", minute: "2-digit" })} your time ·{" "}
        {event.scheduleVerification === "sample" ? "demo countdown for a sample listing" : "announced by the creator"}
      </p>
    </div>
  );
}

export function ReminderToggle({ eventId }: { eventId: string }) {
  const hydrated = useHydrated();
  const on = useDemo((s) => s.reminders.includes(eventId));
  const toggle = useDemo((s) => s.toggleReminder);
  return (
    <button type="button" className="btn btn-ghost" aria-pressed={hydrated && on} onClick={() => toggle(eventId)}>
      {hydrated && on ? "✓ Reminder saved (demo)" : "☾ Remind me"}
    </button>
  );
}

export function CheckInControls({ event }: { event: LiveEvent }) {
  const hydrated = useHydrated();
  const allCheckIns = useDemo((s) => s.checkIns);
  const checkIns = allCheckIns.filter((c) => c.eventId === event.id);
  const checkIn = useDemo((s) => s.checkIn);
  const has = (k: string) => hydrated && checkIns.some((c) => c.kind === k);

  if (event.status === "scheduled") {
    return (
      <div className="space-y-2">
        <button type="button" className="btn btn-gold" aria-pressed={has("intent")} disabled={has("intent")} onClick={() => checkIn(event.id, "intent")}>
          {has("intent") ? "✓ You said you'll be there" : "I'll be there"}
        </button>
        <p className="text-xs text-cream/60">A self-declared intention. It never counts as attendance.</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {event.status === "live" && (
          <button type="button" data-testid="app-check-in" className="btn btn-primary" disabled={has("app-check-in")} onClick={() => checkIn(event.id, "app-check-in")}>
            {has("app-check-in") ? "✓ Checked in" : "✦ I'm here — check in"}
          </button>
        )}
        <button type="button" data-testid="self-report" className="btn btn-ghost" disabled={has("self-reported")} onClick={() => checkIn(event.id, "self-reported")}>
          {has("self-reported") ? "✓ Noted: you watched" : "I watched on TikTok/YouTube"}
        </button>
      </div>
      <ul className="space-y-1 text-xs text-cream/65">
        {event.status === "live" && (
          <li className="flex items-center gap-2">
            <Tag kind="verified">In-app</Tag> The app records its own check-in button. Counts toward your Corner streak.
          </li>
        )}
        <li className="flex items-center gap-2">
          <Tag kind="self-entered">Self-reported</Tag> Your word, shown as such. Never presented as verified.
        </li>
      </ul>
    </div>
  );
}

export function NextLiveCard({ event, compact = false }: { event: LiveEvent; compact?: boolean }) {
  return (
    <article className="card overflow-hidden p-6 sm:p-8" data-world="afterglow" style={{ background: "linear-gradient(140deg, rgba(250,83,109,0.18), rgba(33,24,60,0.7) 45%, rgba(247,198,91,0.12))" }}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="eyebrow">The next live is on TikTok &amp; YouTube</span>
        <Tag kind="sample">Sample schedule</Tag>
      </div>
      <h3 className="mt-3 font-display text-3xl text-cream sm:text-4xl">{event.title}</h3>
      {!compact && <p className="mt-2 max-w-xl text-cream/70">{event.description}</p>}
      <div className="mt-5">
        <Countdown event={event} />
      </div>
      <div className="mt-6 flex flex-col gap-4">
        <WatchButtons live={false} />
        <div className="flex flex-wrap items-start gap-3">
          <ReminderToggle eventId={event.id} />
          <CheckInControls event={event} />
        </div>
      </div>
      <p className="mt-5 text-xs text-cream/65">
        Watching happens on the official platforms. Nothing is embedded or rebroadcast here.{" "}
        <Link href="/afterglow/before" className="underline">See the full before-live lounge</Link>
      </p>
    </article>
  );
}

/** The 30-second, no-signup taster challenge on the home page. */
export function SampleChallenge() {
  const [picked, setPicked] = useState<string | null>(null);
  const [left, setLeft] = useState(30);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!started || picked) return;
    if (left <= 0) return;
    const id = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(id);
  }, [started, picked, left]);
  const options = [
    { id: "a", label: "“Why would anyone believe that?”" },
    { id: "b", label: "“What first made this idea meaningful to you?”" },
    { id: "c", label: "“I already know what you're going to say.”" },
  ];
  const timedOut = left <= 0 && !picked;
  return (
    <div className="card p-6 sm:p-8" data-world="dojo">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow">Today&rsquo;s gentle challenge · 30 seconds</p>
        <span className="chip tabular-nums" aria-live="polite">{started ? (picked ? "Done" : `${left}s`) : "No sign-up"}</span>
      </div>
      <h3 className="mt-3 font-display text-2xl text-cream sm:text-3xl">Which question opens a door instead of closing one?</h3>
      {!started ? (
        <button type="button" className="btn btn-accent mt-5" onClick={() => setStarted(true)}>
          Start the challenge
        </button>
      ) : (
        <fieldset className="mt-5 grid gap-2" disabled={!!picked || timedOut}>
          <legend className="sr-only">Choose one answer</legend>
          {options.map((o) => {
            const state = picked ? (o.id === "b" ? "right" : o.id === picked ? "wrong" : "idle") : "idle";
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => setPicked(o.id)}
                className={`min-h-12 rounded-2xl border px-4 py-3 text-left text-[0.98rem] transition-colors ${
                  state === "right" ? "border-teal bg-teal/15 text-cream" : state === "wrong" ? "border-ruby bg-ruby/15 text-cream" : "border-white/10 bg-black/20 text-cream/90 hover:border-teal/60"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </fieldset>
      )}
      {(picked || timedOut) && (
        <div className="rise mt-5 rounded-2xl border border-teal/30 bg-teal/10 p-4" role="status">
          <p className="font-semibold text-cream">{picked === "b" ? "Beautifully asked. ✦" : timedOut ? "Time's up — no pressure." : "Close — but that one closes the door."}</p>
          <p className="mt-1 text-sm text-cream/75">
            Open questions invite someone&rsquo;s real reasons. That&rsquo;s the first habit the Simulator trains.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/dojo/path" className="btn btn-accent">Try a full Simulator path</Link>
            <Link href="/join" className="btn btn-ghost">Join free to save progress</Link>
          </div>
        </div>
      )}
    </div>
  );
}
