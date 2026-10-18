import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { coverageReport, parseManifest } from "../research/pipeline";

const read = (name: string) => readFileSync(new URL(`../research/${name}`, import.meta.url), "utf8");

describe("V4 actual metadata acquisition boundary", () => {
  it("keeps provisional indexed items separate from verified official membership", () => {
    const report = JSON.parse(read("v4-corpus-acquisition.json"));
    const inventory = JSON.parse(read("v4-corpus-candidates.json"));
    expect(inventory).toHaveLength(report.counters.indexed_metadata_candidates);
    expect(report.counters.official_items_verified).toBe(0);
    expect(report.inventory_denominator).toBeNull();
    expect(report.inventory_completeness).toBe("unknown");
    expect(inventory.every((item: { official_identity_status: string; uploader_channel_id: null }) =>
      item.official_identity_status === "provisional_display_name_match" && item.uploader_channel_id === null)).toBe(true);
  });

  it("validates actual IDs without treating metadata imports as transcripts or permission", () => {
    const records = parseManifest(read("v4-corpus-candidate-manifest.ndjson"));
    const coverage = coverageReport(records);
    expect(records).toHaveLength(9);
    expect(records.every((record) => record.status === "rights_pending" && record.permission.status === "pending" && record.tracks.length === 0 && !record.synthetic)).toBe(true);
    expect(coverage.verified_real_videos).toBe(0);
    expect(coverage.transcript_versions).toBe(0);
    expect(records.every((record) => record.published_at === null && record.duration_ms === null && !record.independence_verified)).toBe(true);
  });

  it("does not merge distinct repeated-title recordings or assert speaker roles", () => {
    const inventory = JSON.parse(read("v4-corpus-candidates.json"));
    const sameTitle = inventory.filter((item: { title: string }) => item.title === "WHY ARE YOU NOT MUSLIM?!");
    expect(sameTitle).toHaveLength(2);
    expect(new Set(sameTitle.map((item: { video_id: string }) => item.video_id)).size).toBe(2);
    expect(inventory.every((item: { parent_recording_id: null; speaker_roles: string }) => item.parent_recording_id === null && item.speaker_roles === "unknown_not_annotated")).toBe(true);
  });

  it("publishes metadata only, with no private raw pages, credentials, or transcript bodies", () => {
    const report = read("v4-corpus-acquisition.json");
    const inventory = JSON.parse(read("v4-corpus-candidates.json"));
    expect(report).not.toMatch(/Bearer |AIza|\/workspace\/itachi-private|signed_url|access_token/);
    for (const item of inventory) {
      expect(item).not.toHaveProperty("text");
      expect(item).not.toHaveProperty("transcript");
      expect(item).not.toHaveProperty("raw_html");
    }
  });
});
