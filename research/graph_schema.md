# Private research graph contract

This document defines typed semantics for research artifacts and their future private database adapter. It is not a populated graph, a public API or evidence that the corpus exists. See [methodology](methodology.md) and the [mission](../docs/MISSION_EVIDENCE_FIRST.md).

## Shared envelope

Nodes have stable IDs, a declared graph/type, source/version references and creation/extraction provenance. Edges have stable IDs, typed endpoints and relation, run/version references, provenance, confidence where applicable and review/staleness state. Evidence-bearing edges additionally identify exact source segment/turn IDs and nonnegative integer half-open millisecond intervals. A confidence number does not replace editorial review.

IDs must not silently change meaning across immutable source versions. Content hashes bind exact inputs; human-readable labels are not identity keys. Annotation proposals, reviewer assertions and verified source relationships remain distinguishable. An unproven connection is a hypothesis or curated link, never a verified edge simply because it has a plausible name.

This envelope is the target persistence contract. The executable lineage structure is deliberately narrower: `LineageNode` has `id`, `kind` and `parents`. Exact intervals, input hashes and evidence details live in import, feature, candidate and run artifacts. The baseline does not claim that all seven graph families are already extracted or stored.

## Separate linked graphs

| Graph | Principal nodes and edges | Baseline status |
| --- | --- | --- |
| Source/provenance | Video `HAS_TRACK` track; track `HAS_VERSION` transcript version; version `CONTAINS` segment; annotation `ANNOTATES` segment; correction `SUPERSEDES` prior version. | Import records and immutable hashes establish software provenance. Permission and authenticity still require external evidence. |
| Dialogue/temporal | Target turn model: turn `NEXT_UNAMBIGUOUS` turn; turn `OVERLAPS` turn; proposed act `ANNOTATES` turn. | Current observations are transcript segments, not aggregated speaker turns. Segment ordering/overlap and proposed transitions do not establish reply-to or interruption intent. |
| Argument | Claim `SUPPORTED_BY` premise; objection `CHALLENGES` claim; rebuttal `RESPONDS_TO` objection; scope change `QUALIFIES` claim. | Reserved typed semantics. The baseline does not reliably extract argument structure. |
| Evidence/quotation | Quotation `REFERS_TO` source; citation `PROPOSES_LOCUS` reference; reviewed match `VERIFIES_MATCH` exact edition/text. | A citation heuristic is a proposal only. A separate versioned, approved-index adapter is scaffolding for exact-text source matching; no approved index or scripture has been acquired. It does not verify interpretation or integrate the ISNAAD repository. |
| Technique/motif | Candidate `OBSERVED_IN` interval; candidate `COUNTEREXAMPLE_IN` interval; candidate `TESTED_BY` control result; result `ESTIMATED_BY` bootstrap run. | Contiguous structural motif proposals and narrow sequence falsification. No approved teaching technique is implied. |
| Learning dependency | Objective `REQUIRES` prerequisite; unit `TEACHES` objective; activity `ASSESSES` objective; unit `DERIVED_FROM` reviewed finding. | Empty and blocked until Gates 3–4 pass. No learning relationships are fabricated. |
| Causal hypothesis | Hypothesis `PROPOSES_EFFECT_OF` intervention; confounder `MAY_CONFOUND` relationship; test `EVALUATES` hypothesis. | Reserved, explicitly hypothetical. Temporal adjacency and Markov likelihood are not causal evidence. |

Cross-graph links preserve the graph/type distinction. For example, an observed sequence can link to source segments without creating a claim-support relationship. Counterexamples have source lineage and eligibility/censoring reasons just like supporting observations.

## Candidate record

A candidate record needs the mission's fields, with unavailable values stated explicitly:

```text
substrate_id, label_internal, definition, observation_schema,
extraction_algorithm, code_commit, config_hash, data_manifest_hash,
corpus_snapshot, run_id, supporting_intervals[],
counterexample_intervals[], cross_episode_count, contrast_set,
estimated_stability, uncertainty, confounders, hypothesis,
alternative_explanations, reviewer_status, reviewed_by, decision_at,
derived_substrate_ids[], pedagogy_eligible
```

The executable baseline may serialize intermediate candidates rather than this complete editorial record. Missing scientific/review fields remain pending, not approved defaults. Distinguish `supplied_recording_group_count` from `verified_independent_recording_count`, occurrences, video count and episode count; a recording is not automatically a separately segmented debate episode. The latter field reflects `independence_verified` assertions supplied in the manifest, not a remote verification by this harness. `contrast_set` must state that no authorized matched baseline is present. A missing uncertainty estimate is unavailable, not zero uncertainty. `reviewed_by` and `decision_at` remain unset until an authoritative human review exists. Analysis never sets `pedagogy_eligible` true.

Every supporting/counterexample interval identifies video, selected track, immutable transcript version, segment ID, exact `[start_ms, end_ms)`, source checksum, original speaker/role, `original_text` and `extraction_version`. `speaker_confidence` preserves the supplied annotation score. Evidence confidence remains explicitly unassessed: `evidence_confidence: null` and `evidence_confidence_status: "unassessed"`; it must not inherit the speaker score.

Main `supporting_intervals`/`counterexample_intervals` and counts describe training observations. `heldout_supporting_intervals`, `heldout_counterexample_intervals`, `heldout_opportunities` and `heldout_censored` describe the separate held-out partition. Undated/excluded observations retain lineage but are absent from these comparison counts. Hypotheses specify `horizon_segments`; there is no turn aggregation. A video deep link alone cannot recover a precise source span or correction history.

## Lineage DAG

Lineage is a directed dependency graph; an edge `A → B` means **B depends on A**:

```text
exact source bytes + safe manifest + source-selection metadata
  → import receipt / corpus snapshot
  → extraction version + configuration + feature artifact
  → training/held-out membership + candidate-selection run
  → candidate pattern + supporting/counterexample opportunities
  → controls + bootstrap + held-out evaluation
  → human research review
  → later authorized editorial unit
```

Code/configuration, tokenizer/rule versions and every input in a discovery run are dependencies even if their source contains no support for a selected motif. Correcting a negative example can change candidate selection, transition probabilities, null statistics or review conclusions. Hashing only supporting quotes is insufficient.

Validate endpoint existence and reject cycles before accepting a DAG. Given changed source/version, manifest, code or configuration nodes, traverse outgoing dependencies to identify all reachable descendants. Preserve immutable historical artifacts. Import appends a private invalidation overlay at `evidence/{old_analysis_run}/invalidations/{new_import_run}.json` when a source correction or canonical manifest snapshot change affects earlier analyses. It contains `stale_node_ids` and `revalidation_queue`; a changed snapshot conservatively affects the full prior corpus analysis. Stored historical candidate flags are not rewritten. Consumers must combine the immutable artifact with its overlays before treating a result as current, and revalidation requires a new run and review. Reviews of an older snapshot cannot silently approve a corrected snapshot. A downstream finding derived from another finding must carry both its own sources and the upstream dependency chain.

## Database adapter boundary

Use explicit mappings into the private `research` schema. The database uses snake_case, including `video_id`, `recording_id`, `track_id`, `start_ms`, `end_ms`, `code_commit`, `config_hash`, `data_manifest_hash`, `reviewer_status` and `pedagogy_eligible`; map any differently named in-memory fields deliberately. Do not spread arbitrary JSON into database writes. Stable external platform IDs differ from internal database primary keys and need an explicit lookup.

Importing local artifacts is separate from remote database ingestion: this CLI does not establish that a Supabase project, migration, RLS policy or storage upload is configured. Raw transcript bodies and private graph artifacts never become public read models automatically. Source/content review, scholarly review when needed and creator authorization are separate controls. Public publication adapters must fail closed and copy only approved safe fields.
