# V4 verification

V4 checks use the existing `feat/v4-creator-first` checkout. Browser QA targets a fresh local production server at `http://localhost:4001` with intentionally unconfigured account credentials. This prevents safe sign-in probes from contacting an email provider. Local success does not verify hosted Auth, real-user CRUD, remote deletion or a Vercel deployment.

## Verification evidence

| Check | Result |
| --- | --- |
| Real PostgreSQL relational/RLS suite | 118 assertions passed on PostgreSQL 17.6, network disabled; [log](screenshots/v4/logs/rls.log) |
| Real PostgreSQL private persistence | 53 assertions passed with synthetic fixtures and a Unix socket, network disabled; [log](screenshots/v4/logs/private-persistence.log) |
| Lint / strict typecheck | Passed on frozen final source; [lint](screenshots/v4/logs/lint.log), [typecheck](screenshots/v4/logs/typecheck.log) |
| Vitest | 120/120 tests across 13 files passed; [log](screenshots/v4/logs/unit.log) |
| Fresh production build | Passed; [condensed executed-command receipt](screenshots/v4/logs/build-receipt.json), not a raw shell log |
| Production browser suite | 126/126 passed in 136.4 seconds, zero failed/skipped/flaky; [log](screenshots/v4/logs/playwright-final.log), [machine summary](screenshots/v4/playwright-summary.json) |
| Canonical routes / legacy links | All 18 canonical routes and 23 legacy redirects pass with no browser errors, retired demo content or horizontal overflow |
| Accessibility / responsive behavior | All 18 serious/critical WCAG 2A/AA axe checks pass; keyboard menu/focus, no-JS fallback, reduced motion and first-fold hero target checks pass at five widths |
| Delayed-font layout shift | Home 1280px: 0.001427; Explore 390px: 0.036415, both below strict 0.1; [Home](screenshots/v4/suite-screens/home-slow-font-layout-shift.json), [Explore](screenshots/v4/suite-screens/slow-font-layout-shift.json) |
| Suite screenshot artifacts | 85 artifacts: 70 route first folds, five full Home pages, three menus, five action audits and two font probes, at 360/390/768/1280/1440px |
| Prior archive integrity | All 454 tracked evidence-first/recovery files byte-identical to HEAD; [record](screenshots/v4/archive-integrity.json) |

The exact commands for database evidence are `bash scripts/test-rls.sh` and `bash scripts/test-private-persistence.sh`. Both scripts explicitly select the local Docker socket, clear inherited endpoint/TLS selectors, start disposable `postgres:17.6` containers with `--network none` and remove them on exit. No hosted database is used.

The browser suite ran against fresh production build `PAzNO4-Ap4lMyM9upxacU`. The [build/source receipt](screenshots/v4/qa-build.json) records the server, backend posture and SHA-256 hashes of key tested source files. The [parent-owned production build receipt](screenshots/v4/logs/build-receipt.json) records the successful build command separately; a Git commit is not a deployment receipt.

## Regression scope

Existing API privacy, hostile-origin, redirect, unavailable-auth, browser-storage role forgery, no-invented-content, keyboard, no-JavaScript, reduced-motion, target-size, overflow, axe and font-layout-shift assertions remain enforced. Navigation expectations now require exactly Explore, Learn, Practice, Community and My Corner. Home still has only two hero actions and now has seven narrative movements, source search and a transient question journey. Learn and Community lead to their present page-specific actions; Practice keeps its secondary question-desk handoff.

The old footer assertion prohibited a Creator Studio link entirely. V4 explicitly requires this secondary pathway, so the replacement follows that link and still requires denied private access, no editorial data and no preview/publish controls. Browser-controlled role forgery tests are unchanged.

The parent-owned V4 tests exercise all four question-journey steps without network transmission and exercise private Practice review/edit/clear, reversible self-checks and clipboard denial. Additional account-activity checks require truthful unavailable states for missing clients, database errors, thrown exceptions and invalid counts, and show zero only when both owner-filtered queries actually return zero.

## Artifact preservation

Screenshot and font-probe defaults now write to `docs/screenshots/v4/suite-screens`; they refuse evidence-first and recovery archive paths. Existing archives are retained. Detailed V4 narrative captures and comparisons are documented in [the UX audit](UX_ARCHITECTURE_AUDIT_V4.md). Test traces and machine browser output belong to ignored `test-results-v4/`.

The initial first-failure run stopped at the obsolete footer-visibility rule after 43 passing tests. Its [log](screenshots/v4/logs/playwright-initial.log) records that test correction; it is not a final acceptance run.

A second first-failure run exposed real Home contrast failures in the large Learn and Practice words (2.25:1 and 1.6:1, below 3:1). The parent corrected their colors and reserved clear space around them before the final rebuild. The complete final suite passed unchanged axe thresholds. Its source-label contrast fixture is visibly marked as QA-only and does not publish a fabricated source record. The [second-run log](screenshots/v4/logs/playwright-second.log) preserves the failure evidence.

No hosted account, email or deployment success is inferred from these local checks. PostgreSQL fixtures are synthetic. No real visitor writing or restricted transcript content appears in the browser captures.

The parent separately tested configured signed-out rendering and disabled-portrait fallbacks at 390px and 1440px in an isolated Next development server on port 4002. The [manifest](screenshots/v4/configured-fallback/manifest.json) records 12 observations and 12 captures, zero portrait images/overflow on the sampled fallback routes, browser-intercepted sign-in submissions, no provider email sent, and anonymous export rejected with 401 plus `private, no-store`. This is development-rendering and form-behavior evidence; it does not establish a production deployment or authenticated account lifecycle.

Expanded five-width delayed-font validation adds ten fresh Home/Explore contexts with an 800ms font-response delay: maximum CLS **0.085052**, every Home primary remains in the first fold, and no overflow. [Raw probe](screenshots/v4/font-validation/after/slow-font-validation.json). This is a local regression check, not hosted Core Web Vitals. The first cold-navigation command used the wrong environment-variable name and reached inactive port3200; it produced no valid performance result. The corrected command uses `PERF_BASE_URL` and the separate V4 output below.

The corrected cold-navigation probe completed **60 samples** across Home, Explore, Practice and My Corner at all five widths, three fresh contexts per route/width. [Raw samples](screenshots/v4/performance.json) · [bounded summary](screenshots/v4/performance-summary.json). The latest focused V4 browser regression rerun also passed **4/4**, including the atomic append-and-sample contrast fixture that avoids a hydration-only test race. These four repeat checks are not added to the 126 distinct acceptance-test total.

The immutable capture source was initially uncommitted. After implementation commit `783a0180adb59f47b0393d154bbeb9223c086685`, exact committed bytes for all 131 recorded source/brand/tool paths were hashed and matched against the production screenshot manifest. [Commit-to-render receipt](screenshots/v4/committed-source-receipt.json) closes that identity gap without relabelling the original capture.
