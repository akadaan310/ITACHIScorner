# Recovery performance record

Measurements use a locally served production build on a shared cloud host, Chromium fresh contexts, disabled browser network cache, loopback network and no CPU or network throttling. Three samples per route and width cover Home, Explore, Practice and My Corner at all five required widths, producing 60 samples per phase. Each navigation waits for network idle and font readiness. Measurements are local regression evidence; they are not Lighthouse scores or deployed Core Web Vitals.

The [fresh evidence-first baseline samples](screenshots/recovery/before/performance.json) were collected in an agreed idle window, after `npm ci` and a fresh production build at `674668b`. No build, full browser suite or SQL verification ran concurrently.

| Home viewport | Median FCP | Median LCP | Median CLS | Transferred bytes | Requests |
|---|---:|---:|---:|---:|---:|
| 360px | 180ms | 180ms | 0.0222 | 318,586 | 28 |
| 390px | 224ms | 224ms | 0.0330 | 318,586 | 28 |
| 768px | 272ms | 272ms | 0.0640 | 323,645 | 30 |
| 1280px | 212ms | 212ms | 0.0912 | 322,078 | 30 |
| 1440px | 284ms | 284ms | 0.0720 | 324,266 | 30 |

The [font regression probe](screenshots/recovery/before/slow-font-validation.json) uses a fresh context and disabled network cache for each of ten Home/Explore combinations. Each `woff2` response is delayed by 800ms; the observer excludes layout shifts with recent user input and reads results two animation frames after `document.fonts.ready`. The maximum baseline delayed-font CLS was 0.091212 at 1280px Home, below the 0.1 threshold. All widths had no horizontal overflow; each Home primary action remained entirely above its first fold.

## Font regression and correction

The first recovery probe found desktop Home CLS **0.101316**, above the unchanged 0.1 guard. [Failed samples](screenshots/recovery/after/pre-font-fix-slow-font-validation.json), [source rectangles](screenshots/recovery/after/pre-font-fix-layout-source-debug.json), [fallback](screenshots/recovery/after/pre-font-fix-home-1280-fallback.png), [loaded](screenshots/recovery/after/pre-font-fix-home-1280-loaded.png) and a permanent [RED browser test](screenshots/recovery/after/logs/home-font-red.log) preserve the diagnosis.

At 1280px, the wide fallback made the heading occupy four lines and widened the copy grid track from its loaded 606.53px to 793.89px, shrinking the portrait from 460px to 318.11px. When Bebas arrived, both tracks changed. Commit `9f7be34` gives the hero a local fallback with measured 58.5% font sizing and sets the desktop tracks to zero-minimum fractional widths. The loaded layout stays the same; fallback geometry stops resizing the portrait.

All ten final [delayed-font samples](screenshots/recovery/after/slow-font-validation.json) pass. The worst Home value is 0.014930; the worst value across both routes is 0.070946. Every Home primary remains in the first fold, all fonts finish loading and all ten combinations have zero horizontal overflow. The retained Explore phone regression and new Home desktop regression also pass in the final 122-test suite. The [font contact sheet](screenshots/recovery/after/font-fallback-loaded-contact.jpg) shows fallback and loaded views at every required width.

| Width | Final Home CLS | Final Explore CLS |
|---|---:|---:|
| 360px | 0.013796 | 0.002298 |
| 390px | 0.014930 | 0.008710 |
| 768px | 0.013854 | 0.070946 |
| 1280px | 0.007877 | 0.050342 |
| 1440px | 0.006224 | 0.039847 |

## Final cold-load observations

The final [60 cold-cache samples](screenshots/recovery/after/performance.json) were collected on the otherwise idle `9f7be34` production server. Across all four routes and five widths, the maximum observed LCP was 264ms and maximum CLS was 0.070946. Home medians follow; the earlier baseline table uses the same method.

| Home viewport | Median FCP | Median LCP | Median CLS | Transferred bytes | Requests |
|---|---:|---:|---:|---:|---:|
| 360px | 252ms | 252ms | 0.0000 | 305,763 | 27 |
| 390px | 208ms | 208ms | 0.0131 | 307,391 | 27 |
| 768px | 228ms | 228ms | 0.0117 | 309,814 | 29 |
| 1280px | 228ms | 228ms | 0.0000 | 309,255 | 29 |
| 1440px | 228ms | 228ms | 0.0000 | 309,255 | 29 |

These small timing differences are local samples on a shared host and do not establish a causal speed improvement or deployed performance. The source collection remains empty; a future populated collection and hosted account lifecycle require their own measurements. The prior recovery run is retained as [pre-font-fix performance](screenshots/recovery/after/pre-font-fix-performance.json). Earlier [performance history](PERFORMANCE.md) remains separate and unchanged.
