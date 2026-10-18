import type { Metadata } from "next";
import { PublicHeader } from "@/components/public-content";
export const metadata: Metadata = { title: "Frequently asked questions" };
const questions = [
  ["Is this Itachi’s official website?", "No. This is an independent creator gift under development. It is unaffiliated and has not been endorsed by Itachi."],
  ["Where are the lessons and conversations?", "The source collection is being prepared. Only real material with the required permission and review will be published. There is no course, practice collection or book available yet."],
  ["Does the Corner host livestreams?", "No. Livestream discovery and viewing remain on the creator’s own social platforms."],
  ["Can I create an account?", "My Corner explains account availability. Sign-in works only when the account service is configured; a browser demo profile is not an account."],
  ["Can I join a discussion or find a mentor?", "Community submissions and mentorship are not open. They require real moderation, privacy controls and consenting participants."],
  ["Can I buy a membership?", "No. Payments, prices and paid memberships are not active."],
];
export default function FaqPage() { return <div className="public-page"><PublicHeader label="FAQ" title={<>A few questions<br /><em>about the Corner.</em></>}><p>What is available, what is being prepared and what needs approval.</p></PublicHeader><div className="shell"><div className="max-w-3xl space-y-3">{questions.map(([q,a]) => <details key={q} className="faq-item"><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></div></div>; }
