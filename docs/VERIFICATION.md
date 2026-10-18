# Verification record

The integrated production app at `ba6a706` passed **114/114 Playwright tests**, with zero skipped, flaky or failed tests. QA lint and strict typecheck passed. The integrator ran **105/105 Vitest tests** and built the default Turbopack production server used by QA. [Exact outcomes and commands](screenshots/evidence-first/after/checks.json), [full browser results](screenshots/evidence-first/after/playwright-results.json), and [build/capture metadata](screenshots/evidence-first/after/manifest.json) retain the evidence.

| Verification | Observed outcome |
|---|---|
| Canonical route rendering | 18 routes; HTTP 200, no browser errors/demo content/overflow |
| Legacy navigation | 23 redirects to truthful canonical surfaces |
| Accessibility | 18 axe scans; no serious or critical WCAG 2A/AA violations |
| Source and account behavior | Empty search, approval gates, disabled unconfigured actions, private notes readiness and forged-localStorage creator denial |
| API boundaries | 27 checks: hostile-Origin 403, private no-store responses, unconfigured mutations/export failure, safe invalid callback/confirmation redirects |
| Responsive navigation | Five widths; main home CTA entirely above first fold and at least 44px tall; phone menu Escape/focus return/navigation |
| Fallbacks | No-JavaScript home-to-Explore/legacy navigation; no continuously running decoration under reduced motion; no unapproved sacred-text lesson examples |
| Review captures | 14 core routes × five widths = 70 records; 78 JPEGs including full-page homes and phone/tablet menus |
| Local performance | 24 fresh-context cold-cache samples; Explore phone CLS below 0.1 with fonts deliberately delayed 800ms; see [PERFORMANCE.md](PERFORMANCE.md) |

The browser run intentionally omitted backend credentials. Valid-looking auth payload tests first require a runtime 503 “not configured” response, so a configured backend fails that prerequisite before any email request can be sent. No email, authenticated remote account mutation, creator publication or deployment was performed by QA. Authenticated email delivery and real-user CRUD remain outside this browser evidence; separate SQL/remote setup evidence belongs to [AUTH_PRIVACY_SETUP.md](AUTH_PRIVACY_SETUP.md).

The preliminary integrated run at `18c7513` had **108 passed / 1 failed**. Its external-channel test assumed direct TikTok/YouTube links; About correctly used the supplied `https://linktr.ee/dawahxdialogues` hub. The test now requires that exact hub and preserves external new-tab/no-placeholder protections. Its focused recheck passed, then a complete 113-test run passed at `a45f4c2` after notes/saved-question endpoints were added. That run exposed phone Explore cold-load CLS 0.151. Reserving the italic heading phrase on its own line corrected the shift; the final `ba6a706` run adds a delayed-font regression and passes all 114 tests. A focused recheck also passed. [Preliminary log](screenshots/evidence-first/after/logs/playwright-initial.log) remains retained.

The original baseline at `b987ebb` passed lint, typecheck, 27 Vitest tests, production build and 93 original browser tests. Initial replacement navigation/Explore/Practice tests were confirmed RED on that original build before the new UI. The first API boundary test likewise failed against its absent route. [Baseline report](screenshots/evidence-first/before/BASELINE_REPORT.md) and [RED output](screenshots/evidence-first/before/logs/evidence-first-red.log) preserve the original observations.

The final screenshot set is under [after](screenshots/evidence-first/after/README.md); original captures are retained under [before](screenshots/evidence-first/before/BASELINE_REPORT.md). Both image sets have SHA-256 manifests. Screenshots measure settled layouts; local performance samples separately expose cold-load shifts. The prior phone Explore median layout shift 0.151 is retained in the historical experiment. After the heading fix, final cold-load median was 0.000, and deliberately delayed fonts measured 0.008710 in the full suite and 0.003327 in the focused recheck, below the 0.1 guard. [Regression measurements](screenshots/evidence-first/after/slow-font-validation.json) and [independent five-width proof](screenshots/evidence-first/after/heading-fix-proof.json) record the correction. No deployed Core Web Vitals or full WCAG-conformance claim is made.

Reproduction after `npm ci`:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Playwright discovers `/usr/bin/chromium` or `/usr/bin/chromium-browser`, accepts `PW_CHROMIUM`, and otherwise uses its installed browser. A fresh production server is used by default. `E2E_PORT=3400 E2E_REUSE_SERVER=1` explicitly reuses the verified server. `npm run screenshots` writes only the final review directory; original screenshots remain untouched.

## Database installation and final branch checks

Both SQL migrations passed 118 real PostgreSQL assertions, including the original 96 role/publication protections, FK covering-index/policy checks, and precise private episode annotations. [SQL log](screenshots/evidence-first/after/logs/rls-final.log) and [hosted checks](HOSTED_VERIFICATION.md) record the separate evidence. Hosted security advisories are empty; missing-FK and duplicate-policy notices are resolved. The only remaining performance result is 72 unused-index INFO observations on an empty database; retain required indexes ([explanation](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index)). No hosted member identity/email/delete claim follows from SQL tests.

Local migration filenames match the actual hosted migration versions while preserving their reviewed hashes. The current default branch was rechecked at original base b987ebb; the completed work is delivered on a separate feature branch. Final lint/typecheck also passed after integrating the delivery browser test. The final response records the verified pushed commit; no deployment was performed.
