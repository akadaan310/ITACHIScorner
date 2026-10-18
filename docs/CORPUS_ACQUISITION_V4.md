# V4 corpus acquisition — observed results

Codex performed public discovery on 18 October 2026. The [creator’s supplied official hub](https://linktr.ee/dawahxdialogues) returned HTTP 200. Its visible YouTube link is [@dawahxdialogues](https://www.youtube.com/@dawahxdialogues); its public JSON-LD `sameAs` identifies stable channel **UCCGfMjDueUZ7PhrZHjcFnGw**. The hub’s cached YouTube metadata names the channel **itachii**. Its embedded selections and social feeds contain no video IDs.

The official channel, Videos, Shorts, streams, playlists, stable channel URL and feed could not be enumerated. Workspace GETs failed with a proxy tunnel 403; the web tool returned “Online fetch throttled.” No access protection was bypassed. No configured YouTube API credential was found by checking credential variable names. These failures establish an acquisition limitation, not that any video is private, deleted or captionless.

## Inventory and counters

Public search returned **9 distinct canonical YouTube metadata candidates** explicitly indexed with uploader display name `itachii`. That matches the official hub’s cached name, but the index does not expose each uploader’s stable channel ID. They remain a separate provisional inventory, with **0 verified official video memberships** and **0 approved product previews**. No provisional title is used as a source-backed teaching claim.

| Measure | Result |
| --- | ---: |
| Provisional indexed metadata records inventoried | 9 |
| Stable-uploader verified official items | 0 |
| Currently playable public items verified | 0 |
| Official public / inaccessible item totals | Unknown / unknown |
| Candidate watch fetches blocked / not retried after origin block | 6 / 3 |
| Official listing endpoints blocked | 7 |
| Transcripts retrieved / eligible real transcripts | 0 / 0 |
| Successfully validated metadata records / transcript imports | 9 / 0 |
| Unknown inferred roles in imported segments | 0 segments imported |
| Source records with speaker roles unassessed | 9 |
| Known coverage gap categories | 10 |
| Related candidates excluded from this inventory | 9 |

The channel denominator and all transcript percentages are **unknown**. Search exhaustion is not channel enumeration. Three later query batches returned no additional matching IDs, but that cannot prove completeness. Exact dates, durations, content types, playlist membership, current playability, recording parents and speaker identities remain unknown. Relative search labels are retained separately; they are not converted into invented dates. Chapter timestamps are not durations.

Distinct IDs `TX-eWkK6-J4` and `yj9IaOZ2QX4` share the indexed title “WHY ARE YOU NOT MUSLIM?!” and remain separate. Their relationship is unknown. Repeated search hits for one ID are deduplicated. An `unresolved_<video_id>` recording label is a compatibility placeholder with `independence_verified: false`, not evidence of an independent recording.

## Actual private import and deterministic analysis

The unchanged existing CLI imported the separate provisional metadata snapshot, with every record `rights_pending`, permission `pending` and `tracks: []`:

- Import: `import-e52dd470510b7687a0eb1696`.
- Analysis: `analysis-fa5be34402a76efaba173d01`, seed 42.
- Manifest original-byte SHA-256: `b33426f6a4a3ec875dbe902fa01f60dfe1b0126baa359d87cefaf39a0d768145`.
- Canonical manifest SHA-256: `f0580bfeea925b7647ab360bc296d13694cc41ea053bd5bc3ad8c67537718ffa`.
- Extractor: unchanged `research/pipeline.ts`, SHA-256 `b748a27dbfa314eb6e6d49c84bbaa22c60beefa88ac65cb0a7060093b917a7be`, source commit `7a8ce5efda461ebab717a03ed1d9c73528f92c9d`.

The import validates the metadata contract and immutable hashes. It does not authenticate uploader membership or rights. Deterministic analysis produced **0 features, 0 candidates**, `insufficient_data` evaluation and `pedagogy_eligible: false`. With no transcript segments, video → interval → quote lineage cannot be exercised on real text. No lesson, 3–5 month curriculum or book finding follows from this run. No paid processing, transcript publication or hosted database write occurred.

The public-safe files are [acquisition report](../research/v4-corpus-acquisition.json), [provisional candidate metadata](../research/v4-corpus-candidates.json), and [separate metadata-only CLI manifest](../research/v4-corpus-candidate-manifest.ndjson). The foundation `research/manifest.ndjson` remains unchanged. `tests/research-acquisition-v4.test.ts` checks the provisional identity boundary, existing importer compatibility, duplicate-title handling and absence of transcript/credential fields.

## Permission and private receipt

The [official caption-list API](https://developers.google.com/youtube/data/reference/rest/v3/captions/list) requires OAuth authorization and returns track metadata, not caption text. [Caption download](https://developers.google.com/youtube/data/reference/rest/v3/captions/download) also requires the user to have permission to edit the video. Public indexing does not grant that permission. No transcript service, reupload, proxy workaround or synthetic transcript was substituted.

One non-delegable request: **With Itachi’s authorization, provide one private owner/authorized-manager export for channel `UCCGfMjDueUZ7PhrZHjcFnGw` containing the complete upload/Short/stream/playlist inventory (IDs, status, publication dates, durations and playlist membership), original timestamped SRT/VTT caption files and a written private research permission reference.** No password or account token is requested. Codex can then perform private conversion, import, provenance checks and analysis without transferring the work to another assistant.

Raw hub/docs snapshots, search response receipts, excluded candidates and immutable CLI outputs are outside Git in a mode-0700 private corpus directory. The portable private ZIP and its SHA-256 receipt are delivered separately; no private raw page or transcript body is committed here. The owner-facing private report records their exact locations. Source clearance, creator approval, transcription review and scholarly/editorial review remain separate gates.
