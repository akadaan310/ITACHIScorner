# Authorized corpus handoff

This is the private import/analysis contract for future authorized corpus inputs. It does not acquire videos. The owner clarified that no task has been assigned to Dot; Codex has not assigned or contacted Dot or started acquisition. No compatible authorized archive was supplied during the foundation work. Verified imported real videos and transcript versions are both **0**. Any future acquisition must establish inventory ownership, acquisition permissions and the private destination.

## Handoff package

Supply a safe manifest and an authorized private archive. Record the corpus repository or owner, immutable snapshot/version, private archive pointer, manifest checksum, source permissions and known gaps. Do not put credentials, personal metadata, private storage URLs or transcript text into the safe manifest or public Git history.

The source handoff can retain the corpus owner's `manifest.ndjson` convention. The immutable private output layout is:

```text
manifests/{canonical_manifest_hash}.ndjson
manifests/raw-{raw_manifest_bytes_hash}.ndjson
videos/{video_id}/tracks/{track_id}/{version}.jsonl
runs/{run_id}/run_manifest.json
coverage/{import_run_id}.json
evidence/{analysis_run_id}/features.jsonl
evidence/{analysis_run_id}/discovery_registry.jsonl
evidence/{analysis_run_id}/transitions.json
evidence/{analysis_run_id}/evaluation.json
evidence/{analysis_run_id}/lineage.json
evidence/{old_analysis_run_id}/invalidations/{new_import_run_id}.json
```

The source manifest keeps every inventoried item, including inaccessible or unavailable items. The version-1 [executable contract](pipeline.ts) uses these fields:

| Record | Fields |
| --- | --- |
| Manifest identity | `schema_version: 1`, `platform: "youtube"`, `video_id`, `recording_id`, `independence_verified`, `canonical_url`, `title`. |
| Inventory | `published_at` and `duration_ms` (nullable when unknown), `discovered_at`, `content_type`, `status`. |
| Acquisition | `permission: { status, reference }`; optional `synthetic` marks controlled test inputs. |
| Tracks | `tracks[]` containing `track_id`, `version`, `relative_path`, `sha256`, `source_format`, `languages[]`, `analysis` and optional `supersedes_sha256`. |
| JSONL segments | `segment_id`, `start_ms`, `end_ms`, `text`, `speaker: { speaker_id, role, confidence }`, `languages[]`, optional `instantaneous` and `correction_of`. |

`content_type` is `video`, `short`, `livestream` or `unknown`. Status is `transcribed`, `caption_unavailable`, `rights_pending`, `private`, `deleted`, `retryable_error` or `not_transcribed`. Permission status is `creator_authorized`, `licensed`, `pending` or `synthetic_test`. These fields record the supplied acquisition assertion; the importer cannot authenticate the permission reference. Pending permissions do not become rights clearance, and synthetic fixtures do not become real evidence. Speaker roles are `creator`, `guest`, `moderator` or `unknown`. Publication/discovery timestamps require calendar-valid RFC3339 with an explicit timezone; validation does not remotely verify their factual accuracy. Unavailable inventory items must not be silently treated as transcribed or omitted. Undeclared manifest fields are rejected rather than copied into safe metadata.

Set `recording_id` to group videos/clips derived from one underlying recording. Declare track identity/version, exact-byte checksum and `analysis` selection. Every transcribed source must explicitly select exactly one analysis track; never count translations, duplicate captions or corrected versions as independent recordings. Keep supplied grouping distinct from the `independence_verified` assertion: the harness reports both supplied and asserted-verified counts but does not establish independence itself. JSONL source records preserve original text, speaker/role annotations, segment IDs, original timestamp intervals, language/provenance where available and correction history. No diarization or personal identity is implied by an unknown label. Segments are not aggregated into speaker turns.

Intervals are `[start_ms, end_ms)` with nonnegative integer milliseconds and at least 1ms duration. Real subsecond turns and overlaps are valid. A detected instant needs the instantaneous flag and a 1ms interval. Do not round short turns to a second or flatten overlaps to make analysis easier.

## Private local commands

Run the CLI with the project-required Node version. Set these variables to authorized local paths; the placeholders are not a supplied dataset. Keep output outside Git worktrees, including nested repositories. The importer rejects an output path with a symlink component or a canonical ancestor containing `.git`, and rejects source paths that escape the supplied source root through symlinks. Source and output trees must not overlap. Source is read-only: controlled test fixtures may be inside a repository, but restricted real transcripts must not be committed to public Git. Output must be dedicated to this corpus; invalidation scope treats its earlier analyses as the same corpus and must not touch another project.

```bash
CORPUS_MANIFEST=/absolute/private/corpus/manifest.ndjson
CORPUS_SOURCE_ROOT=/absolute/private/corpus
CORPUS_OUTPUT_ROOT=/absolute/private/itachi-research-output

node research/cli.mjs import \
  --manifest "$CORPUS_MANIFEST" \
  --source "$CORPUS_SOURCE_ROOT" \
  --output "$CORPUS_OUTPUT_ROOT"

CODE_COMMIT=$(git rev-parse HEAD)
node research/cli.mjs analyze \
  --manifest "$CORPUS_MANIFEST" \
  --source "$CORPUS_SOURCE_ROOT" \
  --output "$CORPUS_OUTPUT_ROOT" \
  --seed 42 \
  --code-commit "$CODE_COMMIT"
```

The seed is a reproducibility parameter, not real corpus evidence. Record the commit corresponding to the actual extractor; commit or otherwise record changes before claiming that a code SHA reproduces them. If omitted, the CLI's code-commit metadata defaults to the actual Git HEAD; that still cannot describe uncommitted changes. The CLI reads explicit local files only. These commands do not acquire videos, call paid inference, publish transcripts, upload to Supabase, create a course or deploy the site.

Import writes the canonical and exact original-byte manifest snapshots, versioned raw tracks, per-import coverage and a run manifest at the paths above. Analysis always persists that immutable raw import first, even when no explicit import command preceded it, and references the import receipt. It then writes the five analysis artifacts under `evidence/{analysis_run_id}/` plus its run manifest. Source-byte collisions remain errors across analysis-only invocations. These paths remain under the explicit private output root. The committed `research/manifest.ndjson` and `research/discovery_registry.jsonl` are empty foundation registries; `research/coverage_report.json` records empty real coverage rather than synthetic results.

Analysis evidence retains original text and extraction version privately. `speaker_confidence` is the supplied role/speaker annotation score, while `evidence_confidence: null` and `evidence_confidence_status: "unassessed"` explicitly reserve evidence assessment for review. Main supporting/counterexample arrays and controls are training-only, with separate held-out evidence/opportunity counts. Undated sources remain in full lineage but are excluded from these comparisons. Prediction horizons count segments rather than aggregated turns.

## Acceptance before analysis claims

1. Validate manifest records, IDs, safe relative paths, exact source byte hashes, immutable version collisions, segment identifiers, roles and intervals. Reject unsafe paths rather than searching other directories for a similarly named file.
2. Re-import the same version and verify deterministic identity/checksums. Corrections receive a new version and retain the prior lineage; conflicting versions are not overwritten.
3. Reconcile the supplied inventory against the corpus owner's canonical permitted listings. Report inventory completeness separately from transcript availability and analysis eligibility. A supplied manifest alone cannot prove exhaustive coverage.
4. Spot-check actual original URLs, timestamp deep links, transcript spans, very short turns, overlaps and manual role corrections. A successful parse does not validate transcription quality.
5. Retain the private archive pointer/checksum, import receipt, coverage report and run manifest. Inspect that reports/logs do not leak transcript bodies or sensitive pointers into public artifacts.
6. Run fixed-candidate held-out evaluation, controls and recording-group bootstrap only when sufficient eligible real data exists. Report unavailable estimates and confounders honestly; keep every finding pending for human review.

## Corrections and later adapters

A corrected transcript, changed recording grouping, analysis-track selection, annotation or extraction configuration can change findings. Import appends `evidence/{old_analysis_run_id}/invalidations/{new_import_run_id}.json` when a corrected source or changed canonical manifest snapshot invalidates earlier analyses. Its `stale_node_ids` and `revalidation_queue` preserve historical artifacts while conservatively flagging the old full-corpus analysis. Effective validity requires checking these overlays; the immutable original candidate's `stale: false` is not sufficient. Revalidate through a new analysis and review rather than leaving an old approval attached to a new source hash. Code/configuration dependencies also support traversal and require reanalysis when changed.

Database persistence maps fields explicitly into the private snake_case `research` model. Local imports do not establish that remote credentials, migrations, RLS or reviewer identities have been verified. Public read models accept only separately reviewed safe summaries and exact approved source metadata, never automatic transcript copies.

The separate [private PostgreSQL persistence adapter](adapters/README.md#private-postgresql-persistence-phase) now consumes completed immutable import receipts without replacing this importer. It uses the intended project's direct verified TLS endpoint, authenticated operator/creator permission records and transactional explicit mappings into the existing `research` schema. Missing private credentials, operator identity, exact migrations, discoverable private API configuration or source clearance block all database writes. Initial safe source/video registration and creator clearance must precede restricted-text persistence. No hosted write was performed in this session; the adapter's actual PostgreSQL integration evidence is synthetic only. Importing or analyzing never marks evidence reviewed, and an old receipt replay cannot roll a corrected current inventory back.

Creator authorization, qualified scholarly/content review where needed, adequate coverage, independently replicated findings and Gate 4 approval remain separate prerequisites for educational attribution. No curriculum or book authoring handoff is authorized merely because an import or statistical test succeeds.
