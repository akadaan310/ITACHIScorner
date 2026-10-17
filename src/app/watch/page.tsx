import type { Metadata } from "next";
import { ArsenalSearch } from "@/components/arsenal";
import { StarField } from "@/components/art";
import { WatchButtons } from "@/components/ui";

export const metadata: Metadata = { title: "Search the Arsenal", description: "Searchable dialogues and sources, always linking back to the original videos." };

export default function WatchPage() {
  return (
    <div className="pb-10">
      <header className="relative overflow-hidden pb-6 pt-14 text-center">
        <StarField seed={8} count={90} height={400} className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_at_50%_0%,rgba(250,83,109,0.25),transparent_60%)]" />
        <div className="shell relative">
          <p className="eyebrow justify-center">Sources · dialogues · answers · references</p>
          <h1 className="portal-enter mt-4 text-6xl leading-[0.88] text-cream sm:text-8xl">
            Search the <span className="text-coral">Arsenal.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-cream/70">Find a dialogue, a reference or a practice drill — then watch the original on the official channel.</p>
        </div>
      </header>
      <div className="shell mt-6">
        <ArsenalSearch />
        <div className="card mt-14 flex flex-col items-start gap-4 p-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl text-cream">Watch the originals</h2>
            <p className="text-sm text-cream/65">Every full dialogue lives on Itachi&rsquo;s official channels.</p>
          </div>
          <WatchButtons live={false} />
        </div>
      </div>
    </div>
  );
}
