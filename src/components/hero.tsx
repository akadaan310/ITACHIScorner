import { Arrow } from "@/components/art";
import Link from "next/link";
import { CreatorPortrait } from "@/components/creator-portrait";

export function Hero() {
  return <section className="creator-hero" aria-labelledby="hero-title">
    <div className="hero-architecture" aria-hidden="true" />
    <div className="shell hero-grid">
      <div className="hero-copy"><p className="public-eyebrow">Da&rsquo;wah x Dialogues</p><h1 id="hero-title">ITACHI<span className="hero-title-small">&amp; the questions<br /><em>worth asking.</em></span></h1></div>
      <CreatorPortrait variant="hero" priority />
      <div className="hero-introduction"><p className="hero-description">Welcome to Itachi&rsquo;s Corner. A place to explore da&rsquo;wah conversations, follow their sources and find your own words.</p><div className="hero-actions"><Link href="/explore" className="btn btn-primary" data-testid="home-primary">Explore a question <Arrow /></Link><Link href="/about" className="hero-about">About Itachi <Arrow /></Link></div><p className="hero-footnote">An independent gift concept, made with care.</p></div>
    </div>
    <div className="shell hero-bottom"><span>Curiosity belongs here.</span><span aria-hidden="true">01 / The Corner</span></div>
  </section>;
}
