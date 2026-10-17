import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tag } from "@/components/ui";
import { sanctuaryQuestions } from "@/lib/fixtures/content";

export function generateStaticParams() {
  return sanctuaryQuestions.map((q) => ({ id: q.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: sanctuaryQuestions.find((q) => q.id === id)?.q ?? "Question" };
}

export default async function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const q = sanctuaryQuestions.find((x) => x.id === id);
  if (!q) notFound();
  const others = sanctuaryQuestions.filter((x) => x.id !== id);
  return (
    <div data-world="sanctuary" className="pb-16" style={{ background: "linear-gradient(180deg,#ece4fb 0%,#fbf7f0 40%)" }}>
      <article className="shell max-w-3xl pt-10">
        <nav aria-label="Breadcrumb" className="font-mono text-xs uppercase tracking-wider" style={{ color: "#7a5cc4" }}>
          <Link href="/reverts">Reverts HQ</Link> <span aria-hidden="true">{"//"}</span> <Link href="/reverts#ask">Ask anything</Link>
        </nav>
        <div className="mt-6 flex flex-wrap gap-2"><Tag kind="sample">Sample community question</Tag><Tag kind="pending-review">Answer pending scholarly review</Tag></div>
        <h1 className="mt-4 text-5xl leading-[0.92] sm:text-6xl" style={{ color: "#1f1733" }}>{q.q}</h1>
        <div className="card mt-8 p-6 sm:p-8">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em]" style={{ color: "#7a5cc4" }}>{"// "}A gentle answer</p>
          <p className="mt-3 text-lg leading-relaxed" style={{ color: "#2b2140" }}>{q.a}</p>
          <p className="mt-6 border-t pt-4 text-sm" style={{ borderColor: "rgba(122,92,196,0.2)", color: "#5b4e73" }}>
            Written as general encouragement for this concept, not a religious ruling. Please ask a qualified teacher you trust about your situation.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/reverts#ask" className="btn btn-accent">Ask your own question</Link>
          <Link href="/reverts#journeys" className="btn btn-ghost">Gentle paths</Link>
        </div>
        <h2 className="mt-12 text-3xl" style={{ color: "#2b2140" }}>Other questions</h2>
        <ul className="mt-3 grid gap-2">
          {others.map((o) => (
            <li key={o.id}><Link href={`/reverts/ask/${o.id}`} className="card card-hover block p-4" style={{ color: "#2b2140" }}>{o.q}</Link></li>
          ))}
        </ul>
      </article>
    </div>
  );
}
