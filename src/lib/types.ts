/**
 * Typed schema for Itachi's Corner.
 *
 * Every piece of live-adjacent data carries provenance: where it came from
 * (`source`), how much we can trust it (`verificationStatus`), whether the
 * person consented (`consent`), when it was captured (`capturedAt`) and the
 * live event it belongs to (`eventId`). Nothing is ever shown as "verified"
 * unless an adapter that can actually verify it produced it.
 */

export type SourceKind =
  | "Demo"
  | "YouTubeLiveChat"
  | "TikTokOfficialIfAuthorized"
  | "ManualCreatorExport"
  | "AppCheckIn";

export type VerificationStatus =
  /** Confirmed by an authorised integration or a reviewed editorial source. */
  | "verified"
  /** Illustrative fixture written for the demo; not a real event or quote. */
  | "sample"
  /** A running simulation (e.g. the demo live scenario). */
  | "simulated"
  /** Typed by the member themselves; proves nothing about account ownership. */
  | "self-entered"
  /** Bound through an official provider login with the member's consent. */
  | "connected-via-provider"
  /** Attendance confirmed by a permitted platform integration for one event. */
  | "verified-event"
  /** Awaiting human editorial review before publication. */
  | "pending-review"
  /** The integration is not available; nothing to show. */
  | "unavailable";

export interface ConsentRecord {
  granted: boolean;
  scope: string[];
  grantedAt?: string;
}

export interface Provenance {
  source: SourceKind;
  verificationStatus: VerificationStatus;
  capturedAt: string;
  eventId?: string;
  consent?: ConsentRecord;
  note?: string;
}

export type Platform = "tiktok" | "youtube";

export interface QuranRef {
  id: string;
  surah: number;
  ayah: string;
  surahName: string;
  ayahStart: number;
  /** One string per verse, verbatim from the source text. */
  verses: string[];
  translation: string;
  translator: string;
  textSource: string;
  /** Arabic was retrieved from the Tanzil "simple" text; human review still required before launch. */
  reviewStatus: "text-retrieved-pending-editor-review" | "editor-reviewed";
}

export interface Moment {
  id: string;
  label: string;
  /** Only present when sourced from a real public replay. */
  timestamp?: string;
  timestampStatus: "sourced" | "sample";
  kind: "question" | "reflection" | "reference" | "highlight";
  body: string;
  referenceId?: string;
}

export interface EpisodeRecap {
  summary: string;
  replay: { platform: Platform; url?: string; status: "public" | "unavailable" | "sample" };
  moments: Moment[];
  journalPrompts: string[];
  unlocked: string[];
  atlasNodes: string[];
}

export type LiveStatus = "scheduled" | "live" | "completed";

export interface LiveEvent {
  id: string;
  title: string;
  kicker: string;
  platforms: Platform[];
  status: LiveStatus;
  /** Relative schedule so fixtures never go stale. Resolved on the client. */
  schedule: { daysFromNow: number; hour: number; minute: number };
  durationMin: number;
  scheduleVerification: "verified" | "sample";
  description: string;
  topics: string[];
  provenance: Provenance;
  triviaSetId?: string;
  recap?: EpisodeRecap;
  palette: [string, string];
}

export interface TriviaOption {
  id: string;
  label: string;
}

export interface TriviaQuestion {
  id: string;
  prompt: string;
  options: TriviaOption[];
  correctId: string;
  explanation: string;
  timeLimitSec: number;
  referenceId?: string;
}

export interface TriviaSet {
  id: string;
  eventId: string;
  title: string;
  /** Challenge is open only during the first N minutes of the live. */
  windowMinutes: number;
  questions: TriviaQuestion[];
  provenance: Provenance;
}

export interface TriviaAnswer {
  optionId: string | null;
  correct: boolean;
  ms: number;
  timedOut: boolean;
}

export interface TriviaAttempt {
  setId: string;
  startedAt: string;
  finishedAt?: string;
  answers: Record<string, TriviaAnswer>;
  /** Practice attempts (after the window, or retries) never award XP. */
  practice: boolean;
}

export type Intention =
  | "curious"
  | "student"
  | "dialogue-explorer"
  | "new-muslim"
  | "returning-learner"
  | "other";

export interface Profile {
  nickname: string;
  intention: Intention;
  languages: string[];
  constellation: string;
  joinedAt: string;
  starSeed: number;
  flair?: string;
}

export type DemoRole =
  | "signed-out"
  | "new-member"
  | "return-member"
  | "free-member"
  | "patron-preview"
  | "moderator";

export interface XpEntry {
  key: string;
  amount: number;
  reason: string;
  at: string;
  source: SourceKind;
}

export type CheckInKind =
  /** "I'll be there" — an intention, never counted as attendance. */
  | "intent"
  /** Pressed "I'm here" inside the app while the live was on. Verified by the app itself. */
  | "app-check-in"
  /** Member says they watched on TikTok/YouTube. Self-reported, not verified. */
  | "self-reported";

export interface CheckIn {
  eventId: string;
  kind: CheckInKind;
  at: string;
  provenance: Provenance;
}

export interface HandleBinding {
  platform: Platform;
  handle: string;
  status: Extract<VerificationStatus, "self-entered" | "connected-via-provider">;
  at: string;
}

export interface JournalEntry {
  id: string;
  at: string;
  title: string;
  body: string;
  prompt?: string;
  eventId?: string;
}

export interface AtlasNode {
  id: string;
  label: string;
  arabic?: string;
  cluster: string;
  kind: "cluster" | "passage" | "practice" | "episode" | "track" | "chapter" | "question";
  x: number;
  y: number;
  href: string;
  question: string;
  summary: string;
  path: string;
  status: "live" | "sample" | "planned";
  referenceId?: string;
}
