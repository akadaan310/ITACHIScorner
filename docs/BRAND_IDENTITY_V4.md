# Itachi identity study — V4

Status: **independent concept, creator approval false**. This package is a reviewable lettering study and restrained application system. It does not identify a font, establish ownership or licensing of the creator's name or embroidery, or assert endorsement. Keep `creator.endorsed` and `creator.portrait.creatorApproved` false until written approval exists. The site's existing concept disclosure remains necessary.

## What the reference actually shows

All three owner-supplied reference JPEGs were inspected: the channel screenshot, the two-thumbnail mask screenshot, and the lettering close-up. The embroidery is small crimson connected cursive, with a looped capital I, short t crossbar, curved lowercase joins and a slightly rising baseline. The headphone-stream thumbnail and its close-up are horizontally mirrored; the outdoor thumbnail and channel screenshot read normally.

Orientation was cross-checked on 2026-10-18 against public material linked from the official hub `https://linktr.ee/dawahxdialogues`: its Open Graph image and its cached YouTube channel avatar URL. The hub's YouTube link identifies `https://www.youtube.com/@dawahxdialogues`; its JSON-LD identifies channel `UCCGfMjDueUZ7PhrZHjcFnGw`. Those images show the script in normal reading direction. These observations establish an orientation reference, not production image rights or channel ownership beyond the public hub linkage.

The SVG follows visible loop shapes and proportions, with optically simplified centerlines. Low resolution, cloth perspective, partly hidden final letters and compression prevent an exact embroidery reconstruction. Ambiguous joins are conservative interpretations. It is explicitly a **hand-traced study**, not a recovered original logo. There is no generated font, scratch outline, underline flourish, star, diamond, anime crest or copied background insignia in the vector.

The source-versus-reproduction raster specimen remains privately at `/workspace/itachi-private-docs/v4-brand/source-vs-reproduction.png`. It contains cropped source pixels for comparison and must not be copied into production or public Git. The public application specimen contains only the new vector paths, typography labels and color swatches. The original reference files remain unchanged.

## Asset inventory

All paths below are under `public/brand/v4/` and therefore use `/brand/v4/` in the app.

| File stem | Content | Formats | Geometry |
| --- | --- | --- | --- |
| `itachi-signature-study` | Transparent crimson `#BD2942` path study | SVG, PNG, WebP | SVG `334 × 128` viewBox; raster `1336 × 512` |
| `itachi-signature-ivory` | Same paths, transparent ivory | SVG, PNG, WebP | Same |
| `itachi-signature-dark` | Brighter crimson `#DF3C4A` on obsidian | SVG, PNG, WebP | Same |
| `itachi-signature-light` | Deep crimson `#A61931` on ivory | SVG, PNG, WebP | Same |
| `favicon-study` | Capital I detail on obsidian; conceptual favicon | SVG, PNG, WebP | `128 × 128` |
| `brand-application-specimen` | Technical dark/light application and palette sheet | SVG, PNG, WebP | `1440 × 900` |

Signature aspect ratio: **2.609375:1**. The standalone mark is a graphical wordmark; UI labels must remain in readable sans. Do not fill an entire hero with the script. Use it around 86–140 CSS pixels wide in headers or small editorial signatures; show normal readable “Itachi's Corner” in the accessible name. The favicon deliberately isolates a detail from the same capital path rather than inventing another emblem.

Every signature SVG has `role="img"`, a `<title>` and `<desc>`, explicit bounds, and no external resource, font, script or embedded bitmap. When referenced through `<img>`/Next Image, give the element a useful `alt`; nested SVG descriptions are not a substitute for the HTML image's accessible name. When adjacent visible text already names the home link, use `alt=""` to avoid repetition. Mark-only home links need `aria-label="Itachi's Corner — Home"` on the link. Do not use the logo as body text.

```tsx
<img
  src="/brand/v4/itachi-signature-ivory.svg"
  width={110}
  height={42}
  alt="Itachi"
/>
```

## Palette and typography

| Role | Value | Application |
| --- | --- | --- |
| Obsidian | `#0B0B0D` | Main surface |
| Charcoal | `#171719` | Quiet panels |
| Crimson | `#BD2942` | Controlled identity/accent areas |
| Ivory | `#F1EADF` | Main readable text / light specimen |
| Dark-surface signature | `#DF3C4A` | Brighter small graphical mark |
| Light-surface signature | `#A61931` | Deep graphical mark |

These are identity swatches, not blanket approvals for every text/background combination. Body text uses ivory on dark surfaces. Verify interactive text and focus contrast in the rendered application. Keep borders quiet and avoid neon outlines or decorative glow fields. Use restrained architectural arches/geometric lines as a fallback; do not copy the avatar's anime insignia into new brand assets.

Existing installed typography supplies Inter for navigation/body UI, Fraunces for restrained editorial headings and Amiri for reviewed Arabic content. The script is paths, never a body typeface. Arabic content must preserve shaping and appropriate language/direction metadata; this brand task introduces no religious quotations or teaching.

## Portrait evidence and truthful limits

The repository has **one owner-supplied concept portrait composition**, `public/brand/itachi-masked-portrait.jpg` (732 × 736, JPEG, no alpha). It visually matches the underlying masked portrait composition in the official-hub-linked avatar. Its original photographic/compositing provenance and production rights have not been established. Keep its description as an owner-supplied design exploration; do not describe it as newly acquired documentary photography.

No distinct side-profile/streaming original, reading portrait, licensed editorial portrait family or genuine transparent cutout was available in the authorized workspace. Platform screenshots are references, not clean production photo assets. The public avatar is not automatically licensed for reuse. No replacement portrait, uncovered facial detail, fake scene, counterfeit book cover or fake alpha cutout was generated. The PNG/WebP assets in this package are **lettering derivatives**, not portrait cutouts.

Purposeful placements can reuse this single composition with different CSS crops while remaining honest about the source count. The asset files do not claim four or five unique photographs.

| Placement | Role and crop guidance | Approval/fallback |
| --- | --- | --- |
| Home hero | Main visual anchor; use a modest 3:4 frame, `object-fit: cover`, around `58% 45%` positioning; preserve both eyes and covered face | Concept disclosure; architectural frame and readable name if portraits hidden |
| About Itachi | Secondary editorial context; square or 4:3 crop of the same composition, no pretend new setting | State reuse if discussed; same no-portrait option |
| Explore/source context | Small creator identity beside official-source links; no fabricated source quote | Use readable name and signature if image would repeat excessively |
| Creator Studio | Small square avatar/header identity, not a testimonial or new creator account | No untrusted role implication; plain name fallback |
| Library/book preview | Signature in a clearly labelled concept preview frame; portrait optional, no authorship/endorsement claim | Prefer signature-only frame until book approval |

Responsive image guidance: reserve dimensions to prevent layout shift; main portrait `sizes="(max-width: 767px) 88vw, (max-width: 1279px) 42vw, 420px"`; small avatars use their actual fixed size rather than full-width downloads. At each breakpoint verify that mask, eyes and lettering remain in frame. Preserve a useful alt such as “Owner-supplied concept portrait of Itachi with black head covering and crimson mask lettering”; keep approval disclosure visible elsewhere rather than putting the entire rights explanation into alt text.

The product must support hiding unapproved portrait imagery through configuration. An intentional architectural frame, typographic name and signature can carry the layout. This task does not flip creator approval or alter the creator configuration.

## Production boundary and evidence

Owner instruction explicitly authorized the hand-traced SVG and technical raster specimen. Technical rasterization used Sharp from the project's installed dependencies; no image model or custom portrait manipulation was used. No remote reference pixels are included in `public/brand/v4/`.

Private study directory: `/workspace/itachi-private-docs/v4-brand/`. It retains the generation source, orientation-corrected technical crop, public-hub reference downloads, source comparison and a provenance/verification JSON. Those files are research evidence, not a licensed asset pack. Before any creator-approved launch, obtain the actual embroidery/logo original and suitable high-resolution portrait originals with their usage permissions.

## Final V4 application

The shared header/footer wordmark uses `itachi-signature-dark.svg` for brighter crimson on dark surfaces. `src/app/icon.svg` now uses the same `favicon-study.svg` paths; manifest/theme colors are obsidian. The shared `CreatorPortrait` component reserves dimensions for hero, editorial, About, Learn, book-preview and Studio-avatar crops. These are six placements of the same single concept composition. They are not six newly acquired photos.

`NEXT_PUBLIC_CREATOR_PORTRAITS=false` withholds every concept portrait. A separate configured development smoke captured intentional name/architectural fallbacks at phone and desktop; [manifest](screenshots/v4/configured-fallback/manifest.json). The production five-width audit captures the disclosed concept-image configuration. Neither configuration changes creator approval.
