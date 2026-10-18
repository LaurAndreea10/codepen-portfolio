import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { recentTargets } from './recent-project-targets.mjs';
import { servePortfolio } from './serve-portfolio.mjs';

const local = process.env.PORTFOLIO_AUDIT_BASE ? null : await servePortfolio();
const base = process.env.PORTFOLIO_AUDIT_BASE || local.base;
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox', '--no-zygote', '--disable-dev-shm-usage'] } : {}) }).catch(error => { local?.server.close(); throw error; });
const results = [];
const targets = process.env.AUDIT_TARGET ? recentTargets.filter(t => process.env.AUDIT_TARGET.split(',').some(name => t.name.includes(name.trim()))) : recentTargets;
const variants = [
  { name: 'dark', colorScheme: 'dark', reducedMotion: 'no-preference', forcedColors: 'none' },
  { name: 'light', colorScheme: 'light', reducedMotion: 'no-preference', forcedColors: 'none' },
  { name: 'reduced-motion', colorScheme: 'dark', reducedMotion: 'reduce', forcedColors: 'none' },
  { name: 'high-contrast', colorScheme: 'dark', reducedMotion: 'reduce', forcedColors: 'active' }
];
await mkdir('audit-artifacts/recent-projects', { recursive: true });
try {
  for (const target of targets) for (const width of [360, 390, 412]) for (const variant of variants) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true, serviceWorkers: 'block', colorScheme: variant.colorScheme, reducedMotion: variant.reducedMotion, forcedColors: variant.forcedColors });
    const page = await context.newPage();
    if (process.env.AUDIT_OFFLINE_FONTS) await page.route(/fonts\.(googleapis|gstatic)\.com/, route => route.abort());
    try {
      const response = await page.goto(new URL(target.path, base).href, { waitUntil: 'load', timeout: 60000 });
      if (!response?.ok()) throw new Error(`HTTP ${response?.status()}`);
      for (const language of ['ro', 'en']) {
        const failures = [], warnings = [];
        if (language === 'en' && !target.bilingual) {
          const switcher = page.locator(target.language).first();
          await switcher.click();
          await page.waitForFunction(() => document.documentElement.lang === 'en');
        }
        if (!target.bilingual && await page.locator('html').getAttribute('lang') !== language) failures.push(`Language did not become ${language}`);
        if (target.bilingual && !(await page.locator('[lang="en"]').count())) failures.push('English passages lack language markup');
        // Exercise the actual control and restore it; do not inject theme classes.
        if (language === 'ro' && variant.name === 'light' && target.theme) {
          const button = page.locator(target.theme).first();
          const before = await page.locator('body').evaluate(n => getComputedStyle(n).backgroundColor);
          await button.click();
          const after = await page.locator('body').evaluate(n => getComputedStyle(n).backgroundColor);
          if (before === after) failures.push('Theme control did not change the background');
          await button.click();
        }
        const layout = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth), title: document.title }));
        if (layout.scroll > layout.width + 2) failures.push(`Horizontal overflow ${layout.scroll - layout.width}px`);
        if (!layout.title.trim()) failures.push('Missing title');
        if (variant.reducedMotion === 'reduce') {
          const moving = await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running' && Number(a.effect?.getTiming().duration) > 100).length);
          if (moving) failures.push(`${moving} CSS animations still running under reduced motion`);
        }
        const axe = await new AxeBuilder({ page }).analyze();
        for (const issue of axe.violations.filter(v => ['serious', 'critical'].includes(v.impact))) failures.push(`axe ${issue.id}: ${issue.nodes.map(n => n.target.join(' ')).slice(0, 6).join(', ')}`);
        const small = await page.locator('button:visible,input:visible,select:visible,a:visible').evaluateAll(nodes => nodes.filter(n => { const r = n.getBoundingClientRect(); return r.width < 44 || r.height < 44; }).length);
        if (small) warnings.push(`${small} targets below the recommended 44×44 px`);
        await page.evaluate(() => document.activeElement?.blur());
        await page.keyboard.press('Tab');
        const focus = await page.evaluate(() => { const n = document.activeElement; if (!n || n === document.body) return false; const s = getComputedStyle(n); return (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== 'none'; });
        if (!focus) failures.push('Keyboard focus indicator missing');
        const result = { target: target.name, width, variant: variant.name, language, failures, warnings };
        results.push(result);
        console.log(`${failures.length ? 'FAIL' : 'PASS'} ${target.name} ${width}px ${variant.name} ${language}${failures.length ? ': ' + failures.join('; ') : ''}`);
        if (width === 390 && variant.name === 'high-contrast') await page.screenshot({ path: `audit-artifacts/recent-projects/${target.path.replaceAll('/', '-').replaceAll('.', '-')}${language}-contrast.png`, fullPage: true });
      }
    } catch (error) { results.push({ target: target.name, width, variant: variant.name, failures: [error.message] }); console.error(`FAIL ${target.name}: ${error.message}`); }
    finally { await context.close(); }
  }
} finally { await browser.close(); await new Promise(resolve => local ? local.server.close(resolve) : resolve()); }
await writeFile('audit-artifacts/recent-projects/matrix.json', JSON.stringify(results, null, 2));
const failed = results.filter(r => r.failures.length);
console.log(`Recent-project matrix: ${results.length} checks, ${failed.length} failed.`);
if (failed.length) process.exitCode = 1;
