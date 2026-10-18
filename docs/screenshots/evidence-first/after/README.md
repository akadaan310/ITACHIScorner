# Final rendered review set

Verified production app: `a45f4c2`. All five viewport widths use the same heights as the baseline: 360×844, 390×844, 768×1024, 1280×900 and 1440×900. Fourteen core routes produce 70 first-fold JPEGs, five complete Home captures and three open phone/tablet menu captures. Original baseline images are in `../before`; no original images were replaced.

[Capture manifest](manifest.json) · [Checks](checks.json) · [CTA/fold comparison](comparison.json) · [Image hashes](SHA256SUMS)

| Screen | Phone first fold | Desktop first fold |
|---|---|---|
| home | [390px](home-390-fold.jpg) | [1440px](home-1440-fold.jpg) |
| explore | [390px](explore-390-fold.jpg) | [1440px](explore-1440-fold.jpg) |
| learn | [390px](learn-390-fold.jpg) | [1440px](learn-1440-fold.jpg) |
| practice | [390px](practice-390-fold.jpg) | [1440px](practice-1440-fold.jpg) |
| community | [390px](community-390-fold.jpg) | [1440px](community-1440-fold.jpg) |
| session-notes | [390px](session-notes-390-fold.jpg) | [1440px](session-notes-1440-fold.jpg) |
| library | [390px](library-390-fold.jpg) | [1440px](library-1440-fold.jpg) |
| support | [390px](support-390-fold.jpg) | [1440px](support-1440-fold.jpg) |
| join | [390px](join-390-fold.jpg) | [1440px](join-1440-fold.jpg) |
| my-corner | [390px](my-corner-390-fold.jpg) | [1440px](my-corner-1440-fold.jpg) |
| private-notes | [390px](private-notes-390-fold.jpg) | [1440px](private-notes-1440-fold.jpg) |
| settings | [390px](settings-390-fold.jpg) | [1440px](settings-1440-fold.jpg) |
| about | [390px](about-390-fold.jpg) | [1440px](about-1440-fold.jpg) |
| creator-denied | [390px](creator-denied-390-fold.jpg) | [1440px](creator-denied-1440-fold.jpg) |

The complete homepage captures use `home-{width}.jpg`. Fixed phone navigation appears at the original viewport boundary in full-page browser screenshots. The corresponding first-fold files show its actual viewport position.

Each `rendered-audit-{width}.json` contains heading/section coordinates, action inventories, CTA grouping and overflow for all fourteen routes. Local cold-load timing and layout-shift samples are in `performance.json`; settled screenshot layouts are a different measurement.
