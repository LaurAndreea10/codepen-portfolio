import { existsSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const origin = 'https://laurandreea10.github.io/codepen-portfolio';
const pages = [
  ['portfolio.html', 'weekly', '1.0'],
  ['en/', 'weekly', '0.9'],
  ['alpis-fusion-crm.html', 'monthly', '0.9'],
  ['projects/clientflow.html', 'monthly', '0.9'],
  ['projects/alpis-impactpath.html', 'monthly', '0.9'],
  ['projects/clientops-suite-premium.html', 'monthly', '0.9'],
  ['projects/pulseboard.html', 'monthly', '0.8'],
  ['projects/excel-quest.html', 'monthly', '0.8'],
  ['process.html', 'monthly', '0.8'],
  ['work-with-me.html', 'monthly', '0.8'],
  ['insights.html', 'weekly', '0.8'],
  ['changelog.html', 'weekly', '0.7'],
  ['uses.html', 'monthly', '0.6'],
  ['campaignpilot.html', 'monthly', '0.7'],
  ['Campaign%20ROI%20Calculator.html', 'monthly', '0.7'],
  ['utm-builder.html', 'monthly', '0.6'],
  ['ab-test-simulator.html', 'monthly', '0.6'],
  ['email-subject-line-tester.html', 'monthly', '0.6'],
  ['conversion-funnel-visualizer.html', 'monthly', '0.6'],
  ['tools/marketing-os.html', 'monthly', '0.7'],
  ['tools/link-video-automation-pack.html', 'monthly', '0.7'],
  ['insights/saas-crm-lectii.html', 'monthly', '0.7'],
  ['insights/single-file-la-vite-react.html', 'monthly', '0.7'],
  ['insights/flow-builder-vs-kanban.html', 'monthly', '0.7'],
  ['insights/ce-as-documenta.html', 'monthly', '0.6'],
  ['project-health.html', 'monthly', '0.8'],
  ['proof-registry.html', 'monthly', '0.7'],
  ['game-audits.html', 'monthly', '0.7'],
  ['release-timeline.html', 'monthly', '0.7'],
  ['lead-magnet-landing.html', 'monthly', '0.7'],
  ['accessibility-scorecard.html', 'monthly', '0.7'],
  ['en/project-health.html', 'monthly', '0.7'],
  ['en/proof-registry.html', 'monthly', '0.7'],
  ['en/game-audits.html', 'monthly', '0.7'],
  ['en/release-timeline.html', 'monthly', '0.7']
];

const pairs = new Map([
  ['portfolio.html', ['portfolio.html', 'en/']], ['en/', ['portfolio.html', 'en/']],
  ['project-health.html', ['project-health.html', 'en/project-health.html']], ['en/project-health.html', ['project-health.html', 'en/project-health.html']],
  ['proof-registry.html', ['proof-registry.html', 'en/proof-registry.html']], ['en/proof-registry.html', ['proof-registry.html', 'en/proof-registry.html']],
  ['game-audits.html', ['game-audits.html', 'en/game-audits.html']], ['en/game-audits.html', ['game-audits.html', 'en/game-audits.html']],
  ['release-timeline.html', ['release-timeline.html', 'en/release-timeline.html']], ['en/release-timeline.html', ['release-timeline.html', 'en/release-timeline.html']]
]);

const fileFor = path => decodeURIComponent(path.endsWith('/') ? `${path}index.html` : path);
const lastModified = path => execFileSync('git', ['log', '-1', '--format=%cs', '--', fileFor(path)], { encoding: 'utf8' }).trim();

const missing = pages
  .map(([path]) => path)
  .filter(path => path && !existsSync(decodeURIComponent(path) + (path.endsWith('/') ? 'index.html' : '')));

if (missing.length) {
  console.error(`Sitemap aborted. Missing files:\n${missing.join('\n')}`);
  process.exit(1);
}

const entries = pages.map(([path, changefreq, priority]) => {
  const url = `${origin}/${path}`;
  const pair = pairs.get(path);
  const alternates = pair
    ? `\n    <xhtml:link rel="alternate" hreflang="ro" href="${origin}/${pair[0]}" />\n    <xhtml:link rel="alternate" hreflang="en" href="${origin}/${pair[1]}" />\n    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/${pair[0]}" />`
    : '';
  return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastModified(path)}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>${alternates}\n  </url>`;
}).join('\n\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries}\n</urlset>\n`;
writeFileSync('sitemap.xml', xml);
console.log(`Generated sitemap.xml with ${pages.length} canonical URLs.`);
