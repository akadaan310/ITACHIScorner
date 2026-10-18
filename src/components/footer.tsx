import Link from "next/link";
import { Wordmark } from "@/components/art";
import { creator } from "@/lib/config/creator";

export function SiteFooter() {
  return <footer className="public-footer"><div className="shell">
    <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-8 md:flex-row md:items-start">
      <div><Link href="/" aria-label="Itachi's Corner — home"><Wordmark /></Link><p className="mt-3 max-w-sm text-sm text-cream/65">Room for curiosity. Care in every conversation.</p></div>
      <nav aria-label="More about the Corner" className="footer-links"><Link href="/about">About Itachi</Link><Link href="/library">Book / Library</Link><Link href="/session-notes">Session Notes</Link><Link href="/support">Support</Link><Link href="/studio/creator">Creator Studio</Link><Link href="/faq">FAQ</Link></nav>
    </div>
    <div className="mt-6 flex flex-col justify-between gap-5 text-xs leading-relaxed text-cream/65 sm:flex-row"><p className="max-w-lg">{creator.disclosure}<br />Creator images and signature are design studies pending approval.</p><nav aria-label="Legal" className="flex flex-wrap items-start gap-5"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav></div>
  </div></footer>;
}
