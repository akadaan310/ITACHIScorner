# Authorized corpus handoff

This is a compatible import/analysis layer for the existing corpus mission, not a new harvesting project. No compatible authorized archive was supplied during the foundation work. Verified imported real videos and transcript versions are both **0**. The corpus owner retains inventory ownership, acquisition permissions and the private destination.

## Handoff package

Supply a safe manifest and an authorized private archive. Record the corpus repository or owner, immutable snapshot/version, private archive pointer, manifest checksum, source permissions and known gaps. Do not put credentials, personal metadata, private storage URLs or transcript text into the safe manifest or public Git history.

The archive convention is:

```text
manifest.ndjson
videos/{video_id}/tracks/{track_id}/{version}.jsonl
runs/{run_id}/run_manifest.json
coverage/coverage_report.json
evidence/
```

The source manifest keeps every inventoried item, including inaccessible or unavailable items. The version-1 [executable contract](pipeline.ts) uses these fields:

| Record | Fields |
| --- | --- |
| Manifest identity | `schema_version: 1`, `platform: "youtube"`, `video_id`, `recording_id`, `independence_verified`, `canonical_url`, `title`. |
| Inventory | `published_at` and `duration_ms` (nullable when unknown), `discovered_at`, `content_type`, `status`. |
| Acquisition | `permission: { status, reference }`; optional `synthetic` marks controlled test inputs. |
| Tracks | `tracks[]` containing `track_id`, `version`, `relative_path`, `sha256`, `source_format`, `languages[]`, `analysis` and optional `supersedes_sha256`. |
| JSONL segments | `segment_id`, `start_ms`, `end_ms`, `text`, `speaker: { speaker_id, role, confidence }`, `languages[]`, optional `instantaneous` and `correction_of`. |

`content_type` is `video`, `short`, `livestream` or `unknown`. Status is `transcribed`, `caption_unavailable`, `rights_pending`, `private`, `deleted`, `retryable_error` or `not_transcribed`. Permission status is `creator_authorized`, `licensed`, `pending` or `synthetic_test`. These fields record the supplied acquisition assertion; the importer cannot authenticate the permission reference. Pending permissions do not become rights clearance, and synthetic fixtures do not become real evidence. Speaker roles are `creator`, `guest`, `moderator` or `unknown`. Unavailable inventory items must not be silently treated as transcribed or omitted.

Set `recording_id` to group videos/clips derived from one underlying recording. Declare track identity/version, exact-byte checksum and `analysis` selection. Every transcribed source must explicitly select exactly one analysis track; never count translations, duplicate captions or corrected versions as independent recordings. JSONL source records preserve original text, speaker/role annotations, segment IDs, original timestamp intervals, language/provenance where available and correction history. No diarization or personal identity is implied by an unknown label.

Intervals are `[start_ms, end_ms)` with nonnegative integer milliseconds and at least 1ms duration. Real subsecond turns and overlaps are valid. A detected instant needs the instantaneous flag and a 1ms interval. Do not round short turns to a second or flatten overlaps to make analysis easier.

## Private local commands

Run the CLI with the project-required Node version. Set these variables to authorized local paths; the placeholders are not a supplied dataset. Keep output outside Git worktrees, including nested repositories. The importer rejects an output path with a symlink component or a canonical ancestor containing `.git`, and rejects source paths that escape the supplied source root through symlinks. Source is read-only: controlled test fixtures may be inside a repository, but restricted real transcripts must not be committed to public Git. Output paths must be dedicated to this corpus and must not overwrite another project.

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

Import writes private `manifest.ndjson`, versioned `videos/{video_id}/tracks/{track_id}/{version}.jsonl`, `coverage/coverage_report.json` and `runs/{run_id}/run_manifest.json`. Analysis writes `evidence/{run_id}/features.jsonl`, `discovery_registry.jsonl`, `transitions.json`, `evaluation.json` and `lineage.json`, plus its run manifest. These output paths remain under the explicit private output root. The committed `research/manifest.ndjson` and `research/discovery_registry.jsonl` are empty foundation registries; `research/coverage_report.json` records empty real coverage rather than synthetic results.

## Acceptance before analysis claims

1. Validate manifest records, IDs, safe relative paths, exact source byte hashes, immutable version collisions, segment identifiers, roles and intervals. Reject unsafe paths rather than searching other directories for a similarly named file.
2. Re-import the same version and verify deterministic identity/checksums. Corrections receive a new version and retain the prior lineage; conflicting versions are not overwritten.
3. Reconcile the supplied inventory against the corpus owner's canonical permitted listings. Report inventory completeness separately from transcript availability and analysis eligibility. A supplied manifest alone cannot prove exhaustive coverage.
4. Spot-check actual original URLs, timestamp deep links, transcript spans, very short turns, overlaps and manual role corrections. A successful parse does not validate transcription quality.
5. Retain the private archive pointer/checksum, import receipt, coverage report and run manifest. Inspect that reports/logs do not leak transcript bodies or sensitive pointers into public artifacts.
6. Run fixed-candidate held-out evaluation, controls and recording-group bootstrap only when sufficient eligible real data exists. Report unavailable estimates and confounders honestly; keep every finding pending for human review.

## Corrections and later adapters

A corrected transcript, changed recording grouping, analysis-track selection, annotation or extraction configuration can change findings. Preserve historical snapshots and use the full-run lineage DAG to mark descendants stale and queue revalidation; do not leave an old approval attached to a new source hash.

Future database integration maps fields explicitly into the private snake_case `research` model. Local imports do not establish that remote credentials, migrations, RLS or reviewer identities have been verified. Public read models accept only separately reviewed safe summaries and exact approved source metadata, never automatic transcript copies.

Creator authorization, qualified scholarly/content review where needed, adequate coverage, independently replicated findings and Gate 4 approval remain separate prerequisites for educational attribution. No curriculum or book authoring handoff is authorized merely because an import or statistical test succeeds.
