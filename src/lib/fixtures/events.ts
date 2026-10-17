import type { LiveEvent } from "@/lib/types";

/**
 * Demo live events. Every one of these is fictional and labelled as such in
 * the UI. Titles are teaching themes, not real broadcasts or debates.
 */
const demo = (eventId: string, status: "sample" | "simulated") => ({
  source: "Demo" as const,
  verificationStatus: status,
  capturedAt: "2026-10-17T00:00:00.000Z",
  eventId,
  note: "Fictional fixture for the concept demo.",
});

export const events: LiveEvent[] = [
  {
    id: "sample-next-live",
    title: "Open Questions Night",
    kicker: "Sample upcoming live",
    platforms: ["tiktok", "youtube"],
    status: "scheduled",
    schedule: { daysFromNow: 2, hour: 20, minute: 0 },
    durationMin: 90,
    scheduleVerification: "sample",
    description:
      "A sample listing showing how an upcoming live would be announced here: what to bring, a warm-up challenge, and the official places to watch.",
    topics: ["Asking well", "Oneness of God"],
    provenance: demo("sample-next-live", "sample"),
    palette: ["#FA536D", "#F7C65B"],
  },
  {
    id: "demo-live-now",
    title: "Signs in the Night Sky",
    kicker: "Demo scenario · simulated live",
    platforms: ["tiktok", "youtube"],
    status: "live",
    schedule: { daysFromNow: 0, hour: 0, minute: 0 },
    durationMin: 75,
    scheduleVerification: "sample",
    description:
      "A simulated live used to demonstrate the companion dock: a first-30-minute trivia challenge, a question queue, bookmarks and a follow-along timeline. No video is hosted or rebroadcast here.",
    topics: ["Signs in creation", "Reflection"],
    provenance: demo("demo-live-now", "simulated"),
    triviaSetId: "trivia-signs",
    palette: ["#26C4B3", "#A58BE1"],
  },
  {
    id: "sample-episode-01",
    title: "Why One? Questions on Oneness",
    kicker: "Sample Afterglow · Episode I",
    platforms: ["youtube"],
    status: "completed",
    schedule: { daysFromNow: -5, hour: 20, minute: 0 },
    durationMin: 95,
    scheduleVerification: "sample",
    description:
      "A sample recap showing how an Afterglow page turns a fast-moving live into a lasting map: moments, references, trivia results and journal prompts.",
    topics: ["Oneness of God", "Asking well"],
    provenance: demo("sample-episode-01", "sample"),
    triviaSetId: "trivia-signs",
    palette: ["#D7AD65", "#A58BE1"],
    recap: {
      summary:
        "Illustrative recap: a night of questions about what it means to say God is One — and why the way we ask matters as much as the answer.",
      replay: { platform: "youtube", status: "sample" },
      moments: [
        {
          id: "m1",
          label: "The opening question",
          timestampStatus: "sample",
          kind: "question",
          body: "“If you had to explain ‘One’ to a curious friend in a single sentence, where would you begin?” — a sample prompt written for this demo.",
        },
        {
          id: "m2",
          label: "Reading Sūrat al-Ikhlāṣ together",
          timestampStatus: "sample",
          kind: "reference",
          body: "Four short verses that many learners memorise first. The recap links the full Arabic text and an English meaning.",
          referenceId: "112",
        },
        {
          id: "m3",
          label: "Listening before replying",
          timestampStatus: "sample",
          kind: "reflection",
          body: "A reflection on restating someone's view fairly before responding — the habit practised in the Simulator.",
          referenceId: "16:125",
        },
        {
          id: "m4",
          label: "No compulsion",
          timestampStatus: "sample",
          kind: "reference",
          body: "Why sincere conversation invites rather than pressures.",
          referenceId: "2:256",
        },
        {
          id: "m5",
          label: "The question everyone saved",
          timestampStatus: "sample",
          kind: "highlight",
          body: "“What would change in your day if you truly believed you were heard?” — sample highlight.",
          referenceId: "2:186",
        },
      ],
      journalPrompts: [
        "Which question from tonight stayed with you, and why?",
        "Restate a view you disagree with so fairly that its holder would nod.",
        "What is one thing you want to read more about this week?",
      ],
      unlocked: ["dojo-path-oneness", "atlas-oneness"],
      atlasNodes: ["oneness", "ikhlas", "good-question"],
    },
  },
  {
    id: "sample-episode-02",
    title: "The Art of the Good Question",
    kicker: "Sample Afterglow · Episode II",
    platforms: ["tiktok"],
    status: "completed",
    schedule: { daysFromNow: -12, hour: 21, minute: 0 },
    durationMin: 80,
    scheduleVerification: "sample",
    description:
      "A sample recap about curiosity: open versus loaded questions, and how to keep a conversation generous.",
    topics: ["Asking well", "Dialogue skills"],
    provenance: demo("sample-episode-02", "sample"),
    palette: ["#FA536D", "#26C4B3"],
    recap: {
      summary:
        "Illustrative recap: how a good question opens a door instead of setting a trap — practised through short role-play prompts.",
      replay: { platform: "tiktok", status: "unavailable" },
      moments: [
        {
          id: "n1",
          label: "Open vs. loaded",
          timestampStatus: "sample",
          kind: "highlight",
          body: "A loaded question assumes the answer. An open one invites the other person to show you their actual view.",
        },
        {
          id: "n2",
          label: "Invite with wisdom",
          timestampStatus: "sample",
          kind: "reference",
          body: "The recap pairs the evening with An-Naḥl 16:125.",
          referenceId: "16:125",
        },
        {
          id: "n3",
          label: "When to pause",
          timestampStatus: "sample",
          kind: "reflection",
          body: "Sometimes the most respectful move is “I'd like to think about that and come back to you.”",
        },
      ],
      journalPrompts: [
        "Write one loaded question you have heard, then rewrite it as an open one.",
        "When did someone's question make you feel truly listened to?",
      ],
      unlocked: ["dojo-assumption"],
      atlasNodes: ["good-question", "assumption"],
    },
  },
];

export const getEvent = (id: string) => events.find((e) => e.id === id);
export const nextEvent = () => events.find((e) => e.status === "scheduled");
export const liveEvent = () => events.find((e) => e.status === "live");
export const completedEvents = () => events.filter((e) => e.status === "completed");

/** Resolve a relative fixture schedule into a concrete Date (client-side). */
export function resolveStart(e: LiveEvent, now: Date = new Date()): Date {
  const d = new Date(now);
  if (e.status === "live") {
    // The simulated live "started" 12 minutes ago.
    return new Date(now.getTime() - 12 * 60_000);
  }
  d.setDate(d.getDate() + e.schedule.daysFromNow);
  d.setHours(e.schedule.hour, e.schedule.minute, 0, 0);
  return d;
}
