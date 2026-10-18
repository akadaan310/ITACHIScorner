import { createHash } from "node:crypto";
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, writeFileSync } from "node:fs";
import path from "node:path";

export const PIPELINE_VERSION = "evidence-baseline-1.0.0";
export type Segment = { segment_id: string; start_ms: number; end_ms: number; text: string; speaker: { speaker_id: string; role: "creator" | "guest" | "moderator" | "unknown"; confidence: number }; languages: string[]; instantaneous?: boolean; correction_of?: string };
export type Track = { track_id: string; version: string; relative_path: string; sha256: string; source_format: string; languages: string[]; analysis: boolean; supersedes_sha256?: string };
export type ManifestRecord = { schema_version: 1; platform: "youtube"; video_id: string; recording_id: string; independence_verified: boolean; canonical_url: string; title: string; published_at: string | null; duration_ms: number | null; discovered_at: string; content_type: "video" | "short" | "livestream" | "unknown"; status: "transcribed" | "caption_unavailable" | "rights_pending" | "private" | "deleted" | "retryable_error" | "not_transcribed"; permission: { status: "creator_authorized" | "licensed" | "pending" | "synthetic_test"; reference: string }; tracks: Track[]; synthetic?: boolean };
export type Feature = Segment & { speech_act: string; annotation_status: "heuristic_proposal"; tokens: { original: string; normalized: string; start: number; end: number }[]; script_spans: { script: string; start: number; end: number }[] };
export type LineageNode = { id: string; kind: string; parents: string[] };
export type ArchiveOptions = { manifestPath: string; sourceRoot: string; outputRoot: string; codeCommit: string; codeHash?: string };
export type AnalysisOptions = ArchiveOptions & { seed?: number; nullReplicates?: number; bootstrapReplicates?: number; minVideos?: number; maxLength?: number };
export type EvidenceSpan = { source_id: string; video_id: string; recording_id: string; track_id: string; transcript_version: string; segment_id: string; start_ms: number; end_ms: number; source_sha256: string; speaker_id: string; speaker_role: string; speaker_confidence: number; evidence_confidence: null; evidence_confidence_status: "unassessed"; extraction_version: string; original_text: string; source_url: string; synthetic: boolean };
type LoadedVideo = { record: ManifestRecord; tracks: { track: Track; bytes: Buffer; segments: Segment[] }[] };
type SequenceSource = { source_id: string; recording_id: string; blocks: Feature[][] };
type Motif = { symbols: string[]; occurrence_count: number; cross_episode_count: number; supplied_recording_group_count: number; source_ids: string[]; recording_ids: string[] };
const statuses = ["transcribed", "caption_unavailable", "rights_pending", "private", "deleted", "retryable_error", "not_transcribed"] as const;
const roles = ["creator", "guest", "moderator", "unknown"];
const idPattern = /^[A-Za-z0-9_-]{1,128}$/;
const hashPattern = /^[a-f0-9]{64}$/;
function requireThat(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function object(value: unknown): Record<string, unknown> { requireThat(value !== null && typeof value === "object" && !Array.isArray(value), "Expected an object"); return value as Record<string, unknown>; }
function string(value: unknown, label: string): asserts value is string { requireThat(typeof value === "string" && value.trim().length > 0, `Invalid ${label}`); }
function safeId(value: unknown, label: string): asserts value is string { requireThat(typeof value === "string" && idPattern.test(value), `Unsafe ${label}`); }
function strings(value: unknown, label: string): asserts value is string[] { requireThat(Array.isArray(value) && value.every((entry) => typeof entry === "string" && entry.trim().length > 0), `Invalid ${label}`); }
function knownFields(value: Record<string, unknown>, allowed: string[], label: string) { requireThat(Object.keys(value).every((key) => allowed.includes(key)), `Unknown ${label} field`); }
function decodeUtf8(bytes: Uint8Array): string { try { return new TextDecoder("utf-8", { fatal: true }).decode(bytes); } catch { throw new Error("Invalid UTF-8 source encoding"); } }
function date(value: unknown, label: string) {
  requireThat(typeof value === "string", `Invalid ${label} date`);
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/.exec(value);
  requireThat(match && Number.isFinite(Date.parse(value)), `Invalid ${label} date/timezone`);
  const year = Number(match[1]), month = Number(match[2]), day = Number(match[3]), leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  requireThat(month >= 1 && month <= 12 && day >= 1 && day <= days[month - 1]! && Number(match[4]) < 24 && Number(match[5]) < 60 && Number(match[6]) < 60, `Invalid ${label} calendar date`);
}
export function sha256(value: string | Uint8Array): string { return createHash("sha256").update(value).digest("hex"); }
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") { const encoded = JSON.stringify(value); requireThat(encoded !== undefined, "Cannot canonicalize undefined"); return encoded; }
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  const row = value as Record<string, unknown>;
  return `{${Object.keys(row).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(row[key])}`).join(",")}}`;
}
function parseLines(text: string, label: string): unknown[] {
  return text.split(/\r?\n/).flatMap((line, index) => {
    if (!line.trim()) return [];
    try { return [JSON.parse(line) as unknown]; } catch { throw new Error(`Invalid ${label} JSON at line ${index + 1}`); }
  });
}
export function validateInterval(value: { start_ms: number; end_ms: number; instantaneous?: boolean }): void {
  requireThat(Number.isSafeInteger(value.start_ms) && value.start_ms >= 0 && Number.isSafeInteger(value.end_ms) && value.end_ms > value.start_ms, "Invalid nonnegative half-open millisecond interval");
  requireThat(value.instantaneous === undefined || typeof value.instantaneous === "boolean", "Invalid instantaneous flag");
  requireThat(!value.instantaneous || value.end_ms === value.start_ms + 1, "An instantaneous span must be exactly 1ms");
}
export function parseManifest(text: string): ManifestRecord[] {
  const seen = new Set<string>(), paths = new Set<string>();
  const records = parseLines(text, "manifest").map((value) => {
    const row = object(value); knownFields(row, ["schema_version", "platform", "video_id", "recording_id", "independence_verified", "canonical_url", "title", "published_at", "duration_ms", "discovered_at", "content_type", "status", "permission", "tracks", "synthetic"], "manifest"); requireThat(row.schema_version === 1 && row.platform === "youtube", "Unsupported manifest schema/platform (v1 supports YouTube exports)");
    safeId(row.video_id, "video_id"); requireThat(row.synthetic === true || /^[A-Za-z0-9_-]{11}$/.test(row.video_id), "Non-synthetic YouTube video_id must have exactly 11 characters"); string(row.recording_id, "recording_id"); string(row.title, "title");
    requireThat(typeof row.independence_verified === "boolean", "Explicit independence_verified is required");
    requireThat(row.canonical_url === `https://www.youtube.com/watch?v=${row.video_id}`, "Invalid canonical source URL");
    date(row.discovered_at, "discovered_at"); if (row.published_at !== null) date(row.published_at, "published_at");
    requireThat(row.duration_ms === null || (Number.isSafeInteger(row.duration_ms) && Number(row.duration_ms) >= 0), "Invalid duration_ms");
    requireThat(["video", "short", "livestream", "unknown"].includes(String(row.content_type)), "Invalid content_type");
    requireThat(statuses.includes(row.status as ManifestRecord["status"]), "Invalid source status");
    requireThat(row.synthetic === undefined || typeof row.synthetic === "boolean", "Invalid synthetic flag");
    const permission = object(row.permission); knownFields(permission, ["status", "reference"], "permission"); string(permission.reference, "permission reference");
    requireThat(["creator_authorized", "licensed", "pending", "synthetic_test"].includes(String(permission.status)), "Invalid permission status");
    requireThat(permission.status !== "synthetic_test" || row.synthetic === true, "Synthetic permission requires synthetic flag");
    requireThat(Array.isArray(row.tracks), "Missing tracks");
    if (row.status === "transcribed") {
      requireThat(permission.status !== "pending", "Transcript permission is pending");
      requireThat(row.tracks.length > 0, "Transcribed status requires tracks");
    } else requireThat(row.tracks.length === 0, "Unacquired sources cannot supply transcript tracks");
    const trackKeys = new Set<string>();
    for (const rawTrack of row.tracks) {
      const track = object(rawTrack); knownFields(track, ["track_id", "version", "relative_path", "sha256", "source_format", "languages", "analysis", "supersedes_sha256"], "track"); safeId(track.track_id, "track_id"); safeId(track.version, "version");
      const expectedPath = `videos/${row.video_id}/tracks/${track.track_id}/${track.version}.jsonl`;
      requireThat(track.relative_path === expectedPath && !paths.has(expectedPath), "Unsafe or duplicate track path"); paths.add(expectedPath);
      requireThat(typeof track.sha256 === "string" && hashPattern.test(track.sha256), "Invalid track checksum");
      requireThat(track.supersedes_sha256 === undefined || (typeof track.supersedes_sha256 === "string" && hashPattern.test(track.supersedes_sha256) && track.supersedes_sha256 !== track.sha256), "Invalid correction checksum");
      string(track.source_format, "source_format"); strings(track.languages, "track languages"); requireThat(typeof track.analysis === "boolean", "Explicit analysis selection required");
      const key = `${track.track_id}:${track.version}`; requireThat(!trackKeys.has(key), "Duplicate track/version"); trackKeys.add(key);
    }
    requireThat(row.status !== "transcribed" || row.tracks.filter((track) => object(track).analysis === true).length === 1, "Exactly one analysis track/version is required per transcribed video");
    const key = `youtube:${row.video_id}`; requireThat(!seen.has(key), "Duplicate video_id"); seen.add(key);
    return row as unknown as ManifestRecord;
  });
  return records.sort((a, b) => a.video_id.localeCompare(b.video_id));
}
export function parseSegments(text: string, record: ManifestRecord): Segment[] {
  const ids = new Set<string>();
  return parseLines(text, "segment").map((value) => {
    const row = object(value); safeId(row.segment_id, "segment_id"); requireThat(!ids.has(row.segment_id), "Duplicate segment_id"); ids.add(row.segment_id);
    validateInterval(row as unknown as Segment); requireThat(record.duration_ms === null || Number(row.end_ms) <= record.duration_ms, "Segment exceeds video duration");
    string(row.text, "segment text"); const speaker = object(row.speaker); string(speaker.speaker_id, "speaker_id");
    requireThat(roles.includes(String(speaker.role)), "Invalid speaker role"); requireThat(typeof speaker.confidence === "number" && Number.isFinite(speaker.confidence) && speaker.confidence >= 0 && speaker.confidence <= 1, "Invalid speaker confidence");
    strings(row.languages, "segment languages"); if (row.correction_of !== undefined) string(row.correction_of, "correction_of");
    return row as unknown as Segment;
  }).sort((a, b) => a.start_ms - b.start_ms || a.end_ms - b.end_ms || a.segment_id.localeCompare(b.segment_id));
}
export function sourceDeepLink(record: ManifestRecord, startMs: number): string {
  requireThat(Number.isSafeInteger(startMs) && startMs >= 0, "Invalid timestamp"); return `${record.canonical_url}&t=${Math.floor(startMs / 1000)}s`;
}
function contained(root: string, filename: string) { const relative = path.relative(root, filename); return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative)); }
function canonicalFuture(filename: string): string {
  const missing: string[] = []; let current = path.resolve(filename);
  while (!existsSync(current)) { missing.unshift(path.basename(current)); const parent = path.dirname(current); requireThat(parent !== current, "Cannot resolve output path"); current = parent; }
  return path.join(realpathSync(current), ...missing);
}
function noSymlinkComponents(filename: string) {
  let current = path.resolve(filename);
  while (true) {
    // lstat also sees broken links, while existsSync does not.
    try { requireThat(!lstatSync(current).isSymbolicLink(), "Output symlink paths are forbidden"); } catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
    const parent = path.dirname(current); if (parent === current) break; current = parent;
  }
}
export function assertPrivateOutput(filename: string): string {
  noSymlinkComponents(filename); const canonical = canonicalFuture(filename); let current = canonical;
  while (true) { requireThat(!existsSync(path.join(current, ".git")), "Private archive output must be outside every git checkout/worktree"); const parent = path.dirname(current); if (parent === current) break; current = parent; }
  return canonical;
}
function outputPath(root: string, relative: string): string {
  const full = path.resolve(root, relative); requireThat(contained(root, full), "Output path escape"); assertPrivateOutput(full); return full;
}
function checkImmutable(filename: string, bytes: string | Buffer) {
  noSymlinkComponents(filename);
  if (existsSync(filename)) requireThat(sha256(readFileSync(filename)) === sha256(bytes), "Immutable version collision; use a new source version");
}
function writeImmutable(filename: string, bytes: string | Buffer) {
  checkImmutable(filename, bytes); if (existsSync(filename)) return;
  mkdirSync(path.dirname(filename), { recursive: true, mode: 0o700 });
  try { writeFileSync(filename, bytes, { flag: "wx", mode: 0o600 }); } catch (error) { if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error; checkImmutable(filename, bytes); }
}
function loadArchive(options: ArchiveOptions) {
  string(options.codeCommit, "code commit"); const outputRoot = assertPrivateOutput(options.outputRoot), sourceRoot = realpathSync(options.sourceRoot);
  requireThat(!contained(sourceRoot, outputRoot) && !contained(outputRoot, sourceRoot), "Source and output archive trees must not overlap");
  const manifestBytes = readFileSync(options.manifestPath), records = parseManifest(decodeUtf8(manifestBytes));
  const loaded: LoadedVideo[] = records.map((record) => ({ record, tracks: record.tracks.map((track) => {
    const filename = realpathSync(path.resolve(sourceRoot, track.relative_path)); requireThat(contained(sourceRoot, filename), "Input symlink/path escape from export root");
    const bytes = readFileSync(filename); requireThat(sha256(bytes) === track.sha256, "Source checksum mismatch");
    const segments = parseSegments(decodeUtf8(bytes), record); requireThat(segments.length > 0, "Transcribed track is empty");
    checkImmutable(outputPath(outputRoot, track.relative_path), bytes); return { track, bytes, segments };
  }) }));
  const canonicalManifest = records.map(canonicalJson).join("\n") + (records.length ? "\n" : "");
  return { loaded, outputRoot, manifestBytes, manifest_hash: sha256(canonicalManifest), manifest_bytes_hash: sha256(manifestBytes), canonicalManifest };
}
export function coverageReport(records: ManifestRecord[]) {
  const by_status = Object.fromEntries(statuses.map((status) => [status, records.filter((record) => record.status === status).length]));
  return { schema_version: 1, discovered_videos: records.length, transcribed_videos: records.filter((record) => record.status === "transcribed").length, verified_real_videos: records.filter((record) => record.status === "transcribed" && !record.synthetic).length, synthetic_videos: records.filter((record) => record.synthetic).length,
    transcript_versions: records.reduce((count, record) => count + record.tracks.length, 0), inventory_completeness: "unknown" as const, inventory_total: null, transcript_percentage_of_inventory: null, by_status,
    verification_scope: "verified_real_videos means checksum/contract-validated authorized-import assertions; platform existence and permission authenticity are not independently verified", inventory_limitation: "No independently verified exhaustive channel listing supplied; manifest discovery count is not a completeness claim.", handoff_status: records.length ? "supplied_export_only" : "awaiting_authorized_handoff" };
}
function codeFingerprint(options: ArchiveOptions) { return { version: PIPELINE_VERSION, code_commit: options.codeCommit, code_sha256: options.codeHash ?? sha256(readFileSync(new URL(import.meta.url))) }; }
function persistImport(archive: ReturnType<typeof loadArchive>, options: ArchiveOptions) {
  const coverage = coverageReport(archive.loaded.map((video) => video.record));
  const config = { command: "import", code: codeFingerprint(options), manifest_hash: archive.manifest_hash, manifest_bytes_hash: archive.manifest_bytes_hash };
  const run_id = `import-${sha256(canonicalJson(config)).slice(0, 24)}`;
  const manifestName = `manifests/${archive.manifest_hash}.ndjson`, rawManifestName = `manifests/raw-${archive.manifest_bytes_hash}.ndjson`;
  const coverageBytes = canonicalJson(coverage) + "\n";
  const run = { schema_version: 1, run_id, ...config, outputs: { [manifestName]: sha256(archive.canonicalManifest), [rawManifestName]: archive.manifest_bytes_hash, [`coverage/${run_id}.json`]: sha256(coverageBytes), ...Object.fromEntries(archive.loaded.flatMap((video) => video.tracks.map(({ track }) => [track.relative_path, track.sha256]))) } };
  for (const video of archive.loaded) for (const { track, bytes } of video.tracks) writeImmutable(outputPath(archive.outputRoot, track.relative_path), bytes);
  writeImmutable(outputPath(archive.outputRoot, manifestName), archive.canonicalManifest);
  writeImmutable(outputPath(archive.outputRoot, rawManifestName), archive.manifestBytes);
  writeImmutable(outputPath(archive.outputRoot, `coverage/${run_id}.json`), coverageBytes);
  writeImmutable(outputPath(archive.outputRoot, `runs/${run_id}/run_manifest.json`), canonicalJson(run) + "\n");
  invalidatePriorAnalyses(archive, run_id);
  return { run_id, manifest_hash: archive.manifest_hash, manifest_bytes_hash: archive.manifest_bytes_hash, coverage, run_manifest: run };
}

function readJsonObject(filename: string): Record<string, unknown> {
  try { return object(JSON.parse(decodeUtf8(readFileSync(filename)))); } catch { throw new Error("Invalid prior private run artifact"); }
}
function invalidatePriorAnalyses(archive: ReturnType<typeof loadArchive>, importRunId: string): void {
  const evidenceRoot = outputPath(archive.outputRoot, "evidence"); if (!existsSync(evidenceRoot)) return;
  for (const entry of readdirSync(evidenceRoot, { withFileTypes: true })) {
    if (!/^analysis-[a-f0-9]{24}$/.test(entry.name)) continue;
    const lineagePath = outputPath(archive.outputRoot, `evidence/${entry.name}/lineage.json`), receiptPath = outputPath(archive.outputRoot, `runs/${entry.name}/run_manifest.json`);
    if (!existsSync(lineagePath) || !existsSync(receiptPath)) continue; // Interrupted runs have no completed receipt.
    const previous = readJsonObject(receiptPath); if (previous.data_manifest_hash === archive.manifest_hash) continue;
    const lineage = readJsonObject(lineagePath); requireThat(Array.isArray(lineage.nodes), "Invalid prior lineage nodes");
    const nodes = lineage.nodes as LineageNode[]; assertLineageDag(nodes);
    const roots = nodes.filter((node) => node.kind === "manifest").map((node) => node.id);
    const changed = roots.length ? roots : nodes.filter((node) => node.kind === "source").map((node) => node.id);
    const stale_node_ids = markStale(nodes, changed);
    const overlay = { schema_version: 1, invalidated_run_id: entry.name, replacement_import_run_id: importRunId, reason: "corpus_manifest_changed", previous_manifest_hash: previous.data_manifest_hash, replacement_manifest_hash: archive.manifest_hash, stale_node_ids, revalidation_queue: nodes.filter((node) => stale_node_ids.includes(node.id) && ["run", "candidate", "review", "learning_unit"].includes(node.kind)).map((node) => node.id).sort(), source_corrections: archive.loaded.flatMap((video) => video.tracks.filter(({ track }) => track.supersedes_sha256).map(({ track }) => ({ video_id: video.record.video_id, track_id: track.track_id, version: track.version, previous_sha256: track.supersedes_sha256!, replacement_sha256: track.sha256 }))), pedagogy_eligible: false };
    writeImmutable(outputPath(archive.outputRoot, `evidence/${entry.name}/invalidations/${importRunId}.json`), canonicalJson(overlay) + "\n");
  }
}

export function importArchive(options: ArchiveOptions) { return persistImport(loadArchive(options), options); }

const rules: [string, RegExp][] = [
  ["evidence_request", /\b(?:what|where|show|give|provide).{0,35}\b(?:evidence|source|proof)\b|ما\s+(?:هو\s+)?(?:الدليل|المصدر)/iu],
  ["clarification", /\b(?:clarify|clarification|what do you mean|let me clarify)\b|(?:ماذا تقصد|توضيح)/iu],
  ["refusal", /\b(?:i (?:will not|won't|refuse)|cannot answer|can't answer)\b|(?:لن أجيب|لا أستطيع الإجابة)/iu],
  ["uncertainty", /\b(?:i (?:do not|don't) know|perhaps|i am unsure|i'm unsure)\b|(?:لا أعلم|ربما)/iu],
  ["concession", /\b(?:you are right|you're right|i agree|i concede)\b|(?:أوافق|صحيح)/iu],
  ["citation", /\b(?:qur'?an|quran|bible|hadith|source says|surah)\b|\b\d{1,3}:\d{1,3}\b|(?:القرآن|سورة|حديث)/iu],
  ["rebuttal", /\b(?:i disagree|however|that does not|that doesn't|but because)\b|(?:أختلف|ولكن)/iu],
  ["summary", /\b(?:in summary|to summarize|to sum up)\b|(?:الخلاصة|باختصار)/iu],
  ["return_to_claim", /\b(?:back to (?:the|your|our) (?:claim|question)|original (?:claim|question))\b/iu],
  ["question", /[?؟]|^(?:why|how|what|when|where|who|is |are |does |do )|^(?:هل|لماذا|كيف|متى|أين)\b/iu],
  ["claim", /\b(?:is|are|because|therefore|claim|means)\b|(?:لأن|إذن|يعني)/iu],
];
export function extractFeatures(segments: Segment[]): Feature[] {
  return segments.map((segment) => {
    const tokens = [...segment.text.matchAll(/[\p{L}\p{N}]+(?:['’][\p{L}]+)?/gu)].map((match) => ({ original: match[0], normalized: match[0].normalize("NFC").toLocaleLowerCase("en"), start: match.index, end: match.index + match[0].length }));
    const script_spans = tokens.map((token) => ({ script: /\p{Script=Arabic}/u.test(token.original) ? "arabic" : /\p{Script=Latin}/u.test(token.original) ? "latin" : "other", start: token.start, end: token.end }));
    return { ...segment, speech_act: rules.find(([, expression]) => expression.test(segment.text))?.[0] ?? "unknown", annotation_status: "heuristic_proposal", tokens, script_spans };
  });
}
const symbol = (feature: Feature) => `${feature.speaker.role}:${feature.speech_act}`;
export function sequenceBlocks(features: Feature[]): Feature[][] {
  const sorted = [...features].sort((a, b) => a.start_ms - b.start_ms || a.end_ms - b.end_ms || a.segment_id.localeCompare(b.segment_id));
  const ambiguous = new Set<string>(); let cluster: Feature[] = [], clusterEnd = -1;
  for (const feature of sorted) {
    if (feature.start_ms < clusterEnd) { cluster.push(feature); clusterEnd = Math.max(clusterEnd, feature.end_ms); } else { if (cluster.length > 1) for (const row of cluster) ambiguous.add(row.segment_id); cluster = [feature]; clusterEnd = feature.end_ms; }
  }
  if (cluster.length > 1) for (const row of cluster) ambiguous.add(row.segment_id);
  const blocks: Feature[][] = []; let current: Feature[] = [];
  for (const feature of sorted) {
    if (ambiguous.has(feature.segment_id) || feature.speech_act === "unknown" || feature.speaker.role === "unknown") { if (current.length) blocks.push(current); current = []; }
    else current.push(feature);
  }
  if (current.length) blocks.push(current); return blocks;
}
function windows(blocks: Feature[][], length: number) { return blocks.flatMap((block) => Array.from({ length: Math.max(0, block.length - length + 1) }, (_, index) => block.slice(index, index + length))); }
function countMotif(blocks: Feature[][], symbols: string[]): number { return windows(blocks, symbols.length).filter((window) => window.every((feature, index) => symbol(feature) === symbols[index])).length; }
export function mineMotifs(sources: SequenceSource[], config: { minVideos: number; maxLength: number }): Motif[] {
  const found = new Map<string, { symbols: string[]; count: number; sources: Set<string>; groups: Set<string> }>();
  for (const source of sources) for (let length = 2; length <= config.maxLength; length++) for (const window of windows(source.blocks, length)) {
    const symbols = window.map(symbol), key = symbols.join("→"), entry = found.get(key) ?? { symbols, count: 0, sources: new Set<string>(), groups: new Set<string>() };
    entry.count++; entry.sources.add(source.source_id); entry.groups.add(source.recording_id); found.set(key, entry);
  }
  return [...found.entries()].filter(([, entry]) => entry.groups.size >= config.minVideos).sort(([a], [b]) => a.localeCompare(b)).map(([, entry]) => ({ symbols: entry.symbols, occurrence_count: entry.count, cross_episode_count: entry.sources.size, supplied_recording_group_count: entry.groups.size, source_ids: [...entry.sources].sort(), recording_ids: [...entry.groups].sort() }));
}
function rng(seed: number) {
  // Mulberry32 diffuses adjacent seeds; the previous LCG correlated short-block shuffles.
  let state = seed >>> 0;
  return () => { state = (state + 0x6D2B79F5) >>> 0; let mixed = state; mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1); mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61); return ((mixed ^ (mixed >>> 14)) >>> 0) / 0x100000000; };
}
export function seededShuffle<T>(values: T[], seed: number): T[] { const result = [...values], random = rng(seed); for (let index = result.length - 1; index > 0; index--) { const target = Math.floor(random() * (index + 1)); [result[index], result[target]] = [result[target]!, result[index]!]; } return result; }
export function evaluateContinuation(blocks: Feature[][], symbols: string[]) {
  requireThat(symbols.length >= 2, "A continuation needs an antecedent and predicted suffix"); const supporting: Feature[][] = [], counterexamples: Feature[][] = []; let censored = 0;
  for (const block of blocks) for (let index = 0; index < block.length; index++) if (symbol(block[index]!) === symbols[0]) {
    if (index + symbols.length > block.length) { censored++; continue; }
    const window = block.slice(index, index + symbols.length); (window.every((feature, offset) => symbol(feature) === symbols[offset]) ? supporting : counterexamples).push(window);
  }
  return { supporting, counterexamples, censored, opportunities: supporting.length + counterexamples.length, horizon_segments: symbols.length - 1 };
}
function quantile(sorted: number[], probability: number) { return sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(probability * (sorted.length - 1)))]! : null; }
function bootstrap(sources: SequenceSource[], symbols: string[], replicates: number, seed: number, minSupport: number) {
  const groups = [...new Set(sources.map((source) => source.recording_id))].sort(), has = new Map(groups.map((group) => [group, sources.some((source) => source.recording_id === group && countMotif(source.blocks, symbols) > 0)]));
  if (groups.length < 2) return { status: "insufficient_data", unit: "recording_group", replicates: 0, prevalence: null, interval_95: null, rediscovery_frequency: null };
  const random = rng(seed), estimates: number[] = []; let rediscovered = 0;
  for (let replicate = 0; replicate < replicates; replicate++) {
    let support = 0; const distinctSupporting = new Set<string>(); for (let index = 0; index < groups.length; index++) { const drawn = groups[Math.floor(random() * groups.length)]!; if (has.get(drawn)) { support++; distinctSupporting.add(drawn); } }
    estimates.push(support / groups.length); if (distinctSupporting.size >= minSupport) rediscovered++;
  }
  estimates.sort((a, b) => a - b); return { status: "descriptive_only", unit: "recording_group", replicates, prevalence: groups.filter((group) => has.get(group)).length / groups.length, interval_95: [quantile(estimates, 0.025), quantile(estimates, 0.975)], rediscovery_frequency: rediscovered / replicates };
}
function evaluateMarkov(train: SequenceSource[], test: SequenceSource[]) {
  const transitions: Record<string, number> = {}, unigrams: Record<string, number> = {}, outgoing: Record<string, number> = {}; const alphabet = new Set<string>(["<unknown>"]);
  for (const source of train) for (const block of source.blocks) for (let index = 0; index < block.length; index++) {
    const current = symbol(block[index]!); alphabet.add(current);
    if (index > 0) { unigrams[current] = (unigrams[current] ?? 0) + 1; const previous = symbol(block[index - 1]!); const key = `${previous}→${current}`; transitions[key] = (transitions[key] ?? 0) + 1; outgoing[previous] = (outgoing[previous] ?? 0) + 1; }
  }
  const alpha = 0.5, vocabulary = [...alphabet].sort(), totalTokens = Object.values(unigrams).reduce((a, b) => a + b, 0); let markovLog = 0, unigramLog = 0, count = 0;
  for (const source of test) for (const block of source.blocks) for (let index = 1; index < block.length; index++) {
    const previousRaw = symbol(block[index - 1]!), nextRaw = symbol(block[index]!); const previous = alphabet.has(previousRaw) ? previousRaw : "<unknown>", next = alphabet.has(nextRaw) ? nextRaw : "<unknown>";
    markovLog += Math.log(((transitions[`${previous}→${next}`] ?? 0) + alpha) / ((outgoing[previous] ?? 0) + alpha * vocabulary.length));
    unigramLog += Math.log(((unigrams[next] ?? 0) + alpha) / (totalTokens + alpha * vocabulary.length)); count++;
  }
  return { transitions, alpha, vocabulary, heldout_transitions: count, markov_mean_log_likelihood: count ? markovLog / count : null, unigram_mean_log_likelihood: count ? unigramLog / count : null };
}
function temporalSplit(sources: { record: ManifestRecord; source: SequenceSource }[]) {
  const groups = [...new Set(sources.map((source) => source.record.recording_id))].map((group) => {
    const members = sources.filter((source) => source.record.recording_id === group); return { group, members, time: members.every((member) => member.record.published_at !== null) ? Math.max(...members.map((member) => Date.parse(member.record.published_at!))) : null };
  });
  const dated = groups.filter((group) => group.time !== null).sort((a, b) => a.time! - b.time! || a.group.localeCompare(b.group));
  const cutoff = Math.ceil(dated.length * 2 / 3), trainGroups = dated.slice(0, cutoff), testGroups = dated.slice(cutoff);
  const trainTimes = trainGroups.flatMap((group) => group.members.map((member) => Date.parse(member.record.published_at!))), testTimes = testGroups.flatMap((group) => group.members.map((member) => Date.parse(member.record.published_at!)));
  const boundary = !trainTimes.length || !testTimes.length ? "insufficient_data" : Math.min(...testTimes) > Math.max(...trainTimes) ? "strictly_later" : "overlapping_or_tied";
  const enough = trainGroups.length >= 2 && testGroups.length >= 2 && boundary === "strictly_later";
  return { train: trainGroups.flatMap((group) => group.members.map((member) => member.source)), test: testGroups.flatMap((group) => group.members.map((member) => member.source)), enough, boundary,
    excluded: groups.filter((group) => group.time === null).flatMap((group) => group.members.map((member) => member.source.source_id)), definition: "recording groups ordered by latest member publication date; undated groups excluded; earlier ceil(2/3) train" };
}
function evidence(video: LoadedVideo, track: Track, feature: Feature): EvidenceSpan {
  return { source_id: `youtube:${video.record.video_id}`, video_id: video.record.video_id, recording_id: video.record.recording_id, track_id: track.track_id, transcript_version: track.version, segment_id: feature.segment_id, start_ms: feature.start_ms, end_ms: feature.end_ms, source_sha256: track.sha256, speaker_id: feature.speaker.speaker_id, speaker_role: feature.speaker.role, speaker_confidence: feature.speaker.confidence, evidence_confidence: null, evidence_confidence_status: "unassessed", extraction_version: PIPELINE_VERSION, original_text: feature.text, source_url: sourceDeepLink(video.record, feature.start_ms), synthetic: video.record.synthetic === true };
}
export function publicationBlockers(candidate: Record<string, unknown>): string[] {
  const blockers = ["authenticated_editorial_gate_required"]; // JSON flags can never authorize publication.
  if (candidate.synthetic) blockers.push("synthetic_evidence"); if (candidate.stale) blockers.push("stale_lineage");
  if (Number(candidate.verified_independent_recording_count ?? 0) < 2) blockers.push("independence_not_verified");
  if (Number(candidate.cross_episode_count ?? 0) < 2) blockers.push("insufficient_cross_video_support");
  if (candidate.discrimination_status !== "established") blockers.push("matched_contrast_not_established");
  if (candidate.creator_approved !== true) blockers.push("creator_permission_required");
  if (candidate.reviewer_status !== "approved") blockers.push("editorial_review_required");
  if (!Array.isArray(candidate.supporting_intervals) || !candidate.supporting_intervals.length) blockers.push("source_evidence_required");
  return blockers;
}
export function assertLineageDag(nodes: LineageNode[]): void {
  const byId = new Map<string, LineageNode>(); for (const node of nodes) { requireThat(!byId.has(node.id), "Duplicate lineage node"); byId.set(node.id, node); }
  const active = new Set<string>(), done = new Set<string>();
  function visit(id: string) { requireThat(!active.has(id), "Lineage cycle"); if (done.has(id)) return; const node = byId.get(id); requireThat(node, "Missing lineage parent"); active.add(id); for (const parent of node.parents) visit(parent); active.delete(id); done.add(id); }
  for (const node of nodes) visit(node.id);
}
export function markStale(nodes: LineageNode[], changedIds: string[]): string[] {
  assertLineageDag(nodes); const stale = new Set(changedIds); for (const id of stale) requireThat(nodes.some((node) => node.id === id), "Unknown changed lineage source");
  let changed = true; while (changed) { changed = false; for (const node of nodes) if (!stale.has(node.id) && node.parents.some((parent) => stale.has(parent))) { stale.add(node.id); changed = true; } }
  return [...stale].sort();
}
export function analyzeCorpus(options: AnalysisOptions) {
  const archive = loadArchive(options), seed = options.seed ?? 42, nullReplicates = options.nullReplicates ?? 49, bootstrapReplicates = options.bootstrapReplicates ?? 200, minVideos = options.minVideos ?? 2, maxLength = options.maxLength ?? 4;
  requireThat(Number.isSafeInteger(seed) && Number.isSafeInteger(nullReplicates) && nullReplicates >= 1 && nullReplicates <= 10000 && Number.isSafeInteger(bootstrapReplicates) && bootstrapReplicates >= 1 && bootstrapReplicates <= 10000 && Number.isSafeInteger(minVideos) && minVideos >= 2 && Number.isSafeInteger(maxLength) && maxLength >= 2 && maxLength <= 4, "Invalid deterministic analysis configuration");
  const importReceipt = persistImport(archive, options);
  const config = { seed, nullReplicates, bootstrapReplicates, minVideos, maxLength, extractor: PIPELINE_VERSION, rng: "mulberry32" }, code = codeFingerprint(options), config_hash = sha256(canonicalJson(config));
  const run_id = `analysis-${sha256(canonicalJson({ config_hash, manifest_hash: archive.manifest_hash, manifest_bytes_hash: archive.manifest_bytes_hash, code })).slice(0, 24)}`;
  const selected = archive.loaded.flatMap((video) => video.tracks.filter(({ track }) => track.analysis).map(({ track, segments }) => ({ video, track, features: extractFeatures(segments) })));
  const sources = selected.map((entry) => ({ record: entry.video.record, source: { source_id: `youtube:${entry.video.record.video_id}`, recording_id: entry.video.record.recording_id, blocks: sequenceBlocks(entry.features) } }));
  const split = temporalSplit(sources); const baseline = evaluateMarkov(split.train, split.test);
  const evaluation = { status: split.enough && baseline.heldout_transitions > 0 ? "evaluated" : "insufficient_data", train_video_ids: split.train.map((source) => source.source_id), test_video_ids: split.test.map((source) => source.source_id), excluded_undated_video_ids: split.excluded, split_definition: split.definition, temporal_boundary_status: split.boundary, temporal_date_provenance: "supplied_manifest_assertions_not_remotely_verified", ...baseline, ...(!split.enough ? { markov_mean_log_likelihood: null, unigram_mean_log_likelihood: null } : {}) };
  // Candidate selection uses training only. Without a valid held-out partition these remain exploratory proposals.
  const motifs = mineMotifs(split.train, { minVideos, maxLength });
  const trainIds = new Set(split.train.map((source) => source.source_id)), testIds = new Set(split.test.map((source) => source.source_id));
  const trainSelected = selected.filter((entry) => trainIds.has(`youtube:${entry.video.record.video_id}`)), testSelected = selected.filter((entry) => testIds.has(`youtube:${entry.video.record.video_id}`));
  const candidates = motifs.map((motif) => {
    function observations(entries: typeof selected) {
      const supporting: EvidenceSpan[] = [], counterexamples: EvidenceSpan[] = []; let censored = 0, opportunities = 0;
      for (const entry of entries) { const continuation = evaluateContinuation(sequenceBlocks(entry.features), motif.symbols); censored += continuation.censored; opportunities += continuation.opportunities; for (const window of continuation.supporting) for (const feature of window) supporting.push(evidence(entry.video, entry.track, feature)); for (const window of continuation.counterexamples) for (const feature of window) counterexamples.push(evidence(entry.video, entry.track, feature)); }
      return { supporting, counterexamples, censored, opportunities };
    }
    const { supporting, counterexamples, censored, opportunities } = observations(trainSelected), heldoutEvidence = observations(testSelected);
    const observed = split.train.reduce((sum, source) => sum + countMotif(source.blocks, motif.symbols), 0), nullCounts: number[] = [];
    for (let replicate = 0; replicate < nullReplicates; replicate++) nullCounts.push(split.train.reduce((sum, source, sourceIndex) => sum + source.blocks.reduce((blockSum, block, blockIndex) => blockSum + countMotif([seededShuffle(block, seed + replicate * 104729 + sourceIndex * 1009 + blockIndex)], motif.symbols), 0), 0));
    const shuffledAtLeastObserved = nullCounts.filter((count) => count >= observed).length, pValue = (1 + shuffledAtLeastObserved) / (1 + nullReplicates);
    const transform = (kind: "role" | "citation" | "noise") => trainSelected.reduce((sum, entry, entryIndex) => {
      const random = rng(seed + entryIndex); const changed = entry.features.map((feature) => {
        if (kind === "role") return { ...feature, speaker: { ...feature.speaker, role: feature.speaker.role === "creator" ? "guest" as const : feature.speaker.role === "guest" ? "creator" as const : feature.speaker.role } };
        if (kind === "citation") return feature.speech_act === "citation" ? { ...feature, speech_act: "unknown" } : feature;
        const noisyText = feature.text.replace(/[\p{L}\p{N}]+(?:['’][\p{L}]+)?/gu, (token) => random() < 0.1 ? "" : token); return extractFeatures([{ ...feature, text: noisyText || " " }])[0]!;
      }); return sum + countMotif(sequenceBlocks(changed), motif.symbols);
    }, 0);
    const id = `motif-${sha256(canonicalJson({ symbols: motif.symbols, run_id })).slice(0, 20)}`;
    const status = pValue <= 0.05 ? "order_exceeds_descriptive_shuffle_control" : "not_distinguished_from_shuffle";
    const candidate = { substrate_id: id, label_internal: motif.symbols.join(" → "), definition: "Contiguous role/heuristic-act sequence; not an attributed teaching technique", observation_schema: "segment-features-v1", extraction_algorithm: "bounded-contiguous-motifs-2-to-4", code_commit: options.codeCommit, config_hash, data_manifest_hash: archive.manifest_hash, corpus_snapshot: archive.manifest_hash, run_id,
      ...motif, verified_independent_recording_count: motif.recording_ids.filter((group) => trainSelected.filter((entry) => entry.video.record.recording_id === group).every((entry) => entry.video.record.independence_verified && !entry.video.record.synthetic)).length, independence_status: "supplied_metadata_requires_editorial_verification", evidence_scope: "training_only", supporting_intervals: supporting, counterexample_intervals: counterexamples, heldout_supporting_intervals: heldoutEvidence.supporting, heldout_counterexample_intervals: heldoutEvidence.counterexamples, heldout_opportunities: heldoutEvidence.opportunities, heldout_censored: heldoutEvidence.censored, hypothesis: { antecedent: motif.symbols[0]!, predicted_suffix: motif.symbols.slice(1), horizon_segments: motif.symbols.length - 1, opportunities, censored, scope: "descriptive; verify on held-out source groups" },
      controls: { shuffle: { replicates: nullReplicates, observed_train_occurrences: observed, null_occurrences: nullCounts, p_value_add_one: pValue, status, multiple_testing: "uncorrected; cannot establish significance" }, role_swap: { occurrences: transform("role"), interpretation: "role sensitivity only" }, citation_ablation: { occurrences: transform("citation"), interpretation: "citation dependence; ablated positions break adjacency" }, asr_noise: { occurrences: transform("noise"), token_deletion_probability: 0.1, interpretation: "text corruption before heuristic relabeling; not a realistic ASR error model" } },
      heldout_occurrences: split.test.reduce((sum, source) => sum + countMotif(source.blocks, motif.symbols), 0), estimated_stability: bootstrap(split.train, motif.symbols, bootstrapReplicates, seed, minVideos), uncertainty: ["Heuristic labels/roles require review", "Uncorrected exploratory multiple comparisons", "Source independence supplied, not independently verified"], confounders: ["topic", "guest", "moderator", "duration", "ASR and role-label error"], contrast_set: null, discrimination_status: "unestablished", alternative_explanations: ["ordinary dialogue structure", "annotation rules", "source selection"], reviewer_status: "pending", reviewed_by: null, decision_at: null, derived_substrate_ids: [], stale: false, synthetic: selected.some((entry) => entry.video.record.synthetic), pedagogy_eligible: false };
    return { ...candidate, publication_blockers: publicationBlockers(candidate) };
  });
  const sourceNodes: LineageNode[] = archive.loaded.flatMap((video) => video.tracks.map(({ track }) => ({ id: `source:${video.record.video_id}:${track.track_id}:${track.version}:${track.sha256}`, kind: "source", parents: [] })));
  const configNode: LineageNode = { id: `config:${config_hash}`, kind: "config", parents: [] }, codeNode: LineageNode = { id: `code:${code.code_sha256}`, kind: "code", parents: [] };
  const manifestNode: LineageNode = { id: `manifest:${archive.manifest_hash}:${archive.manifest_bytes_hash}`, kind: "manifest", parents: [] };
  const featureNode: LineageNode = { id: `features:${run_id}`, kind: "features", parents: [...sourceNodes.map((node) => node.id), manifestNode.id, configNode.id, codeNode.id] };
  const runNode: LineageNode = { id: run_id, kind: "run", parents: [featureNode.id] };
  const lineage = { schema_version: 1, nodes: [...sourceNodes, manifestNode, configNode, codeNode, featureNode, runNode, ...candidates.map((candidate) => ({ id: candidate.substrate_id, kind: "candidate", parents: [run_id] }))], stale: [], revalidation_queue: [] };
  assertLineageDag(lineage.nodes);
  const prefix = `evidence/${run_id}`;
  const artifacts: Record<string, string> = { [`manifests/${archive.manifest_hash}.ndjson`]: archive.canonicalManifest, [`${prefix}/features.jsonl`]: selected.flatMap((entry) => entry.features.map((feature) => canonicalJson({ source: evidence(entry.video, entry.track, feature), feature }))).join("\n") + (selected.length ? "\n" : ""), [`${prefix}/discovery_registry.jsonl`]: candidates.map(canonicalJson).join("\n") + (candidates.length ? "\n" : ""), [`${prefix}/evaluation.json`]: canonicalJson(evaluation) + "\n", [`${prefix}/transitions.json`]: canonicalJson(baseline.transitions) + "\n", [`${prefix}/lineage.json`]: canonicalJson(lineage) + "\n" };
  const run_manifest = { schema_version: 1, run_id, import_run_id: importReceipt.run_id, code, config, config_hash, data_manifest_hash: archive.manifest_hash, manifest_bytes_hash: archive.manifest_bytes_hash, coverage: coverageReport(archive.loaded.map((video) => video.record)), output_checksums: Object.fromEntries(Object.entries(artifacts).map(([name, bytes]) => [name, sha256(bytes)])), synthetic: selected.some((entry) => entry.video.record.synthetic), pedagogy_eligible: false };
  for (const [name, bytes] of Object.entries(artifacts)) writeImmutable(outputPath(archive.outputRoot, name), bytes);
  writeImmutable(outputPath(archive.outputRoot, `runs/${run_id}/run_manifest.json`), canonicalJson(run_manifest) + "\n");
  return { run_id, candidates, evaluation, lineage, run_manifest };
}
