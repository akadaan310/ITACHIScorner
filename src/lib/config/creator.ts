/**
 * Single configurable source for creator identity and external links.
 *
 * Links were checked against the public hub https://linktr.ee/dawahxdialogues
 * on 2026-10-17. Re-validate before launch. Payment and affiliate links on
 * that hub are intentionally NOT mirrored here.
 */
export const creator = {
  publicName: "Itachi",
  showName: "Da'wah x Dialogues",
  /** Flip only after written approval from the creator. */
  endorsed: false,
  /**
   * Masked portrait supplied by the project owner from the v1 "Pocket Warrior"
   * design exploration (cropped, no UI overlays). Replace with a high-resolution
   * original and obtain the creator's written approval before any public launch.
   */
  portrait: {
    src: "/brand/itachi-masked-portrait.jpg",
    alt: "Masked portrait from an owner-supplied design exploration; creator approval pending",
    suppliedBy: "project owner (v1 design exploration)",
    creatorApproved: false,
  },
  disclosure: "Independent concept — unaffiliated and not yet endorsed.",
  disclosureLong:
    "Itachi's Corner is an independent fan-made concept built as a creative gift. It is not Itachi's official website, has not been approved by her, and does not speak for her.",
  linksCheckedAt: "2026-10-17",
  links: {
    hub: "https://linktr.ee/dawahxdialogues",
    tiktok: "https://www.tiktok.com/@dawahxdialogues",
    tiktokLive: "https://www.tiktok.com/@dawahxdialogues/live",
    tiktokBackup: "https://www.tiktok.com/@dawahxdialogueslive",
    youtube: "https://www.youtube.com/@dawahxdialogues",
    youtubeLive: "https://www.youtube.com/@dawahxdialogues/streams",
    instagram: "https://www.instagram.com/dawahxdialogues",
    x: "https://x.com/dawahxdialogues",
    patreon: "https://www.patreon.com/dawahxdialogues",
  },
  /** Future connector only — there is no claim she streams on Twitch. */
  futureConnectors: { twitch: { enabled: false, url: null as string | null } },
} as const;

/** Brand vocabulary carried over from the v1 site. */
export const brand = {
  name: "Itachi's Corner",
  tagline: "Where Truth Meets Dialogue",
  pillars: "Faith // Knowledge // Reason",
  poetic: "Every question opens a new sky.",
  arsenal: "Your Dawah Arsenal",
  search: "Search the Arsenal",
  simulator: "Dawah Simulator",
  reverts: "Reverts HQ",
  stories: "Shahadah Stories",
  ranks: "Choose Your Rank",
  join: "Join the Ranks",
  app: "Pocket Warrior",
} as const;

export type CreatorConfig = typeof creator;
