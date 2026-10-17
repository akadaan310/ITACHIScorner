import Image from "next/image";
import Link from "next/link";
import { Crescent, Dunes, Medallion, Skyline, StarField } from "@/components/art";
import { PlatformIcon } from "@/components/ui";
import { brand, creator } from "@/lib/config/creator";

/** Destinations orbiting the portrait — each star is a real route. */
const orbit = [
  { href: "/afterglow", label: "Afterglow", angle: -128, color: "#FA536D" },
  { href: "/watch", label: "Arsenal", angle: -62, color: "#F7C65B" },
  { href: "/dojo", label: "Simulator", angle: -8, color: "#26C4B3" },
  { href: "/atlas", label: "Night Atlas", angle: 48, color: "#A58BE1" },
  { href: "/reverts", label: "Reverts HQ", angle: 168, color: "#E7C8F5" },
];

const R = 49;

export function Hero() {
  const pts = orbit.map((o) => {
    const a = (o.angle * Math.PI) / 180;
    return { ...o, x: 50 + R * Math.cos(a), y: 50 + R * Math.sin(a) };
  });
  const line = pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");

  return (
    <>
      <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
        {/* Night sky over Cairo, burning to an Itachi-red horizon */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#060509_0%,#0f0b1c_30%,#1d1230_52%,#4a1630_72%,#9b2a3f_88%,#e0485d_100%)]" />
        <div className="sky-shift absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_72%_38%,rgba(250,83,109,0.35),transparent_50%),radial-gradient(ellipse_at_12%_8%,rgba(165,139,225,0.18),transparent_45%)]" />
        <StarField seed={11} count={170} height={700} className="parallax-slow absolute inset-x-0 top-0 -z-10 h-[78%] w-full" />
        <Crescent size={110} className="parallax-slow absolute right-[4%] top-[2%] -z-10 h-auto w-[64px] opacity-80 sm:right-auto sm:left-[46%] sm:top-[6%] sm:w-[96px]" />

        <div className="shell relative grid items-center gap-10 pb-[12rem] pt-8 sm:pb-[15rem] lg:min-h-[calc(100svh-7rem)] lg:grid-cols-[1.05fr_1fr] lg:pt-4">
          <div className="relative z-10 order-2 lg:order-1">
            <p className="eyebrow rise">Live tonight · Da&rsquo;wah x Dialogues</p>
            <p className="rise mt-5 font-display text-2xl tracking-[0.08em] text-cream/80">Itachi&rsquo;s Corner</p>
            <h1 id="hero-title" className="rise rise-1 mt-1 font-display text-[3.7rem] leading-[0.86] text-cream sm:text-[5.6rem] lg:text-[6.6rem]">
              Where <span className="text-coral">truth</span>
              <br />
              meets <em className="text-gold">dialogue.</em>
            </h1>
            <p className="rise rise-2 mt-4 font-mono text-xs uppercase tracking-[0.28em] text-coral">{brand.pillars}</p>
            <p lang="ar" className="ar rise rise-2 mt-3 text-[1.6rem] text-amber sm:text-3xl">كُلُّ سُؤَالٍ يَفْتَحُ سَمَاءً جَدِيدَةً</p>
            <p className="rise rise-3 font-serif text-xl italic text-cream/85 sm:text-2xl">{brand.poetic}</p>
            <p className="rise rise-3 mt-5 max-w-xl text-base leading-relaxed text-cream/75 sm:text-lg">
              The lives happen on TikTok and YouTube. This is your Dawah Arsenal for everything around them — trivia, saved moments,
              the Simulator, and a star map of every question worth asking.
            </p>
            <div className="rise rise-4 mt-8 flex flex-wrap gap-3">
              <a href={creator.links.tiktokLive} target="_blank" rel="noopener noreferrer" className="btn btn-primary min-h-[3.25rem] px-7">
                ▶ Watch live now <span className="sr-only">(opens TikTok)</span>
              </a>
              <Link href="/discover" className="btn btn-ghost min-h-[3.25rem] px-7">
                Enter the Corner ⟶
              </Link>
            </div>
            <Link href="/afterglow" className="rise rise-4 mt-4 inline-flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-gold hover:text-amber">
              ✦ Explore the Afterglow
            </Link>
          </div>

          {/* Portrait — the face of the Corner — inside a celestial orbit */}
          <div className="relative z-10 order-1 mx-auto w-full max-w-[17.5rem] sm:max-w-[28rem] lg:order-2 lg:max-w-[32rem]">
            <div className="relative aspect-square">
              <Medallion className="absolute inset-[-6%] h-[112%] w-[112%] opacity-45" />
              <div className="absolute inset-[9%] rounded-full bg-[radial-gradient(circle,rgba(250,83,109,0.55),rgba(190,49,76,0.25)_55%,transparent_72%)] blur-2xl" />
              <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
                <circle cx="50" cy="50" r={R} fill="none" stroke="#F7C65B" strokeOpacity="0.22" strokeWidth="0.3" strokeDasharray="0.6 1.6" />
                <polyline points={line} fill="none" stroke="#F7C65B" strokeOpacity="0.55" strokeWidth="0.35" className="[stroke-dasharray:300] [stroke-dashoffset:300] motion-safe:animate-[draw_2.4s_0.6s_ease-out_forwards] motion-reduce:[stroke-dashoffset:0]" />
              </svg>
              <figure className="hud absolute inset-[11%] rounded-[1.25rem]">
                <div className="absolute inset-0 overflow-hidden rounded-[1.25rem] border border-coral/40 bg-ruby shadow-[0_30px_80px_-20px_rgba(250,83,109,0.6)]">
                  <Image
                    src={creator.portrait.src}
                    alt={creator.portrait.alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 360px, 270px"
                    className="object-cover object-[60%_40%]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(10,6,14,0.88)_100%)]" />
                  <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.12)_0px,rgba(0,0,0,0.12)_1px,transparent_1px,transparent_3px)] mix-blend-multiply" />
                  <StarField seed={77} count={24} width={400} height={400} className="pointer-events-none absolute inset-0 h-full w-full opacity-70 mix-blend-screen" />
                </div>
                <span className="absolute right-3 top-3 flex items-center gap-1.5 whitespace-nowrap rounded bg-coral px-2 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-[#16070b]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#16070b]" /> Live tonight
                </span>
                <figcaption className="absolute inset-x-0 bottom-0 p-4">
                  <span>
                    <span className="block font-display text-4xl leading-none text-cream sm:text-5xl">Itachi</span>
                    <span className="whitespace-nowrap font-mono text-[0.6rem] uppercase tracking-[0.2em] text-cream/75">Da&rsquo;wah x Dialogues</span>
                  </span>
                </figcaption>
              </figure>
              <nav aria-label="Star destinations">
                <ul>
                  {pts.map((p) => (
                    <li key={p.href} className="absolute z-20 -translate-x-1/2 -translate-y-1/2" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                      <Link href={p.href} className="group flex min-h-11 min-w-11 flex-col items-center justify-center">
                        <span className="relative grid h-5 w-5 place-items-center">
                          <span className="absolute h-full w-full rounded-full opacity-50 blur-[6px] transition-transform duration-500 group-hover:scale-[2.2]" style={{ background: p.color }} />
                          <span className="h-2.5 w-2.5 rotate-45 rounded-[1px] shadow-[0_0_14px] transition-transform duration-300 group-hover:scale-150 group-focus-visible:scale-150" style={{ background: p.color, color: p.color }} />
                        </span>
                        <span className="mt-1 whitespace-nowrap rounded bg-black/70 px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-cream backdrop-blur-sm sm:text-[0.65rem]">
                          {p.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <Skyline className="h-[8rem] w-full sm:h-[12rem]" fill="#0a0710" />
          <Dunes className="-mt-10 h-[5.5rem] w-full sm:h-[7rem]" />
        </div>
        <style>{`@keyframes draw { to { stroke-dashoffset: 0; } }`}</style>
      </section>

      {/* v1 red ticker */}
      <div className="relative overflow-hidden border-y border-coral/40 bg-coral text-[#16070b]">
        <p className="sr-only">{brand.tagline}. {brand.pillars}.</p>
        <div className="marquee py-2.5" aria-hidden="true">
          {Array.from({ length: 2 }, (_, k) => (
            <span key={k} className="flex shrink-0 items-center gap-8 pr-8 font-display text-xl tracking-[0.08em]">
              <span>Where truth meets dialogue</span>
              <span>✦</span>
              <span className="font-mono text-sm uppercase tracking-[0.25em]">Faith // Knowledge // Reason</span>
              <span>✦</span>
              <span lang="ar" className="ar text-lg leading-none">كُلُّ سُؤَالٍ يَفْتَحُ سَمَاءً جَدِيدَةً</span>
              <span>✦</span>
              <span>Every question opens a new sky</span>
              <span>✦</span>
              <span className="flex items-center gap-2"><PlatformIcon platform="tiktok" /> Lives on TikTok &amp; YouTube</span>
              <span>✦</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
