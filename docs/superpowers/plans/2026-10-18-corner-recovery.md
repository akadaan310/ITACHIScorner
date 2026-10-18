# Corner Recovery Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development for scoped tasks and independent review. The owner explicitly requests execution without planning/approval pauses.

**Goal:** Restore a rich, honest homepage and connect the existing private corpus engine safely, while producing one actionable handoff when inputs are missing.

**Architecture:** Retain server-rendered public pages, a small client-only ephemeral question desk, existing SSR accounts and evidence engine. Add a separate Node-only transactional PostgreSQL persistence phase consuming validated local receipts; preserve both reviewed migrations and all publication gates.

**Tech Stack:** Next.js 16.4.2, React 19, TypeScript, Vitest, Playwright/axe, PostgreSQL 17, existing Supabase private schema.

**Spec:** [Corner recovery design](../specs/2026-10-18-corner-recovery-design.md), implementing [the controlling amendment](../../MISSION_RECOVERY_AND_CORPUS.md).

## Global Constraints

- No deployment, paid processing, outreach, billing changes, merge or force push.
- No fabricated educational product, public transcript bodies, fake counts or creator endorsement.
- Preserve Home, Explore, Learn, Practice, Community and My Corner; hero has at most two contextual actions.
- Keep existing reviewed migrations and evidence-first screenshot archives unchanged.
- Exact intended Supabase project: `frxufmwwbegconolevkw`, ACT AI Protocol, Free plan; no unrelated project.
- Restricted real data stays outside Git and client bundles. Synthetic input is test-only.

## Review Focus

- Clipboard unavailable/rejected: retain visitor input and show truthful failure; no false success.
- Refresh/no JavaScript: explain ephemeral loss and retain functioning public navigation.
- A different project or absent permissions: fail before private writes, without leaking connection details.
- Existing source versions/corrections: idempotent replay or explicit collision, never mutable transcript history.
- Empty corpus: no invented examples, percentage denominator, findings or curriculum.

### Task 1: Audit and bounded corpus discovery

**Files:** `docs/RECOVERY_DECISION_MAP.md`, `docs/CORPUS_DISCOVERY.md`, `docs/CORPUS_HANDOFF_NEEDED.md`, `docs/screenshots/recovery/before/*`.
**Interfaces:** Consumes foundation `674668b` and existing handoff contract. Produces baseline action/fold records and either a real private handoff locator or one bundled artifact request.

- [x] Resolve live repository/default/feature SHAs and protect old worktrees.
- [x] Run `npm ci`, `npm test`, `npm run build`; require 105 baseline tests and a successful production build.
- [x] Inspect production at all five widths and capture first folds, full Home, scroll transitions, menus and selected routes.
- [x] Record original 37 controls/20 signatures/17 repeats separately from foundation 3 links/3 destinations/0 repeats; assess meaningful paths, not count targets.
- [x] Search only scoped authorized sources and intended-project metadata. Record exact zero/unknown results or validate the supplied artifact before importing.

### Task 2: Restore the public scroll story

**Files:** `src/app/page.tsx`, `src/components/hero.tsx`, new `src/components/question-desk.tsx`, `src/app/globals.css`, contextual Learn/Practice/Community pages, `e2e/recovery.spec.ts`.
**Interfaces:** `QuestionDesk` is a standalone client component with state-only visitor input; no account, research or network dependency. Existing public route contracts remain stable.

- [x] Add failing browser regressions for exact hero primary, at most two hero links, distinct contextual journeys and empty-source honesty.
- [x] Implement the narrative and scratchpad without inventing content; native disclosures explain source/review preparation.
- [x] Add browser assertions for edit/copy/clear, clipboard rejection, no network/storage, refresh loss, reduced motion and no-JavaScript fallback.
- [x] Run focused browser checks and visually review 390px and 1440px before final capture.

### Task 3: Private persistence phase

**Files:** `research/adapters/private-supabase.ts`, `research/private-persist.mjs`, `research/package*.json`, `tests/private-persistence*`, `scripts/test-private-persistence.sh`, adapter/handoff docs.
**Interfaces:** Consume existing immutable import receipt and archive. Produce transactional private research records and a metadata-only persistence receipt; no review/publication writes.

- [x] Write failing tests for wrong project/migrations/permissions, source collisions, malformed receipts and secret-safe errors.
- [x] Implement explicit direct-TLS-Postgres mappings, permission/identity preflight, immutable idempotence, correction/gap/role/interval lineage and transaction rollback.
- [x] Pin any Node-only driver dependency under research; keep it out of frontend dependencies.
- [x] Run actual local PostgreSQL integration for import/replay/rollback/corrections and anon/member isolation. Hosted write remains blocked without correct operator credentials.
- [x] Run hosted read-only advisors and retain actual empty corpus counts. Never substitute synthetic tests for real imported data.

### Task 4: Review, verify and ship

**Files:** new recovery screenshots/contact sheets/check records, `docs/RECOVERY_VERIFICATION.md`, `docs/RECOVERY_PERFORMANCE.md`, `STATUS.md`, `docs/WHAT_HAPPENS_NEXT.md`, README and execution record.
**Interfaces:** Combine tested product and persistence changes, actual corpus discovery and creator/auth boundaries into a single phone-owner handoff.

- [x] Run lint, strict typecheck, Vitest, default production build and complete Playwright suite with outputs in the new recovery archive.
- [x] Run existing real PostgreSQL RLS suite and new private persistence integration; run cold performance samples only after heavy checks finish.
- [x] Review all five widths, source integrity, keyboard/a11y/reduced motion, cold/delayed fonts and firstfold/fullpage comparison contact sheets.
- [x] Obtain independent code/spec review, fix important findings and reverify affected behavior.
- [x] Write exact counts and one external artifact ask; no fake receipt or hosted-auth success.
- [x] Commit scoped files, push the new feature branch, verify local/remote SHA equality and original branch/migration/archive integrity.

## Execution outcome

Implemented and independently accepted through `9f7be34`; current evidence and exact final delivery checks are in [RECOVERY_VERIFICATION.md](../../RECOVERY_VERIFICATION.md) and the Git history. All real corpus counts remain zero with an unknown total inventory denominator. The authorized partial delivery includes one forwardable artifact request, not a fabricated import receipt. Shipping is a normal push to the separate recovery branch, with no merge, force push, deployment or spending.
