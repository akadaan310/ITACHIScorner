# UX architecture audit V4 — before and after

The **V4 after rendering** restores creator-first identity, five plain destinations, working search, a four-step visitor question journey, a separate practice workbench and a distinct closing creator moment. The local product is more useful while still showing that reviewed sources, hosted accounts, community participation and creator approval are not available or verified. Full before/after evidence follows; screenshots establish local rendering, not a deployed release.

The **before baseline** recovery was visually coherent and truthful, but most destinations explained what was unavailable. It offered one working public question scratchpad and search over an empty reviewed collection; it did not convey a rich creator-led product. Reducing homepage actions further would not address the gap.

## Evidence and scope

Captured 2026-10-18 from a fresh locally served **production build** at `http://127.0.0.1:4000`, baseline branch `feat/v4-creator-first`, source commit `7a8ce5efda461ebab717a03ed1d9c73528f92c9d`. Parent completed fresh npm ci, 110 unit tests and build before starting the server. This audit independently used actual `/usr/bin/chromium` through Playwright, not source inspection alone.

- 23 routes/aliases × 5 widths = **115 rendered route-width records**. Every route has **full-page and first-fold** JPEGs at 360×844, 390×844, 768×1024, 1280×900 and 1440×900.
- Scrolled every full page and awaited image decoding. Captured all six homepage section transitions at every width. Inspected phone and desktop route contact sheets and individual hero/FAQ states with the image-view tool.
- Tapped every mobile menu entry and quick-navigation destination, desktop navigation, source disclosures, all FAQ disclosures; used question review/copy/clear, search, keyboard skip/traversal and reduced motion. Auth submission interception was prepared, but sign-in is unconfigured and **no email input exists in this build**. No real signup/email/remote data write occurred.
- Source hashes, browser version, build ID, timestamps, routes and artifact hashes are in [before manifest](screenshots/v4/before/manifest.json). Measurements are in [rendered audit](screenshots/v4/before/rendered-audit.json), [supplemental interactions](screenshots/v4/before/supplemental-interactions.json) and [settled navigation](screenshots/v4/before/settled-navigation.json).
- Prior original/evidence-first/recovery archives were read only. New evidence is under `docs/screenshots/v4/`; the reusable capture tool is `scripts/capture-v4.mjs`.

## Product gap findings

1. **Creator visibility is weak on phone.** At 390px the sole portrait starts y=674 and ends y=1048. The headline and copy consume the first fold; eyes/name are below the initial view. At 360px the first fold reveals only the very top of her head. At 1440px the portrait is prominent and the hero CTA is clear. Only Home renders a creator image; About, Learn, Studio and Library render none. There is no second editorial creator moment at the end of the story.
2. **Present capability and product promise are out of balance.** Most pages pair a large display title with a pending panel. Learn, Practice and Community each send the visitor to the same homepage desk. That is one useful journey, but does not make three distinct destinations feel meaningful. Empty content must stay honest; the interface can still show usable search, a source-linked walkthrough and owned writing tasks.
3. **The mobile destination hierarchy differs from the requested constitution.** Fixed quick navigation is Home, Explore, Learn, Practice, Community; My Corner sits inside the hamburger. Desktop adds My Corner separately and keeps Home in primary navigation. Use the logo for Home and make Explore/Learn/Practice/Community/My Corner the five plain destinations.
4. **Typography and color still carry the earlier demo.** Oversized condensed all-caps display type and pink/coral CTAs dominate; the serif supplies warmth but creator signature is absent. Ivory source and green desk chapters have useful contrast and rhythm. Move toward controlled crimson/ivory/obsidian while preserving warmth and legibility, rather than making every page the same dark pending card.
5. **Rightful safety states are doing too much narrative work.** Permission, review, unavailable accounts and no lessons recur in many paragraphs. Keep the disclosure and truthful gates; replace repeated promises with concrete current interfaces and clear next steps. There are no fake lessons, debates, viewers, account streaks, reviews or payment claims in the rendered baseline.
6. **Some targets miss the requested 44px minimum.** On Home at phone and desktop the logo link is 34px high, disclosure “Learn more” 13px, inline About link 17px, and footer About/Library/FAQ/Terms are narrower than 44px. These raw rectangles are a manual review list, not an automated WCAG failure claim; inline text links may have target-size exceptions. Menu buttons and major CTAs are comfortably sized.

## Homepage fold-by-fold intent

Fold numbers below are based on heading y divided by viewport height; a section can span multiple folds. Main narrative has six sections, not six physical phone screens.

| Narrative | 390px heading fold / y | 1440px heading fold / y | Current job and gap |
| --- | --- | --- | --- |
| Hero / Itachi | 1 / 175 | 1 / 245 | One Explore primary plus About text link; generic headline precedes creator visibility on phone. |
| Source context | 2 / 1270 | 2 / 1010 | Distinct ivory editorial panel, three working native disclosures; explains standards instead of displaying search or source metadata. |
| Question desk | 3 / 2057 | 2 / 1541 | Real editable, reviewable, copyable visitor draft; deliberately ephemeral, no answer/assessment/save. Strongest tangible interface. |
| Learn + Practice | 4 / 3161; portal headings 5 / 3587,4038 | 3 / 2289; portal headings 4 / 2737 | Contrasting portal cards, but destinations mostly repeat pending material and link back to desk. |
| Community | 6 / 4486 | 4 / 3245 | Clear respectful tone and unavailable discussion state; no actual opt-in surface. |
| Your Corner | 7 / 5089 | 5 / 3703 | Calm ending and one account link; local account unavailable, no real capability preview or second creator story. |

Homepage height: **5975px at 390**, **4257px at 1440**. The narrative lacks the requested separate tangible “how it works”, actual account preview and final creator chapter. It should gain substance, not merely grow longer.

## Actions: tasks versus repetition

| Measure, initial Home state | 390 | 1440 |
| --- | ---: | ---: |
| Main action instances | 12 | 12 |
| Main unique destinations / control identities | 12 | 12 |
| Main repeated instances | 0 | 0 |
| Main navigation links | 6 | 6 |
| Main transient controls | 6 | 6 |
| Initially disabled draft controls (subset of transient) | 3 | 3 |
| Global + main total action instances | 28 | 28 |
| Global + main unique identities | 21 | 20 |
| Global + main repeated instances | 7 | 8 |

The six transient controls are three source disclosures plus Review/Copy/Clear draft. The latter enable when the visitor writes; **they are not dead conversion buttons**. There are no main duplicate destinations. Global duplicates are normal navigation and footer links, especially /about in disclosure, hero secondary and footer. The audit does not classify all repeated navigation as harmful CTAs. The supplied earlier 37-original-action count is prior evidence, not a newly remeasured number in this audit. Existing recovery comparison independently reports the same current 12/12/0/3 homepage counts.

## Page-by-page before gaps

`Actions` is initial main instances / unique / repeated / disabled. Aliases are deliberately represented to document what the visitor actually sees after redirect. Every row has five-width full screenshots; the links select phone and desktop.

| Route | Final route | Height 390 / 1440 | Actions | Rendered finding | Required next product improvement | Evidence |
| --- | --- | ---: | --- | --- | --- | --- |
| `/` | `/` | 5975 / 4257 | 12/12/0/3 | Readable primary CTA; creator arrives late on phone; six chapters mostly explain future availability. | Bring creator/name/mask into first fold; make source search and question-to-notes walkthrough tangible; add distinct closing creator chapter. | [phone](screenshots/v4/before/home-390-full.jpg), [desktop](screenshots/v4/before/home-1440-full.jpg) |
| `/explore` | `/explore` | 1445 / 1213 | 1/1/0/0 | Working search; no published results; one search task. Blank collection is honest, but lacks visible filters/topic structure. | Use verified metadata only, distinguish discovery from permission to excerpt; explain zero-result recovery; add usable filters when backed by data. | [phone](screenshots/v4/before/explore-390-full.jpg), [desktop](screenshots/v4/before/explore-1440-full.jpg) |
| `/learn` | `/learn` | 2440 / 1780 | 2/2/0/0 | Long pending panel plus route back to homepage desk; no portrait, lesson or independent approved resource. | Show a clear present-tense learning route without inventing a creator method; add grounded creator context and actual owned note task. | [phone](screenshots/v4/before/learn-390-full.jpg), [desktop](screenshots/v4/before/learn-1440-full.jpg) |
| `/practice` | `/practice` | 2117 / 1643 | 2/2/0/0 | Pending panel plus homepage writing-desk link; no practice interface on this page. | Put user-authored question/reflection practice here, with review/copy and honest saved-note availability. | [phone](screenshots/v4/before/practice-390-full.jpg), [desktop](screenshots/v4/before/practice-1440-full.jpg) |
| `/community` | `/community` | 2445 / 1767 | 1/1/0/0 | Good consent/moderation principles; no submissions; only action is homepage scratchpad. | Preserve moderation boundaries while making the opt-in path and current participation status explicit. | [phone](screenshots/v4/before/community-390-full.jpg), [desktop](screenshots/v4/before/community-1440-full.jpg) |
| `/me` | `/me` | 1073 / 900 | 1/1/0/0 | Unconfigured account card routes back to empty Explore; no rendered profile, saved-question or note controls. | Explain real free account capabilities and unavailable Auth; retain secure server identity and truthful state. | [phone](screenshots/v4/before/my-corner-390-full.jpg), [desktop](screenshots/v4/before/my-corner-1440-full.jpg) |
| `/about` | `/about` | 2318 / 1674 | 1/1/0/0 | Project explanation dominates; no creator portrait; external public link hub is available. | Lead with sourced creator identity and purposeful portrait; keep independent-gift/permission disclosure concise and visible. | [phone](screenshots/v4/before/about-390-full.jpg), [desktop](screenshots/v4/before/about-1440-full.jpg) |
| `/studio/creator` | `/studio/creator` | 1025 / 900 | 0/0/0/0 | Trusted workspace unavailable; zero main actions; no creator visual identity or review surface rendered. | Provide clear staff access status and purposeful branding; show actual queue only after trusted server authorization. | [phone](screenshots/v4/before/creator-390-full.jpg), [desktop](screenshots/v4/before/creator-1440-full.jpg) |
| `/studio` | `/studio/creator` | 1025 / 900 | 0/0/0/0 | Redirects to /studio/creator and faithfully renders unavailable staff state. | Keep canonical destination and secure access; avoid presenting local roles as staff. | [phone](screenshots/v4/before/studio-390-full.jpg), [desktop](screenshots/v4/before/studio-1440-full.jpg) |
| `/watch` | `/explore` | 1445 / 1213 | 1/1/0/0 | Legacy /watch redirects to Explore; no embedded/live viewing. | Keep official platforms as playback destination; explain discovery-to-source journey. | [phone](screenshots/v4/before/source-390-full.jpg), [desktop](screenshots/v4/before/source-1440-full.jpg) |
| `/afterglow/vault` | `/session-notes` | 1319 / 1168 | 1/1/0/0 | Legacy vault redirects to Session Notes, with no published notes. | Make archive/session relationship understandable through factual metadata and exact approved source links. | [phone](screenshots/v4/before/archive-390-full.jpg), [desktop](screenshots/v4/before/archive-1440-full.jpg) |
| `/session-notes` | `/session-notes` | 1319 / 1168 | 1/1/0/0 | Single empty-state card, next step goes to empty Explore. | Retain zero-content honesty; connect future notes to original timestamped sources and currently usable personal reflection. | [phone](screenshots/v4/before/session-notes-390-full.jpg), [desktop](screenshots/v4/before/session-notes-1440-full.jpg) |
| `/join` | `/join` | 1174 / 927 | 1/1/0/0 | Sign-in unavailable; no form rendered; no email sent. | Keep explicit readiness status; do not imply hosted lifecycle verification from local tests. | [phone](screenshots/v4/before/join-390-full.jpg), [desktop](screenshots/v4/before/join-1440-full.jpg) |
| `/onboarding` | `/join` | 1174 / 927 | 1/1/0/0 | Redirects to /join; no fake browser profile onboarding. | Retain real-account route and add consent/profile journey only when backend is verified. | [phone](screenshots/v4/before/onboarding-390-full.jpg), [desktop](screenshots/v4/before/onboarding-1440-full.jpg) |
| `/library` | `/library` | 1319 / 1082 | 1/1/0/0 | Empty shelf status and Visit Learn; no book preview available. | Offer a clearly labeled preview frame only with approved assets/content; no invented authored book or lessons. | [phone](screenshots/v4/before/library-390-full.jpg), [desktop](screenshots/v4/before/library-1440-full.jpg) |
| `/library/preview` | `/library` | 1319 / 1082 | 1/1/0/0 | Redirects to /library; identical empty shelf. | Keep canonical redirect until a truthful preview exists. | [phone](screenshots/v4/before/book-preview-390-full.jpg), [desktop](screenshots/v4/before/book-preview-1440-full.jpg) |
| `/me/settings` | `/me/settings` | 1073 / 900 | 1/1/0/0 | Unconfigured account notice, same as My Corner; no export/delete UI rendered. | Preserve server checks and remote verification boundary; show current control availability precisely. | [phone](screenshots/v4/before/settings-390-full.jpg), [desktop](screenshots/v4/before/settings-1440-full.jpg) |
| `/me/journal` | `/me/journal` | 1073 / 900 | 1/1/0/0 | Unconfigured account notice; no note form rendered. | Offer secure notes only for authenticated first-party account; distinguish ephemeral draft from saved note. | [phone](screenshots/v4/before/journal-390-full.jpg), [desktop](screenshots/v4/before/journal-1440-full.jpg) |
| `/support` | `/support` | 1409 / 1120 | 1/1/0/0 | No checkout or subscriptions; About project action only. | Retain optional, pressure-free invitation; no unapproved paid tier. | [phone](screenshots/v4/before/support-390-full.jpg), [desktop](screenshots/v4/before/support-1440-full.jpg) |
| `/faq` | `/faq` | 1501 / 1311 | 6/6/0/0 | Six native disclosures; all expanded successfully and explained current boundaries. | Keep semantics; update answers to match delivered functionality and use larger target padding where needed. | [phone](screenshots/v4/before/faq-390-full.jpg), [desktop](screenshots/v4/before/faq-1440-full.jpg) |
| `/privacy` | `/privacy` | 2329 / 1732 | 1/1/0/0 | Legible policy draft including current account limits and old local demo storage disclosure. | Keep behavior accurate; obtain operator/jurisdiction/processor review before public release. | [phone](screenshots/v4/before/privacy-390-full.jpg), [desktop](screenshots/v4/before/privacy-1440-full.jpg) |
| `/terms` | `/terms` | 2037 / 1538 | 0/0/0/0 | Legible development terms, no invented payment or official endorsement. | Keep rights and release boundaries accurate as assets/features change. | [phone](screenshots/v4/before/terms-390-full.jpg), [desktop](screenshots/v4/before/terms-1440-full.jpg) |
| `/reverts` | `/learn` | 2440 / 1780 | 2/2/0/0 | Redirects to Learn; welcoming prose, no reviewed support resources rendered. | Avoid a dead special-purpose route; make reviewed resource availability and personal guidance boundaries clear. | [phone](screenshots/v4/before/new-muslims-390-full.jpg), [desktop](screenshots/v4/before/new-muslims-1440-full.jpg) |

## Interaction and responsive verification

All 115 route-width records ended HTTP 200 after redirects; **zero horizontal overflow**, **zero page errors and console errors** were observed. This does not establish zero errors in authenticated paths or untested remote environments.

- Mobile dialog opens, exposes nine destinations, Escape closes it. All menu, quick-nav and desktop-nav destinations resolve correctly. Immediate URL reads in an early supplemental navigation check preceded client navigation; `settled-navigation.json` corrects these by awaiting the destination URL. They were measurement timing, not broken links.
- Source details and all six FAQ details open. Native semantics preserve keyboard access. The homepage desk preserves exact visitor text through review and clears it on request. Clipboard output was read back successfully with explicit local clipboard permissions. The original immediate empty status sample was asynchronous; the settled supplemental result is authoritative. Capture script now waits for status before sampling.
- Explore submits `?q=listening`, retains search UI and honestly shows “No published questions found.” No fictional result is seeded.
- Sign-in attempt lands on explicit unavailable status at phone and desktop. No form is rendered; no hosted lifecycle, code flow, export/delete or creator editing is verified. Secure unavailable states are correct behavior for this credentialless local build.
- Keyboard first reaches Skip to content, then logo/menu and narrative links in sensible order. Enter on skip moves to #main (scroll y=105), and the next Tab goes directly to Explore a question, skipping global navigation. Chromium leaves activeElement as body for the non-tabindex target; sequential focus still moves correctly into content. The report does not mislabel this as a failed skip link.
- Reduced-motion media is active and no running document animations remain. This audit checks observed baseline behavior, not every possible interaction animation.
- No current Arabic learning content is rendered, so this audit cannot establish Arabic passage shaping quality. No approved curriculum/book/content exists locally.

The fixed mobile quick nav appears at its original viewport position in browser full-page screenshots; those composite images should be read alongside first folds and section-transition captures. Scroll testing was performed, so a bar appearing across a long composite is not itself evidence of a permanent inaccessible content band.

## Comparisons and public deployment observation

Inspected contact sheets:

- [Original → recovery → current phone](screenshots/v4/before/contact-home-history-390.jpg)
- [Original → recovery → current desktop](screenshots/v4/before/contact-home-history-1440.jpg)
- [Phone core journeys](screenshots/v4/before/contact-routes-phone-1.jpg), [creator/account/source](screenshots/v4/before/contact-routes-phone-2.jpg), [join/library](screenshots/v4/before/contact-routes-phone-3.jpg), [settings/support/FAQ](screenshots/v4/before/contact-routes-phone-4.jpg), [legal/aliases](screenshots/v4/before/contact-routes-phone-5.jpg)
- [Desktop Home/Explore/Learn/Practice](screenshots/v4/before/contact-routes-desktop-1.jpg), [Community/account/About/creator](screenshots/v4/before/contact-routes-desktop-2.jpg), [notes/join/library/support](screenshots/v4/before/contact-routes-desktop-3.jpg), [settings/journal/FAQ/legal](screenshots/v4/before/contact-routes-desktop-4.jpg)

Original is much denser and creator-forward, but includes LIVE, Afterglow, Night Atlas and excessive rival tasks. Recovery/current have calm section rhythm and better honesty, but little creator presence beyond the first portrait and many repeated unavailable-product explanations. Current local baseline is visually consistent with archived recovery, as expected from the same source revision.

The parent discovered `https://itachi-scorner.vercel.app` through authorized repository metadata. Captured its Home at 390 and 1440 in separate [public-before manifest](screenshots/v4/public-before/manifest.json). Its rendered UI is the original demo: bright LIVE TONIGHT banner, portrait-first cosmic hero, Afterglow/Night Atlas labels and Home/Search/Live/Sim/Menu bottom navigation. This visibly differs from the fresh local recovery. **Public alias deployment SHA and production Git branch remain unverified in this audit.** The alias is not proof of any feature deployment. The integration report owns subsequent branch/SHA verification.

## After capture and provenance

Captured the frozen V4 implementation on 2026-10-18 at `http://127.0.0.1:4001`, from fresh production build **`PAzNO4-Ap4lMyM9upxacU`**. At capture time HEAD was still base `7a8ce5efda461ebab717a03ed1d9c73528f92c9d` with **uncommitted V4 changes**. The after manifest explicitly labels that state; its 131 source/brand SHA-256 values and build ID identify the actual rendering. The capture-time manifest must not be mistaken for a deployment receipt. After capture, implementation commit `783a0180adb59f47b0393d154bbeb9223c086685` was created; this audit independently verified all 131 recorded hashes against exact `git show` bytes in that commit. See [committed-source receipt](screenshots/v4/committed-source-receipt.json). This establishes source identity after the fact, not a remotely rendered or production deployment. Source hashes were checked unchanged at the end of the complete run.

The after run repeats all **23 routes × five widths = 115 records** and retains **301 initial artifacts**, including full pages, browser checks and interaction states. There were **zero page errors, console errors or horizontal-overflow records**; every final route returned HTTP 200. The [after manifest](screenshots/v4/after/manifest.json), [raw measurements](screenshots/v4/after/rendered-audit.json) and [before/after metrics](screenshots/v4/after/comparisons/before-after-metrics.json) are the primary records. All distinct phone and desktop full-page route contact sheets were inspected with the image-view tool.

### Viewport capture correction

During image inspection, some initial after viewport-only folds and transition screenshots were found to be mid-scroll. The initial capture helper used `scrollTo()` while the product enables smooth scrolling. This is a **capture timing defect**, not a product layout defect. The original images remain preserved; do not use their `*-fold.jpg` or `home-*-section-*.jpg` files to judge the first view. Full-page screenshots, document-coordinate measurements, action counts, response/error records and interaction assertions remain valid.

The authoritative replacement viewport evidence lives separately in [settled views](screenshots/v4/after/settled-views/manifest.json). It sets `behavior: "instant"`, waits two animation frames, asserts actual scrollY against the expected bounded target, and captures with the same source hashes/build. All 115 corrected first folds start at scrollY 0. Seven homepage section transitions are captured at each width with asserted positions. The first-fold history comparison uses those corrected images. This correction is retained explicitly instead of overwriting the initial archive. The reusable capture helper was then corrected for instant scrolling and explicit first-fold position checks. Its final file hash consequently differs from the recorded original execution hash; all 130 product/brand/lockfile hashes remain unchanged. The exact corrective method is retained with the settled-view evidence.

## After product findings

- **Creator in the first view:** the Home portrait at 390px is now y=165, 169×246, compared with y=674, 310×374 before. Her eyes, covered face, readable ITACHI title and primary action are visible together at phone widths. At 1440px the hero portrait is y=189, 458×566. Home also has a second editorial crop near the closing story. About, Learn, Library and Creator Studio gain purposeful placements. This is **six placements across five canonical routes**, all crops of **one owner-supplied unapproved concept composition**, not six photographs or an acquired photo family.
- **Narrative now does distinct work:** creator → search/source standards → interactive question path and desk → contrasting Learn/Practice portals → account capability preview → community boundaries → creator/original channels. The product retains honest empty-source and unavailable-account states without making them the sole content of each destination.
- **Practice is usable now:** four writing prompts, exact-text review/edit, optional self-checks, copy with status, safe failure fallback and clear. It is visitor writing, with no invented religious answer, scoring, feedback or attributed creator method.
- **Learn has three concrete starting points:** explore a question, keep a reading note, or put a question into words. Community clarifies consent and moderation through disclosures. Session Notes supplies a Source/Question/Reflection structure. Library shows a clearly labelled visual book study and reading record, with no authored or purchasable book claim.
- **Accounts remain honestly conditional:** My Corner, Journal and Settings now explain Keep/Choose/Control and offer the current guest writing path. The production audit is unconfigured; it does not show or verify an authenticated profile, saved question, private note, data export/delete lifecycle or actual staff editing. Creator Studio adds identity but remains correctly unavailable/read-only without trusted staff access.
- **Brand is coherent:** crimson, ivory, charcoal and quiet architectural lines replace pink-heavy accents and earlier cosmic jargon. The graphical hand-traced signature appears in header/footer; body/UI remain readable sans with restrained editorial serif. All likeness/signature approvals remain false. No new documentary photo, side-profile/reading photo or alpha cutout is claimed.

The longer narrative is a visible tradeoff: Home grows **5975 → 7764px at 390** and **4257 → 6055px at 1440**. Seven chapters span about **9.2 phone viewport heights** including footer, above the suggested 6–8 physical folds, and about **6.7 desktop viewport heights**. The added length contains usable interfaces and a creator conclusion; it should still be evaluated with real visitors for fatigue rather than treated as automatically successful because more content exists.

## Before/after action taxonomy

| Initial-state measure | Before 390 / 1440 | After 390 / 1440 |
| --- | --- | --- |
| Home main instances | 12 / 12 | 18 / 18 |
| Home main unique identities | 12 / 12 | 17 / 17 |
| Home main repeated instances | 0 / 0 | 1 / 1 |
| Home navigation links | 6 / 6 | 8 / 8 |
| Home search submissions | 0 / 0 | 1 / 1 |
| Home transient controls | 6 / 6 | 9 / 9 |
| Home initially disabled draft controls | 3 / 3 | 3 / 3 |
| All Home + global instances | 28 / 28 | 36 / 35 |
| All Home + global unique identities | 21 / 20 | 27 / 26 |
| All Home + global repeats | 7 / 8 | 9 / 9 |

The nine Home transient controls are **two disclosures, four question-step switches and three initially disabled draft controls**. Their enablement remains tied to visitor writing. The one repeated main destination is `/practice`: a focused next step from the desk and a later editorial portal. Those contextual links are not competing hero actions. `/about#channels` counts separately from `/about` because it is a meaningful anchored destination; a normalized-page analysis would group both under About. Global/footer repetition is kept separate from story tasks.

Practice has **12 initial main affordances**: four prompt switches, three optional checkbox selections, three draft controls and two navigation links. Three draft controls are initially disabled until there is writing or a checklist choice. Checkboxes are included as selections in the after inventory; no before page had such selectors. Text inputs and textareas are recorded through their workflows rather than labelled as extra CTAs. Controls that appear in a later journey step are evaluated in that state, not added to the initial-state total as simultaneous rival CTAs.

Raw target review is substantially better: Home's flagged rectangles fall from eight to one (the skip link). Native checkbox rectangles are 18px but their associated clickable labels are larger. Remaining inline prose links include a 40px wrapped notebook link and a 19px privacy settings link; these are documented rather than treating a raw rectangle heuristic as a formal accessibility failure. Formal accessibility results belong to the separate final QA report.

## After fold-by-fold intent

| Chapter / observed main heading | 390 fold / y | 1440 fold / y | Intended next action |
| --- | --- | --- | --- |
| Creator | 1 / 239 | 1 / 264 | Explore a question; About Itachi secondary. |
| Source/search | 1 / 800 | 2 / 1000 | Search a question; open source standards. |
| Question journey | 2 / 1590 | 2 / 1640 | Write a question, follow source context, label a topic, preview a note. |
| Writing desk | 3 / 2466 | 3 / 2511 | Review/copy visitor writing or move to focused practice. |
| Learn/Practice | 5 / 3554 | 4 / 3134 | Choose a reading path or an actual writing task. |
| Your space | 6 / 4899 | 5 / 4126 | Understand account capabilities and current availability. |
| Community | 7 / 5872 | 6 / 4750 | Understand dignity, consent and moderation boundaries. |
| Creator closing | 9 / 6786 | 6 / 5202 | Meet Itachi through her original channels. |

## Page-by-page result and paired full-page evidence

Counts are main instances / unique / repeated / disabled, initial state. Each paired image contains complete before and after pages at the stated width; redirects remain explicit in the raw records. Phone and desktop contact sheets cover every listed route, including aliases and legal pages.

| Route | Before → after actions | After result and remaining boundary | Paired full pages |
| --- | --- | --- | --- |
| `/` | 12/12/0/3 → 18/17/1/3 | Creator-first seven-chapter story, search, four-step guide, desk and real capability preview; still no reviewed excerpts or live account state. | [390](screenshots/v4/after/comparisons/home-390-before-after-full.jpg), [1440](screenshots/v4/after/comparisons/home-1440-before-after-full.jpg) |
| `/explore` | 1/1/0/0 → 5/5/0/0 | Working query plus reviewed-question/source-video selector, official channel and writing paths; no results or full-channel inventory invented. | [390](screenshots/v4/after/comparisons/explore-390-before-after-full.jpg), [1440](screenshots/v4/after/comparisons/explore-1440-before-after-full.jpg) |
| `/learn` | 2/2/0/0 → 4/4/0/0 | Creator introduction plus three concrete reading/question paths; no course or attributed teaching method. | [390](screenshots/v4/after/comparisons/learn-390-before-after-full.jpg), [1440](screenshots/v4/after/comparisons/learn-1440-before-after-full.jpg) |
| `/practice` | 2/2/0/0 → 12/12/0/3 | Real private guest writing workbench and optional self-review; no automated answer, judgment or account save. | [390](screenshots/v4/after/comparisons/practice-390-before-after-full.jpg), [1440](screenshots/v4/after/comparisons/practice-1440-before-after-full.jpg) |
| `/community` | 1/1/0/0 → 5/5/0/0 | Principles, three consent/moderation disclosures, privacy and practice routes; submissions and mentorship remain closed. | [390](screenshots/v4/after/comparisons/community-390-before-after-full.jpg), [1440](screenshots/v4/after/comparisons/community-1440-before-after-full.jpg) |
| `/me` | 1/1/0/0 → 2/2/0/0 | Actual account availability plus free capability explanation and guest writing fallback; no hosted lifecycle certification. | [390](screenshots/v4/after/comparisons/my-corner-390-before-after-full.jpg), [1440](screenshots/v4/after/comparisons/my-corner-1440-before-after-full.jpg) |
| `/about` | 1/1/0/0 → 1/1/0/0 | Creator-led opening, disclosed concept image and independent-gift provenance, original public hub; no invented biography/quotes. | [390](screenshots/v4/after/comparisons/about-390-before-after-full.jpg), [1440](screenshots/v4/after/comparisons/about-1440-before-after-full.jpg) |
| `/studio/creator` | 0/0/0/0 → 0/0/0/0 | Purposeful avatar and read-only workspace identity; trusted access unavailable, no queue data or editing fabricated. | [390](screenshots/v4/after/comparisons/creator-390-before-after-full.jpg), [1440](screenshots/v4/after/comparisons/creator-1440-before-after-full.jpg) |
| `/studio` | 0/0/0/0 → 0/0/0/0 | Still redirects to canonical /studio/creator with secure unavailable state. | [390](screenshots/v4/after/comparisons/studio-390-before-after-full.jpg), [1440](screenshots/v4/after/comparisons/studio-1440-before-after-full.jpg) |
| `/watch` | 1/1/0/0 → 5/5/0/0 | Still redirects /watch to Explore; playback stays on official platforms. | [390](screenshots/v4/after/comparisons/source-390-before-after-full.jpg), [1440](screenshots/v4/after/comparisons/source-1440-before-after-full.jpg) |
| `/afterglow/vault` | 1/1/0/0 → 2/2/0/0 | Still redirects vault to Session Notes; personal notebook structure replaces a pending-only card. | [390](screenshots/v4/after/comparisons/archive-390-before-after-full.jpg), [1440](screenshots/v4/after/comparisons/archive-1440-before-after-full.jpg) |
| `/session-notes` | 1/1/0/0 → 2/2/0/0 | Source/Question/Reflection structure and private-note/source paths; no published reviewed notes invented. | [390](screenshots/v4/after/comparisons/session-notes-390-before-after-full.jpg), [1440](screenshots/v4/after/comparisons/session-notes-1440-before-after-full.jpg) |
| `/join` | 1/1/0/0 → 1/1/0/0 | Explicit unavailable Auth in audited production configuration; separate configured smoke renders form safely. | [390](screenshots/v4/after/comparisons/join-390-before-after-full.jpg), [1440](screenshots/v4/after/comparisons/join-1440-before-after-full.jpg) |
| `/onboarding` | 1/1/0/0 → 1/1/0/0 | Redirects to real-account Join; no seeded browser membership or fake profile. | [390](screenshots/v4/after/comparisons/onboarding-390-before-after-full.jpg), [1440](screenshots/v4/after/comparisons/onboarding-1440-before-after-full.jpg) |
| `/library` | 1/1/0/0 → 2/2/0/0 | Disclosed concept book frame, original composition crop and reading-record workflow; no authored/endorsed/purchasable book. | [390](screenshots/v4/after/comparisons/library-390-before-after-full.jpg), [1440](screenshots/v4/after/comparisons/library-1440-before-after-full.jpg) |
| `/library/preview` | 1/1/0/0 → 2/2/0/0 | Redirects to Library; same clearly labelled study, no publication claim. | [390](screenshots/v4/after/comparisons/book-preview-390-before-after-full.jpg), [1440](screenshots/v4/after/comparisons/book-preview-1440-before-after-full.jpg) |
| `/me/settings` | 1/1/0/0 → 2/2/0/0 | Explains availability and capabilities; authenticated account controls not rendered or end-to-end tested here. | [390](screenshots/v4/after/comparisons/settings-390-before-after-full.jpg), [1440](screenshots/v4/after/comparisons/settings-1440-before-after-full.jpg) |
| `/me/journal` | 1/1/0/0 → 2/2/0/0 | Explains current notes availability and guest writing fallback; ephemeral text is never silently saved to an account. | [390](screenshots/v4/after/comparisons/journal-390-before-after-full.jpg), [1440](screenshots/v4/after/comparisons/journal-1440-before-after-full.jpg) |
| `/support` | 1/1/0/0 → 1/1/0/0 | Warm optional support narrative; no payment, subscription, tier or checkout. | [390](screenshots/v4/after/comparisons/support-390-before-after-full.jpg), [1440](screenshots/v4/after/comparisons/support-1440-before-after-full.jpg) |
| `/faq` | 6/6/0/0 → 6/6/0/0 | Six functioning native disclosures retain honest product boundaries. | [390](screenshots/v4/after/comparisons/faq-390-before-after-full.jpg), [1440](screenshots/v4/after/comparisons/faq-1440-before-after-full.jpg) |
| `/privacy` | 1/1/0/0 → 1/1/0/0 | Responsive policy draft with accurate limits; operator/jurisdiction/legal review remains a release requirement. | [390](screenshots/v4/after/comparisons/privacy-390-before-after-full.jpg), [1440](screenshots/v4/after/comparisons/privacy-1440-before-after-full.jpg) |
| `/terms` | 0/0/0/0 → 0/0/0/0 | Responsive concept terms; creator rights and release gates remain explicit. | [390](screenshots/v4/after/comparisons/terms-390-before-after-full.jpg), [1440](screenshots/v4/after/comparisons/terms-1440-before-after-full.jpg) |
| `/reverts` | 2/2/0/0 → 4/4/0/0 | Redirects to Learn and welcoming starting-out portal; no fabricated introductory course or mentor availability. | [390](screenshots/v4/after/comparisons/new-muslims-390-before-after-full.jpg), [1440](screenshots/v4/after/comparisons/new-muslims-1440-before-after-full.jpg) |

## Interaction proof and privacy

The after browser audit successfully exercised at both 390 and 1440:

- All four Question → Source → Related → Notes states, with an explicitly QA-labelled visitor question, selected Dialogue label, exact retention when returning to Question, no silent transfer to the desk and empty state after refresh. [Question](screenshots/v4/after/journey-1-question-390.jpg), [Source](screenshots/v4/after/journey-2-source-390.jpg), [Related](screenshots/v4/after/journey-3-related-390.jpg), [Notes](screenshots/v4/after/journey-4-notes-390.jpg).
- All four practice prompts; writing and all optional self-checks; review focus on the heading; exact text retained through edit; copied text read back from the local clipboard with explicit permissions; simulated clipboard denial retaining the draft and giving manual-copy guidance; clear resets draft/checks; refresh clears the draft. [Editing](screenshots/v4/after/practice-editing-self-checks-390.jpg), [Review](screenshots/v4/after/practice-reviewed-390.jpg), [Copied](screenshots/v4/after/practice-copied-390.jpg), [Denied](screenshots/v4/after/practice-copy-denied-390.jpg), [Cleared](screenshots/v4/after/practice-cleared-390.jpg).
- **Zero non-GET network writes** during the question/practice workflows and **zero localStorage keys before/after**. This is observed guest-browser behavior, not proof of every possible hosted request or backend policy.
- All mobile menu entries, five quick-nav destinations, five desktop destinations, Escape close, Home source disclosures and all FAQ disclosures. URL assertions await the actual destination. Skip-link Enter followed by Tab goes directly to the hero Explore action. Reduced-motion media is honored with no running document animations.

[Additional control checks](screenshots/v4/after/supplemental-controls/manifest.json) also expand every Explore/Learn/Library/Community disclosure, switch the source-video selector, submit a filtered search, confirm the corrected catalogue-uncertainty copy, use keyboard Enter on a Journey step, Space on a practice self-check and Enter to review. Practice reduced-motion is also checked. The source filter means **videos cited by reviewed questions**, not a complete public inventory.

The main production build still renders no sign-in form because its Auth configuration is unavailable. The separate [configured/fallback smoke](screenshots/v4/configured-fallback/manifest.json), captured by the parent, uses the existing intended project URL and publishable key in an isolated **Next development server at :4002** with portraits disabled. It records the real signed-out form and browser interception **before** local auth submission; no provider email or account was created. Anonymous export returns 401 and `private, no-store`. It does **not** verify email delivery, callback, OTP, persistent session, authenticated notes, export/delete or trusted staff lifecycle.

## No-portrait fallback and identity limits

Independently inspected the configured smoke's [Home phone](screenshots/v4/configured-fallback/home-390-full.jpg), [Home desktop](screenshots/v4/configured-fallback/home-1440-full.jpg) and [About phone](screenshots/v4/configured-fallback/about-390-full.jpg). Architectural frames, readable ITACHI text and a concise “image withheld” caption preserve the composition. Home has two intentional fallbacks; About/Learn/Library/Studio have one each. The smoke records no portrait images and no overflow at both widths. This is development-rendering evidence of the fallback, not another production or remote-auth verification.

The unapproved composition remains the only portrait source. No distinct authentic editorial photo family is available; images, name and signature require creator permission before public release. The design remains intentional with portraits hidden. The signature is a disclosed path study, not an identified font or authorized logo. See [brand provenance](BRAND_IDENTITY_V4.md).

## Five-second mobile comprehension — expert heuristic only

This is an expert inspection of the first view and labels, **not a user test, participant study or measured five-second success rate**. The five labels fit at 360/390px, keep familiar language, and map as follows:

| Label | Likely first expectation | Rendered fit and limit |
| --- | --- | --- |
| Explore | Find questions and original sources | Search/filter and original-platform routes fit; empty reviewed collection is stated. |
| Learn | A starting point for understanding | Three clear paths fit; the course disclosure must remain visible because some visitors may expect lessons. |
| Practice | Do a small task | Real writing workbench meets that expectation immediately. |
| Community | People, norms and participation | Consent/moderation content fits; closed submissions are clearly stated, though the label can still imply active discussion. |
| My Corner | My notes, saved items and account | Capability/availability explanation fits; configuration prevents actual account tasks in this production audit. |

Home is available through the labelled signature logo; the five mobile destinations now match desktop. Secondary About Itachi, Book / Library, Support and Creator Studio are discoverable from the menu/footer. The hero identifies the creator and the kind of space before asking for Explore. Real visitor comprehension and long-scroll fatigue remain untested.

## Evidence index and remaining limits

- [Phone full-home history](screenshots/v4/after/comparisons/home-390-history-full.jpg), [desktop full-home history](screenshots/v4/after/comparisons/home-1440-history-full.jpg); [corrected phone first-fold history](screenshots/v4/after/comparisons/home-390-history-fold.jpg), [corrected desktop first-fold history](screenshots/v4/after/comparisons/home-1440-history-fold.jpg).
- Complete after route sheets at [390 group 1](screenshots/v4/after/comparisons/after-routes-390-1.jpg), [2](screenshots/v4/after/comparisons/after-routes-390-2.jpg), [3](screenshots/v4/after/comparisons/after-routes-390-3.jpg), [4](screenshots/v4/after/comparisons/after-routes-390-4.jpg), [5](screenshots/v4/after/comparisons/after-routes-390-5.jpg), [6](screenshots/v4/after/comparisons/after-routes-390-6.jpg); desktop [1](screenshots/v4/after/comparisons/after-routes-1440-1.jpg), [2](screenshots/v4/after/comparisons/after-routes-1440-2.jpg), [3](screenshots/v4/after/comparisons/after-routes-1440-3.jpg), [4](screenshots/v4/after/comparisons/after-routes-1440-4.jpg), [5](screenshots/v4/after/comparisons/after-routes-1440-5.jpg), [6](screenshots/v4/after/comparisons/after-routes-1440-6.jpg).
- No approved transcript-derived question, course, religious answer, book or authenticated first-party account state is fabricated in these renders. The audit is not a corpus-completeness finding, scholarly review, hosted RLS certification or production deployment receipt.
- The separately captured public Vercel alias still supplied original-demo evidence; it was not used as proof of V4. Consult the integration record for actual branch/SHA verification and delivery status.
- This visual audit observed no blocking product layout or guest-interaction defect in the frozen build. Formal full-app accessibility, performance, tests and release gates are reported by the separate QA/integration work and must not be inferred solely from screenshots.
