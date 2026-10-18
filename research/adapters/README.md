# Optional exact source-index adapter

`isnaad.ts` defines the versioned `isnaad-exact-index-v1` boundary. It accepts only a supplied reviewed edition/locus index, an expected engine version and expected index checksum. Matching is exact after NFC and whitespace normalization; offsets refer to the original UTF-16 string. It preserves case and diacritics and reports `index_match_only`.

No approved real source index is supplied, no scripture was retrieved/generated, and no remote ISNAAD repository was integrated or executed. The adapter does not establish interpretation, speaker assertion versus quotation, religious truth or validity of ordinary dialogue analysis. Its `approved_index` reference is supplied metadata; an authenticated editorial system must verify that authority before real use. Tests use only controlled non-scripture strings.

## Private PostgreSQL persistence phase

[`private-supabase.ts`](private-supabase.ts) and [`../private-persist.mjs`](../private-persist.mjs) add an explicit operator phase after the existing local importer. They do not change the network-free import/analysis commands or either reviewed migration. Restricted transcript bodies travel through a direct, certificate-verified TLS PostgreSQL connection into the private `research` schema. No public Supabase client, REST endpoint, browser route or Storage upload is involved. Analysis artifacts remain in the private local archive; this phase does not create discoveries, reviews or public content.

The hosted command accepts only `db.frxufmwwbegconolevkw.supabase.co:5432/postgres`. This deliberately excludes pooled endpoints and other projects. A direct IPv6-capable route is needed; do not enable a paid IPv4 add-on to make the command work. Credentials belong in an authorized server/operator secret environment, never a browser variable, Git file or command argument. `pg@8.16.3` is pinned in the research-only package and lockfile; the frontend has no new database dependency.

Before writes, the adapter verifies the complete immutable local import receipt and every archived source hash using the existing manifest/segment validators. Its serializable transaction checks the actual database session identity and TLS, an existing operator `auth.users` identity with an `admin` staff role, both exact reviewed migrations (local SHA-256 plus remote names/versions/SQL token streams), table privileges, private-schema RLS, anonymous/member policy boundaries, a private `private-corpus` bucket, and a discoverable PostgREST schema configuration excluding `research`. Unavailable or changed checks fail closed. Database error details, SQL, credentials and private paths are never printed.

Every acquired video also needs an **existing** `research.source_permissions` row for `private-research`, with the exact supplied authorization reference and an `approved_by` identity that still has `creator` or `admin` authority. The manifest's permission assertion alone is insufficient. For a first import, an authorized operator must first register safe source/video metadata through the existing staff workflow so that an authorized creator can record clearance; these rows have a video foreign key. This adapter never creates or changes permission records. Rights and staff rows are locked during the transaction, and rights are checked again on receipt replay. Unavailable and rights-pending inventory items remain explicit gaps without importing transcript bodies. Synthetic input is always rejected in hosted mode.

| Supplied data | Existing private mapping |
| --- | --- |
| Canonical source, recording grouping, inventory and availability | `sources`, `recordings`, `videos`; each immutable run also retains the complete manifest snapshot. |
| Source hashes and immutable track/version identities | `source_checksums`, `video_caption_tracks`, `transcript_versions`, `discovery_run_sources`. Tracks are tagged `authorized-export`; supplied format and all language tags remain in the snapshot. |
| Original bodies, role labels and exact half-open millisecond intervals | `transcript_segments` and `video_intervals`; overlaps and 1ms instants are preserved. Speaker confidence stays separate from unassessed evidence confidence. No speaker turns are fabricated. |
| Correction references, segment languages, all track languages/analysis selections, permission assertions and import receipt | Explicit `segment_annotations`, `records` and `import_receipt` fields in `discovery_runs.corpus_snapshot` JSON text. These fields have no dedicated columns in the existing schema. |
| Per-video missing/blocked/available coverage and lineage | `coverage_audits` and a versioned private provenance graph. Import receipts retain exact raw-manifest and canonical-manifest hashes plus importer and adapter code fingerprints. |

All inserts verify existing immutable values instead of replacing a version. A source correction requires the prior supplied hash to exist on the same video/track and appends a new version. The existing correction trigger and conservative manifest invalidation mark prior candidates stale; historical reviews remain attached to their original inputs and cannot approve changed sources. Replaying a previously persisted receipt verifies its immutable rows and current rights, then skips current inventory updates and invalidation, so replaying an old receipt cannot undo a correction or stale newer findings. Imported evidence remains `unassessed`; no creator approval, review decision, curriculum or public read model is written.

Reproduce the operator phase with the project's supported Node version:

```bash
npm ci --prefix research
# Provision the following four values through the private operator environment:
# ITACHI_RESEARCH_DATABASE_URL, ITACHI_RESEARCH_PROJECT_REF,
# ITACHI_RESEARCH_OPERATOR_ID, ITACHI_RESEARCH_DB_ROLE.
# Optional ITACHI_RESEARCH_CA_FILE points to the approved database root certificate.
node research/private-persist.mjs persist \
  --output "$CORPUS_OUTPUT_ROOT" \
  --run "$CORPUS_IMPORT_RUN_ID"
```

No private database connection/operator credential is configured in this recovery session, and no authorized corpus was supplied. The live command therefore stops at configuration preflight; no hosted persistence write was attempted. Hosted identity/migration/advisor observations reported elsewhere are read-only evidence, not a successful persistence run.

Verification uses `npm test` for contract/CLI boundaries and `bash scripts/test-private-persistence.sh` for actual PostgreSQL 17.6. The latter requires the research dependencies and local Docker daemon, applies the unchanged reviewed migrations plus the existing minimal Auth/Storage role-test bootstrap, and runs 43 assertions over controlled synthetic fixtures. It has no network or published port and removes its temporary database. It covers permission rejection and revocation, wrong identity/project, synthetic hosted rejection, migration/RLS/exposed-schema/bucket failures, interval/annotation fidelity, idempotence, correction invalidation, old-receipt replay, mid-transaction collision and database-error rollback, sanitized errors, and anonymous/member read denial. This local harness does not establish hosted credentials or live Supabase configuration.
