import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { solveVariant } from "./studio-rules.js";
const dir = dirname(fileURLToPath(import.meta.url)),
  mime = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".webmanifest": "application/manifest+json",
    ".svg": "image/svg+xml",
  };
const server = createServer(async (req, res) => {
  try {
    const name = new URL(req.url, "http://localhost").pathname,
      path = resolve(dir, "." + (name === "/" ? "/index.html" : name));
    if (!path.startsWith(dir + "/")) throw Error();
    res.writeHead(200, { "Content-Type": mime[extname(path)] || "text/plain" });
    res.end(await readFile(path));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CANDY_BROWSER
    ? {
        executablePath: process.env.CANDY_BROWSER,
        args: [
          "--no-sandbox",
          "--disable-gpu",
          "--disable-dev-shm-usage",
          "--no-zygote",
          "--single-process",
          "--disable-software-rasterizer",
        ],
      }
    : {}),
});
const context = await browser.newContext({ acceptDownloads: true }),
  page = await context.newPage(),
  root = `http://127.0.0.1:${server.address().port}/`,
  errors = [],
  checks = [],
  axe = [];
page.on("pageerror", (e) => errors.push(e.message));
const studio = () =>
  page.evaluate(() =>
    JSON.parse(localStorage.getItem("laurai-candy-studio-v1")),
  );
const b = (text) =>
  page.locator("#studio").getByRole("button", { name: text, exact: true });
async function open(id) {
  await page.locator("#" + id).evaluate((e) => (e.open = true));
}
async function apply(mode, values = "4,5,4,1,7,3,8,2") {
  await page.locator("#s-values").fill(values);
  await page.locator("#s-variant").selectOption(mode);
  await b("Aplică puzzle").click();
}
async function solve() {
  const data = await studio(),
    p = data.profiles[data.active].puzzle;
  for (const i of solveVariant(p).routes[0])
    await page.locator("#s-board .studio-street button").nth(i).click();
  await b("Verifică ruta").click();
}
try {
  await page.goto(root+'?view=classic');
  await page.waitForSelector("#studio");
  assert.deepEqual(errors, []);
  for (const mode of [
    "classic",
    "circle",
    "gap",
    "maxk",
    "exactk",
    "energy",
    "time",
    "closed",
    "required",
    "taste",
    "tree",
  ]) {
    await apply(mode);
    await solve();
    const s = await studio(),
      r = s.profiles[0].records.at(-1);
    assert.equal(r.score, r.best, mode);
    assert.equal(await b("Verifică ruta").isDisabled(), true);
  }
  checks.push(
    "11 rule modes: optimal play, resource/count constraints, completion and duplicate-submit protection",
  );
  await apply("hidden");
  await page.locator("#s-board .studio-street button").nth(0).click();
  await b("Indiciu").click();
  await page.reload();
  let s = await studio();
  assert.equal(s.profiles[0].session.assisted, true);
  assert.equal(s.profiles[0].puzzle.variant, "hidden");
  assert.equal(
    await page.locator("#s-board .studio-street button").nth(1).textContent(),
    "#1 · ?",
  );
  checks.push("exploration, hidden values and assistance survive reload");
  await open("s-profiles");
  await page.locator("#s-play-style").selectOption("expert");
  assert.equal(await b("Indiciu").isDisabled(), true);
  await page.locator("#s-play-style").selectOption("relaxed");
  await page.locator("#s-name").fill("Al doilea");
  await b("Adaugă profil").click();
  assert.equal((await studio()).active, 1);
  await open("s-profiles");
  await page.locator("#s-profile").selectOption("0");
  s = await studio();
  assert.equal(s.profiles[0].session.assisted, true);
  assert.equal(s.profiles[0].puzzle.variant, "hidden");
  assert.equal(
    await page.locator("#s-board .studio-street button").nth(1).textContent(),
    "#1 · ?",
  );
  checks.push(
    "expert/relaxed styles and isolated profiles preserve active sessions",
  );
  await apply("circle", "5,1,1,5");
  await open("s-sharing");
  await page.locator("#s-puzzle-name").fill("Cerc");
  await b("Salvează în colecție").click();
  await b("Link cu reguli").click();
  const shared = await page.locator("#s-share").inputValue();
  await page.goto(shared);
  assert.equal((await studio()).profiles[0].puzzle.circle, true);
  await open("s-sharing");
  const dl = page.waitForEvent("download");
  await b("Export pachet puzzle-uri").click();
  assert.equal((await dl).suggestedFilename(), "candy-route-puzzles.json");
  checks.push(
    "named collection, rule-bearing shared URL and puzzle-pack export",
  );
  await open("s-profiles");
  const before = await studio();
  await page.locator("#s-backup").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":1}'),
  });
  await page.waitForFunction(() =>
    document.querySelector("#s-status").textContent.includes("invalid"),
  );
  assert.deepEqual(await studio(), before);
  const valid = structuredClone(before);
  valid.theme = "winter";
  await page.locator("#s-backup").setInputFiles({
    name: "good.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(valid)),
  });
  await page.waitForFunction(() => document.body.dataset.season === "winter");
  assert.equal((await studio()).profiles[0].collection[0].name, "Cerc");
  checks.push(
    "atomic invalid/full backup imports with profiles, collections and season",
  );
  await apply("classic", "4,5,4");
  await solve();
  const png = page.waitForEvent("download");
  await b("Export PNG").click();
  assert.equal((await png).suggestedFilename(), "candy-route.png");
  await open("s-sharing");
  await b("Cod rezultat").click();
  const code = await page.locator("#s-share").inputValue();
  await page.locator("#s-opponent").fill(code);
  await b("Compară codurile").click();
  assert.match(await page.locator("#s-status").textContent(), /8/);
  checks.push("PNG and validated asynchronous comparison code");
  await b("Duel local · aceeași stradă").click();
  await solve();
  await b("Jucătorul 2").click();
  await solve();
  assert.match(await page.locator("#s-status").textContent(), /8 – 8/);
  checks.push("two-player duel, handoff and tie result");
  await open("s-lab");
  await b("Construiește explicația").click();
  assert.equal(await page.locator("#s-lab-output meter").count(), 4);
  await page.locator("#s-quiz").fill("8");
  await b("Verifică predicția").click();
  assert.match(await page.locator("#s-lab-output").textContent(), /Corect/);
  checks.push(
    "dependency table, memo cache, recursive tree, operation chart and prediction",
  );
  await page.locator("#expand-game").click();
  assert.equal(
    await page
      .locator("body")
      .evaluate((e) => e.classList.contains("stage-open")),
    true,
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .locator("body")
      .evaluate((e) => e.classList.contains("stage-open")),
    false,
  );
  checks.push("expanded game, focus and Escape exit");
  await apply("exactk", "5,4");
  await page.locator("#s-k").fill("2");
  await b("Aplică puzzle").click();
  await b("Verifică ruta").click();
  assert.match(await page.locator("#s-board").textContent(), /Imposibil/);
  checks.push("infeasible exact-K puzzle explained");
  await page.locator("#s-k").fill("3");
  await apply("classic");
  await page.locator("#lang").click();
  assert.equal(
    await page.locator("#s-editor summary").textContent(),
    "Puzzle creator and rules",
  );
  assert.equal((await studio()).profiles[0].records.length > 0, true);
  checks.push("RO/EN labels and progress retention");
  for (const width of [360, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `overflow ${width}`,
    );
    const report = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    axe.push({
      width,
      violations: report.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    });
  }
  await page.screenshot({
    path: "/tmp/candy-studio-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "/tmp/candy-studio-mobile.png",
    fullPage: true,
  });
  assert.equal(axe.flatMap((x) => x.violations).length, 0, JSON.stringify(axe));
  checks.push("four responsive widths and automated WCAG checks");
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await page.waitForSelector("#studio");
  assert.equal(
    await page.locator("#s-editor summary").textContent(),
    "Puzzle creator and rules",
  );
  await context.setOffline(false);
  checks.push("service worker: complete reload offline with language/progress");
  assert.deepEqual(errors, []);
  await writeFile(
    resolve(dir, "studio-browser-results.json"),
    JSON.stringify(
      {
        version: "4.0.0",
        view: "classic-studio",
        date: new Date().toISOString(),
        checks,
        axe,
        pageErrors: errors,
        limitations: [
          "Physical phone",
          "Real screen reader",
          "CodePen editor Jest",
          "Production deployment",
        ],
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({ passed: checks.length, axeViolations: 0, pageErrors: 0 }),
  );
} finally {
  await browser.close();
  server.close();
}
