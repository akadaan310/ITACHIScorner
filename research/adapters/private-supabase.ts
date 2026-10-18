/** Operator-only PostgreSQL adapter. Never import this module from src/ or a route. */
import { readFileSync } from "node:fs";
import path from "node:path";
// @ts-expect-error Native Node TypeScript requires the extension; the app uses bundler resolution.
import { assertPrivateOutput, canonicalJson, coverageReport, parseManifest, parseSegments, PIPELINE_VERSION, sha256, sourceDeepLink, type ManifestRecord, type Segment, type Track } from "../pipeline.ts";

export const PRIVATE_ADAPTER_VERSION = "private-postgres-import-1.0.0";
export const INTENDED_PROJECT_REF = "frxufmwwbegconolevkw";
const EXPECTED_MIGRATIONS = [
  { version: "20261018013721", name: "evidence_first_foundation", hash: "38ad486802a8815243e54e8a4e2979061f8745a72ef010e4476aed9a350e50de" },
  { version: "20261018014553", name: "evidence_query_performance", hash: "8370a63ca06ad164a421e9305cabb970380e30ded5c83b8a5f29c8150dcb2041" },
] as const;
type ErrorCode = "configuration" | "archive" | "preflight" | "permission" | "synthetic" | "collision" | "database";
export class PrivatePersistenceError extends Error {
  readonly code: ErrorCode;
  constructor(code: ErrorCode) { super(`Private persistence blocked: ${code}. No database detail or private source text is logged.`); this.name = "PrivatePersistenceError"; this.code = code; }
}
function check(value: unknown, code: ErrorCode): asserts value { if (!value) throw new PrivatePersistenceError(code); }
const hashPattern = /^[a-f0-9]{64}$/;
const uuidPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
type Receipt = { schema_version: number; run_id: string; command: string; code: { version: string; code_commit: string; code_sha256: string }; manifest_hash: string; manifest_bytes_hash: string; outputs: Record<string, string> };
export type PrivateImport = { receipt: Receipt; receipt_sha256: string; records: ManifestRecord[]; tracks: { record: ManifestRecord; track: Track; segments: Segment[] }[]; coverage: ReturnType<typeof coverageReport> };

/** Rejects paths/bytes not represented by a complete, deterministic pipeline import receipt. */
export function loadPrivateImport(outputRoot: string, runId: string): PrivateImport {
  try {
    check(/^import-[a-f0-9]{24}$/.test(runId), "archive");
    const root = assertPrivateOutput(outputRoot);
    const read = (relative: string) => readFileSync(assertPrivateOutput(path.join(root, relative)));
    const receiptBytes = read(`runs/${runId}/run_manifest.json`);
    const receipt = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(receiptBytes)) as Receipt;
    check(receipt.schema_version === 1 && receipt.command === "import" && receipt.run_id === runId, "archive");
    check(hashPattern.test(receipt.manifest_hash) && hashPattern.test(receipt.manifest_bytes_hash), "archive");
    check(receipt.code.version === PIPELINE_VERSION && typeof receipt.code.code_commit === "string" && receipt.code.code_commit.trim() && hashPattern.test(receipt.code.code_sha256), "archive");
    const config = { command: "import", code: { version: receipt.code.version, code_commit: receipt.code.code_commit, code_sha256: receipt.code.code_sha256 }, manifest_hash: receipt.manifest_hash, manifest_bytes_hash: receipt.manifest_bytes_hash };
    check(runId === `import-${sha256(canonicalJson(config)).slice(0, 24)}`, "archive");
    const manifestName = `manifests/${receipt.manifest_hash}.ndjson`, rawName = `manifests/raw-${receipt.manifest_bytes_hash}.ndjson`;
    const raw = read(rawName), canonicalBytes = read(manifestName);
    check(sha256(raw) === receipt.manifest_bytes_hash && sha256(canonicalBytes) === receipt.manifest_hash, "archive");
    const records = parseManifest(new TextDecoder("utf-8", { fatal: true }).decode(raw));
    const canonical = records.map(canonicalJson).join("\n") + (records.length ? "\n" : "");
    check(canonicalBytes.equals(Buffer.from(canonical)), "archive");
    const coverage = coverageReport(records), coverageBytes = canonicalJson(coverage) + "\n";
    check(read(`coverage/${runId}.json`).equals(Buffer.from(coverageBytes)), "archive");
    const outputs = { [manifestName]: receipt.manifest_hash, [rawName]: receipt.manifest_bytes_hash, [`coverage/${runId}.json`]: sha256(coverageBytes), ...Object.fromEntries(records.flatMap((record) => record.tracks.map((track) => [track.relative_path, track.sha256]))) };
    check(canonicalJson(receipt) === canonicalJson({ schema_version: 1, run_id: runId, ...config, outputs }) && receiptBytes.equals(Buffer.from(canonicalJson(receipt) + "\n")), "archive");
    const tracks = records.flatMap((record) => record.tracks.map((track) => {
      const bytes = read(track.relative_path); check(sha256(bytes) === track.sha256, "archive");
      return { record, track, segments: parseSegments(new TextDecoder("utf-8", { fatal: true }).decode(bytes), record) };
    }));
    return { receipt, receipt_sha256: sha256(receiptBytes), records, tracks, coverage };
  } catch (error) { if (error instanceof PrivatePersistenceError) throw error; throw new PrivatePersistenceError("archive"); }
}

/** Only this configuration is accepted by the hosted CLI. No public keys or REST client. */
export function hostedConnectionOptions(env: Record<string, string | undefined>) {
  try {
    check(!Object.keys(env).some((key) => /^(NEXT_PUBLIC_|VITE_|PUBLIC_).*ITACHI_RESEARCH/.test(key)), "configuration");
    check(env.ITACHI_RESEARCH_PROJECT_REF === INTENDED_PROJECT_REF && uuidPattern.test(env.ITACHI_RESEARCH_OPERATOR_ID ?? ""), "configuration");
    const role = env.ITACHI_RESEARCH_DB_ROLE;
    check(role && /^[a-z_][a-z0-9_]{0,62}$/.test(role) && !["anon", "authenticated", "service_role", "authenticator"].includes(role), "configuration");
    check(env.ITACHI_RESEARCH_DATABASE_URL, "configuration");
    const url = new URL(env.ITACHI_RESEARCH_DATABASE_URL);
    check(["postgres:", "postgresql:"].includes(url.protocol) && url.hostname === `db.${INTENDED_PROJECT_REF}.supabase.co` && (!url.port || url.port === "5432") && url.pathname === "/postgres" && !url.search && !url.hash, "configuration");
    check(decodeURIComponent(url.username) === role && url.password.length > 0, "configuration");
    const ca = env.ITACHI_RESEARCH_CA_FILE ? readFileSync(env.ITACHI_RESEARCH_CA_FILE, "utf8") : undefined;
    return { host: url.hostname, port: 5432, database: "postgres", user: role, password: decodeURIComponent(url.password), ssl: { rejectUnauthorized: true as const, ...(ca ? { ca } : {}) }, connectionTimeoutMillis: 10000, application_name: "itachi-private-corpus-import" };
  } catch { throw new PrivatePersistenceError("configuration"); }
}

/** Compare statement arrays without weakening string literals or dollar-quoted function bodies. */
export function normalizeMigrationSql(sql: string): string {
  const tokens: string[] = []; let index = 0;
  while (index < sql.length) {
    const tail = sql.slice(index), char = sql[index]!;
    if (/\s/.test(char) || char === ";") { index++; continue; }
    if (tail.startsWith("--")) { const end = sql.indexOf("\n", index); index = end < 0 ? sql.length : end + 1; continue; }
    if (tail.startsWith("/*")) { const end = sql.indexOf("*/", index + 2); check(end >= 0, "preflight"); index = end + 2; continue; }
    const dollar = /^(\$(?:[A-Za-z_][A-Za-z0-9_]*)?\$)/.exec(tail)?.[0];
    if (dollar) { const end = sql.indexOf(dollar, index + dollar.length); check(end >= 0, "preflight"); tokens.push(sql.slice(index, end + dollar.length)); index = end + dollar.length; continue; }
    if (char === "'" || char === '"') {
      const start = index++; let closed = false;
      while (index < sql.length) { if (sql[index++] === char) { if (sql[index] === char) index++; else { closed = true; break; } } }
      check(closed, "preflight"); tokens.push(sql.slice(start, index)); continue;
    }
    const word = /^[A-Za-z_0-9]+/.exec(tail)?.[0];
    if (word) { tokens.push(word); index += word.length; } else { tokens.push(char); index++; }
  }
  return JSON.stringify(tokens);
}

/** pg Client's small structural interface keeps the adapter independent of application clients. */
export type PrivateDatabase = { connectionParameters: { host: string; port: number; user: string; database: string; ssl: unknown }; query(sql: string, values?: unknown[]): Promise<{ rows: Record<string, unknown>[]; rowCount: number | null }> };
export type PersistenceTarget = { mode: "hosted" | "isolated-test"; projectRef: string; operatorId: string; databaseRole: string };
const writtenTables = ["sources", "recordings", "videos", "source_checksums", "video_caption_tracks", "transcript_versions", "transcript_segments", "video_intervals", "coverage_audits", "discovery_runs", "discovery_run_sources", "graph_versions", "graph_nodes", "graph_edges"] as const;

/** Current catalog definitions must match the reviewed policies; migration history is not DDL attestation. */
async function verifyCurrentSecurity(db: PrivateDatabase, migrationSql: string[]) {
  const tables = migrationSql.flatMap((sql) => [...sql.matchAll(/create table research\.([a-z_]+)\s*\(/g)].map((match) => match[1]!)).sort();
  const actualTables = (await db.query("select tablename from pg_tables where schemaname='research' order by tablename")).rows.map((row) => row.tablename);
  check(tables.length > 0 && canonicalJson(actualTables) === canonicalJson(tables), "preflight");
  type Policy = { tablename: string; policyname: string; permissive: string; roles: string[]; cmd: string; qual: string | null; with_check: string | null };
  const expected: Policy[] = [];
  const role = (roles: string[]) => `( SELECT research.has_role(ARRAY[${roles.map((name) => `'${name}'::text`).join(", ")}]) AS has_role)`;
  const owner = (column: string, roles: string[]) => `((${column} = ( SELECT auth.uid() AS uid)) AND ${role(roles)})`;
  const add = (table: string, name: string, command: string, using: string | null, withCheck: string | null) => expected.push({ tablename: table, policyname: name, permissive: "PERMISSIVE", roles: ["authenticated"], cmd: command, qual: using, with_check: withCheck });
  const writes = (table: string, prefix: string, predicate: string) => {
    add(table, `${prefix}_insert`, "INSERT", null, predicate); add(table, `${prefix}_update`, "UPDATE", predicate, predicate); add(table, `${prefix}_delete`, "DELETE", predicate, null);
  };
  const separatelyAuthorized = ["review_decisions", "editorial_reviews", "creator_approvals", "unit_creator_approvals", "source_permissions", "question_publication_reviews", "question_creator_approvals"];
  for (const table of tables) {
    add(table, "staff_read", "SELECT", role(["reviewer", "creator", "admin"]), null);
    if (table === "creator_settings") writes(table, "settings", `(${role(["admin"])} OR ${owner("creator_id", ["creator"])})`);
    else if (!separatelyAuthorized.includes(table)) writes(table, "operator", role(["admin"]));
  }
  const reviewer = owner("reviewer_id", ["reviewer", "admin"]), creator = owner("creator_id", ["creator", "admin"]), rights = owner("approved_by", ["creator", "admin"]);
  add("review_decisions", "reviewer_decision", "INSERT", null, reviewer); add("review_decisions", "reviewer_decision_update", "UPDATE", reviewer, reviewer);
  for (const [table, name] of [["editorial_reviews", "unit_review"], ["question_publication_reviews", "question_review"]]) {
    add(table!, name!, "INSERT", null, reviewer); add(table!, "reviewer_renew", "UPDATE", reviewer, reviewer);
  }
  for (const [table, name] of [["creator_approvals", "creator_approval"], ["unit_creator_approvals", "creator_unit_approval"], ["question_creator_approvals", "question_creator"]]) {
    add(table!, name!, "INSERT", null, creator); add(table!, "creator_renew", "UPDATE", creator, creator); add(table!, "creator_revoke", "DELETE", creator, null);
  }
  add("source_permissions", "creator_rights", "INSERT", null, rights); add("source_permissions", "creator_rights_delete", "DELETE", rights, null);
  const actual = (await db.query("select tablename,policyname,permissive,roles::text[] as roles,cmd,qual,with_check from pg_policies where schemaname='research'")).rows;
  const normalized = (policies: Record<string, unknown>[]) => policies.map((policy) => ({
    tablename: policy.tablename, policyname: policy.policyname, permissive: policy.permissive, roles: policy.roles, cmd: policy.cmd,
    qual: policy.qual === null ? null : normalizeMigrationSql(String(policy.qual)),
    with_check: policy.with_check === null ? null : normalizeMigrationSql(String(policy.with_check)),
  })).sort((a, b) => String(a.tablename).localeCompare(String(b.tablename)) || String(a.policyname).localeCompare(String(b.policyname)));
  check(canonicalJson(normalized(actual)) === canonicalJson(normalized(expected)), "preflight");

  const trustedBody = /create function research\.has_role\(roles text\[\]\) returns boolean\s+language sql stable security definer set search_path = '' as \$\$([\s\S]*?)\$\$;/.exec(migrationSql[0]!)?.[1];
  const helpers = (await db.query(`select p.prosrc,p.proconfig,p.provolatile,p.prosecdef,p.proretset,l.lanname,
    p.prorettype::regtype::text as return_type,oidvectortypes(p.proargtypes) as argument_types,
    not has_function_privilege('anon',p.oid,'EXECUTE') as anonymous_denied,
    has_function_privilege('authenticated',p.oid,'EXECUTE') as authenticated_permitted
    from pg_proc p join pg_namespace n on n.oid=p.pronamespace join pg_language l on l.oid=p.prolang
    where n.nspname='research' and p.proname='has_role'`)).rows;
  const helper = helpers[0];
  check(trustedBody && helpers.length === 1 && helper && typeof helper.prosrc === "string" && normalizeMigrationSql(helper.prosrc) === normalizeMigrationSql(trustedBody) && helper.provolatile === "s" && helper.prosecdef === true && helper.proretset === false && helper.lanname === "sql" && helper.return_type === "boolean" && helper.argument_types === "text[]" && canonicalJson(helper.proconfig) === canonicalJson(['search_path=""']) && helper.anonymous_denied === true && helper.authenticated_permitted === true, "preflight");

  // Exercise the transitive Auth identity boundary as an ordinary member, without inserting a user or fixture.
  const probeId = (await db.query("select gen_random_uuid()::text as id")).rows[0]?.id;
  check(typeof probeId === "string" && (await db.query("select user_id from public.creator_staff where user_id=$1::uuid", [probeId])).rows.length === 0, "preflight");
  await db.query("savepoint private_member_probe");
  await db.query("set local role authenticated");
  await db.query("select set_config('request.jwt.claim.sub',$1,true),set_config('request.jwt.claims',$2,true)", [probeId, canonicalJson({ sub: probeId, role: "authenticated" })]);
  const probe = (await db.query(`select auth.uid()::text as user_id,research.has_role(array['reviewer','creator','admin']) as staff,
    exists(select 1 from research.transcript_segments) as corpus_visible,
    exists(select 1 from research.source_permissions) as rights_visible,
    exists(select 1 from research.moderation_actions) as moderation_visible`)).rows[0];
  check(probe && probe.user_id === probeId && probe.staff === false && probe.corpus_visible === false && probe.rights_visible === false && probe.moderation_visible === false, "preflight");
  await db.query("rollback to savepoint private_member_probe");
  await db.query("release savepoint private_member_probe");
}

async function preflight(db: PrivateDatabase, imported: PrivateImport, target: PersistenceTarget) {
  check(["hosted", "isolated-test"].includes(target.mode) && uuidPattern.test(target.operatorId) && target.projectRef === INTENDED_PROJECT_REF, "preflight");
  if (target.mode === "hosted") check(!imported.records.some((record) => record.synthetic || record.permission.status === "synthetic_test"), "synthetic");
  const connection = db.connectionParameters;
  check(connection && connection.user === target.databaseRole && connection.database === "postgres", "preflight");
  if (target.mode === "hosted") {
    const ssl = connection.ssl as { rejectUnauthorized?: unknown } | null;
    check(connection.host === `db.${INTENDED_PROJECT_REF}.supabase.co` && connection.port === 5432 && ssl?.rejectUnauthorized === true, "preflight");
  } else check(connection.host.startsWith("/") && !connection.ssl, "preflight");
  const identity = (await db.query("select current_user as role, session_user as session_role, current_database() as database, (select ssl from pg_stat_ssl where pid=pg_backend_pid()) as ssl")).rows[0];
  check(identity && identity.role === target.databaseRole && identity.session_role === target.databaseRole && identity.database === "postgres", "preflight");
  if (target.mode === "hosted") check(identity.ssl === true, "preflight");
  const operator = await db.query("select u.id from auth.users u join public.creator_staff s on s.user_id=u.id where u.id=$1::uuid and s.role='admin' for share of u,s", [target.operatorId]);
  check(operator.rows.length === 1, "permission");
  const history = await db.query("select version,name,statements from supabase_migrations.schema_migrations order by version");
  check(history.rows.length === EXPECTED_MIGRATIONS.length, "preflight");
  const migrationSql: string[] = [];
  for (const [index, migration] of EXPECTED_MIGRATIONS.entries()) {
    const file = readFileSync(new URL(`../../supabase/migrations/${migration.version}_${migration.name}.sql`, import.meta.url), "utf8");
    check(sha256(file) === migration.hash, "preflight");
    const applied = history.rows[index];
    check(applied && applied.version === migration.version && applied.name === migration.name && Array.isArray(applied.statements) && applied.statements.every((value) => typeof value === "string"), "preflight");
    check(normalizeMigrationSql((applied.statements as string[]).join(";\n")) === normalizeMigrationSql(file), "preflight");
    migrationSql.push(file);
  }
  await verifyCurrentSecurity(db, migrationSql);
  const security = (await db.query(`select
    not has_schema_privilege('anon','research','usage') as anonymous_denied,
    not exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='research' and c.relkind='r' and not c.relrowsecurity) as rls_enabled,
    not exists(select 1 from pg_policies where schemaname='research' and ('anon'=any(roles) or 'public'=any(roles))) as policies_private,
    exists(select 1 from storage.buckets where id='private-corpus' and public=false) as bucket_private,
    coalesce(nullif(current_setting('pgrst.db_schemas',true),''),
      (select split_part(config,'=',2) from pg_db_role_setting s cross join lateral unnest(s.setconfig) as config
       where config like 'pgrst.db_schemas=%' and s.setrole=(select oid from pg_roles where rolname='authenticator') and s.setdatabase in (0,(select oid from pg_database where datname=current_database()))
       order by s.setdatabase desc limit 1)) as exposed_schemas`)).rows[0];
  check(security && ["anonymous_denied", "rls_enabled", "policies_private", "bucket_private"].every((key) => security[key] === true), "preflight");
  check(typeof security.exposed_schemas === "string" && security.exposed_schemas.trim() && !security.exposed_schemas.split(",").some((value) => value.trim().replaceAll('"', "") === "research"), "preflight");
  for (const table of writtenTables) {
    const privileges = (await db.query("select has_table_privilege(current_user,$1,'SELECT') and has_table_privilege(current_user,$1,'INSERT') and has_table_privilege(current_user,$1,'UPDATE') as permitted", [`research.${table}`])).rows[0];
    check(privileges?.permitted === true, "permission");
  }
  // Rights are authenticated database records, not manifest assertions. Locks prevent concurrent revocation during this transaction.
  for (const record of imported.records.filter((row) => row.tracks.length)) {
    check(["creator_authorized", "licensed", ...(target.mode === "isolated-test" ? ["synthetic_test"] : [])].includes(record.permission.status), "permission");
    const rights = await db.query(`select p.video_id from research.source_permissions p join auth.users u on u.id=p.approved_by
      join public.creator_staff s on s.user_id=p.approved_by and s.role in ('creator','admin')
      where p.video_id=$1 and p.scope='private-research' and p.authorization_reference=$2 for share of p,u,s`, [record.video_id, record.permission.reference]);
    check(rights.rows.length >= 1, "permission");
  }
}

/** Inserts once, or verifies every supplied immutable column. Never updates a source version. */
async function immutable(db: PrivateDatabase, table: typeof writtenTables[number], row: Record<string, unknown>, keys: string[], verifyOnly = false) {
  const columns = Object.keys(row), values = Object.values(row);
  if (!verifyOnly) await db.query(`insert into research.${table} (${columns.join(",")}) values (${columns.map((_, index) => `$${index + 1}`).join(",")}) on conflict do nothing`, values);
  const where = keys.map((key) => `${key}=$${columns.indexOf(key) + 1}`).join(" and ");
  const matches = columns.map((key, index) => `${key} is not distinct from $${index + 1}`).join(" and ");
  const found = await db.query(`select (${matches}) as matches from research.${table} where ${where}`, values);
  check(found.rows.length === 1 && found.rows[0]?.matches === true, "collision");
}

const coverageStatus: Record<ManifestRecord["status"], string> = { transcribed: "covered", caption_unavailable: "unavailable", rights_pending: "rights-blocked", private: "unavailable", deleted: "unavailable", retryable_error: "partial", not_transcribed: "missing" };
const availability: Record<ManifestRecord["status"], string> = { transcribed: "available", caption_unavailable: "unavailable", rights_pending: "unknown", private: "private", deleted: "deleted", retryable_error: "unknown", not_transcribed: "unknown" };
function segmentKey(record: ManifestRecord, track: Track, segment: Segment) { return `interval-${sha256(canonicalJson([record.video_id, track.track_id, track.version, segment.segment_id]))}`; }

/** One database transaction; input must come from loadPrivateImport, never a browser request. */
export async function persistPrivateImport(db: PrivateDatabase, options: { outputRoot: string; importRunId: string; target: PersistenceTarget }) {
  let began = false;
  try {
    const imported = loadPrivateImport(options.outputRoot, options.importRunId), target = options.target;
    await db.query("begin isolation level serializable"); began = true;
    await db.query("set local statement_timeout='30s'");
    await db.query("set local lock_timeout='10s'");
    await preflight(db, imported, target);
    const identity = { local_import_run_id: imported.receipt.run_id, receipt_sha256: imported.receipt_sha256 };
    const verificationAdapterSha256 = sha256(readFileSync(new URL(import.meta.url)));
    let config = { adapter_version: PRIVATE_ADAPTER_VERSION, adapter_sha256: verificationAdapterSha256, ...identity };
    // Receipt identity survives adapter upgrades; a code revision cannot make an old receipt current again.
    const runId = `private-import-${sha256(canonicalJson(identity)).slice(0, 32)}`;
    // The source corpus is shared: serialize adapter imports so correction/stale updates cannot race.
    await db.query("select pg_advisory_xact_lock(hashtextextended('itachi-private-corpus-import',0))");
    const previous = (await db.query("select corpus_snapshot from research.discovery_runs where id=$1", [runId])).rows[0];
    const replayed = previous !== undefined;
    if (previous) {
      check(typeof previous.corpus_snapshot === "string", "collision");
      const prior = JSON.parse(previous.corpus_snapshot) as Record<string, unknown>;
      check(prior.local_import_run_id === identity.local_import_run_id && prior.receipt_sha256 === identity.receipt_sha256 && typeof prior.adapter_version === "string" && /^private-postgres-import-[0-9.]+$/.test(prior.adapter_version) && typeof prior.adapter_sha256 === "string" && hashPattern.test(prior.adapter_sha256), "collision");
      config = { adapter_version: prior.adapter_version, adapter_sha256: prior.adapter_sha256, ...identity };
    }
    const put = (table: typeof writtenTables[number], row: Record<string, unknown>, keys: string[]) => immutable(db, table, row, keys, replayed);
    const previouslyValidCandidates = replayed ? [] : (await db.query("select id from research.motif_candidates where stale=false")).rows.map((row) => row.id);
    const snapshot = { schema_version: 1, ...config, import_receipt: imported.receipt, records: imported.records, coverage: imported.coverage, segment_annotations: imported.tracks.flatMap(({ record, track, segments }) => segments.map((segment) => ({ video_id: record.video_id, track_id: track.track_id, transcript_version: track.version, segment_id: segment.segment_id, languages: segment.languages, speaker_confidence: segment.speaker.confidence, instantaneous: segment.instantaneous ?? false, correction_of: segment.correction_of ?? null }))), reviewed: false, pedagogy_eligible: false };
    for (const record of imported.records) {
      await put("sources", { id: `youtube:${record.video_id}`, platform: record.platform, canonical_url: record.canonical_url }, ["id"]);
      await put("recordings", { id: record.recording_id, independence_reference: "Supplied recording grouping; verification assertion is versioned in the private corpus snapshot." }, ["id"]);
      // Inventory can evolve; prior metadata remains immutable in each discovery_runs snapshot.
      if (!replayed) await db.query(`insert into research.videos(id,source_id,title,source_url,published_at,duration_ms,is_synthetic,recording_id,independence_verified,discovered_at,content_type,status,availability)
        values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        on conflict(id) do update set title=excluded.title,published_at=excluded.published_at,duration_ms=excluded.duration_ms,
          recording_id=excluded.recording_id,independence_verified=excluded.independence_verified,discovered_at=excluded.discovered_at,
          content_type=excluded.content_type,status=excluded.status,availability=excluded.availability
        where research.videos.source_id=excluded.source_id and research.videos.source_url=excluded.source_url and research.videos.is_synthetic=excluded.is_synthetic`,
      [record.video_id, `youtube:${record.video_id}`, record.title, record.canonical_url, record.published_at, record.duration_ms, record.synthetic ?? false, record.recording_id, record.independence_verified, record.discovered_at, record.content_type, record.status === "transcribed" ? "archived" : record.status === "rights_pending" ? "blocked" : "inventoried", availability[record.status]]).then((result) => check(result.rowCount === 1, "collision"));
      await put("coverage_audits", { id: `${runId}:${record.video_id}`, video_id: record.video_id, status: coverageStatus[record.status], reason: canonicalJson({ source_status: record.status, permission: record.permission, inventory_completeness: "unknown", import_run_id: imported.receipt.run_id }), manifest_sha256: imported.receipt.manifest_hash }, ["id"]);
    }
    for (const { record, track, segments } of imported.tracks) {
      await put("source_checksums", { video_id: record.video_id, source_sha256: track.sha256 }, ["video_id", "source_sha256"]);
      await put("video_caption_tracks", { video_id: record.video_id, track_id: track.track_id, language: track.languages[0] ?? "und", track_type: "authorized-export" }, ["video_id", "track_id"]);
      if (track.supersedes_sha256) {
        const previous = await db.query("select transcript_version from research.transcript_versions where video_id=$1 and track_id=$2 and source_sha256=$3", [record.video_id, track.track_id, track.supersedes_sha256]);
        check(previous.rows.length > 0 && previous.rows.every((row) => row.transcript_version !== track.version), "collision");
      }
      await put("transcript_versions", { video_id: record.video_id, track_id: track.track_id, transcript_version: track.version, source_sha256: track.sha256 }, ["video_id", "track_id", "transcript_version"]);
      for (const segment of segments) {
        await put("transcript_segments", { video_id: record.video_id, track_id: track.track_id, transcript_version: track.version, segment_id: segment.segment_id, start_ms: segment.start_ms, end_ms: segment.end_ms, text: segment.text, speaker_id: segment.speaker.speaker_id, speaker_role: segment.speaker.role }, ["video_id", "track_id", "transcript_version", "segment_id"]);
        await put("video_intervals", { id: segmentKey(record, track, segment), video_id: record.video_id, track_id: track.track_id, transcript_version: track.version, segment_id: segment.segment_id, start_ms: segment.start_ms, end_ms: segment.end_ms, source_sha256: track.sha256, speaker_id: segment.speaker.speaker_id, speaker_role: segment.speaker.role, speaker_confidence: segment.speaker.confidence, evidence_confidence: null, evidence_confidence_status: "unassessed", source_url: sourceDeepLink(record, segment.start_ms), instantaneous: segment.instantaneous ?? false }, ["id"]);
      }
    }
    await put("discovery_runs", { id: runId, code_commit: imported.receipt.code.code_commit, config_hash: sha256(canonicalJson(config)), data_manifest_hash: imported.receipt.manifest_hash, corpus_snapshot: canonicalJson(snapshot), algorithm: config.adapter_version, is_synthetic: imported.records.some((record) => record.synthetic) }, ["id"]);
    for (const { record, track } of imported.tracks) await put("discovery_run_sources", { run_id: runId, video_id: record.video_id, track_id: track.track_id, transcript_version: track.version, source_sha256: track.sha256, source_role: "corpus" }, ["run_id", "video_id", "track_id", "transcript_version", "source_role"]);
    const graphId = `${runId}:provenance`;
    await put("graph_versions", { id: graphId, run_id: runId, graph_kind: "provenance", schema_version: "private-import-provenance-1", checksum: sha256(canonicalJson(snapshot)) }, ["id"]);
    await put("graph_nodes", { graph_version_id: graphId, id: imported.receipt.run_id, node_type: "local-import-receipt" }, ["graph_version_id", "id"]);
    for (const { record, track, segments } of imported.tracks) {
      const trackId = sha256(canonicalJson([record.video_id, track.track_id, track.version, track.sha256]));
      await put("graph_nodes", { graph_version_id: graphId, id: trackId, node_type: "immutable-transcript-version" }, ["graph_version_id", "id"]);
      await put("graph_edges", { graph_version_id: graphId, id: `imports:${trackId}`, from_node_id: imported.receipt.run_id, to_node_id: trackId, relation: track.analysis ? "imports-selected-analysis-track" : "imports-alternate-track", epistemic_status: "curated" }, ["graph_version_id", "id"]);
      for (const segment of segments) {
        const intervalId = segmentKey(record, track, segment);
        await put("graph_nodes", { graph_version_id: graphId, id: intervalId, node_type: "original-source-segment", interval_id: intervalId }, ["graph_version_id", "id"]);
        await put("graph_edges", { graph_version_id: graphId, id: `contains:${intervalId}`, from_node_id: trackId, to_node_id: intervalId, relation: "contains-original-segment", interval_id: intervalId, epistemic_status: "observed" }, ["graph_version_id", "id"]);
      }
    }
    // Any manifest change conservatively invalidates earlier analyses, including annotation/grouping/selection changes.
    if (!replayed) await db.query(`update research.motif_candidates c set stale=true from research.discovery_runs r
      where c.run_id=r.id and r.data_manifest_hash<>$1 and c.stale=false returning c.id`, [imported.receipt.manifest_hash]);
    // Existing correction triggers may already have invalidated dependent candidates earlier in this transaction.
    const invalidated = previouslyValidCandidates.length ? await db.query("select id from research.motif_candidates where id=any($1::text[]) and stale=true", [previouslyValidCandidates]) : { rowCount: 0 };
    await db.query("commit"); began = false;
    return { adapter_version: config.adapter_version, adapter_sha256: config.adapter_sha256, verification_adapter_sha256: verificationAdapterSha256, run_id: runId, import_run_id: imported.receipt.run_id, manifest_sha256: imported.receipt.manifest_hash, receipt_sha256: imported.receipt_sha256, replayed, videos: imported.records.length, transcript_versions: imported.tracks.length, stale_candidates: invalidated.rowCount ?? 0, reviewed: false, pedagogy_eligible: false };
  } catch (error) {
    if (began) { try { await db.query("rollback"); } catch { /* Only the sanitized error crosses this boundary. */ } }
    if (error instanceof PrivatePersistenceError) throw error;
    throw new PrivatePersistenceError("database");
  }
}
