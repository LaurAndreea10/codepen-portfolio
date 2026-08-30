import { readFileSync, existsSync, statSync } from 'node:fs';

const files = [
  'index.html', 'portfolio.html', 'en/index.html', 'alpis-fusion-crm.html',
  'projects/clientflow.html', 'projects/clientops-suite-premium.html',
  'tools/link-video-automation-pack.html'
];
const budget = JSON.parse(readFileSync('performance-budget.json', 'utf8'));
const failures = [];
const canonicals = new Map();

for (const file of files) {
  if (!existsSync(file)) { failures.push(`${file}: missing`); continue; }
  const html = readFileSync(file, 'utf8');
  const required = [
    ['title', /<title>[^<]{10,}<[\/]title>/i],
    ['description', /<meta[^>]+name=["']description["'][^>]+content=["'][^"']{40,}["']/i],
    ['canonical', /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i],
    ['robots', /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*index/i],
    ['h1', /<h1(?:\s|>)/i]
  ];
  for (const [name, pattern] of required) if (!pattern.test(html)) failures.push(`${file}: missing/weak ${name}`);
  const canonical = html.match(required[2][1])?.[1];
  if (canonical) {
    if (canonicals.has(canonical)) failures.push(`${file}: duplicate canonical also used by ${canonicals.get(canonical)}`);
    canonicals.set(canonical, file);
  }
  if (statSync(file).size > budget.budgets.htmlBytes) failures.push(`${file}: HTML exceeds ${budget.budgets.htmlBytes} bytes`);
  const jsonLd = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<[\/]script>/gi)];
  for (const [, json] of jsonLd) {
    try { JSON.parse(json); } catch { failures.push(`${file}: invalid JSON-LD`); }
  }
  for (const match of html.matchAll(/href=["']([^"'#?]+)["']/gi)) {
    const href = match[1];
    if (/^(https?:|mailto:|tel:)/i.test(href)) continue;
    const base = file.includes('/') ? file.slice(0, file.lastIndexOf('/') + 1) : '';
    const normalized = new URL(href, `file:///${base}`).pathname.slice(1);
    const target = normalized.endsWith('/') ? `${normalized}index.html` : normalized;
    if (target && !existsSync(decodeURIComponent(target))) failures.push(`${file}: broken internal link → ${href}`);
  }
}

if (failures.length) {
  console.error(`SEO audit failed (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`SEO audit passed for ${files.length} priority pages.`);
