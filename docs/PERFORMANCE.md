# Local performance measurements

The final app reduced homepage transferred bytes and observed paint times in this local experiment. These are production-browser samples, not deployed Core Web Vitals or Lighthouse scores. Each route/width uses three fresh Chromium contexts with browser cache disabled, loopback network, no CPU/network throttling, and network-idle/font-ready observation. Normal application prefetching is included; shared cloud-host timing is variable.

Baseline: `b987ebb`, Chromium 154.0.8037.57. Final app: `ba6a706`, Chromium 154.0.8037.57. [Raw baseline samples](screenshots/evidence-first/before/performance.json) and [raw final samples](screenshots/evidence-first/after/performance.json) retain all 48 observations and timestamps.

| Route comparison | Width | Median load ms before → after | Observed LCP ms before → after | Encoded KiB before → after | Observed CLS before → after |
|---|---:|---:|---:|---:|---:|
| `/` | 390 | 468.8 → 264.8 | 408.0 → 228.0 | 692.6 → 311.1 | 0.001 → 0.033 |
| `/discover` → `/explore` | 390 | 1441.6 → 202.7 | 1448.0 → 180.0 | 552.0 → 285.3 | 0.015 → 0.000 |
| `/dojo` → `/practice` | 390 | 963.4 → 212.4 | 976.0 → 164.0 | 644.2 → 284.3 | 0.009 → 0.070 |
| `/me` | 390 | 351.6 → 211.3 | 280.0 → 172.0 | 531.8 → 293.1 | 0.149 → 0.020 |
| `/` | 1280 | 617.4 → 246.0 | 532.0 → 192.0 | 723.6 → 315.1 | 0.029 → 0.091 |
| `/discover` → `/explore` | 1280 | 426.7 → 254.4 | 444.0 → 208.0 | 685.8 → 299.7 | 0.019 → 0.000 |
| `/dojo` → `/practice` | 1280 | 334.2 → 211.8 | 320.0 → 188.0 | 688.4 → 307.0 | 0.036 → 0.005 |
| `/me` | 1280 | 255.2 → 215.9 | 228.0 → 192.0 | 614.7 → 292.5 | 0.147 → 0.004 |

At 390px, homepage encoded transfer fell from about 693 KiB to 311 KiB, and observed LCP from 408ms to 228ms. At 1280px transfer fell from about 724 KiB to 315 KiB, and LCP from 532ms to 192ms. Discover → Explore and Dojo → Practice also change product scope, so their differences reflect simpler truthful waiting states as well as implementation changes.

## Heading stability correction

The previous `a45f4c2` experiment observed phone Explore median CLS 0.151. The italic heading phrase could reflow when the condensed font replaced its fallback. Keeping that phrase on its own block reserves its line consistently. The latest cold-cache samples observed Explore median CLS 0.000 at 390px and 1280px. The prior [raw performance data](screenshots/evidence-first/after/pre-font-fix-performance.json) remains retained.

A new browser regression delays every woff2 response by 800ms at 390×844, waits for font readiness and two animation frames, and requires observed layout shift below 0.1. It measured 0.008710 in the 114-test suite and 0.003327 in a focused recheck. [Measured validation](screenshots/evidence-first/after/slow-font-validation.json). An independent [five-width cold/delayed proof](screenshots/evidence-first/after/heading-fix-proof.json) observed a maximum of 0.075591 and confirmed unchanged Home font/CTA geometry.

These checks address the measured font-load regression. They do not establish layout stability over every real user session or claim all performance budgets in deployed conditions. TTFB, first-contentful-paint, individual samples and request counts remain in the JSON. The observation ends after network idle/font readiness and does not cover scrolling or an entire session.

To reproduce against an otherwise idle production server:

```bash
npm run build
npm run start -- --port 3400
PERF_BASE_URL=http://127.0.0.1:3400 node e2e/performance.mjs
```

`PERF_PHASE=before` selects original routes. `PERF_OUTPUT` selects a separate JSON destination. Run performance measurements after browser tests and captures finish. The delayed-font assertion runs in the normal Playwright suite.
