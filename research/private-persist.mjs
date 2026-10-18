#!/usr/bin/env node
// Deliberately separate from the network-free import/analysis CLI and application bundle.
import { parseArgs } from "node:util";
import { hostedConnectionOptions, persistPrivateImport, PrivatePersistenceError, INTENDED_PROJECT_REF } from "./adapters/private-supabase.ts";

const help = `Private corpus database phase (Node >=22.18).
  node research/private-persist.mjs persist --output <private-archive-root> --run <import-run-id>
Requires server-only ITACHI_RESEARCH_DATABASE_URL, ITACHI_RESEARCH_PROJECT_REF,
ITACHI_RESEARCH_OPERATOR_ID and ITACHI_RESEARCH_DB_ROLE. Optional ITACHI_RESEARCH_CA_FILE.
Accepts only the intended project's direct TLS PostgreSQL endpoint. No public REST,
storage upload, schema change, harvesting, inference, deployment or publication occurs.
Creator-approved private-research permission rows must already exist for acquired videos.
`;
let client;
try {
  let parsed;
  try { parsed = parseArgs({ allowPositionals: true, strict: true, options: { output: { type: "string" }, run: { type: "string" }, help: { type: "boolean", short: "h" } } }); }
  catch { throw new PrivatePersistenceError("configuration"); }
  if (parsed.values.help) { process.stdout.write(help); process.exit(0); }
  if (parsed.positionals.length !== 1 || parsed.positionals[0] !== "persist" || !parsed.values.output || !parsed.values.run) throw new PrivatePersistenceError("configuration");
  const connection = hostedConnectionOptions(process.env);
  const { default: pg } = await import("pg");
  client = new pg.Client(connection);
  client.on("error", () => {});
  await client.connect();
  const result = await persistPrivateImport(client, { outputRoot: parsed.values.output, importRunId: parsed.values.run, target: { mode: "hosted", projectRef: INTENDED_PROJECT_REF, operatorId: process.env.ITACHI_RESEARCH_OPERATOR_ID, databaseRole: connection.user } });
  process.stdout.write(JSON.stringify(result) + "\n");
} catch (error) {
  // Database detail can contain a credential, query or transcript. Only fixed error codes cross this boundary.
  const safe = error instanceof PrivatePersistenceError ? error : new PrivatePersistenceError("database");
  process.stderr.write(safe.message + "\n"); process.exitCode = 1;
} finally { if (client) { try { await client.end(); } catch { /* No connection details in cleanup output. */ } } }
