# Homepage recovery decision map

Reviewed 2026-10-18 against the integrated evidence-first foundation (`674668b`), the controlling recovery handoff, the current Home/Hero/Shell source, the preserved evidence-first screenshots, and the fresh locally served foundation production app on port 3600. This records the initial recovery design; the final implementation inventory is added after recovery verification.

## What works now

- The five primary destinations use plain public names: Home, Explore, Learn, Practice and Community; My Corner is secondary account navigation. Legacy redirects preserve old URLs without publishing their demo experiences.
- The hero has a visible Explore action at every required first fold, one contextual About link, one portrait and an adjacent approval qualification. The permanent Live bar and competing live actions are gone.
- Empty collections stay empty. Explore searches the publication-gated read model; Learn and Practice explain their current readiness. Public pages do not render fictional source cards, course material, simulated members or debate scores.
- Account features have real server authorization and private ownership boundaries. Their interface distinguishes configuration absence from sign-in and provider errors. Notes, saved approved questions, export and deletion must retain those boundaries.
- The header dialog uses native modal behavior, body scroll locking, a labelled close control and focus restoration. Its actual keyboard/touch behavior must be retained and checked in the fresh production browser pass.

## What is blocked, and why

| Surface | Useful now | Requires authentic corpus and review | Requires creator/operational approval |
| --- | --- | --- | --- |
| Explore | Type a question, run a real search, understand the empty collection | Original conversations, exact source moments and approved summaries | Source/excerpt publication rights |
| Learn | Understand readiness; find the welcoming New Muslims section | Substantive lessons and learning dependencies | Creator attribution and qualified review |
| Practice | Work on the visitor's own wording without an answer, score or claimed teaching method | Itachi-derived scenarios, exercises and feedback | Creator/editorial approval of practice content |
| Community | Read participation principles and moderation readiness | Source-linked conversation context where useful | Moderation staff, member consent and publication readiness |
| My Corner | Real configured sign-in, own notes/preferences and privacy controls | Saving approved questions; future lesson progress | Hosted email/member lifecycle verification; administrative deletion configuration |
| Identity | One qualified owner-supplied concept portrait and original interface typography | No corpus dependency | Name, likeness, logo/signature and public launch approval |

Verified real imported videos and transcripts remain **0**. The inventory denominator is unknown. A local interaction with a visitor's own words does not change those figures or constitute an Itachi-derived curriculum.

## What was over-pruned

The original homepage's rich progression was entangled with fictional material and repetitive live/demo actions. Removing those claims was necessary. Removing every immediate activity, contextual destination and strong change of visual pace was not necessary.

The current page has four narrative sections: hero, passive collection note, three future-tense process statements, and My Corner. At 390px the two hero links end near y=612; the next main action is near y=2704. Roughly two and a half phone screens contain no visitor interaction. Learn, Practice and Community survive only in global navigation. Their differences are not explained through the Home scroll.

The desktop rhythm is similarly uniform: near-black fields, cream headings, quiet rules and body copy. The single portrait supplies almost all visual character. The three process columns describe a future product but reveal no current visitor choice. The elegant typography and large whitespace should stay; the long sequence of passive promises should become a useful progression.

The original light welcome panel, teal interaction panel and distinct content stages created moments of discovery. Recover that change of pace through original geometry, material/surface variation and user interaction, without restoring unreviewed scripture, simulated dialogue characters, preview lessons, rank offers, fictional events or audience activity.

### Width-specific evidence

| Viewport | Preserved before/after finding | Recovery implication |
| --- | --- | --- |
| 360×844 | Original primary action began at y=1055; foundation at y=528. Original page height 11147; foundation 3287. | Preserve the accessible first-fold action; keep lower controls easy to reach and avoid dense card rows. |
| 390×844 | Original action began at y=1029; foundation at y=530. Foundation collection/process sections occupy most of the middle scroll. | Add an immediate honest activity and meaningful contextual wayfinding. |
| 768×1024 | Original primary began at y=1183; foundation at y=559. Foundation stacks the portrait beneath copy and compresses process text into three columns. | Give tablet its own comfortable composition; avoid a long portrait-only transition or cramped three-column text. |
| 1280×900 | Original action began at y=810; foundation at y=620. Foundation has clear hierarchy but little visual progression after the hero. | Retain the two-column invitation and introduce substantive editorial stages. |
| 1440×900 | Original action began at y=810; foundation at y=620. Foundation page height is 2171, versus 6879 originally. | Judge substance and decision hierarchy, rather than recovering the old length or chasing a small CTA count. |

Evidence: `docs/screenshots/evidence-first/after/comparison.json`, `before/rendered-audit.json`, and `after/rendered-audit-{width}.json`. Before/after Home images at all five widths were inspected with `view_image`; the archived before set has a 768px first-fold image but no full-height `before/home-768.jpg`. The other four before widths and all five after widths have full-page images. A fixed mobile navigation bar appearing partway down a full-page capture represents its original viewport position, rather than a bar inserted into document flow.

## Action inventory and counting rule

Count visible actionable controls within `main`; exclude the shared header, disclosure, footer and fixed mobile navigation. A unique action signature is its exact href, or the button's distinct behavior when there is no href. Repeated entrances are the remaining controls after that grouping. Destination uniqueness is a navigation measurement, not evidence that an action offers a truthful or meaningful experience.

| Version | Main controls | Unique action signatures | Repeated entrances | Hero controls |
| --- | ---: | ---: | ---: | ---: |
| Original `b987ebb` | 37 | 20 | 17 | 8, including 7 unique signatures |
| Evidence-first foundation | 3 | 3 | 0 | 2 |

The original repeated destinations were `/afterglow` ×3, `/watch` ×6, `/dojo` ×3, `/atlas` ×2, `/reverts` ×2, `/afterglow/before` ×2, `/dojo/path` ×5 and `/membership` ×2. Twenty signatures included demo-only buttons, fictional card entrances and multiple legacy aliases. Mapping them through today's redirects would collapse them to thirteen action/destination signatures, including three demo behaviors and three outbound URLs. That secondary normalization is an engineering comparison, not a claim about the original visitor experience.

### Every current Home main action

| Control | Destination | Outcome now |
| --- | --- | --- |
| Explore questions | `/explore` | Search the real approved collection; currently an honest empty state |
| behind the Corner | `/about` | Read concept, creator identity and unaffiliated status |
| Visit My Corner | `/me` | Inspect configured account availability or manage the authenticated visitor's own account |

Shared navigation intentionally offers route access without counting it as a fresh Home journey. The header and mobile navigation expose Home/Explore/Learn/Practice/Community; My Corner appears in the desktop header and the menu. The menu also exposes About/Library/Support. The disclosure links to About. Footer links lead to About, Library, Session Notes, Support, FAQ, Privacy and Terms. These remain modest wayfinding/trust affordances.

## Recommended recovery

Use a paced creator invitation with six movements. Each movement has one clear idea and one locally dominant next step. Contextual actions appear where their purpose is explained; no total action target drives the design.

1. **Meet the Corner.** Make `Itachi's Corner` unmistakable in the hero identity. Preserve the concept-qualified single portrait, restrained crimson/obsidian and strong serif/condensed typography. Primary: **Explore a question**. Secondary: **Meet the Corner** or **Start here**, leading to About. Keep these as the only two hero actions, with no clickable orbit, live link, score or ticker.
2. **Bring a real question.** Give the collection a deliberate visual stage. Explain that only reviewed conversations can appear and that the first collection is still being prepared. Show no fake results or sample source claims. Keep real collection search behind the primary Explore action, rather than adding a second search CTA alongside the hero invitation.
3. **See how the space fits together.** Replace the three passive promises with clear routes to Learn, Practice and Community. Use a shared editorial composition with individual statuses and restrained line art, not three identical marketing cards. Learn explains source-first readiness and the gentle beginning; Practice introduces working on one's own wording; Community explains respectful participation and moderation readiness. Each route must say what is possible now before describing future material.
4. **Make room for your own words.** Offer an original small writing tool, explicitly a personal reflection rather than a lesson or Itachi method. The visitor supplies a question and their own reflection/uncertainty, sees only their own words arranged clearly, and can revise, copy or clear them. Never answer, evaluate, rate faith, assign points or fabricate a source. Do not seed an example question that could be mistaken for published educational material. A warm plum/cream material change and user-driven panel transition can make this the memorable middle moment.
5. **A corner of your own.** Explain private ownership through actual notes and privacy controls. Link to My Corner or its private-notes destination with accurate authentication/configuration behavior. If the scratchpad is temporary, say it remains only on this page and is lost on refresh; if saving is offered, integrate the real owned-note flow and disclose it precisely. Do not promise persistence from an in-memory demo.
6. **Continue with care.** Close with a calm invitation and clear trust context. The contextual Community action already leads to real participation principles, so another competing Community CTA is unnecessary. Creator public profiles remain restrained in About/footer context. Preserve the visible unaffiliated notice and all release gates.

An alternate, lower-cost design could only add richer route cards and a source-review accordion. It would improve wayfinding but leave no immediate meaningful activity. A richer simulated learning product would create more apparent activity but violate the content contract. The recommended visitor-owned writing tool provides authentic immediate value without requiring corpus or creator-method claims.

### Interaction and presentation details

- Use one architectural arch/inset motif across the page, with depth from layering and a controlled crimson glow. Express Egyptian heritage through proportion and geometry, not a skyline parade, scattered gold or repeated faces.
- Prefer ordinary HTML forms, links and disclosure controls. Reveals must remain available to keyboard users, and touch must not depend on hover. Controls should meet a 44px touch target; route labels must describe their outcomes.
- Keep the mobile menu's scroll lock/focus behavior and fixed navigation clearance. Test content above the keyboard and the bottom navigation, especially textarea actions.
- Motion follows a visitor action: opening a panel, focusing a field, revealing the visitor's words. Respect `prefers-reduced-motion`; avoid ambient particles, continuous orbiting or a motion-dependent explanation.
- Reuse the existing approved-question read model and account routes. Keep the small writing interaction isolated from server data and private transcript bodies. Never send visitor wording to an answer service or present it as a theological claim.
- Verify search encoding/empty behavior, writing/edit/copy/clear behavior, all contextual destinations, no overflow, focus order, menu closure/restoration and reduced motion. Preserve real account/security tests; a browser-local interaction cannot validate hosted Auth.

## Fresh production foundation browser pass

The clean integrated foundation production server on `http://localhost:3600` was inspected directly with installed Playwright Chromium on 2026-10-18. These are baseline observations, before recovery UI implementation.

- Home returned HTTP 200 at 360×844, 390×844, 768×1024, 1280×900 and 1440×900, with zero horizontal overflow and no browser page errors. Fresh section/action positions and full-page heights match the archived foundation comparison values above.
- Both hero links fit each required first fold. The primary action's lower edge is y=576, 578, 607, 668 and 668 respectively. The long passive gap after those links is real browser behavior: the collection/process pair contains **zero actionable controls**.
- At 360, 390 and 768px the menu opens as a real native modal, focuses Close menu, locks body scroll and exposes all nine canonical menu destinations. Escape removes the dialog, restores body overflow and returns focus to Open menu. Following Learn from the open menu closes the dialog, restores scrolling and reaches `/learn`.
- Actual scroll to the process section confirms the quiet middle movement contains only future-tense text. The phone/tablet quick navigation remains fixed; full-page screenshots must be read with that behavior in mind.
- Following Visit My Corner reaches `/me` and accurately says **Your account is not connected yet** in this clean production configuration. It offers Explore rather than a fake account. This pass does not establish hosted email delivery or a real-member lifecycle.
- Explore accepts the visitor's actual text `my own question & care`, correctly encodes it as `/explore?q=my+own+question+%26+care`, preserves the input and returns the honest No published questions found state. It does not invent results.

Recovery UI behavior and fresh recovery screenshots still require their own production pass after implementation.
