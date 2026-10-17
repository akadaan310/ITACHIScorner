import type { Metadata } from "next";
import { ChapterHeader } from "@/components/ui";
import { creator } from "@/lib/config/creator";

export const metadata: Metadata = { title: "Concept terms" };

export default function TermsPage() {
  return (
    <div className="pb-10">
      <ChapterHeader eyebrow="Concept terms" title={<>The small print, <em className="text-gold">kindly.</em></>}>{creator.disclosure}</ChapterHeader>
      <div className="shell">
        <div className="prose-soft max-w-3xl">
        <ul>
          <li>This is a non-commercial concept demo. No purchases, subscriptions or billing exist.</li>
          <li>Itachi, Da&rsquo;wah x Dialogues and related names belong to their owners. Their use here describes an unsolicited concept and implies no endorsement.</li>
          <li>Sample content is fictional and labelled. It must not be quoted as the creator&rsquo;s words or views.</li>
          <li>Educational content is not a religious ruling. Please consult qualified scholars for guidance.</li>
          <li>Fonts are used under the SIL Open Font License. Qur&rsquo;an text: Tanzil Project (verbatim, attributed).</li>
          <li>Be kind. The concept has no tolerance for harassment of anyone, including people of other faiths.</li>
        </ul>
        </div>
      </div>
    </div>
  );
}
