// Public read-only application audit: browser data is confined to a disposable context.
import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { freshState, LEVELS } from "./game.js";
import { bestRoute } from "./candy.js";
const base =
  process.env.CANDY_PUBLIC_URL ||
  "https://laurandreea10.github.io/codepen-portfolio/candy-route/";
const proxyURL = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
let proxy;
if (proxyURL) {
  const p = new URL(proxyURL);
  proxy = {
    server: p.protocol + "//" + p.host,
    ...(p.username
      ? {
          username: decodeURIComponent(p.username),
          password: decodeURIComponent(p.password),
        }
      : {}),
  };
}
const browser = await chromium.launch({
  headless: true,
  ...(proxy ? { proxy } : {}),
  ...(process.env.CANDY_BROWSER
    ? {
        executablePath: process.env.CANDY_BROWSER,
        args: [
          "--no-sandbox",
          ...(proxy ? ["--ignore-certificate-errors"] : []),
          "--disable-gpu",
          "--disable-dev-shm-usage",
          "--no-zygote",
          "--single-process",
          "--disable-software-rasterizer",
        ],
      }
    : {}),
});
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  ignoreHTTPSErrors: !!proxy,
  acceptDownloads: true,
});
const page = await context.newPage(),
  errors = [],
  checks = [],
  responses = [];
page.on("pageerror", (e) => errors.push(e.stack ?? e.message));
page.on("response", (r) => {
  if (r.url().startsWith(base) && r.status() >= 400)
    responses.push({ url: r.url(), status: r.status() });
});
const legacy = freshState();
legacy.wins = 3;
legacy.tutorialDone = true;
legacy.progress = {
  1: { stars: 3, practiced: false },
  2: { stars: 2, practiced: false },
  3: { stars: 3, practiced: false },
};
legacy.attempt = {
  kind: "campaign",
  level: 4,
  day: "",
  mode: LEVELS[3].mode,
  street: [...LEVELS[3].street],
  picked: [],
  hinted: false,
  revealed: false,
  credited: false,
};
await context.addInitScript((value) => {
  if (
    location.pathname.includes("/candy-route/") &&
    !localStorage.getItem("release-fixture-installed")
  ) {
    localStorage.setItem("laurai-candy-v2", JSON.stringify(value));
    localStorage.setItem("release-fixture-installed", "true");
  }
}, legacy);
const nav = (screen) =>
  page.locator(`#adventure-menu [data-route=${screen}]`).tap();
let failure = null;
try {
  const response = await page.goto(base, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  assert.equal(response.status(), 200);
  await page.waitForSelector("#adventure-home", { timeout: 90000 });
  assert.match(await page.locator(".eyebrow").first().textContent(), /V4\.0/);
  assert.equal(await page.locator(".adv-start-grid button").count(), 3);
  checks.push("public URL returns 200 and the v4 three-choice home");
  await page.locator(".adv-start-grid [data-route=play]").tap();
  assert.equal(
    await page.locator("#session-title").textContent(),
    "Nivel 4 / 30",
  );
  let saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("laurai-candy-v2")),
  );
  assert.deepEqual(saved.progress, legacy.progress);
  for (const i of bestRoute(legacy.attempt.street).indices)
    await page.locator(`#street [data-index="${i}"]`).tap();
  saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("laurai-candy-v2")),
  );
  assert.equal(saved.progress[4].stars, 3);
  assert.equal(saved.wins, 4);
  for (const i of ["1", "2", "3"])
    assert.deepEqual(saved.progress[i], legacy.progress[i]);
  checks.push(
    "v2 progress restored; mobile taps complete level 4 without losing prior stars",
  );
  await page.locator("#lang").tap();
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  await page.setViewportSize({ width: 844, height: 390 });
  assert.equal(
    await page.locator("#yours").textContent(),
    String(bestRoute(legacy.attempt.street).total),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  checks.push("RO/EN and portrait/landscape preserve the active attempt");
  await nav("settings");
  const download = page.waitForEvent("download");
  await page
    .locator("#adventure")
    .getByRole("button", { name: "Export all v4 data", exact: true })
    .tap();
  const backup = JSON.parse(
    await (
      await import("node:fs/promises")
    ).readFile(await (await download).path(), "utf8"),
  );
  assert.equal(backup.version, 4);
  assert.equal(backup.core.progress[4].stars, 3);
  const before = await page.evaluate(() =>
    localStorage.getItem("laurai-candy-v2"),
  );
  await page
    .locator("#adv-full-file")
    .setInputFiles({
      name: "partial.json",
      mimeType: "application/json",
      buffer: Buffer.from('{"version":4}'),
    });
  await page.waitForFunction(() =>
    document.querySelector("#adv-status")?.textContent.includes("Invalid"),
  );
  assert.equal(
    await page.evaluate(() => localStorage.getItem("laurai-candy-v2")),
    before,
  );
  checks.push(
    "public full backup contains old/new progress; partial import is rejected atomically",
  );
  await nav("home");
  await page.waitForFunction(
    () => navigator.serviceWorker.controller !== null,
    undefined,
    { timeout: 90000 },
  );
  const cacheNames = await page.evaluate(() => caches.keys());
  assert.ok(cacheNames.some((k) => k.startsWith("candy-route-v4-")));
  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForSelector(".adv-start-grid button");
  await nav("play");
  assert.equal(
    await page.locator("#yours").textContent(),
    String(bestRoute(legacy.attempt.street).total),
  );
  await context.setOffline(false);
  await nav("home");
  checks.push(
    "production worker caches v4; reload and saved game work offline in the test context",
  );
  const arcade = await context.newPage();
  if (process.env.CANDY_ARCADE_PATCH) {
    const css = await (
      await import("node:fs/promises")
    ).readFile(process.env.CANDY_ARCADE_PATCH, "utf8");
    await arcade.route(
      "https://laurandreea10.github.io/ARCADE-WORLD/",
      async (route) => {
        const response = await route.fetch();
        const html = await response.text();
        await route.fulfill({
          response,
          body: html.replace("</head>", "<style>" + css + "</style></head>"),
        });
      },
    );
  }
  arcade.on("pageerror", (e) => errors.push("Arcade: " + e.message));
  await arcade.goto("https://laurandreea10.github.io/ARCADE-WORLD/", {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  const skip = arcade.getByRole("button", {
    name: "Continuă fără setup →",
    exact: true,
  });
  if (await skip.isVisible()) await skip.tap();
  await arcade.getByRole("button", { name: /More/ }).first().tap();
  const card = arcade
    .locator('[data-mini-game-id=\"candy-route\"]:visible')
    .first();
  assert.match(await card.textContent(), /v4\.0/);
  await card.locator("button").first().tap();
  await arcade
    .frameLocator("#skyArcadeFrame")
    .locator(".adv-start-grid button")
    .first()
    .waitFor({ timeout: 90000 });
  assert.match(
    await arcade.locator("#skyArcadeFrame").getAttribute("src"),
    /codepen-portfolio\/candy-route\//,
  );
  checks.push(
    process.env.CANDY_ARCADE_PATCH
      ? "public Arcade World + proposed mobile CSS opens the real v4 game in the existing dialog"
      : "public Arcade World v4 card opens the real game in its existing large dialog",
  );
  await arcade.close();
  assert.deepEqual(errors, []);
  assert.deepEqual(responses, []);
} catch (e) {
  failure = e.message;
  await page
    .screenshot({ path: "/tmp/candy-release-failure.png", fullPage: true })
    .catch(() => {});
  console.log(
    JSON.stringify({
      screen: await page
        .locator("#adventure")
        .textContent()
        .catch(() => ""),
      errorStacks: errors,
    }),
  );
} finally {
  await context.setOffline(false).catch(() => {});
  await writeFile(
    new URL("./production-release-results.json", import.meta.url),
    JSON.stringify(
      {
        date: new Date().toISOString(),
        base,
        arcadeSource: process.env.CANDY_ARCADE_PATCH
          ? "public HTML with proposed mobile stylesheet; patch not deployed"
          : "public deployment",
        checks,
        passed: !failure,
        failure,
        pageErrors: errors,
        failedResponses: responses,
        method:
          "Disposable Chromium context, 390×844 mobile/touch and 844×390 landscape; no physical device or real screen reader",
        unverified: [
          "Physical S25",
          "Real screen reader",
          "CodePen editor",
          "Public Arena hosting",
        ],
      },
      null,
      2,
    ) + "\n",
  );
  await browser.close();
}
console.log(
  JSON.stringify({ passed: !failure, checks: checks.length, failure }),
);
if (failure) process.exitCode = 1;
