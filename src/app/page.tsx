import { Arrow, GeoStar } from "@/components/art";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { QuestionDesk } from "@/components/question-desk";

export default function Home() {
  return <>
    <Hero />

    <section className="source-chapter" aria-labelledby="source-title">
      <div className="shell source-layout">
        <div className="chapter-heading">
          <p className="public-eyebrow">First, the conversation itself</p>
          <h2 id="source-title">Real words.<br /><em>Real context.</em></h2>
          <p>A question deserves more than a clipped answer. The words around it matter, too.</p>
          <div className="source-stamp"><GeoStar size={24} /><span>The collection is empty.<br />The standard is already here.</span></div>
        </div>
        <div className="source-ledger">
          <p className="ledger-intro">Original conversations will appear only after permission and review. Until then, there are no published source questions here.</p>
          <details className="source-disclosure"><summary><span>Follow the original</span><span className="disclosure-symbol" aria-hidden="true">+</span></summary><p>Published questions will link to the original conversation and the exact source moment, with enough context to understand what was said.</p></details>
          <details className="source-disclosure"><summary><span>Make permission visible</span><span className="disclosure-symbol" aria-hidden="true">+</span></summary><p>Having a conversation in an archive does not make it ready to share. Source rights and permission must be checked before excerpts are published.</p></details>
          <details className="source-disclosure"><summary><span>Leave room for review</span><span className="disclosure-symbol" aria-hidden="true">+</span></summary><p>Source checks, editorial review and creator approval come before learning material. No lessons or teaching method are being attributed to Itachi here.</p></details>
          <p className="ledger-footnote">Open a line to see what goes into the collection.</p>
        </div>
      </div>
    </section>

    <section id="question-desk" className="question-desk-section" aria-labelledby="desk-title">
      <div className="shell desk-layout">
        <div className="desk-introduction">
          <p className="public-eyebrow">A small place to begin · available now</p>
          <h2 id="desk-title">Your question.<br /><em>Your own words.</em></h2>
          <p>You don&rsquo;t need a finished thought to start. Put what&rsquo;s on your mind into words, then give yourself room to reflect.</p>
          <p className="desk-boundary">This is a scratchpad for your own writing. It gives no religious answers, feedback or scores. Your words are not Itachi&rsquo;s words or a teaching method.</p>
          <div className="desk-mark" aria-hidden="true"><GeoStar size={72} /><span>Pause.<br />Think.<br />Put it into words.</span></div>
        </div>
        <QuestionDesk />
      </div>
    </section>

    <section className="learning-chapter shell" aria-labelledby="learning-title">
      <div className="learning-heading"><p className="public-eyebrow">Keep your curiosity moving</p><h2 id="learning-title">There&rsquo;s room<br /><em>to take your time.</em></h2><p>Learning and practice have different rhythms. Both begin with care for what is actually being said.</p></div>
      <div className="pathway-grid">
        <article className="pathway pathway-learn"><span className="pathway-word" aria-hidden="true">Learn</span><div><p className="public-eyebrow">Understand before moving on</p><h3>Make room<br />for <em>understanding.</em></h3><p>Source-based lessons are still being prepared. See what careful learning will require, with a welcoming place for new Muslims.</p><Link href="/learn" className="chapter-link">Learn at your pace <Arrow /></Link></div></article>
        <article className="pathway pathway-practice"><span className="pathway-word" aria-hidden="true">Practice</span><div><p className="public-eyebrow">A little space to reflect</p><h3>Find the words.<br /><em>Then revisit them.</em></h3><p>Start with your own question in the desk above. The Practice page explains what you can do now and what awaits reviewed material.</p><Link href="/practice" className="chapter-link">Practise with your own words <Arrow /></Link></div></article>
      </div>
    </section>

    <section className="community-chapter" aria-labelledby="community-title"><div className="shell community-layout"><div className="community-arch" aria-hidden="true"><GeoStar size={56} /></div><div><p className="public-eyebrow">A conversation has people on both sides</p><h2 id="community-title">Bring curiosity.<br /><em>Leave room for others.</em></h2></div><div className="community-copy"><p>A welcoming Corner starts with listening, dignity and the freedom to keep something private.</p><p>Public discussion and mentorship are not open yet. You can read the participation principles while moderation is being prepared.</p><Link href="/community" className="chapter-link">Make room for each other <Arrow /></Link></div></div></section>

    <section className="shell corner-chapter" aria-labelledby="personal-title"><div className="corner-symbol" aria-hidden="true"><span /><GeoStar size={36} /></div><div><p className="public-eyebrow">Your own pace. Your own space.</p><h2 id="personal-title">A corner <em>of your own.</em></h2><p>Some thoughts belong in your own notebook. My Corner explains account availability, private notes and the controls for your own data.</p><Link href="/me" className="chapter-link">Visit My Corner <Arrow /></Link></div><p className="corner-aside">A place to return to.<br /><em>When you&rsquo;re ready.</em></p></section>
  </>;
}
