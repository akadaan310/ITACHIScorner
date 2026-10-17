# Itachi's Corner — Where Truth Meets Dialogue

> **Independent concept — unaffiliated and not yet endorsed.** This is an unsolicited creative concept for the public creator known as Itachi / Da'wah x Dialogues. It is not her official website, has not been approved by her and does not speak for her.

A fully navigable, responsive product demo that blends the **v1 "Pocket Warrior" arsenal identity** (black/coral, condensed caps, hex badges, `//` HUD labels, persistent red live bar, bottom tab bar) with the **Celestial Majlis** concept (Cairo by night, eight-point stars, constellations as navigation, exquisite Arabic). The masked portrait is the main hero image.

Lives stay on Itachi's official **TikTok** and **YouTube**. This app is the before / alongside / after companion: the **Afterglow**.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

No credentials, API keys or services are needed. All member data lives in the browser (`localStorage`, key `itachis-corner-demo-v1`) and can be exported or erased from **/me/settings**.

| Script | What it does |
| --- | --- |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript flat config) |
| `npm run typecheck` | `tsc --noEmit`, strict mode with `noUncheckedIndexedAccess` |
| `npm test` | Vitest unit tests (progression, scoring, streaks, content integrity, adapters) |
| `npm run build` | Production build (all 43 routes prerender statically) |
| `npm run test:e2e` | Playwright: navigation, flows, privacy, Atlas, axe accessibility, no-JS, reduced motion, mobile |
| `npm run screenshots` | Regenerates `docs/screenshots/*` at 360 / 390 / 768 / 1280 / 1440 |

Playwright starts `next start` on port 3200, so run `npm run build` first. In the Claude Code cloud container it uses the pre-installed Chromium automatically. Elsewhere, run `npx playwright install chromium` once.

## Stack

Next.js 16 App Router · React 19 · TypeScript strict · Tailwind CSS 4 · Zustand (persisted) · self-hosted OFL fonts via Fontsource (Bebas Neue, Fraunces, Inter, JetBrains Mono, Amiri) · all artwork is original SVG/CSS generated in code (`src/components/art.tsx`). No WebGL is used; motion is CSS, including scroll-driven parallax, and it respects `prefers-reduced-motion` plus an in-app "Reduce motion" setting.

## Feature map

| World (v1 name) | Route(s) | What works |
| --- | --- | --- |
| Home | `/` | Portrait hero in a celestial orbit with five star links to real destinations, red ticker, Your Dawah Arsenal, Live Tonight countdown, three-act Afterglow explainer, recent battles (sample), 30-second challenge, Welcome Home, Dawah Simulator, Choose Your Rank, Shahadah Stories |
| Explore | `/discover` | All eight worlds, today's discovery (3:190), star paths |
| **Afterglow** (signature) | `/afterglow`, `/afterglow/before`, `/afterglow/live`, `/afterglow/episodes/[id]`, `/afterglow/vault`, `/afterglow/gallery` | Before: sample schedule, demo countdown, reminder, "I'll be there", poll, anticipation constellation. During: companion dock with demo clock, simulated timeline, in-app check-in, self-report, **timed First-30 trivia** (one answer per question, 20 s each, late answers void, window closes at minute 30, practice mode, reset), question queue, discussion, bookmarks, opt-in board. After: episode constellation, saveable moments, Qur'an references, recap card (download/share), journal prompts, unlocked challenges, participation comparison, vault calendar, state gallery |
| Live Tonight | `/events` | Official destinations (TikTok, backup TikTok, YouTube), schedule |
| Search the Arsenal | `/watch` | Client-side search and filters over a clearly labelled **sample** catalogue |
| Dawah Simulator | `/dojo`, `/dojo/path`, `/dojo/result` | "Train." hub, three drill types, fictional personas, a **six-step path** (setup, choose the next question, spot the hidden assumption, match evidence to claim, reply with care, reflection checkpoint) scored on clarity, fair representation, evidence and careful listening; credits and journal note persist; learning result view |
| Night Atlas | `/atlas` | SVG star map with drag, wheel and pinch zoom, keyboard controls (arrows, +/−, 0), focusable stars, station card with "Enter this star", minimap, reset, deep links (`?star=`), swipeable mobile cards, full list fallback |
| Reverts HQ | `/reverts`, `/reverts/ask/[id]` | Lavender/ivory light world: gentle journeys, 2:186, resources (planned), No Silly Questions wall (anonymous by default, pending review), mentor request (demo only), private notes, sample Q&A |
| Shahadah Stories | `/stories` | Consent-only principles. Intentionally empty, never counted |
| Library | `/library`, `/library/preview` | Parchment book room, 3D book mockup, *The Itachi Method* as a **planned concept**, an eight-page interactive preview with page turns, keyboard, chapter nav and bookmarks |
| Choose Your Rank | `/membership`, `/join`, `/onboarding` | Scout (free forever) · Supporter · Champion (concept previews, **no prices, no billing**), level ladder, membership constellation, link to her existing official Patreon. Onboarding: nickname → intention → languages → constellation → **Explorer's Star Card** |
| My Profile | `/me`, `/me/constellation`, `/me/quests`, `/me/afterglow`, `/me/journal`, `/me/settings` | Star card, rank and credits, truthful streak trio, badges, return-visit ritual, notices, personal constellation, credits ledger, quests, attendance history with evidence, saved moments, journal, settings (visibility, opt-in board, mute rankings/achievements, reduce motion, **self-entered handles with unbind**, consent, adapters, export/delete, demo-state switcher) |
| Studio (internal) | `/studio`, `/studio/creator` | Living design system; demo-gated creator console (event builder, trivia composer, Afterglow approval + provenance, moderation queue, integrations) |
| Trust | `/about`, `/faq`, `/privacy`, `/terms` | Disclosure, FAQ, plain-language privacy, concept terms |

## What is demo, connected, or aspirational

- **Connected (real):** links to official public channels, checked against <https://linktr.ee/dawahxdialogues> on 2026-10-17 (payment and affiliate links deliberately not mirrored); Qur'an Arabic from the Tanzil simple text and Saheeh International translations, retrieved via api.alquran.cloud and marked *pending editor review*.
- **Demo (labelled in the UI):** every event, episode, trivia set, moment, catalogue row, practice dialogue, persona, leaderboard name, poll and number. The "live" is a simulation with a demo clock.
- **Not built / aspirational:** accounts and OAuth, billing, YouTube live-chat or TikTok integrations, platform-verified attendance, real mentorship, real stories, the book. See `docs/LIVE_INTEGRATIONS.md` and `docs/RELEASE_GATES.md`.

## Creator approval required before launch

1. Written approval from Itachi for the concept, name usage and public identity (`creator.endorsed` in `src/lib/config/creator.ts`).
2. **Portrait:** `public/brand/itachi-masked-portrait.jpg` was cropped by the project owner from their own v1 design exploration (a low-resolution mockup) with its UI overlays removed. Replace it with an original high-resolution file and get the creator's written approval (`creator.portrait.creatorApproved`).
3. Editorial review of every Qur'an passage, translation licence confirmation and scholarly review of Reverts HQ answers.

## Screenshots

`docs/screenshots/` holds `home`, `menu`, `onboarding`, `star-card`, `afterglow`, `afterglow-live-challenge`, `afterglow-result`, `afterglow-recap`, `member-profile`, `atlas`, `dojo`, `sanctuary`, `membership`, `book-preview` and `arsenal`, each at 360, 390, 768, 1280 and 1440 px (`<name>-<width>.jpg`; the 390 and 1440 home shots are full-page).

## Docs

- `docs/DESIGN_SYSTEM.md`: tokens, typography, patterns, motion, components (also live at `/studio`)
- `docs/PRODUCT_FLOWS.md`: journeys and state machines
- `docs/LIVE_INTEGRATIONS.md`: adapters, schema and platform limits
- `docs/RELEASE_GATES.md`: what must be true before any public launch
- `docs/MISSION_GODSEED_UX_V1.md`: the original brief

## Roadmap

1. Creator conversation and approval; swap in the approved portrait and logo assets.
2. Supabase (or similar) behind the existing store interface: accounts, consented profile sync, moderation queue.
3. Editorially sourced Afterglow episodes with real public replay links and sourced timestamps.
4. A `YouTubeLiveChatAdapter` limited to creator-authorised broadcasts and consented account binding.
5. A verified source catalogue for Search the Arsenal, plus Qur'an reading and ISNAAD-style study tools.
6. The book, written from sourced works with editorial approval.

**Deployment:** none performed. This is a standard Next.js app (`npm run build && npm start`) with no required environment variables. Do not deploy publicly until the release gates pass.
