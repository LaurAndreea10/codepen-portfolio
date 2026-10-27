import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { solveAdventure } from "./adventure-rules.js";
import { bestRoute } from "./candy.js";
import { createArenaServer } from "./arena-server.mjs";
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
    const path = resolve(
      dir,
      "." +
        (new URL(req.url, "http://localhost").pathname === "/"
          ? "/index.html"
          : new URL(req.url, "http://localhost").pathname),
    );
    if (!path.startsWith(dir + "/")) throw Error();
    const buffer = await readFile(path);
    res.writeHead(200, { "Content-Type": mime[extname(path)] || "text/plain" });
    res.end(buffer);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const root = `http://127.0.0.1:${server.address().port}/`;
const arena = createArenaServer({ allowedOrigins: [root.slice(0, -1)] });
await new Promise((r) => arena.listen(0, "127.0.0.1", r));
const arenaURL = `http://127.0.0.1:${arena.address().port}`;
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
  errors = [],
  checks = [],
  axe = [];
page.on("pageerror", (e) => errors.push(e.message));
const nav = (screen) =>
  page.locator(`#adventure-menu [data-route=${screen}]`).click();
const b = (name) =>
  page.locator("#adventure").getByRole("button", { name, exact: true });
const open = (id) => page.locator("#" + id).evaluate((el) => (el.open = true));
const state = () =>
  page.evaluate(() =>
    JSON.parse(localStorage.getItem("laurai-candy-adventure-v1")),
  );
const current = async () => {
  const s = await state();
  return s.profiles.p0;
};
async function solve() {
  const s = await current(),
    r = solveAdventure(s.session.puzzle);
  for (const i of r.routes[0])
    await page.locator(`[data-adv-house="${i}"]`).click();
  await b("Verifică traseul").click();
}
try {
  await page.goto(root);
  await page.waitForSelector("#adventure-home");
  assert.equal(await page.locator(".adv-start-grid button").count(), 3);
  assert.equal(await page.locator(".stage").isVisible(), false);
  await page.locator(".adv-start-grid [data-route=play]").click();
  await page.locator("#tutorial").click();
  assert.equal(await page.locator(".adv-tutorial-tip").isVisible(), true);
  checks.push(
    "three-choice start, immediate play and visible contextual tutorial",
  );
  await nav("campaign");
  assert.equal(await page.locator(".adv-district").count(), 5);
  await page
    .locator(".adv-district")
    .first()
    .getByRole("button", { name: "Grădină", exact: true })
    .click();
  await page.reload();
  assert.equal((await current()).choices[0], "garden");
  await page.locator("#lang").click();
  assert.match(
    await page.locator(".adv-district").first().textContent(),
    /Lantern suburb/,
  );
  await page.locator("#lang").click();
  checks.push(
    "illustrated map, story choices persist and RO/EN updates chapter text",
  );
  await nav("adventure");
  for (const mode of [
    "classic",
    "zones",
    "minimum",
    "recharge",
    "diversity",
    "delivery",
    "travel",
  ]) {
    await page.locator(`[data-mode=${mode}]`).click();
    await solve();
    const record = (await current()).records.at(-1);
    assert.equal(record.valid, true, mode);
    assert.equal(record.score, record.best, mode);
  }
  checks.push(
    "all seven Adventure rules, optimal routes and completion summaries",
  );
  await page.locator("[data-mode=classic]").click();
  await page.locator('[data-adv-house="0"]').click();
  await page.locator('[data-adv-house="1"]').click();
  await b("Verifică traseul").click();
  assert.equal((await current()).records.at(-1).valid, false);
  assert.match(
    await page.locator("#adv-status").textContent(),
    /incompatibile/,
  );
  await b("Indiciu contextual").click();
  await page.reload();
  assert.equal((await current()).session.assisted, true);
  checks.push(
    "specific adjacency feedback, failed attempts and assisted reload restoration",
  );
  await nav("studio");
  await page.locator("#adv-topology").selectOption("tree");
  await page.locator("#adv-parent-2").selectOption("1");
  await page.locator("#adv-value-0").fill("12");
  await page.locator("#adv-energy-0").fill("2");
  assert.match(await page.locator("#adv-preview").textContent(), /Optim/);
  assert.equal(await page.locator(".adv-builder-grid svg").count(), 1);
  await page.locator("#adv-build-name").fill("Test vizual");
  await open("adv-campaign-builder");
  await page.locator("#adv-campaign-name").fill("Povestea mea");
  await b("Adaugă nivelul curent").click();
  await b("Salvează campania").click();
  assert.equal(
    (await current()).campaigns[0].levels[0].puzzle.base.edges[1][0],
    1,
  );
  const campaignDL = page.waitForEvent("download");
  await b("Export campanie").click();
  assert.equal(
    (await campaignDL).suggestedFilename(),
    "candy-route-campaign.json",
  );
  await b("Validează și joacă").click();
  await solve();
  checks.push(
    "visual editor, resources, tree connections, saved campaign and export",
  );
  await nav("learn");
  await b("Repară ruta [4,5,4]").click();
  assert.deepEqual((await current()).session.picks, [1]);
  await nav("learn");
  await open("adv-debug");
  await b("Ignoră combinațiile de case").click();
  assert.match(await page.locator("#adv-status").textContent(), /Corect/);
  await open("adv-dp-practice");
  const values = (await current()).session.puzzle.base.values,
    steps = bestRoute(values).steps;
  for (let i = 0; i < steps.length; i++)
    await page.locator("#adv-dp-" + i).fill(String(steps[i].best));
  await b("Verifică matricea").click();
  assert.match(await page.locator("#adv-status").textContent(), /corecte/);
  await open("adv-reconstruct");
  await b("Iau").click();
  await b("Iau").click();
  assert.match(
    await page.locator("#adv-reconstruct").textContent(),
    /încheiată/,
  );
  await open("adv-benchmark");
  await b("Rulează benchmark limitat").click();
  assert.equal(await page.locator("#adv-benchmark tbody tr").count(), 3);
  checks.push(
    "repair route, debug exercise, DP matrix, interactive reconstruction and measured benchmark",
  );
  await nav("adventure");
  await open("adv-tournament");
  await b("Campionat · 3 runde").click();
  for (let i = 0; i < 3; i++) {
    await solve();
    if (i < 2) await b("Runda următoare").click();
  }
  assert.equal((await current()).tournament.scores.length, 3);
  assert.match(
    await page.locator("#adventure").textContent(),
    /Clasament final/,
  );
  await open("adv-tournament");
  await b("Duel simultan · 3 runde").click();
  await page.locator('[data-p2-house="0"]').click();
  await page.reload();
  assert.deepEqual((await current()).session.secondPicks, [0]);
  const p2score = (await current()).session.puzzle.base.values[0];
  await solve();
  assert.equal((await current()).tournament.scores[0][1], p2score);
  checks.push(
    "three-round algorithm championship and simultaneous two-board duel",
  );
  await nav("progress");
  await open("adv-observations");
  await page
    .locator("#adv-note-observation")
    .fill("Automated check: three start choices are visible.");
  await page.locator("#adv-note-before").fill("Many panels");
  await page.locator("#adv-note-after").fill("Three start choices");
  await page.locator("#adv-note-evidence").fill("adventure-ui-check.mjs");
  await b("Salvează observația").click();
  assert.equal((await current()).notes.length, 1);
  await page.locator("#adv-goal").fill("5");
  await page.locator("#adv-goal").dispatchEvent("change");
  await open("adv-attempt-history");
  assert.match(
    await page.locator("#adv-attempt-history").textContent(),
    /incompatibile/,
  );
  const csv = page.waitForEvent("download");
  await b("Export CSV").click();
  assert.equal((await csv).suggestedFilename(), "candy-route-progress.csv");
  await b("Raport săptămânal").click();
  assert.match(await page.locator("#adventure pre").textContent(), /încercări/);
  checks.push(
    "failed-attempt history, personal goals, weekly report and CSV export",
  );
  await nav("settings");
  await b("Mod exclusiv textual").click();
  assert.equal(
    await page
      .locator("body")
      .evaluate((el) => el.classList.contains("text-only")),
    true,
  );
  await page.locator("#adv-pref-scale").fill("120");
  await page.locator("#adv-pref-scale").dispatchEvent("input");
  await page.locator("#adv-weather").selectOption("rain");
  const backupDL = page.waitForEvent("download");
  await b("Export toate datele v4").click();
  const backup = JSON.parse(
    await readFile(await (await backupDL).path(), "utf8"),
  );
  assert.equal(backup.version, 4);
  const before = await state();
  await page.locator("#adv-full-file").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":4}'),
  });
  assert.deepEqual(await state(), before);
  backup.adventure.profiles.p0.goal = 7;
  await page.locator("#adv-full-file").setInputFiles({
    name: "good.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(backup)),
  });
  await b("Aplică backupul previzualizat").waitFor();
  assert.equal((await current()).goal, 5);
  await b("Aplică backupul previzualizat").click();
  await page.getByRole("button", { name: "Anulează", exact: true }).click();
  assert.equal((await current()).goal, 5);
  await b("Aplică backupul previzualizat").click();
  await page.getByRole("button", { name: "Înlocuiește", exact: true }).click();
  assert.equal((await current()).goal, 7);
  checks.push(
    "text/weather/size preferences and complete preview/cancel/confirm atomic backup",
  );
  await nav("adventure");
  await open("adv-tournament");
  await b("Multiplayer online").click();
  await page.locator("#adv-server").fill(arenaURL);
  await page.locator("#adv-online-name").fill("Laura");
  const firstResponse = page.waitForResponse(
    (res) => res.url() === arenaURL + "/rooms",
  );
  await b("Creează cameră").click();
  const first = await (await firstResponse).json();
  await page.locator("#adv-online-board h3").waitFor();
  const page2 = await context.newPage();
  page2.on("pageerror", (e) => errors.push(e.message));
  await page2.goto(root);
  await page2.waitForSelector("#adv-server");
  await page2.locator("#adv-server").fill(arenaURL);
  await page2.locator("#adv-room-code").fill(first.room);
  await page2.locator("#adv-online-name").fill("Player 2");
  await page2
    .locator("#adventure")
    .getByRole("button", { name: "Intră în cameră", exact: true })
    .click();
  await page2.locator("#adv-online-board h3").waitFor();
  await page.waitForFunction(() =>
    document
      .querySelector("#adv-online-board")
      .textContent.includes("Player 2"),
  );
  await page.reload();
  await b("Reia conexiunea").click();
  await page.locator("#adv-online-board h3").waitFor();
  for (const i of solveAdventure(first.state.puzzle).routes[0])
    await page
      .locator("#adv-online-board .adv-visual-street button")
      .nth(i)
      .click();
  await b("Trimite ruta serverului").click();
  await page2
    .locator("#adventure")
    .getByRole("button", { name: "Trimite ruta serverului", exact: true })
    .click();
  await page2.waitForFunction(() =>
    document
      .querySelector("#adv-online-board")
      .textContent.includes("Rezultate calculate"),
  );
  await page2.close();
  checks.push(
    "two browser players over HTTP: room handoff, token sessions and server-verified scoring",
  );
  await nav("settings");
  await b("Mod exclusiv textual").click();
  for (const width of [360, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `overflow ${width}`,
    );
    const r = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    axe.push({
      width,
      violations: r.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    });
  }
  assert.equal(axe.flatMap((x) => x.violations).length, 0, JSON.stringify(axe));
  checks.push(
    "four responsive widths and automated WCAG checks on new settings flow",
  );
  await nav("adventure");
  await page.locator("[data-mode=classic]").click();
  await page.locator('[data-adv-house="0"]').focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(
    await page.evaluate(() => document.activeElement.dataset.advHouse),
    "1",
  );
  checks.push("arrow-key navigation and focus preservation");
  await nav("play");
  await page.locator("#expand-game").click();
  await page.keyboard.press("?");
  assert.equal(
    await page
      .locator("body")
      .evaluate((el) => el.classList.contains("stage-open")),
    false,
  );
  assert.equal(await b("Export toate datele v4").isVisible(), true);
  const shared =
    "#street=" +
    encodeURIComponent(
      JSON.stringify({ version: 1, mode: "classic", street: [4, 5, 4] }),
    );
  await page.goto(root + shared);
  assert.equal(await page.locator(".stage").isVisible(), true);
  assert.deepEqual(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("laurai-candy-v2")).attempt.street,
    ),
    [4, 5, 4],
  );
  checks.push(
    "expanded-view help exits safely and shared links open the received street",
  );
  for (const screen of ["home", "campaign", "studio", "learn", "progress"]) {
    await nav(screen);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `overflow ${screen}`,
    );
    const report = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    axe.push({
      width: 390,
      screen,
      violations: report.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    });
  }
  assert.equal(axe.flatMap((x) => x.violations).length, 0, JSON.stringify(axe));
  checks.push(
    "new home/map/editor/lab/progress flows: mobile overflow and axe",
  );
  await page.screenshot({
    path: "/tmp/candy-adventure-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await nav("home");
  await page.screenshot({
    path: "/tmp/candy-adventure-home-mobile.png",
    fullPage: true,
  });
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await page.waitForSelector("#adventure-home");
  assert.equal(await page.locator(".adv-start-grid button").count(), 3);
  await context.setOffline(false);
  checks.push("offline reload of the v4 home and module graph");
  assert.deepEqual(errors, []);
  await writeFile(
    resolve(dir, "adventure-browser-results.json"),
    JSON.stringify(
      {
        version: "4.0.0",
        date: new Date().toISOString(),
        checks,
        axe,
        pageErrors: errors,
        unverified: [
          "Physical S25",
          "Real screen reader",
          "CodePen editor",
          "Public Arena hosting",
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
  server.closeAllConnections();
  arena.closeAllConnections();
  await new Promise((r) => server.close(r));
  await new Promise((r) => arena.close(r));
}
