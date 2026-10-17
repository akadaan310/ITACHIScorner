import type { Metadata } from "next";
import { MemberFrame, ConstellationView } from "@/components/member";

export const metadata: Metadata = { title: "My constellation" };

export default function Page() {
  return (
    <MemberFrame title="My constellation">
      <ConstellationView />
    </MemberFrame>
  );
}
