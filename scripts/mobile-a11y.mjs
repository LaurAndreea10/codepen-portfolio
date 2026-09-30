import { createRequire } from "node:module";
import { startAuditServer } from "./audit-server.mjs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;
const live = process.env.AUDIT_LIVE === "1";
const server = live ? null : await startAuditServer();
import { mkdir } from "node:fs/promises";

const publishedTargets = [
  { name: "SkyDreams Portal", url: "https://laurandreea10.github.io/codepen-portfolio/skydreams-portal/" },
  { name: "Revenue Landscape", url: "https://laurandreea10.github.io/Revenue-Landscape/" },
  { name: "Kygo World", url: "https://laurandreea10.github.io/codepen-portfolio/kygo-world/" }
];
const targets = live ? publishedTargets : publishedTargets.filter(t => t.name !== "Revenue Landscape").map(t => ({ ...t, url: t.url.replace("https://laurandreea10.github.io/codepen-portfolio", server.baseURL) }));
const widths = [360, 390, 412];
const failures = [];
const warnings = [];
await mkdir("audit-artifacts/recent-projects", { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE} : {}) });

try {
  for (const target of targets) {
    for (const width of widths) {
      const context = await browser.newContext({
        viewport: { width, height: 844 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        reducedMotion: "reduce",
        colorScheme: "dark"
      });
      const page = await context.newPage();
      const initialFailures = failures.length;
      page.on("pageerror", e => failures.push(`${target.name} @ ${width}px: ${e.message}`));
      page.on("console", m => { if(m.type() === "error") failures.push(`${target.name} @ ${width}px: ${m.text()}`); });
      const response = await page.goto(target.url, { waitUntil: "networkidle", timeout: 60000 });

      if (!response || !response.ok()) {
        failures.push(`${target.name} @ ${width}px: HTTP ${response?.status() ?? "no response"}`);
        await context.close();
        continue;
      }

      if (width === 390) {
        await page.screenshot({
          path: `audit-artifacts/recent-projects/${target.name.toLowerCase().replaceAll(" ", "-")}-390.png`,
          fullPage: true
        });
      }

      const layout = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
        reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
        title: document.title,
        language: document.documentElement.lang
      }));

      if (layout.scrollWidth > layout.viewport + 2) {
        failures.push(`${target.name} @ ${width}px: horizontal overflow ${layout.scrollWidth - layout.viewport}px`);
      }
      if (!layout.reducedMotion) failures.push(`${target.name} @ ${width}px: reduced-motion preference not exposed`);
      if (!layout.title.trim()) failures.push(`${target.name}: missing document title`);
      if (!["ro", "en"].includes(layout.language.toLowerCase())) warnings.push(`${target.name}: unexpected html lang "${layout.language}"`);

      const axe = await new AxeBuilder({ page }).analyze();
      for (const issue of axe.violations.filter((item) => ["critical", "serious"].includes(item.impact))) {
        failures.push(`${target.name} @ ${width}px: axe ${issue.id} (${issue.nodes.length} node(s))`);
      }

      const smallTargets = await page.locator("button:visible, [role=button]:visible, input:visible:not([type=file]), select:visible").evaluateAll((nodes) =>
        nodes.map((node) => {
          const rect = node.getBoundingClientRect();
          return { label: node.getAttribute("aria-label") || node.textContent?.trim().slice(0, 40) || node.id || node.tagName, width: Math.round(rect.width), height: Math.round(rect.height) };
        }).filter((item) => item.width < 44 || item.height < 44)
      );
      if (smallTargets.length) warnings.push(`${target.name} @ ${width}px: ${smallTargets.length} touch target(s) below 44×44 — ${smallTargets.slice(0, 4).map((x) => `${x.label} ${x.width}×${x.height}`).join(", ")}`);

      await page.keyboard.press("Tab");
      const focus = await page.evaluate(() => {
        const node = document.activeElement;
        if (!node || node === document.body) return { ok: false, label: "body" };
        const style = getComputedStyle(node);
        return {
          ok: style.outlineStyle !== "none" || style.boxShadow !== "none",
          label: node.getAttribute("aria-label") || node.textContent?.trim().slice(0, 40) || node.id || node.tagName
        };
      });
      if (!focus.ok) failures.push(`${target.name} @ ${width}px: first keyboard target lacks a visible focus indicator (${focus.label})`);

      if (width === 390 && target.name === "Kygo World") {
        if (!(await page.locator("#coach").isVisible())) failures.push("Kygo World: first-run guide is not shown");
        const manifestOk = await page.evaluate(async () => (await fetch(document.querySelector('link[rel="manifest"]').href)).ok);
        if (!manifestOk) failures.push("Kygo World: web app manifest is not reachable");
        await page.locator("#safe").check();
        for (const [edition, date] of [
          ["halloween", new Date(2026, 9, 26, 12)],
          ["easter", new Date(2026, 3, 10, 12)],
          ["christmas", new Date(2026, 11, 26, 12)]
        ]) {
          await page.clock.setFixedTime(date);
          await page.reload({ waitUntil: "networkidle" });
          if (await page.locator(`#edition option[value="${edition}"]`).evaluate((option) => option.disabled)) {
            failures.push(`Kygo World: ${edition} is unavailable during its scheduled window`);
          }
          await page.locator("#edition").selectOption(edition);
          await page.locator('[data-mode="story"]').click();
          await page.locator("#startOverlay").tap();
          if (!(await page.locator("body").evaluate((body) => body.classList.contains("playing") && body.classList.contains("game-focus")))) {
            failures.push(`Kygo World: ${edition} does not enter the focused playing state after mobile Start`);
          }
          if (edition === "halloween") {
            await page.screenshot({ path: "audit-artifacts/recent-projects/kygo-world-playing-390.png" });
          }
          await page.locator("#focusExit").click();
        }
        await page.clock.setFixedTime(new Date(2026, 8, 27, 12));
        await page.reload({ waitUntil: "networkidle" });
        await page.waitForTimeout(1200);
        if (!(await page.locator('#edition option[value="halloween"]').evaluate((option) => option.disabled))) {
          const observedDate = await page.evaluate(() => new Date().toISOString());
          failures.push(`Kygo World: Halloween remains available outside its scheduled window (${observedDate})`);
        }
        for (const gameMode of ["dash", "championship", "endless", "maze", "treasure", "garden", "duo", "zen"]) {
          await page.locator(`[data-mode="${gameMode}"]`).click();
          await page.locator("#startOverlay").tap();
          if (!(await page.locator("body").evaluate((body) => body.classList.contains("playing") && body.classList.contains("game-focus")))) {
            failures.push(`Kygo World: ${gameMode} does not start on mobile`);
          }
          await page.locator("#focusExit").click();
        }
        await page.locator("#language").selectOption("en");
        if ((await page.locator("html").getAttribute("lang")) !== "en") failures.push("Kygo World: English language toggle failed");
        await page.locator("#contrast").click();
        await page.locator("#motion").click();
        if ((await page.locator("#contrast").getAttribute("aria-pressed")) !== "true") failures.push("Kygo World: high contrast toggle failed");
        if ((await page.locator("#motion").getAttribute("aria-pressed")) !== "true") failures.push("Kygo World: reduced-motion toggle failed");
        const editions = await page.evaluate(() => JSON.parse(localStorage.getItem("kygo-world-v2") || "{}").editionLevels);
        if (!editions || !["halloween", "easter", "christmas"].every((edition) => edition in editions)) {
          failures.push("Kygo World: edition-specific progress keys are missing");
        }
      }

      if (width === 390 && target.name === "SkyDreams Portal") {
        if (await page.locator("#languageFirst").isVisible()) await page.locator("#chooseRo").click();
        await page.locator("#mode").selectOption("story");
        await page.locator("#start").click();
        if (await page.locator("#overlay").isVisible()) failures.push("SkyDreams Portal: Story did not open after Start");
        await page.waitForTimeout(2300);
        await page.screenshot({ path: "audit-artifacts/recent-projects/skydreams-story-390.png" });
        await page.keyboard.press("Escape");
        await page.locator("#menuEn").click();
        if ((await page.locator("html").getAttribute("lang")) !== "en") failures.push("SkyDreams Portal: English language toggle failed");
      }

      console.log(`${failures.length === initialFailures ? "PASS" : "FAIL"} ${target.name} @ ${width}px — axe serious/critical 0, no horizontal overflow`);
      await context.close();
    }
  }
} finally {
  await browser.close();
  await server?.close();
}

for (const warning of warnings) console.warn(`WARNING: ${warning}`);
if (failures.length) {
  console.error(`Mobile accessibility gate failed (${failures.length}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`Mobile accessibility gate passed for ${targets.length} projects × ${widths.length} viewports.`);
