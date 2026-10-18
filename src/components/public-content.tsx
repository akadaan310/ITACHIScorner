import { Arrow } from "@/components/art";
import Link from "next/link";
import type { ReactNode } from "react";

export function PublicHeader({ label, title, children }: { label: string; title: ReactNode; children: ReactNode }) {
  return <header className="public-page-header shell"><p className="public-eyebrow">{label}</p><h1>{title}</h1><div className="public-intro">{children}</div></header>;
}

export function PendingPanel({ label = "Taking shape", title, children, action }: { label?: string; title: string; children: ReactNode; action?: { href: string; label: string } }) {
  return <section className="pending-panel" aria-label={title}><div className="pending-symbol" aria-hidden="true">✧</div><div className="max-w-2xl"><p className="status-label">{label}</p><h2>{title}</h2><div className="mt-3 text-base leading-relaxed text-cream/70">{children}</div>{action && <Link href={action.href} className="btn btn-primary mt-6">{action.label} <Arrow /></Link>}</div></section>;
}
