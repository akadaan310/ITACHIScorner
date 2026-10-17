import type { Metadata } from "next";
import Link from "next/link";
import { CompanionDock } from "@/components/afterglow/dock";

export const metadata: Metadata = { title: "Companion dock (demo live)", description: "An optional second-screen companion. The live itself stays on TikTok/YouTube." };

export default function LivePage() {
  return (
    <div data-world="afterglow" className="pb-10">
      <div className="shell pt-8">
        <nav aria-label="Breadcrumb" className="text-sm text-cream/60">
          <Link href="/afterglow" className="hover:text-cream">Afterglow</Link> <span aria-hidden="true">/</span> <span className="text-cream">During the live</span>
        </nav>
        <p className="eyebrow mt-6">Act II · During the live</p>
        <h1 className="mt-3 font-display text-4xl text-cream sm:text-5xl">The companion dock</h1>
        <p className="mt-3 max-w-2xl text-cream/70">
          Keep your eyes on the real live. This dock is here if you want it — and it&rsquo;s honest about what it can and can&rsquo;t know.
        </p>
      </div>
      <div className="shell mt-8">
        <CompanionDock />
      </div>
    </div>
  );
}
