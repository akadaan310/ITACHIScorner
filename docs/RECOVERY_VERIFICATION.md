# Recovery verification

This follow-up preserves the prior [evidence-first verification](VERIFICATION.md) and all files under `docs/screenshots/evidence-first/`. New records belong only under [screenshots/recovery](screenshots/recovery/README.md).

## Fresh production baseline

After `npm ci`, the integrated foundation at `674668b` passed 105 Vitest tests and a fresh production build. QA reviewed the production server at port 3600 before UI changes. [Before manifest](screenshots/recovery/before/manifest.json) records Chromium, timestamp, routes, dimensions and SHA-256 hashes.

The baseline contains 70 route first folds, five complete Home captures, 15 Home section-transition captures, three open phone/tablet menus and five machine-readable action/fold audits. All five required sizes were captured: 360×844, 390×844, 768×1024, 1280×900 and 1440×900. Each baseline homepage contained three visible main navigation actions, three unique destinations, no repeated destination instances and no local interactions or form submissions. Global navigation is counted separately.

All five added [recovery regressions](../e2e/recovery.spec.ts) failed on that baseline for the intended missing features. [RED output](screenshots/recovery/before/logs/recovery-red.log) preserves the failures before implementation. They cover exact hero wording and hierarchy, contextual journeys, visitor draft review/edit/copy/clear, ephemeral storage/network boundaries, and useful handoffs from gated routes.

Baseline measurements include 60 fresh-context cold-cache navigations across all five widths and Home, Explore, Practice and My Corner. Ten further samples delay each font response by 800ms on Home and Explore. All baseline font samples remained below CLS 0.1, with maximum 0.091212; every homepage primary action remained inside its first fold and no horizontal overflow appeared. These are local lab checks, not hosted measurements. See [performance record](RECOVERY_PERFORMANCE.md).

## Final verification

The final production UI passed **122/122 Playwright tests**, with zero failed, skipped or flaky tests. The source app is the public UI commit `9f7be34a5dfb407ed476d5cfc23a9340c62c4e02`; the full implementation is the same commit. The [final capture manifest](screenshots/recovery/after/manifest.json) records the production build ID and public-source SHA-256 hashes. The final delivery commit is recorded in Git history and the final response.

[Machine-readable checks](screenshots/recovery/checks.json) · [Full browser results](screenshots/recovery/after/playwright-results.json) · [Browser log](screenshots/recovery/after/logs/playwright-final.log) · [Focused fix checks](screenshots/recovery/after/logs/final-fix-focused.log) · [Action comparison](screenshots/recovery/comparison.json)

| Check | Observed result |
|---|---|
| Lint / strict typecheck | Passed on the final implementation; [lint](screenshots/recovery/after/logs/lint.log), [typecheck](screenshots/recovery/after/logs/typecheck.log) |
| Vitest | 110/110 passed; [log](screenshots/recovery/after/logs/vitest.log) |
| Production build | Passed; [log](screenshots/recovery/after/logs/build.log) |
| Browser suite | 122/122 passed, zero skipped/flaky/unexpected; seven new recovery tests, one desktop-font regression and all 114 preserved tests |
| Canonical routes / old links | 18 routes render without errors/overflow/demo content; 23 legacy redirects and internal-link checks pass |
| Accessibility | 18 axe scans: no serious/critical WCAG 2A/AA violations; keyboard menu/focus, no-JS fallback and reduced-motion checks pass |
| Privacy / account boundaries | 27 API checks; draft stays out of local/session storage and outgoing requests, loses state on reload, and copies only visitor text |
| Mobile draft feedback | Controlled 360px copy success and clipboard-denial feedback stays fully above fixed navigation without stealing focus; default and reduced-motion states pass |
| Relational security | 118 real local PostgreSQL assertions pass; [log](screenshots/recovery/after/logs/rls.log) |
| Private adapter | 53 real local PostgreSQL assertions pass using synthetic fixtures only; [log](screenshots/recovery/after/logs/private-postgres.log) |
| Visual proof | 117 hashed capture artifacts; ten first-fold/full-page side-by-side sheets across all five widths |
| Cold load / font delay | 60 final cold-cache samples: max LCP 264ms, max CLS 0.070946; all ten delayed-font combinations pass the strict 0.1 guard |
| Archive preservation | All 146 retained image hashes match and the old archive has no Git diff; [integrity result](screenshots/recovery/archive-integrity.json) |

The final capture set contains 70 selected-route first folds, five full Home pages, 25 story transitions, three open menus, six draft editing/reviewed/cleared states, two independent interaction proofs, one fallback/loaded font contact sheet and five action/fold audits. Draft screenshots contain explicitly labeled generic QA visitor writing. Independent review proofs contain only the reviewer's generic visitor question/reflection; no creator or corpus extract appears in them.

At every required width the homepage has **six unique navigation destinations**, **three source-detail disclosures**, and **three draft controls**. The latter start disabled until the visitor writes. There are zero repeated main destinations or repeated control instances, and two hero actions. Review and Edit are successive states of one workflow; they are not counted as simultaneous destinations. The page has six narrative sections, compared with four before. [Counts and coordinates](screenshots/recovery/comparison.json) separate navigation, form submission, interactions and global navigation rather than turning every control into an undifferentiated CTA total.

Three real issues were caught before the final build: decorative Learn/Practice words failed contrast, and phone copy feedback could sit behind the fixed navigation. The delayed-font probe then exposed desktop Home CLS 0.101316: fallback heading width changed the grid tracks and portrait size. The scoped fallback metrics and zero-minimum grid tracks reduce 1280px delayed-font CLS to 0.007877 without changing the loaded layout. The contrast correction and feedback scroll/spacing correction passed focused checks and the clean final 122-test suite. The ten final Home/Explore delayed-font probes pass at all five widths, with maximum CLS 0.070946 and no overflow or primary-fold failure. The [failed font samples](screenshots/recovery/after/pre-font-fix-slow-font-validation.json), [layout-source debug](screenshots/recovery/after/pre-font-fix-layout-source-debug.json), [desktop Home RED](screenshots/recovery/after/logs/home-font-red.log), [focused GREEN](screenshots/recovery/after/logs/font-fix-focused.log) and [font contact sheet](screenshots/recovery/after/font-fallback-loaded-contact.jpg) retain the correction evidence. An initial no-JS assertion was corrected to target the visible fallback directly because Playwright skips `noscript` descendants when matching a parent's text. The preliminary full run also recorded two trace-file errors caused by overlapping runner output directories; all final browser runs were sequential with separate artifact paths. [Preliminary output](screenshots/recovery/after/logs/playwright-preliminary.log) and [controlled feedback RED](screenshots/recovery/after/logs/copy-feedback-controlled-red.log) remain available.

The browser server intentionally had no backend account credentials. API checks require unavailable responses before sending valid-looking auth payloads, so they cannot silently send a real sign-in email. Local browser and PostgreSQL evidence does not establish hosted email delivery, authenticated real-user CRUD, hosted privacy deletion, creator approval or live corpus import. No deployment, outreach, paid processing, curriculum publication or real corpus ingestion was performed by QA. Performance and font results are recorded separately in [RECOVERY_PERFORMANCE.md](RECOVERY_PERFORMANCE.md).
