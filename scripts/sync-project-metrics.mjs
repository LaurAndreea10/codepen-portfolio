import { readFileSync, writeFileSync } from 'node:fs';
import { projectInventory } from './project-inventory.mjs';

const inventory = projectInventory();
const count = inventory.projects.length;
const version = `${inventory.updated.replaceAll('-', '')}-inventory-${count}`;
const check = process.argv.includes('--check');
const stale = [];
function sync(file, transform) {
  const before = readFileSync(file, 'utf8');
  const after = transform(before);
  if (before !== after) {
    if (check) stale.push(file);
    else writeFileSync(file, after);
  }
}
sync('portfolio-config.js', s => s.replace(/projectCount:\s*\d+/, `projectCount: ${count}`).replace(/updated:\s*"[\d-]+"/, `updated: "${inventory.updated}"`));
for (const file of ['main.js', 'main-core.js']) {
  sync(file, s => s.replace(/projectCount\s*\?\?\s*\d+/, `projectCount ?? ${count}`).replace(/main-core\.js\?v=[\w-]+/g, `main-core.js?v=${version}`));
}
for (const file of ['portfolio.html', 'en/index.html', 'index.html']) {
  sync(file, s => s.replace(/\b(?:[6-9]\d|\d{3,})(?=\s+(?:de\s+)?(?:proiecte|projects|live projects|public projects)\b)/gi, String(count))
    .replace(/(<strong>)(?:[6-9]\d|\d{3,})(<\/strong>\s*<(?:span|p)>\s*(?:live projects|proiecte live))/g, `$1${count}$2`)
    .replace(/(id=["']scan-proj-count["'][^>]*>)\d+/, `$1${count}`)
    .replace(/(data-target=["'])\d+(["'][^>]*data-label=["'](?:proiecte|projects))/gi, `$1${count}$2`)
    .replace(/(portfolio-config\.js\?v=)[\w-]+/g, (_, prefix) => prefix + version));
}
if (stale.length) {
  console.error(`Project metrics are stale: ${stale.join(', ')}. Run node scripts/sync-project-metrics.mjs`);
  process.exit(1);
}
console.log(`${check ? 'Verified' : 'Synchronized'} ${count} distinct live builds from the project inventory.`);
