# V4 independent code review

Reviewed 2026-10-18 against base `7a8ce5efda461ebab717a03ed1d9c73528f92c9d` in the uncommitted `feat/v4-creator-first` working tree. Scope: tracked product diff, new product components/styles, V4 tests, brand provenance, acquisition metadata/manifests/receipt, mission and implementation plan. This review is not a production release approval or deployment receipt.

## Important findings

### V4-R1 — Search misses incorrectly claim that the entire collection is unpublished (P2)

Location: `src/app/explore/page.tsx:20`.

`getPublishedQuestions(query)` returns a filtered result. For every successful empty result, the body says “No reviewed source excerpts are published yet.” Once any approved question exists, an unrelated search still displays that global assertion. The heading correctly distinguishes a search miss, but the explanatory text contradicts the actual collection and sends the visitor toward an assumed unfinished collection.

Fix: branch on `query` in the explanatory text. A filtered miss should say no reviewed questions match this search and invite another phrase; reserve the unpublished-collection statement for an unfiltered empty result. Keep the unavailable-service branch separate. Verify a successful empty filtered response without treating it as evidence of an empty catalogue.

Status: **closed**. The implementer restored query-specific copy and added `tests/explore-states-v4.test.ts`; the regression checks the empty filtered result without reading private account state. The reviewer independently passed that test and confirmed the corrected message on the refreshed production build at `/explore?q=review-nonmatching-query`.

### V4-R2 — Published source-preview status labels fail text contrast (P2)

Locations: `src/components/source-preview.tsx:9`, `src/app/globals.css:635`, `src/app/globals.css:679`.

The populated preview uses `.status-label`, which receives `#ef8b94`, on the source section's `#ede5d7` background. Their WCAG contrast is **1.91:1**, below the 4.5:1 requirement for normal text. Existing `.source-chapter .public-eyebrow` dark-color styling does not cover `.status-label`. Current zero-content screenshots and accessibility runs cannot exercise this branch.

Fix: scope a dark status-label color to the light source section, for example its existing dark crimson `#8e293b`. Verify the populated preview with an explicitly test-only fixture; do not seed fabricated product data.

Status: **closed**. `src/app/v4-interactions.css` now scopes `.source-chapter .status-label` to `#8e293b`. On the refreshed production build, an explicitly temporary browser DOM fixture measured `rgb(142, 41, 59)` on `rgb(237, 229, 215)`, **6.64:1** contrast at 10.4px. The populated preview also returned **zero axe WCAG 2 A/AA violations**. No fake product or database content was created.

## Reviewed boundaries

- Public source search and homepage previews use the existing validated `published_questions` read model. Provisional research candidates are not imported into visitor-facing content. Source IDs and outbound source URLs continue through the existing parser; React escapes text.
- Guest question journey and practice use component state, with no draft network submission, browser storage or automatic account transfer. Copy is user initiated; clipboard failure retains the draft and reports failure. No religious answer, attributed method or score is generated.
- Account activity counts explicitly filter both tables by the authenticated user's ID and preserve an unavailable state for invalid/error counts. The page derives that ID from the existing trusted account context. It does not invent progress, streaks or faith scores.
- Creator Studio remains read-only and checks trusted server-derived staff roles before its private queue read. No role is taken from browser storage.
- Auth/API implementation, migrations, RLS definitions and the raw research engine have no changes relative to the review base. Their unchanged status is not a fresh hosted end-to-end certification.
- Five primary destinations and secondary creator/book/support paths match the plan. Portrait placements reuse one clearly disclosed concept composition; the environment toggle supplies a no-portrait fallback. Creator endorsement and portrait approval remain false. No genuine new photo family, transparent portrait cutout or authored book is claimed.
- Research reports nine provisional metadata candidates, zero verified official memberships, zero transcripts and an unknown denominator. Metadata imports remain rights-pending, have no tracks and cannot establish curriculum findings. The private archive's SHA-256, byte size, 68-entry count and CRC were independently checked against the public receipt; no transcript bodies were present in the public V4 files reviewed.
- GitHub/Vercel evidence distinguishes historical deployments from V4 and leaves the configured production branch/SHA unverified. Creator permission, hosted email/member lifecycle and production release remain explicit limitations.

## Validation and limits

The initial implementer check reported lint, typecheck, 116 unit tests and a fresh production build passed. After the fixes, this reviewer independently ran four focused Vitest files (Explore empty-state regression, both account-activity suites, acquisition boundaries): **10/10 tests passed**. This reviewer independently inspected code and records, verified the private ZIP receipt, checked the unchanged sensitive-file diff, and calculated the populated-state contrast. A temporary browser-only populated preview fixture on the initial production build confirmed the original computed foreground/background and 10.4px font size. The implementer subsequently reported the final 120-unit-test suite, lint, typecheck and production build passing. The broader Playwright, full-page after audit and release checks are separate QA work; consult the final delivery report for their completed results. No hosted writes, public publication, commit, push or deployment was performed by this review.

Both important findings are fixed and independently verified on the refreshed production build. **No critical or important finding remains open.** Optional nits: none recorded.
