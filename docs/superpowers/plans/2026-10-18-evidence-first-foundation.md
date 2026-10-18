# Evidence-first Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Replace public demo claims with a truthful creator-first application and reproducible private evidence foundations.

**Architecture:** Evolve existing Next.js routes and styles. Isolate public approved read models from private research and owned account records. Import authorized private archives deterministically; block educational publication until human gates pass.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind 4, Supabase SSR/Postgres/RLS, Vitest, Playwright, Node 24 research CLI.

**Spec:** `docs/superpowers/specs/2026-10-18-evidence-first-design.md`

## Global Constraints

- No deployment, paid inference, Modal spend, payment activation, harvesting, transcript publication, or substantive Itachi curriculum/book authoring.
- No fabricated production content. Existing fixture code may remain dormant but cannot render through any public route.
- Keep unendorsed disclosure, noindex, creator approval and source review gates.
- Use isolated worktrees and disjoint ownership; integrator alone changes package/lock files and shared documentation.
- Private outputs stay outside git; exact `[start_ms,end_ms)` intervals permit 1 ms spans.

## Review Focus

- Unconfigured or failing backend: explicit unavailable state, no sample fallback or success claim.
- Legacy deep links and no-JS access: redirect to truthful canonical pages with usable navigation.
- Member-controlled metadata, forged identities, anonymous users: cannot elevate staff roles or read private data.
- Malformed archives, unsafe paths, corrected checksums: reject safely and mark dependent findings stale.
- Synthetic or insufficient evidence: cannot pass publication/pedagogy gates.

### Task 1: Audit and contracts — integrator + quality

**Files:** `docs/PRODUCT_CONSTITUTION.md`, `docs/UX_AUDIT.md`, `docs/ASSET_PROVENANCE.md`, baseline screenshots and fold JSON.

**Interfaces:** Produces route mapping and the `getPublishedQuestions` contract in the spec; consumes unchanged base source and running site.

- [x] Capture baseline production build and tests and rendered folds at all five widths before UI edits.
- [x] Review historical phone/desktop screenshots, all routes and assets, CTA repetition and misleading content.
- [x] Record audit and asset hashes; retain mission/design/plan and base SHA.

### Task 2: Public experience — UI worktree

**Files:** `src/app` public pages excluding auth/account/studio ownership; `src/components/{shell,hero,footer,art,ui}.tsx`, `src/app/globals.css`, creator config and public content components.

**Interfaces:** Consumes `getPublishedQuestions` only; produces five canonical destinations, honest secondary pages and legacy redirects.

- [x] Use browser expectations for the new public navigation, empty Explore, blocked Learn/Practice, absence of demo content and legacy redirects; confirm old site fails them.
- [x] Consolidate homepage folds and CTA; remove live banner, excessive ornaments and public fixture rendering.
- [x] Implement accessible responsive public pages and all legacy aliases; qualify existing portrait provenance.
- [x] Check no public fixtures/restricted research imports, lint/typecheck, and commit only owned files.

### Task 3: Database and account foundation — data worktree

**Files:** `src/lib/{supabase,auth}/**`, `src/lib/published-content.ts`, `src/proxy.ts`, auth/account APIs/components/routes, `supabase/**`, RLS runner, auth tests, `docs/AUTH_PRIVACY_SETUP.md`.

**Interfaces:** Produces safe published query contract and real SSR account flows; consumes pinned deps and environment contracts. Owns role guard for private studio.

- [x] Add failing behavioral tests for redirect validation, missing configuration and publication filtering; run them.
- [x] Generate migration through Supabase CLI; implement private source/research/editorial schemas, owner account tables, grants, policies and private buckets.
- [x] Implement OTP/callback/logout, server session checks, privacy export/delete and staff-only console, with honest unconfigured states.
- [x] Execute SQL role separation and publication-gate tests in local Postgres; run full Vitest/typecheck; document remote setup blockers and commit owned files.

### Task 4: Research foundation — research worktree

**Files:** `research/**`, `tests/research.test.ts`.

**Interfaces:** CLI `node research/cli.mjs import --manifest <safe.ndjson> --source <private-root> --output <private-root>` and deterministic analysis command; exact evidence span contract in the spec.

- [x] Write/run failing tests for valid short intervals, malformed input, paths/checksums, deterministic imports, coverage, controls, lineage and human eligibility gates.
- [x] Implement immutable private importer and safe manifest/coverage reports without acquiring any videos.
- [x] Implement finite-state/Markov/sequence baseline proposals, reproducible null/perturbation checks, counterexamples, lineage and stale propagation.
- [x] Record methodology, graph schema, limitations, empty real registry/coverage, cost-plan inputs pending actual corpus; run tests/CLI smoke and commit.

### Task 5: Integration and evidence — quality + integrator

**Files:** `e2e/**`, `playwright.config.ts`, `docs/screenshots/evidence-first/**`, `docs/REFACTOR_MAP.md`, `docs/EVIDENCE_FIRST_ARCHITECTURE.md`, release/design/flow docs, README, `STATUS.md`.

**Interfaces:** Consumes integrated A/B/C branches; produces reviewable screenshots and exact verification record.

- [x] Merge workstream commits sequentially; review security/data boundaries and resolve contract mismatches.
- [x] Replace superseded demo journey expectations with canonical routes, redirects, account readiness, unauthorized console denial and honest empty states.
- [x] Run lint, typecheck, full Vitest, build, RLS tests, Playwright including axe/no-JS/mobile/reduced-motion; capture all core pages at five widths and report performance.
- [x] Obtain independent branch review, fix material findings, and rerun affected checks.
- [x] Record DONE/approval/corpus/credentials/future status and zero paid spend; commit and push feature branch, verify remote SHA, do not deploy.
