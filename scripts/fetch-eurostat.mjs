// Downloads the Eurostat queries used by piata-digitala/ and stores them as a fallback snapshot,
// so the dashboard still works when the live API is slow or down.
// Run: node scripts/fetch-eurostat.mjs   (needs network access to ec.europa.eu)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const cfg = JSON.parse(readFileSync("piata-digitala/queries.json", "utf8"));

export function buildUrl(base, q) {
  const u = new URL(base + q.dataset);
  u.searchParams.set("format", "JSON");
  u.searchParams.set("lang", "EN");
  for (const [k, v] of Object.entries(q.params)) for (const x of [].concat(v)) u.searchParams.append(k, x);
  return u.toString();
}

const out = { fetched: new Date().toISOString(), source: "Eurostat Statistics API", data: {} };
let failed = 0;
for (const [name, q] of Object.entries(cfg.queries)) {
  const url = buildUrl(cfg.base, q);
  try {
    const res = await fetch(url, { headers: { accept: "application/json" } });
    const json = await res.json();
    if (!res.ok || json.error) throw new Error(JSON.stringify(json.error || res.status));
    // keep only what the page reads, to keep the snapshot small
    out.data[name] = { id: json.id, size: json.size, dimension: json.dimension, value: json.value, updated: json.updated, label: json.label };
    console.log(`ok   ${name}  ${Object.keys(json.value).length} values`);
  } catch (e) {
    failed++;
    console.error(`fail ${name}  ${url}\n     ${e.message}`);
  }
}
if (failed === Object.keys(cfg.queries).length) { console.error("Every query failed; snapshot not written."); process.exit(1); }
mkdirSync("piata-digitala/data", { recursive: true });
writeFileSync("piata-digitala/data/snapshot.json", JSON.stringify(out));
console.log("Wrote piata-digitala/data/snapshot.json");
process.exit(failed ? 1 : 0);
