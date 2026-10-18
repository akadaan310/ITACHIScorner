# Original rendered baseline

Base commit: `b987ebb58c649f0c724cc5ace545ea2e8f7ed1d3`. Captured from the original production build using Playwright Chromium at http://localhost:3200. Original repository screenshots were not overwritten.

## Verification

| Check | Outcome | Duration |
|---|---|---:|
| `npm run lint` | PASS | 5.86s |
| `npm run typecheck` | PASS | 4.52s |
| `npm test` | PASS | 0.85s |
| `npm run build` | PASS | 12.2s |

Vitest: 27 tests in 2 files. Playwright desktop/mobile: 93 tests passed (2.3 minutes), including all 35 route axe scans. Exact output: `logs/playwright.log`.

## Capture and measurement method

Twelve existing core routes are measured at 360×844, 390×844, 768×1024, 1280×900 and 1440×900, device scale 1. Each has an original full-page JPEG and first-fold JPEG. Browser entrance animations were allowed to finish; screenshots disable animations consistently. Open navigation is captured separately at all five widths.

`rendered-audit.json` contains page status/errors, horizontal overflow, all laid-out action labels/destinations/coordinates, headings by fold, and section coordinates. Main action counts include the five hero orbit navigation links and carousel cards outside the horizontal carousel viewport. Hidden/collapsed actions are excluded. A distinct destination is an href or, for buttons, its tag + label. Repetition is the count of actions beyond the first per destination; this is not a count of distinct visual button styles.

## Home CTA and fold measurements

| Width | Height | Main actions | Distinct destinations | Repeated entrances | Hero primary y | Main sections y |
|---:|---:|---:|---:|---:|---:|---|
| 360 | 11147 | 37 | 20 | 17 | 1055 | hero 152, arsenal 1483, live 2792, battles 4241, today 4940, reverts 6147, sim 6793, rank 7766, stories 9033 |
| 390 | 10758 | 37 | 20 | 17 | 1029 | hero 152, arsenal 1457, live 2692, battles 4118, today 4805, reverts 5892, sim 6538, rank 7486, stories 8689 |
| 768 | 9074 | 37 | 20 | 17 | 1183 | hero 137, arsenal 1594, live 2326, battles 3345, today 4361, reverts 5320, sim 5888, rank 6747, stories 7453 |
| 1280 | 6879 | 37 | 20 | 17 | 810 | hero 137, arsenal 1222, live 1877, battles 2494, today 3089, reverts 3874, sim 4443, rank 5011, stories 5645 |
| 1440 | 6879 | 37 | 20 | 17 | 810 | hero 137, arsenal 1222, live 1877, battles 2494, today 3089, reverts 3874, sim 4443, rank 5011, stories 5645 |

Home main CTA repetition is stable across widths: `/watch` ×6; `/dojo/path` ×5; `/afterglow` ×3; `/dojo` ×3; `/atlas`, `/reverts`, `/afterglow/before`, `/membership` ×2 each. All 37 actions lead to only 20 destinations.

At 360px, the hero portrait and orbit dominate the upper first fold; the first primary action begins at y=1055, below the 844px viewport. At 390px it begins at y=1029. Five small orbit links appear above it. The overall public story continues for more than twelve phone folds.

## Core route inventory

| Route | Width | HTTP | Document height | Main actions | Distinct destinations | Overflow |
|---|---:|---:|---:|---:|---:|---:|
| `/` | 360 | 200 | 11147 | 37 | 20 | 0 |
| `/discover` | 360 | 200 | 6022 | 14 | 12 | 0 |
| `/atlas?star=ikhlas` | 360 | 200 | 4372 | 85 | 84 | 0 |
| `/dojo` | 360 | 200 | 4946 | 8 | 4 | 0 |
| `/reverts` | 360 | 200 | 6983 | 17 | 11 | 0 |
| `/membership` | 360 | 200 | 5251 | 4 | 3 | 0 |
| `/library/preview?page=4` | 360 | 200 | 3026 | 12 | 12 | 0 |
| `/afterglow` | 360 | 200 | 5889 | 11 | 8 | 0 |
| `/watch` | 360 | 200 | 5563 | 21 | 10 | 0 |
| `/onboarding` | 360 | 200 | 2290 | 2 | 2 | 0 |
| `/me` | 360 | 200 | 2170 | 8 | 8 | 0 |
| `/studio/creator` | 360 | 200 | 2263 | 1 | 1 | 0 |
| `/` | 390 | 200 | 10758 | 37 | 20 | 0 |
| `/discover` | 390 | 200 | 5813 | 14 | 12 | 0 |
| `/atlas?star=ikhlas` | 390 | 200 | 4337 | 85 | 84 | 0 |
| `/dojo` | 390 | 200 | 4742 | 8 | 4 | 0 |
| `/reverts` | 390 | 200 | 6859 | 17 | 11 | 0 |
| `/membership` | 390 | 200 | 5011 | 4 | 3 | 0 |
| `/library/preview?page=4` | 390 | 200 | 3003 | 12 | 12 | 0 |
| `/afterglow` | 390 | 200 | 5761 | 11 | 8 | 0 |
| `/watch` | 390 | 200 | 5582 | 21 | 10 | 0 |
| `/onboarding` | 390 | 200 | 2270 | 2 | 2 | 0 |
| `/me` | 390 | 200 | 2151 | 8 | 8 | 0 |
| `/studio/creator` | 390 | 200 | 2219 | 1 | 1 | 0 |
| `/` | 768 | 200 | 9074 | 37 | 20 | 0 |
| `/discover` | 768 | 200 | 3788 | 14 | 12 | 0 |
| `/atlas?star=ikhlas` | 768 | 200 | 3457 | 85 | 84 | 0 |
| `/dojo` | 768 | 200 | 3467 | 8 | 4 | 0 |
| `/reverts` | 768 | 200 | 4985 | 17 | 11 | 0 |
| `/membership` | 768 | 200 | 3705 | 4 | 3 | 0 |
| `/library/preview?page=4` | 768 | 200 | 2484 | 12 | 12 | 0 |
| `/afterglow` | 768 | 200 | 4055 | 11 | 8 | 0 |
| `/watch` | 768 | 200 | 3307 | 21 | 10 | 0 |
| `/onboarding` | 768 | 200 | 1573 | 2 | 2 | 0 |
| `/me` | 768 | 200 | 1415 | 8 | 8 | 0 |
| `/studio/creator` | 768 | 200 | 1674 | 1 | 1 | 0 |
| `/` | 1280 | 200 | 6879 | 37 | 20 | 0 |
| `/discover` | 1280 | 200 | 2758 | 14 | 12 | 0 |
| `/atlas?star=ikhlas` | 1280 | 200 | 2574 | 65 | 64 | 0 |
| `/dojo` | 1280 | 200 | 2541 | 8 | 4 | 0 |
| `/reverts` | 1280 | 200 | 4233 | 17 | 11 | 0 |
| `/membership` | 1280 | 200 | 2863 | 4 | 3 | 0 |
| `/library/preview?page=4` | 1280 | 200 | 1838 | 12 | 12 | 0 |
| `/afterglow` | 1280 | 200 | 3175 | 11 | 8 | 0 |
| `/watch` | 1280 | 200 | 2597 | 21 | 10 | 0 |
| `/onboarding` | 1280 | 200 | 1475 | 2 | 2 | 0 |
| `/me` | 1280 | 200 | 1317 | 8 | 8 | 0 |
| `/studio/creator` | 1280 | 200 | 1515 | 1 | 1 | 0 |
| `/` | 1440 | 200 | 6879 | 37 | 20 | 0 |
| `/discover` | 1440 | 200 | 2758 | 14 | 12 | 0 |
| `/atlas?star=ikhlas` | 1440 | 200 | 2574 | 65 | 64 | 0 |
| `/dojo` | 1440 | 200 | 2541 | 8 | 4 | 0 |
| `/reverts` | 1440 | 200 | 4233 | 17 | 11 | 0 |
| `/membership` | 1440 | 200 | 2863 | 4 | 3 | 0 |
| `/library/preview?page=4` | 1440 | 200 | 1838 | 12 | 12 | 0 |
| `/afterglow` | 1440 | 200 | 3175 | 11 | 8 | 0 |
| `/watch` | 1440 | 200 | 2597 | 21 | 10 | 0 |
| `/onboarding` | 1440 | 200 | 1475 | 2 | 2 | 0 |
| `/me` | 1440 | 200 | 1317 | 8 | 8 | 0 |
| `/studio/creator` | 1440 | 200 | 1515 | 1 | 1 | 0 |

## Visual inspection

Representative phone first folds (`home-360-fold.jpg`, `home-390-fold.jpg`) inspected directly. The live ticker and badge appear as current events despite concept disclosure; orbit choices crowd the portrait, while the primary text CTA sits below the first fold. Desktop first folds (`home-1280-fold.jpg`, `home-1440-fold.jpg`) also inspected directly: seven primary navigation entries, repeated live exits and portrait/orbit dominate; the primary action begins at y=810 in the 900px viewport. Desktop lacks the phone compression problem but retains competing entrances.

## Files

- JPEGs in this directory: all 60 original first-fold captures, six representative full pages and two expanded navigation captures. Complete original 125-image set is retained separately at `/workspace/baseline-itachi/screenshots/`.
- `rendered-audit.json`: per-width DOM inventory and fold maps.
- `navigation-open-*.json`: expanded navigation action inventories.
- `checks.json`, `logs/`: exact baseline command outcomes.
- `SHA256SUMS`: hashes for the selected JPEGs retained in this directory.
