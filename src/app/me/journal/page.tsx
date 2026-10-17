import type { Metadata } from "next";
import { MemberFrame, JournalView } from "@/components/member";

export const metadata: Metadata = { title: "My journal" };

export default function Page() {
  return (
    <MemberFrame title="My journal">
      <JournalView />
    </MemberFrame>
  );
}
