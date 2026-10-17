import type { Metadata } from "next";
import { CreatorConsole } from "@/components/creator-console";
import { ChapterHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Creator console (demo preview)", robots: { index: false } };

export default function CreatorPage() {
  return (
    <div className="pb-10">
      <ChapterHeader eyebrow="Studio · creator console" title={<>Creator tools, <em className="text-coral">as a concept.</em></>}>
        Event builder, trivia composer, Afterglow approvals, provenance, moderation and integrations — all mock, all local, nothing real.
      </ChapterHeader>
      <div className="shell"><CreatorConsole /></div>
    </div>
  );
}
