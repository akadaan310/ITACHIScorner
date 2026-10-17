# Design system — The Celestial Majlis × Pocket Warrior (bridge v2)

Live reference: **`/studio`**. Tokens live in `src/app/globals.css` (`@theme`), and artwork primitives in `src/components/art.tsx`.

## The bridge

| From v1 (Pocket Warrior / Arsenal) | From the Celestial Majlis | How they meet |
| --- | --- | --- |
| Black + Itachi coral, bright state colours | Cosmic indigo night, gold, Nile teal, violet | Dark night sky that burns to a coral horizon; coral carries action and "live", gold carries celestial accents |
| Condensed all-caps headlines | Editorial serif | Bebas Neue caps for headlines; the emphasised words switch to Fraunces italic (`<em>` inside any heading) |
| `//` mono labels, HUD feel | — | `.eyebrow` = JetBrains Mono with a coral `//` prefix; `.hud` corner brackets frame the portrait and gates |
| Hex badges and logo | Eight-point Cairo star | Brand mark = coral hexagon carrying a gold eight-point star (`<Mark/>`, `src/app/icon.svg`) |
| Red live bar, bottom tab bar | — | Persistent `LiveBar` (honest "sample schedule" copy); mobile tabs Home · Search · Live · Sim · Menu with a v1 slide-out drawer |
| Masked portrait as hero | Constellations as navigation | The portrait sits inside a twelve-point medallion with an orbit of five star links to real destinations |
| Mamluk/Fatimid geometry, dunes | | Cairo skyline + dunes silhouette under every hero sky |

## Colour tokens

| Token | Hex | Use |
| --- | --- | --- |
| `cosmic` | `#0B0A14` | Global background |
| `ink` / `indigo` | `#141025` / `#21183C` | Surfaces |
| `coral` | `#FA536D` | Primary action, live, v1 identity |
| `ruby` | `#BE314C` | Fills only (fails contrast as small text on dark; use `#F0657A` for text) |
| `gold` / `amber` | `#D7AD65` / `#F7C65B` | Celestial accents, credits, focus ring |
| `teal` | `#26C4B3` | Simulator, success, verified |
| `violet` | `#A58BE1` | Atlas, sample tags |
| `cream` | `#F6EBDC` | Text on dark (secondary text no lower than 60% opacity) |
| `papyrus` / `lavender` / `ivory` | `#EFE3C6` / `#ECE4FB` / `#FBF7F0` | Light worlds |

**Worlds** are set with `data-world` on a page wrapper, which swaps `--accent`, `--surface`, `--text` and related tokens: `afterglow` (coral/amber), `dojo` (teal/ruby), `atlas` (violet/gold), `sanctuary` (light lavender — the emotional temperature drops: softer copy, no rankings), `library` (light parchment/oxblood).

## Typography

- Display: **Bebas Neue** (OFL), uppercase on `h1–h3`, line-height 0.86–0.95.
- Emphasis: **Fraunces** italic via `<em>` in headings or `.font-serif`.
- Labels: **JetBrains Mono**, 0.6–0.7rem, tracking 0.16–0.28em, `//` prefix.
- UI/body: **Inter**, body leading 1.7, never all-caps paragraphs.
- Arabic: **Amiri** (Naskh, full tashkīl), `.ar` → `direction: rtl; line-height: 2.1`, ayah markers `﴿n﴾` in Arabic-Indic digits. Sacred text is never animated, warped or overprinted; patterns are masked away from the text.

## Components

`btn` (`btn-primary` coral, `btn-gold`, `btn-ghost`, `btn-accent` per world), `card` (+ `card-bar`, `card-hover`), `chip`, `field`, `hex`, `hud`, `marquee`, the honesty tags (`tag-demo`, `tag-sample`, `tag-verified`, `tag-self`, `tag-planned`) through `<Tag kind=…/>`, `<HexIcon/>`, `<QuranPassage id/>`, `<WatchButtons/>`, `<ChapterHeader/>`, `<SectionTitle/>`, `<ProgressBar/>`, `<StarCard/>`.

Art primitives: `Mark`, `Wordmark`, `StarField` (seeded, so SSR and client match), `Crescent`, `Skyline`, `Dunes`, `Medallion`, `GeoStar`, `Separator`, `ArchFrame`, `starPath()`.

## Motion grammar

| Name | Spec |
| --- | --- |
| Portal | Chapter entry: pointed-arch `clip-path` unfold, 0.9 s, `cubic-bezier(.16,1,.3,1)` |
| Rise | Staggered reveal, 18 px, 80 ms steps |
| Orbit | Single-ring success, one star orbits into place. No strobe |
| Twinkle | 4 s breathe; only a third of stars animate |
| Parallax | CSS `animation-timeline: scroll()`, so no JavaScript is needed |
| Marquee | v1 red ticker, 38 s linear |

`prefers-reduced-motion` and the member "Reduce motion" toggle (`html[data-motion=reduced]`) collapse every animation to its end state.

## Accessibility rules

- WCAG 2.1 AA contrast; axe runs on every route in CI (`e2e/quality.spec.ts`).
- 44 px minimum targets, a visible amber focus ring, a skip link, semantic headings, labelled landmarks, radio groups for choices, and `aria-live` for reveals.
- Every interactive canvas has an equivalent: the Atlas has a list, the recap card is an accessible SVG, the timer has `role="timer"`.

## Voice

Bold and welcoming (v1), never combative in behaviour. "Join the Ranks", "Watch live now ⟶", "Credits", "Battles of ideas" (scored on clarity, fairness, evidence and listening). Honesty labels are always visible: Sample · Demo · Simulated · Self-entered · Planned.
