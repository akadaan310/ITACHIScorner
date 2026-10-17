import Link from "next/link";
import type { ReactNode } from "react";
import { ArchFrame, StarField } from "@/components/art";
import { creator } from "@/lib/config/creator";
import { getRef } from "@/lib/fixtures/quran";
import type { Platform, VerificationStatus } from "@/lib/types";

/* ── Honesty tags ───────────────────────────────────────────── */

const tagCopy: Record<string, { cls: string; label: string; title: string }> = {
  demo: { cls: "tag-demo", label: "Demo", title: "Demonstration content inside this concept. Not real." },
  sample: { cls: "tag-sample", label: "Sample", title: "Illustrative sample written for the concept." },
  simulated: { cls: "tag-demo", label: "Simulated", title: "A running simulation, not a real live." },
  verified: { cls: "tag-verified", label: "Verified", title: "Confirmed by a reliable source or by this app's own records." },
  "self-entered": { cls: "tag-self", label: "Self-entered", title: "Typed by the member. Does not prove ownership or attendance." },
  "connected-via-provider": { cls: "tag-verified", label: "Connected via provider", title: "Bound via official provider login with consent." },
  "verified-event": { cls: "tag-verified", label: "Verified event", title: "Attendance confirmed by an authorised integration." },
  "pending-review": { cls: "tag-sample", label: "Pending review", title: "Awaiting human editorial review." },
  unavailable: { cls: "tag-self", label: "Unavailable", title: "Integration not connected." },
  planned: { cls: "tag-planned", label: "Planned concept", title: "Planned for the future. Not built or approved yet." },
};

export function Tag({ kind, children }: { kind: VerificationStatus | "demo" | "planned"; children?: ReactNode }) {
  const t = tagCopy[kind] ?? tagCopy.demo!;
  return (
    <span className={t.cls} title={t.title}>
      {children ?? t.label}
    </span>
  );
}

/* ── Page chrome ────────────────────────────────────────────── */

export function ChapterHeader({
  eyebrow,
  title,
  arabic,
  children,
  aside,
  light = false,
}: {
  eyebrow: string;
  title: ReactNode;
  arabic?: string;
  children?: ReactNode;
  aside?: ReactNode;
  light?: boolean;
}) {
  return (
    <header className="relative overflow-hidden">
      {!light && <StarField seed={title?.toString().length ?? 3} count={70} className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />}
      <ArchFrame
        className="pointer-events-none absolute -right-10 top-4 hidden h-[22rem] w-auto opacity-25 md:block"
        stroke={light ? "#7a5cc4" : "#D7AD65"}
      />
      <div className="shell relative grid gap-8 pb-10 pt-10 md:grid-cols-[1.4fr_1fr] md:items-end md:pb-14 md:pt-16">
        <div className="portal-enter">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-4 text-[3.2rem] leading-[0.9] sm:text-7xl lg:text-[5.6rem]" style={{ color: "var(--text)" }}>
            {title}
          </h1>
          {arabic && (
            <p lang="ar" className="ar mt-3 text-2xl sm:text-3xl" style={{ color: "var(--accent)" }}>
              {arabic}
            </p>
          )}
          {children && <div className="mt-5 max-w-2xl text-lg leading-relaxed" style={{ color: "var(--text-soft)" }}>{children}</div>}
        </div>
        {aside && <div className="rise rise-2">{aside}</div>}
      </div>
    </header>
  );
}

export function SectionTitle({ eyebrow, title, children, id }: { eyebrow?: string; title: ReactNode; children?: ReactNode; id?: string }) {
  return (
    <div className="mb-8 max-w-3xl" id={id}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 text-4xl leading-[0.92] sm:text-6xl" style={{ color: "var(--text)" }}>
        {title}
      </h2>
      {children && <div className="mt-3 text-base leading-relaxed sm:text-lg" style={{ color: "var(--text-soft)" }}>{children}</div>}
    </div>
  );
}

/* ── Qur'an passage: dignified, exact, sourced ──────────────── */

const arabicDigits = (n: number) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]!);

export function QuranPassage({ id, compact = false, showTranslation = true }: { id: string; compact?: boolean; showTranslation?: boolean }) {
  const ref = getRef(id);
  if (!ref) return null;
  return (
    <figure className={`card overflow-hidden ${compact ? "p-5" : "p-6 sm:p-8"}`} aria-label={`Qur'an, ${ref.surahName} ${ref.surah}:${ref.ayah}`}>
      <div className="pointer-events-none absolute inset-0 pattern-mashrabiya opacity-30 [mask-image:radial-gradient(circle_at_center,transparent_45%,black_90%)]" />
      <blockquote lang="ar" dir="rtl" className={`ar relative text-center ${compact ? "text-2xl" : "text-[1.75rem] sm:text-[2.1rem]"}`} style={{ color: "var(--text)" }}>
        {ref.verses.map((v, i) => (
          <span key={i}>
            {v}
            <span className="mx-2 inline-block text-[0.7em]" style={{ color: "var(--accent)" }} aria-label={`verse ${ref.ayahStart + i}`}>
              ﴿{arabicDigits(ref.ayahStart + i)}﴾
            </span>{" "}
          </span>
        ))}
      </blockquote>
      {showTranslation && (
        <figcaption className="relative mt-4 text-center">
          <p className="mx-auto max-w-2xl text-[0.98rem] italic leading-relaxed" style={{ color: "var(--text-soft)" }}>
            {ref.translation}
          </p>
          <p className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs" style={{ color: "var(--text-soft)" }}>
            <span className="font-semibold" style={{ color: "var(--accent)" }}>
              {ref.surahName} {ref.surah}:{ref.ayah}
            </span>
            <span>· Translation: {ref.translator}</span>
            <Tag kind="pending-review">Editor review pending</Tag>
          </p>
        </figcaption>
      )}
    </figure>
  );
}

/* ── Official platform exits ────────────────────────────────── */

export function PlatformIcon({ platform, className = "h-4 w-4" }: { platform: Platform | "instagram" | "x" | "patreon"; className?: string }) {
  switch (platform) {
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M16.6 3c.4 2.1 1.7 3.6 3.9 3.9v3a7.4 7.4 0 0 1-3.9-1.2v6.1a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v3.1a2.7 2.7 0 1 0 1.8 2.5V3h3z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12c0 1.3.1 2.6.4 3.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.3-1.2.4-2.5.4-3.8 0-1.3-.1-2.6-.4-3.8zM10 15.2V8.8l5.2 3.2-5.2 3.2z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.2-8.3L2 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z" />
        </svg>
      );
    case "patreon":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <circle cx="15" cy="9.5" r="6" />
          <rect x="3" y="3.5" width="3.5" height="17" />
        </svg>
      );
  }
}

export function WatchButtons({ size = "md", live = true }: { size?: "md" | "lg"; live?: boolean }) {
  const cls = size === "lg" ? "btn min-h-[3.25rem] px-6 text-base" : "btn";
  return (
    <div className="flex flex-wrap gap-3">
      <a href={live ? creator.links.tiktokLive : creator.links.tiktok} target="_blank" rel="noopener noreferrer" className={`${cls} btn-primary`}>
        <PlatformIcon platform="tiktok" /> Watch on TikTok <span aria-hidden="true">↗</span>
        <span className="sr-only">(opens TikTok in a new tab)</span>
      </a>
      <a href={live ? creator.links.youtubeLive : creator.links.youtube} target="_blank" rel="noopener noreferrer" className={`${cls} btn-ghost`}>
        <PlatformIcon platform="youtube" /> Watch on YouTube <span aria-hidden="true">↗</span>
        <span className="sr-only">(opens YouTube in a new tab)</span>
      </a>
    </div>
  );
}

/** v1 hex badge icon. */
export function HexIcon({ color, glyph, size = "h-14 w-14" }: { color: string; glyph: string; size?: string }) {
  return (
    <span className={`hex ${size} text-2xl text-[#16070b] shadow-[0_0_30px_-6px]`} style={{ background: color, color: "#16070b", boxShadow: `0 0 30px -6px ${color}` }} aria-hidden="true">
      {glyph}
    </span>
  );
}

export function ConceptNote({ className = "" }: { className?: string }) {
  return (
    <p className={`flex items-start gap-2 text-xs leading-relaxed ${className}`} style={{ color: "var(--text-soft)" }}>
      <span aria-hidden="true" style={{ color: "var(--accent)" }}>✦</span>
      <span>
        {creator.disclosure}{" "}
        <Link href="/about" className="underline underline-offset-2">
          About this concept
        </Link>
      </span>
    </p>
  );
}

export function ProgressBar({ value, label, color = "var(--accent)" }: { value: number; label: string; color?: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, var(--color-amber))` }} />
    </div>
  );
}
