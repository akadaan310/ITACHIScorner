import type { Metadata } from "next";
import { ChapterHeader } from "@/components/ui";
import { faqs } from "@/lib/fixtures/content";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <div className="pb-10">
      <ChapterHeader eyebrow="Questions" title={<>Ask <em className="text-coral">anything.</em></>}>Common questions about this concept.</ChapterHeader>
      <div className="shell"><div className="max-w-3xl space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="card group p-5 open:border-coral/50">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-display text-2xl text-cream [&::-webkit-details-marker]:hidden">
              {f.q}<span className="font-sans text-coral transition-transform group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p className="mt-3 leading-relaxed text-cream/75">{f.a}</p>
          </details>
        ))}
      </div></div>
    </div>
  );
}
