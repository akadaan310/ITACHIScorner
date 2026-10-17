/**
 * Dialogue Dojo content. The dialogue below is an illustrative practice
 * script written for this demo. It is not a real conversation, does not
 * quote Itachi, and does not represent any real person's views.
 */

export interface Feedback {
  clarity: number; // 0–3
  fairness: number;
  evidence: number;
  listening: number;
}

export interface ChoiceOption {
  id: string;
  label: string;
  feedback: Feedback;
  note: string;
  best?: boolean;
}

export type DojoStep =
  | { id: string; type: "setup"; title: string; lines: { who: "Sami" | "Noor"; text: string }[]; note: string }
  | { id: string; type: "next-question"; title: string; prompt: string; context: string; options: ChoiceOption[]; askReason: boolean }
  | { id: string; type: "assumption"; title: string; prompt: string; statement: { id: string; text: string; hidden?: boolean }[]; explanation: string }
  | { id: string; type: "match"; title: string; prompt: string; claims: { id: string; text: string; evidenceId: string }[]; evidence: { id: string; text: string; refId?: string }[]; explanation: string }
  | { id: string; type: "reflect"; title: string; prompt: string; suggestion: string };

export const dojoPath: { id: string; title: string; subtitle: string; steps: DojoStep[] } = {
  id: "dojo-path-oneness",
  title: "Why One? A Path of Reasoning",
  subtitle: "Six steps · about 7 minutes · illustrative practice dialogue",
  steps: [
    {
      id: "s1",
      type: "setup",
      title: "The setup",
      note: "Practice script written for the Simulator — fictional characters, not a real exchange.",
      lines: [
        { who: "Sami", text: "I grew up thinking all religions say basically the same thing. So why does ‘God is One’ matter so much to you?" },
        { who: "Noor", text: "That's a fair question. Can I first check I understand what you mean by ‘the same thing’?" },
        { who: "Sami", text: "Sure — like, be kind, there's something bigger than us. The details seem secondary." },
      ],
    },
    {
      id: "s2",
      type: "next-question",
      title: "Choose the next question",
      context: "Sami has shared a sincere view. Noor wants to understand before replying.",
      prompt: "Which question should Noor ask next?",
      askReason: true,
      options: [
        {
          id: "a",
          label: "“So you think the details don't matter at all? That's a bit lazy, no?”",
          feedback: { clarity: 1, fairness: 0, evidence: 0, listening: 0 },
          note: "Restates Sami's view in an exaggerated form and adds a jab. It closes the door it was meant to open.",
        },
        {
          id: "b",
          label: "“When you say the details are secondary, which details come to mind first?”",
          feedback: { clarity: 3, fairness: 3, evidence: 1, listening: 3 },
          note: "Uses Sami's own words and invites specifics. Now the conversation can be about something concrete.",
          best: true,
        },
        {
          id: "c",
          label: "“Let me explain why Islam is different.”",
          feedback: { clarity: 2, fairness: 1, evidence: 1, listening: 0 },
          note: "Not wrong, just early. Explaining before understanding often answers a question nobody asked.",
        },
      ],
    },
    {
      id: "s3",
      type: "assumption",
      title: "Spot the hidden assumption",
      prompt: "Sami's view rests on one unstated assumption. Tap the sentence that carries it.",
      statement: [
        { id: "x1", text: "All religions encourage kindness." },
        { id: "x2", text: "Kindness is the only part of a religion that really matters.", hidden: true },
        { id: "x3", text: "So the differences between religions are secondary." },
      ],
      explanation:
        "The conclusion only follows if kindness is the whole point. Naming that assumption — gently — lets both people examine it together instead of talking past each other.",
    },
    {
      id: "s4",
      type: "match",
      title: "Match evidence to claim",
      prompt: "Noor wants to support each point with a relevant passage. Match each claim to the passage that speaks to it.",
      claims: [
        { id: "c1", text: "In Islam, God's Oneness is central, not a side detail.", evidenceId: "e1" },
        { id: "c2", text: "Reflecting on the universe is encouraged as a path to understanding.", evidenceId: "e2" },
        { id: "c3", text: "Belief should never be forced on anyone.", evidenceId: "e3" },
      ],
      evidence: [
        { id: "e2", text: "Āl ʿImrān 3:190 — the heavens, the earth, night and day as signs.", refId: "3:190" },
        { id: "e3", text: "Al-Baqarah 2:256 — no compulsion in religion.", refId: "2:256" },
        { id: "e1", text: "Al-Ikhlāṣ 112 — “Say, He is Allah, One.”", refId: "112" },
      ],
      explanation:
        "Good evidence is relevant evidence. A passage can be true and still not answer the question on the table.",
    },
    {
      id: "s5",
      type: "next-question",
      title: "Reply with care",
      context: "Sami: “Okay, but if God is One, why would it matter to Him what I call Him?”",
      prompt: "Which reply keeps the conversation honest and generous?",
      askReason: true,
      options: [
        {
          id: "a",
          label: "“Great question. Before I answer — do you mean names, or what we believe God is like?”",
          feedback: { clarity: 3, fairness: 3, evidence: 1, listening: 3 },
          note: "Clarifies a genuinely ambiguous question so the answer lands where Sami is actually asking.",
          best: true,
        },
        {
          id: "b",
          label: "“It just does. That's what the Qur'an says.”",
          feedback: { clarity: 1, fairness: 1, evidence: 1, listening: 0 },
          note: "Appeals to a source Sami doesn't yet share, without explaining it. True for Noor, unpersuasive for Sami.",
        },
        {
          id: "c",
          label: "“You clearly haven't thought about this much.”",
          feedback: { clarity: 0, fairness: 0, evidence: 0, listening: 0 },
          note: "Personal and dismissive. The Simulator never rewards scoring points off a person.",
        },
      ],
    },
    {
      id: "s6",
      type: "reflect",
      title: "Checkpoint · your reflection",
      prompt: "In one or two sentences: what did Sami actually care about, underneath the question?",
      suggestion: "Perhaps Sami cares that faith makes people kinder — a value Noor shares. Starting there is common ground, not concession.",
    },
  ],
};

export const dojoFeedbackLabels: Record<keyof Feedback, string> = {
  clarity: "Clarity",
  fairness: "Fair representation",
  evidence: "Evidence",
  listening: "Careful listening",
};

/** Standalone sample exercises (one per type) for the Dojo gallery. */
export const dojoDrills = [
  { id: "drill-next", type: "Choose the next question", world: "teal", minutes: 2, href: "/dojo/path?step=2" },
  { id: "drill-assume", type: "Spot the hidden assumption", world: "ruby", minutes: 2, href: "/dojo/path?step=3" },
  { id: "drill-match", type: "Match evidence to claim", world: "gold", minutes: 3, href: "/dojo/path?step=4" },
] as const;
