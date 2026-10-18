import Link from "next/link";
import { getPublishedQuestions } from "@/lib/published-content";

/** Public reviewed read model only. Never forwards a private research record. */
export async function SourcePreview() {
  const result = await getPublishedQuestions();
  return <div className="source-preview">
    <form action="/explore" role="search"><label htmlFor="home-source-search">Find a question worth staying with</label><div className="source-preview-search"><input id="home-source-search" className="field" name="q" type="search" maxLength={200} placeholder="What are you curious about?" /><button className="btn btn-primary" type="submit">Search questions</button></div></form>
    {result.items.length > 0 ? <ul className="source-preview-results" aria-label="Reviewed question preview">{result.items.slice(0, 2).map(item => <li key={item.id}><p className="status-label">Reviewed conversation</p><h3>{item.title}</h3><p>{item.summary}</p><Link className="chapter-link" href="/explore">Follow the source</Link></li>)}</ul> : <p className="source-preview-status">{result.status === "unavailable" ? "The collection could not be loaded. You can retry your search in Explore." : "No reviewed questions are published yet. Search is ready; source excerpts await permission and review."}</p>}
    <details className="source-disclosure"><summary><span>What makes a source worth following?</span><span className="disclosure-symbol" aria-hidden="true">+</span></summary><p>The original conversation, its exact moment, the surrounding context and permission to share. Editorial review comes before a question becomes a lesson.</p></details>
  </div>;
}
