// projects.json is the source of truth; generated HTML remains usable without JS.
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
const arcadeIndex = process.argv.indexOf('--arcade');
const arcade = arcadeIndex >= 0 ? resolve(process.argv[arcadeIndex + 1]) : null;
const slugs = ['kygo-arhipelagul', 'baseline-voyage', 'genoboard-evo-rush'];
const projects = JSON.parse(await readFile(resolve(root, 'projects.json'), 'utf8'));
const publications = slugs.map(slug => {
  const matches = projects.filter(p => p.slug === slug);
  if (matches.length !== 1) throw new Error(`Expected one project: ${slug}`);
  const { version, url, title, description, completed } = matches[0];
  if (!version || !title?.ro || !title?.en || !description?.en || !completed || new URL(url).protocol !== 'https:') throw new Error(`Incomplete publication: ${slug}`);
  return { slug, version, url, title, description, completed };
});
if (new Set(publications.map(p => p.url)).size !== publications.length) throw new Error('Duplicate publication destination');
const escape = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
async function output(path, content) {
  const old = await readFile(path, 'utf8').catch(e => { if (e.code === 'ENOENT') return ''; throw e; });
  if (old === content) return;
  if (check) throw new Error(`Stale generated publication: ${path}`);
  await writeFile(path, content);
}
let en = await readFile(resolve(root, 'en/index.html'), 'utf8');
const geno = publications.find(p => p.slug === 'genoboard-evo-rush');
const card = `<article class="card" data-completed="${geno.completed}"><h3>${escape(geno.title.en)} v${geno.version} — completed</h3><p>${escape(geno.description.en)}</p><div class="links"><a href="../${geno.slug}/?lang=en">Play GENOBOARD</a></div></article>`;
const start = '<!-- publication:genoboard-evo-rush -->';
const end = '<!-- /publication:genoboard-evo-rush -->';
const block = `${start}${card}${end}`;
if (en.includes(start)) en = en.replace(/<!-- publication:genoboard-evo-rush -->[\s\S]*?<!-- \/publication:genoboard-evo-rush -->/, block);
else {
  const marker = '<section class="wrap" id="recent-completed">';
  const pos = en.indexOf(marker);
  const grid = en.indexOf('<div class="grid">', pos);
  if (pos < 0 || grid < 0) throw new Error('Completed projects grid not found');
  const older = [...en.slice(grid).matchAll(/<article\b[^>]*data-completed="([^"]+)"[^>]*>/g)].find(m => m[1] < geno.completed);
  const at = older ? grid + older.index : grid + '<div class="grid">'.length;
  en = en.slice(0, at) + block + en.slice(at);
}
// Keep the existing detailed descriptions and secondary links; sync identity only.
for (const p of publications) {
  const cards = [...en.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].filter(m => m[0].includes(`../${p.slug}/`));
  if (cards.length !== 1) throw new Error(`Expected one EN card: ${p.slug}`);
  const original = cards[0][0];
  const updated = original.replace(/<h3>[\s\S]*?<\/h3>/, `<h3>${escape(p.title.en)} v${p.version} — completed</h3>`)
    .replace(/href="[^"]*"/, `href="../${p.slug}/?lang=en"`);
  en = en.replace(original, updated);
}
await output(resolve(root, 'en/index.html'), en);
const manifest = JSON.stringify({ schemaVersion: 1, source: 'projects.json', publications }, null, 2) + '\n';
await output(resolve(root, 'publication-manifest.json'), manifest);
if (arcade) {
  await output(resolve(arcade, 'portfolio-publications.json'), manifest);
  const p = publications.find(p => p.slug === 'kygo-arhipelagul');
  const title = `${p.title.ro} / ${p.title.en} · v${p.version}`;
  const card = `<!-- publication:kygo-arhipelagul -->
              <!-- prettier-ignore -->
              <section class="sky-arcade-card" data-mini-game-id="kygo-arhipelagul" aria-labelledby="archipelagoArcadeTitle">
                <strong id="archipelagoArcadeTitle">${escape(title)}</strong>
                <p>12 insule, 180 de stele, mod fără eșec, RO/EN, contrast ridicat și mișcare redusă. / 12 islands, 180 stars, no-fail mode, RO/EN, high contrast and reduced motion.</p>
                <div class="sky-arcade-actions">
                  <button type="button" onclick="openArcadeExperience('archipelago')">▶ Joacă aici / Play here</button>
                  <a href="${escape(p.url)}" target="_blank" rel="noopener noreferrer">↗ Tab separat / New tab</a>
                </div>
              </section>
              <!-- /publication:kygo-arhipelagul -->`;
  let html = await readFile(resolve(arcade, 'index.html'), 'utf8');
  if (html.includes('<!-- publication:kygo-arhipelagul -->')) html = html.replace(/<!-- publication:kygo-arhipelagul -->[\s\S]*?<!-- \/publication:kygo-arhipelagul -->/, card);
  else {
    const match = /<section\s+class="sky-arcade-card"\s+data-mini-game-id="kygo-world"/.exec(html);
    if (!match) throw new Error('Arcade insertion point missing');
    html = html.slice(0, match.index) + card + '\n              ' + html.slice(match.index);
  }
  const registry = `/* publication:kygo-arhipelagul */\n        /* prettier-ignore */\n        archipelago: ${JSON.stringify({ url: p.url, title })},\n        /* /publication:kygo-arhipelagul */`;
  if (html.includes('/* publication:kygo-arhipelagul */')) html = html.replace(/\/\* publication:kygo-arhipelagul \*\/[\s\S]*?\/\* \/publication:kygo-arhipelagul \*\//, registry);
  else html = html.replace('const ARCADE_EXPERIENCES = {', `const ARCADE_EXPERIENCES = {\n        ${registry}`);
  if (!html.includes(registry)) throw new Error('Arcade registry missing');
  await output(resolve(arcade, 'index.html'), html);
}
console.log(`Publication ${check ? 'check' : 'sync'} passed (${publications.length} projects${arcade ? ', including Arcade' : ''}).`);
