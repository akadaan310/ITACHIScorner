"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import { provenanceFor } from "@/lib/adapters";
import { events } from "@/lib/fixtures/events";
import { getTriviaSet } from "@/lib/fixtures/trivia";
import { XP, badges as badgeList, judgeAnswer, type BadgeId } from "@/lib/progression";
import type {
  CheckIn,
  CheckInKind,
  DemoRole,
  HandleBinding,
  JournalEntry,
  Platform,
  Profile,
  TriviaAttempt,
  XpEntry,
} from "@/lib/types";

export interface Settings {
  leaderboardOptIn: boolean;
  showAchievements: boolean;
  showRankings: boolean;
  profileVisibility: "private" | "circle" | "public";
  motion: "system" | "reduced";
  commentConsent: boolean;
  milestoneNotices: boolean;
}

export interface DemoState {
  role: DemoRole;
  profile: Profile | null;
  xp: XpEntry[];
  badges: { id: BadgeId; at: string }[];
  checkIns: CheckIn[];
  reminders: string[];
  polls: Record<string, string>;
  trivia: Record<string, TriviaAttempt>;
  dojo: { step: number; answers: Record<string, { choice?: string; reasoning?: string; correct?: boolean }>; completed: boolean };
  journal: JournalEntry[];
  savedMoments: string[];
  visitedStars: string[];
  bookmarks: string[];
  privateNotes: { id: string; body: string; at: string }[];
  wall: { id: string; body: string; anonymous: boolean; at: string; status: "pending-review" | "approved" | "hidden" }[];
  thread: { id: string; body: string; at: string; minute: number }[];
  liveMarks: { id: string; minute: number; note: string; at: string }[];
  mentorRequest: { topic: string; at: string } | null;
  sanctuaryOpened: string[];
  handles: Partial<Record<Platform, HandleBinding>>;
  settings: Settings;
  lastVisit: string | null;
  previousVisit: string | null;
  notices: { id: string; text: string; at: string }[];
  creatorPreview: boolean;
}

interface Actions {
  join: (p: Omit<Profile, "joinedAt" | "starSeed">) => void;
  awardXp: (key: string, amount: number, reason: string) => void;
  grantBadge: (id: BadgeId) => void;
  checkIn: (eventId: string, kind: CheckInKind) => void;
  toggleReminder: (eventId: string) => void;
  vote: (pollId: string, optionId: string) => void;
  startTrivia: (setId: string, practice: boolean) => void;
  answerTrivia: (setId: string, questionId: string, optionId: string | null, elapsedMs: number) => void;
  finishTrivia: (setId: string) => void;
  resetTrivia: (setId: string) => void;
  dojoAnswer: (stepId: string, data: { choice?: string; reasoning?: string; correct?: boolean }) => void;
  dojoGo: (step: number) => void;
  dojoComplete: () => void;
  dojoReset: () => void;
  addJournal: (e: Omit<JournalEntry, "id" | "at">) => void;
  removeJournal: (id: string) => void;
  toggleMoment: (id: string) => void;
  visitStar: (id: string) => void;
  toggleBookmark: (id: string) => void;
  addPrivateNote: (body: string) => void;
  removePrivateNote: (id: string) => void;
  askWall: (body: string, anonymous: boolean) => void;
  moderateWall: (id: string, status: "approved" | "hidden") => void;
  postThread: (body: string, minute: number) => void;
  markLive: (minute: number, note: string) => void;
  requestMentor: (topic: string) => void;
  openSanctuary: (journeyId: string) => void;
  setHandle: (platform: Platform, handle: string) => void;
  unbindHandle: (platform: Platform) => void;
  updateSettings: (s: Partial<Settings>) => void;
  updateProfile: (p: Partial<Profile>) => void;
  touchVisit: () => void;
  dismissNotice: (id: string) => void;
  setCreatorPreview: (v: boolean) => void;
  loadRole: (role: DemoRole) => void;
  resetAll: () => void;
}

export const defaultSettings: Settings = {
  leaderboardOptIn: false,
  showAchievements: true,
  showRankings: true,
  profileVisibility: "private",
  motion: "system",
  commentConsent: false,
  milestoneNotices: true,
};

export const initialState: DemoState = {
  role: "signed-out",
  profile: null,
  xp: [],
  badges: [],
  checkIns: [],
  reminders: [],
  polls: {},
  trivia: {},
  dojo: { step: 0, answers: {}, completed: false },
  journal: [],
  savedMoments: [],
  visitedStars: [],
  bookmarks: [],
  privateNotes: [],
  wall: [],
  thread: [],
  liveMarks: [],
  mentorRequest: null,
  sanctuaryOpened: [],
  handles: {},
  settings: defaultSettings,
  lastVisit: null,
  previousVisit: null,
  notices: [],
  creatorPreview: false,
};

const iso = () => new Date().toISOString();
const uid = () => Math.random().toString(36).slice(2, 10);

function seedFor(name: string) {
  let h = 2166136261;
  for (const ch of name) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

/** Preset demo states — clearly demo, loadable from Settings or /studio. */
function presetFor(role: DemoRole): DemoState {
  const base: DemoState = { ...initialState, role, settings: { ...defaultSettings } };
  if (role === "signed-out") return base;
  const joinedAt = new Date(Date.now() - (role === "new-member" ? 0 : 1000 * 60 * 60 * 24 * 21)).toISOString();
  const profile: Profile = {
    nickname: role === "moderator" ? "Demo Moderator" : role === "patron-preview" ? "Demo Patron" : "Demo Explorer",
    intention: "curious",
    languages: ["English"],
    constellation: "oneness",
    joinedAt,
    starSeed: seedFor(role),
    flair: role === "patron-preview" ? "Gilded Orbit (cosmetic preview)" : undefined,
  };
  const xp: XpEntry[] = [{ key: "join", amount: XP.join, reason: "Joined the ranks", at: joinedAt, source: "AppCheckIn" }];
  if (role === "new-member") {
    return { ...base, profile, xp, notices: [{ id: "welcome", text: "Your star card is ready. Try the First-30 challenge next.", at: iso() }] };
  }
  const past = events.find((e) => e.id === "sample-episode-01")!;
  const richer: DemoState = {
    ...base,
    profile,
    xp: [
      ...xp,
      { key: "checkin:sample-episode-01", amount: XP.appCheckIn, reason: "In-app check-in · Episode I (demo)", at: joinedAt, source: "AppCheckIn" },
      { key: "trivia:demo-correct", amount: 50, reason: "First-30 challenge · 5 correct (demo)", at: joinedAt, source: "Demo" },
      { key: "journal:seed", amount: XP.journalEntry, reason: "Journal reflection", at: joinedAt, source: "AppCheckIn" },
      { key: "dojo:seed", amount: 90, reason: "Simulator steps (demo)", at: joinedAt, source: "Demo" },
    ],
    badges: [
      { id: "first-light", at: joinedAt },
      { id: "scribe", at: joinedAt },
    ],
    checkIns: [
      { eventId: past.id, kind: "app-check-in", at: joinedAt, provenance: provenanceFor("AppCheckIn", "verified", past.id) },
      { eventId: "sample-episode-02", kind: "self-reported", at: joinedAt, provenance: provenanceFor("Demo", "self-entered", "sample-episode-02") },
    ],
    journal: [
      { id: "seed", at: joinedAt, title: "The question that stayed", body: "Restating someone's view fairly first changes the whole conversation.", eventId: past.id, prompt: past.recap!.journalPrompts[0] },
    ],
    savedMoments: ["sample-episode-01:m2"],
    visitedStars: ["oneness", "ikhlas"],
    previousVisit: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    lastVisit: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  };
  if (role === "moderator") return { ...richer, creatorPreview: true };
  return richer;
}

export const useDemo = create<DemoState & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,

      join: (p) => {
        const profile: Profile = { ...p, joinedAt: iso(), starSeed: seedFor(p.nickname + Date.now()) };
        set({ profile, role: "new-member" });
        get().awardXp("join", XP.join, "Joined the ranks");
        set((s) => ({ notices: [{ id: uid(), text: "Welcome to the ranks — your Explorer's Star Card is ready.", at: iso() }, ...s.notices] }));
      },

      awardXp: (key, amount, reason) => {
        if (amount <= 0) return;
        if (get().xp.some((e) => e.key === key)) return; // idempotent: no farming
        set((s) => ({ xp: [...s.xp, { key, amount, reason, at: iso(), source: "AppCheckIn" }] }));
      },

      grantBadge: (id) => {
        if (get().badges.some((b) => b.id === id)) return;
        set((s) => ({
          badges: [...s.badges, { id, at: iso() }],
          notices: s.settings.milestoneNotices ? [{ id: uid(), text: `Badge unlocked: ${badgeList.find((b) => b.id === id)?.name ?? id}`, at: iso() }, ...s.notices] : s.notices,
        }));
      },

      checkIn: (eventId, kind) => {
        if (get().checkIns.some((c) => c.eventId === eventId && c.kind === kind)) return;
        const provenance =
          kind === "app-check-in"
            ? provenanceFor("AppCheckIn", "verified", eventId)
            : kind === "self-reported"
              ? provenanceFor("AppCheckIn", "self-entered", eventId)
              : provenanceFor("AppCheckIn", "self-entered", eventId);
        set((s) => ({ checkIns: [...s.checkIns, { eventId, kind, at: iso(), provenance }] }));
        if (kind === "app-check-in") {
          get().awardXp(`checkin:${eventId}`, XP.appCheckIn, "In-app check-in");
          get().grantBadge("first-light");
        }
        if (kind === "self-reported") get().awardXp(`self:${eventId}`, XP.selfReported, "Self-reported attendance");
      },

      toggleReminder: (eventId) =>
        set((s) => ({ reminders: s.reminders.includes(eventId) ? s.reminders.filter((r) => r !== eventId) : [...s.reminders, eventId] })),

      vote: (pollId, optionId) => set((s) => ({ polls: { ...s.polls, [pollId]: optionId } })),

      startTrivia: (setId, practice) =>
        set((s) => ({ trivia: { ...s.trivia, [setId]: { setId, startedAt: iso(), answers: {}, practice } } })),

      answerTrivia: (setId, questionId, optionId, elapsedMs) => {
        const attempt = get().trivia[setId];
        const tset = getTriviaSet(setId);
        const q = tset?.questions.find((x) => x.id === questionId);
        if (!attempt || !q || attempt.answers[questionId]) return; // one answer per question
        const verdict = judgeAnswer(q.correctId, optionId, elapsedMs, q.timeLimitSec);
        set((s) => ({
          trivia: {
            ...s.trivia,
            [setId]: { ...attempt, answers: { ...attempt.answers, [questionId]: { optionId, ms: elapsedMs, ...verdict } } },
          },
        }));
      },

      finishTrivia: (setId) => {
        const attempt = get().trivia[setId];
        const tset = getTriviaSet(setId);
        if (!attempt || !tset || attempt.finishedAt) return;
        set((s) => ({ trivia: { ...s.trivia, [setId]: { ...attempt, finishedAt: iso() } } }));
        if (attempt.practice) return;
        const correct = Object.values(attempt.answers).filter((a) => a.correct).length;
        get().awardXp(`trivia:${setId}:correct`, correct * XP.triviaCorrect, `First-30 challenge · ${correct} correct`);
        if (Object.keys(attempt.answers).length === tset.questions.length) {
          get().awardXp(`trivia:${setId}:complete`, XP.triviaComplete, "Finished a First-30 challenge");
          get().grantBadge("trivia-spark");
        }
      },

      resetTrivia: (setId) =>
        set((s) => {
          const next = { ...s.trivia };
          delete next[setId];
          return { trivia: next };
        }),

      dojoAnswer: (stepId, data) => {
        set((s) => ({ dojo: { ...s.dojo, answers: { ...s.dojo.answers, [stepId]: { ...s.dojo.answers[stepId], ...data } } } }));
        get().awardXp(`dojo:${stepId}`, XP.dojoStep, "Simulator step");
      },
      dojoGo: (step) => set((s) => ({ dojo: { ...s.dojo, step } })),
      dojoComplete: () => {
        set((s) => ({ dojo: { ...s.dojo, completed: true } }));
        get().awardXp("dojo:complete:oneness", XP.dojoComplete, "Completed the Oneness path");
        get().grantBadge("careful-listener");
      },
      dojoReset: () => set({ dojo: { step: 0, answers: {}, completed: false } }),

      addJournal: (e) => {
        const entry = { ...e, id: uid(), at: iso() };
        set((s) => ({ journal: [entry, ...s.journal] }));
        get().awardXp(`journal:${entry.id}`, XP.journalEntry, "Journal reflection");
        get().grantBadge("scribe");
      },
      removeJournal: (id) => set((s) => ({ journal: s.journal.filter((j) => j.id !== id) })),

      toggleMoment: (id) => {
        const saved = get().savedMoments.includes(id);
        set((s) => ({ savedMoments: saved ? s.savedMoments.filter((m) => m !== id) : [...s.savedMoments, id] }));
        if (!saved) {
          get().awardXp(`moment:${id}`, XP.momentSaved, "Saved a moment");
          if (get().savedMoments.length >= 3) get().grantBadge("question-keeper");
        }
      },

      visitStar: (id) => {
        if (get().visitedStars.includes(id)) return;
        set((s) => ({ visitedStars: [...s.visitedStars, id] }));
        get().awardXp(`star:${id}`, XP.starVisit, "Visited a star");
        if (get().visitedStars.length >= 5) get().grantBadge("cartographer");
      },

      toggleBookmark: (id) =>
        set((s) => ({ bookmarks: s.bookmarks.includes(id) ? s.bookmarks.filter((b) => b !== id) : [...s.bookmarks, id] })),

      addPrivateNote: (body) => set((s) => ({ privateNotes: [{ id: uid(), body, at: iso() }, ...s.privateNotes] })),
      removePrivateNote: (id) => set((s) => ({ privateNotes: s.privateNotes.filter((n) => n.id !== id) })),

      askWall: (body, anonymous) =>
        set((s) => ({ wall: [{ id: uid(), body, anonymous, at: iso(), status: "pending-review" }, ...s.wall] })),
      moderateWall: (id, status) => set((s) => ({ wall: s.wall.map((w) => (w.id === id ? { ...w, status } : w)) })),

      postThread: (body, minute) => set((s) => ({ thread: [...s.thread, { id: uid(), body, at: iso(), minute }] })),
      markLive: (minute, note) => set((s) => ({ liveMarks: [...s.liveMarks, { id: uid(), minute, note, at: iso() }] })),

      requestMentor: (topic) => set({ mentorRequest: { topic, at: iso() } }),
      openSanctuary: (journeyId) => {
        if (!get().sanctuaryOpened.includes(journeyId)) set((s) => ({ sanctuaryOpened: [...s.sanctuaryOpened, journeyId] }));
        get().grantBadge("sanctuary-guest");
      },

      setHandle: (platform, handle) => {
        const clean = handle.trim().replace(/^@+/, "");
        if (!clean) return;
        set((s) => ({ handles: { ...s.handles, [platform]: { platform, handle: clean, status: "self-entered", at: iso() } } }));
      },
      unbindHandle: (platform) =>
        set((s) => {
          const next = { ...s.handles };
          delete next[platform];
          return { handles: next };
        }),

      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      updateProfile: (patch) => set((s) => (s.profile ? { profile: { ...s.profile, ...patch } } : {})),

      touchVisit: () => {
        const last = get().lastVisit;
        const now = iso();
        if (last && Date.now() - new Date(last).getTime() < 1000 * 60 * 30) return;
        set({ previousVisit: last, lastVisit: now });
      },
      dismissNotice: (id) => set((s) => ({ notices: s.notices.filter((n) => n.id !== id) })),
      setCreatorPreview: (v) => set({ creatorPreview: v }),

      loadRole: (role) => set(presetFor(role)),
      resetAll: () => set({ ...initialState, settings: { ...defaultSettings } }),
    }),
    {
      name: "itachis-corner-demo-v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

/** True once the persisted store has rehydrated on the client. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const done = () => setHydrated(true);
    if (useDemo.persist.hasHydrated()) done();
    return useDemo.persist.onFinishHydration(done);
  }, []);
  return hydrated;
}

export function exportData(state: DemoState) {
  return JSON.stringify({ exportedAt: iso(), app: "itachis-corner-demo", data: state }, null, 2);
}
