# Evidence-first architecture

Authority: [mission](MISSION_EVIDENCE_FIRST.md), [constitution](PRODUCT_CONSTITUTION.md), [design](superpowers/specs/2026-10-18-evidence-first-design.md). The product is an undeployed, unendorsed foundation. Its public routes must remain useful and truthful with no credentials or corpus.

## Trust boundaries

| Boundary | Stores/reads | Access rule |
| --- | --- | --- |
| Public application | Approved safe question/learning summaries, source destinations and exact intervals | Publishable-key client with RLS; no research text, privileged key or fixture fallback |
| My Corner | Own profile, preferences, consent, self-entered handles, progress and activity | Verified request session and owner-scoped policies; no shared private cache |
| Creator/editorial console | Corpus gaps, review status and proposed findings | Server-checked database staff roles; no browser role switch or mutable user metadata |
| Private research | Manifest, source versions, transcript spans, evidence, graph/lineage and drafts | Unexposed schema, private storage, restricted operator import; public publication is a separate step |
| Offline pipeline | Explicit authorized archive root and manifest | Local deterministic Node CLI; no downloader, paid model, platform login or automatic curriculum |

Only `NEXT_PUBLIC_SUPABASE_URL` and a publishable key may reach the browser. `SUPABASE_SECRET_KEY` is a server-only administrative dependency for confirmed account deletion. The SSR proxy must preserve Supabase refresh cookies and cache headers. Sensitive operations validate the current user, same-origin mutation intent, and ownership. Trusted role assignment requires an operator, never a profile form or JWT `user_metadata`.

## Evidence flow

1. An authorized corpus owner provides a metadata manifest and private track exports. Inventory completeness and transcript completeness are separate measures. Zero imported records does not mean the channel has zero videos.
2. Import validates stable IDs, rights status, checksums, immutable source versions and precise nonnegative half-open intervals. Overlaps and physically short turns remain intact. A detected instant occupies 1 ms and is flagged.
3. Deterministic features propose speech acts and recurrent transitions. Baselines and perturbation controls produce candidates, uncertainty, counterexamples and reproducible run identifiers. Proposals are observations/interpretations; none certifies theology, identity, causality or dialogue victory.
4. A lineage DAG connects source hashes, features, candidate/test runs and dependent findings. Correcting a transcript invalidates dependent findings until revalidation.
5. Editorial review, qualified review for theological claims, source/likeness permission and creator attribution approval are independent controls. Learning/book drafts remain private metadata scaffolds until the mission's Gates 2–4 pass.
6. A publication read model carries an approved safe summary and source evidence metadata. It never exposes private transcript tables. Public lesson generation is not an ingestion side effect.

See `research/graph_schema.md`, `research/methodology.md`, and `research/limitations.md` for the implemented offline methods and limitations; see the SQL migration and executable RLS tests for the actual database enforcement. Research archive pointers are private operator configuration and must not be committed to this public repository if sensitive.

## Readiness and failure behavior

Without a selected Supabase project, account creation/sign-in shows unavailable configuration, Explore remains empty, and the console cannot be opened. Provider failure must not return fake success, synthetic questions or an authenticated local profile. Without moderation readiness the community does not accept public submissions. Without reviewed source evidence Learn and Practice publish no scenarios or course previews.

No existing appropriately scoped project was located at audit. The user then selected ACT AI Protocol, free only; Supabase quoted $0/month on Free and a separate `itachis-corner` project (`frxufmwwbegconolevkw`, `eu-central-1`) was created healthy. The unrelated inactive project was not queried or changed. Migrations are applied only after local security checks. Email delivery, OAuth, storage uploads, account deletion and provider errors require separate end-to-end verification; project creation is not evidence that those flows are ready.

## Versioning and operations

- Base repository/branch/SHA: `akadaan310/ITACHIScorner`, `ccr-cea0c280-gyikbx`, `b987ebb58c649f0c724cc5ace545ea2e8f7ed1d3`.
- Feature branch: `feat/evidence-first-foundation`; isolated UI, data, research and QA worktrees feed one integrator.
- Supabase packages are pinned: JS `2.118.0`, SSR `0.12.7`, CLI `2.121.0`. Current changelog and docs were consulted: explicit Data API grants, Node 22+, new-project SMTP/template restrictions and SSR cache headers matter.
- Public safe reads use least privilege. Private account/research responses are not shared-cacheable. Storage buckets are private by default.
- The offline importer does not duplicate the existing corpus-gathering mission. Its handoff locator remains blocked until supplied. No transcript was acquired or added to git.
- Optional model adapters, payment features and credits are inactive. No Modal balance, Stripe resource, marketing channel or deployment was used.

## Delivery verification

The definitive test outcomes and screenshot paths live in [VERIFICATION.md](VERIFICATION.md) and [STATUS.md](../STATUS.md). Architecture intent alone is not a claim that external integrations or all research methods have been verified.
