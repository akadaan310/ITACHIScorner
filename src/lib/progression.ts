import type { CheckIn, LiveEvent, TriviaAttempt, TriviaSet, XpEntry } from "@/lib/types";

/**
 * Levels describe participation in this app's learning activities only.
 * They are never a measure of faith, piety, knowledge of religion,
 * scholarly authority, conversions, or money spent.
 */
export const levels = [
  { id: "initiate", name: "Initiate", min: 0, blurb: "You've lit your first star in the app — welcome to the ranks." },
  { id: "squire", name: "Squire", min: 100, blurb: "You return to train: a few challenges, a few notes." },
  { id: "warrior", name: "Warrior", min: 300, blurb: "You follow learning paths across several worlds of the app." },
  { id: "vanguard", name: "Vanguard", min: 700, blurb: "You complete Simulator paths and keep a thoughtful journal here." },
  { id: "keeper", name: "Keeper of the Corner", min: 1500, blurb: "Long-time app participant who helps keep shared spaces kind." },
] as const;

export type Level = (typeof levels)[number];

export const LEVEL_DISCLAIMER =
  "Levels measure participation in this app's learning activities — not faith, piety, religious knowledge or authority.";

export function totalXp(ledger: XpEntry[]): number {
  return ledger.reduce((sum, e) => sum + e.amount, 0);
}

export function levelFor(xp: number): { level: Level; next: Level | null; progress: number } {
  let idx = 0;
  for (let i = 0; i < levels.length; i++) if (xp >= levels[i]!.min) idx = i;
  const level = levels[idx]!;
  const next = levels[idx + 1] ?? null;
  const progress = next ? (xp - level.min) / (next.min - level.min) : 1;
  return { level, next, progress: Math.max(0, Math.min(1, progress)) };
}

/** XP rules — learning and useful participation only. No purchases, ever. */
export const XP = {
  join: 20,
  appCheckIn: 15,
  selfReported: 5,
  triviaCorrect: 10,
  triviaComplete: 10,
  dojoStep: 15,
  dojoComplete: 50,
  journalEntry: 10,
  starVisit: 2,
  momentSaved: 3,
  sanctuaryNote: 0,
} as const;

/* ── Trivia scoring ─────────────────────────────────────────── */

export function isWindowOpen(set: TriviaSet, minutesIntoLive: number): boolean {
  return minutesIntoLive >= 0 && minutesIntoLive < set.windowMinutes;
}

export function scoreAttempt(set: TriviaSet, attempt: TriviaAttempt) {
  const answered = set.questions.filter((q) => attempt.answers[q.id]);
  const correct = answered.filter((q) => attempt.answers[q.id]!.correct).length;
  const total = set.questions.length;
  const accuracy = total === 0 ? 0 : correct / total;
  const complete = answered.length === total;
  const xp = attempt.practice ? 0 : correct * XP.triviaCorrect + (complete ? XP.triviaComplete : 0);
  return { correct, total, accuracy, complete, xp };
}

/** Evaluate one answer. A late or missing answer is never correct. */
export function judgeAnswer(
  correctId: string,
  optionId: string | null,
  elapsedMs: number,
  timeLimitSec: number,
): { correct: boolean; timedOut: boolean } {
  const timedOut = elapsedMs > timeLimitSec * 1000;
  return { correct: !timedOut && optionId !== null && optionId === correctId, timedOut };
}

/* ── Truthful streaks ───────────────────────────────────────── */

export interface StreakSummary {
  /** Consecutive most-recent eligible events with an in-app check-in. */
  appStreak: number;
  appCheckIns: number;
  selfReported: number;
  /** Always 0 until an authorised platform integration exists. */
  platformVerified: number;
}

export function streaks(checkIns: CheckIn[], allEvents: LiveEvent[]): StreakSummary {
  const eligible = allEvents
    .filter((e) => e.status !== "scheduled")
    .sort((a, b) => b.schedule.daysFromNow - a.schedule.daysFromNow);
  const appIds = new Set(checkIns.filter((c) => c.kind === "app-check-in").map((c) => c.eventId));
  let appStreak = 0;
  for (const e of eligible) {
    if (appIds.has(e.id)) appStreak++;
    else break;
  }
  return {
    appStreak,
    appCheckIns: appIds.size,
    selfReported: new Set(checkIns.filter((c) => c.kind === "self-reported").map((c) => c.eventId)).size,
    platformVerified: checkIns.filter((c) => c.provenance.verificationStatus === "verified-event").length,
  };
}

/* ── Badges & quests ────────────────────────────────────────── */

export const badges = [
  { id: "first-light", name: "First Light", glyph: "✦", hint: "Check in to a live inside the app." },
  { id: "trivia-spark", name: "Trivia Spark", glyph: "✧", hint: "Finish a First-30 challenge." },
  { id: "scribe", name: "Afterglow Scribe", glyph: "✎", hint: "Write your first journal entry." },
  { id: "careful-listener", name: "Careful Listener", glyph: "◎", hint: "Complete a Dojo path." },
  { id: "cartographer", name: "Star Cartographer", glyph: "✺", hint: "Visit five stars in the Night Atlas." },
  { id: "question-keeper", name: "Question Keeper", glyph: "❖", hint: "Save three Afterglow moments." },
  { id: "sanctuary-guest", name: "Sanctuary Guest", glyph: "☾", hint: "Open a Reverts Sanctuary journey." },
] as const;

export type BadgeId = (typeof badges)[number]["id"];

export interface QuestState {
  checkIns: number;
  triviaDone: boolean;
  journal: number;
  dojoDone: boolean;
  starsVisited: number;
  momentsSaved: number;
  sanctuaryOpened: boolean;
}

export const quests = [
  { id: "q-checkin", title: "Be there, together", body: "Check in to one live from the app.", goal: 1, measure: (s: QuestState) => s.checkIns, href: "/afterglow/live", world: "afterglow" },
  { id: "q-trivia", title: "The First-30", body: "Finish one timed trivia challenge.", goal: 1, measure: (s: QuestState) => (s.triviaDone ? 1 : 0), href: "/afterglow/live", world: "afterglow" },
  { id: "q-dojo", title: "Walk the path of reasoning", body: "Complete the Oneness path in the Simulator.", goal: 1, measure: (s: QuestState) => (s.dojoDone ? 1 : 0), href: "/dojo/path", world: "dojo" },
  { id: "q-atlas", title: "Chart five stars", body: "Visit five destinations on the Night Atlas.", goal: 5, measure: (s: QuestState) => s.starsVisited, href: "/atlas", world: "atlas" },
  { id: "q-journal", title: "Keep the glow", body: "Write two journal reflections.", goal: 2, measure: (s: QuestState) => s.journal, href: "/me/journal", world: "afterglow" },
  { id: "q-moments", title: "Hold on to a moment", body: "Save three moments from Afterglow recaps.", goal: 3, measure: (s: QuestState) => s.momentsSaved, href: "/afterglow/episodes/sample-episode-01", world: "afterglow" },
] as const;

export const intentions = [
  { id: "curious", label: "Curious", blurb: "I'm exploring and want to understand." },
  { id: "student", label: "Student", blurb: "I'm studying and want structure." },
  { id: "dialogue-explorer", label: "Dialogue Explorer", blurb: "I love conversations across beliefs." },
  { id: "new-muslim", label: "New Muslim", blurb: "I recently embraced Islam (kept private)." },
  { id: "returning-learner", label: "Returning Learner", blurb: "I'm reconnecting with my faith." },
  { id: "other", label: "Something else", blurb: "My own reason — no explanation needed." },
] as const;

export const constellations = [
  { id: "oneness", name: "The Lantern", arabic: "المِشْكاة", blurb: "Begin with the Oneness of God.", color: "#D7AD65" },
  { id: "asking", name: "The Compass", arabic: "البَوْصَلة", blurb: "Begin with the art of asking well.", color: "#26C4B3" },
  { id: "signs", name: "The Nile Arc", arabic: "قَوْسُ النِّيل", blurb: "Begin with signs in creation.", color: "#A58BE1" },
  { id: "first-steps", name: "The Dawn Gate", arabic: "بَوّابةُ الفَجْر", blurb: "Begin gently with first steps.", color: "#FA536D" },
] as const;

export const languages = ["English", "العربية", "Español", "Français", "Bahasa", "اردو", "Türkçe", "Deutsch"] as const;
