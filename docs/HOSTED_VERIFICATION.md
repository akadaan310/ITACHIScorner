# Hosted foundation verification

On 2026-10-18 the user selected **ACT AI Protocol, free only**. Supabase quoted **$0/month**, Free plan. A separate `itachis-corner` project was created in `eu-central-1`: `frxufmwwbegconolevkw`. The unrelated inactive project was not queried for data or modified.

The foundation migration was applied only after local real-Postgres security tests and independent review. Reviewed/applied file: `20261018013721_evidence_first_foundation.sql`; SHA-256 `38ad486802a8815243e54e8a4e2979061f8745a72ef010e4476aed9a350e50de`. It seeds no transcripts, course/book content, source approvals, test users or staff roles.

| Read-only hosted check | Observed result |
| --- | --- |
| Project state | ACTIVE_HEALTHY |
| Public tables / RLS | 17 /17 |
| Private research tables / RLS | 43 /43 |
| `private-corpus` storage bucket | `public=false` |
| Real videos / transcript versions | 0 /0; inventory completeness unknown |
| Published questions / approved curriculum / staff roles | 0 /0 /0 |
| Publishable-key safe public question read | HTTP200, empty array |
| `Accept-Profile: research` transcript REST request | HTTP406, PGRST106: schema not exposed |
| Anonymous profile read | HTTP401,42501: denied |
| Anonymous editorial RPC | HTTP401,42501: denied |
| Auth settings endpoint | HTTP200; email enabled, anonymous sign-ins disabled, signup not disabled |
| Security advisor after foundation installation | Zero findings |

The first performance advisor pass identified 59 uncovered foreign keys and 39 overlapping permissive-policy action evaluations. The installed followup `20261018014553_evidence_query_performance.sql` addresses all of these, adds private immutable episode annotations, and preserves role capabilities without changing the first migration. Followup SHA-256: `8370a63ca06ad164a421e9305cabb970380e30ded5c83b8a5f29c8150dcb2041`. The final hosted advisor reports **zero security findings**, **zero missing-FK-index findings**, and **zero multiple-permissive-policy findings**. Its only remaining result is 72 `unused_index` INFO observations, expected for the empty database. [Advisor explanation](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index). Needed indexes can show “unused” informational notices on an empty application; do not drop source/ownership/search indexes merely to eliminate that notice. See [foreign-key guidance](https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys) and [policy guidance](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies).

The 118 role/publication/advisor assertions ran against isolated real PostgreSQL 17 with minimal local Auth/Storage interfaces, including two members, reviewer, creator, admin and anonymous. They verify the actual migration policies, snapshots, source independence, exact excerpts, stale lineage, revocation and cascades. They do not establish a hosted email/session or Storage HTTP integration. Hosted anonymous API denial checks above are separate evidence.

No real email was sent and no real account was created/deleted for verification. Exact callback allowlists, delivery/SMTP restrictions, consenting test identities, trusted real staff provisioning, server deletion credentials and storage-object cleanup behavior still need the checklist in [AUTH_PRIVACY_SETUP.md](AUTH_PRIVACY_SETUP.md). Local private publishable connection settings are retained outside git; server secret credentials were not obtained or exposed. No website or Edge Function was deployed and no paid service was activated.

Hosted migration history reports foundation `20261018013721` and performance `20261018014553`; local filenames now match exactly, with reviewed content checksums unchanged. No application data was seeded by either migration. The final hosted count is 60 tables with RLS (17 public, 43 research), 0 videos/transcript versions/episodes/published questions/approved units/staff roles, and a private corpus bucket.
