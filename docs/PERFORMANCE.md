# Local performance measurements

The final app reduced homepage transferred bytes and observed paint times in this local experiment. These are production-browser samples, not deployed Core Web Vitals or Lighthouse scores. Each route/width uses three fresh Chromium contexts with browser cache disabled, loopback network, no CPU/network throttling, and network-idle/font-ready observation. Normal application prefetching is included; shared cloud-host timing is variable.

Baseline: `b987ebb`, Chromium 154.0.8037.57. Final app: `a45f4c2`, Chromium 154.0.8037.57. [Raw baseline samples](screenshots/evidence-first/before/performance.json) and [raw final samples](screenshots/evidence-first/after/performance.json) retain all 48 observations and timestamps.

| Route comparison | Width | Median load ms before → after | Observed LCP ms before → after | Encoded KiB before → after | Observed CLS before → after |
|---|---:|---:|---:|---:|---:|
| `/` | 390 | 468.8 → 334.8 | 408.0 → 300.0 | 692.6 → 311.1 | 0.001 → 0.033 |
| `/discover` → `/explore` | 390 | 1441.6 → 276.5 | 1448.0 → 224.0 | 552.0 → 285.3 | 0.015 → 0.151 |
| `/dojo` → `/practice` | 390 | 963.4 → 217.9 | 976.0 → 172.0 | 644.2 → 284.2 | 0.009 → 0.065 |
| `/me` | 390 | 351.6 → 213.7 | 280.0 → 168.0 | 531.8 → 293.1 | 0.149 → 0.020 |
| `/` | 1280 | 617.4 → 262.1 | 532.0 → 204.0 | 723.6 → 315.0 | 0.029 → 0.091 |
| `/discover` → `/explore` | 1280 | 426.7 → 228.0 | 444.0 → 180.0 | 685.8 → 307.5 | 0.019 → 0.000 |
| `/dojo` → `/practice` | 1280 | 334.2 → 271.2 | 320.0 → 208.0 | 688.4 → 306.4 | 0.036 → 0.023 |
| `/me` | 1280 | 255.2 → 254.4 | 228.0 → 224.0 | 614.7 → 292.5 | 0.147 → 0.004 |

The homepage’s 390px encoded transfer fell from about 693 KiB to 311 KiB; at 1280px it fell from about 724 KiB to 315 KiB. Observed LCP fell from 408ms to 300ms on the phone viewport, and from 532ms to 204ms on desktop. Discover → Explore and Dojo → Practice also change product scope, so their differences reflect simpler truthful waiting states as well as implementation changes.

**Remaining tuning:** phone Explore observed median CLS 0.151 during cold load. Settled screenshots and axe scans do not establish layout stability. Font loading/fallback metrics and heading space reservation should be investigated before a public performance claim; this report does not mark all performance budgets as passed.

TTFB, first-contentful-paint, individual samples and request counts remain in the JSON. The observation ends after network idle and font readiness and does not cover scrolling or an entire session. No deployed or real-device claim follows from loopback timings.

To reproduce against an otherwise idle production server:

```bash
npm run build
npm run start -- --port 3400
PERF_BASE_URL=http://127.0.0.1:3400 node e2e/performance.mjs
```

`PERF_PHASE=before` selects original routes. `PERF_OUTPUT` selects a separate JSON destination. Run the measurement after browser tests and captures finish.
