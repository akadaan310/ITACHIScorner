import { createHash } from "node:crypto";

/** A supplied exact-text index adapter, not a connection to or execution of the ISNAAD repository. */
export const INDEX_ADAPTER_VERSION = "isnaad-exact-index-v1";
export type ApprovedSourceIndex = { schema_version: 1; adapter_version: typeof INDEX_ADAPTER_VERSION; engine_version: string; edition: string; review_status: "approved_index"; review_reference: string; synthetic: boolean; entries: { locus: string; text: string }[] };
function check(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function validate(index: ApprovedSourceIndex) {
  check(index.schema_version === 1 && index.adapter_version === INDEX_ADAPTER_VERSION, "Unsupported source index adapter version");
  check(typeof index.engine_version === "string" && index.engine_version.length > 0 && typeof index.edition === "string" && index.edition.length > 0, "Source engine version and edition required");
  check(index.review_status === "approved_index" && typeof index.review_reference === "string" && index.review_reference.trim().length > 0, "Explicit source index review reference required");
  check(typeof index.synthetic === "boolean" && Array.isArray(index.entries), "Invalid source index");
  const seen = new Set<string>();
  for (const entry of index.entries) { check(typeof entry.locus === "string" && entry.locus.length > 0 && typeof entry.text === "string" && entry.text.trim().length > 0 && !seen.has(entry.locus), "Invalid or duplicate index locus"); seen.add(entry.locus); }
}
export function hashSourceIndex(index: ApprovedSourceIndex): string {
  validate(index);
  const payload = { schema_version: index.schema_version, adapter_version: index.adapter_version, engine_version: index.engine_version, edition: index.edition, review_status: index.review_status, review_reference: index.review_reference, synthetic: index.synthetic, entries: [...index.entries].sort((a, b) => a.locus.localeCompare(b.locus)).map((entry) => ({ locus: entry.locus, text: entry.text })) };
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}
function normalizedWithOffsets(text: string) {
  let normalized = ""; const offsets: { start: number; end: number }[] = [];
  for (const part of new Intl.Segmenter("und", { granularity: "grapheme" }).segment(text)) {
    const start = part.index, end = start + part.segment.length;
    if (/^\s+$/u.test(part.segment)) {
      if (!normalized.length) continue;
      if (normalized.endsWith(" ")) offsets[offsets.length - 1]!.end = end;
      else { normalized += " "; offsets.push({ start, end }); }
    } else {
      const value = part.segment.normalize("NFC"); normalized += value;
      for (let index = 0; index < value.length; index++) offsets.push({ start, end });
    }
  }
  if (normalized.endsWith(" ")) { normalized = normalized.slice(0, -1); offsets.pop(); }
  return { normalized, offsets };
}
export function matchExactSourceIndex(text: string, index: ApprovedSourceIndex, expected: { expected_engine_version: string; expected_index_sha256: string }) {
  validate(index); check(index.engine_version === expected.expected_engine_version, "Source index engine version mismatch");
  const index_sha256 = hashSourceIndex(index); check(index_sha256 === expected.expected_index_sha256, "Source index checksum mismatch");
  const source = normalizedWithOffsets(text), matches: { start: number; end: number; original: string; locus: string; edition: string; engine_version: string; index_sha256: string; synthetic: boolean; verification_status: "index_match_only"; adapter_version: string; normalization: string }[] = [];
  const word = /[\p{L}\p{N}\p{M}_]/u;
  for (const entry of index.entries) {
    const needle = normalizedWithOffsets(entry.text).normalized;
    for (let from = 0; from <= source.normalized.length - needle.length;) {
      const found = source.normalized.indexOf(needle, from); if (found < 0) break; from = found + Math.max(1, needle.length);
      if ((word.test(needle[0]!) && word.test(source.normalized[found - 1] ?? "")) || (word.test(needle[needle.length - 1]!) && word.test(source.normalized[found + needle.length] ?? ""))) continue;
      const start = source.offsets[found]!.start, end = source.offsets[found + needle.length - 1]!.end;
      matches.push({ start, end, original: text.slice(start, end), locus: entry.locus, edition: index.edition, engine_version: index.engine_version, index_sha256, synthetic: index.synthetic, verification_status: "index_match_only", adapter_version: INDEX_ADAPTER_VERSION, normalization: "NFC-and-whitespace-only-v1" });
    }
  }
  return matches.sort((a, b) => a.start - b.start || a.end - b.end || a.locus.localeCompare(b.locus));
}
