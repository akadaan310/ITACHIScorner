# Design system — evidence-first Corner

The [constitution](PRODUCT_CONSTITUTION.md) supersedes the earlier maximalist concept. Keep the existing self-hosted fonts and useful primitives; dormant legacy CSS/art does not authorize its return to public pages.

## Visual rules

Quiet obsidian backgrounds, warm readable text and controlled coral/crimson action. Typography uses the established condensed display face, occasional editorial serif emphasis and Inter body/UI. Arabic uses Amiri with `lang=ar`/`dir=rtl` only after text/source/license/editorial checks. Do not publish unreviewed fixture passages merely to demonstrate typography.

Home gives the creator concept a deliberate masked crop and one Explore questions CTA. The altered owner-supplied image is visibly qualified as a design exploration pending creator approval. It is neither an approved portrait nor documentary evidence. Other page headers lead with the task and readiness state; About may use a contextual crop. No portrait orbit, persistent live ticker, firework animation, star-map navigation, repetitive feature entrances or fabricated social proof.

Use a restrained architectural arch and occasional small celestial divider, not gold-heavy ornament on every card. Public components are `Hero`, `PublicHeader`, `PendingPanel`, a source-result card, shared `SiteHeader`/mobile navigation and compact footer. Legacy demo components are unreachable through public routes.

## Navigation and motion

Home · Explore · Learn · Practice · Community are the five primary destinations; My Corner is secondary. Mobile navigation and a keyboard-accessible dialog expose the same choices. Active state is explicit; skip link and visible focus support keyboard use. Controls target at least44 px. Content must fit 360px without horizontal overflow; the homepage primary CTA belongs in the first fold.

Movement follows actual interaction. No decorative continuous motion is necessary. Respect `prefers-reduced-motion`, readable static rendering without JS, native form behavior and accessible loading/errors. Empty states explain permission/review/readiness in familiar language, without exposing research implementation terms.

## Color, compatibility and validation

Existing Tailwind theme tokens remain available for dormant legacy components; their availability is not a public visual mandate. Coral carries the primary action, subdued surface borders separate content, and status is conveyed in text as well as color. Avoid low-opacity essential text. Axe covers canonical pages; manual screenshot review covers folds, overflow and CTA clarity at 360/390/768/1280/1440. See [UX_AUDIT.md](UX_AUDIT.md), [PERFORMANCE.md](PERFORMANCE.md), [ASSET_PROVENANCE.md](ASSET_PROVENANCE.md) and the screenshot evidence.
