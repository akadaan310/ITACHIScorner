# Recovery review evidence

New recovery evidence is separate from the immutable `../evidence-first/` archive. `before/` is a fresh production rendering of integrated foundation `674668b`, captured before recovery UI changes. `after/` is the final recovery production rendering of public UI `9f7be34`. `comparisons/` contains ten labeled side-by-side first-fold and full-page Home contact sheets across every required width.

| Viewport | Fresh baseline first fold | Fresh baseline full home |
|---|---|---|
| 360×844 | [Home](before/home-fold-360.jpg) | [Full page](before/home-360.jpg) |
| 390×844 | [Home](before/home-fold-390.jpg) | [Full page](before/home-390.jpg) |
| 768×1024 | [Home](before/home-fold-768.jpg) | [Full page](before/home-768.jpg) |
| 1280×900 | [Home](before/home-fold-1280.jpg) | [Full page](before/home-1280.jpg) |
| 1440×900 | [Home](before/home-fold-1440.jpg) | [Full page](before/home-1440.jpg) |

[Before capture manifest and hashes](before/manifest.json) · [Verification](../../RECOVERY_VERIFICATION.md) · [Performance](../../RECOVERY_PERFORMANCE.md)

| Viewport | Recovered first fold | Compare first folds | Compare full pages |
|---|---|---|---|
| 360×844 | [Home](after/home-fold-360.jpg) | [Before / after](comparisons/home-360-fold.jpg) | [Before / after](comparisons/home-360-full.jpg) |
| 390×844 | [Home](after/home-fold-390.jpg) | [Before / after](comparisons/home-390-fold.jpg) | [Before / after](comparisons/home-390-full.jpg) |
| 768×1024 | [Home](after/home-fold-768.jpg) | [Before / after](comparisons/home-768-fold.jpg) | [Before / after](comparisons/home-768-full.jpg) |
| 1280×900 | [Home](after/home-fold-1280.jpg) | [Before / after](comparisons/home-1280-fold.jpg) | [Before / after](comparisons/home-1280-full.jpg) |
| 1440×900 | [Home](after/home-fold-1440.jpg) | [Before / after](comparisons/home-1440-fold.jpg) | [Before / after](comparisons/home-1440-full.jpg) |

[Final capture manifest / hashes](after/manifest.json) · [Comparison manifest / hashes](comparisons/manifest.json) · [Action inventory comparison](comparison.json) · [Archive integrity](archive-integrity.json) · [Checks](checks.json)

The final phase has 117 hashed artifacts: 70 route folds, five full Home pages, 25 story transitions, three menus, six draft states, two independent interaction proofs, one font contact sheet and five audits. The editing/reviewed/cleared desk captures at 390px and 1280px use explicitly labeled generic QA visitor writing; they are not creator content. Independent [phone clipboard-denial proof](after/review-copy-failure-360-reduce.png) and [review-arrow proof](after/review-arrow-360-reduce.png) use only reviewer-typed generic visitor input, under reduced motion. The [fallback / loaded font contact sheet](after/font-fallback-loaded-contact.jpg) shows every required viewport before and after font arrival; the [final font probe](after/slow-font-validation.json) passes all ten combinations.

Fourteen routes are captured at every width: Home, Explore, Learn, Practice, Community, Session Notes, Library, Support, Join, My Corner, Private Notes, Settings, About and denied Creator access. `home-transition-{section}-{width}.jpg` records the start of each non-hero section. `navigation-open-{width}.jpg` captures the open phone/tablet menu.

Each `rendered-audit-{width}.json` contains visible action inventories, coordinates, heading/fold maps, section bounds and overflow. The recovery capture script separates main navigation actions, form submissions, transient interactions and global navigation. Each category records visible instances, unique actions and repeated instances. Disabled actions are explicitly marked; these are visible affordance counts, not claims of backend capability. The initial state and state-dependent draft controls must be described separately.

Captures wait for fonts and finite document animations. Screenshots show settled layouts. Cold-load performance and delayed-font probes record a separate loading condition. Fixed phone navigation can appear at the original viewport boundary in a full-page browser capture; first-fold files show its viewport placement directly.

Reproduce against a running production server with `CAPTURE_BASE_URL` and `CAPTURE_PHASE` set, using `node scripts/capture-recovery.mjs` and `node scripts/capture-recovery-fonts.mjs`. Existing completed phases require explicit `CAPTURE_REPLACE=1` before replacing recovery captures. The scripts never write to the older archive. `python scripts/capture-recovery-comparisons.py` creates technical contact sheets after both phases exist. The owner does not need to run these commands.
