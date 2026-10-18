import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";
import { canonicalJson, importArchive, sha256 } from "../research/pipeline";
import { loadPrivateImport, hostedConnectionOptions, normalizeMigrationSql, PrivatePersistenceError } from "../research/adapters/private-supabase";

const roots: string[] = [];
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });
function fixture() {
  const root = mkdtempSync(path.join(os.tmpdir(), "itachi-private-persistence-unit-")); roots.push(root);
  const source = path.join(root, "source"), output = path.join(root, "private");
  const relative = "videos/synthetic01/tracks/supplied/v1.jsonl";
  const bytes = canonicalJson({ segment_id: "instant", start_ms: 4, end_ms: 5, instantaneous: true, text: "SYNTHETIC PRIVATE SENTINEL", speaker: { speaker_id: "guest", role: "guest", confidence: 0.37 }, languages: ["en", "ar"], correction_of: "prior-segment" }) + "\n";
  const filename = path.join(source, relative); mkdirSync(path.dirname(filename), { recursive: true }); writeFileSync(filename, bytes);
  const record = { schema_version: 1, platform: "youtube", video_id: "synthetic01", recording_id: "one-recording", independence_verified: false, canonical_url: "https://www.youtube.com/watch?v=synthetic01", title: "SYNTHETIC FIXTURE ONLY", published_at: null, duration_ms: 10, discovered_at: "2026-01-01T00:00:00Z", content_type: "video", status: "transcribed", permission: { status: "synthetic_test", reference: "synthetic-test-authority" }, synthetic: true, tracks: [{ track_id: "supplied", version: "v1", relative_path: relative, sha256: sha256(bytes), source_format: "supplied_jsonl", languages: ["en", "ar"], analysis: true }] };
  const manifest = path.join(source, "manifest.ndjson"); writeFileSync(manifest, JSON.stringify(record) + "\n");
  const receipt = importArchive({ manifestPath: manifest, sourceRoot: source, outputRoot: output, codeCommit: "controlled-synthetic-test" });
  return { root, output, relative, receipt };
}

describe("private database persistence boundary", () => {
  it("blocks the separate hosted command without echoing arguments or database credentials", () => {
    const result = spawnSync(process.execPath, ["research/private-persist.mjs", "persist", "--output", "/PRIVATE_PATH_SENTINEL", "--run", "import-" + "0".repeat(24)], { cwd: process.cwd(), encoding: "utf8", env: { PATH: process.env.PATH, NODE_ENV: "test" } });
    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/Private persistence blocked: configuration/);
    expect(result.stderr).not.toContain("PRIVATE_PATH_SENTINEL");
    expect(result.stdout).toBe("");
  });
  it("requires a server-only direct TLS connection to exactly the intended project", () => {
    expect(() => hostedConnectionOptions({})).toThrow(/configuration/i);
    const env = { ITACHI_RESEARCH_DATABASE_URL: "postgresql://postgres:secret@db.frxufmwwbegconolevkw.supabase.co:5432/postgres", ITACHI_RESEARCH_PROJECT_REF: "frxufmwwbegconolevkw", ITACHI_RESEARCH_OPERATOR_ID: "11111111-1111-4111-8111-111111111111", ITACHI_RESEARCH_DB_ROLE: "postgres" };
    const options = hostedConnectionOptions(env);
    expect(options.ssl.rejectUnauthorized).toBe(true);
    expect(options.host).toBe("db.frxufmwwbegconolevkw.supabase.co");
    expect(() => hostedConnectionOptions({ ...env, ITACHI_RESEARCH_DATABASE_URL: env.ITACHI_RESEARCH_DATABASE_URL.replace("frxufmwwbegconolevkw", "anotherproject") })).toThrow(/configuration/i);
    expect(() => hostedConnectionOptions({ ...env, ITACHI_RESEARCH_DATABASE_URL: env.ITACHI_RESEARCH_DATABASE_URL + "?sslmode=disable" })).toThrow(/configuration/i);
    expect(() => hostedConnectionOptions({ ...env, ITACHI_RESEARCH_PROJECT_REF: "anotherproject" })).toThrow(/configuration/i);
    expect(() => hostedConnectionOptions({ ...env, ITACHI_RESEARCH_DB_ROLE: "authenticated" })).toThrow(/configuration/i);
    expect(() => hostedConnectionOptions({ ...env, NEXT_PUBLIC_ITACHI_RESEARCH_DATABASE_URL: env.ITACHI_RESEARCH_DATABASE_URL })).toThrow(/configuration/i);
  });

  it("revalidates existing immutable receipts and preserves exact annotation metadata", () => {
    const item = fixture();
    const imported = loadPrivateImport(item.output, item.receipt.run_id);
    expect(imported.receipt.run_id).toBe(item.receipt.run_id);
    expect(imported.records[0]!.tracks[0]!.languages).toEqual(["en", "ar"]);
    expect(imported.tracks[0]!.segments[0]).toMatchObject({ start_ms: 4, end_ms: 5, instantaneous: true, correction_of: "prior-segment", speaker: { confidence: 0.37, role: "guest" } });
    writeFileSync(path.join(item.output, item.relative), "SYNTHETIC PRIVATE SENTINEL tampered");
    expect(() => loadPrivateImport(item.output, item.receipt.run_id)).toThrow(PrivatePersistenceError);
    try { loadPrivateImport(item.output, item.receipt.run_id); } catch (error) { expect(String(error)).not.toContain("SENTINEL"); }
  });

  it("rejects forged import receipts, extra output paths and traversal identifiers", () => {
    const item = fixture();
    expect(() => loadPrivateImport(item.output, "../outside")).toThrow(PrivatePersistenceError);
    const receiptPath = path.join(item.output, "runs", item.receipt.run_id, "run_manifest.json");
    const receipt = JSON.parse(readFileSync(receiptPath, "utf8"));
    receipt.outputs["../../private-secret"] = "0".repeat(64);
    writeFileSync(receiptPath, canonicalJson(receipt) + "\n");
    expect(() => loadPrivateImport(item.output, item.receipt.run_id)).toThrow(PrivatePersistenceError);
  });

  it("compares migration token streams while preserving SQL literals and function bodies", () => {
    expect(normalizeMigrationSql("-- comment\nselect 'private text';\nselect 2;")).toBe(normalizeMigrationSql("select 'private text' ; select 2"));
    expect(normalizeMigrationSql("select 'private text'")).not.toBe(normalizeMigrationSql("select 'private  text'"));
    expect(normalizeMigrationSql("do $$ begin perform 1; end $$;")).not.toBe(normalizeMigrationSql("do $$ begin perform 2; end $$;"));
  });
});
