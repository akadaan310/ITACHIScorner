"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { starPath } from "@/components/art";
import { QuranPassage, Tag } from "@/components/ui";
import { getTriviaSet } from "@/lib/fixtures/trivia";
import { scoreAttempt } from "@/lib/progression";
import { useDemo, useHydrated } from "@/lib/store";
import type { LiveEvent } from "@/lib/types";

export function MomentList({ event }: { event: LiveEvent }) {
  const hydrated = useHydrated();
  const saved = useDemo((s) => s.savedMoments);
  const toggle = useDemo((s) => s.toggleMoment);
  const [openRef, setOpenRef] = useState<string | null>(null);
  const kindColor = { question: "#F7C65B", reflection: "#A58BE1", reference: "#26C4B3", highlight: "#FA536D" } as const;
  return (
    <ol className="relative space-y-4 border-l border-dashed border-gold/30 pl-6">
      {event.recap!.moments.map((m, i) => {
        const key = `${event.id}:${m.id}`;
        const isSaved = hydrated && saved.includes(key);
        return (
          <li key={m.id} id={m.id} className="relative scroll-mt-24">
            <span className="absolute -left-[2.1rem] top-4 grid h-5 w-5 place-items-center" aria-hidden="true">
              <svg viewBox="-10 -10 20 20" className="h-5 w-5">
                <path d={starPath(4, 9, 3)} fill={kindColor[m.kind]} />
              </svg>
            </span>
            <article className="card p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold uppercase tracking-wider" style={{ color: kindColor[m.kind] }}>{m.kind}</span>
                <span className="text-cream/65">·</span>
                {m.timestamp && m.timestampStatus === "sourced" ? (
                  <span className="tabular-nums text-cream/70">{m.timestamp}</span>
                ) : (
                  <Tag kind="sample">Sample moment · no timestamp</Tag>
                )}
              </div>
              <h3 className="mt-2 font-display text-xl text-cream">{i + 1}. {m.label}</h3>
              <p className="mt-1 text-cream/75">{m.body}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className={`btn !min-h-10 text-sm ${isSaved ? "btn-gold" : "btn-ghost"}`} aria-pressed={isSaved} data-testid={`save-${m.id}`} onClick={() => toggle(key)}>
                  {isSaved ? "★ Saved" : "☆ Save moment"}
                </button>
                {m.referenceId && (
                  <button type="button" className="btn btn-ghost !min-h-10 text-sm" aria-expanded={openRef === m.id} onClick={() => setOpenRef(openRef === m.id ? null : m.id)}>
                    {openRef === m.id ? "Hide reference" : "Read the reference"}
                  </button>
                )}
              </div>
              {openRef === m.id && m.referenceId && (
                <div className="mt-4">
                  <QuranPassage id={m.referenceId} compact />
                </div>
              )}
            </article>
          </li>
        );
      })}
    </ol>
  );
}

export function JournalPrompts({ event }: { event: LiveEvent }) {
  const add = useDemo((s) => s.addJournal);
  const hydrated = useHydrated();
  const entries = useDemo((s) => s.journal);
  const mine = entries.filter((j) => j.eventId === event.id);
  const [prompt, setPrompt] = useState(event.recap!.journalPrompts[0]!);
  const [body, setBody] = useState("");
  const [done, setDone] = useState(false);
  return (
    <div className="card p-6">
      <h3 className="font-display text-2xl text-cream">Journal prompts</h3>
      <p className="mt-1 text-sm text-cream/60">Private to your device. Nothing is published.</p>
      <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Choose a prompt">
        {event.recap!.journalPrompts.map((p) => (
          <button key={p} type="button" role="radio" aria-checked={prompt === p} onClick={() => setPrompt(p)} className={`rounded-2xl border px-3 py-2 text-left text-sm ${prompt === p ? "border-amber bg-amber/10 text-cream" : "border-white/10 text-cream/70"}`}>
            {p}
          </button>
        ))}
      </div>
      <form
        className="mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!body.trim()) return;
          add({ title: prompt, body: body.trim(), prompt, eventId: event.id });
          setBody("");
          setDone(true);
        }}
      >
        <label htmlFor="journal-body" className="sr-only">Your reflection</label>
        <textarea id="journal-body" className="field min-h-28" placeholder="Write a few honest lines…" value={body} onChange={(e) => { setBody(e.target.value); setDone(false); }} />
        <div className="mt-3 flex items-center gap-3">
          <button className="btn btn-primary" type="submit" data-testid="save-journal">Save to my journal</button>
          {done && <span role="status" className="text-sm text-teal">Saved ✦ +10 XP</span>}
        </div>
      </form>
      {hydrated && mine.length > 0 && (
        <p className="mt-3 text-xs text-cream/60">
          {mine.length} reflection{mine.length > 1 ? "s" : ""} for this episode · <Link className="underline" href="/me/journal">Open journal</Link>
        </p>
      )}
    </div>
  );
}

export function RecapCard({ event }: { event: LiveEvent }) {
  const hydrated = useHydrated();
  const profile = useDemo((s) => s.profile);
  const attempt = useDemo((s) => (event.triviaSetId ? s.trivia[event.triviaSetId] : undefined));
  const saved = useDemo((s) => s.savedMoments.filter((m) => m.startsWith(event.id)).length);
  const svgRef = useRef<SVGSVGElement>(null);
  const [msg, setMsg] = useState("");
  const tset = event.triviaSetId ? getTriviaSet(event.triviaSetId) : undefined;
  const score = hydrated && attempt?.finishedAt && tset ? scoreAttempt(tset, attempt) : null;
  const name = hydrated && profile ? profile.nickname : "A curious guest";
  const [c1, c2] = event.palette;

  const download = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `afterglow-${event.id}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg("Recap card downloaded.");
  };
  const share = async () => {
    const text = `My Afterglow recap from “${event.title}” on Itachi's Corner (independent concept).`;
    try {
      if (navigator.share) await navigator.share({ title: "Afterglow recap", text, url: location.href });
      else {
        await navigator.clipboard.writeText(`${text} ${location.href}`);
        setMsg("Link copied to clipboard.");
      }
    } catch {
      setMsg("Sharing was cancelled.");
    }
  };

  return (
    <div className="card p-6">
      <h3 className="font-display text-2xl text-cream">Your recap card</h3>
      <svg ref={svgRef} viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" className="mt-4 w-full rounded-2xl" role="img" aria-label={`Recap card for ${name}: ${event.title}`}>
        <defs>
          <linearGradient id={`rc-${event.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#141025" />
            <stop offset="0.6" stopColor="#21183C" />
            <stop offset="1" stopColor={c1} stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <rect width="600" height="340" rx="24" fill={`url(#rc-${event.id})`} />
        {Array.from({ length: 40 }, (_, i) => (
          <circle key={i} cx={(i * 137) % 600} cy={(i * 71) % 220} r={i % 7 === 0 ? 1.8 : 0.9} fill="#F6EBDC" opacity={0.5} />
        ))}
        <path d={starPath(8, 46, 30, 500, 96)} fill="none" stroke={c2} strokeWidth="2" />
        <path d={starPath(4, 16, 5, 500, 96)} fill={c1} />
        <text x="36" y="56" fill="#D7AD65" fontFamily="Inter, sans-serif" fontSize="13" letterSpacing="3">AFTERGLOW · ITACHI&apos;S CORNER</text>
        <text x="36" y="104" fill="#F6EBDC" fontFamily="Georgia, serif" fontSize="34">{event.title}</text>
        <text x="36" y="140" fill="#F6EBDC" fillOpacity="0.7" fontFamily="Inter, sans-serif" fontSize="15">{name}</text>
        <text x="36" y="214" fill="#F7C65B" fontFamily="Georgia, serif" fontSize="44">{score ? `${score.correct}/${score.total}` : "—"}</text>
        <text x="36" y="238" fill="#F6EBDC" fillOpacity="0.6" fontFamily="Inter, sans-serif" fontSize="12">FIRST-30 TRIVIA</text>
        <text x="200" y="214" fill="#F7C65B" fontFamily="Georgia, serif" fontSize="44">{hydrated ? saved : 0}</text>
        <text x="200" y="238" fill="#F6EBDC" fillOpacity="0.6" fontFamily="Inter, sans-serif" fontSize="12">MOMENTS SAVED</text>
        <text x="36" y="306" fill="#F6EBDC" fillOpacity="0.55" fontFamily="Inter, sans-serif" fontSize="11">Demo recap · independent concept, not endorsed by the creator</text>
      </svg>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn btn-gold" onClick={download}>Download card</button>
        <button type="button" className="btn btn-ghost" onClick={share}>Share</button>
      </div>
      {msg && <p role="status" className="mt-2 text-sm text-teal">{msg}</p>}
    </div>
  );
}

export function ParticipationCompare({ event, previousId }: { event: LiveEvent; previousId?: string }) {
  const hydrated = useHydrated();
  const checkIns = useDemo((s) => s.checkIns);
  const journal = useDemo((s) => s.journal);
  const saved = useDemo((s) => s.savedMoments);
  const row = (id: string) => {
    const c = hydrated ? checkIns.filter((x) => x.eventId === id) : [];
    return {
      app: c.some((x) => x.kind === "app-check-in"),
      self: c.some((x) => x.kind === "self-reported"),
      notes: hydrated ? journal.filter((j) => j.eventId === id).length : 0,
      moments: hydrated ? saved.filter((m) => m.startsWith(id + ":")).length : 0,
    };
  };
  const cols = [{ id: event.id, label: "This episode", ...row(event.id) }, ...(previousId ? [{ id: previousId, label: "Previous", ...row(previousId) }] : [])];
  return (
    <div className="card p-6">
      <h3 className="font-display text-2xl text-cream">Your participation</h3>
      <p className="mt-1 text-sm text-cream/60">Compared with your own history only. Each mark names its evidence.</p>
      <table className="mt-4 w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-cream/65">
            <th scope="col" className="py-2 font-semibold">Signal</th>
            {cols.map((c) => (
              <th key={c.id} scope="col" className="py-2 font-semibold">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-cream/85">
          <tr className="border-t border-white/10"><th scope="row" className="py-2 text-left font-normal">In-app check-in <Tag kind="verified">App</Tag></th>{cols.map((c) => <td key={c.id}>{c.app ? "✓" : "—"}</td>)}</tr>
          <tr className="border-t border-white/10"><th scope="row" className="py-2 text-left font-normal">Watched (self-reported) <Tag kind="self-entered">Self</Tag></th>{cols.map((c) => <td key={c.id}>{c.self ? "✓" : "—"}</td>)}</tr>
          <tr className="border-t border-white/10"><th scope="row" className="py-2 text-left font-normal">Journal notes</th>{cols.map((c) => <td key={c.id}>{c.notes}</td>)}</tr>
          <tr className="border-t border-white/10"><th scope="row" className="py-2 text-left font-normal">Moments saved</th>{cols.map((c) => <td key={c.id}>{c.moments}</td>)}</tr>
        </tbody>
      </table>
      <p className="mt-3 text-xs text-cream/65">Platform-verified attendance: not connected — never inferred.</p>
    </div>
  );
}
