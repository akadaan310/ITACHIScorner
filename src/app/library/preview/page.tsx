import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BookPreview } from "@/components/book";

export const metadata: Metadata = { title: "Sample book preview", description: "An interactive 8-page preview of the planned book concept." };

export default function PreviewPage() {
  return (
    <div data-world="library" className="pb-16" style={{ background: "linear-gradient(180deg,#efe3c6,#f7eedb)" }}>
      <div className="shell pt-10">
        <nav aria-label="Breadcrumb" className="font-mono text-xs uppercase tracking-wider" style={{ color: "#9a3b2c" }}>
          <Link href="/library">Library</Link> <span aria-hidden="true">{"//"}</span> Sample preview
        </nav>
        <h1 className="mt-4 text-5xl leading-[0.9] sm:text-7xl" style={{ color: "#2a1f17" }}>Sample book preview</h1>
        <p className="mt-2 max-w-2xl" style={{ color: "#5e4b3a" }}>Eight pages of original design. All text is placeholder — the real book can only be written from sourced works with the creator&rsquo;s approval.</p>
      </div>
      <div className="shell mt-10">
        <Suspense fallback={<p>Opening the book…</p>}>
          <BookPreview />
        </Suspense>
      </div>
    </div>
  );
}
