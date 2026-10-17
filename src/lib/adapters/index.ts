import type { CheckIn, Provenance, SourceKind, VerificationStatus } from "@/lib/types";

/**
 * Live source adapters. Each one reports honestly whether it can run.
 * Missing integrations fail into demo + self check-in UI — never into
 * fabricated live data. See docs/LIVE_INTEGRATIONS.md.
 */
export interface AdapterStatus {
  source: SourceKind;
  label: string;
  available: boolean;
  reason: string;
  /** The strongest verification this adapter could ever produce. */
  ceiling: VerificationStatus;
}

export interface LiveSourceAdapter {
  status(): AdapterStatus;
  /** Attendance signals this adapter can legitimately produce for an event. */
  attendance(eventId: string): Promise<CheckIn[]>;
}

const now = () => new Date().toISOString();

export const DemoAdapter: LiveSourceAdapter = {
  status: () => ({
    source: "Demo",
    label: "Demo fixtures",
    available: true,
    reason: "Bundled fictional events and trivia, visibly labelled as demo.",
    ceiling: "simulated",
  }),
  attendance: async () => [],
};

export const AppCheckInAdapter: LiveSourceAdapter = {
  status: () => ({
    source: "AppCheckIn",
    label: "In-app check-in",
    available: true,
    reason: "You pressed “I'm here” inside this app. The app can verify its own button — nothing more.",
    ceiling: "verified",
  }),
  attendance: async () => [],
};

export const YouTubeLiveChatAdapter: LiveSourceAdapter = {
  status: () => ({
    source: "YouTubeLiveChat",
    label: "YouTube live chat",
    available: false,
    reason:
      "Not connected. Would require creator-authorised API access and a member's consented Google sign-in binding before any chat author could be matched to a member.",
    ceiling: "verified-event",
  }),
  attendance: async () => [],
};

export const TikTokOfficialAdapter: LiveSourceAdapter = {
  status: () => ({
    source: "TikTokOfficialIfAuthorized",
    label: "TikTok (official, if authorised)",
    available: false,
    reason:
      "Not connected. TikTok Login Kit's documented user scopes do not grant access to LIVE comments, viewer lists or attendance. Nothing is inferred from a typed username.",
    ceiling: "connected-via-provider",
  }),
  attendance: async () => [],
};

export const ManualCreatorExportAdapter: LiveSourceAdapter = {
  status: () => ({
    source: "ManualCreatorExport",
    label: "Creator-provided export",
    available: false,
    reason: "No export has been supplied. Would require the creator's own lawful export plus member consent.",
    ceiling: "verified-event",
  }),
  attendance: async () => [],
};

export const adapters: LiveSourceAdapter[] = [
  DemoAdapter,
  AppCheckInAdapter,
  YouTubeLiveChatAdapter,
  TikTokOfficialAdapter,
  ManualCreatorExportAdapter,
];

export function provenanceFor(source: SourceKind, verificationStatus: VerificationStatus, eventId?: string): Provenance {
  return { source, verificationStatus, capturedAt: now(), eventId };
}
