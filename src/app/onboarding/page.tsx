import type { Metadata } from "next";
import { Onboarding } from "@/components/onboarding";
import { StarField } from "@/components/art";

export const metadata: Metadata = { title: "Join the Ranks · onboarding", description: "Choose a nickname, an intention, languages and a starting constellation." };

export default function OnboardingPage() {
  return (
    <div className="relative overflow-hidden pb-16">
      <StarField seed={19} count={120} height={900} className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />
      <div className="shell relative pt-10">
        <p className="eyebrow justify-center text-center">Join the ranks · free forever</p>
        <h1 className="mt-3 text-center text-6xl leading-[0.9] text-cream sm:text-7xl">Receive your <em className="text-gold">invitation.</em></h1>
        <div className="mt-10"><Onboarding /></div>
      </div>
    </div>
  );
}
