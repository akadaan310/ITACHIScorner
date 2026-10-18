/** All data in this file is controlled synthetic test input. No real corpus is loaded. */
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { importArchive, canonicalJson, sha256 } from "../research/pipeline.ts";
import { persistPrivateImport, PrivatePersistenceError, INTENDED_PROJECT_REF } from "../research/adapters/private-supabase.ts";

const require = createRequire(new URL("../research/package.json", import.meta.url));
const pg = require("pg");
assert.match(process.env.ITACHI_TEST_PG_SOCKET ?? "", /^\/tmp\/itachi-private-pg-/);
const db = new pg.Client({ host: process.env.ITACHI_TEST_PG_SOCKET, user: "postgres", database: "postgres" });
const root = mkdtempSync(path.join(os.tmpdir(), "itachi-private-integration-"));
const admin = "11111111-1111-4111-8111-111111111111", creator = "22222222-2222-4222-8222-222222222222", member = "33333333-3333-4333-8333-333333333333";
const target = { mode: "isolated-test", projectRef: INTENDED_PROJECT_REF, operatorId: admin, databaseRole: "postgres" };
const sentinel = "CONTROLLED SYNTHETIC PRIVATE TEXT";
const annotation = { segment_id: "instant", start_ms: 7, end_ms: 8, instantaneous: true, text: sentinel, speaker: { speaker_id: "source-label", role: "guest", confidence: 0.37 }, languages: ["en", "ar"], correction_of: "prior-segment" };
let assertions = 0;
function ok(value, label) { assert.ok(value, label); assertions++; }
async function blocked(fn, code) {
  await assert.rejects(fn, (error) => { ok(error instanceof PrivatePersistenceError && error.code === code, `sanitized ${code} failure`); ok(!String(error).includes(sentinel), "no private body in error"); return true; });
}
async function count(table) { return Number((await db.query(`select count(*)::integer as n from ${table}`)).rows[0].n); }
function fixture(name, { version = "v1", text = sentinel, supersedes, recording = "supplied-recording", extra = false } = {}) {
  const input = path.join(root, name, "input"), output = path.join(root, name, "private");
  const relative = `videos/synthetic01/tracks/supplied/${version}.jsonl`;
  const segments = [{ ...annotation, text }, { segment_id: "overlap", start_ms: 3, end_ms: 9, text: "CONTROLLED SYNTHETIC OVERLAP", speaker: { speaker_id: "unknown-label", role: "unknown", confidence: 0 }, languages: ["ar"] }];
  const bytes = segments.map(canonicalJson).join("\n") + "\n";
  const file = path.join(input, relative); mkdirSync(path.dirname(file), { recursive: true }); writeFileSync(file, bytes);
  const record = { schema_version: 1, platform: "youtube", video_id: "synthetic01", recording_id: recording, independence_verified: false, canonical_url: "https://www.youtube.com/watch?v=synthetic01", title: `SYNTHETIC FIXTURE ${version}`, published_at: null, duration_ms: 10, discovered_at: "2026-01-01T00:00:00Z", content_type: "video", status: "transcribed", permission: { status: "synthetic_test", reference: "controlled-test-clearance" }, synthetic: true, tracks: [{ track_id: "supplied", version, relative_path: relative, sha256: sha256(bytes), source_format: "supplied_jsonl", languages: ["en", "ar"], analysis: true, ...(supersedes ? { supersedes_sha256: supersedes } : {}) }] };
  const missing = { ...record, video_id: "missing0001", recording_id: "unavailable-recording", canonical_url: "https://www.youtube.com/watch?v=missing0001", title: "SYNTHETIC RIGHTS GAP", status: "rights_pending", permission: { status: "pending", reference: "awaiting-test-rights" }, tracks: [] };
  const records = [record, missing];
  if (extra) records.push({ ...missing, video_id: "aaaRollback", canonical_url: "https://www.youtube.com/watch?v=aaaRollback" });
  const manifest = path.join(input, "manifest.ndjson"); writeFileSync(manifest, records.map(canonicalJson).join("\n") + "\n");
  const imported = importArchive({ manifestPath: manifest, sourceRoot: input, outputRoot: output, codeCommit: "controlled-synthetic-integration" });
  return { output, imported, record, persist: (overrides = {}) => persistPrivateImport(db, { outputRoot: output, importRunId: imported.run_id, target: { ...target, ...overrides } }) };
}

try {
  await db.connect();
  await db.query("set pgrst.db_schemas='public'");
  await db.query("create schema supabase_migrations; create table supabase_migrations.schema_migrations(version text primary key,name text,statements text[])");
  for (const name of ["20261018013721_evidence_first_foundation", "20261018014553_evidence_query_performance"]) await db.query("insert into supabase_migrations.schema_migrations values($1,$2,$3)", [name.slice(0, 14), name.slice(15), [readFileSync(new URL(`../supabase/migrations/${name}.sql`, import.meta.url), "utf8")]]);
  await db.query("insert into auth.users values($1),($2),($3)", [admin, creator, member]);
  await db.query("insert into public.creator_staff values($1,'admin'),($2,'creator')", [admin, creator]);
  const initial = fixture("initial");
  await db.query("insert into research.sources(id,platform,canonical_url) values('youtube:synthetic01','youtube','https://www.youtube.com/watch?v=synthetic01')");
  await db.query("insert into research.videos(id,source_id,title,source_url,is_synthetic) values('synthetic01','youtube:synthetic01','SYNTHETIC SAFE REGISTRATION','https://www.youtube.com/watch?v=synthetic01',true)");

  await blocked(() => initial.persist(), "permission");
  ok(await count("research.transcript_segments") === 0, "missing permission writes no transcript");
  await db.query("insert into research.source_permissions(video_id,scope,approved_by,authorization_reference) values('synthetic01','private-research',$1,'controlled-test-clearance')", [creator]);
  await db.query("update research.source_permissions set approved_by=$1 where video_id='synthetic01'", [member]);
  await blocked(() => initial.persist(), "permission");
  await db.query("update research.source_permissions set approved_by=$1 where video_id='synthetic01'", [creator]);
  await blocked(() => initial.persist({ operatorId: member }), "permission");
  await blocked(() => initial.persist({ projectRef: "anotherproject" }), "preflight");
  await blocked(() => initial.persist({ mode: "hosted" }), "synthetic");
  await db.query("update supabase_migrations.schema_migrations set statements=array['select 1'] where version='20261018014553'");
  await blocked(() => initial.persist(), "preflight");
  await db.query("update supabase_migrations.schema_migrations set statements=$1 where version='20261018014553'", [[readFileSync(new URL("../supabase/migrations/20261018014553_evidence_query_performance.sql", import.meta.url), "utf8")]]);
  await db.query("set pgrst.db_schemas='public,research'");
  await blocked(() => initial.persist(), "preflight");
  await db.query("set pgrst.db_schemas='public'");
  await db.query("alter table research.transcript_segments disable row level security");
  await blocked(() => initial.persist(), "preflight");
  await db.query("alter table research.transcript_segments enable row level security");
  await db.query("update storage.buckets set public=true where id='private-corpus'");
  await blocked(() => initial.persist(), "preflight");
  await db.query("update storage.buckets set public=false where id='private-corpus'");
  const first = await initial.persist();
  ok(first.reviewed === false && first.pedagogy_eligible === false && first.replayed === false, "import never grants review/publication");
  ok(await count("research.transcript_versions") === 1 && await count("research.transcript_segments") === 2, "actual PostgreSQL version and segment rows");
  const spans = (await db.query("select * from research.video_intervals order by start_ms")).rows;
  ok(spans[0].start_ms === "3" && spans[0].end_ms === "9" && spans[1].start_ms === "7" && spans[1].end_ms === "8" && spans[1].instantaneous, "overlap and 1ms precision preserved");
  ok(spans[1].speaker_role === "guest" && Number(spans[1].speaker_confidence) === 0.37 && spans.every((row) => row.evidence_confidence === null && row.evidence_confidence_status === "unassessed"), "roles and confidence remain separate");
  const snapshot = JSON.parse((await db.query("select corpus_snapshot from research.discovery_runs where id=$1", [first.run_id])).rows[0].corpus_snapshot);
  ok(snapshot.segment_annotations.some((row) => row.correction_of === "prior-segment" && row.languages.join() === "en,ar") && snapshot.import_receipt.manifest_bytes_hash === initial.imported.manifest_bytes_hash, "correction/languages/exact receipt retained privately");
  ok((await db.query("select status,reason from research.coverage_audits where video_id='missing0001'")).rows[0].status === "rights-blocked", "inventory rights gap preserved");
  const again = await initial.persist();
  ok(again.run_id === first.run_id && again.replayed && await count("research.transcript_versions") === 1 && await count("research.coverage_audits") === 2, "receipt reimport is idempotent");
  await db.query("insert into research.motif_candidates(id,run_id,label_internal,definition,hypothesis,uncertainty,confounders) values('old-synthetic-candidate',$1,'test','test','test','test','test')", [first.run_id]);
  const corrected = fixture("corrected", { version: "v2", text: sentinel + " CORRECTED", supersedes: initial.record.tracks[0].sha256, recording: "corrected-recording" });
  const second = await corrected.persist();
  ok(second.stale_candidates === 1 && await count("research.transcript_versions") === 2 && await count("research.transcript_segments") === 4, "corrections append versions and invalidate prior candidate");
  ok((await db.query("select stale from research.motif_candidates where id='old-synthetic-candidate'")).rows[0].stale, "prior candidate stale in database");
  await db.query("insert into research.motif_candidates(id,run_id,label_internal,definition,hypothesis,uncertainty,confounders) values('new-synthetic-candidate',$1,'test','test','test','test','test')", [second.run_id]);
  const oldReplay = await initial.persist();
  ok(oldReplay.replayed && oldReplay.stale_candidates === 0 && (await db.query("select recording_id from research.videos where id='synthetic01'")).rows[0].recording_id === "corrected-recording", "old receipt replay cannot roll current inventory/grouping back");
  ok(!(await db.query("select stale from research.motif_candidates where id='new-synthetic-candidate'")).rows[0].stale, "old replay cannot invalidate newer findings");
  const collision = fixture("collision", { text: sentinel + " CONFLICT", extra: true });
  const before = await count("research.discovery_runs");
  await blocked(() => collision.persist(), "collision");
  ok(await count("research.discovery_runs") === before && (await db.query("select id from research.videos where id='aaaRollback'")).rows.length === 0 && (await db.query("select recording_id from research.videos where id='synthetic01'")).rows[0].recording_id === "corrected-recording", "mid-transaction collision rolls all metadata writes back");
  const rejected = fixture("database-error", { version: "v3", supersedes: corrected.record.tracks[0].sha256 });
  await db.query("alter table research.transcript_segments add constraint controlled_test_rejection check(text not like 'CONTROLLED%') not valid");
  await blocked(() => rejected.persist(), "database");
  ok(await count("research.transcript_versions") === 2 && await count("research.discovery_runs") === before, "PostgreSQL errors roll the transaction back and hide source detail");
  await db.query("alter table research.transcript_segments drop constraint controlled_test_rejection");
  await db.query("update research.source_permissions set authorization_reference='revoked-test-reference' where video_id='synthetic01'");
  await blocked(() => initial.persist(), "permission");
  await db.query("delete from research.source_permissions where video_id='synthetic01'");
  await blocked(() => initial.persist(), "permission");
  ok(await count("research.review_decisions") === 0 && await count("research.creator_approvals") === 0 && await count("public.published_questions") === 0 && await count("public.approved_curriculum_units") === 0, "no reviews, creator approvals, or public content created");
  await db.query("set role anon");
  await assert.rejects(() => db.query("select text from research.transcript_segments")); assertions++;
  await db.query("reset role");
  await db.query("set role authenticated");
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [member]);
  ok(await count("research.transcript_segments") === 0 && await count("research.source_permissions") === 0, "ordinary member cannot read private corpus/rights");
  await db.query("reset role");
  process.stdout.write(`Private PostgreSQL persistence integration passed (${assertions} assertions, synthetic fixtures only).\n`);
} finally { try { await db.end(); } finally { rmSync(root, { recursive: true, force: true }); } }
