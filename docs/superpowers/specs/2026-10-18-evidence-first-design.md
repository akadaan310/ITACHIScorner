# Evidence-first foundation design

## Authority and scope

Implement the supplied [mission](../../MISSION_EVIDENCE_FIRST.md) in `akadaan310/ITACHIScorner`, evolving the existing Next.js application. The user explicitly requested coordinated isolated workstreams, verification, and commit/push; no additional implementation authorization is needed. Base is `b987ebb58c649f0c724cc5ace545ea2e8f7ed1d3` on the live default `ccr-cea0c280-gyikbx`. Integrate on `feat/evidence-first-foundation`.

The immediate deliverable is a truthful application foundation, real configurable auth and private data model, compatible private corpus importer, deterministic research baselines, and gated editorial tooling. This is not a corpus harvest, course, book manuscript, live integration, billing activation, or deployment.

## Approach

Preserve the application and reusable visual primitives. Replace publicly reachable fixture-backed experiences with focused pages and redirects. A wholesale rewrite would discard useful routing, typography, assets, and accessibility patterns; retaining demo UX behind new labels would violate the brief. The selected approach keeps useful systems while changing the product boundary.

The five primary destinations are Home, Explore, Learn, Practice, and Community; My Corner is secondary. Explore reads only a publication read model with safe summaries and exact source metadata. All collections are empty until approved real evidence exists. Learn and Practice show pending states. Legacy experience URLs redirect. The local review portrait retains a conspicuous provenance qualification and blocks public release.

## Boundaries and contracts

- UI owns public pages, shared shell/styles, public creator configuration, and legacy public aliases.
- Data/account owns `src/lib/supabase`, `src/lib/auth`, auth/account APIs, account components, `/join`, `/onboarding`, `/me/**`, `/studio/**`, proxy, SQL, RLS runner, and auth setup docs.
- Research owns `research/**` and `tests/research.test.ts`. Nothing in the public app imports private research or fixtures.
- Quality owns Playwright files/config and captured verification artifacts. Integrator owns package files and cross-cutting docs.

`getPublishedQuestions(query?: string)` in `src/lib/published-content.ts` returns `{ items: PublishedQuestion[], status: "unconfigured" | "ready" | "unavailable" }`. Each item has `id`, `title`, `summary`, `sourceUrl`, `videoId`, `startMs`, `endMs`, `speaker`, `confidence`, and `reviewedAt`. No sample fallback. Query errors fail closed with an unavailable state. Public queries are RLS-bound and never use privileged credentials.

Auth uses pinned `@supabase/supabase-js` 2.118.0 and `@supabase/ssr` 0.12.7. Environment variables are `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and server-only `SUPABASE_SECRET_KEY`. Missing configuration disables dependent actions honestly. OTP/email delivery and remote schema installation cannot be claimed verified without an authorized creator project. Redirect targets must be local safe paths. Sensitive account routes revalidate sessions, do not share-cache private responses, and enforce ownership.

## Database and privacy

Unexposed `research` stores source inventory, tracks/versions/segments/turns, exact intervals, evidence/claims, discovery runs, typed graph versions/edges, curriculum drafts and review decisions. Public tables hold owned account/community records and approved safe read models, never transcript bodies. Trusted `creator_staff` roles have no member write policy. RLS differentiates anonymous, member, reviewer, creator, and admin. Private storage is default. Every publication requires independent content review and creator authorization. Deletions revoke sessions and remove the authenticated user's data through a server-only adapter; no browser mock.

The only visible Supabase project is unrelated and inactive; do not touch it. Build local migrations and executable role tests. Project selection and credentials remain an explicit blocker; creation with any nonzero cost needs approval.

## Corpus and discovery

No compatible handoff was located in this checkout or bounded repository metadata search. Accept an explicit safe manifest and authorized private export root; do not start a second harvesting project. Use stable string platform/video/track/version IDs, byte checksums, deterministic IDs, immutable version collision checks, and output paths outside git. Validate nonnegative integer half-open intervals, including 1 ms instants and subsecond turns; preserve overlap.

Baseline analysis records speech-act proposals, finite-state transitions, sequence motifs and Markov likelihoods. It splits by video/time, uses seeded perturbation/null controls, reports counterexamples and uncertainty, and creates a lineage DAG. No automatic pedagogy eligibility: synthetic evidence, stale findings, insufficient cross-video support, missing rights/review/creator approval all block it. Corrected source hashes mark dependent findings stale.

## Verification and acceptance

Capture current rendered routes before UI edits at 360/390/768/1280/1440; retain fold maps, CTA inventory, historical screenshot assessment and asset provenance. Verify lint, strict typecheck, Vitest, production build, browser navigation/aliases, honest unconfigured accounts, staff access denial, keyboard/mobile/no-JS/reduced-motion behavior, axe and performance measurements. RLS tests must execute on local Postgres with five distinct application identities. Research tests use controlled synthetic data only, outside public UX. Report remote auth, full inventory coverage and creator approval as blocked until independently verified.
