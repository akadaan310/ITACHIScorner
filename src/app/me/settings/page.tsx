import type { Metadata } from "next";
import { MemberFrame, SettingsView } from "@/components/member";

export const metadata: Metadata = { title: "Settings & privacy" };

export default function Page() {
  return (
    <MemberFrame title="Settings & privacy" allowGuest>
      <SettingsView />
    </MemberFrame>
  );
}
