"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Mark, Medallion, StarField } from "@/components/art";
import { Tag } from "@/components/ui";
import { book, type BookPage } from "@/lib/fixtures/content";
import { getRef } from "@/lib/fixtures/quran";
import { useDemo, useHydrated } from "@/lib/store";

const arabicDigits = (n: number) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]!);

function PageBody({ p }: { p: BookPage }) {
  const ref = p.refId ? getRef(p.refId) : undefined;
  if (p.kind === "cover") {
    return (
      <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-r-md bg-[linear-gradient(160deg,#1d1530,#0b0a14_60%,#3a1426)] p-8 text-center">
        <StarField seed={12} count={60} width={400} height={560} className="absolute inset-0 h-full w-full" twinkle={false} />
        <Medallion className="relative w-40 opacity-90" />
        <p className="relative mt-6 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-coral">Planned concept</p>
        <h3 className="relative mt-2 font-display text-5xl leading-none text-cream">{book.title}</h3>
        <p className="relative mt-3 font-serif text-sm italic text-cream/80">{p.body}</p>
        <div className="relative mt-6"><Mark size={36} title="" /></div>
      </div>
    );
  }
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-r-md bg-[#fbf3df] p-6 text-[#2a1f17] sm:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#5e4b3a_1px,transparent_1px)] [background-size:6px_6px]" />
      <p className="relative font-mono text-[0.58rem] uppercase tracking-[0.24em] text-[#9a3b2c]">{book.title} · page {p.id}</p>
      <h3 className="relative mt-3 font-display text-3xl leading-none text-[#2a1f17] sm:text-4xl">{p.title}</h3>
      {p.items && (
        <ol className="relative mt-5 space-y-2.5">
          {p.items.map((it) => (
            <li key={it.label} className="flex items-center justify-between gap-2 border-b border-dotted border-[#5e4b3a]/30 pb-1.5 font-serif text-[0.98rem]">
              <span>{it.label}</span>
              <span className={it.status === "sample" ? "tag-sample" : "tag-planned"}>{it.status}</span>
            </li>
          ))}
        </ol>
      )}
      {ref && (
        <div className="relative my-5 rounded-md border border-[#8a6a2c]/30 bg-[#fffaf0] p-4 text-center">
          <p lang="ar" dir="rtl" className="ar text-2xl text-[#2a1f17]">
            {ref.verses.map((v, i) => (
              <span key={i}>{v} <span className="text-[0.7em] text-[#9a3b2c]">﴿{arabicDigits(ref.ayahStart + i)}﴾</span> </span>
            ))}
          </p>
          <p className="mt-2 font-serif text-sm italic text-[#5e4b3a]">{ref.translation}</p>
          <p className="mt-1 font-mono text-[0.55rem] uppercase tracking-wider text-[#8a6a2c]">{ref.surahName} {ref.surah}:{ref.ayah} · {ref.translator} · review pending</p>
        </div>
      )}
      {p.body && <p className="relative mt-4 font-serif text-[1.02rem] leading-relaxed text-[#3d2f24]">{p.body}</p>}
      <p className="relative mt-auto pt-4 text-center font-mono text-[0.6rem] text-[#8a6a2c]">— {p.id} —</p>
    </div>
  );
}

export function BookPreview() {
  const params = useSearchParams();
  const hydrated = useHydrated();
  const bookmarks = useDemo((s) => s.bookmarks);
  const toggle = useDemo((s) => s.toggleBookmark);
  const start = Number(params.get("page"));
  const [i, setI] = useState(Number.isFinite(start) && start >= 1 && start <= book.pages.length ? start - 1 : 0);
  const [dir, setDir] = useState<1 | -1>(1);
  const page = book.pages[i]!;
  const go = (n: number) => {
    const next = Math.max(0, Math.min(book.pages.length - 1, n));
    setDir(next >= i ? 1 : -1);
    setI(next);
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input,textarea,select")) return;
      if (e.key === "ArrowRight") go(i + 1);
      if (e.key === "ArrowLeft") go(i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  const key = `book:${page.id}`;
  const marked = hydrated && bookmarks.includes(key);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_16rem]">
      <div>
        <div className="relative mx-auto aspect-[5/7] w-full max-w-md [perspective:1600px]">
          <div className="absolute inset-y-2 -left-2 w-3 rounded-l-sm bg-[#5e2a20] shadow-lg" aria-hidden="true" />
          <div key={page.id} className="absolute inset-0 shadow-[0_30px_60px_-20px_rgba(60,30,10,0.55)] [transform-origin:left_center] motion-safe:animate-[flip_0.6s_cubic-bezier(.16,1,.3,1)]" style={{ ["--from" as string]: dir === 1 ? "-28deg" : "28deg" }} aria-live="polite" aria-label={`Page ${page.id} of ${book.pages.length}: ${page.title}`}>
            <PageBody p={page} />
          </div>
          {marked && <span className="absolute -top-2 right-6 h-10 w-5 bg-[#9a3b2c] [clip-path:polygon(0_0,100%_0,100%_100%,50%_75%,0_100%)]" aria-hidden="true" />}
        </div>
        <div className="mx-auto mt-6 flex max-w-md items-center justify-between gap-2">
          <button type="button" className="btn btn-ghost" onClick={() => go(i - 1)} disabled={i === 0} aria-label="Previous page">← Prev</button>
          <span className="font-mono text-xs uppercase tracking-wider" style={{ color: "var(--text-soft)" }}>{i + 1} / {book.pages.length}</span>
          <button type="button" className="btn btn-accent" onClick={() => go(i + 1)} disabled={i === book.pages.length - 1} aria-label="Next page" data-testid="book-next">Next →</button>
        </div>
        <p className="mt-2 text-center text-xs" style={{ color: "var(--text-soft)" }}>Use ← → keys to turn pages.</p>
      </div>
      <aside className="space-y-4">
        <div className="card p-5">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em]" style={{ color: "var(--accent)" }}>{"// "}Chapters</p>
          <ol className="mt-2 space-y-1">
            {book.pages.map((p, k) => (
              <li key={p.id}>
                <button type="button" onClick={() => go(k)} aria-current={k === i ? "page" : undefined} className={`flex min-h-10 w-full items-center gap-2 rounded px-2 text-left text-sm ${k === i ? "bg-[#9a3b2c]/10 font-semibold" : ""}`} style={{ color: "var(--text)" }}>
                  <span className="font-mono text-[0.6rem] opacity-60">{String(p.id).padStart(2, "0")}</span> {p.title}
                  {hydrated && bookmarks.includes(`book:${p.id}`) && <span className="ml-auto text-[#9a3b2c]" aria-label="bookmarked">❙</span>}
                </button>
              </li>
            ))}
          </ol>
        </div>
        <button type="button" className="btn btn-ghost w-full" aria-pressed={marked} onClick={() => toggle(key)}>{marked ? "★ Bookmarked" : "☆ Bookmark this page"}</button>
        <Tag kind="planned">Placeholder text · planned book</Tag>
      </aside>
      <style>{`@keyframes flip { from { opacity: 0; transform: rotateY(var(--from)); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}
