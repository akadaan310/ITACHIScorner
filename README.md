# Itachi's Corner

**Independent concept — unaffiliated and not yet endorsed.** An undeployed creator-first application for da'wah, learning and dialogue, with a private evidence-first research foundation. Creator approval, an actual corpus handoff, editorial review and a selected Supabase project remain release gates.

Public pages contain no fictional catalogue, course, book, practice scenarios, event activity or members. Missing evidence produces purposeful empty states. Existing demo journeys redirect to Home, Explore, Learn, Practice, Community and honest secondary pages. Accounts use real configurable Supabase Auth; browser demo profiles cannot sign in or unlock staff tools.

## Local development

Use Node 22+ (Node 24 used for this branch).

```bash
npm ci
npm run dev
```

The site works without credentials as an honest unconfigured shell. To enable real accounts, follow [AUTH_PRIVACY_SETUP.md](docs/AUTH_PRIVACY_SETUP.md), select a separate appropriately scoped Supabase project and apply reviewed migrations. Never use an unrelated project or put a server secret in a `NEXT_PUBLIC_` variable. Remote SMTP/OAuth and account lifecycle actions must be verified before claiming integration readiness.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Playwright uses a production build on port 3200. The screenshot project captures 360, 390, 768, 1280 and 1440 px. See [VERIFICATION.md](docs/VERIFICATION.md) for exact outcomes, browser setup, RLS command, limitations and screenshot locations. Synthetic research fixtures are test-only and never render in the application.

## Evidence workflow

The corpus manifest is the source of truth. This repository does **not** acquire videos or replace the existing corpus-gathering mission. The offline importer accepts authorized private archives, validates versions/checksums/precise source intervals and records honest coverage. Deterministic discovery baselines produce traceable proposals and controls; human review and creator permission precede educational attribution and publication.

No verified corpus was available during initial implementation. Zero imported videos/transcripts is not evidence that the channel has no videos or that inventory collection is complete. No Itachi-derived curriculum or book manuscript has been written.

## Documentation

- [STATUS.md](STATUS.md): delivery and separate corpus/credentials/creator blockers.
- [Mission](docs/MISSION_EVIDENCE_FIRST.md), [constitution](docs/PRODUCT_CONSTITUTION.md), [architecture](docs/EVIDENCE_FIRST_ARCHITECTURE.md).
- [UX audit](docs/UX_AUDIT.md), [refactor map](docs/REFACTOR_MAP.md), [asset provenance](docs/ASSET_PROVENANCE.md).
- [Research methodology](research/methodology.md), [graph schema](research/graph_schema.md), [limitations](research/limitations.md), [coverage](research/coverage_report.md).
- [Release gates](docs/RELEASE_GATES.md), [auth/privacy setup](docs/AUTH_PRIVACY_SETUP.md), [monetization architecture](docs/MONETIZATION_ARCHITECTURE.md).

Next.js App Router · React · strict TypeScript · Tailwind · Supabase SSR/Postgres/RLS · Vitest · Playwright/axe. Existing self-hosted typography and masked concept asset are preserved with provenance and approval restrictions.

**Execution boundary:** commit/push a feature branch only. No deployment, paid inference, Modal spending, payment activation, marketing or transcript publication.
