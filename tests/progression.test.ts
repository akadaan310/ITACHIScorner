import { describe, expect, it } from "vitest";
import { events } from "@/lib/fixtures/events";
import { getTriviaSet } from "@/lib/fixtures/trivia";
import { isWindowOpen, judgeAnswer, levelFor, levels, scoreAttempt, streaks, totalXp, XP } from "@/lib/progression";
import type { CheckIn, TriviaAttempt } from "@/lib/types";

const set = getTriviaSet("trivia-signs")!;
const prov = (status: CheckIn["provenance"]["verificationStatus"]) => ({ source: "AppCheckIn" as const, verificationStatus: status, capturedAt: "2026-10-17T00:00:00Z" });

describe("levels", () => {
  it("starts at Initiate and progresses by credits", () => {
    expect(levelFor(0).level.name).toBe("Initiate");
    expect(levelFor(99).level.name).toBe("Initiate");
    expect(levelFor(100).level.name).toBe("Squire");
    expect(levelFor(5000).level.name).toBe("Keeper of the Corner");
    expect(levelFor(5000).next).toBeNull();
  });
  it("reports progress between ranks within [0,1]", () => {
    const p = levelFor(200).progress;
    expect(p).toBeGreaterThan(0);
    expect(p).toBeLessThan(1);
  });
  it("level thresholds strictly increase", () => {
    for (let i = 1; i < levels.length; i++) expect(levels[i]!.min).toBeGreaterThan(levels[i - 1]!.min);
  });
  it("sums the ledger", () => {
    expect(totalXp([{ key: "a", amount: 10, reason: "", at: "", source: "Demo" }, { key: "b", amount: 5, reason: "", at: "", source: "Demo" }])).toBe(15);
  });
});

describe("trivia", () => {
  it("opens only during the first 30 minutes", () => {
    expect(isWindowOpen(set, 0)).toBe(true);
    expect(isWindowOpen(set, 29)).toBe(true);
    expect(isWindowOpen(set, 30)).toBe(false);
    expect(isWindowOpen(set, -1)).toBe(false);
  });
  it("never counts a late answer as correct", () => {
    expect(judgeAnswer("a", "a", 5000, 20)).toEqual({ correct: true, timedOut: false });
    expect(judgeAnswer("a", "a", 20001, 20)).toEqual({ correct: false, timedOut: true });
    expect(judgeAnswer("a", null, 1000, 20).correct).toBe(false);
    expect(judgeAnswer("a", "b", 1000, 20).correct).toBe(false);
  });
  it("scores a full attempt and awards completion credits", () => {
    const answers = Object.fromEntries(set.questions.map((q) => [q.id, { optionId: q.correctId, correct: true, ms: 1000, timedOut: false }]));
    const attempt: TriviaAttempt = { setId: set.id, startedAt: "", answers, practice: false };
    const r = scoreAttempt(set, attempt);
    expect(r.correct).toBe(set.questions.length);
    expect(r.accuracy).toBe(1);
    expect(r.xp).toBe(set.questions.length * XP.triviaCorrect + XP.triviaComplete);
  });
  it("practice attempts award nothing", () => {
    const answers = Object.fromEntries(set.questions.map((q) => [q.id, { optionId: q.correctId, correct: true, ms: 1000, timedOut: false }]));
    expect(scoreAttempt(set, { setId: set.id, startedAt: "", answers, practice: true }).xp).toBe(0);
  });
  it("every question's correct answer is one of its options", () => {
    for (const q of set.questions) expect(q.options.map((o) => o.id)).toContain(q.correctId);
  });
});

describe("truthful streaks", () => {
  it("counts consecutive in-app check-ins only", () => {
    const checkIns: CheckIn[] = [
      { eventId: "demo-live-now", kind: "app-check-in", at: "", provenance: prov("verified") },
      { eventId: "sample-episode-01", kind: "app-check-in", at: "", provenance: prov("verified") },
      { eventId: "sample-episode-02", kind: "self-reported", at: "", provenance: prov("self-entered") },
    ];
    const s = streaks(checkIns, events);
    expect(s.appStreak).toBe(2);
    expect(s.appCheckIns).toBe(2);
    expect(s.selfReported).toBe(1);
    expect(s.platformVerified).toBe(0);
  });
  it("an intention ('I'll be there') never counts as attendance", () => {
    const s = streaks([{ eventId: "sample-next-live", kind: "intent", at: "", provenance: prov("self-entered") }], events);
    expect(s.appCheckIns + s.selfReported + s.platformVerified).toBe(0);
  });
  it("a self-reported entry never becomes platform-verified", () => {
    const s = streaks([{ eventId: "sample-episode-01", kind: "self-reported", at: "", provenance: prov("self-entered") }], events);
    expect(s.platformVerified).toBe(0);
  });
});
