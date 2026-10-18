import { Arrow } from "@/components/art";
import Link from "next/link";
import { Hero } from "@/components/hero";

const steps = [
  { number: "01", title: "Follow the source", body: "Conversations will link to the original video and the exact moment behind each question." },
  { number: "02", title: "Take your time", body: "Learning journeys will follow careful review of real conversations. They are still being prepared." },
  { number: "03", title: "Make room to reflect", body: "Thoughtful practice and personal progress will follow when the material is ready." },
];

export default function Home() {
  return <><Hero />
    <section className="shell home-question" aria-labelledby="home-question"><div><p className="public-eyebrow">A question worth your time</p><h2 id="home-question">Good dialogue<br />starts with <em>care.</em></h2></div><div className="question-note"><span className="status-label">The collection is taking shape</span><p className="mt-4 text-lg leading-relaxed text-cream/80">Real questions. Original conversations. Room to understand what was actually said.</p><p className="mt-4 text-sm leading-relaxed text-cream/65">The first sourced conversations will appear here after permission and review. For now, the collection is empty.</p></div></section>
    <section className="home-process" aria-labelledby="process-title"><div className="shell"><p className="public-eyebrow">From curiosity to understanding</p><h2 id="process-title" className="mt-4 text-4xl text-cream sm:text-5xl">Stay curious. <em>Go thoughtfully.</em></h2><ol className="process-grid">{steps.map((step) => <li key={step.number}><span className="process-number">{step.number}</span><h3>{step.title}</h3><p>{step.body}</p></li>)}</ol></div></section>
    <section className="shell home-personal" aria-labelledby="personal-title"><div><p className="public-eyebrow">Your own pace. Your own space.</p><h2 id="personal-title">A corner <em>of your own.</em></h2><p>Personal notes and saved questions belong to you. Account availability and privacy controls are explained in My Corner.</p></div><Link href="/me" className="inline-link flex min-h-11 shrink-0 items-center gap-3">Visit My Corner <Arrow /></Link></section>
  </>;
}
