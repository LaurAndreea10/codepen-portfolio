// Runs the logic test suites listed in test-status/suites.json and writes test-status/status.json.
// Usage:
//   node scripts/run-test-suites.mjs                 # every suite, writes status.json
//   node scripts/run-test-suites.mjs --only ghost-talk --no-write
//   node scripts/run-test-suites.mjs --list          # prints the suite ids as JSON (used by CI)
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const manifest = JSON.parse(readFileSync("test-status/suites.json", "utf8"));
const args = process.argv.slice(2);
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;

if (args.includes("--list")) {
  console.log(JSON.stringify(manifest.suites.map((s) => s.id)));
  process.exit(0);
}

// Pulls pass/fail counts out of Jest, Vitest and node:test output.
function counts(out) {
  let m;
  if ((m = out.match(/Tests:\s+(?:(\d+) failed, )?(?:\d+ skipped, )?(\d+) passed, (\d+) total/))) return { passed: +m[2], failed: +(m[1] || 0), total: +m[3] };
  if ((m = out.match(/Tests\s+(?:(\d+) failed \| )?(\d+) passed \((\d+)\)/))) return { passed: +m[2], failed: +(m[1] || 0), total: +m[3] };
  const pass = [...out.matchAll(/^# pass (\d+)/gm)].reduce((s, x) => s + +x[1], 0);
  const fail = [...out.matchAll(/^# fail (\d+)/gm)].reduce((s, x) => s + +x[1], 0);
  if (pass || fail) return { passed: pass, failed: fail, total: pass + fail };
  return null; // plain scripts: only the exit code is known
}

const results = [];
let failedSuites = 0;
for (const s of manifest.suites.filter((x) => !only || x.id === only)) {
  const started = Date.now();
  let out = "", ok = true;
  const env = { ...process.env, CI: "true", FORCE_COLOR: "0", NO_COLOR: "1" };
  if (s.setup) {
    const st = spawnSync(s.setup, { cwd: s.cwd, shell: "/bin/bash", encoding: "utf8", env });
    if (st.status !== 0) { ok = false; out = st.stdout + st.stderr; }
  }
  if (ok) {
    // Jest and Vitest print their summary on stderr, so both streams are kept.
    const r = spawnSync(s.cmd, { cwd: s.cwd, shell: "/bin/bash", encoding: "utf8", env, maxBuffer: 64 * 1024 * 1024 });
    out = (r.stdout || "") + (r.stderr || "");
    ok = r.status === 0;
  }
  const c = counts(out) || (ok ? null : { passed: 0, failed: 1, total: 1 });
  const r = { id: s.id, ok, ms: Date.now() - started, ...(c || {}) };
  if (!ok) { failedSuites++; console.error(out.slice(-3000)); }
  console.log(`${ok ? "PASS" : "FAIL"}  ${s.id}  ${c ? `${c.passed}/${c.total}` : "exit 0"}  ${(r.ms / 1000).toFixed(1)}s`);
  results.push(r);
}

if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, results.map((r) => `| ${r.ok ? "✅" : "❌"} | ${r.id} | ${r.total ? `${r.passed}/${r.total}` : "exit 0"} |`).join("\n") + "\n");
}

if (!args.includes("--no-write") && !only) {
  writeFileSync("test-status/status.json", JSON.stringify({
    generated: new Date().toISOString(),
    node: process.version,
    where: process.env.GITHUB_ACTIONS ? "GitHub Actions" : "local",
    results
  }, null, 2) + "\n");
  console.log("Wrote test-status/status.json");
}
process.exit(failedSuites ? 1 : 0);
