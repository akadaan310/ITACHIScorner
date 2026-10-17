"use client";

import { useState } from "react";
import { Tag } from "@/components/ui";
import { sanctuaryJourneys } from "@/lib/fixtures/content";
import { useDemo, useHydrated } from "@/lib/store";

export function Journeys() {
  const hydrated = useHydrated();
  const opened = useDemo((s) => s.sanctuaryOpened);
  const open = useDemo((s) => s.openSanctuary);
  const bookmarks = useDemo((s) => s.bookmarks);
  const toggleBookmark = useDemo((s) => s.toggleBookmark);
  const [active, setActive] = useState<string | null>(null);
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {sanctuaryJourneys.map((j, i) => {
        const isOpen = active === j.id;
        const started = hydrated && opened.includes(j.id);
        const saved = hydrated && bookmarks.includes(`journey:${j.id}`);
        return (
          <li key={j.id} className="card overflow-hidden" style={{ borderTop: `4px solid ${j.tone}` }}>
            <div className="p-6">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em]" style={{ color: "#7a5cc4" }}>Path 0{i + 1} · {j.steps} steps · {j.minutes} min</p>
              <h3 className="mt-2 text-3xl" style={{ color: "#2b2140" }}>{j.title}</h3>
              <p className="mt-1" style={{ color: "#5b4e73" }}>{j.blurb}</p>
              <div className="mt-3 flex gap-1.5" role="img" aria-label={started ? "Started" : "Not started"}>
                {Array.from({ length: j.steps }, (_, k) => (
                  <span key={k} className="h-2 w-2 rounded-full border" style={{ borderColor: "#7a5cc4", background: started && k === 0 ? "#7a5cc4" : "transparent" }} />
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" className="btn btn-accent" aria-expanded={isOpen} data-testid={`journey-${j.id}`} onClick={() => { open(j.id); setActive(isOpen ? null : j.id); }}>
                  {started ? (isOpen ? "Close" : "Continue gently") : "Begin"}
                </button>
                <button type="button" className="btn btn-ghost" aria-pressed={saved} onClick={() => toggleBookmark(`journey:${j.id}`)}>
                  {saved ? "★ Saved" : "☆ Save"}
                </button>
              </div>
            </div>
            {isOpen && (
              <div className="rise border-t p-6" style={{ borderColor: "rgba(122,92,196,0.2)", background: "rgba(236,228,251,0.5)" }}>
                <p className="font-semibold" style={{ color: "#2b2140" }}>Step 1 · Breathe</p>
                <p className="mt-1 text-sm" style={{ color: "#5b4e73" }}>
                  There is no rush and no scoreboard here. Today, simply read the next step&rsquo;s overview, then close the app if you like. Your place is kept.
                </p>
                <p className="mt-3 text-xs" style={{ color: "#7a6d8f" }}>Sample journey content — full lessons require editorial review.</p>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function PrivateNotes() {
  const hydrated = useHydrated();
  const notes = useDemo((s) => s.privateNotes);
  const add = useDemo((s) => s.addPrivateNote);
  const remove = useDemo((s) => s.removePrivateNote);
  const [text, setText] = useState("");
  return (
    <div className="card p-6">
      <h3 className="text-3xl" style={{ color: "#2b2140" }}>Private notes</h3>
      <p className="mt-1 text-sm" style={{ color: "#5b4e73" }}>Only on this device. Never shared, never counted, no credits.</p>
      <form className="mt-4" onSubmit={(e) => { e.preventDefault(); if (text.trim()) add(text.trim()); setText(""); }}>
        <label htmlFor="private-note" className="sr-only">Write a private note</label>
        <textarea id="private-note" className="field min-h-24" value={text} onChange={(e) => setText(e.target.value)} placeholder="Something you want to remember, or ask later…" />
        <button type="submit" className="btn btn-accent mt-3">Keep this note</button>
      </form>
      {hydrated && notes.length > 0 && (
        <ul className="mt-4 space-y-2">
          {notes.map((n) => (
            <li key={n.id} className="flex items-start justify-between gap-3 rounded-lg border p-3 text-sm" style={{ borderColor: "rgba(122,92,196,0.2)", color: "#2b2140" }}>
              <span>{n.body}</span>
              <button type="button" className="shrink-0 text-xs underline" style={{ color: "#7a5cc4" }} onClick={() => remove(n.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SillyWall() {
  const hydrated = useHydrated();
  const wall = useDemo((s) => s.wall);
  const ask = useDemo((s) => s.askWall);
  const [text, setText] = useState("");
  const [anon, setAnon] = useState(true);
  const [sent, setSent] = useState(false);
  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-3xl" style={{ color: "#2b2140" }}>Ask anything</h3>
        <Tag kind="demo">Demo · stays on your device</Tag>
      </div>
      <p className="mt-1 text-sm" style={{ color: "#5b4e73" }}>Questions are reviewed before anyone sees them. Anonymous by default.</p>
      <form className="mt-4" onSubmit={(e) => { e.preventDefault(); if (!text.trim()) return; ask(text.trim(), anon); setText(""); setSent(true); }}>
        <label htmlFor="wall-q" className="sr-only">Your question</label>
        <textarea id="wall-q" className="field min-h-20" value={text} onChange={(e) => { setText(e.target.value); setSent(false); }} placeholder="No question is too small…" />
        <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-3 text-sm" style={{ color: "#2b2140" }}>
          <input type="checkbox" className="h-5 w-5 accent-[#7a5cc4]" checked={anon} onChange={(e) => setAnon(e.target.checked)} /> Ask anonymously
        </label>
        <button type="submit" className="btn btn-accent mt-2">Send for gentle review</button>
        {sent && <p role="status" className="mt-2 text-sm" style={{ color: "#0d6157" }}>Received. In this demo it waits in the moderation queue at /studio/creator.</p>}
      </form>
      {hydrated && wall.length > 0 && (
        <ul className="mt-4 space-y-2">
          {wall.map((w) => (
            <li key={w.id} className="rounded-lg border p-3 text-sm" style={{ borderColor: "rgba(122,92,196,0.2)", color: "#2b2140" }}>
              <span className="font-mono text-[0.6rem] uppercase tracking-wider" style={{ color: "#7a5cc4" }}>{w.anonymous ? "Anonymous" : "You"} · {w.status.replace("-", " ")}</span>
              <p>{w.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function MentorRequest() {
  const hydrated = useHydrated();
  const req = useDemo((s) => s.mentorRequest);
  const request = useDemo((s) => s.requestMentor);
  const [topic, setTopic] = useState("Learning to pray");
  return (
    <div className="relative overflow-hidden rounded-[0.9rem] p-6 text-white" style={{ background: "linear-gradient(135deg,#6d4fc2,#9a7ad6)" }}>
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/80">{"// "}Match with a mentor</p>
      <h3 className="mt-2 text-4xl text-white">A friendly guide</h3>
      <p className="mt-1 text-sm text-white/85">Mentorship is a demo only: no volunteers have been verified, so no real person will contact you.</p>
      {hydrated && req ? (
        <p role="status" className="mt-4 rounded-lg bg-white/15 p-3 text-sm">Demo request recorded for “{req.topic}”. Nothing was sent anywhere.</p>
      ) : (
        <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); request(topic); }}>
          <label htmlFor="mentor-topic" className="sr-only">Topic</label>
          <select id="mentor-topic" className="field !bg-white/95 !text-[#2b2140]" value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option>Learning to pray</option>
            <option>Reading the Qur&rsquo;an</option>
            <option>Family conversations</option>
            <option>Finding community</option>
          </select>
          <button type="submit" className="btn shrink-0 bg-white text-[#4f2f99]">Request (demo)</button>
        </form>
      )}
    </div>
  );
}
