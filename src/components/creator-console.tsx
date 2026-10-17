"use client";

import Link from "next/link";
import { useState } from "react";
import { Tag } from "@/components/ui";
import { adapters } from "@/lib/adapters";
import { events } from "@/lib/fixtures/events";
import { useDemo, useHydrated } from "@/lib/store";

export function CreatorConsole() {
  const hydrated = useHydrated();
  const preview = useDemo((s) => s.creatorPreview);
  const setPreview = useDemo((s) => s.setCreatorPreview);
  const wall = useDemo((s) => s.wall);
  const moderate = useDemo((s) => s.moderateWall);
  const [drafts, setDrafts] = useState<{ title: string; platform: string; when: string }[]>([]);
  const [form, setForm] = useState({ title: "", platform: "TikTok", when: "" });
  const [questions, setQuestions] = useState<{ prompt: string; answer: string }[]>([]);
  const [q, setQ] = useState({ prompt: "", answer: "" });
  const [approved, setApproved] = useState<Record<string, boolean>>({});

  if (!hydrated) return <div className="card p-8 text-cream/60">Loading…</div>;
  if (!preview) {
    return (
      <div className="card hud mx-auto max-w-xl p-8 text-center">
        <p className="font-display text-5xl text-cream">Demo gate</p>
        <p className="mt-2 text-cream/70">This is a <strong className="text-cream">concept preview</strong> of creator tools. It is not creator access, it controls nothing real, and every action stays in your browser.</p>
        <button type="button" className="btn btn-primary mt-6" onClick={() => setPreview(true)} data-testid="enter-creator-preview">Enter demo preview</button>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber/50 bg-amber/10 px-4 py-3 text-sm text-cream">
        <span><Tag kind="demo">Demo preview</Tag> Not creator access. Mock actions only.</span>
        <button type="button" className="underline" onClick={() => setPreview(false)}>Leave preview</button>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-6" aria-labelledby="cc-event">
          <h2 id="cc-event" className="text-3xl text-cream">Event builder</h2>
          <form className="mt-4 grid gap-3" onSubmit={(e) => { e.preventDefault(); if (form.title.trim()) setDrafts([...drafts, form]); setForm({ title: "", platform: "TikTok", when: "" }); }}>
            <label className="text-sm text-cream/70">Title<input className="field mt-1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm text-cream/70">Platform<select className="field mt-1" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}><option>TikTok</option><option>YouTube</option><option>Both</option></select></label>
              <label className="text-sm text-cream/70">When<input type="datetime-local" className="field mt-1" value={form.when} onChange={(e) => setForm({ ...form, when: e.target.value })} /></label>
            </div>
            <button type="submit" className="btn btn-primary">Add draft (mock)</button>
          </form>
          <ul className="mt-4 space-y-2">
            {drafts.map((d, i) => <li key={i} className="flex justify-between rounded-md border border-white/10 p-3 text-sm text-cream"><span>{d.title} · {d.platform}</span><Tag kind="demo">Draft · unpublished</Tag></li>)}
          </ul>
        </section>

        <section className="card p-6" aria-labelledby="cc-trivia">
          <h2 id="cc-trivia" className="text-3xl text-cream">Poll / trivia composer</h2>
          <form className="mt-4 grid gap-3" onSubmit={(e) => { e.preventDefault(); if (q.prompt.trim()) setQuestions([...questions, q]); setQ({ prompt: "", answer: "" }); }}>
            <label className="text-sm text-cream/70">Question<input className="field mt-1" value={q.prompt} onChange={(e) => setQ({ ...q, prompt: e.target.value })} /></label>
            <label className="text-sm text-cream/70">Correct answer + source<input className="field mt-1" value={q.answer} onChange={(e) => setQ({ ...q, answer: e.target.value })} placeholder="Every answer needs a reference" /></label>
            <button type="submit" className="btn btn-ghost">Add question (mock)</button>
          </form>
          <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-cream/80">{questions.map((x, i) => <li key={i}>{x.prompt} <span className="text-cream/65">— {x.answer || "needs source"}</span></li>)}</ol>
        </section>

        <section className="card p-6" aria-labelledby="cc-approve">
          <h2 id="cc-approve" className="text-3xl text-cream">Afterglow approval &amp; provenance</h2>
          <ul className="mt-4 space-y-3">
            {events.filter((e) => e.recap).map((e) => (
              <li key={e.id} className="rounded-md border border-white/10 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-cream">{e.title}</span>
                  <button type="button" className={`btn !min-h-9 ${approved[e.id] ? "btn-accent" : "btn-ghost"}`} aria-pressed={!!approved[e.id]} onClick={() => setApproved({ ...approved, [e.id]: !approved[e.id] })}>{approved[e.id] ? "Approved (mock)" : "Approve"}</button>
                </div>
                <dl className="mt-2 grid grid-cols-2 gap-1 font-mono text-[0.65rem] text-cream/60">
                  <dt>source</dt><dd>{e.provenance.source}</dd>
                  <dt>verificationStatus</dt><dd>{e.provenance.verificationStatus}</dd>
                  <dt>capturedAt</dt><dd>{e.provenance.capturedAt.slice(0, 10)}</dd>
                  <dt>eventId</dt><dd>{e.provenance.eventId}</dd>
                  <dt>timestamps</dt><dd>{e.recap!.moments.every((m) => m.timestampStatus === "sample") ? "sample (none sourced)" : "sourced"}</dd>
                </dl>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-6" aria-labelledby="cc-mod">
          <h2 id="cc-mod" className="text-3xl text-cream">Moderation queue</h2>
          <p className="text-sm text-cream/60">Questions from the Reverts HQ wall (stored in this browser).</p>
          {wall.length === 0 ? (
            <p className="mt-4 text-cream/60">Queue empty. Ask something on <Link className="underline" href="/reverts#ask">the wall</Link> to see it here.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {wall.map((w) => (
                <li key={w.id} className="rounded-md border border-white/10 p-3 text-sm">
                  <p className="text-cream">{w.body}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[0.6rem] uppercase text-cream/65">{w.status}</span>
                    <button type="button" className="btn btn-accent !min-h-9" onClick={() => moderate(w.id, "approved")}>Approve</button>
                    <button type="button" className="btn btn-ghost !min-h-9" onClick={() => moderate(w.id, "hidden")}>Hide</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <h3 className="mt-6 text-2xl text-cream">Member messaging &amp; privacy</h3>
          <ul className="mt-2 space-y-1 text-sm text-cream/70">
            <li>◆ Members choose visibility; private is the default</li>
            <li>◆ No direct messages to members in this concept</li>
            <li>◆ Public creator identity configurable before launch (src/lib/config/creator.ts)</li>
          </ul>
        </section>
      </div>

      <section id="integrations" className="card scroll-mt-24 p-6" aria-labelledby="cc-int">
        <h2 id="cc-int" className="text-3xl text-cream">Integrations</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {adapters.map((a) => {
            const st = a.status();
            return (
              <li key={st.source} className="rounded-md border border-white/10 p-4 text-sm">
                <div className="flex items-center justify-between gap-2"><span className="font-semibold text-cream">{st.label}</span>{st.available ? <Tag kind="verified">Active</Tag> : <Tag kind="unavailable">Unavailable</Tag>}</div>
                <p className="mt-1 text-cream/65">{st.reason}</p>
                <p className="mt-1 font-mono text-[0.6rem] uppercase text-cream/60">ceiling: {st.ceiling}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
