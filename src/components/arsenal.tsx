"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { StarField } from "@/components/art";
import { PlatformIcon, Tag } from "@/components/ui";
import { creator } from "@/lib/config/creator";
import { dialogueCatalog } from "@/lib/fixtures/content";

const suggestions = ["Oneness", "Asking well", "Signs", "First steps", "Compulsion"];

export function ArsenalSearch() {
  const [q, setQ] = useState("");
  const [format, setFormat] = useState<string>("All");
  const [platform, setPlatform] = useState<string>("All");
  const formats = ["All", ...Array.from(new Set(dialogueCatalog.map((d) => d.format)))];
  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return dialogueCatalog.filter(
      (d) =>
        (format === "All" || d.format === format) &&
        (platform === "All" || d.platform === platform) &&
        (!needle || [d.title, d.summary, ...d.topics].join(" ").toLowerCase().includes(needle)),
    );
  }, [q, format, platform]);

  return (
    <div>
      <form role="search" className="hud mx-auto max-w-3xl" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="arsenal-q" className="sr-only">Search the Arsenal</label>
        <div className="flex items-center gap-2 rounded-lg border-2 border-coral bg-black/50 p-1.5 shadow-[0_0_40px_-10px_rgba(250,83,109,0.6)]">
          <span className="hidden pl-3 font-mono text-coral sm:inline" aria-hidden="true">{"//"}</span>
          <input id="arsenal-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="What did they say about Oneness?" className="min-h-12 min-w-0 flex-1 bg-transparent text-base text-cream outline-none placeholder:text-cream/60" />
          <button type="submit" className="btn btn-primary">Search</button>
        </div>
      </form>
      <div className="mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-2" aria-label="Suggested searches">
        {suggestions.map((s) => (
          <button key={s} type="button" onClick={() => setQ(s)} className="min-h-9 rounded border border-coral/40 px-3 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-cream/80 hover:bg-coral/10">
            {s}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[15rem_1fr]">
        <aside aria-label="Filters" className="space-y-5">
          <fieldset className="card p-4">
            <legend className="px-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-coral">{"// "}Format</legend>
            {formats.map((f) => (
              <label key={f} className="flex min-h-10 cursor-pointer items-center gap-2 text-sm text-cream/85">
                <input type="radio" name="format" checked={format === f} onChange={() => setFormat(f)} className="h-4 w-4 accent-[#FA536D]" /> {f}
              </label>
            ))}
          </fieldset>
          <fieldset className="card p-4">
            <legend className="px-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-coral">{"// "}Platform</legend>
            {["All", "youtube", "tiktok"].map((p) => (
              <label key={p} className="flex min-h-10 cursor-pointer items-center gap-2 text-sm capitalize text-cream/85">
                <input type="radio" name="platform" checked={platform === p} onChange={() => setPlatform(p)} className="h-4 w-4 accent-[#FA536D]" /> {p === "youtube" ? "YouTube" : p === "tiktok" ? "TikTok" : "All"}
              </label>
            ))}
          </fieldset>
          <button type="button" className="btn btn-ghost w-full" onClick={() => { setQ(""); setFormat("All"); setPlatform("All"); }}>Clear filters</button>
        </aside>

        <section aria-live="polite" aria-labelledby="results-title">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="results-title" className="text-3xl text-cream">{q ? <>Results for <span className="text-coral">“{q}”</span></> : "Recent battles of ideas"}</h2>
            <p className="font-mono text-xs uppercase tracking-wider text-cream/65">{results.length} sample entries</p>
          </div>
          <p className="mt-2 rounded-lg border border-violet/30 bg-violet/5 p-3 text-sm text-cream/75">
            <Tag kind="sample">Sample catalogue</Tag> These rows are illustrative. Real entries will only be added with verified source URLs, accurate summaries and no invented quotes.
          </p>
          {results.length === 0 ? (
            <div className="card mt-6 p-10 text-center">
              <p className="font-display text-3xl text-cream">No stars here yet.</p>
              <p className="mt-2 text-cream/65">Try another word, or ask it on the Night Atlas.</p>
            </div>
          ) : (
            <ul className="mt-6 space-y-4">
              {results.map((d, i) => (
                <li key={d.id} className="card grid gap-4 overflow-hidden p-4 sm:grid-cols-[13rem_1fr_auto] sm:items-center" style={{ borderLeft: "3px solid #FA536D" }}>
                  <div className="relative aspect-video overflow-hidden rounded-md" style={{ background: `linear-gradient(135deg, ${["#3a1426", "#13312f", "#2b1f4a", "#3d2a12", "#1f2a44", "#3a1426"][i % 6]}, #0d0b14)` }}>
                    <StarField seed={60 + i} count={18} width={260} height={146} className="absolute inset-0 h-full w-full" twinkle={false} />
                    <span className="absolute inset-0 m-auto grid h-10 w-10 place-items-center rounded-full border border-coral/60 bg-black/50 text-coral" aria-hidden="true">▶</span>
                    <span className="absolute left-2 top-2"><Tag kind="sample">Sample</Tag></span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-coral">{d.format} · {d.minutes} min · {d.topics.join(" · ")}</p>
                    <h3 className="mt-1 text-2xl leading-tight text-cream">{d.title}</h3>
                    <p className="mt-1 text-sm text-cream/70">{d.summary}</p>
                  </div>
                  <div className="flex gap-2 sm:flex-col">
                    <a href={d.platform === "youtube" ? creator.links.youtube : creator.links.tiktok} target="_blank" rel="noopener noreferrer" className="btn btn-primary !min-h-10">
                      <PlatformIcon platform={d.platform} /> Channel ↗
                    </a>
                    <Link href="/dojo/path" className="btn btn-ghost !min-h-10">Practise</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
