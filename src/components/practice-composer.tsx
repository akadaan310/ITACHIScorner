"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const prompts = [
  { label: "Listen", prompt: "Write what you heard before you write your response." },
  { label: "Clarify", prompt: "Put one question into words. What would you ask to understand it better?" },
  { label: "Rephrase", prompt: "Try expressing your own thought more clearly, without changing its meaning." },
  { label: "Reflect", prompt: "What would you like to revisit after a conversation?" },
] as const;
const checks = ["I have represented the question fairly", "I have separated what I know from what I need to check", "I have left room to listen again"];

export function PracticeComposer() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [checked, setChecked] = useState<boolean[]>(checks.map(() => false));
  const [status, setStatus] = useState("");
  const [copying, setCopying] = useState(false);
  const currentPrompt = prompts[promptIndex] ?? prompts[0];
  const field = useRef<HTMLTextAreaElement>(null);
  const review = useRef<HTMLHeadingElement>(null);
  const feedback = useRef<HTMLParagraphElement>(null);
  useEffect(() => { if (status) feedback.current?.scrollIntoView({ block: "nearest", behavior: "instant" }); }, [status]);
  async function copy() {
    setCopying(true);
    setStatus("");
    try {
      await navigator.clipboard.writeText(`My practice — ${currentPrompt.label}\n\n${draft}\n\nMy self-review\n${checks.map((text, index) => `${checked[index] ? "[x]" : "[ ]"} ${text}`).join("\n")}`);
      setStatus("Practice copied. Keep it somewhere you control.");
    } catch { setStatus("Couldn't copy your practice. Your words are still here; select and copy them manually."); }
    finally { setCopying(false); }
  }
  function clear() {
    setDraft(""); setChecked(checks.map(() => false)); setReviewing(false); setStatus("Practice cleared from this page.");
    requestAnimationFrame(() => field.current?.focus());
  }
  return <section className="practice-workbench" data-testid="practice-workbench" aria-labelledby="practice-workbench-title">
    <div className="practice-intro"><p className="public-eyebrow">A little practice · available now</p><h2 id="practice-workbench-title">Give your words another look.</h2><p>Your own writing, held only in this page. No automated answer, assessment or attributed teaching method. Refreshing or leaving clears it.</p></div>
    <div className="practice-controls">
      <div className="practice-prompt-grid" role="group" aria-label="Choose a writing prompt">{prompts.map((prompt, index) => <button className="practice-prompt" type="button" key={prompt.label} aria-pressed={promptIndex === index} disabled={copying} onClick={() => { setPromptIndex(index); setStatus(""); }}>{prompt.label}</button>)}</div>
      <p id="practice-prompt-description" className="practice-prompt-description">{currentPrompt.prompt}</p>
      {!reviewing ? <div className="practice-fields"><label htmlFor="practice-draft">Your practice draft</label><textarea id="practice-draft" ref={field} aria-describedby="practice-prompt-description" spellCheck={false} disabled={copying} maxLength={8000} value={draft} onChange={event => { setDraft(event.target.value); setStatus(""); }} placeholder="Begin with your own words…" /></div> : <div className="practice-review"><h3 ref={review} tabIndex={-1}>Your words, ready for another look.</h3><p className="practice-draft">{draft}</p><p>This is your writing. No feedback or score has been generated.</p></div>}
      <fieldset className="practice-checks"><legend>Your review checklist · optional</legend>{checks.map((text, index) => <label key={text}><input type="checkbox" disabled={copying} checked={checked[index]} onChange={() => setChecked(checked.map((value, position) => position === index ? !value : value))} />{text}</label>)}</fieldset>
      <div className="practice-actions"><button className="btn btn-primary" type="button" disabled={!draft.trim() || copying} onClick={() => { setReviewing(!reviewing); setStatus(""); requestAnimationFrame(() => reviewing ? field.current?.focus() : review.current?.focus()); }}>{reviewing ? "Edit my words" : "Review my words"}</button><button type="button" className="btn btn-ghost" disabled={!draft.trim() || copying} onClick={copy}>{copying ? "Copying…" : "Copy my practice"}</button><button type="button" className="btn btn-ghost" disabled={(!draft && !checked.some(Boolean)) || copying} onClick={clear}>Clear practice</button></div>
      <p role="status" ref={feedback} className="practice-status">{status}</p>
    </div>
    <p className="practice-notebook">Want to keep a note? <Link href="/me/journal" className="inline-link">Open your private notebook</Link> and choose what to save. Your draft is never transferred automatically.</p>
    <noscript><p>Interactive writing needs JavaScript. You can write privately in your own notebook, or <Link href="/me/journal">open your account notes</Link>.</p><style>{`.practice-controls{display:none}`}</style></noscript>
  </section>;
}
