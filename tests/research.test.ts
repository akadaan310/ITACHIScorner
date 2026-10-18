import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, symlinkSync, rmSync, readdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  sha256, canonicalJson, validateInterval, parseManifest, parseSegments, sourceDeepLink,
  importArchive, analyzeCorpus, extractFeatures, sequenceBlocks, mineMotifs,
  seededShuffle, evaluateContinuation, markStale, assertLineageDag, publicationBlockers,
  type ManifestRecord, type Segment, type Feature, type LineageNode,
} from "../research/pipeline";

const temporary: string[] = [];
function temp() { const root = mkdtempSync(path.join(os.tmpdir(), "itachi-research-test-")); temporary.push(root); return root; }
afterEach(() => { for (const root of temporary.splice(0)) rmSync(root, { recursive: true, force: true }); });
const hash = (text: string) => createHash("sha256").update(text).digest("hex");
const segment = (id: string, text: string, start = 0, role: Segment["speaker"]["role"] = "creator"): Segment => ({
  segment_id: id, start_ms: start, end_ms: start + 10, text,
  speaker: { speaker_id: role, role, confidence: 0.95 }, languages: ["en"],
});
function record(videoId: string, bytes = "", patch: Partial<ManifestRecord> = {}): ManifestRecord {
  return {
    schema_version: 1, platform: "youtube", video_id: videoId, recording_id: `recording:${videoId}`,
    independence_verified: false, canonical_url: `https://www.youtube.com/watch?v=${videoId}`,
    title: "CONTROLLED SYNTHETIC TEST ONLY", published_at: "2026-01-01T00:00:00Z", duration_ms: 10000,
    discovered_at: "2026-01-02T00:00:00Z", content_type: "video", status: "transcribed",
    permission: { status: "synthetic_test", reference: "test fixture; no real creator source" }, synthetic: true,
    tracks: [{ track_id: "manual", version: "v1", relative_path: `videos/${videoId}/tracks/manual/v1.jsonl`,
      sha256: hash(bytes), source_format: "provided_jsonl", languages: ["en"], analysis: true }], ...patch,
  };
}
function archiveFixture(rows: Segment[][] = [[segment("s1", "What is your evidence?", 0, "guest"), segment("s2", "The source says this.", 10)]]) {
  const root = temp(), input = path.join(root, "input"), output = path.join(root, "output"); mkdirSync(input);
  const manifest = rows.map((segments, index) => {
    const bytes = segments.map((row) => JSON.stringify(row)).join("\n") + "\n";
    const item = record(`video${index}`, bytes, { published_at: `2026-01-${String(index + 1).padStart(2, "0")}T00:00:00Z` });
    const filename = path.join(input, item.tracks[0]!.relative_path); mkdirSync(path.dirname(filename), { recursive: true }); writeFileSync(filename, bytes);
    return item;
  });
  const manifestPath = path.join(input, "manifest.ndjson"); writeFileSync(manifestPath, manifest.map((item) => JSON.stringify(item)).join("\n") + "\n");
  return { root, input, output, manifestPath, manifest };
}
function feature(id: string, act: string, start: number, end = start + 1): Feature {
  return { ...segment(id, act, start), end_ms: end, speech_act: act, annotation_status: "heuristic_proposal", tokens: [], script_spans: [] } as Feature;
}

 describe("precise source contracts", () => {
  it("accepts 1ms instants and subsecond half-open turns", () => {
    expect(() => validateInterval({ start_ms: 0, end_ms: 1, instantaneous: true })).not.toThrow();
    expect(() => validateInterval({ start_ms: 9, end_ms: 14 })).not.toThrow();
  });
  it.each([{ start_ms: -1, end_ms: 1 }, { start_ms: 1, end_ms: 1 }, { start_ms: 0.1, end_ms: 1 }, { start_ms: 0, end_ms: 2, instantaneous: true }])("rejects invalid interval %j", (value) => {
    expect(() => validateInterval(value)).toThrow();
  });
  it("preserves overlapping source segments without inventing order", () => {
    const input = [segment("b", "B", 5), segment("a", "A", 0)];
    const parsed = parseSegments(input.map((row) => JSON.stringify(row)).join("\n"), record("video0"));
    expect(parsed.map((row) => row.segment_id)).toEqual(["a", "b"]);
    expect(parsed[0]!.end_ms).toBe(10);
  });
  it("rejects duplicate segment identifiers and out-of-duration spans", () => {
    expect(() => parseSegments([segment("a", "A"), segment("a", "B")].map((row) => JSON.stringify(row)).join("\n"), record("video0"))).toThrow(/duplicate/i);
    expect(() => parseSegments(JSON.stringify(segment("a", "A", 9999)), record("video0"))).toThrow(/duration/i);
  });
  it("validates safe IDs, canonical URLs, explicit permissions and exactly one selected analysis track", () => {
    expect(() => parseManifest(JSON.stringify(record("../escape")))).toThrow();
    expect(() => parseManifest(JSON.stringify(record("video0", "", { canonical_url: "https://evil.test/watch?v=video0" })))).toThrow();
    expect(() => parseManifest(JSON.stringify(record("video0", "", { permission: { status: "pending", reference: "waiting" } })))).toThrow(/permission/i);
    const row = record("video0"); row.tracks.push({ ...row.tracks[0]!, version: "v2", relative_path: "videos/video0/tracks/manual/v2.jsonl" });
    expect(() => parseManifest(JSON.stringify(row))).toThrow(/analysis/i);
  });
  it("detects malformed JSON without echoing transcript text", () => {
    expect(() => parseSegments('{"text":"PRIVATE_SECRET"', record("video0"))).toThrow(/line 1/i);
    try { parseSegments('{"text":"PRIVATE_SECRET"', record("video0")); } catch (error) { expect(String(error)).not.toContain("PRIVATE_SECRET"); }
  });
  it("deep links to the source while retaining millisecond metadata separately", () => {
    expect(sourceDeepLink(record("video0"), 1234)).toBe("https://www.youtube.com/watch?v=video0&t=1s");
  });
  it("hashes exact bytes and canonicalizes object keys without reordering arrays", () => {
    expect(sha256("x\n")).toBe(hash("x\n")); expect(sha256("x\n")).not.toBe(sha256("x"));
    expect(canonicalJson({ b: 2, a: [2, 1] })).toBe('{"a":[2,1],"b":2}');
  });
});

describe("private immutable imports", () => {
  it("imports exact bytes deterministically and reruns idempotently", () => {
    const fixture = archiveFixture(); const options = { manifestPath: fixture.manifestPath, sourceRoot: fixture.input, outputRoot: fixture.output, codeCommit: "controlled-test" };
    const first = importArchive(options), second = importArchive(options);
    expect(second.run_id).toBe(first.run_id); expect(second).toEqual(first);
    expect(readFileSync(path.join(fixture.output, fixture.manifest[0]!.tracks[0]!.relative_path), "utf8")).toBe(readFileSync(path.join(fixture.input, fixture.manifest[0]!.tracks[0]!.relative_path), "utf8"));
    expect(first.coverage.inventory_completeness).toBe("unknown");
    expect(first.coverage.verified_real_videos).toBe(0); expect(first.coverage.synthetic_videos).toBe(1);
  });
  it("reports each inaccessible status and never guesses an inventory denominator", () => {
    const fixture = archiveFixture([]); const statuses = ["caption_unavailable", "rights_pending", "private", "deleted", "retryable_error", "not_transcribed"] as const;
    writeFileSync(fixture.manifestPath, statuses.map((status, index) => JSON.stringify(record(`gap${String(index).padStart(8, "0")}`, "", { status, tracks: [], synthetic: false, permission: { status: "pending", reference: "not acquired" } }))).join("\n"));
    const result = importArchive({ manifestPath: fixture.manifestPath, sourceRoot: fixture.input, outputRoot: fixture.output, codeCommit: "test" });
    expect(result.coverage.discovered_videos).toBe(6); expect(result.coverage.transcribed_videos).toBe(0); expect(result.coverage.inventory_total).toBeNull(); expect(result.coverage.transcript_percentage_of_inventory).toBeNull();
    for (const status of statuses) expect(result.coverage.by_status[status]).toBe(1);
  });
  it("accepts an empty real manifest and reports zero rather than complete coverage", () => {
    const fixture = archiveFixture([]); const result = importArchive({ manifestPath: fixture.manifestPath, sourceRoot: fixture.input, outputRoot: fixture.output, codeCommit: "test" });
    expect(result.coverage.discovered_videos).toBe(0); expect(result.coverage.inventory_completeness).toBe("unknown"); expect(result.coverage.transcript_percentage_of_inventory).toBeNull();
  });
  it("rejects checksum mismatch before writing any transcript", () => {
    const fixture = archiveFixture(); writeFileSync(path.join(fixture.input, fixture.manifest[0]!.tracks[0]!.relative_path), "tampered");
    expect(() => importArchive({ manifestPath: fixture.manifestPath, sourceRoot: fixture.input, outputRoot: fixture.output, codeCommit: "test" })).toThrow(/checksum/i);
    expect(existsSync(path.join(fixture.output, "videos"))).toBe(false);
  });
  it("refuses a changed checksum under the same immutable source version", () => {
    const fixture = archiveFixture(); const options = { manifestPath: fixture.manifestPath, sourceRoot: fixture.input, outputRoot: fixture.output, codeCommit: "test" }; importArchive(options);
    const track = fixture.manifest[0]!.tracks[0]!; const bytes = JSON.stringify(segment("new", "Changed source")) + "\n"; writeFileSync(path.join(fixture.input, track.relative_path), bytes); track.sha256 = hash(bytes); writeFileSync(fixture.manifestPath, JSON.stringify(fixture.manifest[0]));
    expect(() => importArchive(options)).toThrow(/immutable/i);
  });
  it("blocks output inside any git worktree including symlink traversal", () => {
    const fixture = archiveFixture(); const repo = path.join(fixture.root, "repo"); mkdirSync(repo); writeFileSync(path.join(repo, ".git"), "gitdir: placeholder");
    const link = path.join(fixture.root, "link"); symlinkSync(repo, link);
    for (const outputRoot of [path.join(repo, "private"), path.join(link, "private")]) expect(() => importArchive({ manifestPath: fixture.manifestPath, sourceRoot: fixture.input, outputRoot, codeCommit: "test" })).toThrow(/git|symlink/i);
  });
  it("blocks input symlinks escaping the explicitly supplied export root", () => {
    const fixture = archiveFixture(); const track = fixture.manifest[0]!.tracks[0]!; const full = path.join(fixture.input, track.relative_path); const bytes = readFileSync(full); const outside = path.join(fixture.root, "outside.jsonl"); writeFileSync(outside, bytes); rmSync(full); symlinkSync(outside, full);
    expect(() => importArchive({ manifestPath: fixture.manifestPath, sourceRoot: fixture.input, outputRoot: fixture.output, codeCommit: "test" })).toThrow(/escape|symlink/i);
  });
});

describe("deterministic conservative discovery", () => {
  it("preserves original token offsets and marks language scripts as proposals", () => {
    const text = "Why هذا الدليل؟"; const features = extractFeatures([segment("s", text)]);
    for (const token of features[0]!.tokens) expect(text.slice(token.start, token.end)).toBe(token.original);
    expect(new Set(features[0]!.script_spans.map((span) => span.script))).toEqual(new Set(["latin", "arabic"]));
    expect(features[0]!.annotation_status).toBe("heuristic_proposal");
  });
  it("does not create adjacency across overlaps or unknown annotations", () => {
    const blocks = sequenceBlocks([feature("a", "question", 0, 10), feature("b", "claim", 5, 20), feature("c", "citation", 20, 25), feature("d", "unknown", 25, 26), feature("e", "claim", 26, 27)]);
    expect(blocks.flat().map((row) => row.segment_id)).not.toContain("a"); expect(blocks.flat().map((row) => row.segment_id)).not.toContain("b"); expect(blocks.map((block) => block.length)).toEqual([1, 1]);
  });
  it("requires independent videos rather than repeated windows for support", () => {
    const blocks = [[feature("a", "question", 0), feature("b", "claim", 1), feature("c", "question", 2), feature("d", "claim", 3)]];
    const motifs = mineMotifs([{ source_id: "youtube:a", recording_id: "same-recording", blocks }, { source_id: "youtube:b", recording_id: "same-recording", blocks }], { minVideos: 2, maxLength: 2 });
    expect(motifs).toHaveLength(0);
  });
  it("uses seeded within-video shuffles", () => {
    expect(seededShuffle([1, 2, 3, 4, 5, 6, 7, 8], 42)).toEqual(seededShuffle([1, 2, 3, 4, 5, 6, 7, 8], 42));
    expect(seededShuffle([1, 2, 3, 4, 5, 6, 7, 8], 42)).not.toEqual(seededShuffle([1, 2, 3, 4, 5, 6, 7, 8], 43));
  });
  it("distinguishes observed counterexamples from censored antecedents", () => {
    const blocks = [[feature("a", "evidence_request", 0), feature("b", "citation", 1)], [feature("c", "evidence_request", 3), feature("d", "refusal", 4)], [feature("e", "evidence_request", 6)]];
    const result = evaluateContinuation(blocks, ["creator:evidence_request", "creator:citation"]);
    expect(result.supporting).toHaveLength(1); expect(result.counterexamples).toHaveLength(1); expect(result.censored).toBe(1); expect(result.opportunities).toBe(2);
  });
  it("runs controls, held-out baseline and lineage with synthetic data without generating approval", () => {
    const rows = Array.from({ length: 6 }, () => [segment("s1", "What is your evidence?", 0, "guest"), segment("s2", "Quran 2:256 says this.", 10), segment("s3", "I disagree because of that.", 20, "guest"), segment("s4", "Let me clarify the claim.", 30)]);
    const fixture = archiveFixture(rows); const options = { manifestPath: fixture.manifestPath, sourceRoot: fixture.input, outputRoot: fixture.output, codeCommit: "controlled-test", seed: 42, nullReplicates: 12, bootstrapReplicates: 20 };
    const result = analyzeCorpus(options); expect(analyzeCorpus(options)).toEqual(result);
    expect(result.candidates.length).toBeGreaterThan(0); expect(result.evaluation.status).toBe("evaluated"); expect(result.evaluation.test_video_ids).toHaveLength(2);
    expect(result.evaluation.train_video_ids.some((id) => result.evaluation.test_video_ids.includes(id))).toBe(false);
    for (const candidate of result.candidates) {
      expect(candidate.pedagogy_eligible).toBe(false); expect(candidate.reviewer_status).toBe("pending"); expect(candidate.discrimination_status).toBe("unestablished");
      expect(candidate.controls.shuffle.replicates).toBe(12); expect(candidate.controls.role_swap).toBeDefined(); expect(candidate.controls.citation_ablation).toBeDefined(); expect(candidate.controls.asr_noise).toBeDefined(); expect(candidate.estimated_stability.unit).toBe("recording_group");
      expect(candidate.supporting_intervals[0]!.source_sha256).toMatch(/^[a-f0-9]{64}$/);
    }
    expect(result.lineage.nodes.some((node) => node.kind === "source")).toBe(true);
    const manifestNode = result.lineage.nodes.find((node) => node.kind === "manifest"); expect(manifestNode).toBeDefined();
    expect(markStale(result.lineage.nodes, [manifestNode!.id])).toContain(result.candidates[0]!.substrate_id);
    expect(existsSync(path.join(fixture.output, "runs", result.run_id, "run_manifest.json"))).toBe(true);
  });
});

describe("lineage and editorial fail-closed gates", () => {
  it("marks every descendant stale even when the corrected video was negative evidence", () => {
    const nodes: LineageNode[] = [{ id: "sourceA", kind: "source", parents: [] }, { id: "sourceB", kind: "source", parents: [] }, { id: "run", kind: "run", parents: ["sourceA", "sourceB"] }, { id: "candidate", kind: "candidate", parents: ["run"] }, { id: "review", kind: "review", parents: ["candidate"] }];
    expect(markStale(nodes, ["sourceB"])).toEqual(["candidate", "review", "run", "sourceB"]);
  });
  it("rejects cycles and missing lineage parents", () => {
    expect(() => assertLineageDag([{ id: "a", kind: "run", parents: ["b"] }, { id: "b", kind: "candidate", parents: ["a"] }])).toThrow(/cycle/i);
    expect(() => assertLineageDag([{ id: "a", kind: "run", parents: ["missing"] }])).toThrow(/parent/i);
  });
  it("does not trust forged approval strings or synthetic evidence", () => {
    const blockers = publicationBlockers({ reviewer_status: "approved", reviewed_by: "Someone", decision_at: "2026-01-01", synthetic: true, stale: false, cross_episode_count: 5, creator_approved: true });
    expect(blockers).toContain("synthetic_evidence"); expect(blockers).toContain("authenticated_editorial_gate_required");
  });
});


describe("CLI and research boundary regressions", () => {
  it("runs an empty import and analysis through the real Node CLI", () => {
    const fixture = archiveFixture([]);
    for (const command of ["import", "analyze"]) {
      const result = spawnSync(process.execPath, [path.resolve("research/cli.mjs"), command, "--manifest", fixture.manifestPath, "--source", fixture.input, "--output", fixture.output, "--code-commit", "controlled-test"], { encoding: "utf8" });
      expect(result.status, result.stderr).toBe(0); const summary = JSON.parse(result.stdout);
      expect(summary.command).toBe(command); expect(summary.verified_real_videos).toBe(0); expect(summary.pedagogy_eligible).toBe(false);
    }
  });
  it("CLI rejects unknown flags and reports failure without transcript text", () => {
    const fixture = archiveFixture();
    const result = spawnSync(process.execPath, [path.resolve("research/cli.mjs"), "import", "--manifest", fixture.manifestPath, "--source", fixture.input, "--output", fixture.output, "--leak", "SECRET"], { encoding: "utf8" });
    expect(result.status).not.toBe(0); expect(result.stdout).toBe(""); expect(result.stderr).not.toContain("SECRET");
  });
  it("breaks citation ablation boundaries and keeps fixed motif controls separate", () => {
    const fixture = archiveFixture(Array.from({ length: 6 }, () => [segment("q", "Why?", 0), segment("c", "Quran 2:256", 10), segment("r", "I disagree", 20)]));
    const result = analyzeCorpus({ manifestPath: fixture.manifestPath, sourceRoot: fixture.input, outputRoot: fixture.output, codeCommit: "test", seed: 1, nullReplicates: 4, bootstrapReplicates: 8 });
    const citationMotif = result.candidates.find((candidate) => candidate.symbols.join("|") === "creator:question|creator:citation");
    expect(citationMotif).toBeDefined(); expect(citationMotif!.controls.citation_ablation.occurrences).toBe(0);
    expect(result.candidates.some((candidate) => candidate.symbols.join("|") === "creator:question|creator:rebuttal")).toBe(false);
  });
  it("marks a trivially invariant sequence as not distinguished from shuffle", () => {
    const fixture = archiveFixture(Array.from({ length: 6 }, () => Array.from({ length: 4 }, (_, index) => segment(`s${index}`, "Why?", index * 10))));
    const result = analyzeCorpus({ manifestPath: fixture.manifestPath, sourceRoot: fixture.input, outputRoot: fixture.output, codeCommit: "test", nullReplicates: 8, bootstrapReplicates: 10 });
    expect(result.candidates.length).toBeGreaterThan(0);
    for (const candidate of result.candidates) { expect(candidate.controls.shuffle.p_value_add_one).toBe(1); expect(candidate.controls.shuffle.status).toBe("not_distinguished_from_shuffle"); }
  });
  it("does not evaluate absent publication timestamps as a temporal holdout", () => {
    const fixture = archiveFixture(Array.from({ length: 6 }, () => [segment("a", "Why?", 0), segment("b", "Quran 2:256", 10)]));
    for (const row of fixture.manifest) row.published_at = null;
    writeFileSync(fixture.manifestPath, fixture.manifest.map((row) => JSON.stringify(row)).join("\n"));
    const result = analyzeCorpus({ manifestPath: fixture.manifestPath, sourceRoot: fixture.input, outputRoot: fixture.output, codeCommit: "test" });
    expect(result.evaluation.status).toBe("insufficient_data"); expect(result.evaluation.test_video_ids).toHaveLength(0); expect(result.evaluation.excluded_undated_video_ids).toHaveLength(6);
  });
  it("rejects unexpected manifest content instead of copying transcript fields into safe metadata", () => {
    expect(() => parseManifest(JSON.stringify({ ...record("video0"), transcript: "PRIVATE" }))).toThrow(/unknown.*field/i);
  });
  it("rejects invalid UTF-8 instead of silently changing transcript orthography", () => {
    const fixture = archiveFixture(); const track = fixture.manifest[0]!.tracks[0]!; const encoded = JSON.stringify(segment("utf8", "UTF8_PLACEHOLDER")); const marker = encoded.indexOf("UTF8_PLACEHOLDER"); const bytes = Buffer.concat([Buffer.from(encoded.slice(0, marker)), Buffer.from([0xff]), Buffer.from(encoded.slice(marker + "UTF8_PLACEHOLDER".length))]); track.sha256 = createHash("sha256").update(bytes).digest("hex");
    writeFileSync(path.join(fixture.input, track.relative_path), bytes); writeFileSync(fixture.manifestPath, JSON.stringify(fixture.manifest[0]));
    expect(() => importArchive({ manifestPath: fixture.manifestPath, sourceRoot: fixture.input, outputRoot: fixture.output, codeCommit: "test" })).toThrow(/UTF-8/i);
  });
});


describe("reviewed data-scope regressions", () => {
  it("keeps the source export read-only by refusing overlapping output trees", () => {
    const fixture = archiveFixture();
    for (const outputRoot of [fixture.input, path.join(fixture.input, "derived"), fixture.root]) expect(() => importArchive({ manifestPath: fixture.manifestPath, sourceRoot: fixture.input, outputRoot, codeCommit: "test" })).toThrow(/overlap/i);
  });
  it("compares perturbation counts on the discovery training partition only", () => {
    const fixture = archiveFixture(Array.from({ length: 6 }, () => [segment("q", "Why?", 0), segment("a", "Because that is the claim.", 10)]));
    const result = analyzeCorpus({ manifestPath: fixture.manifestPath, sourceRoot: fixture.input, outputRoot: fixture.output, codeCommit: "test", nullReplicates: 3, bootstrapReplicates: 5 });
    const motif = result.candidates[0]!;
    expect(motif.occurrence_count).toBe(4); expect(motif.controls.citation_ablation.occurrences).toBe(4);
    expect(new Set(motif.supporting_intervals.map((span) => span.source_id)).size).toBe(motif.cross_episode_count);
    expect(motif.heldout_supporting_intervals).toHaveLength(4);
    expect(motif.supporting_intervals.some((span) => result.evaluation.test_video_ids.includes(span.source_id))).toBe(false);
  });
});


describe("reviewed reproducibility regressions", () => {
  it("preserves immutable raw evidence when analysis runs before an explicit import", () => {
    const fixture = archiveFixture(); const options = { manifestPath: fixture.manifestPath, sourceRoot: fixture.input, outputRoot: fixture.output, codeCommit: "test", nullReplicates: 2, bootstrapReplicates: 2 };
    analyzeCorpus(options); const track = fixture.manifest[0]!.tracks[0]!;
    expect(existsSync(path.join(fixture.output, track.relative_path))).toBe(true);
    const changed = JSON.stringify(segment("new", "Changed evidence.")); writeFileSync(path.join(fixture.input, track.relative_path), changed); track.sha256 = hash(changed); writeFileSync(fixture.manifestPath, JSON.stringify(fixture.manifest[0]));
    expect(() => analyzeCorpus(options)).toThrow(/immutable/i);
  });
  it("mixes neighboring seeds instead of making all two-turn blocks share one permutation", () => {
    const unchanged = Array.from({ length: 100 }, (_, index) => seededShuffle(["A", "B"], 42 + index)).filter((row) => row[0] === "A").length;
    expect(unchanged).toBeGreaterThan(20); expect(unchanged).toBeLessThan(80);
  });
});


describe("science metadata and temporal evaluation regressions", () => {
  it("distinguishes asserted groups, verified independence and unassessed evidence confidence", () => {
    const fixture = archiveFixture(Array.from({ length: 6 }, () => [segment("q", "Why?", 0), segment("a", "Because that is the claim.", 10)]));
    const result = analyzeCorpus({ manifestPath: fixture.manifestPath, sourceRoot: fixture.input, outputRoot: fixture.output, codeCommit: "test", nullReplicates: 2, bootstrapReplicates: 3 });
    const candidate = result.candidates[0]!;
    expect(candidate.supplied_recording_group_count).toBe(4); expect(candidate.verified_independent_recording_count).toBe(0); expect(candidate.publication_blockers).toContain("independence_not_verified");
    const span = candidate.supporting_intervals[0]!; expect(span.evidence_confidence).toBeNull(); expect(span.evidence_confidence_status).toBe("unassessed"); expect(span.speaker_confidence).toBe(0.95); expect(span.original_text).toBe("Why?"); expect(span.extraction_version).toBeTruthy();
    expect(candidate.hypothesis.horizon_segments).toBe(1); expect(candidate.hypothesis).not.toHaveProperty("horizon_turns");
  });
  it("does not call tied chronology a strict later-video evaluation", () => {
    const fixture = archiveFixture(Array.from({ length: 6 }, () => [segment("q", "Why?", 0), segment("a", "Because that is the claim.", 10)]));
    for (const row of fixture.manifest) row.published_at = "2026-01-01T00:00:00Z";
    writeFileSync(fixture.manifestPath, fixture.manifest.map((row) => JSON.stringify(row)).join("\n"));
    const result = analyzeCorpus({ manifestPath: fixture.manifestPath, sourceRoot: fixture.input, outputRoot: fixture.output, codeCommit: "test", nullReplicates: 2, bootstrapReplicates: 3 });
    expect(result.evaluation.status).toBe("insufficient_data"); expect(result.evaluation.temporal_boundary_status).toBe("overlapping_or_tied"); expect(result.evaluation.markov_mean_log_likelihood).toBeNull();
  });
  it("fits Markov and unigram baselines on the same transition-target population", () => {
    const fixture = archiveFixture(Array.from({ length: 6 }, () => [segment("q", "Why?", 0), segment("a", "Because that is the claim.", 10)]));
    const result = analyzeCorpus({ manifestPath: fixture.manifestPath, sourceRoot: fixture.input, outputRoot: fixture.output, codeCommit: "test", nullReplicates: 2, bootstrapReplicates: 3 });
    expect(result.evaluation.markov_mean_log_likelihood).toBeCloseTo(result.evaluation.unigram_mean_log_likelihood!, 12);
  });
  it("bootstrap rediscovery requires distinct supporting source groups", () => {
    const fixture = archiveFixture(Array.from({ length: 3 }, () => [segment("q", "Why?", 0), segment("a", "Because that is the claim.", 10)]));
    const result = analyzeCorpus({ manifestPath: fixture.manifestPath, sourceRoot: fixture.input, outputRoot: fixture.output, codeCommit: "test", nullReplicates: 2, bootstrapReplicates: 200 });
    const stability = result.candidates[0]!.estimated_stability;
    expect(stability.rediscovery_frequency).toBeGreaterThan(0.3); expect(stability.rediscovery_frequency).toBeLessThan(0.7);
    expect(result.evaluation.status).toBe("insufficient_data"); expect(result.evaluation.unigram_mean_log_likelihood).toBeNull();
  });
  it.each(["2026-02-30T00:00:00Z", "2026-01-01T00:00:00", "2026-01-01T24:00:00Z"])("rejects noncanonical calendar/timezone date %s", (published_at) => {
    expect(() => parseManifest(JSON.stringify(record("video0", "", { published_at })))).toThrow(/date|published/i);
  });
});


describe("cross-run corrections and source identity", () => {
  it("archives the exact raw manifest bytes that contribute to a run identity", () => {
    const fixture = archiveFixture(); const raw = "  " + JSON.stringify(fixture.manifest[0], null, 0) + "  \n"; writeFileSync(fixture.manifestPath, raw);
    const result = importArchive({ manifestPath: fixture.manifestPath, sourceRoot: fixture.input, outputRoot: fixture.output, codeCommit: "test" });
    expect(readFileSync(path.join(fixture.output, `manifests/raw-${result.manifest_bytes_hash}.ndjson`), "utf8")).toBe(raw);
  });
  it("writes immutable stale overlays and a revalidation queue for old findings after correction", () => {
    const fixture = archiveFixture(Array.from({ length: 6 }, () => [segment("q", "Why?", 0), segment("a", "Because that is the claim.", 10)]));
    const options = { manifestPath: fixture.manifestPath, sourceRoot: fixture.input, outputRoot: fixture.output, codeCommit: "test", nullReplicates: 2, bootstrapReplicates: 3 };
    const old = analyzeCorpus(options); const track = fixture.manifest[0]!.tracks[0]!; const newBytes = JSON.stringify(segment("corrected", "I do not know.")) + "\n";
    const corrected = { ...track, version: "v2", relative_path: "videos/video0/tracks/manual/v2.jsonl", sha256: hash(newBytes), supersedes_sha256: track.sha256, analysis: true }; track.analysis = false; fixture.manifest[0]!.tracks.push(corrected); writeFileSync(path.join(fixture.input, corrected.relative_path), newBytes); writeFileSync(fixture.manifestPath, fixture.manifest.map((row) => JSON.stringify(row)).join("\n"));
    const current = importArchive(options); const filename = path.join(fixture.output, "evidence", old.run_id, "invalidations", `${current.run_id}.json`);
    expect(existsSync(filename)).toBe(true); const invalidation = JSON.parse(readFileSync(filename, "utf8"));
    expect(invalidation.stale_node_ids).toContain(old.candidates[0]!.substrate_id); expect(invalidation.revalidation_queue).toContain(old.run_id); expect(invalidation.reason).toBe("corpus_manifest_changed");
    importArchive(options); expect(readdirSync(path.dirname(filename))).toHaveLength(1);
  });
  it("uses real YouTube identifiers only for non-synthetic manifest records", () => {
    const permission = { status: "creator_authorized" as const, reference: "supplied authorization reference; not independently authenticated" };
    expect(() => parseManifest(JSON.stringify(record("short", "", { synthetic: false, permission })))).toThrow(/video.*id/i);
    expect(() => parseManifest(JSON.stringify(record("abcdefghijk", "", { synthetic: false, permission })))).not.toThrow();
  });
});
