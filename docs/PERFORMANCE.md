# Local performance measurements

These are reproducible local production-browser samples, not deployed Core Web Vitals or Lighthouse scores. Each route/width uses three fresh Chromium contexts with browser cache disabled, loopback network, and no CPU/network throttling. Measurements include normal application prefetching and font/image loading. A shared cloud host can affect timing; values are descriptive and carry no field-performance claim.

The baseline uses Chromium 154.0.8037.57 and original build `b987ebb58c649f0c724cc5ace545ea2e8f7ed1d3`. [Raw baseline samples](screenshots/evidence-first/before/performance.json) retain all 24 observations and the exact measurement timestamp. `e2e/performance.mjs` records navigation timing, paint observations, layout shifts, CDP encoded transferred bytes and request counts.

| Original route | Width | Median TTFB ms | Median load ms | Observed LCP ms | Encoded transfer KiB |
|---|---:|---:|---:|---:|---:|
| `/` | 390 | 18.0 | 468.8 | 408.0 | 692.6 |
| `/discover` | 390 | 19.3 | 1441.6 | 1448.0 | 552.0 |
| `/dojo` | 390 | 13.2 | 963.4 | 976.0 | 644.2 |
| `/me` | 390 | 10.6 | 351.6 | 280.0 | 531.8 |
| `/` | 1280 | 17.8 | 617.4 | 532.0 | 723.6 |
| `/discover` | 1280 | 14.0 | 426.7 | 444.0 | 685.8 |
| `/dojo` | 1280 | 8.3 | 334.2 | 320.0 | 688.4 |
| `/me` | 1280 | 4.5 | 255.2 | 228.0 | 614.7 |

Final integrated measurements are pending. The route comparison will map Discover → Explore and Dojo → Practice. Those are product-boundary changes, so transfer/timing differences reflect simpler truthful waiting states as well as implementation changes.

To reproduce against an otherwise idle production server:

```bash
npm run build
npm run start -- --port 3200
PERF_BASE_URL=http://127.0.0.1:3200 node e2e/performance.mjs
```

`PERF_PHASE=before` selects original routes. `PERF_OUTPUT` sets a different JSON destination. Run the measurement process after browser tests and captures finish to reduce contention. Paint/CLS observations end after network idle and font readiness; they do not cover scrolling or a full session.
