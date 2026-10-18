# Account and privacy foundation

The account UI uses real Supabase SSR APIs. There is no browser profile, simulated sign-in, local staff override, transcript fallback, or payment flow. No delivery of a real email, successful hosted login, or hosted account deletion is claimed by this implementation.

The user selected ACT AI Protocol and authorized a separate free project. The integrator created `itachis-corner` (`frxufmwwbegconolevkw`, eu-central-1); the unrelated inactive project must remain untouched. Migration/application verification belongs in the final `STATUS.md`. This document alone does not establish that a hosted installation, SMTP configuration, or account lifecycle was verified.

## Configuration

Copy `.env.example` to a private `.env.local`, outside public git. Supply the selected creator project's URL and publishable key. `SUPABASE_SECRET_KEY` is optional server-only configuration for hard deletion; it can hold a modern secret key or the compatible legacy service-role key. It must never appear under a `NEXT_PUBLIC_` name. The app's public content query uses the publishable key only.

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

Blank or malformed URL/key configuration produces honest unavailable account states and an empty public collection. No other project is selected automatically. The local CLI's legacy anon JWT is accepted only when its declared role is `anon`; a secret/service-role key is rejected as frontend configuration. Use Node 22 or newer; this workspace was checked with Node 24.

## Database and local checks

The migration is under `supabase/migrations/`; it was generated with pinned Supabase CLI 2.121.0. `supabase/config.toml` exposes the public API schema only, not `research`. Explicit grants and RLS are both required: new Supabase tables are no longer automatically exposed to the Data API.

```sh
bash scripts/test-rls.sh
npm test
npm run typecheck
npm run lint
```

The SQL test runner launches an isolated, network-disabled local Postgres 17 container. `bootstrap.sql` supplies minimal Auth/Storage test interfaces; it does not claim to be a full hosted Supabase stack. The tests execute actual PostgreSQL policies as anonymous, two members, reviewer, creator and admin. Synthetic content is confined to test transactions. The migration creates no production content or privileged user.

For full local Auth/email integration, start the pinned Supabase stack with its normal CLI, then use its local URL/anon key and local email inbox. Never point local test fixtures at a hosted database. The hosted install must be reviewed and applied only to the selected creator project. Keep `research` out of the exposed-schema list and acquired-research Storage private.

## Email links and one-time codes

1. Enable email Auth and disable anonymous sign-ins in the selected project. Set the real Site URL and exact permitted callback URLs: `/auth/callback` and `/auth/confirm`. Development `http://localhost:3000` URLs belong only in development redirect configuration.
2. The default flow calls `signInWithOtp` and supports Supabase's PKCE link redirect through `/auth/callback`, exchanging its code with `exchangeCodeForSession`. PKCE links must open in the same browser that requested them.
3. An approved custom email template may instead use `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`; the server verifies that hash with fixed `type: email`. Do not copy untrusted token-type parameters into verification calls.
4. For six digit entry, include `{{ .Token }}` in the sign-in email. `/auth/verify` accepts only six digits and email verification. The UI says to use the code form only when the email includes a code.
5. New Free projects cannot customize Auth email templates while using default Supabase SMTP under the 2026-06-03 policy. Custom SMTP and its associated approval/configuration are needed for a branded code template. Default SMTP has recipient and rate limits; do not claim production email readiness until actual authorized delivery is checked.
6. Verify a real requested email, valid/expired/reused code or link, refresh, sign-out and fresh protected-page request. No email is sent by unit, SQL or default browser tests.

The server checks Auth errors before reporting that mail was sent. Input failures, rate limits and delivery/provider failures produce separate retry states. `next` redirects accept local paths only, reject controls/backslashes/encoded authority forms, and cannot redirect into auth or account APIs. POST actions require an exact same-origin Origin header. Personal responses use private/no-store cache headers.

## Sessions and trusted staff

`@supabase/ssr` clients are request-scoped. The Next.js 16 `src/proxy.ts` refreshes sessions with `getClaims`, propagating both refreshed cookies and Supabase's cache headers. Server operations revalidate `getUser`; an anonymous Auth identity cannot act as a member. Missing/expired sessions and provider outages have different UI states. Authorization never reads `user_metadata` or localStorage.

Create staff only through an authorized SQL/operator workflow, using a real verified Auth user UUID:

```sql
insert into public.creator_staff (user_id, role)
values ('<verified-auth-user-uuid>', 'reviewer');
```

Valid roles are `reviewer`, `creator`, `admin`; ordinary member credentials cannot provision or change these rows. Role revocation takes effect from the database rather than waiting on a stale JWT role claim. Review and creator authorization are independent. Reviewers cannot impersonate creators, self-approve source permissions, or bypass source/publication requirements. No default admin account or password is seeded.

`/studio/creator` checks the actual session and trusted roles before requesting `get_editorial_queue()`. That RPC supplies private gap/review metadata, not transcript bodies. It is not a publishing console: this implementation contains no button that manufactures an editorial or creator approval. An empty queue is not evidence of corpus completeness.

## Member data and privacy

The authenticated owner can save a private nickname, language/motion/update preferences, self-entered YouTube/TikTok handles and publication consent. Account links remain explicitly self-entered; OAuth ownership, attendance and identities are not inferred. Update delivery remains off. Consent withdrawal appends a decision, and does not retroactively invent moderation/publication decisions.

No intention/religious-history question is collected. Browser legacy demo data is neither uploaded nor used as account data. There is no member upload interface. Reviewed public summaries are separate from research transcripts and owner account rows.

`GET /api/account/export` revalidates the member and reads all supported owner tables in stable 500-row pages, with ownership predicates and RLS. It includes a limited Auth identity (ID, email, creation time), not sessions, access/refresh tokens, provider secrets, private research or another member's data. An error or a synchronous export with 50,000 or more records in one table fails without returning a misleading partial file. Large account export needs a future private background workflow.

`POST /api/account/delete` requires same-origin intent, a fresh revalidated user, literal `DELETE`, and the server admin adapter. It ignores submitted user IDs, revokes all refresh sessions first, then hard-deletes that Auth user. Owner rows cascade; research audit actors are detached where their records must remain for provenance. Existing JWTs can remain cryptographically valid until expiry, so owned-row foreign keys/cascades and live role lookups block residual personal/staff access. Public data remains public. The UI reports deletion only after the provider confirms it.

Without a server admin key, deletion is explicitly unavailable; it never clears browser state and calls that a deleted account. A user who owns Storage objects may require object cleanup before Supabase permits deletion. That error remains a failed, unconfirmed deletion. Privileged research uploads are operator-managed, not member uploads. Finish a real authorized hosted export/delete check before public release.

The public privacy notice must reflect these implemented categories, limited current readiness, retention of deidentified research lineage, selected hosting/provider, and a real contact/release policy approved by the creator. A privacy contact, legal basis and retention schedule are launch decisions; do not invent them or claim the concept is an approved production service.

## Documentation checked

Checked current Supabase changelog and docs on 2026-10-18:

- https://supabase.com/changelog.md
- https://supabase.com/docs/guides/auth/server-side/creating-a-client
- https://supabase.com/docs/guides/auth/auth-email-passwordless
- https://supabase.com/docs/guides/auth/managing-user-data
- https://supabase.com/docs/reference/javascript/auth-admin-deleteuser
- https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically
- https://supabase.com/changelog/46599-changes-to-email-template-customisation-on-free-tier
- https://supabase.com/changelog/45715-deprecation-notice-dropping-support-for-node-js-20

Also read installed Next.js 16 proxy, cookies and route-handler guides before implementation.
