import { Arrow } from "@/components/art";
import Image from "next/image";
import Link from "next/link";
import { creator } from "@/lib/config/creator";

export function Hero() {
  return (
    <section className="creator-hero" aria-labelledby="hero-title">
      <div className="shell hero-grid">
        <div className="hero-copy">
          <p className="public-eyebrow">Da&rsquo;wah x Dialogues</p>
          <h1 id="hero-title">A little curiosity.<br /><em>A deeper</em><br /><span className="text-coral">conversation.</span></h1>
          <p className="hero-description">Welcome to Itachi&rsquo;s Corner. A space taking shape around da&rsquo;wah, learning and the questions worth asking.</p>
          <div className="mt-7"><Link href="/explore" className="btn btn-primary" data-testid="home-primary">Explore questions <Arrow /></Link></div>
          <p className="mt-4 text-sm text-cream/65">Get to know the idea <Link href="/about" className="inline-link">behind the Corner</Link>.</p>
        </div>
        <figure className="creator-figure">
          <div className="portrait-frame">
            <div className="portrait-arch" aria-hidden="true" />
            <div className="portrait-image"><Image src={creator.portrait.src} alt={creator.portrait.alt} fill priority sizes="(min-width:1024px) 440px, (min-width:640px) 400px, 310px" className="object-cover object-[50%_35%]" /></div>
            <figcaption className="portrait-name"><span className="block font-display text-5xl text-cream sm:text-6xl">Itachi</span><span className="mt-1 block text-xs tracking-wide text-cream/80">Da&rsquo;wah x Dialogues</span></figcaption>
          </div>
          <p className="portrait-qualification">Design exploration · creator image approval pending</p>
        </figure>
      </div>
      <div className="hero-rule shell" aria-hidden="true"><span />✧<span /></div>
    </section>
  );
}
