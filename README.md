# Itachi's Corner

**Independent concept — unaffiliated and not yet endorsed.** A creator-first application for da'wah, learning and dialogue, with a private evidence-first research foundation. Creator approval, authorized corpus inputs, editorial review and hosted account lifecycle verification remain release gates.

Public pages contain no fictional catalogue, course, book, practice scenarios, event activity or members. V4 restores a creator-visible phone hero, hand-traced signature study, seven homepage movements, interactive question walkthrough, source search/view selection, a separate private writing practice and owner-scoped account activity. Five primary destinations are Explore, Learn, Practice, Community and My Corner; Home is the logo. The writing desk holds only the visitor's own words in memory; it supplies no religious answer or attributed method. Existing demo journeys redirect to truthful destinations. Accounts use real configurable Supabase Auth; browser demo profiles cannot sign in or unlock staff tools.

Current mission: [V4 creator-first](docs/MISSION_V4_CREATOR_FIRST.md). [Rendered before/after audit](docs/UX_ARCHITECTURE_AUDIT_V4.md) · [Brand study](docs/BRAND_IDENTITY_V4.md) · [GitHub/Vercel evidence](docs/VERCEL_GITHUB_VERIFICATION_V4.md). Production branch and deployed SHA require authenticated Vercel configuration; an existing public alias is not proof of this branch's deployment.

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

Playwright uses a production build on port 3200. The screenshot project captures 360, 390, 768, 1280 and 1440 px into the V4 archive, preserving earlier evidence-first and recovery images. See [VERIFICATION_V4.md](docs/VERIFICATION_V4.md) for current checks and [RECOVERY_VERIFICATION.md](docs/RECOVERY_VERIFICATION.md) for the earlier delivery. Synthetic research fixtures are test-only and never render in the application.

## Evidence workflow

Codex owns acquisition as well as import and analysis. The V4 run verified the official hub and stable channel, attempted the official listings and captions path, and imported **9 provisional indexed metadata records** privately using the existing CLI. Those records are not verified official-channel memberships: **0 verified official items, 0 transcripts and 0 real findings**. Official listing access is blocked; the channel denominator remains unknown. No task has been assigned to Dot.

See [actual acquisition coverage](docs/CORPUS_ACQUISITION_V4.md) and [portable private-package receipt](research/v4-corpus-private-receipt.json). Restricted text stays outside public Git. Creator permission, exact source lineage, qualified editorial review and representative real data remain prerequisites for any attributed curriculum or book. No substantive manuscript or course has been written.

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
