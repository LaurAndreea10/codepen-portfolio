import { existsSync, writeFileSync } from 'node:fs';

const origin = 'https://laurandreea10.github.io/codepen-portfolio';
const today = new Date().toISOString().slice(0, 10);

const pages = [
  ['', 'weekly', '1.0'],
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
  ['insights/ce-as-documenta.html', 'monthly', '0.6']
];

const missing = pages
  .map(([path]) => path)
  .filter(path => path && !existsSync(decodeURIComponent(path) + (path.endsWith('/') ? 'index.html' : '')));

if (missing.length) {
  console.error(`Sitemap aborted. Missing files:\n${missing.join('\n')}`);
  process.exit(1);
}

const entries = pages.map(([path, changefreq, priority]) => {
  const url = `${origin}/${path}`;
  const alternates = path === ''
    ? `\n    <xhtml:link rel="alternate" hreflang="ro" href="${origin}/" />\n    <xhtml:link rel="alternate" hreflang="en" href="${origin}/en/" />\n    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/" />`
    : path === 'en/'
      ? `\n    <xhtml:link rel="alternate" hreflang="ro" href="${origin}/" />\n    <xhtml:link rel="alternate" hreflang="en" href="${origin}/en/" />\n    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/" />`
      : '';
  return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>${alternates}\n  </url>`;
}).join('\n\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries}\n</urlset>\n`;
writeFileSync('sitemap.xml', xml);
console.log(`Generated sitemap.xml with ${pages.length} canonical URLs (${today}).`);
