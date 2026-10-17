import type { Metadata } from "next";
import Link from "next/link";
import { ArchFrame, Crescent } from "@/components/art";
import { Journeys, MentorRequest, PrivateNotes, SillyWall } from "@/components/sanctuary";
import { QuranPassage, SectionTitle } from "@/components/ui";
import { sanctuaryQuestions } from "@/lib/fixtures/content";

export const metadata: Metadata = { title: "Reverts HQ", description: "Welcome home. A calm sanctuary of first steps — private, gentle, no rankings." };

const resources = [
  { title: "How to make wuḍūʾ", kind: "Illustrated guide", status: "Planned" },
  { title: "Beginner duʿāʾ", kind: "Short reading", status: "Planned" },
  { title: "Finding a welcoming mosque", kind: "Checklist", status: "Planned" },
  { title: "Your first Ramadan", kind: "Gentle guide", status: "Planned" },
];

export default function RevertsPage() {
  return (
    <div data-world="sanctuary" className="pb-10">
      <header className="relative overflow-hidden" style={{ background: "linear-gradient(160deg,#6d4fc2 0%,#9a7ad6 45%,#c9b4f0 80%,#ece4fb 100%)" }}>
        <Crescent size={160} className="pointer-events-none absolute right-[4%] top-3 h-auto w-20 opacity-90 sm:right-[6%] sm:top-6 sm:w-40" />
        <ArchFrame className="pointer-events-none absolute -bottom-16 left-[55%] hidden h-[26rem] opacity-30 md:block" stroke="#ffffff" />
        <div className="shell relative pb-16 pt-14">
          <p className="eyebrow" style={{ color: "#fff" }}>Reverts HQ · you belong here</p>
          <h1 className="portal-enter mt-4 max-w-3xl text-6xl leading-[0.88] text-white sm:text-8xl">
            Welcome home, <em style={{ color: "#fff3d6" }}>new Muslim</em> <span aria-hidden="true">☾</span>
          </h1>
          <p lang="ar" className="ar mt-2 text-3xl text-white/90">مَرْحَبًا بِكَ فِي بَيْتِك</p>
          <p className="mt-3 max-w-xl text-lg text-white/90">You took the bravest step. Now let&rsquo;s walk the next ones together — slowly, privately, at your pace.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#journeys" className="btn bg-white text-[#4f2f99]">Start your journey</a>
            <a href="#ask" className="btn border border-white/70 text-white">No silly questions here</a>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-white">
            {["No public rankings", "No streak pressure", "Private by default", "Ask anonymously"].map((t) => (
              <li key={t} className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em]"><span aria-hidden="true">✦</span>{t}</li>
            ))}
          </ul>
        </div>
      </header>

      <section id="journeys" className="shell scroll-mt-24 pt-16" aria-labelledby="j">
        <SectionTitle eyebrow="Start your journey" title={<span id="j">Gentle paths</span>}>
          Calmer by design: soft progress marks, no leaderboards, and nothing about your journey is ever shown publicly.
        </SectionTitle>
        <Journeys />
      </section>

      <section id="near" className="shell scroll-mt-24 pt-16" aria-labelledby="n">
        <SectionTitle eyebrow="For the one who asks" title={<span id="n">&ldquo;Indeed, <em>I am near.</em>&rdquo;</span>} />
        <QuranPassage id="2:186" />
      </section>

      <section className="shell pt-16" aria-labelledby="res">
        <SectionTitle eyebrow="Essential resources" title={<span id="res">Resources</span>} />
        <ul className="grid gap-3 sm:grid-cols-2">
          {resources.map((r) => (
            <li key={r.title} className="card flex items-center gap-4 p-4">
              <span className="hex grid h-10 w-10 shrink-0 text-white" style={{ background: "#7a5cc4" }} aria-hidden="true">✦</span>
              <span className="flex-1">
                <span className="block font-semibold" style={{ color: "#2b2140" }}>{r.title}</span>
                <span className="text-sm" style={{ color: "#5b4e73" }}>{r.kind}</span>
              </span>
              <span className="tag-planned">{r.status}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="ask" className="shell scroll-mt-24 pt-16" aria-labelledby="ask-t">
        <SectionTitle eyebrow="No silly questions here" title={<span id="ask-t">Ask anything</span>}>
          Gentle answers to common questions. For rulings and specifics, please ask a qualified teacher you trust — this app offers learning routes, not fatwas.
        </SectionTitle>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <ul className="grid gap-3">
            {sanctuaryQuestions.map((q) => (
              <li key={q.id}>
                <Link href={`/reverts/ask/${q.id}`} className="card card-hover block p-5">
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em]" style={{ color: "#7a5cc4" }}>{q.asked}</span>
                  <span className="mt-1 block text-lg font-semibold" style={{ color: "#2b2140" }}>{q.q}</span>
                  <span className="mt-1 block text-sm" style={{ color: "#5b4e73" }}>Read the gentle answer ⟶</span>
                </Link>
              </li>
            ))}
          </ul>
          <SillyWall />
        </div>
      </section>

      <section className="shell grid gap-6 pt-16 lg:grid-cols-2" aria-label="Mentor and notes">
        <MentorRequest />
        <PrivateNotes />
      </section>
    </div>
  );
}
