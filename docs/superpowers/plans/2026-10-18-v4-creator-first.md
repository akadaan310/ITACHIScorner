# V4 creator-first implementation

Authority: [V4 mission](../../MISSION_V4_CREATOR_FIRST.md). Existing isolated checkout `/workspace/itachi-recovery`, successor branch `feat/v4-creator-first`, base `7a8ce5efda461ebab717a03ed1d9c73528f92c9d`.

The owner explicitly requests complete execution. This written mission supplies the design and authorizes implementation, screenshots, tests, commit and push; no repeated design approval is needed. No paid services, production release, fabricated corpus or creator endorsement.

## Design

Keep the existing Next application, Supabase project, reviewed immutable migrations, owner-scoped account APIs and deterministic research engine. Restore creator identity through a restrained crimson signature study, larger clearly conceptual portrait and purposeful editorial placements. Five public destinations: Explore, Learn, Practice, Community, My Corner; Home via logo. Each page must offer a useful present action with concise honest limitations. Keep original and recovery screenshots immutable.

A real source search and a keyboard-operable question journey lead into visitor-owned reflection. Practice supports writing and self-reflection without religious answers or scores. My Corner reports only actual owned records. No fake curriculum, community members, attendance, sessions or attributed source examples. A single existing source image may support differentiated component crops, but must not be described as multiple authentic photographs. Portrait hiding must remain intentional.

## Tasks and ownership

1. **Baseline audit — rendered-audit agent.** Fresh unchanged production build, full-page screenshots of all existing public/account/creator routes at five widths, actual navigation/disclosures/writing/safe-signup/keyboard/reduced-motion checks. Write `docs/UX_ARCHITECTURE_AUDIT_V4.md`. Product edits wait for completed baseline inspection.
2. **Permitted acquisition — corpus agent.** Verify official hub/channel, attempt lawful channel/playlist/short/stream metadata and caption access. Own new `research/acquisition*`, `research/v4*` and `docs/CORPUS_ACQUISITION_V4.md`. Private files, exact-byte hashes, import/analyze receipts and portable ZIP remain outside Git. Denominator unknown unless demonstrated. Existing `pipeline.ts` and migrations unchanged.
3. **Brand — brand agent.** Own `public/brand/v4/**` and `docs/BRAND_IDENTITY_V4.md`. Hand-trace the reference script, document orientation/provenance and approval; raster specimens are technical comparisons. Do not fabricate documentary portraits or imply rights.
4. **Creator UI — UI agent.** Own Home, hero, shell/art/footer, CSS, About/Learn/Community/Library/Support/Session Notes and creator configuration. Seven home movements, clear hierarchy, mobile creator visibility and complete secondary architecture. Use new named `QuestionJourney` and `SourcePreview` components supplied by task 5. Do not alter Auth/RLS or transient QuestionDesk privacy behavior.
5. **Present functionality — parent.** Own new question-journey/practice/source components, Explore/Practice and My Corner. SourcePreview is a server-safe functional GET search, not fake metadata. QuestionJourney takes no props and uses visitor input, with all source/review gaps explicit. PracticeComposer offers reversible private writing/self-checks and accurate clipboard status; no persistence without account. Existing owned-note/saved-question counts reflect real records only. Meaningful tests exercise behavior/privacy and untrusted data.
6. **Integration verification — integration agent.** Read-only actual GitHub refs/checks/deployments and authorized Vercel configuration evidence. Own `docs/VERCEL_GITHUB_VERIFICATION_V4.md`. Record production branch/SHA as unknown if credentials unavailable; never infer them from GitHub default. Parent creates reviewable PR after verified push; no production merge while branch/creator gates unresolved.
7. **Final QA/review — QA plus independent reviewer.** Full-page after screenshots and before/after sheets in new V4 archive. Run npm ci, lint, typecheck, unit, build, Playwright/a11y, local RLS and private-persistence checks; cold/font probes if layout changes. Review entire branch, fix important findings, document hosted-vs-local limits and provenance.
8. **Delivery — parent.** Update current status/acquisition ownership, commit and push scoped changes; verify clean tree and remote SHA equality. Create PR to confirmed GitHub default if actual Vercel branch cannot be verified, explicitly do not equate them. Report source SHA, PR and actual observed deployment separately.

## Shared interfaces and constraints

| Tasks | Producer / consumer | Decision |
|---|---|---|
| 1 → 3/4/5 | Before screenshots / product edits | Baseline completion is a hard ordering constraint. |
| 3 → 4 | `/brand/v4/` mark and provenance / visual components | Concept approval stays false; image fallback always available. |
| 4 ↔ 5 | Home imports / named components | `QuestionJourney` and `SourcePreview` accept no props. Parent owns their files; UI owns presentation CSS. |
| 2 → 5 | Safe verified metadata / Explore | Optional actual metadata may enrich catalogue; no invented IDs, titles, timestamps or completeness. |
| 4 ↔ 7 | Page labels/layout / existing tests | Update assertions only when requirements changed; preserve privacy/security regressions. |
| 6 → 8 | Actual integration evidence / PR target | Unknown production settings block merge/release, not a reviewable PR. |

Self-consistency review: every task has explicit file ownership; no task grants source permissions, creates staff identities or replaces migrations. Metadata-only imports are reported separately from transcript imports and discoveries. Permission/access blockers do not stop UI, public metadata or local validation work.
