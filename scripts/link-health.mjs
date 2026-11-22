import { existsSync, readFileSync } from 'node:fs';

const files = [
  'index.html', 'portfolio.html', 'en/index.html', 'project-health.html',
  'proof-registry.html', 'game-audits.html', 'release-timeline.html',
  'accessibility-scorecard.html', 'en/project-health.html',
  'en/proof-registry.html', 'en/game-audits.html', 'en/release-timeline.html',
  'evolution-lab.html', 'design-system.html', 'portfolio-summary.html',
  'growth-suite.html', 'en/growth-suite.html', 'case-study-story.html',
  'guided-tour.html', 'recruiter-kit.html', 'ecosystem-map.html',
  'proof-dashboard.html', 'what-i-learned.html', 'before-after.html',
  'demo-scenarios.html', 'accessibility-lab.html', 'build-in-public.html',
  'legacy-projects.html', 'basket-vs-ai.html',
  'projects/basket-vs-ai.html',
  'projects/basket-vs-ai-pro.html',
  'projects/void-hunter.html',
  'projects/pvai-new-game-plus.html',
  'projects/home-air-hockey.html',
  'projects/bomberman-neo.html',
  'projects/breakout.html',
  'projects/flappy-ball.html',
  'projects/bounce-ball.html',
  'projects/labirint.html',
  'projects/arcade-fusion-mobile.html',
  'projects/arcade-fusion.html',
  'projects/arcade-fusion-3.html',
  'projects/particle-memory.html'
];
const failures = [];
const warnings = [];
const remote = new Set();

for (const project of JSON.parse(readFileSync('projects.json', 'utf8'))) {
  const label = 'projects.json #' + project.id;
  let url;
  try { url = new URL(project.url); }
  catch { failures.push(label + ': invalid URL'); continue; }
  if (url.protocol !== 'https:') {
    failures.push(label + ': insecure destination → ' + project.url);
    continue;
  }
  if (/(^|\.)codepen\.dev$/i.test(url.hostname) &&
      (project.category === 'game' || project.tags?.some(tag => /^game$/i.test(tag)))) {
    failures.push(label + ': unstable game preview → ' + project.url);
    continue;
  }
  const prefix = '/codepen-portfolio/';
  if (url.hostname === 'laurandreea10.github.io' && url.pathname.startsWith(prefix)) {
    const path = decodeURIComponent(url.pathname.slice(prefix.length));
    const target = !path || path.endsWith('/') ? path + 'index.html' : path;
    if (!existsSync(target)) failures.push(label + ': missing local destination → ' + project.url);
    else if (project.status === 'archived' && (target !== 'legacy-projects.html' ||
      url.hash !== '#project-' + project.id ||
      !readFileSync(target, 'utf8').includes('id="project-' + project.id + '"'))) {
      failures.push(label + ': missing archive entry → ' + project.url);
    }
  } else {
    url.hash = '';
    remote.add(url.href);
  }
}

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  for (const [, href] of html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)) {
    if (/^(mailto:|tel:|#)/i.test(href)) continue;
    if (/^https?:/i.test(href)) {
      if (/codepen\.dev/i.test(href)) failures.push(`${file}: unstable CodePen preview → ${href}`);
      else {
        const parsed = new URL(href);
        const prefix = '/codepen-portfolio/';
        if (parsed.hostname === 'laurandreea10.github.io' && parsed.pathname.startsWith(prefix)) {
          const localPath = decodeURIComponent(parsed.pathname.slice(prefix.length));
          const target = localPath.endsWith('/') ? `${localPath}index.html` : localPath;
          if (target && !existsSync(target)) failures.push(`${file}: broken canonical link → ${href}`);
        } else {
          remote.add(href.split('#')[0]);
        }
      }
      continue;
    }
    const base = file.includes('/') ? file.slice(0, file.lastIndexOf('/') + 1) : '';
    const normalized = new URL(href.split('#')[0].split('?')[0], `file:///${base}`).pathname.slice(1);
    const target = decodeURIComponent(normalized.endsWith('/') ? `${normalized}index.html` : normalized);
    if (target && !existsSync(target)) failures.push(`${file}: broken local link → ${href}`);
  }
}

await Promise.all([...remote].map(async url => {
  const critical = new URL(url).hostname === 'laurandreea10.github.io';
  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(15000) });
    if (![200, 204, 206, 301, 302, 403, 405, 429].includes(response.status)) (critical ? failures : warnings).push(`${response.status}: ${url}`);
  } catch (error) {
    (critical ? failures : warnings).push(`request failed: ${url} (${error.message})`);
  }
}));

if (warnings.length) console.warn(`External link warnings (${warnings.length}):\n- ${warnings.join('\n- ')}`);

if (failures.length) {
  console.error(`Link health failed (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`Link health passed: ${files.length} pages, ${remote.size} remote destinations.`);
