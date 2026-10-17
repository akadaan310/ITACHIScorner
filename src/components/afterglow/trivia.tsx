"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";
import { Tag } from "@/components/ui";
import { getRef } from "@/lib/fixtures/quran";
import { getTriviaSet } from "@/lib/fixtures/trivia";
import type { TriviaAnswer, TriviaQuestion } from "@/lib/types";
import { isWindowOpen, scoreAttempt } from "@/lib/progression";
import { useDemo, useHydrated } from "@/lib/store";

function TimerRing({ remaining, total }: { remaining: number; total: number }) {
  const pct = Math.max(0, remaining / total);
  const C = 2 * Math.PI * 22;
  const urgent = remaining <= 5;
  return (
    <div className="relative h-14 w-14 shrink-0" role="timer" aria-label={`${Math.ceil(remaining)} seconds left`}>
      <svg viewBox="0 0 50 50" className="h-full w-full -rotate-90">
        <circle cx="25" cy="25" r="22" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
        <circle cx="25" cy="25" r="22" fill="none" stroke={urgent ? "#FA536D" : "#F7C65B"} strokeWidth="4" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} style={{ transition: "stroke-dashoffset 0.25s linear" }} />
      </svg>
      <span className={`absolute inset-0 grid place-items-center font-display text-lg tabular-nums ${urgent ? "text-coral" : "text-cream"}`}>{Math.ceil(remaining)}</span>
    </div>
  );
}

/** Orbiting single-ring success flourish. */
export function OrbitSuccess({ accuracy }: { accuracy: number }) {
  const C = 2 * Math.PI * 54;
  return (
    <div className="relative mx-auto h-40 w-40" aria-hidden="true">
      <svg viewBox="0 0 140 140" className="h-full w-full">
        <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle cx="70" cy="70" r="54" fill="none" stroke="url(#ring)" strokeWidth="8" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - accuracy)} transform="rotate(-90 70 70)" style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1)" }} />
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FA536D" />
            <stop offset="1" stopColor="#F7C65B" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 animate-orbit">
        <span className="absolute left-1/2 top-[6px] h-3 w-3 -translate-x-1/2 rotate-45 bg-amber shadow-[0_0_16px_#F7C65B]" />
      </div>
    </div>
  );
}

/** One timed question. Keyed by question id so its clock starts fresh. */
function QuestionCard({
  q,
  idx,
  total,
  given,
  practice,
  onAnswer,
  onNext,
}: {
  q: TriviaQuestion;
  idx: number;
  total: number;
  given?: TriviaAnswer;
  practice: boolean;
  onAnswer: (optionId: string | null, elapsedMs: number) => void;
  onNext: () => void;
}) {
  const revealed = !!given;
  const [startedAt] = useState(() => Date.now());
  const [now, setNow] = useState(startedAt);
  const [choice, setChoice] = useState<string | null>(null);
  const limitMs = q.timeLimitSec * 1000;
  const expire = useEffectEvent((elapsed: number) => onAnswer(null, elapsed));

  useEffect(() => {
    if (revealed) return;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      // Time's up: lock the question as unanswered.
      if (t - startedAt > limitMs) expire(t - startedAt);
    }, 250);
    return () => clearInterval(id);
  }, [revealed, startedAt, limitMs]);

  const remaining = Math.max(0, q.timeLimitSec - (now - startedAt) / 1000);
  const expired = !revealed && remaining <= 0;

  return (
    <div className="card p-6 sm:p-8" data-testid="trivia-question">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Question {idx + 1} of {total}</p>
          <div className="mt-2 flex gap-1" aria-hidden="true">
            {Array.from({ length: total }, (_, i) => (
              <span key={i} className={`h-1.5 w-6 rounded-full ${i < idx ? "bg-amber" : i === idx ? "bg-coral" : "bg-white/15"}`} />
            ))}
          </div>
        </div>
        {revealed ? <span className="chip">{practice ? "Practice" : "Answer locked"}</span> : <TimerRing remaining={remaining} total={q.timeLimitSec} />}
      </div>
      <form
        className="mt-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (revealed) onNext();
          else if (choice && !expired) onAnswer(choice, Date.now() - startedAt);
        }}
      >
        <fieldset disabled={revealed || expired}>
          <legend className="font-display text-3xl leading-tight text-cream">{q.prompt}</legend>
          <div className="mt-5 grid gap-2">
            {q.options.map((o) => {
              const isCorrect = revealed && o.id === q.correctId;
              const isWrongPick = revealed && given?.optionId === o.id && !given.correct;
              return (
                <label
                  key={o.id}
                  className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-cream transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber ${
                    isCorrect ? "border-teal bg-teal/15" : isWrongPick ? "border-ruby bg-ruby/15" : choice === o.id ? "border-amber bg-amber/10" : "border-white/10 bg-black/20 hover:border-white/30"
                  }`}
                >
                  <input type="radio" name={`q-${q.id}`} value={o.id} checked={revealed ? given?.optionId === o.id : choice === o.id} onChange={() => setChoice(o.id)} className="h-4 w-4 accent-[#F7C65B]" />
                  <span className="flex-1">{o.label}</span>
                  {isCorrect && <span className="text-teal" aria-label="correct answer">✓</span>}
                  {isWrongPick && <span className="text-coral" aria-label="your answer, incorrect">✕</span>}
                </label>
              );
            })}
          </div>
        </fieldset>
        {revealed && (
          <div className="rise mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-4" role="status" aria-live="polite">
            <p className="font-semibold text-cream">{given.correct ? "Correct ✦" : given.timedOut ? "Time's up — this one isn't counted." : "Not quite."}</p>
            <p className="mt-1 text-sm text-cream/75">{q.explanation}</p>
          </div>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {revealed ? (
            <button type="submit" className="btn btn-primary" data-testid="next-question">
              {idx + 1 === total ? "See results" : "Next question"}
            </button>
          ) : (
            <button type="submit" className="btn btn-primary" data-testid="submit-answer" disabled={!choice || expired}>
              Lock in answer
            </button>
          )}
          {!revealed && <span className="text-xs text-cream/65">Arrow keys move between options · Enter submits</span>}
        </div>
      </form>
    </div>
  );
}

export function TriviaChallenge({ setId, demoMinute }: { setId: string; demoMinute: number }) {
  const tset = getTriviaSet(setId)!;
  const hydrated = useHydrated();
  const attempt = useDemo((s) => s.trivia[setId]);
  const start = useDemo((s) => s.startTrivia);
  const answer = useDemo((s) => s.answerTrivia);
  const finish = useDemo((s) => s.finishTrivia);
  const reset = useDemo((s) => s.resetTrivia);
  const profile = useDemo((s) => s.profile);
  const [revealFor, setRevealFor] = useState<string | null>(null);

  const open = isWindowOpen(tset, demoMinute);
  const currentIndex = attempt ? tset.questions.findIndex((q) => !attempt.answers[q.id]) : -1;
  const q = currentIndex >= 0 ? tset.questions[currentIndex] : undefined;
  const activeQ = revealFor ? tset.questions.find((x) => x.id === revealFor) : q;
  const result = attempt ? scoreAttempt(tset, attempt) : null;
  const activeId = activeQ?.id;
  const onAnswer = (optionId: string | null, elapsedMs: number) => {
    if (!activeId) return;
    answer(setId, activeId, optionId, elapsedMs);
    setRevealFor(activeId);
  };

  if (!hydrated) {
    return <div className="card p-6 text-cream/70">Loading the challenge…</div>;
  }

  const next = () => {
    setRevealFor(null);
    if (attempt && tset.questions.every((x) => attempt.answers[x.id])) finish(setId);
  };
  /* Intro / closed */
  if (!attempt) {
    return (
      <div className="card p-6 sm:p-8" data-testid="trivia-intro">
        <div className="flex flex-wrap items-center gap-2">
          <p className="eyebrow">{tset.title}</p>
          <Tag kind="demo">Demo trivia</Tag>
        </div>
        <h3 className="mt-3 font-display text-3xl text-cream">{open ? "The First-30 is open." : "The First-30 window has closed."}</h3>
        <p className="mt-2 max-w-xl text-cream/70">
          {tset.questions.length} questions · {tset.questions[0]!.timeLimitSec}s each. Open only during the first {tset.windowMinutes} minutes of the live.
          One answer per question; late answers don&rsquo;t count. This checks the time window — it does not verify that you watched.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {open ? (
            <button type="button" className="btn btn-primary" data-testid="start-trivia" onClick={() => start(setId, false)}>
              Begin challenge
            </button>
          ) : (
            <span className="chip">Closed at minute {tset.windowMinutes}</span>
          )}
          <button type="button" className="btn btn-ghost" onClick={() => start(setId, true)}>
            Practice mode (no XP)
          </button>
        </div>
        {!profile && <p className="mt-4 text-xs text-cream/65">Playing as a guest. <Link href="/join" className="underline">Join free</Link> to keep your XP and badges.</p>}
      </div>
    );
  }

  /* Results */
  if (attempt.finishedAt && result) {
    return (
      <div className="card p-6 sm:p-8" data-testid="trivia-results">
        <div className="flex flex-wrap items-center gap-2">
          <p className="eyebrow">Results · {tset.title}</p>
          {attempt.practice ? <Tag kind="sample">Practice — no XP</Tag> : <Tag kind="demo">Demo attempt</Tag>}
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="relative">
            <OrbitSuccess accuracy={result.accuracy} />
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="font-display text-4xl text-cream" data-testid="trivia-score">{result.correct}/{result.total}</p>
                <p className="text-xs text-cream/60">{Math.round(result.accuracy * 100)}% accuracy</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-display text-3xl text-cream">{result.accuracy >= 0.8 ? "A luminous run." : result.accuracy >= 0.5 ? "Good light — keep going." : "Every star starts dim."}</h3>
            <p className="mt-2 text-cream/70" data-testid="trivia-xp">
              {attempt.practice ? "Practice rounds never award XP." : `+${result.xp} XP earned for learning participation.`}
            </p>
            <p className="mt-1 text-sm text-cream/65">Sample comparison: your last demo score was 4/6 — progress, not pressure.</p>
          </div>
        </div>
        <ol className="mt-8 space-y-3">
          {tset.questions.map((qq, i) => {
            const a = attempt.answers[qq.id];
            const ref = qq.referenceId ? getRef(qq.referenceId) : undefined;
            return (
              <li key={qq.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="flex items-start gap-2 text-sm font-semibold text-cream">
                  <span className={a?.correct ? "text-teal" : "text-coral"} aria-hidden="true">{a?.correct ? "✓" : a?.timedOut ? "⏱" : "✕"}</span>
                  <span>
                    {i + 1}. {qq.prompt}
                    <span className="sr-only">{a?.correct ? " — correct" : a?.timedOut ? " — time ran out" : " — incorrect"}</span>
                  </span>
                </p>
                <p className="mt-1 pl-5 text-sm text-cream/70">{qq.explanation}</p>
                {ref && <p className="mt-1 pl-5 text-xs text-gold">Source: {ref.surahName} {ref.surah}:{ref.ayah}</p>}
              </li>
            );
          })}
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="btn btn-ghost" onClick={() => start(setId, true)}>Practice again (no XP)</button>
          <button type="button" className="btn btn-ghost" data-testid="reset-trivia" onClick={() => reset(setId)}>Reset demo attempt</button>
          <Link href="/afterglow/episodes/sample-episode-01" className="btn btn-primary">See the Afterglow recap</Link>
        </div>
      </div>
    );
  }

  /* Question / reveal */
  if (!activeQ) {
    return (
      <div className="card p-6">
        <button type="button" className="btn btn-primary" onClick={() => finish(setId)}>See results</button>
      </div>
    );
  }
  return (
    <QuestionCard
      key={activeQ.id}
      q={activeQ}
      idx={tset.questions.indexOf(activeQ)}
      total={tset.questions.length}
      given={attempt.answers[activeQ.id]}
      practice={attempt.practice}
      onAnswer={onAnswer}
      onNext={next}
    />
  );
}
