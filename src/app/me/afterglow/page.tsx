import type { Metadata } from "next";
import { MemberFrame, MyAfterglow } from "@/components/member";

export const metadata: Metadata = { title: "My Afterglow" };

export default function Page() {
  return (
    <MemberFrame title="My Afterglow">
      <MyAfterglow />
    </MemberFrame>
  );
}
