import Link from "next/link";
import { creator } from "@/lib/config/creator";

export function SiteFooter() {
  return <footer className="public-footer"><div className="shell">
    <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-8 md:flex-row md:items-start">
      <div><p className="font-display text-3xl text-cream">Itachi&rsquo;s <span className="text-coral">Corner</span></p><p className="mt-2 max-w-sm text-sm text-cream/65">Room for curiosity. Care in every conversation.</p></div>
      <nav aria-label="More about the Corner" className="footer-links"><Link href="/about">About</Link><Link href="/library">Library</Link><Link href="/session-notes">Session Notes</Link><Link href="/support">Support</Link><Link href="/faq">FAQ</Link></nav>
    </div>
    <div className="mt-6 flex flex-col justify-between gap-5 text-xs leading-relaxed text-cream/65 sm:flex-row"><p className="max-w-lg">{creator.disclosure}<br />A creator gift under development. No public launch or endorsement.</p><nav aria-label="Legal" className="flex flex-wrap items-start gap-5"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav></div>
  </div></footer>;
}
