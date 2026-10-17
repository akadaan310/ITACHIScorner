# Release gates

Nothing below is optional. Until every gate passes, the site stays a private concept demo with the disclosure visible.

## 1. Creator consent

- [ ] Written approval from Itachi for the concept, the name "Itachi's Corner", and every use of her name and branding.
- [ ] Flip `creator.endorsed` only after approval, then soften the disclosure copy with her agreement.
- [ ] **Portrait:** replace `public/brand/itachi-masked-portrait.jpg` (cropped from the project owner's low-resolution v1 mockup, UI overlays removed) with an original, high-resolution file supplied or approved by her. Set `creator.portrait.creatorApproved = true` only then.
- [ ] Confirm the mask embroidery and any background artwork carry no third-party IP (the brief forbids Naruto/Uchiha emblems).
- [ ] Approved logo/wordmark (the current hex-star mark is original concept art).

## 2. Religious and editorial review

- [ ] Every Qur'an passage verified against Tanzil by a qualified editor (`reviewStatus` → `editor-reviewed`).
- [ ] Translation licence confirmed for Saheeh International, or swap to a licensed translation.
- [ ] Reverts HQ answers reviewed by a qualified scholar; keep the "not a ruling" notice.
- [ ] Trivia and Simulator content reviewed for accuracy and fair representation of other faiths.

## 3. Truthful data

- [ ] Replace sample events, episodes and catalogue rows with sourced entries (public replay URLs; timestamps only when sourced).
- [ ] Keep `Sample` / `Demo` labels on anything still illustrative.
- [ ] No viewer counts, conversion counts or follower metrics unless sourced and approved. Shahadah Stories only with explicit, revocable consent.

## 4. Integrations (if any)

- [ ] Platform-compliant API access, creator authorisation, member OAuth consent, a privacy impact assessment, retention limits and deletion on request.
- [ ] Never infer identity or attendance from a typed handle.

## 5. Accounts, privacy and legal

- [ ] Real auth with no fake OAuth; data export/delete wired to the backend; a published privacy policy and terms reviewed by counsel.
- [ ] Moderation staffing for the wall and discussion before enabling them publicly.
- [ ] Billing only after approval, with no paywalled basic learning, no pay-to-win and no loot boxes.

## 6. Quality

- [ ] `npm run lint && npm run typecheck && npm test && npm run build && npm run test:e2e` green.
- [ ] axe: zero serious or critical issues on every route (enforced in e2e).
- [ ] Re-validate official links against the public hub.
- [ ] Remove `robots: noindex` only at launch.
