# Recovery visual and interaction review

Independent review on 2026-10-18, using the actual locally served production app at `http://localhost:3700`, installed Playwright Chromium and direct `view_image` inspection. This review covers design, content readiness, navigation hierarchy and the visitor-owned writing interaction. The complete automated suite and hosted checks belong to [RECOVERY_VERIFICATION.md](RECOVERY_VERIFICATION.md).

## Review identity

At the start of this review, Git HEAD was `b5cc1f4ef9d396acc114e3668a5d989451aa10ef`; the recovery UI was still uncommitted. The rendered app was therefore a production build of a working tree, not a claim that this commit already contained the reviewed UI.

The initial reviewed source hashes were:

| File | SHA-256 |
| --- | --- |
| `src/app/page.tsx` | `6ac82ca0aaaa475f0433c8caad6cc4d1dee6afc9343e5799b8c32f66f38e7ed6` |
| `src/components/hero.tsx` | `fa51f4133cac23eebf2adfcfde3123b5c8118574b601375e3c055bb7bc23ea42` |
| `src/components/question-desk.tsx` | `c56b045a4723399d6c4b875d66cdab383a2a0117a9aa79efe980f4a2cc5e8183` |
| `src/app/globals.css` | `76240a1fc752b52f703e84991c171bed06ff7081d43b548ef0c1a5cc3a2d2e67` |
| `src/app/learn/page.tsx` | `ced921c00a54aaa838295dfec5cbdcbc9343b5be09a78b31be3e7e0fc89d997c` |
| `src/app/practice/page.tsx` | `def1eeb4d05b3c836bccda23848d218c92e4855f455ec9178d4a169210892f35` |
| `src/app/community/page.tsx` | `b16e8e775ad9fd53082d6c93439e806ffc62031b861927dc2e80a63b84525bb2` |

Two focused issues were reported and corrected during this review. The final issue verification below identifies the revised committed source and production build separately from this initial working-tree pass.

## Design assessment

The homepage now has a substantive scroll story: creator invitation → source standards → a working personal writing desk → distinct Learn and Practice pathways → Community principles → private My Corner. The story recovers discovery without republishing fictional questions, lessons, people, events or teaching claims.

The first fold keeps the evidence-first hierarchy. There is one strong crimson Explore a question action and one quiet About link; no orbit of clickable destinations or permanent Live bar. Header identity, the welcome sentence and the single qualified portrait make the creator context clear. The portrait is not repeated farther down the page.

The cream source stage, deep green writing space, restrained paired pathways and crimson community stage supply meaningful changes of pace. Large typography, whitespace and the architectural line motif make the page expressive while each stage remains legible. The surfaces correspond to different visitor tasks, rather than decorating identical repeated cards.

The source disclosures are useful progressive disclosure: the collapsed labels stay scannable, and keyboard opening reveals original-context, permission and review explanations. They explain a real publication standard while the collection is empty. They do not impersonate evidence or become an alternative curriculum.

The desk is immediately useful because it works on the visitor's own words. Its privacy statement appears before the fields, its boundaries sit beside the tool, and the preview explicitly says nothing was answered, assessed or saved. Review changes presentation, not the meaning of the visitor's writing. Edit, copy and clear are ordinary actions with readable labels. The blank state's three disabled buttons accurately signal that there is nothing to act on yet.

Learn, Practice and Community now explain useful current behavior as well as their gates. The actual rendered Learn page says no course exists; Practice says source-based exercises are unavailable and offers the personal desk; Community says submissions and mentorship are closed and attributes its principles to this independent concept. Each offers a real route back to the desk without a pretend lesson, answer or public submission.

No further important clutter or visual hierarchy issue was found in the reviewed settled layouts. Publication remains gated: the portrait/name/identity need creator approval, the corpus remains empty, and hosted account lifecycle checks cannot be inferred from this local review.

## Five-width observations

All five required Home viewports were browsed and directly inspected at their first fold, full scroll, source stage, writing desk, pathways, community and closing invitation. Each source disclosure, draft review/edit/clear and copy-failure behavior was exercised at all five widths. The mobile menu was exercised at 360, 390 and 768px. Learn, Practice and Community were independently rendered and inspected at 390 and 1440px; the QA archive covers all required route widths.

| Viewport | Page height before focused fix | Hero primary bounds | Layout observation |
| --- | ---: | --- | --- |
| 360×844 | 6108px | y=528–576 | Clear first-fold action; stacked stages remain readable; desk action wrapping exposed the feedback issue below. |
| 390×844 | 5975px | y=530–578 | Comfortable one-column rhythm; the portrait follows the invitation; tool preview has visible focus and selectable own text. |
| 768×1024 | 5467px | y=559–607 | Spacious stacked source/desk sections and two distinct pathway columns; no cramped three-column explanatory prose. |
| 1280×900 | 4257px | y=620–668 | Balanced two-column hero/source/desk; Learn and Practice align without repeated primary buttons. |
| 1440×900 | 4257px | y=620–668 | Rich full-page progression with one portrait and restrained geometry; closing My Corner remains a separate private-space invitation. |

Every required Home width returned HTTP 200 with zero horizontal overflow and no browser page errors. The adjacent portrait qualification remained **Design exploration · creator image approval pending**. The visible unaffiliated notice remained present. These are settled local production observations, not hosted performance or real-member claims.

## Action categories

The count includes visible controls within `main` and excludes shared navigation, the footer, the unaffiliated disclosure link and the fixed mobile bar. Fields are counted separately from actions. Disabled controls remain visible affordances, not currently available operations.

| Category | Instances | Unique | Repeats | Initial readiness |
| --- | ---: | ---: | ---: | --- |
| Contextual navigation | 6 | 6 | 0 | All six links work as navigation |
| Source disclosures | 3 | 3 | 0 | All three can open/close |
| Transient draft actions | 3 | 3 | 0 | All three disabled until the visitor enters non-whitespace text |
| Form submissions | 0 | 0 | 0 | No Home submission or server answer flow |
| Writing fields | 2 | 2 | 0 | Question and optional reflection; not CTA instances |

The six navigation destinations are `/explore`, `/about`, `/learn`, `/practice`, `/community` and `/me`. The three local actions are Review/Edit draft, Copy draft and Clear draft; Edit replaces Review in the same state-dependent control. Three disabled controls are included within that category, not added again to a twelve-control headline total.

This intentionally separates navigation variety from local interaction. The recovery is not assessed by reaching a preferred CTA total. Its meaningful improvement is that each route has context and the visitor can do something honest before corpus material is ready.

## Interaction observations

- Native source disclosures open by keyboard, show an obvious focus outline and explain their actual purpose. Their plus indicator changes when open.
- After state updates settle, keyboard Review focuses the labelled draft group; Edit returns focus to the question field; Clear empties both fields and returns focus to the question field at all five widths. The preview preserves the visitor's line breaks and exact words, with normal text selection available.
- A forced clipboard rejection gives an honest live status: **Couldn't copy your draft. Your words are still here; select and copy them manually.** The words remain editable/selectable. The 360px visual visibility defect in that feedback was reported below.
- The menu opens as a native modal, focuses Close menu, locks body scroll and displays all nine menu destinations. Escape restores the Open menu focus and body scrolling at phone/tablet widths.
- The inspected browser contexts requested reduced motion. The stylesheet disables meaningful transition/animation duration and smooth scrolling for that preference; the story does not depend on motion.

## Demonstrated issues and disposition

1. **Important: copy outcome hidden by phone navigation at 360px.** With a draft entered, keyboard Review → Edit → Copy and a forced clipboard rejection produced a status box at y=772.5–826.5 in an 844px viewport. The fixed navigation began at y=781, leaving only 8.5px of the box above the bar; its actual message was not readable without a further scroll. Because the draft is temporary, a visitor could leave assuming copying succeeded. The failure text existed and was announced; this was a visual feedback visibility defect. Temporary independent evidence: `/tmp/itachi-recovery-visual-review/copy-failure-evidence-360.png` and the same outcome after manually revealing it, `/tmp/itachi-recovery-visual-review/copy-failure-visible-360.png`.
2. **Minor: missing decorative arrow glyph in Review/Edit.** The literal `↗` inside the desk action rendered as a small missing-glyph box in direct captures while the existing SVG arrows elsewhere rendered correctly. Temporary independent evidence: `/tmp/itachi-recovery-visual-review/draft-review-390.png`. A decorative SVG is the appropriate consistent affordance.

The parent assigned focused corrections for both. No UI source was edited by this reviewer. The revised production verification below establishes their resolution; the pre-fix captures remain issue evidence rather than proof of the fix.

## Final production issue verification

Both reported issues were independently rechecked against the rebuilt production server on port **3800**, source commit **`22cd2a69b12ead621a6bcb608315d8658753b49e`**, build ID **`IicSNDd8EEfp-Y_jT8Nia`**. The seven reviewed UI source files had no uncommitted changes. This focused pass verified the demonstrated defects instead of repeating the entire functional suite.

- **Copy outcome visibility: resolved.** At 360×844 with reduced motion, the same denied-copy sequence now placed the complete status at y=709.5–763.5, above the fixed navigation starting at y=781. The Copy draft button retained focus and the visitor's text remained intact. The normal-motion scenario also displayed the complete outcome above navigation. Direct image inspection confirmed the actual explanatory message was readable, rather than relying only on an element-presence assertion.
- **Decorative arrow: resolved.** Review/Edit now renders the existing SVG Arrow, with no literal arrow character. Direct image inspection shows the correct arrow beside Edit draft and Review draft; no missing-glyph box remains.

Independent final proof: [visible 360px copy failure](screenshots/recovery/after/review-copy-failure-360-reduce.png) and [rendered SVG arrow](screenshots/recovery/after/review-arrow-360-reduce.png). These screenshots contain only the reviewer's generic QA visitor input, **My own question, with room to think.** and **My own reflection.** Neither sentence is creator content, a transcript extract or a published source question.

The source changes since the initial pass relevant to these findings are identified by final SHA-256 values: `src/components/question-desk.tsx` **`c8ea1b19dca42b2801ce19400b810b5675b5d7bb9e1693e081e298ecd9d58339`** and `src/app/globals.css` **`7d87bfd4513c9c5674b129108b9f72d5175374c09cfac36c9acde089e93956c6`**. The page, hero and three gated-route file hashes remain those listed above.

The independent visual/design review is **accepted with both reported issues resolved**. No important unresolved issue remains in this reviewed scope. This is engineering acceptance for an undeployed concept, not creator endorsement, corpus publication approval or hosted account verification.

The final QA screenshot archive and its source/build manifest are linked from [Recovery review evidence](screenshots/recovery/README.md). It preserves the fresh foundation baseline separately from recovery captures and comparisons. Temporary initial reviewer images are not substitutes for that canonical archive.

## Final font-loading recheck — `9f7be34`

A later delayed-font check exposed hero min-content grid expansion at 1280px. The scoped metric-adjusted fallback and stable grid tracks were independently checked on the rebuilt production app at all five widths. Fallback text remains readable without clipping, the Explore action stays in every first fold, and loaded hero bounds match the previously accepted composition. Home delayed-font CLS ranges from 0.0071 to 0.0131 in this recheck; the separate full QA probe records its own samples. [Fallback and loaded composition contact sheet](screenshots/recovery/after/font-fallback-loaded-contact.jpg).

The prior content, interaction hierarchy and copy-feedback findings remain resolved. This font-only correction adds no new content, action, portrait or motion. The final production capture manifest and performance record identify the current source/build and distinguish preserved earlier observations.
