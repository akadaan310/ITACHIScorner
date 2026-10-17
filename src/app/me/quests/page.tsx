import type { Metadata } from "next";
import { MemberFrame, QuestBoard } from "@/components/member";

export const metadata: Metadata = { title: "Quests & badges" };

export default function Page() {
  return (
    <MemberFrame title="Quests & badges">
      <QuestBoard />
    </MemberFrame>
  );
}
