import type { QuranRef } from "@/lib/types";

/**
 * Arabic retrieved 2026-10-17 from api.alquran.cloud, edition `quran-simple`
 * (Tanzil Project simple text; Tanzil terms require verbatim reproduction and
 * attribution). English: Saheeh International via the same API — confirm the
 * translation licence before public launch (see docs/RELEASE_GATES.md).
 */
const SOURCE = "Tanzil Quran Text (simple), via api.alquran.cloud";
const TRANSLATOR = "Saheeh International";
const STATUS = "text-retrieved-pending-editor-review" as const;

export const quranRefs: Record<string, QuranRef> = {
  "112": {
    id: "112",
    surah: 112,
    ayah: "1–4",
    surahName: "Al-Ikhlāṣ",
    ayahStart: 1,
    verses: ["قُلْ هُوَ اللَّهُ أَحَدٌ", "اللَّهُ الصَّمَدُ", "لَمْ يَلِدْ وَلَمْ يُولَدْ", "وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ"],
    translation:
      "Say, “He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.”",
    translator: TRANSLATOR,
    textSource: SOURCE,
    reviewStatus: STATUS,
  },
  "3:190": {
    id: "3:190",
    surah: 3,
    ayah: "190",
    surahName: "Āl ʿImrān",
    ayahStart: 190,
    verses: ["إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ لَآيَاتٍ لِأُولِي الْأَلْبَابِ"],
    translation:
      "Indeed, in the creation of the heavens and the earth and the alternation of the night and the day are signs for those of understanding.",
    translator: TRANSLATOR,
    textSource: SOURCE,
    reviewStatus: STATUS,
  },
  "2:186": {
    id: "2:186",
    surah: 2,
    ayah: "186",
    surahName: "Al-Baqarah",
    ayahStart: 186,
    verses: ["وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ ۖ فَلْيَسْتَجِيبُوا لِي وَلْيُؤْمِنُوا بِي لَعَلَّهُمْ يَرْشُدُونَ"],
    translation:
      "And when My servants ask you, [O Muhammad], concerning Me — indeed I am near. I respond to the invocation of the supplicant when he calls upon Me. So let them respond to Me [by obedience] and believe in Me that they may be [rightly] guided.",
    translator: TRANSLATOR,
    textSource: SOURCE,
    reviewStatus: STATUS,
  },
  "16:125": {
    id: "16:125",
    surah: 16,
    ayah: "125",
    surahName: "An-Naḥl",
    ayahStart: 125,
    verses: ["ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ ۖ وَجَادِلْهُمْ بِالَّتِي هِيَ أَحْسَنُ ۚ إِنَّ رَبَّكَ هُوَ أَعْلَمُ بِمَنْ ضَلَّ عَنْ سَبِيلِهِ ۖ وَهُوَ أَعْلَمُ بِالْمُهْتَدِينَ"],
    translation:
      "Invite to the way of your Lord with wisdom and good instruction, and argue with them in a way that is best. Indeed, your Lord is most knowing of who has strayed from His way, and He is most knowing of who is [rightly] guided.",
    translator: TRANSLATOR,
    textSource: SOURCE,
    reviewStatus: STATUS,
  },
  "2:256": {
    id: "2:256",
    surah: 2,
    ayah: "256",
    surahName: "Al-Baqarah",
    ayahStart: 256,
    verses: ["لَا إِكْرَاهَ فِي الدِّينِ ۖ قَدْ تَبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ ۚ فَمَنْ يَكْفُرْ بِالطَّاغُوتِ وَيُؤْمِنْ بِاللَّهِ فَقَدِ اسْتَمْسَكَ بِالْعُرْوَةِ الْوُثْقَىٰ لَا انْفِصَامَ لَهَا ۗ وَاللَّهُ سَمِيعٌ عَلِيمٌ"],
    translation:
      "There shall be no compulsion in [acceptance of] the religion. The right course has become clear from the wrong. So whoever disbelieves in Taghut and believes in Allah has grasped the most trustworthy handhold with no break in it. And Allah is Hearing and Knowing.",
    translator: TRANSLATOR,
    textSource: SOURCE,
    reviewStatus: STATUS,
  },
  "96:1": {
    id: "96:1",
    surah: 96,
    ayah: "1",
    surahName: "Al-ʿAlaq",
    ayahStart: 1,
    verses: ["اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ"],
    translation: "Recite in the name of your Lord who created —",
    translator: TRANSLATOR,
    textSource: SOURCE,
    reviewStatus: STATUS,
  },
};

export function getRef(id: string): QuranRef | undefined {
  return quranRefs[id];
}
