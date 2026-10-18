#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import { importArchive, analyzeCorpus } from "./pipeline.ts";

const help = `Private evidence archive harness (Node >=22.18; tested on Node 24).
Usage:
  node research/cli.mjs import --manifest <manifest.ndjson> --source <export-root> --output <private-root>
  node research/cli.mjs analyze --manifest <manifest.ndjson> --source <export-root> --output <private-root> [--seed 42]
Options: --code-commit <revision> records an explicit source revision (defaults to this checkout's HEAD).
No network, harvesting, paid inference, publication, or curriculum generation occurs.
Outputs must be outside every git checkout; output symlink components are rejected.
`;
try {
  let parsed;
  try {
    parsed = parseArgs({ args: process.argv.slice(2), allowPositionals: true, strict: true,
      options: { manifest: { type: "string" }, source: { type: "string" }, output: { type: "string" }, seed: { type: "string" }, "code-commit": { type: "string" }, help: { type: "boolean", short: "h" } } });
  } catch { throw new Error("Invalid command arguments; use --help"); }
  const { values, positionals } = parsed;
  if (values.help) { process.stdout.write(help); process.exit(0); }
  const command = positionals[0];
  if (positionals.length !== 1 || !["import", "analyze"].includes(command)) throw new Error("Expected import or analyze; use --help");
  if (!values.manifest || !values.source || !values.output) throw new Error("--manifest, --source and --output are required");
  if (command === "import" && values.seed !== undefined) throw new Error("--seed applies to analyze only");
  const codeCommit = values["code-commit"] ?? execFileSync("git", ["rev-parse", "HEAD"], { cwd: fileURLToPath(new URL("..", import.meta.url)), encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  const options = { manifestPath: values.manifest, sourceRoot: values.source, outputRoot: values.output, codeCommit };
  const result = command === "import" ? importArchive(options) : analyzeCorpus({ ...options, ...(values.seed === undefined ? {} : { seed: Number(values.seed) }) });
  const coverage = "coverage" in result ? result.coverage : result.run_manifest.coverage;
  process.stdout.write(JSON.stringify({ command, run_id: result.run_id, discovered_videos: coverage.discovered_videos, verified_real_videos: coverage.verified_real_videos, inventory_completeness: coverage.inventory_completeness, candidates: "candidates" in result ? result.candidates.length : 0, pedagogy_eligible: false }) + "\n");
} catch (error) {
  // Validation errors never include transcript body text. JSON parse errors are replaced upstream.
  process.stderr.write(`Research harness: ${error instanceof Error ? error.message : "Operation failed"}\n`);
  process.exitCode = 1;
}
