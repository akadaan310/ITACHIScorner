import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/public-content";
import { PracticeComposer } from "@/components/practice-composer";
export const metadata: Metadata = { title: "Practice", description: "A private place to practise your own writing, listening and reflection." };
export default function PracticePage() {
  return <div className="public-page"><PublicHeader label="Practice" title={<>Listen closely.<br /><em>Find your own words.</em></>}><p>Pick a prompt. Take your time. Return to what you actually mean.</p></PublicHeader><div className="shell"><PracticeComposer /><section className="quiet-section"><p className="public-eyebrow">For source-based practice</p><h2>Real conversations come first.</h2><p>Exercises drawn from Itachi&rsquo;s conversations require source permission and review. This writing space is available now, without religious answers, debate scores or claims about your faith.</p><p>Prefer a simple question and reflection? <Link className="inline-link" href="/#question-desk">Use the question desk</Link>.</p></section></div></div>;
}
