import type { TriviaSet } from "@/lib/types";

/**
 * A non-attributed teaching exercise. Not quoted from, or attributed to,
 * any real live. Answers rely only on the referenced Qur'anic passages.
 */
export const triviaSets: Record<string, TriviaSet> = {
  "trivia-signs": {
    id: "trivia-signs",
    eventId: "demo-live-now",
    title: "First-30 Challenge · Signs & Questions",
    windowMinutes: 30,
    provenance: {
      source: "Demo",
      verificationStatus: "sample",
      capturedAt: "2026-10-17T00:00:00.000Z",
      eventId: "demo-live-now",
      note: "Teaching exercise written for the demo.",
    },
    questions: [
      {
        id: "q1",
        prompt: "Sūrat al-Ikhlāṣ is one of the shortest chapters. Where does it sit in the Qur'an?",
        options: [
          { id: "a", label: "Near the very beginning" },
          { id: "b", label: "Exactly in the middle" },
          { id: "c", label: "Near the end — it is chapter 112 of 114" },
          { id: "d", label: "It is not a separate chapter" },
        ],
        correctId: "c",
        explanation: "Al-Ikhlāṣ is the 112th of the Qur'an's 114 chapters, four verses long.",
        timeLimitSec: 20,
        referenceId: "112",
      },
      {
        id: "q2",
        prompt: "In Al-Ikhlāṣ, which word does the Saheeh International translation render as “the Eternal Refuge”?",
        options: [
          { id: "a", label: "al-Aḥad (الأحد)" },
          { id: "b", label: "aṣ-Ṣamad (الصمد)" },
          { id: "c", label: "ar-Raḥmān (الرحمن)" },
          { id: "d", label: "al-Qadīr (القدير)" },
        ],
        correctId: "b",
        explanation: "Verse 2 reads “اللَّهُ الصَّمَدُ” — “Allah, the Eternal Refuge.”",
        timeLimitSec: 20,
        referenceId: "112",
      },
      {
        id: "q3",
        prompt: "Which verse speaks of the alternation of night and day as signs for people of understanding?",
        options: [
          { id: "a", label: "Āl ʿImrān 3:190" },
          { id: "b", label: "Al-Baqarah 2:256" },
          { id: "c", label: "Al-ʿAlaq 96:1" },
          { id: "d", label: "An-Naḥl 16:125" },
        ],
        correctId: "a",
        explanation: "3:190: “Indeed, in the creation of the heavens and the earth and the alternation of the night and the day are signs for those of understanding.”",
        timeLimitSec: 20,
        referenceId: "3:190",
      },
      {
        id: "q4",
        prompt: "“لَا إِكْرَاهَ فِي الدِّينِ” (2:256) is translated as…",
        options: [
          { id: "a", label: "“Read in the name of your Lord”" },
          { id: "b", label: "“There shall be no compulsion in [acceptance of] the religion”" },
          { id: "c", label: "“Indeed, I am near”" },
          { id: "d", label: "“Say, He is Allah, One”" },
        ],
        correctId: "b",
        explanation: "The opening of 2:256 — a principle that shapes how invitation should feel: never coerced.",
        timeLimitSec: 20,
        referenceId: "2:256",
      },
      {
        id: "q5",
        prompt: "An-Naḥl 16:125 describes inviting “with wisdom and good instruction” and discussing…",
        options: [
          { id: "a", label: "as quickly as possible" },
          { id: "b", label: "only with those who already agree" },
          { id: "c", label: "“in a way that is best”" },
          { id: "d", label: "until the other side gives up" },
        ],
        correctId: "c",
        explanation: "“…and argue with them in a way that is best.” The Simulator is built around that standard.",
        timeLimitSec: 20,
        referenceId: "16:125",
      },
      {
        id: "q6",
        prompt: "Dialogue skill: which of these is an open, good-faith question?",
        options: [
          { id: "a", label: "“Don't you think that's obviously wrong?”" },
          { id: "b", label: "“What led you to see it that way?”" },
          { id: "c", label: "“Why won't you just admit it?”" },
          { id: "d", label: "“Isn't it embarrassing to believe that?”" },
        ],
        correctId: "b",
        explanation: "Open questions invite the other person's real reasons. The others assume the answer or aim to shame.",
        timeLimitSec: 20,
      },
    ],
  },
};

export const getTriviaSet = (id: string) => triviaSets[id];
