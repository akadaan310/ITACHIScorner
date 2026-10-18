# Asset provenance and release gates

Audited against base `b987ebb58c649f0c724cc5ace545ea2e8f7ed1d3` on 2026-10-18. No new face, photo, quote, signature, or brand insignia was generated during this mission.

| Asset | Provenance | Rights/review | Allowed use now |
| --- | --- | --- | --- |
| `public/brand/itachi-masked-portrait.jpg` (732 × 736) | Owner-supplied crop of earlier design exploration; UI overlays removed. Altered mockup, not a documentary source photo. SHA-256 `35e14eda0ed6700bf8087b3535df65d23a5ba365666f5d943aed30a7173322e4` | Creator approval absent; original high-resolution source absent. Signature/mask embroidery also needs approval/IP review. | Undeployed concept review only, with adjacent qualification. Replace with original approved creator image before public release. |
| `src/components/art.tsx`, icon and social-image code | Existing SVG/CSS concept artwork in this repository | Original concept mark; creator approval absent. Do not imply it is her official logo. | Preserve as concept geometry. No Naruto/Uchiha insignia or uncovered face. |
| Fontsource Inter, Fraunces, Amiri, Bebas Neue, JetBrains Mono | Self-hosted package assets; existing design system identifies OFL licenses | Retain package license notices and verify redistribution at release | Interface typography. Correct RTL/Amiri for future approved Arabic. |
| `docs/screenshots/*.jpg` (75 historical files) | Original application's concept screenshots | Reference artifacts containing obsolete demo content | Audit evidence only. Never current product/source evidence or creator endorsement. |
| `docs/screenshots/evidence-first/**` | Local Playwright captures of unchanged baseline and revised branch | Local review artifacts, not deployed site evidence | Before/after QA, fold maps, accessibility and responsive review. |
| `src/lib/fixtures/quran.ts` | Prior retrieved Tanzil/simple and Saheeh International fixtures, pending editor review | Text review and translation license not established | Dormant legacy/test data. Do not render publicly before qualified review. |
| Legacy video/event/practice/book fixtures | Fictional concept data from previous commit | Not source evidence, not an Itachi curriculum | Regression/test reference only. No public rendering through canonical or alias routes. |

Creator authorization, copyright/source rights, qualified religious review, and technical checks must be tracked independently. Do not toggle `creator.endorsed` or `creator.portrait.creatorApproved` from a technical test result. The repository and feature branch are not approval to deploy the likeness.
