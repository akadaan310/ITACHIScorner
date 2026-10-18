# Itachi's Corner

**Independent concept — unaffiliated and not yet endorsed.** An undeployed creator-first application for da'wah, learning and dialogue, with a private evidence-first research foundation. Creator approval, authorized corpus inputs, editorial review and hosted account lifecycle verification remain release gates.

Public pages contain no fictional catalogue, course, book, practice scenarios, event activity or members. Home combines the creator invitation, source-review disclosures, a temporary visitor-owned writing desk and contextual Learn, Practice, Community and My Corner journeys. The writing desk holds only the visitor's own words in memory; it supplies no religious answer or attributed method. Existing demo journeys redirect to truthful destinations. Accounts use real configurable Supabase Auth; browser demo profiles cannot sign in or unlock staff tools.

## Local development

Use Node 22.18+ (Node 24 used for this branch).

```bash
npm ci
npm run dev
```

The site works without credentials and clearly explains account availability. The selected project is `itachis-corner` (`frxufmwwbegconolevkw`) in ACT AI Protocol on the Free plan; both reviewed migrations are installed. Follow [AUTH_PRIVACY_SETUP.md](docs/AUTH_PRIVACY_SETUP.md) for configuration. Never use an unrelated project or put a server secret in a `NEXT_PUBLIC_` variable. Remote SMTP/OAuth and account lifecycle actions must be verified before claiming integration readiness.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Playwright uses a production build on port 3200. The screenshot project captures 360, 390, 768, 1280 and 1440 px into the recovery archive, preserving the earlier evidence-first images. See [RECOVERY_VERIFICATION.md](docs/RECOVERY_VERIFICATION.md) for current checks and [VERIFICATION.md](docs/VERIFICATION.md) for the earlier foundation. Synthetic research fixtures are test-only and never render in the application.

## Evidence workflow

The corpus manifest is the source of truth. This repository implements import and analysis; it has not started a corpus acquisition job. The owner has not assigned anything to Dot, and Codex has not assigned or contacted Dot. The offline importer accepts authorized private archives, validates versions/checksums/precise source intervals and records honest coverage. Deterministic discovery baselines produce traceable proposals and controls; human review and creator permission precede educational attribution and publication.

Bounded recovery discovery also found no authorized handoff. Actual imported videos and transcript versions remain **0**; the complete inventory denominator is unknown. This does not mean the channel has no videos. The earlier request to retrieve an existing Dot archive is [withdrawn](docs/CORPUS_HANDOFF_NEEDED.md). An initial authorized acquisition task still needs to be established; there is no confirmed Dot task to wait for. No Itachi-derived curriculum or book manuscript has been written.

The existing offline importer remains authoritative. A separate Node-only, permission-aware PostgreSQL adapter adds private persistence without exposing the research schema or transcript bodies through public REST. Hosted transfer requires a verified private operator connection and current source permissions; local test success does not establish hosted transfer readiness. See [the adapter contract](research/adapters/README.md).

## Documentation

- [STATUS.md](STATUS.md): delivery and separate corpus/credentials/creator blockers.
- [What happens next](docs/WHAT_HAPPENS_NEXT.md), [recovery mission](docs/MISSION_RECOVERY_AND_CORPUS.md), [decision map](docs/RECOVERY_DECISION_MAP.md), [corpus discovery](docs/CORPUS_DISCOVERY.md).
- [Mission](docs/MISSION_EVIDENCE_FIRST.md), [constitution](docs/PRODUCT_CONSTITUTION.md), [architecture](docs/EVIDENCE_FIRST_ARCHITECTURE.md).
- [UX audit](docs/UX_AUDIT.md), [refactor map](docs/REFACTOR_MAP.md), [asset provenance](docs/ASSET_PROVENANCE.md).
- [Research methodology](research/methodology.md), [graph schema](research/graph_schema.md), [limitations](research/limitations.md), [coverage](research/coverage_report.md).
- [Release gates](docs/RELEASE_GATES.md), [auth/privacy setup](docs/AUTH_PRIVACY_SETUP.md), [monetization architecture](docs/MONETIZATION_ARCHITECTURE.md).

Next.js App Router · React · strict TypeScript · Tailwind · Supabase SSR/Postgres/RLS · Vitest · Playwright/axe. Existing self-hosted typography and masked concept asset are preserved with provenance and approval restrictions.

**Execution boundary:** commit/push a feature branch only. No deployment, paid inference, Modal spending, payment activation, marketing or transcript publication.
