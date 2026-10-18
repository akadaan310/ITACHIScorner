"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/art";

const destinations = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/learn", label: "Learn" },
  { href: "/practice", label: "Practice" },
  { href: "/community", label: "Community" },
];
const secondary = [
  { href: "/me", label: "My Corner" },
  { href: "/about", label: "About" },
  { href: "/library", label: "Library" },
  { href: "/support", label: "Support" },
];
const active = (path: string, href: string) => href === "/" ? path === "/" : path === href || path.startsWith(href + "/");

function Menu({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const path = usePathname() ?? "/";
  useEffect(() => {
    const el = dialog.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    el?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      el?.close();
      document.body.style.overflow = previous;
      previousFocus?.focus();
    };
  }, []);
  return (
    <dialog ref={dialog} className="site-menu" onCancel={onClose} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} aria-label="Site menu">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-6">
        <Wordmark compact />
        <button type="button" className="menu-toggle" onClick={onClose} aria-label="Close menu">✕</button>
      </div>
      <nav aria-label="All sections" className="py-5">
        {destinations.map((item) => <Link key={item.href} href={item.href} onClick={onClose} aria-current={active(path, item.href) ? "page" : undefined} className="menu-link">{item.label}<span aria-hidden="true">↗</span></Link>)}
        <div className="mt-5 border-t border-white/10 pt-4">
          {secondary.map((item) => <Link key={item.href} href={item.href} onClick={onClose} className="menu-secondary">{item.label}</Link>)}
        </div>
      </nav>
      <p className="text-xs leading-relaxed text-cream/65">Independent concept. Unaffiliated and not yet endorsed.</p>
    </dialog>
  );
}

export function SiteHeader() {
  const path = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="shell flex h-[72px] items-center justify-between gap-4">
        <Link href="/" aria-label="Itachi's Corner — home" className="shrink-0"><Wordmark compact /></Link>
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex gap-1">{destinations.map((item) => <li key={item.href}><Link href={item.href} aria-current={active(path, item.href) ? "page" : undefined} className="header-link">{item.label}</Link></li>)}</ul>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/me" className="corner-link hidden sm:inline-flex">My Corner <span aria-hidden="true">↗</span></Link>
          <button type="button" className="menu-toggle lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>☰</button>
        </div>
      </div>
      {open && <Menu onClose={() => setOpen(false)} />}
    </header>
  );
}

export function MobileNav() {
  const path = usePathname() ?? "/";
  return <nav aria-label="Quick navigation" className="mobile-navigation safe-bottom lg:hidden"><ul>{destinations.map((item) => <li key={item.href}><Link href={item.href} aria-current={active(path, item.href) ? "page" : undefined}>{item.label}</Link></li>)}</ul></nav>;
}
