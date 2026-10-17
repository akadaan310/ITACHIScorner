"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Mark, Wordmark } from "@/components/art";
import { PlatformIcon } from "@/components/ui";
import { brand, creator } from "@/lib/config/creator";
import { levelFor, totalXp } from "@/lib/progression";
import { useDemo, useHydrated } from "@/lib/store";

const primary = [
  { href: "/watch", label: "Arsenal" },
  { href: "/afterglow", label: "Afterglow" },
  { href: "/dojo", label: "Simulator" },
  { href: "/atlas", label: "Atlas" },
  { href: "/reverts", label: "Reverts HQ" },
  { href: "/stories", label: "Shahadahs" },
  { href: "/library", label: "Library" },
];

const drawer = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Explore" },
  { href: "/events", label: "Live Tonight" },
  { href: "/afterglow", label: "Afterglow" },
  { href: "/watch", label: "Search the Arsenal" },
  { href: "/dojo", label: "Dawah Simulator" },
  { href: "/atlas", label: "Night Atlas" },
  { href: "/reverts", label: "Reverts HQ" },
  { href: "/stories", label: "Shahadah Stories" },
  { href: "/library", label: "Library" },
  { href: "/membership", label: "Choose Your Rank" },
  { href: "/me", label: "My Profile" },
  { href: "/me/settings", label: "Settings" },
  { href: "/about", label: "About this concept" },
  { href: "/faq", label: "FAQ" },
];

const MENU_EVENT = "ic:open-menu";

const isActive = (path: string, href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(href + "/"));

function useProfileChip() {
  const hydrated = useHydrated();
  const profile = useDemo((s) => s.profile);
  const xp = useDemo((s) => totalXp(s.xp));
  if (!hydrated || !profile) return null;
  return { profile, xp, level: levelFor(xp).level };
}

function Avatar() {
  const chip = useProfileChip();
  if (!chip) {
    return (
      <Link href="/join" className="btn btn-primary !min-h-[2.5rem] !px-4 !text-[0.72rem]">
        Join the Ranks
      </Link>
    );
  }
  return (
    <Link href="/me" className="flex h-10 items-center gap-2 rounded-md border border-coral/40 bg-white/5 pl-1 pr-3 text-sm text-cream hover:border-coral" aria-label={`My profile — ${chip.profile.nickname}`}>
      <span className="hex h-8 w-8 bg-coral font-display text-lg text-[#16070b]">{chip.profile.nickname.slice(0, 2).toUpperCase()}</span>
      <span className="hidden flex-col whitespace-nowrap leading-tight xl:flex">
        <span className="max-w-[8rem] truncate font-semibold">{chip.profile.nickname}</span>
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-amber">{chip.level.name} · {chip.xp} credits</span>
      </span>
    </Link>
  );
}

function WatchLiveMenu() {
  return (
    <details className="group relative">
      <summary className="flex h-10 cursor-pointer whitespace-nowrap list-none items-center gap-2 rounded-md border border-coral/60 bg-coral/10 px-3.5 text-xs font-bold uppercase tracking-[0.12em] text-cream hover:bg-coral/20 [&::-webkit-details-marker]:hidden">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-coral" />
        </span>
        Watch live <span aria-hidden="true">↗</span>
      </summary>
      <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-white/10 bg-[#120f1e]/97 p-3 shadow-2xl backdrop-blur-xl">
        <p className="px-2 pb-2 text-xs text-cream/70">Lives happen on Itachi&rsquo;s official channels — never here.</p>
        <a href={creator.links.tiktokLive} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-cream hover:bg-white/5">
          <PlatformIcon platform="tiktok" /> TikTok Live <span className="ml-auto text-cream/65">↗</span>
        </a>
        <a href={creator.links.youtubeLive} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-cream hover:bg-white/5">
          <PlatformIcon platform="youtube" /> YouTube Live <span className="ml-auto text-cream/65">↗</span>
        </a>
        <Link href="/events" className="mt-1 flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-gold hover:bg-white/5">
          ✦ Schedule & reminders
        </Link>
      </div>
    </details>
  );
}

/** v1-style slide-out drawer: profile chip, caps list with arrows, Watch Live Now. */
function Drawer({ onClose }: { onClose: () => void }) {
  const path = usePathname() ?? "/";
  const chip = useProfileChip();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    ref.current?.querySelector<HTMLElement>("button,a")?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Site menu">
      <button type="button" className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-label="Close menu" onClick={onClose} tabIndex={-1} />
      <div ref={ref} className="safe-bottom absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col border-l-2 border-coral bg-[#0c0a14] shadow-2xl">
        <div className="flex items-start justify-between px-6 pb-4 pt-6">
          <div>
            <p className="font-display text-3xl leading-none text-coral">Itachi&rsquo;s</p>
            <p className="font-display text-xl leading-none text-cream">Corner</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-md border border-white/10 text-cream" aria-label="Close menu">
            ✕
          </button>
        </div>
        <div className="mx-6 border-y border-white/10 py-4">
          {chip ? (
            <Link href="/me" className="flex items-center gap-3">
              <span className="hex h-11 w-11 bg-coral font-display text-xl text-[#16070b]">{chip.profile.nickname.slice(0, 2).toUpperCase()}</span>
              <span>
                <span className="block font-display text-lg leading-none text-cream">{chip.profile.nickname} · {chip.level.name}</span>
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-amber">◆ {chip.xp} credits</span>
              </span>
            </Link>
          ) : (
            <Link href="/join" className="flex items-center gap-3">
              <Mark size={40} title="" />
              <span>
                <span className="block font-display text-lg leading-none text-cream">Join the Ranks</span>
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-amber">Free forever</span>
              </span>
            </Link>
          )}
        </div>
        <nav aria-label="All sections" className="flex-1 overflow-y-auto px-6 py-3">
          <ul>
            {drawer.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive(path, item.href) ? "page" : undefined}
                  className="flex min-h-12 items-center justify-between border-b border-white/[0.05] font-display text-xl uppercase tracking-wide text-cream/90 hover:text-cream aria-[current=page]:text-coral"
                >
                  {item.label} <span aria-hidden="true" className="font-sans text-sm text-cream/60">⟶</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-2 px-6 pb-6 pt-3">
          <a href={creator.links.tiktokLive} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
            <PlatformIcon platform="tiktok" /> Watch Live Now ↗
          </a>
          <p className="text-center font-mono text-[0.6rem] uppercase tracking-[0.2em] text-cream/60">{brand.pillars}</p>
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const path = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) {
    setLastPath(path);
    setOpen(false);
  }
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(MENU_EVENT, onOpen);
    return () => window.removeEventListener(MENU_EVENT, onOpen);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#09080f]/85 backdrop-blur-xl">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-amber focus:px-3 focus:py-2 focus:text-cosmic">
          Skip to content
        </a>
        <div className="shell flex h-16 items-center gap-4">
          <Link href="/" aria-label="Itachi's Corner — home" className="shrink-0">
            <Wordmark compact />
          </Link>
          <nav aria-label="Primary" className="ml-2 hidden lg:block">
            <ul className="flex items-center">
              {primary.map((item) => {
                const active = isActive(path, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative whitespace-nowrap px-2 py-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] transition-colors xl:px-3 ${active ? "text-coral" : "text-cream/70 hover:text-cream"}`}
                    >
                      {item.label}
                      {active && <span className="absolute inset-x-2 -bottom-[13px] h-[2px] bg-coral xl:inset-x-3" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:block">
              <WatchLiveMenu />
            </div>
            <div className="hidden sm:block">
              <Avatar />
            </div>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-md border border-white/10 bg-white/5 text-cream lg:hidden"
              aria-expanded={open}
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M3 6h14M7 10h10M3 14h14" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      {open && <Drawer onClose={() => setOpen(false)} />}
    </>
  );
}

/** Persistent live bar (v1), honest about what is sample. */
export function LiveBar() {
  return (
    <div className="relative z-30 bg-gradient-to-r from-[#e8435c] via-coral to-[#c42e48] text-[#16070b]">
      <div className="shell flex min-h-9 items-center gap-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em]">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#16070b]" aria-hidden="true" />
          Live tonight
        </span>
        <span className="hidden truncate font-mono text-[0.65rem] font-medium normal-case tracking-normal opacity-85 sm:inline">
          Open Questions Night · sample schedule, not an announcement
        </span>
        <Link href="/events" className="ml-auto flex min-h-9 items-center gap-1 whitespace-nowrap underline-offset-2 hover:underline">
          Watch live now <span aria-hidden="true">⟶</span>
        </Link>
      </div>
    </div>
  );
}

const tabs = [
  { href: "/", label: "Home", icon: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { href: "/watch", label: "Search", icon: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 16l-4.2-4.2" },
  { href: "/afterglow", label: "Live", icon: "M13 2L4 14h7l-1 8 9-12h-7z", live: true },
  { href: "/dojo", label: "Sim", icon: "M5 19L19 5M14 5h5v5M5 5l5 5M14 14l5 5" },
];

export function MobileNav() {
  const path = usePathname() ?? "/";
  const item = "flex min-h-[3.75rem] flex-col items-center justify-center gap-1 font-mono text-[0.62rem] uppercase tracking-[0.12em]";
  return (
    <nav aria-label="Quick navigation" className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0a0910]/95 backdrop-blur-xl lg:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {tabs.map((t) => {
          const active = isActive(path, t.href);
          return (
            <li key={t.href} className="relative">
              {active && <span className="absolute inset-x-4 top-0 h-[3px] bg-coral" aria-hidden="true" />}
              <Link href={t.href} aria-current={active ? "page" : undefined} className={`${item} ${active ? "text-coral" : "text-cream/60"}`}>
                <span className={`relative grid h-7 w-7 place-items-center rounded-md ${active ? "bg-coral text-[#16070b]" : ""}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                    <path d={t.icon} />
                  </svg>
                  {t.live && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-coral ring-2 ring-[#0a0910]" aria-hidden="true" />}
                </span>
                {t.label}
              </Link>
            </li>
          );
        })}
        <li>
          <button type="button" className={`${item} w-full text-cream/60`} onClick={() => window.dispatchEvent(new Event(MENU_EVENT))} aria-label="Open menu">
            <span className="grid h-7 w-7 place-items-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </span>
            Menu
          </button>
        </li>
      </ul>
    </nav>
  );
}

/** Applies the member's motion preference and records return visits. */
export function ClientEffects() {
  const hydrated = useHydrated();
  const motion = useDemo((s) => s.settings.motion);
  const touch = useDemo((s) => s.touchVisit);
  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.motion = motion === "reduced" ? "reduced" : "system";
  }, [hydrated, motion]);
  useEffect(() => {
    if (hydrated) touch();
  }, [hydrated, touch]);
  return null;
}
