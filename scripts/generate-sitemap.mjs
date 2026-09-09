import { existsSync, writeFileSync } from 'node:fs';

const origin = 'https://laurandreea10.github.io/codepen-portfolio';
const pages = [
  ['portfolio.html', 'weekly', '1.0', '2026-09-06'],
  ['en/', 'weekly', '0.9', '2026-09-06'],
  ['alpis-fusion-crm.html', 'monthly', '0.9', '2026-08-30'],
  ['projects/clientflow.html', 'monthly', '0.9', '2026-08-30'],
  ['projects/alpis-impactpath.html', 'monthly', '0.9', '2026-04-20'],
  ['projects/clientops-suite-premium.html', 'monthly', '0.9', '2026-08-30'],
  ['projects/pulseboard.html', 'monthly', '0.8', '2026-05-29'],
  ['projects/excel-quest.html', 'monthly', '0.8', '2026-05-01'],
  ['process.html', 'monthly', '0.8', '2026-05-15'],
  ['work-with-me.html', 'monthly', '0.8', '2026-05-20'],
  ['insights.html', 'weekly', '0.8', '2026-04-25'],
  ['changelog.html', 'weekly', '0.7', '2026-09-06'],
  ['uses.html', 'monthly', '0.6', '2026-05-15'],
  ['campaignpilot.html', 'monthly', '0.7', '2026-05-10'],
  ['Campaign%20ROI%20Calculator.html', 'monthly', '0.7', '2026-05-10'],
  ['utm-builder.html', 'monthly', '0.6', '2026-05-20'],
  ['ab-test-simulator.html', 'monthly', '0.6', '2026-05-20'],
  ['email-subject-line-tester.html', 'monthly', '0.6', '2026-05-19'],
  ['conversion-funnel-visualizer.html', 'monthly', '0.6', '2026-05-20'],
  ['tools/marketing-os.html', 'monthly', '0.7', '2026-05-24'],
  ['tools/link-video-automation-pack.html', 'monthly', '0.7', '2026-08-29'],
  ['insights/saas-crm-lectii.html', 'monthly', '0.7', '2026-05-23'],
  ['insights/single-file-la-vite-react.html', 'monthly', '0.7', '2026-05-23'],
  ['insights/flow-builder-vs-kanban.html', 'monthly', '0.7', '2026-05-23'],
  ['insights/ce-as-documenta.html', 'monthly', '0.6', '2026-05-23'],
  ['project-health.html', 'monthly', '0.8', '2026-09-06'],
  ['proof-registry.html', 'monthly', '0.7', '2026-09-06'],
  ['game-audits.html', 'monthly', '0.7', '2026-09-06'],
  ['release-timeline.html', 'monthly', '0.7', '2026-09-06'],
  ['lead-magnet-landing.html', 'monthly', '0.7', '2026-09-06'],
  ['accessibility-scorecard.html', 'monthly', '0.7', '2026-09-06'],
  ['en/project-health.html', 'monthly', '0.7', '2026-09-06'],
  ['en/proof-registry.html', 'monthly', '0.7', '2026-09-06'],
  ['en/game-audits.html', 'monthly', '0.7', '2026-09-06'],
  ['en/release-timeline.html', 'monthly', '0.7', '2026-09-06'],
  ['evolution-lab.html', 'monthly', '0.9', '2026-09-09'],
  ['design-system.html', 'monthly', '0.8', '2026-09-09'],
  ['portfolio-summary.html', 'monthly', '0.9', '2026-09-09']
];

const pairs = new Map([
  ['portfolio.html', ['portfolio.html', 'en/']], ['en/', ['portfolio.html', 'en/']],
  ['project-health.html', ['project-health.html', 'en/project-health.html']], ['en/project-health.html', ['project-health.html', 'en/project-health.html']],
  ['proof-registry.html', ['proof-registry.html', 'en/proof-registry.html']], ['en/proof-registry.html', ['proof-registry.html', 'en/proof-registry.html']],
  ['game-audits.html', ['game-audits.html', 'en/game-audits.html']], ['en/game-audits.html', ['game-audits.html', 'en/game-audits.html']],
  ['release-timeline.html', ['release-timeline.html', 'en/release-timeline.html']], ['en/release-timeline.html', ['release-timeline.html', 'en/release-timeline.html']]
]);

const missing = pages
  .map(([path]) => path)
  .filter(path => path && !existsSync(decodeURIComponent(path) + (path.endsWith('/') ? 'index.html' : '')));

if (missing.length) {
  console.error(`Sitemap aborted. Missing files:\n${missing.join('\n')}`);
  process.exit(1);
}

const entries = pages.map(([path, changefreq, priority, lastModified]) => {
  const url = `${origin}/${path}`;
  const pair = pairs.get(path);
  const alternates = pair
    ? `\n    <xhtml:link rel="alternate" hreflang="ro" href="${origin}/${pair[0]}" />\n    <xhtml:link rel="alternate" hreflang="en" href="${origin}/${pair[1]}" />\n    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/${pair[0]}" />`
    : '';
  return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastModified}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>${alternates}\n  </url>`;
}).join('\n\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries}\n</urlset>\n`;
writeFileSync('sitemap.xml', xml);
console.log(`Generated sitemap.xml with ${pages.length} canonical URLs.`);
