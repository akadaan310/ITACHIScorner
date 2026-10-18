# Optional inference plan — not authorized to run

The deterministic baseline does not require paid inference. This document plans a possible later experiment; it authorizes no provider request, model download billed to an account, GPU allocation or Modal spend. The reported approximately **$30 Modal balance is a possible budget ceiling, not approval**. No paid inference has been run for this research foundation.

## Current evidence

No authorized real corpus was supplied. Actual text-token counts, audio hours, request counts, model accuracy, latency and cost are therefore **unmeasured**. Synthetic fixtures are not a corpus estimate. No provider prices were retrieved or verified for this handoff, and no dollar forecast is presented as current.

## Measure before requesting approval

1. Obtain the corpus owner's authorized snapshot, permitted processing scope, private destination and retention constraints. Determine whether any source may leave the private environment.
2. Run deterministic extraction first. Select a small, source-group-separated review sample with genuine language/code-switch and speech-act variation; preserve exact intervals and immutable hashes.
3. Count actual input/output tokens with each proposed model's named tokenizer/version, including instructions, contextual turns, expected structured outputs, retries and cache assumptions. Record sample size and extrapolation uncertainty.
4. Obtain current provider/model pricing from official sources at execution time. Record URLs, retrieval dates, units, model/version, region and any minimum charges. For Modal, record the actual GPU/CPU/RAM/storage rates and billing behavior rather than treating GPU hourly price as total cost.
5. Build the scenarios below from measured inputs. Reserve a stop margin below any approved ceiling; include failed requests, validation retries and idle/startup overhead. Present the concrete scope and cost to the user for explicit paid-run approval.

| Scenario | Scope to size from actual data | Required estimate |
| --- | --- | --- |
| Low | Small adjudicated labeling/correction pilot; no broad corpus sweep. | Measured tokens/audio, bounded requests/runtime, retry allowance and total. |
| Medium | Larger pilot across several independent recordings and languages. | The same measurements plus scaling/error bounds and reviewer effort. |
| High | Maximum proposed batch within the user's approved scope. | Worst-case total, hard caps, stop margin and effect of early termination. |

For token-billed APIs, calculate `input_tokens * input_rate + output_tokens * output_rate` with the provider's actual billing unit, then add explicitly priced components. For hosted inference, calculate billable compute time plus CPU/RAM/storage/network and startup/idle charges. Keep API cost and Modal cost separate; a Modal balance does not cover unrelated providers.

## Proposed experiment and acceptance

Possible tasks are multilingual correction proposals, structural label proposals or concise reviewer summaries. None may replace original transcripts or become the sole evidence for a finding. Store output as a versioned proposed annotation with model, prompt/configuration hash, input lineage and validation status. Do not send personal or rights-restricted text to a provider without the applicable permission.

Compare optional proposals with the deterministic baseline and adjudicated human labels on held-out recording groups. Report per-class precision/recall, confusion and abstention, interval/source fidelity, correction error rate, latency distribution and cost per accepted annotation. Include class imbalance and disagreements; a fluent summary is not evidence of accurate attribution. Provider responses are nondeterministic unless reproducibility is independently demonstrated.

Before any approved paid pilot, implement maximum requests/tokens/runtime, concurrency and retry caps, a private cost ledger, cancellation and a hard budget stop. Approval must name the provider, model, source-processing permission, private output destination, total ceiling and run scope. Without that approval, stop at this plan and deterministic local work.
