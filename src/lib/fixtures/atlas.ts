import type { AtlasNode } from "@/lib/types";

/**
 * The Night Atlas. Stars are real destinations in the app; edges are curated
 * learning relationships ("this helps you understand that"), never random.
 * Coordinates live in a 2000 × 1300 world.
 */
export const ATLAS_W = 2000;
export const ATLAS_H = 1300;

export const atlasClusters = [
  { id: "oneness", name: "The Oneness of God", color: "#D7AD65", cx: 960, cy: 620 },
  { id: "asking", name: "Asking Well", color: "#26C4B3", cx: 1480, cy: 360 },
  { id: "signs", name: "Signs in Creation", color: "#A58BE1", cx: 480, cy: 330 },
  { id: "first-steps", name: "First Steps", color: "#F2A7C3", cx: 430, cy: 960 },
  { id: "afterglow", name: "Afterglow Archive", color: "#FA536D", cx: 1500, cy: 930 },
] as const;

export const atlasNodes: AtlasNode[] = [
  { id: "oneness", label: "The Oneness of God", arabic: "التَّوْحِيد", cluster: "oneness", kind: "cluster", x: 960, y: 620, href: "/atlas#oneness", question: "What does it mean to say God is One?", summary: "The central star of the Atlas. Every path here eventually passes through it.", path: "Core path", status: "sample" },
  { id: "ikhlas", label: "Sūrat al-Ikhlāṣ", arabic: "سورة الإخلاص", cluster: "oneness", kind: "passage", x: 1130, y: 520, href: "/library/preview?page=4", question: "What are the four verses many learners memorise first?", summary: "Read the Arabic with tashkīl and an English meaning, with source notes.", path: "Core path", status: "live", referenceId: "112" },
  { id: "why-one", label: "Why One? (Simulator path)", cluster: "oneness", kind: "practice", x: 1040, y: 790, href: "/dojo/path", question: "How do I talk about Oneness with someone who sees all religions as the same?", summary: "A six-step practice path with feedback on clarity and fairness.", path: "Core path", status: "live" },
  { id: "names", label: "Names & Attributes", cluster: "oneness", kind: "track", x: 800, y: 500, href: "/atlas#names", question: "How do Muslims speak about God's names?", summary: "A planned learning track awaiting editorial review.", path: "Core path", status: "planned" },
  { id: "episode-1", label: "Afterglow · Why One?", cluster: "afterglow", kind: "episode", x: 1300, y: 800, href: "/afterglow/episodes/sample-episode-01", question: "What happened in the sample Oneness episode?", summary: "Moments, references, trivia results and journal prompts from a sample recap.", path: "Afterglow", status: "sample" },

  { id: "good-question", label: "The Good Question", cluster: "asking", kind: "cluster", x: 1480, y: 360, href: "/dojo", question: "What makes a question open rather than loaded?", summary: "The heart of the Simulator: curiosity that invites the other person's real view.", path: "Dialogue skills", status: "live" },
  { id: "wisdom", label: "Invite with Wisdom", arabic: "بِالحِكْمَة", cluster: "asking", kind: "passage", x: 1660, y: 250, href: "/dojo#wisdom", question: "What standard does 16:125 set for discussion?", summary: "An-Naḥl 16:125 — “with wisdom and good instruction… in a way that is best.”", path: "Dialogue skills", status: "live", referenceId: "16:125" },
  { id: "assumption", label: "Hidden Assumptions", cluster: "asking", kind: "practice", x: 1300, y: 230, href: "/dojo/path?step=3", question: "How do I find the unstated premise in an argument?", summary: "A drill that trains you to name assumptions gently.", path: "Dialogue skills", status: "live" },
  { id: "listening", label: "Steel-manning", cluster: "asking", kind: "practice", x: 1700, y: 470, href: "/dojo/path?step=2", question: "Can I restate a view so well its holder agrees?", summary: "Practise fair representation before replying.", path: "Dialogue skills", status: "live" },

  { id: "signs", label: "Signs in Creation", arabic: "آيات", cluster: "signs", kind: "cluster", x: 480, y: 330, href: "/atlas#signs", question: "Why does the Qur'an invite reflection on the sky?", summary: "A cluster about wonder, observation and reflection.", path: "Reflection", status: "sample" },
  { id: "night-day", label: "Night & Day", cluster: "signs", kind: "passage", x: 300, y: 210, href: "/discover#discovery", question: "What does 3:190 say about the heavens and the earth?", summary: "Āl ʿImrān 3:190 — signs for those of understanding.", path: "Reflection", status: "live", referenceId: "3:190" },
  { id: "first-word", label: "The First Word: Read", arabic: "اقْرَأْ", cluster: "signs", kind: "passage", x: 640, y: 180, href: "/library", question: "Why is learning so central from the very first revelation?", summary: "Al-ʿAlaq 96:1 — “Recite in the name of your Lord who created.”", path: "Reflection", status: "live", referenceId: "96:1" },
  { id: "chapter-sky", label: "Book · The Night Sky chapter", cluster: "signs", kind: "chapter", x: 690, y: 430, href: "/library/preview?page=6", question: "What will the planned book say about wonder?", summary: "A sample spread from the planned illustrated book concept.", path: "Library", status: "planned" },

  { id: "first-steps", label: "First Steps", cluster: "first-steps", kind: "cluster", x: 430, y: 960, href: "/reverts", question: "Where do I begin if I'm new?", summary: "The gentle gateway to Reverts HQ.", path: "Reverts HQ", status: "live" },
  { id: "salah", label: "Learning Prayer, Slowly", cluster: "first-steps", kind: "track", x: 250, y: 1080, href: "/reverts#journeys", question: "How do I start learning to pray without overwhelm?", summary: "A calm, step-by-step journey; no streak pressure.", path: "Reverts HQ", status: "sample" },
  { id: "no-silly", label: "No Silly Questions", cluster: "first-steps", kind: "question", x: 610, y: 1090, href: "/reverts/ask/q-quran-language", question: "Can I ask anything, privately?", summary: "A moderated wall with opt-in privacy.", path: "Reverts HQ", status: "sample" },
  { id: "near", label: "“I am near”", arabic: "فَإِنِّي قَرِيبٌ", cluster: "first-steps", kind: "passage", x: 620, y: 840, href: "/reverts#near", question: "Is God close to the one who asks?", summary: "Al-Baqarah 2:186 — a verse often shared with new Muslims.", path: "Reverts HQ", status: "live", referenceId: "2:186" },

  { id: "afterglow", label: "Afterglow Archive", cluster: "afterglow", kind: "cluster", x: 1500, y: 930, href: "/afterglow/vault", question: "Where do lives go after they end?", summary: "Every live becomes a lasting map of moments and questions.", path: "Afterglow", status: "live" },
  { id: "episode-2", label: "Afterglow · The Good Question", cluster: "afterglow", kind: "episode", x: 1700, y: 1060, href: "/afterglow/episodes/sample-episode-02", question: "What did the sample curiosity episode cover?", summary: "A sample recap on open vs. loaded questions.", path: "Afterglow", status: "sample" },
  { id: "no-compulsion", label: "No Compulsion", arabic: "لا إكراه", cluster: "afterglow", kind: "passage", x: 1220, y: 1060, href: "/afterglow/episodes/sample-episode-01#m4", question: "Why should invitation never pressure?", summary: "Al-Baqarah 2:256 — no compulsion in religion.", path: "Afterglow", status: "live", referenceId: "2:256" },
];

/** Curated relationships: [from, to]. */
export const atlasEdges: [string, string][] = [
  ["oneness", "ikhlas"], ["oneness", "why-one"], ["oneness", "names"], ["oneness", "episode-1"],
  ["ikhlas", "episode-1"], ["why-one", "assumption"], ["why-one", "listening"],
  ["good-question", "wisdom"], ["good-question", "assumption"], ["good-question", "listening"], ["good-question", "episode-2"],
  ["signs", "night-day"], ["signs", "first-word"], ["signs", "chapter-sky"], ["chapter-sky", "oneness"],
  ["first-steps", "salah"], ["first-steps", "no-silly"], ["first-steps", "near"], ["near", "oneness"],
  ["afterglow", "episode-1"], ["afterglow", "episode-2"], ["afterglow", "no-compulsion"], ["no-compulsion", "why-one"],
  ["wisdom", "episode-2"],
];

export const getNode = (id: string) => atlasNodes.find((n) => n.id === id);
