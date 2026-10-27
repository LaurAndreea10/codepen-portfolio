import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
const root = resolve(new URL("..", import.meta.url).pathname),
  server = createServer(async (req, res) => {
    try {
      let path = new URL(req.url, "http://localhost").pathname;
      if (path.endsWith("/")) path += "index.html";
      const file = resolve(root, "." + path);
      if (!file.startsWith(root + "/")) throw Error();
      const data = await readFile(file);
      res.writeHead(200, {
        "Content-Type":
          {
            ".html": "text/html",
            ".js": "text/javascript",
            ".css": "text/css",
            ".json": "application/json",
            ".svg": "image/svg+xml",
            ".woff2": "font/woff2",
          }[extname(file)] || "application/octet-stream",
      });
      res.end(data);
    } catch {
      res.writeHead(404).end();
    }
  });
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}/`;
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
  }),
  context = await browser.newContext({
    viewport: { width: 412, height: 823 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 1.75,
    serviceWorkers: "block",
  });
const checks = [],
  layout = [],
  accessibility = [],
  errors = [];
try {
  for (const path of [
    "serpent-prism/",
    "pentarena/",
    "livada/",
    "livada/joc/",
  ]) {
    const page = await context.newPage();
    page.on("pageerror", (e) => errors.push(path + ": " + e.message));
    await page.addInitScript(() => {
      window.layoutEntries = [];
      new PerformanceObserver((list) => {
        for (const e of list.getEntries())
          if (!e.hadRecentInput)
            window.layoutEntries.push({ value: e.value, time: e.startTime });
      }).observe({ type: "layout-shift", buffered: true });
    });
    if (/serpent|pentarena/.test(path))
      await page.route("**/game.js", async (route) => {
        await new Promise((r) => setTimeout(r, 800));
        await route.continue();
      });
    await page.goto(base + path);
    await page.waitForTimeout(1500);
    const entries = await page.evaluate(() => window.layoutEntries),
      total = entries.reduce((s, e) => s + e.value, 0);
    layout.push({
      path,
      delayedBootstrap: /serpent|pentarena/.test(path),
      total,
    });
    assert.ok(total <= 0.1, `${path}: layout shifts ${total}`);
    const findings = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
      .analyze();
    accessibility.push({
      path,
      violations: findings.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    });
    assert.equal(
      findings.violations.length,
      0,
      JSON.stringify(accessibility.at(-1)),
    );
    if (path === "pentarena/") {
      await page.locator('[data-k="basket"]').tap();
      assert.equal(
        await page.evaluate(() => PentArena.game.sport.key),
        "basket",
      );
      assert.equal(await page.locator("#cv").isVisible(), true);
    }
    if (path === "livada/") {
      for (let i = 0; i < 4; i++) {
        await page.locator(`[data-flavor="${i}"]`).tap();
        assert.equal(
          await page.locator("#flavor-panel").getAttribute("aria-labelledby"),
          "flavor-tab-" + i,
        );
      }
      assert.equal(
        await page.locator("#flavor-panel").getAttribute("role"),
        "tabpanel",
      );
    }
    await page.close();
  }
  checks.push(
    "four pages pass strict automated accessibility; delayed game bootstrap stays within CLS 0.1",
  );
  checks.push(
    "PentArena still starts basketball after lazy preview rendering; LIVADA tabs keep panel ownership",
  );
  for (const path of ["portfolio.html", "en/"])
    for (const mode of ["approved", "empty", "offline"]) {
      const page = await context.newPage();
      page.on("pageerror", (e) => errors.push(path + ": " + e.message));
      const items =
        mode === "approved"
          ? [
              {
                name: "<b>Demo</b>",
                quote:
                  '<img src=x onerror="window.feedbackInjection=1"> Test text',
                approved: true,
              },
              { name: "Hidden", quote: "Not approved", approved: false },
            ]
          : [];
      await page.route("**/approved-feedback.json*", (r) =>
        mode === "offline"
          ? r.abort()
          : r.fulfill({
              status: 200,
              contentType: "application/json",
              body: JSON.stringify({ items }),
            }),
      );
      await page.goto(base + path, { waitUntil: "domcontentloaded" });
      const root = page.locator("[data-approved-feedback]").first();
      await root.waitFor({ state: "visible" });
      if (mode === "approved") {
        await root.locator("figure").first().waitFor();
        assert.equal(await root.locator("figure").count(), 1);
        assert.equal(
          await root.locator("[data-feedback-empty]").isVisible(),
          false,
        );
        assert.equal(await root.locator("img,b").count(), 0);
        assert.equal(
          await page.evaluate(() => window.feedbackInjection),
          undefined,
        );
      } else {
        await root
          .locator("[data-feedback-empty]")
          .waitFor({ state: "visible" });
        assert.equal(await root.locator("figure").count(), 0);
      }
      await page.close();
    }
  checks.push(
    "RO/EN feedback: approved text-only content, honest empty state and offline fallback",
  );
  assert.deepEqual(errors, []);
  await writeFile(
    new URL("./release-regression-results.json", import.meta.url),
    JSON.stringify(
      {
        date: new Date().toISOString(),
        checks,
        layout,
        accessibility,
        pageErrors: errors,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    JSON.stringify({ passed: checks.length, layout, axeViolations: 0 }),
  );
} finally {
  await browser.close();
  server.closeAllConnections();
  await new Promise((r) => server.close(r));
}
