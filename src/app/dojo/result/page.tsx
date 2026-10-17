import type { Metadata } from "next";
import { DojoResult } from "@/components/dojo-result";
import { ChapterHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Learning result", description: "Your Simulator learning result." };

export default function DojoResultPage() {
  return (
    <div data-world="dojo" className="pb-10">
      <ChapterHeader eyebrow="Dawah Simulator · learning result" title={<>Not a victory. <em className="text-teal">A clearer mind.</em></>}>
        Results measure clarity, fairness, evidence and listening — never who “won”.
      </ChapterHeader>
      <div className="shell"><DojoResult /></div>
    </div>
  );
}
