import type { Metadata } from "next";
import Link from "next/link";
import { Mark, Medallion, StarField } from "@/components/art";
import { SectionTitle, Tag } from "@/components/ui";
import { book } from "@/lib/fixtures/content";

export const metadata: Metadata = { title: "The Library", description: "An editorial book room — and a preview of a planned illustrated book concept." };

export default function LibraryPage() {
  return (
    <div data-world="library" className="pb-16" style={{ background: "linear-gradient(180deg,#efe3c6 0%,#f7eedb 60%,#efe3c6 100%)" }}>
      <header className="shell grid gap-10 pb-10 pt-14 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="portal-enter">
          <p className="eyebrow">The Library · book room</p>
          <h1 className="mt-4 text-6xl leading-[0.88] sm:text-8xl" style={{ color: "#2a1f17" }}>
            {book.title}<span className="block font-serif text-3xl normal-case italic sm:text-4xl" style={{ color: "#9a3b2c" }}>{book.subtitle}</span>
          </h1>
          <div className="mt-5 flex flex-wrap gap-2"><Tag kind="planned">{book.status}</Tag><Tag kind="sample">{book.pagesPlanned}</Tag></div>
          <p className="mt-5 max-w-xl text-lg leading-relaxed" style={{ color: "#5e4b3a" }}>{book.note}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/library/preview" className="btn btn-accent">Open the sample preview</Link>
            <Link href="/membership" className="btn btn-ghost">Collectible edition (future)</Link>
          </div>
        </div>
        {/* Physical book mockup */}
        <div className="relative mx-auto h-[26rem] w-[19rem] [perspective:1400px]" aria-label="Mockup of the planned book" role="img">
          <div className="absolute inset-0 [transform:rotateY(-24deg)_rotateX(4deg)] [transform-style:preserve-3d] motion-safe:animate-float">
            <div className="absolute inset-0 overflow-hidden rounded-r-md bg-[linear-gradient(160deg,#1d1530,#0b0a14_60%,#3a1426)] shadow-[30px_40px_60px_-20px_rgba(60,30,10,0.6)]">
              <StarField seed={12} count={50} width={300} height={420} className="absolute inset-0 h-full w-full" twinkle={false} />
              <div className="relative flex h-full flex-col items-center justify-center p-6 text-center">
                <Medallion className="w-32" />
                <p className="mt-5 font-display text-4xl leading-none text-cream">{book.title}</p>
                <p className="mt-2 font-mono text-[0.55rem] uppercase tracking-[0.3em] text-coral">Planned concept</p>
                <div className="mt-5"><Mark size={30} title="" /></div>
              </div>
              <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/50 to-transparent" />
            </div>
            <div className="absolute right-0 top-[3px] h-[calc(100%-6px)] w-8 origin-right bg-[repeating-linear-gradient(90deg,#f5ead2_0,#f5ead2_2px,#e2d3b0_2px,#e2d3b0_3px)] [transform:rotateY(90deg)_translateZ(0)]" />
          </div>
        </div>
      </header>

      <section className="shell mt-6" aria-labelledby="spreads">
        <SectionTitle eyebrow="Sample spreads" title={<span id="spreads">Inside the concept</span>}>Original layouts with placeholder text. No findings, no quotes, nothing written in the creator&rsquo;s voice.</SectionTitle>
        <ul className="grid gap-5 md:grid-cols-3">
          {book.pages.filter((p) => ["contents", "passage", "spread"].includes(p.kind)).map((p) => (
            <li key={p.id}>
              <Link href={`/library/preview?page=${p.id}`} className="card card-hover block h-full p-6">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em]" style={{ color: "#9a3b2c" }}>Page {p.id}</p>
                <h3 className="mt-2 text-3xl" style={{ color: "#2a1f17" }}>{p.title}</h3>
                <p className="mt-2 line-clamp-3 font-serif" style={{ color: "#5e4b3a" }}>{p.body ?? "Planned table of contents."}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell mt-14" aria-labelledby="shelf">
        <SectionTitle eyebrow="On the shelf" title={<span id="shelf">Learning collections</span>} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Afterglow anthologies", "Curated recaps by theme", "/afterglow/vault"],
            ["Simulator workbooks", "Printable practice paths", "/dojo"],
            ["Atlas field notes", "Star-by-star reading lists", "/atlas"],
            ["Reverts HQ primers", "Gentle first readings", "/reverts"],
          ].map(([t, b, h]) => [t!, b!, h!] as const).map(([t, b, h]) => (
            <li key={t}>
              <Link href={h} className="card card-hover block h-full p-5" style={{ borderTop: "3px solid #9a3b2c" }}>
                <span className="block text-2xl" style={{ color: "#2a1f17" }}>{t}</span>
                <span className="text-sm" style={{ color: "#5e4b3a" }}>{b}</span>
                <span className="mt-3 block"><Tag kind="planned">Planned</Tag></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
