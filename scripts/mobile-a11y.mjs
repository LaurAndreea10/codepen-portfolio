import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const targets = [
  { name: "Kygo Arhipelagul", url: "https://laurandreea10.github.io/codepen-portfolio/kygo-arhipelagul/" },
  { name: "Baseline Voyage", url: "https://laurandreea10.github.io/codepen-portfolio/baseline-voyage/" },
  { name: "SkyDreams Portal", url: "https://laurandreea10.github.io/codepen-portfolio/skydreams-portal/" },
  { name: "Revenue Landscape", url: "https://laurandreea10.github.io/Revenue-Landscape/", controls: ["#lang", "#theme", "#contrast"] },
  { name: "Kygo World", url: "https://laurandreea10.github.io/codepen-portfolio/kygo-world/" },
  { name: "Serpent Prism", url: "https://laurandreea10.github.io/codepen-portfolio/serpent-prism/", controls: ["#lang", "#theme", "#contrast", "#motion"] },
  { name: "PentArena", url: "https://laurandreea10.github.io/codepen-portfolio/pentarena/", controls: ["#langBtn"] },
  { name: "SlideStorm Arena", url: "https://laurandreea10.github.io/codepen-portfolio/slidestorm-arena/", controls: ["#lang", "#theme", "#contrast", "#motion"] },
  { name: "Odyssey Quest", url: "https://laurandreea10.github.io/codepen-portfolio/odyssey-quest/", controls: ["#language", "#theme", "#highContrast", "#reduceMotion"] },
  { name: "Curious Garden", url: "https://laurandreea10.github.io/codepen-portfolio/curious-garden/", controls: ["#lang", "#theme", "#contrast"] },
  { name: "Canva Collection RO", url: "https://laurandreea10.github.io/codepen-portfolio/canva-collection.html", controls: ["#theme", "#contrast"] },
  { name: "Canva Collection EN", url: "https://laurandreea10.github.io/codepen-portfolio/en/canva-collection.html", controls: ["#theme", "#contrast"] }
];
const selectedTargets = targets.filter(target => !process.env.AUDIT_TARGET || target.url.includes(process.env.AUDIT_TARGET));
if (!selectedTargets.length) throw new Error("AUDIT_TARGET matched no pages");
const widths = [360, 390, 412];
const failures = [];
const warnings = [];
await mkdir("audit-artifacts/recent-projects", { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });

try {
  for (const target of selectedTargets) {
    for (const width of widths) {
      const failuresBefore = failures.length;
      const context = await browser.newContext({
        viewport: { width, height: 844 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        reducedMotion: "reduce",
        colorScheme: process.env.AUDIT_SCHEME === "light" ? "light" : "dark"
      });
      const page = await context.newPage();
      const response = await page.goto(target.url, { waitUntil: "networkidle", timeout: 60000 });

      if (!response || !response.ok()) {
        failures.push(`${target.name} @ ${width}px: HTTP ${response?.status() ?? "no response"}`);
        await context.close();
        continue;
      }

      if (width !== 390 && ['Kygo Arhipelagul', 'Baseline Voyage'].includes(target.name)) {
        const passportClose = page.locator('#kygo-universe [data-close]');
        if (await passportClose.isVisible()) await passportClose.click();
        const scheme = process.env.AUDIT_SCHEME === 'light' ? 'light' : 'dark';
        if (target.name === 'Kygo Arhipelagul') {
          await page.locator('[data-act="go"][data-s="set"]').click();
          await page.locator(`[data-act="theme"][data-v="${scheme}"]`).click();
          await page.locator('[data-act="go"][data-s="map"]').click();
        } else {
          const skip = page.locator('[data-tour="skip"]');
          if (await skip.isVisible()) await skip.click();
          await page.locator('[data-open="settings"]').click();
          await page.locator(`input[name="scheme"][value="${scheme}"]`).check();
          await page.locator('#settings button[value="close"]').click();
        }
      }
      if (width === 390) {
        // The shared Kygo passport can open a shadow-DOM dialog on first visit.
        const passportClose = page.locator('#kygo-universe [data-close]');
        if (await passportClose.isVisible()) await passportClose.click();
        // Exercise actual app controls, rather than only emulating the OS theme.
        if (target.name === "Kygo Arhipelagul") {
          await page.locator('[data-act="go"][data-s="set"]').click();
          await page.locator(`[data-act="theme"][data-v="${process.env.AUDIT_SCHEME === 'light' ? 'light' : 'dark'}"]`).click();
          for (const lang of ['en', 'ro']) {
            await page.locator(`[data-act="lang"][data-v="${lang}"]`).click();
            if (await page.locator('html').getAttribute('lang') !== lang) failures.push(`${target.name}: ${lang} switch failed`);
          }
          await page.locator('[data-act="tog"][data-k="contrast"][data-v="1"]').click();
          if (!await page.locator('html').evaluate(el => el.classList.contains('hc'))) failures.push(`${target.name}: high contrast failed`);
          const hc = await new AxeBuilder({ page }).analyze();
          for (const issue of hc.violations.filter(i => ['critical', 'serious'].includes(i.impact))) failures.push(`${target.name} high contrast: axe ${issue.id}`);
          await page.locator('[data-act="tog"][data-k="contrast"][data-v="0"]').click();
          await page.locator('[data-act="go"][data-s="map"]').click();
        }
        if (target.name === "Baseline Voyage") {
          const skip = page.locator('[data-tour="skip"]');
          if (await skip.isVisible()) await skip.click();
          for (let i = 0; i < 2; i++) {
            const previous = await page.locator('html').getAttribute('lang');
            await page.locator('.lang-toggle').click();
            if (await page.locator('html').getAttribute('lang') === previous) failures.push(`${target.name}: language switch failed`);
          }
          await page.locator('[data-open="settings"]').click();
          await page.locator(`input[name="scheme"][value="${process.env.AUDIT_SCHEME === 'light' ? 'light' : 'dark'}"]`).check();
          await page.locator('input[name="contrast"]').check();
          if (!await page.locator('html').evaluate(el => el.classList.contains('contrast'))) failures.push(`${target.name}: high contrast failed`);
          if (!await page.locator('input[name="calm"]').isChecked()) failures.push(`${target.name}: reduced motion not inherited`);
          const hc = await new AxeBuilder({ page }).analyze();
          for (const issue of hc.violations.filter(i => ['critical', 'serious'].includes(i.impact))) failures.push(`${target.name} high contrast: axe ${issue.id}`);
          await page.locator('input[name="contrast"]').uncheck();
          await page.locator('#settings button[value="close"]').click();
        }
        await page.screenshot({
          path: `audit-artifacts/recent-projects/${target.name.toLowerCase().replaceAll(" ", "-")}-390${process.env.AUDIT_SCHEME === "light" ? "-light" : ""}.png`,
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

      const hasReducedMotionCss = await page.evaluate(() => {
        const inspect = (rules) => Array.from(rules || []).some((rule) => {
          if (rule.media?.mediaText?.includes("prefers-reduced-motion")) return true;
          try { return inspect(rule.cssRules); } catch { return false; }
        });
        return Array.from(document.styleSheets).some((sheet) => {
          try { return inspect(sheet.cssRules); } catch { return false; }
        });
      });
      const reducedMotionApplied = target.name === 'Baseline Voyage' && await page.locator('html').evaluate(el =>
        el.classList.contains('calm') && getComputedStyle(el).scrollBehavior !== 'smooth' &&
        [...document.querySelectorAll('.cue')].every(cue => getComputedStyle(cue).animationName === 'none'));
      if (!hasReducedMotionCss && !reducedMotionApplied) failures.push(`${target.name}: reduced-motion styling/behavior missing`);

      for (const selector of target.controls || []) {
        const control = page.locator(selector).first();
        if (await control.count() === 0) {
          failures.push(`${target.name}: missing display/accessibility control ${selector}`);
        }
      }

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
        // Editions are replayable year-round (kygo-universe CHANGELOG); outside the window Halloween must stay selectable.
        if (await page.locator('#edition option[value="halloween"]').evaluate((option) => option.disabled)) {
          const observedDate = await page.evaluate(() => new Date().toISOString());
          failures.push(`Kygo World: Halloween cannot be replayed outside its scheduled window (${observedDate})`);
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
        // Toggles start from shared preferences (reduced motion follows the OS setting), so assert each click flips the state.
        const contrastBefore = await page.locator("#contrast").getAttribute("aria-pressed");
        await page.locator("#contrast").click();
        const motionBefore = await page.locator("#motion").getAttribute("aria-pressed");
        await page.locator("#motion").click();
        await page.waitForTimeout(100);
        if ((await page.locator("#contrast").getAttribute("aria-pressed")) === contrastBefore) failures.push("Kygo World: high contrast toggle failed");
        if ((await page.locator("#motion").getAttribute("aria-pressed")) === motionBefore) failures.push("Kygo World: reduced-motion toggle failed");
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

      for (const failure of failures.slice(failuresBefore)) console.error(failure);
      console.log(`${failures.length === failuresBefore ? 'PASS' : 'FAIL'} ${target.name} @ ${width}px`);
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
console.log(`Mobile accessibility gate passed for ${selectedTargets.length} pages × ${widths.length} viewports.`);

