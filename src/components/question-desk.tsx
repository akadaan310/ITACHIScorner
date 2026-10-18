"use client";

import { useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/art";

export function QuestionDesk() {
  const [question, setQuestion] = useState("");
  const [reflection, setReflection] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [copying, setCopying] = useState(false);
  const [status, setStatus] = useState({ message: "", isCopyResult: false });
  const questionInput = useRef<HTMLTextAreaElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const statusElement = useRef<HTMLParagraphElement>(null);
  const hasWords = Boolean(question.trim() || reflection.trim());

  useEffect(() => {
    if (status.isCopyResult) {
      statusElement.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
    }
  }, [status]);

  async function copyDraft() {
    setCopying(true);
    setStatus({ message: "", isCopyResult: false });
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(`My question\n${question}\n\nMy reflection\n${reflection}`);
      setStatus({ message: "Draft copied. Keep it somewhere you control.", isCopyResult: true });
    } catch {
      setStatus({ message: "Couldn't copy your draft. Your words are still here; select and copy them manually.", isCopyResult: true });
    } finally {
      setCopying(false);
    }
  }

  function clearDraft() {
    setQuestion("");
    setReflection("");
    setReviewing(false);
    setStatus({ message: "Draft cleared from this desk.", isCopyResult: false });
    requestAnimationFrame(() => questionInput.current?.focus());
  }

  function toggleReview() {
    setStatus({ message: "", isCopyResult: false });
    setReviewing(!reviewing);
    requestAnimationFrame(() => {
      if (reviewing) questionInput.current?.focus();
      else preview.current?.focus();
    });
  }

  return <div className="question-desk">
    <div className="desk-topline"><span>Your writing desk</span><span aria-hidden="true">✧</span><span>Just this visit</span></div>
    <p id="desk-privacy" className="desk-privacy">Only in this page&rsquo;s memory. Nothing is sent or saved. Refreshing or leaving this page loses your draft; copy it first if you want to keep it.</p>
    <noscript><style>{".question-desk-interactive{display:none!important}"}</style><p className="desk-nojs">This scratchpad needs JavaScript to edit, review, copy and clear a draft. You can write in your own notebook instead. All page sections and navigation still work.</p></noscript>
    <div className="question-desk-interactive" aria-describedby="desk-privacy">
      {reviewing ? <div ref={preview} role="group" tabIndex={-1} className="desk-preview" aria-label="Your draft"><p className="desk-field-label">Your question</p><p className="draft-words">{question || "No question added."}</p><p className="desk-field-label">Your reflection</p><p className="draft-words">{reflection || "No reflection added."}</p><p className="desk-preview-note">Your words, exactly as you wrote them. Nothing has been answered, assessed or saved.</p></div> : <div className="desk-fields"><label htmlFor="desk-question">Your question</label><textarea ref={questionInput} id="desk-question" value={question} disabled={copying} onChange={(event) => { setQuestion(event.target.value); setStatus({ message: "", isCopyResult: false }); }} rows={3} placeholder="Write what you want to understand…" autoComplete="off" spellCheck={false} maxLength={8000} /><label htmlFor="desk-reflection">Your reflection <span aria-hidden="true">(optional)</span></label><textarea id="desk-reflection" value={reflection} disabled={copying} onChange={(event) => { setReflection(event.target.value); setStatus({ message: "", isCopyResult: false }); }} rows={3} placeholder="What do you want to come back to?" autoComplete="off" spellCheck={false} maxLength={8000} /></div>}
      <div className="desk-actions"><button type="button" className="desk-review" disabled={!hasWords || copying} onClick={toggleReview}>{reviewing ? "Edit draft" : "Review draft"}<Arrow /></button><button type="button" disabled={!hasWords || copying} onClick={copyDraft}>{copying ? "Copying…" : "Copy draft"}</button><button type="button" disabled={!hasWords || copying} onClick={clearDraft}>Clear draft</button></div>
      <p ref={statusElement} role="status" aria-live="polite" aria-atomic="true" className="desk-status">{status.message}</p>
    </div>
  </div>;
}
