# Verification record

The original baseline at `b987ebb58c649f0c724cc5ace545ea2e8f7ed1d3` passed lint, strict typecheck, 27 Vitest tests, production build, and 93 existing desktop/mobile Playwright tests. [Exact command outcomes](screenshots/evidence-first/before/checks.json) and [browser log](screenshots/evidence-first/before/logs/playwright.log) are retained with the baseline captures.

New browser expectations were written before the replacement UI. Running the initial three against the original production server failed for the expected reasons: seven legacy navigation labels instead of five canonical destinations, `/explore` returned 404, and `/practice` returned 404. [RED output](screenshots/evidence-first/before/logs/evidence-first-red.log).

The replacement suite preserves route status/error/overflow checks, internal-link resolution, external-link protection, axe scans, no-JavaScript navigation and reduced-motion checks. It replaces obsolete demo gameplay assertions with legacy redirects, empty source search, source/approval gates, unavailable authentication and privacy controls, forged-browser-state creator denial, responsive CTA placement and accessible phone navigation.

Final integrated verification is pending. This file does not claim remote Supabase auth, email delivery, deployed performance, real corpus coverage or creator approval.

Reproduction after `npm ci`:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Playwright discovers `/usr/bin/chromium` or `/usr/bin/chromium-browser`, accepts `PW_CHROMIUM`, and otherwise uses its installed browser. A fresh production server is used by default; `E2E_REUSE_SERVER=1` explicitly permits an existing server. `E2E_PORT` selects the port. `npm run screenshots` captures the final five-width review set without changing original screenshots.
