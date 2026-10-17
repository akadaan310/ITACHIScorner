/**
 * Editorial fixtures for the Library, the Reverts Sanctuary and the
 * Dialogues catalogue. All sample text is original placeholder writing for
 * the concept; none of it is derived from, or attributed to, Itachi.
 */

export interface BookPage {
  id: number;
  kind: "cover" | "title" | "contents" | "foreword" | "chapter" | "spread" | "passage" | "colophon";
  title: string;
  body?: string;
  arabic?: string;
  refId?: string;
  items?: { label: string; status: "planned" | "sample" }[];
}

export const book = {
  title: "The Itachi Method",
  subtitle: "An illustrated field guide to curious, kind conversation",
  status: "Planned concept — not written, not approved",
  pagesPlanned: "300–400 pages (planned)",
  note:
    "The real book can only be written from properly sourced original works, with the creator's editorial approval. Everything below is sample design with placeholder text.",
  pages: [
    { id: 1, kind: "cover", title: "The Itachi Method", body: "An illustrated field guide to curious, kind conversation" },
    { id: 2, kind: "title", title: "A note before the first page", body: "This preview shows layout, typography and illustration only. Its words are placeholders written for the concept — not Itachi's words, and not findings about her approach." },
    {
      id: 3,
      kind: "contents",
      title: "Contents (planned)",
      items: [
        { label: "I · The Night Before a Question", status: "sample" },
        { label: "II · Listening as a Form of Respect", status: "planned" },
        { label: "III · The Oneness at the Centre", status: "sample" },
        { label: "IV · Open Doors, Not Traps", status: "planned" },
        { label: "V · When to Pause", status: "planned" },
        { label: "VI · The Night Sky Chapter", status: "sample" },
        { label: "VII · After the Live", status: "planned" },
      ],
    },
    { id: 4, kind: "passage", title: "III · The Oneness at the Centre", refId: "112", body: "Placeholder caption: a full-page setting of Sūrat al-Ikhlāṣ, with generous margins and no ornament over the text itself." },
    { id: 5, kind: "chapter", title: "I · The Night Before a Question", body: "Placeholder text. Every conversation begins before anyone speaks — in what we expect, what we fear, and what we hope the other person will understand. This chapter (planned) will be written from sourced material only." },
    { id: 6, kind: "spread", title: "VI · The Night Sky Chapter", refId: "3:190", body: "Placeholder text for an illustrated spread pairing an observatory-style star chart with Āl ʿImrān 3:190. Final copy requires editorial review." },
    { id: 7, kind: "foreword", title: "Foreword", body: "Reserved. A foreword would only ever appear with the creator's explicit approval. This page intentionally remains blank in the concept." },
    { id: 8, kind: "colophon", title: "Colophon", body: "Concept typography: Fraunces, Inter and Amiri (SIL Open Font License). Qur'an text: Tanzil (simple). Printed collectible edition: a future possibility, not a pre-order." },
  ] satisfies BookPage[],
};

export const sanctuaryJourneys = [
  { id: "j-week", title: "Your first week", steps: 5, minutes: 12, blurb: "What matters most now, and what can wait. Rest, breathe, begin.", tone: "#B9A3EE" },
  { id: "j-salah", title: "Learning prayer, slowly", steps: 7, minutes: 20, blurb: "One movement at a time, with audio-free illustrated steps. No streaks, no pressure.", tone: "#E7C27D" },
  { id: "j-fatiha", title: "Meeting Al-Fātiḥah", steps: 4, minutes: 10, blurb: "Hear its meaning before memorising its words.", tone: "#F2A7C3" },
  { id: "j-belonging", title: "Finding community", steps: 4, minutes: 8, blurb: "How to find a welcoming local community at your own pace.", tone: "#9ED9CF" },
] as const;

export const sanctuaryQuestions = [
  {
    id: "q-quran-language",
    q: "Do I need to learn Arabic before I can read the Qur'an?",
    a: "No — you can begin with a translation of the meanings today. Many people learn to recite short chapters in Arabic gradually, alongside understanding. A trusted local teacher can help you pace this kindly.",
    asked: "Sample question",
  },
  {
    id: "q-family",
    q: "I haven't told my family yet. Is that okay?",
    a: "Your journey is yours, and this space never asks you to display it. Many people take time and seek advice from a trusted teacher or counsellor about when and how to share.",
    asked: "Sample question",
  },
  {
    id: "q-mistakes",
    q: "What if I make mistakes in prayer while I'm learning?",
    a: "Learning involves mistakes. Start with what you can, keep learning, and ask a qualified teacher for guidance on specifics. This app offers learning routes, not religious rulings.",
    asked: "Sample question",
  },
  {
    id: "q-silly",
    q: "Is it silly to ask very basic questions?",
    a: "Never. Every scholar started with basic questions. That's why this wall exists — and why you can ask privately.",
    asked: "Sample question",
  },
] as const;

export interface DialogueEntry {
  id: string;
  title: string;
  format: "Live Q&A" | "Short" | "Conversation" | "Lesson";
  topics: string[];
  platform: "youtube" | "tiktok";
  minutes: number;
  status: "sample";
  summary: string;
}

/** Illustrative catalogue rows — not real videos. Real entries require verified URLs. */
export const dialogueCatalog: DialogueEntry[] = [
  { id: "d1", title: "Sample entry · Questions on Oneness", format: "Live Q&A", topics: ["Oneness of God"], platform: "youtube", minutes: 95, status: "sample", summary: "Illustrative row showing how a sourced dialogue would be catalogued with topics and references." },
  { id: "d2", title: "Sample entry · Open vs. loaded questions", format: "Lesson", topics: ["Asking well"], platform: "tiktok", minutes: 3, status: "sample", summary: "Illustrative short-form lesson card with a linked Simulator drill." },
  { id: "d3", title: "Sample entry · Signs in the sky", format: "Short", topics: ["Signs in creation"], platform: "tiktok", minutes: 1, status: "sample", summary: "Illustrative clip card linking to Āl ʿImrān 3:190 in the Atlas." },
  { id: "d4", title: "Sample entry · A conversation on compulsion", format: "Conversation", topics: ["Ethics of invitation"], platform: "youtube", minutes: 48, status: "sample", summary: "Illustrative long-form card: why sincere invitation never pressures (2:256)." },
  { id: "d5", title: "Sample entry · First questions from new Muslims", format: "Live Q&A", topics: ["First steps"], platform: "youtube", minutes: 70, status: "sample", summary: "Illustrative card that would link into Reverts HQ." },
  { id: "d6", title: "Sample entry · Listening before replying", format: "Lesson", topics: ["Asking well", "Dialogue skills"], platform: "tiktok", minutes: 2, status: "sample", summary: "Illustrative lesson card paired with the steel-manning drill." },
];

export const faqs = [
  { q: "Is this Itachi's official website?", a: "No. Itachi's Corner is an independent concept built as a creative gift. It is unaffiliated and has not been endorsed or approved by her. Her official places are linked from her public hub." },
  { q: "Are the lives streamed here?", a: "Never. Lives happen on her official TikTok and YouTube. This app is a companion for before, during and after — it always sends you back to the official platforms to watch." },
  { q: "Does typing my TikTok or YouTube name track my attendance?", a: "No. A typed handle is labelled “self-entered” and proves nothing about ownership. We never track viewers, comments or attendance from a username." },
  { q: "Is learning free?", a: "Yes, always. Free Explorer is permanent. Supporter and Patron tiers are concept previews only; there is no billing in this demo, and no learning is locked behind payment." },
  { q: "What do levels mean?", a: "Levels reflect participation in the app's learning activities — challenges, notes, paths. They never measure faith, piety, knowledge of religion or authority." },
  { q: "Where are the Qur'an texts from?", a: "Arabic is from the Tanzil simple text; English meanings are Saheeh International. Each passage is marked as pending human editorial review before launch." },
  { q: "Is my data stored anywhere?", a: "In this demo, everything stays in your own browser (localStorage). You can export or delete it from Settings at any time." },
] as const;
