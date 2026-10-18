# Evidence-first database contract

Migration: `supabase/migrations/20261018012022_evidence_first_foundation.sql`, created by the pinned Supabase CLI 2.121.0 with `supabase migration new evidence_first_foundation`. It contains schema and private bucket configuration, and **no production content or staff seed**. The local API exposes only `public`, disables automatic grants for new tables, and requires explicit email confirmation with exact local callback/confirmation redirect URLs. `research` must remain outside the Data API exposed schemas. Local seed loading is disabled.

## Account and privacy records

Every owner record references `auth.users(id) ON DELETE CASCADE`. `profiles` uses `id`; every other owner table uses `user_id`. `member_preferences.user_id` is its primary key. Other owner tables have an `id` UUID primary key suitable for stable export pagination. A new user has no profile until onboarding writes it.

| Public table | Main fields and behavior |
| --- | --- |
| `profiles` | `id`, `nickname` (1–80 characters), `created_at`; owner only |
| `member_preferences` | `user_id`, `languages text[]`, `reduced_motion`, `email_updates`; owner only |
| `consents` | `id`, `user_id`, `scope`, `granted`, `recorded_at`; consent is scoped, never inferred from an external handle |
| `account_links` | `id`, `user_id`, `platform` (`youtube` / `tiktok`), `handle`, `verification`, `created_at`; unique `(user_id,platform)` |
| `privacy_requests` | `id`, `user_id`, `kind` (`export` / `delete`), `status`, `created_at`; members can request actions but cannot mark them completed |
| `saved_questions` | `id`, `user_id`, `question_id`, `created_at`; references visible `published_questions`, never private research IDs; publication withdrawal cascades saves |
| `learning_notes` | `id`, `user_id`, nullable `unit_id`, `body`, `created_at`; withdrawing a unit nulls the reference and preserves the note |
| `learning_progress` | `id`, `user_id`, nullable `unit_id`, `progress` in `[0,1]`, `updated_at`; self-recorded progress, not awarded XP |
| `practice_attempts` | `id`, `user_id`, `scenario_reference`, `response`, nullable `score`, `created_at`; member insertion cannot supply an authoritative score |
| `community_questions` | `id`, `user_id`, `body`, `publication_consent`, `status`, `created_at`; private by default, member writes cannot change moderation status |
| `participation_events` | `id`, `user_id`, optional `event_id`, `kind`, `verified`, `recorded_by`, `created_at`; owner read only, staff/operator writes; no automatic off-platform verification |
| `quest_ledger` | `id`, `user_id`, `points`, `reason`, optional `participation_id`, `created_at`; owner read only; points are separate from monetary balances |
| `wallet_ledger` | `id`, `user_id`, `amount_minor bigint`, three-letter `currency`, `reason`, nullable unique `provider_event_id`, `created_at`; owner read only; no payment integration is activated |

Members can create and update only `self-entered` account links. An `oauth-verified` link cannot be modified by its owner; unlinking is allowed. No OAuth adapter is implemented or implied by this schema. Trusted verification writes require a server/operator integration that independently validates the external provider.

`creator_staff(user_id,role)` is a trusted assignment table with roles `reviewer`, `creator`, and `admin`. Members can read their own assignments and cannot insert, update, or delete assignments. Provisioning is an explicit operator task. Authorization never reads user-editable JWT metadata. Source/review actors use `ON DELETE SET NULL`; removal of an actor invalidates the associated publication gates.

## Private source and discovery records

All external IDs are opaque `text`, including platform, video, track, transcript version, segment, run, candidate, graph and evidence IDs. UUIDs are reserved for internal account/editorial records. No transcript body, evidence excerpt, private graph, or draft curriculum is copied into a public table.

| Research tables | Purpose and keys |
| --- | --- |
| `sources` | Canonical source identity, platform, URL and acquisition time |
| `recordings` | Original recording identity and documentary independence reference; multiple clips may share one recording |
| `videos` | Source FK, URL/title, duration/publication time, discovery time, content type/status/availability, `is_synthetic` default true, nullable `recording_id`, `independence_verified` default false |
| `source_checksums` | PK `(video_id,source_sha256)`; SHA-256 plus private archive pointer |
| `video_caption_tracks` | PK `(video_id,track_id)`; language and manual/automatic/export/ASR-draft kind |
| `transcript_versions` | PK `(video_id,track_id,transcript_version)`; source hash FK and database import sequence; immutable updates |
| `transcript_segments` | PK `(video_id,track_id,transcript_version,segment_id)`; exact text, interval, speaker ID and attributed role; immutable updates |
| `video_intervals` | Exact source interval record with segment/version/hash FKs, speaker, confidence, source URL and `instantaneous` |
| `speaker_turns`, `speech_acts` | Attributed turn, reply/diarization metadata and proposed structural speech-act labels with method/confidence |
| `coverage_audits` | Covered/missing/partial/unavailable/rights-blocked/unknown status, reason, manifest hash and audit time |
| `source_permissions` | Per-video scoped authorization and nonempty written authorization reference, creator actor and date |
| `claims`, `questions`, `argument_steps` | Source-backed observations and typed claim/premise/objection/rebuttal links |
| `evidence_items`, `citation_links` | Exact private excerpt, extraction method/version, confidence and primary/Qur'anic/quotation/paraphrase reference verification |
| `discovery_runs` | Code commit, config hash, manifest hash, corpus snapshot, algorithm and synthetic status |
| `discovery_run_sources` | Every input version/hash, including corpus, contrast and control inputs; hashes are constrained to actual transcript versions |
| `extraction_jobs` | Versioned normalization/diarization/annotation/mining/validation job, status/timing/failure and nonnegative cost record |
| `motif_candidates`, `candidate_evidence` | Definition, hypothesis, uncertainty, confounders and typed support/counterexample links |
| `hypotheses`, `hypothesis_tests` | Alternative explanations and hash-backed falsification/matched-contrast/robustness/replication reports |
| `review_decisions`, `creator_approvals`, `scholar_qualifications` | Independent editorial decisions, separately attributed written creator authorization and qualified scholarly review |
| `graph_versions`, `graph_nodes`, `graph_edges` | Separate provenance/dialogue/argument/evidence/motif/learning/causal-hypothesis graphs; graph-local composite node FKs; observed edges require provenance |
| `candidate_lineage` | Acyclic parent/child finding dependencies, used for correction propagation |
| `learning_objectives`, `draft_curriculum_units`, `source_unit_links` | Private objective/rubric, draft/exercise/uncertainty and evidence links; no substantive production curriculum is seeded |
| `editorial_reviews`, `unit_creator_approvals` | Separate unit-level editorial and creator decisions |
| `question_publication_drafts`, `question_publication_reviews`, `question_creator_approvals` | Exact safe public question payload and independent editorial/creator approvals bound to its current snapshot |
| `moderation_actions`, `session_notes`, `creator_settings` | Private moderation history, real-session notes, and creator consent settings; no live integration is assumed |

Intervals are nonnegative integer `bigint` half-open ranges `[start_ms,end_ms)` with `end_ms > start_ms`. One-millisecond and subsecond spans are valid; overlapping segments are valid. `instantaneous=true` requires exactly one millisecond. Triggers require an interval to remain inside its referenced segment, with the same source hash, speaker ID and speaker role. Evidence excerpts must occur exactly in the referenced segment text. Segment containment does not prove word-level alignment within a subsegment; editorial source review remains required. Interval lookup indexes start with `(video_id,start_ms,end_ms)`.

`speaker_confidence` describes only attribution. `video_intervals.evidence_confidence` and `evidence_items.confidence` are nullable and explicitly `unassessed` until reviewed. Publication requires assessed evidence-item confidence; attribution confidence never substitutes for evidence quality. Importer `original_text` maps to private segment text/excerpt, and its `extraction_version` is stored separately from the algorithm name.

Importer handoff span:

```text
source_id, video_id, track_id, transcript_version, segment_id,
start_ms, end_ms, source_sha256, speaker_id, speaker_role,
evidence_confidence, source_url
```

`source_id` is resolved through `videos.source_id`; the remaining provenance fields map directly to `video_intervals` and its composite source keys. Private text remains in the authorized external archive and private schema. The importer does not automatically write this database.

Corrections require a new transcript version. A new checksum marks candidates from **all** run inputs stale, including unselected negative/control inputs, and recursively marks descendants stale. Publication also checks for superseded input hashes, so clearing a boolean does not restore old approvals. Revalidation requires a new/current source-backed run and human decisions. The lineage trigger rejects cycles.

## Publication boundary

`published_questions` is a safe read model:

```text
id, question_id, candidate_id, title, summary, source_url, video_id,
start_ms, end_ms, speaker, confidence, reviewed_at, creator_approved_at,
search_document (generated tsvector), approval_sha256 (server-set revision)
```

Public consumers select only `id,title,summary,source_url,video_id,start_ms,end_ms,speaker,confidence,reviewed_at,creator_approved_at`. There is no status column or fallback content. Public video IDs must be canonical eleven-character YouTube IDs. A database check requires the exact safe URL `https://www.youtube.com/watch?v=<id>&t=<floor(start_ms/1000)>`. Full-text search uses a generated `simple`-configuration document and GIN index; the app can use `textSearch('search_document',query,{type:'websearch',config:'simple'})`.

The unexposed boolean publication functions require actual relational evidence, rather than a JSON approval flag:

1. A nonsynthetic, nonstale candidate and reproducible run with current hash-backed inputs.
2. Supporting evidence from at least two independently verified **original recordings**. Different uploads/clips from one recording count once. All linked evidence must be real, mapped into the run and covered by creator-approved excerpt authorization.
3. A real counterexample, successful falsification and matched-contrast test reports, and separate accepted evidence/falsification/contrast reviewer decisions.
4. Written creator authorization by a different actor from each accepted reviewer. Trusted database roles are checked on every read.
5. A qualified scholarly decision when the candidate concerns theology.
6. Public source metadata matching an actual supporting interval.

Every editorial and creator decision stores a server-computed SHA-256 of the actual candidate input pack, including run inputs, source versions, attributed intervals, exact evidence, hypotheses and control reports. Unit snapshots additionally include the complete draft, public summary, objective, rubric and source links. Question snapshots include its complete intended public payload. Approval writes use server timestamps. Changing a reviewed input or wording invalidates prior decisions, even if its stable ID remains the same. Parent snapshots are hashed recursively through the lineage DAG, and every parent must remain currently eligible; parent evidence/control edits, review rejection and creator withdrawal also block descendants. Lineage edge checks are serialized to prevent concurrent cycle creation.

`approved_curriculum_units(id,title,summary,objective,published_at,approval_sha256)` additionally requires the objective's eligible candidate, two linked independent sources, accepted unit review, and separate written unit creator approval. Public payload triggers require exact equality with the approved wording and source metadata. They bind the stored publication digest to the content snapshot and actual decisions, including dates and actors. Public SELECT compares that digest with the current revision: reapproving changed private content does **not** expose an older public payload before exact republishing. Reviewer updates cannot replace a summary, objective, confidence or review date under an old authorization.

Public SELECT always reevaluates gates. Revoked rights, deleted actors, synthetic evidence, superseded hashes, or stale lineage immediately hide affected rows. Reviewers do not get an alternate ungated SELECT policy. Creators may renew or revoke their own candidate, question-wording and unit approvals; reviewers may renew their own decisions. Unit reviews are unique per `(unit_id,reviewer_id)`, and any current rejecting reviewer blocks unit publication until that decision is renewed. Publication withdrawal or republishing a currently hidden row is an operator/server service-role action, since hidden rows cannot be selected for an ordinary member update. Private drafts remain available to staff.

`events` contains scheduled metadata only. Its published records require an explicit creator/admin write. It does not prove off-platform attendance or streaming availability.

## Privileges and safe staff status

All `public` and `research` tables have RLS enabled. Explicit grants are independent of policies. Owners see their own account rows. Staff can inspect private research through RLS when using a database connection; research is not a Data API schema. Reviewers can create their own editorial decisions; creators can supply their own authorization. Neither can impersonate the other role or actor. Admin/operator research writes are privileged, but actor-specific review/authorization policies still require the signed-in actor.

The server uses the authenticated client's `public.get_editorial_queue()` RPC, returning only:

```text
kind ('gap'|'review'), id, title, status, video_id (nullable), created_at
```

An authenticated member receives zero rows; anonymous invocation is denied. A narrowly scoped private definer performs the role check before returning status summaries. The public wrapper is security invoker. No app secret is needed for staff reads. Read helpers fix an empty search path, revoke default public execution, and return booleans/status summaries only. A separate unexposed correction trigger propagates staleness.

Storage bucket `private-corpus` is private. Staff may read its objects; only admin/operator writes are allowed. No public object policy or synthetic content seed is installed.

## Verification and deployment limits

Run `bash scripts/test-rls.sh`. It starts an ephemeral `postgres:17.6` container using the local Docker socket, with no published ports and `--network none`, applies the migration, exercises real PostgreSQL roles, and removes the container. Fixtures exist only in `supabase/tests/rls.sql`; they never load through Supabase seeds or the application.

The harness has local adapters for `auth.users`, `auth.uid()` and storage tables so real PostgreSQL can test grants, RLS, SQL functions, checks and cascades. It does **not** test hosted Auth delivery, GoTrue session invalidation, PostgREST exposure configuration, Storage HTTP behavior or SMTP. The final local run passed 96 assertions using real anonymous/member A/member B/reviewer/creator/admin PostgreSQL roles. These cover ownership, escalation, verification forgery, private transcript isolation, publication gates, content snapshot mutation/reapproval, creator revocation/renewal, research corrections, withdrawal and user deletion. `npm test` also passed all 51 application tests in this worktree.

`supabase db advisors --local --type security --fail-on error` was attempted and could not connect to `127.0.0.1:54322`, because this harness runs isolated PostgreSQL rather than the full Supabase stack. Hosted advisors remain a separate installation check; no clean-advisor claim is made from these tests.

Before a remote migration, independently review the SQL and the selected project. Apply only to the authorized project, keep `research` unexposed, and run hosted security/performance advisors and equivalent smoke tests after installation. The server secret must remain server-only. No remote project was changed by this database workstream.
