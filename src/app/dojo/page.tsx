import type { Metadata } from "next";
import Link from "next/link";
import { SimStats } from "@/components/sim-stats";
import { HexIcon, QuranPassage, SectionTitle, Tag } from "@/components/ui";
import { StarField } from "@/components/art";

export const metadata: Metadata = { title: "Dawah Simulator", description: "Train. Playable dialogue practice scored on clarity, fairness, evidence and listening." };

const drills = [
  { type: "Choose the next question", body: "Pick the question that opens the door. Explain why.", href: "/dojo/path?step=2", color: "#26C4B3", glyph: "?" },
  { type: "Spot the hidden assumption", body: "Find the unstated premise — and name it gently.", href: "/dojo/path?step=3", color: "#F0657A", glyph: "◇" },
  { type: "Match evidence to claim", body: "Relevant evidence beats impressive evidence.", href: "/dojo/path?step=4", color: "#F7C65B", glyph: "⇄" },
];

const personas = [
  { name: "Sami", role: "The curious friend", color: "#26C4B3", level: 1, note: "Thinks all religions say the same thing." },
  { name: "Dana", role: "The skeptic", color: "#FA536D", level: 3, note: "Wants evidence before anything else." },
  { name: "Yusuf", role: "Returning learner", color: "#F7C65B", level: 1, note: "Has old questions he never asked." },
  { name: "Maya", role: "Comparative religion student", color: "#A58BE1", level: 2, note: "Knows the texts; tests your precision." },
];

export default function DojoPage() {
  return (
    <div data-world="dojo" className="pb-10">
      <header className="relative overflow-hidden" style={{ background: "linear-gradient(180deg,#081e1f 0%,#0b0a14 100%)" }}>
        <StarField seed={31} count={80} height={500} className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />
        <div className="pointer-events-none absolute inset-0 pattern-mashrabiya opacity-15" />
        <div className="shell relative grid gap-8 pb-12 pt-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div className="portal-enter">
            <p className="eyebrow">Dawah Simulator · practice tier</p>
            <h1 className="mt-3 text-8xl leading-[0.82] text-cream sm:text-[9rem]">Train.</h1>
            <p className="mt-4 max-w-xl text-lg text-cream/75">
              Practise the conversation before the conversation. Every exercise is scored on <strong className="text-teal">clarity</strong>,{" "}
              <strong className="text-teal">fair representation</strong>, <strong className="text-teal">evidence</strong> and{" "}
              <strong className="text-teal">careful listening</strong> — never on humiliating anyone.
            </p>
          </div>
          <div className="space-y-4">
            <SimStats />
            <div className="card border-l-4 border-l-amber p-5">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-amber">{"// "}Daily challenge · +50 credits on completion</p>
              <h2 className="mt-2 text-3xl text-cream">Why One? A path of reasoning</h2>
              <p className="mt-1 text-sm text-cream/65">Six steps · about 7 minutes</p>
              <Link href="/dojo/path" className="btn btn-gold mt-4 w-full">Accept</Link>
            </div>
          </div>
        </div>
      </header>

      <section className="shell mt-14" aria-labelledby="drills">
        <SectionTitle eyebrow="Three exercise types" title={<span id="drills">Drills</span>} />
        <ul className="grid gap-4 md:grid-cols-3">
          {drills.map((d) => (
            <li key={d.type}>
              <Link href={d.href} className="card card-hover block h-full p-6" style={{ borderTop: `3px solid ${d.color}` }}>
                <HexIcon color={d.color} glyph={d.glyph} size="h-12 w-12" />
                <h3 className="mt-4 text-3xl text-cream">{d.type}</h3>
                <p className="mt-1 text-sm text-cream/70">{d.body}</p>
                <span className="mt-4 inline-block font-mono text-[0.65rem] uppercase tracking-[0.18em]" style={{ color: d.color }}>Play ⟶</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell mt-14" aria-labelledby="personas">
        <div className="flex flex-wrap items-center gap-3">
          <SectionTitle eyebrow="Practice partners" title={<span id="personas">Personas</span>} />
        </div>
        <p className="-mt-5 mb-6 flex flex-wrap items-center gap-2 text-sm text-cream/65"><Tag kind="simulated">Simulated</Tag> Fictional practice partners. They are not real people, never represent a real opponent, and never speak for Itachi.</p>
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {personas.map((p) => (
            <li key={p.name}>
              <Link href="/dojo/path" className="card card-hover block h-full p-5">
                <span className="hex grid h-14 w-14 font-display text-3xl text-[#0b1a1a]" style={{ background: p.color }}>{p.name[0]}</span>
                <span className="mt-3 block font-display text-3xl leading-none text-cream">{p.name}</span>
                <span className="mt-1 block font-mono text-[0.6rem] uppercase tracking-[0.16em]" style={{ color: p.color }}>{p.role}</span>
                <span className="mt-2 block text-xs text-cream/60">{p.note}</span>
                <span className="mt-2 block text-xs text-amber" aria-label={`difficulty ${p.level} of 3`}>{"★".repeat(p.level)}{"☆".repeat(3 - p.level)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="wisdom" className="shell mt-16 grid scroll-mt-24 gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center" aria-labelledby="standard">
        <div>
          <SectionTitle eyebrow="The standard" title={<span id="standard">&ldquo;In a way <em className="text-teal">that is best.</em>&rdquo;</span>}>
            The Simulator is built around one standard: wisdom, good instruction, and the best manner of discussion. No combat, no conversion scores, no opponent humiliation.
          </SectionTitle>
        </div>
        <QuranPassage id="16:125" />
      </section>
    </div>
  );
}
