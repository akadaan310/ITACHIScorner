import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DojoPathRunner } from "@/components/dojo";
import { dojoPath } from "@/lib/fixtures/dojo";

export const metadata: Metadata = { title: "Simulator path · Why One?", description: "A six-step practice path with feedback on clarity, fairness, evidence and listening." };

export default function DojoPathPage() {
  return (
    <div data-world="dojo" className="pb-10">
      <div className="shell pt-8">
        <nav aria-label="Breadcrumb" className="font-mono text-xs uppercase tracking-wider text-cream/60">
          <Link href="/dojo" className="hover:text-cream">Dawah Simulator</Link> <span aria-hidden="true">{"//"}</span> <span className="text-cream">Path</span>
        </nav>
        <h1 className="mt-4 text-5xl leading-[0.9] text-cream sm:text-7xl">{dojoPath.title}</h1>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-teal">{dojoPath.subtitle}</p>
      </div>
      <div className="shell mt-8">
        <Suspense fallback={<div className="card p-8 text-cream/70">Loading your path…</div>}>
          <DojoPathRunner />
        </Suspense>
      </div>
    </div>
  );
}
