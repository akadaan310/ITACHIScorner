"use client";

import Link from "next/link";
import { useState } from "react";
import { creator } from "@/lib/config/creator";

const steps = ["Question", "Source", "Related", "Notes"];
const topics = ["Belief", "Scripture", "Dialogue", "A personal question"];

/** A visitor-operated guide, never a fabricated source answer or attributed lesson. */
export function QuestionJourney() {
  const [step, setStep] = useState(0);
  const [question, setQuestion] = useState("");
  const [topic, setTopic] = useState("");
  return <div className="question-journey" data-testid="question-journey">
    <p className="journey-intro">Try the path with your own question. Your words stay in this page and disappear on refresh.</p>
    <ol className="journey-steps" aria-label="Follow a question">{steps.map((label, index) => <li key={label}><button type="button" aria-pressed={step === index} aria-controls="journey-panel" onClick={() => setStep(index)}><span>{index + 1}</span> {label}</button></li>)}</ol>
    <div id="journey-panel" className="journey-panel" aria-live="polite">
      {step === 0 && <><p className="public-eyebrow">Begin in your own words</p><h3>What would you like to understand?</h3><label htmlFor="journey-question">A question to carry with you</label><textarea id="journey-question" value={question} maxLength={1200} spellCheck={false} onChange={event => setQuestion(event.target.value)} placeholder="Write your own question…" /><p>No answer is generated. This is a guide to finding context, not an Itachi lesson.</p></>}
      {step === 1 && <><p className="public-eyebrow">Follow the conversation</p><h3>Start with the original.</h3><p>A reviewed question will link to its source moment and the words around it. No source answer is attached to this walkthrough.</p><div className="journey-path"><Link href="/explore" className="chapter-link">Search reviewed questions</Link><a href={creator.links.youtube} className="chapter-link" target="_blank" rel="noopener noreferrer">Visit the official YouTube channel<span className="sr-only"> (opens a new tab)</span></a></div></>}
      {step === 2 && <><p className="public-eyebrow">Choose your direction</p><h3>What does your question touch on?</h3><p>Choose a label for your own note. These are your categories, not findings from Itachi&rsquo;s conversations.</p><div className="journey-topics">{topics.map(label => <button type="button" key={label} aria-pressed={topic === label} onClick={() => setTopic(topic === label ? "" : label)}>{label}</button>)}</div></>}
      {step === 3 && <><p className="public-eyebrow">Take something with you</p><h3>A note, in your own voice.</h3><div className="journey-note"><p>{question.trim() || "Your question will appear here when you write one in step 1."}</p>{topic && <span>Your label: {topic}</span>}</div><p>Keep reflecting in the question desk below. For a lasting private note, open your account notebook and choose what to save. Nothing is transferred automatically.</p><div className="journey-path"><a href="#question-desk" className="chapter-link">Open the question desk</a><Link href="/me/journal" className="chapter-link">Your private notebook</Link></div></>}
    </div>
    <noscript><p className="journey-nojs">This walkthrough needs JavaScript. You can <Link href="/explore">search the collection</Link> or <Link href="/me/journal">open private notes</Link> directly.</p><style>{`.journey-steps,.journey-panel,.journey-intro{display:none}`}</style></noscript>
  </div>;
}
