// Do not audit stale production bytes after a push. Only compare public frontend files.
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const sha = execFileSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
const files = execFileSync(
  "git",
  ["diff", "--name-only", "HEAD^", "HEAD", "--", "*.html", "*.css", "*.js"],
  { encoding: "utf8" },
)
  .trim()
  .split("\n")
  .filter(
    (p) =>
      p &&
      !p.startsWith("scripts/") &&
      !p.includes("/tests/") &&
      !p.startsWith("tests/"),
  );
const digest = (b) => createHash("sha256").update(b).digest("hex"),
  expected = new Map();
for (const file of files) {
  try {
    expected.set(file, digest(await readFile(file)));
  } catch {
    /* Deleted files have no new bytes to compare. */
  }
}
let pending = [...expected.keys()];
const deadline = Date.now() + 180000;
while (pending.length && Date.now() < deadline) {
  const next = [];
  for (let start = 0; start < pending.length; start += 6)
    await Promise.all(
      pending.slice(start, start + 6).map(async (path) => {
        try {
          const url = new URL(
            path,
            "https://laurandreea10.github.io/codepen-portfolio/",
          );
          url.searchParams.set("release", sha);
          const r = await fetch(url, {
            headers: { "Cache-Control": "no-cache" },
            signal: AbortSignal.timeout(10000),
          });
          if (
            !r.ok ||
            digest(Buffer.from(await r.arrayBuffer())) !== expected.get(path)
          )
            next.push(path);
        } catch {
          next.push(path);
        }
      }),
    );
  pending = next;
  if (pending.length) {
    console.log("Waiting for deployed bytes: " + pending.join(", "));
    await new Promise((r) => setTimeout(r, 5000));
  }
}
if (pending.length)
  throw Error(
    "Production does not yet match this commit: " + pending.join(", "),
  );
console.log(
  `Production bytes confirmed for ${expected.size} changed frontend files (${sha}).`,
);
