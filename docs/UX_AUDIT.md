# Rendered UX audit

The original site exposed 37 homepage actions leading to 20 distinct destinations. The main primary action began below the first fold at all three phone/tablet widths. Source-backed material, sample activities, a live event surface and fictional practice personas competed in the same public story.

The audit uses original commit `b987ebb58c649f0c724cc5ace545ea2e8f7ed1d3`. All 60 route/width combinations were captured from its working production build before implementation. [Structured inventory](screenshots/evidence-first/before/rendered-audit.json) records coordinates, all visible action labels, destinations, headings by fold, browser errors and overflow. [Baseline report](screenshots/evidence-first/before/BASELINE_REPORT.md) documents the method and results. Existing `docs/screenshots/` captures were preserved; new captures are under `evidence-first/before` and `evidence-first/after`.

## Original folds and navigation

| Width | Viewport height | Home height | First hero primary y | First-fold outcome |
|---:|---:|---:|---:|---|
| 360 | 844 | 11,147 | 1,055 | Portrait/orbit and headline; primary below fold |
| 390 | 844 | 10,758 | 1,029 | Portrait/orbit and headline; primary below fold |
| 768 | 1,024 | 9,074 | 1,183 | Primary below fold |
| 1,280 | 900 | 6,879 | 810 | Primary at bottom of first fold |
| 1,440 | 900 | 6,879 | 810 | Primary at bottom of first fold |

At 360px the major sections began at y=152 (hero), 1,483 (three worlds), 2,792 (live schedule/three acts), 4,241 (sample catalogue), 4,940 (challenge), 6,147 (new-Muslim journey), 6,793 (simulator), 7,766 (membership), and 9,033 (stories). Their exact positions at every width remain in the structured record. This is more than twelve phone viewport heights before the footer ends.

The desktop primary navigation had seven routes: Arsenal, Afterglow, Simulator, Atlas, Reverts HQ, Shahadahs, Library. Watch live and Join the Ranks added further header actions. The phone tab bar offered Home, Search, Live and Sim plus a menu with fifteen section links. [Original phone navigation](screenshots/evidence-first/before/navigation-open-360.jpg) and [desktop navigation](screenshots/evidence-first/before/navigation-open-1440.jpg) show the competing labels.

## Original CTA repetition

Counts include laid-out main links/buttons, orbit links and horizontally scrollable catalogue cards; collapsed menus are excluded. Distinct destinations are hrefs, or button tag plus label. Repeated entrances are actions beyond the first for each destination.

| Destination | Main actions |
|---|---:|
| `/watch` | 6 |
| `/dojo/path` | 5 |
| `/afterglow` | 3 |
| `/dojo` | 3 |
| `/atlas`, `/reverts`, `/afterglow/before`, `/membership` | 2 each |

These eight groups account for 17 repeated entrances. The overall home total is 37 actions and 20 distinct destinations at all five widths. There were also three actions styled as main primary CTAs, distributed through the page.

## Truthfulness and broken expectations

- The ticker and portrait badge stated “Live tonight”; desktop fine print qualified a sample schedule, but the prominent phone surface still looked current.
- Four catalogue tiles used sample titles/durations and all led to the same catalogue. They could not open the implied real source conversation.
- Sample episode IDs, trivia, personas, mock credits and local profile journeys created a production-shaped experience without real source lineage, authentication or authorization.
- The creator console offered an explicit browser demo toggle. It was labeled as a mock, but its public route and local state were unsuitable for a protected editorial boundary.
- Stories were already honestly empty. Membership already disclosed concept billing; these qualifications did not make them useful primary public destinations.
- The portrait, celestial ornaments, gold accents, moving live affordances and multiple Arabic/Latin styles competed with the question-to-learning narrative. The image requires the provenance/release decision documented separately.

All original route-width captures returned HTTP 200 with zero document-level horizontal overflow. Original automated checks passed, including 93 browser tests and 35 serious/critical axe scans. Passing those checks did not establish content provenance or the intended product boundary.

## Replacement acceptance

The public story becomes Home → Explore → Learn → Practice → Community, with My Corner secondary. Explore may show only reviewed real source results. Learn, Practice and session notes wait for evidence and creator approval. Community waits for moderation/privacy readiness. Sign-in and private account actions report missing configuration, and browser state cannot unlock editorial access. Legacy routes lead to those truthful surfaces.

Before/after screenshots and fold records use the same five widths and viewport heights. Final measurements and browser outcomes are recorded in [VERIFICATION.md](VERIFICATION.md) after the integrated production build is available. The original screenshots and numerical observations above remain unchanged.
