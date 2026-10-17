import Link from "next/link";
import { Crescent, StarField } from "@/components/art";

export default function NotFound() {
  return (
    <div className="relative overflow-hidden py-28 text-center">
      <StarField seed={404} count={120} height={600} className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />
      <div className="shell relative">
        <Crescent size={120} className="mx-auto" />
        <p className="eyebrow mt-6 justify-center">404 · uncharted sky</p>
        <h1 className="mt-3 text-7xl leading-[0.9] text-cream sm:text-8xl">No stars here <em className="text-coral">yet.</em></h1>
        <p className="mx-auto mt-4 max-w-md text-cream/70">This corner of the sky hasn&rsquo;t been charted. Let&rsquo;s get you back to somewhere bright.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn btn-primary">Home</Link>
          <Link href="/atlas" className="btn btn-ghost">Open the Atlas</Link>
        </div>
      </div>
    </div>
  );
}
