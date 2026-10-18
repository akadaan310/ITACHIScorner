# Deterministic research baseline

This is a private research foundation for Gates 2–3 of the [evidence-first mission](../docs/MISSION_EVIDENCE_FIRST.md). It does not gather videos, establish a complete inventory, discover an approved teaching method, or generate curriculum. At the foundation handoff, no authorized corpus has been supplied: there are **0 verified imported videos, 0 imported real transcript versions and 0 validated findings**. Controlled synthetic data belongs only in tests.

## Inputs and reproducibility

The corpus owner's safe manifest is the inventory authority. The importer consumes that manifest and an explicitly provided, authorized private export root; it does not query a channel or begin a competing harvest. Inventory coverage and transcript coverage have separate denominators. A manifest item without an available transcript remains present with its actual status.

Tracks use stable source, video, track and version identifiers. The exact bytes of each input track are hashed before interpretation. Re-importing identical source versions is idempotent; a conflicting immutable version is an error, not an overwrite. Whitespace or encoding changes alter the byte hash even when parsed text is equivalent. Raw text, original timestamps, speaker/role annotations, provenance and correction lineage remain private. Checksums identify content; they do not establish permission, authenticity or completeness.

Each transcribed video explicitly selects exactly one track with `analysis: true`. The importer must not infer a preferred language, newest version or supposedly best transcript. Other tracks remain available as provenance without multiplying analysis support. A `recording_id` groups independently indexed videos or clips from the same underlying recording; missing or incorrectly assigned grouping is a material independence limitation.

Intervals are nonnegative integer milliseconds with half-open semantics, `[start_ms, end_ms)`, and `end_ms > start_ms`. A real turn may be shorter than one second. An instantaneous observation uses a flagged 1ms interval. Adjacent intervals do not overlap; overlapping intervals are preserved rather than flattened. Timestamp deep links are navigation conveniences: exact intervals in evidence records are authoritative.

Run manifests bind code commit, extraction version, parameters, seed, configuration hash, manifest hash, input checksums and output hashes. A code commit identifies committed code only; an operator must not describe a dirty working tree as reproduced by that commit. Private outputs must stay outside every Git worktree. The source root is read-only and may contain repository-owned controlled test fixtures, but real restricted transcripts must never enter public Git history. See [handoff](handoff.md).

## Feature proposals

Extraction is deterministic and non-LLM. Script-aware token spans preserve original text and offsets. Token/script `start` and `end` are JavaScript UTF-16 code-unit offsets into original segment text; they are distinct from video millisecond intervals. Script detection is not language identification, and this baseline does not claim Arabic morphology, English lemmatization, reliable code-switch detection or source-text verification. Normalized features never replace the original quotation.

Speech-act rules propose structural labels from textual cues. They do not certify a speaker's intent, distinguish every quotation from an assertion, or resolve religious meaning. Speaker roles are supplied annotations, including `unknown`; no personal identity is inferred from voice or handles. Correcting roles or acts creates a new attributable annotation/version.

A structural symbol combines annotated role and proposed speech act. Symbolic expressions such as `creator:question → guest:clarification` describe the representation only; they are not claimed observations of Itachi. The actual label set and precedence are defined by the versioned extractor. Unknown observations and unresolved temporal overlap break contiguous motif windows. Sorting equal-time events by stable identifiers makes output reproducible but does not establish conversational response order.

## Finite-state and sequence baselines

The finite-state baseline counts observed transitions between structural symbols within unambiguous sequences. It reports counts and source support without claiming a learned conversational grammar. The motif detector enumerates **contiguous windows of lengths 2–4**; it is not an implementation of gapped PrefixSpan/SPADE, grammar induction or suffix-automaton discovery.

For each motif, retain exact source intervals, occurrence count and independent recording support. Several occurrences within one recording remain one independent supporting recording. Derived clips and alternate tracks cannot supply independent replication. Results distinguish recurrence from predictive performance and creator-specific discrimination.

For falsification, a candidate's first symbol is its antecedent and its full remaining sequence is the predicted suffix in the immediately following unambiguous turns. An eligible antecedent followed by a different observable continuation supplies a counterexample. A boundary, unresolved overlap, unknown annotation or insufficient remaining turns censors the opportunity; it must not become a negative example. Report support, counterexamples and censored opportunities separately. This tests a narrow sequence prediction, not a universal teaching claim or causal mechanism.

## Held-out sequence comparison

Keep every selected track from the same video and every video sharing a `recording_id` in the same partition. A group's chronological date is the latest verified `published_at` among its member videos; any missing publication date excludes the entire group from temporal evaluation. Split dated groups chronologically with deterministic tie-breaking: training receives `ceil(2 * groups / 3)` groups and held-out evaluation receives the remainder. Require at least two training and two held-out groups, which needs at least six groups with this allocation. Do not substitute discovery/import time for an unknown publication time. Insufficient eligible groups make temporal evaluation unavailable. Record actual membership and exclusions in the run artifact.

Discover candidate motifs and estimate probabilities on training data only. Freeze those candidates before evaluating held-out later recordings. Fit a first-order Markov baseline with additive smoothing `alpha = 0.5`:

```text
P(next = y | current = x)
  = (transition_count(x, y) + alpha)
    / (outgoing_count(x) + alpha * vocabulary_size)
```

Compare held-out average log likelihood with a smoothed unigram baseline using a consistent structural vocabulary and observation population. Report unavailable estimates rather than divide by zero. A positive Markov difference means that previous-symbol context helps this prediction task on this split; it does not prove a distinctive method, a causal benefit or superiority in dialogue.

There is no authorized matched-dialogue contrast corpus in this handoff. Topic, guest type, duration, moderation and annotation differences remain uncontrolled. **Discrimination is unestablished**, even if recurrence and held-out likelihood can eventually be measured.

## Seeded controls

Controls evaluate fixed candidate definitions and retain their source-group boundaries. Defaults are seed `42` and `49` null replicates. Record each seed, replicate count, perturbation parameters, statistic and effective opportunity count. An empirical shuffle tail probability uses an add-one correction, `(1 + null_statistics_at_least_observed) / (1 + replicates)`; `49` replicates give a minimum reported value of `0.02`. Candidate selection and multiple comparisons prevent interpreting exploratory values as confirmatory significance.

| Control | Procedure | Interpretation |
| --- | --- | --- |
| Turn shuffle | Seeded Fisher–Yates permutation within eligible source sequences; retain the original symbol frequencies and group boundaries. | Tests whether observed order exceeds a frequency-preserving null. A common sequence can recur under this control trivially. |
| Role swap | Swap creator/guest labels and reevaluate fixed candidates. | Tests role dependence. Moderator and unknown roles need explicit handling. A global renaming does not create independent comparison dialogues. |
| Citation removal | Ablate citation-bearing observations while preserving a boundary at the removed position. | Tests citation dependence without creating new adjacency. Citation-independent patterns may appropriately survive. |
| ASR perturbation | Seeded deletion of text tokens before speech-act relabeling, retaining source identifiers and original interval references. | Measures sensitivity to this specified deletion model. It is not a validated model of Arabic/English ASR errors. |

There is no universal requirement that every perturbation destroy a motif. Shuffle survival can undermine an order claim; survival under modest text noise can support limited robustness; citation and role controls characterize dependence. Every conclusion states the tested property.

## Bootstrap stability

Resample independent recording groups with replacement, keeping their turns together. Never bootstrap individual turns as if they were independent conversations. Defaults are `200` replicates using the recorded seed. Estimate candidate prevalence among recording groups, percentile bounds at `2.5%` and `97.5%`, and rediscovery frequency under the declared minimum independent-support threshold. Report the statistic, seed, replicate count and effective number of source groups. Repeated draws are bootstrap weights, not new independent sources. A tiny corpus or one independent recording cannot establish cross-recording stability.

Bootstrap intervals describe sampling variability under this resampling model. They do not include unknown inventory gaps, systematic diarization errors, biased annotation or rights uncertainty. Stable recurrence alone does not establish pedagogical value.

## Lineage and review boundary

Every run depends on its entire eligible input set, including observations that supply null distributions, failed predictions and candidate-selection opportunities. The lineage DAG connects source hashes to extraction/configuration, features, candidates, controls, uncertainty and review records. Reject cycles. A corrected input or changed extraction configuration marks dependent run outputs and their descendants stale; retain prior artifacts and schedule revalidation. See [graph schema](graph_schema.md).

Analysis emits **pending proposals only**. It cannot create authoritative review decisions or make `pedagogy_eligible` true. Even reviewed research needs adequate real evidence, current lineage, counterexamples/uncertainty, editorial assessment, creator authorization and any required qualified scholarly review before Gate 4. Public attribution, exercises and book content remain blocked. Statistical analysis never scores piety, divine approval, religious truth, debate victory or causal conversion outcomes.

## Validation evidence

The executable implementation is [pipeline.ts](pipeline.ts), invoked by [cli.mjs](cli.mjs). Controlled tests cover import validation, deterministic outputs, short/overlapping intervals, independent-source grouping, split leakage, perturbations, falsification, lineage invalidation and fail-closed eligibility. Passing synthetic tests demonstrates software behavior only. Real timestamp spot-checks, corpus completeness, annotation quality and scientific replication remain blocked on an authorized handoff.
