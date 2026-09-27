import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const targets = [
  { name: "SkyDreams Portal", url: "https://laurandreea10.github.io/codepen-portfolio/skydreams-portal/" },
  { name: "Revenue Landscape", url: "https://laurandreea10.github.io/Revenue-Landscape/" },
  { name: "Kygo World", url: "https://laurandreea10.github.io/codepen-portfolio/kygo-world/" }
];
const widths = [360, 390, 412];
const failures = [];
const warnings = [];
await mkdir("audit-artifacts/recent-projects", { recursive: true });
const browser = await chromium.launch({ headless: true });

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

      const smallTargets = await page.locator("button:visible, [role=button]:visible, input:visible, select:visible").evaluateAll((nodes) =>
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
        await page.locator("#safe").check();
        for (const edition of ["halloween", "easter", "christmas"]) {
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
        await page.locator("#language").selectOption("en");
        if ((await page.locator("html").getAttribute("lang")) !== "en") failures.push("Kygo World: English language toggle failed");
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
        await page.screenshot({ path: "audit-artifacts/recent-projects/skydreams-story-390.png" });
        await page.keyboard.press("Escape");
        await page.locator("#menuEn").click();
        if ((await page.locator("html").getAttribute("lang")) !== "en") failures.push("SkyDreams Portal: English language toggle failed");
      }

      console.log(`PASS ${target.name} @ ${width}px — axe serious/critical 0, no horizontal overflow`);
      await context.close();
    }
  }
} finally {
  await browser.close();
}

for (const warning of warnings) console.warn(`WARNING: ${warning}`);
if (failures.length) {
  console.error(`Mobile accessibility gate failed (${failures.length}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`Mobile accessibility gate passed for ${targets.length} projects × ${widths.length} viewports.`);
