import type { Metadata } from "next";
import { MemberFrame, ProfileOverview } from "@/components/member";

export const metadata: Metadata = { title: "My profile" };

export default function Page() {
  return (
    <MemberFrame title="My profile">
      <ProfileOverview />
    </MemberFrame>
  );
}
