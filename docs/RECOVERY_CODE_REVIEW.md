# Recovery code review

Latest accepted implementation: `9f7be34a5dfb407ed476d5cfc23a9340c62c4e02`, combining the private corrective review and scoped font fix below. [Final verification results](RECOVERY_VERIFICATION.md) record the later complete production run.

## Initial private persistence task review — historical changes requested

Both issues tracked in this initial review are resolved in the corrective review below. The final verdict applies to commit `90d68aacd8746aa503a48ff9dbe8c81c72f30d04`.

Reviewed committed scope: `674668b54f749ea2c7b9edce50fcc9dad61be888..da1d8841a0e3dba7761e173d5618ee2c66b4ae28`, with the private persistence task diff supplied in `/tmp/itachi-recovery-private-review.diff`. This is a task review, not acceptance of the eventual whole recovery branch. UI, QA, and subsequent fixes were not part of this reviewed snapshot.

Binding requirements: `docs/superpowers/specs/2026-10-18-corner-recovery-design.md` and Missions 5–6 of `docs/MISSION_RECOVERY_AND_CORPUS.md`. Reviewed the adapter, operator CLI, dependency pin/lockfile, documentation, unit/integration coverage, existing importer validators, and the unchanged migration definitions governing rights, immutable versions, source correction invalidation, and private reads.

### Important — private-policy preflight accepts an ordinary-member read policy

Location: `research/adapters/private-supabase.ts:124` (security query and acceptance at lines 120–131 in the reviewed commit).

`member_denied` treats an authenticated policy as safe whenever its expression contains the substring `research.has_role`. That does not establish that staff authorization is required. A policy with `true OR research.has_role(...)` passes. Migration history verification cannot detect this live policy alteration because its recorded migration statements remain unchanged.

Targeted reproduction against an ephemeral PostgreSQL 17.6 container, using the unchanged migrations and only controlled synthetic fixture data:

```sql
alter policy staff_read on research.transcript_segments
using (true or (select research.has_role(array['reviewer','creator','admin'])));
```

After registering the fixture's existing creator permission, `persistPrivateImport` succeeds. Switching to `authenticated` with the existing nonstaff member UUID exposes both inserted transcript segments. The reproduction printed:

```json
{"preflight_accepted_permissive_policy":true,"ordinary_member_visible_segments":2}
```

This violates the requirement that changed private access checks fail closed before restricted text is written. Fix by verifying the actual effective private authorization boundary, including relevant policy definitions, roles, commands, and the trusted authorization helper, rather than testing for a function-name substring. Add negative regression coverage for a permissive expression that still mentions the helper and for changed helper behavior. A function definition change must not pass merely because the policy text is unchanged.

The local reproduction files are `/tmp/itachi-review-policy-repro.mjs` and `/tmp/itachi-review-policy-repro.sh`. The harness used `--network none`, no published port, no hosted connection, and removed its database and fixture archive afterward. It did not print source bodies or credentials.

### Follow-up already identified by implementation team

The team reported that changing the adapter fingerprint changes its persistence run ID, allowing an old local receipt to bypass replay handling. A fix and regression evidence are pending independent review. This report does not treat that pending fix as accepted.

### Assessment and evidence limits

Spec compliance: changes requested because the demonstrated private-policy check fails open. The architecture otherwise follows the requested separate direct PostgreSQL phase, exact project/TLS configuration, independently recorded creator rights, private local receipt/hash revalidation, immutable source insertion, explicit interval and annotation mappings, serializable transaction rollback, and separation from editorial/publication decisions. The two reviewed migrations remain unchanged.

Code quality: changes requested on the demonstrated security check. Parameterized values, static table names, fixed error messages, separate server-only dependency scope, and actual PostgreSQL integration coverage are appropriate. No additional critical or important finding is asserted from speculative scenarios. No minor finding blocks this task.

Existing verification reported by the coordinating agent: 110 Vitest tests, 43 private PostgreSQL assertions, 118 existing RLS assertions, build, and typecheck. Those complete suites were not rerun in this review. The independent new evidence is the targeted PostgreSQL policy-drift reproduction above. Local evidence does not establish hosted configuration, hosted writes, or receipt of any real corpus. Real imported corpus and validated real discoveries remain zero.

## UI and QA integration review — accepted

Reviewed the committed UI/QA portion through `22cd2a69b12ead621a6bcb608315d8658753b49e`, against Missions 2, 3 and 8 and the binding recovery design. Reviewed Home, Hero, QuestionDesk, Learn, Practice, Community, CSS, the changed browser tests, and screenshot/performance capture scripts. Existing layout, shell, artwork, and auth boundaries were inspected for integration context. The UI source is unchanged between that commit and `90d68aa`.

No critical or important issue was found. The story has distinct contextual destinations, native source disclosures, honest empty-source and approval gates, and a useful visitor-owned writing tool. The six contextual navigation destinations, three disclosures, and three transient draft controls are counted separately; the hero has two links. The qualified portrait appears once, and the shared visible independent-concept notice remains intact. Existing account APIs and authorization code are unchanged.

QuestionDesk is a narrow client component with initially empty React state. It has no server action, form submission, network client, persistent browser storage, or private adapter dependency. Visitor text renders through ordinary React text interpolation; the preview preserves line breaks without interpreting markup. Clipboard completion is awaited, copy errors preserve the draft, editing/clearing is disabled while copy is pending, and focus transitions target the preview or input appropriately. The temporary-draft warning precedes the fields. The no-JavaScript fallback hides the interactive controls while leaving the server-rendered narrative and links available. Reduced-motion rules continue to cover the newly added transitions.

A new focused review probe against the production app on port 3800 independently confirmed that markup-shaped visitor input renders as text, no copy-success status appears while a deliberately deferred clipboard promise is pending, controls remain disabled during that wait, and success appears after resolution. This probe did not duplicate the full browser suite. The initial default Playwright executable lookup was unavailable; the successful probe used the installed system Chromium. No external service or visitor data was involved.

The test assertions support their stated local behavior. Privacy coverage observes local/session storage and outbound request behavior while exercising the desk; this is supported by the direct source review, not treated as a proof about arbitrary browser extensions. Screenshot and performance scripts clearly distinguish local lab observations from deployed Core Web Vitals. The independent five-width visual review and its focused recheck of copy-feedback visibility are recorded in `docs/RECOVERY_VISUAL_REVIEW.md`.

## Corrective private review — both findings addressed

Reviewed corrective scope `da1d8841a0e3dba7761e173d5618ee2c66b4ae28..90d68aacd8746aa503a48ff9dbe8c81c72f30d04`, limited to the adapter, adapter README, and private integration tests supplied in `/tmp/itachi-recovery-private-fix-review.diff`.

1. **Private-policy drift: addressed.** The substring heuristic has been removed. Current private table/policy catalogs must match the expected reviewed tables, policy names, commands, roles, permissiveness, predicates and checks. The `research.has_role` helper is checked against the reviewed body and its relevant catalog properties. A savepoint probe assumes `authenticated`, sets a nonstaff subject, verifies the resulting Auth identity and staff denial, and checks private corpus, permission and moderation read denial before restoring the operator context. The regression reproduces the original `true OR` policy alteration with unchanged migration history, asserts a preflight rejection and zero writes, and adds equivalent zero-write checks for an always-true helper and a changed Auth identity helper.
2. **Replay after adapter revision: addressed.** Persistence run identity now depends on the immutable local receipt identity, rather than the current adapter fingerprint. Replay retains the original adapter metadata for immutable row/snapshot verification, separately reports the current verification fingerprint, and continues to skip inventory updates and invalidation. The regression simulates a previously stored adapter fingerprint, imports a correction, replays the old receipt, and verifies preserved current recording metadata, no newly stale candidate, and distinct original/verification fingerprints. The original implementation was unreleased and had no hosted persistence receipts; this is acceptance of the stable identity contract going forward, not a claim that an existing hosted legacy receipt migration ran.

No new critical or important breakage was found in the corrective diff. Exact catalog matching is intentionally conservative: a later migration or PostgreSQL catalog-format change can require a reviewed adapter update and otherwise blocks persistence. It does not silently widen access.

## Final branch code/spec verdict — accepted

Reviewed implementation scope: `674668b54f749ea2c7b9edce50fcc9dad61be888..90d68aacd8746aa503a48ff9dbe8c81c72f30d04` on the recovery branch. **Spec compliance: accepted. Code quality: accepted.** No unresolved critical or important code finding remains in that committed scope. The initial changes-requested verdict above is retained as historical review evidence and is superseded by this verdict.

The review confirms the integrated UI and separate private persistence boundary meet the engineering requirements for the authorized partial delivery while the real corpus is absent. The two reviewed migration files, existing network-free importer, existing account security code, and prior evidence-first screenshot archive were not modified by the reviewed commits. Final evidence/handoff documentation and screenshot packaging being prepared after this SHA are outside the committed code scope of this verdict.

Verification reported by the coordinating agent after the fixes: lint, strict typecheck, 110 Vitest tests, 53 actual PostgreSQL 17.6 private-persistence assertions, and the full 121-test browser suite passed; existing 118 RLS assertions and production build evidence also remain recorded. The UI has independent five-width visual acceptance. This reviewer inspected the new regression logic and relied on the coordinator's fresh complete-suite results, adding only the independent targeted policy reproduction and deferred-clipboard/text-rendering probe described above.

This is engineering review acceptance, not deployment, creator approval, publication, or hosted persistence verification. Real imported corpus and validated real discoveries remain **zero**; the complete inventory denominator remains unknown. Hosted private database/operator credentials and the authorized corpus handoff are missing. No hosted write, deployment, paid processing or spend was performed by this review.

## Focused late-font correction review — accepted

Reviewed only `90d68aacd8746aa503a48ff9dbe8c81c72f30d04..9f7be34a5dfb407ed476d5cfc23a9340c62c4e02`: `src/app/globals.css` and `e2e/quality.spec.ts`. The coordinating agent reported a newly observed 1280px Home CLS of 0.101316, exceeding the existing 0.1 gate. Fallback title min-content width expanded the copy track and compressed the portrait before the display font arrived.

The fix addresses that mechanism directly. Zero-minimum fractional grid tracks prevent fallback text from changing the desktop column allocation; a local, size-adjusted fallback approximates the condensed title width before Bebas Neue loads. The loaded display font and the separately styled serif emphasis remain intact. No fixed height, hidden content, weaker threshold, or delayed measurement was introduced. The added desktop Home regression uses the existing 800ms font-delay observer, fresh context, and strict `< 0.1` assertion, while preserving the Explore phone regression and separate output artifacts.

No critical or important issue was found in this two-file correction. **Scoped code/spec verdict: accepted.** Combined with the preceding review, committed source through **`9f7be34a5dfb407ed476d5cfc23a9340c62c4e02`** is accepted for the same authorized engineering delivery. The private adapter remains unchanged from its accepted scope at `90d68aa`.

Evidence limit at the time of this focused review: the coordinating agent reported five-width prototype Home CLS of approximately 0.0062–0.0149 with readable fallback text and unchanged settled layouts. The fresh production build and expanded 122-test browser suite were being rerun; this review does not claim those pending results passed. No redundant full suite was run by this reviewer. Final delivery verification should record those fresh results against this corrected source. All corpus, hosted-credential, approval, deployment and spending limits above remain in force.
