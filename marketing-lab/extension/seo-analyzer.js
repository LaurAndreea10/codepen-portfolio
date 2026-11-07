/* ===== Shared SEO analyzer — used by the in-app inspector (#12) and the Chrome extension ===== */
function seoAnalyze(doc, lang) {
  const L = (ro, en) => (lang === 'en' ? en : ro);
  const q = (s) => doc.querySelector(s);
  const qa = (s) => Array.from(doc.querySelectorAll(s));
  const meta = (n) => { const el = q(`meta[name="${n}"]`) || q(`meta[property="${n}"]`); return el ? (el.getAttribute('content') || '').trim() : ''; };
  const checks = [];
  const add = (group, level, msg) => checks.push({ group, level, msg });

  const title = (q('title') && q('title').textContent.trim()) || '';
  if (!title) add('Meta', 'err', L('Lipsește <title>', 'Missing <title>'));
  else if (title.length < 30 || title.length > 60) add('Meta', 'warn', L(`Titlu de ${title.length} caractere (ideal 30–60)`, `Title is ${title.length} chars (ideal 30–60)`));
  else add('Meta', 'pass', L(`Titlu: ${title.length} caractere`, `Title: ${title.length} chars`));

  const desc = meta('description');
  if (!desc) add('Meta', 'err', L('Lipsește meta description', 'Missing meta description'));
  else if (desc.length < 70 || desc.length > 160) add('Meta', 'warn', L(`Descriere de ${desc.length} caractere (ideal 70–160)`, `Description is ${desc.length} chars (ideal 70–160)`));
  else add('Meta', 'pass', L(`Descriere: ${desc.length} caractere`, `Description: ${desc.length} chars`));

  const canonical = q('link[rel="canonical"]');
  add('Meta', canonical ? 'pass' : 'warn', canonical ? 'Canonical: ' + canonical.getAttribute('href') : L('Lipsește link canonical', 'Missing canonical link'));
  const robots = meta('robots');
  if (/noindex/i.test(robots)) add('Meta', 'err', L('Pagina are noindex — nu va apărea în Google', 'Page is noindex — it will not appear in Google'));
  add('Meta', q('meta[name="viewport"]') ? 'pass' : 'err', q('meta[name="viewport"]') ? 'Viewport OK' : L('Lipsește meta viewport (mobil)', 'Missing meta viewport (mobile)'));
  const htmlLang = doc.documentElement.getAttribute('lang');
  add('Meta', htmlLang ? 'pass' : 'warn', htmlLang ? `lang="${htmlLang}"` : L('Lipsește atributul lang pe <html>', 'Missing lang attribute on <html>'));

  const h1 = qa('h1');
  add(L('Structură', 'Structure'), h1.length === 1 ? 'pass' : h1.length ? 'warn' : 'err', L(`${h1.length} × H1 (ideal: exact unul)`, `${h1.length} × H1 (ideal: exactly one)`));
  const heads = qa('h1,h2,h3,h4,h5,h6').map(h => +h.tagName[1]);
  let skips = 0; for (let i = 1; i < heads.length; i++) if (heads[i] - heads[i - 1] > 1) skips++;
  add(L('Structură', 'Structure'), skips ? 'warn' : 'pass', skips ? L(`${skips} salturi în ierarhia titlurilor (ex. H2 → H4)`, `${skips} heading-level skips (e.g. H2 → H4)`) : L('Ierarhia titlurilor e corectă', 'Heading hierarchy is correct'));
  const imgs = qa('img'); const noAlt = imgs.filter(i => !i.hasAttribute('alt'));
  add(L('Structură', 'Structure'), noAlt.length ? 'err' : 'pass', L(`${imgs.length} imagini, ${noAlt.length} fără alt`, `${imgs.length} images, ${noAlt.length} without alt`));
  const links = qa('a[href]'); const empty = links.filter(a => !(a.textContent.trim() || a.getAttribute('aria-label') || a.querySelector('img[alt]')));
  add(L('Structură', 'Structure'), empty.length ? 'warn' : 'pass', L(`${links.length} linkuri, ${empty.length} fără text`, `${links.length} links, ${empty.length} without text`));

  const og = { title: meta('og:title'), description: meta('og:description'), image: meta('og:image'), url: meta('og:url'), type: meta('og:type') };
  const ogMissing = Object.entries(og).filter(([, v]) => !v).map(([k]) => 'og:' + k);
  add('Social', ogMissing.length ? (ogMissing.length > 2 ? 'err' : 'warn') : 'pass', ogMissing.length ? L('Lipsesc: ', 'Missing: ') + ogMissing.join(', ') : 'Open Graph ' + L('complet', 'complete'));
  const tw = meta('twitter:card');
  add('Social', tw ? 'pass' : 'warn', tw ? 'twitter:card = ' + tw : L('Lipsește twitter:card', 'Missing twitter:card'));

  const ld = qa('script[type="application/ld+json"]'); let ldTypes = [];
  ld.forEach(s => { try { const j = JSON.parse(s.textContent); (Array.isArray(j) ? j : [j]).forEach(x => x['@type'] && ldTypes.push(x['@type'])); } catch (e) { add(L('Date structurate', 'Structured data'), 'err', L('JSON-LD invalid', 'Invalid JSON-LD')); } });
  add(L('Date structurate', 'Structured data'), ld.length ? 'pass' : 'warn', ld.length ? 'Schema.org: ' + ldTypes.join(', ') : L('Fără JSON-LD (Schema.org)', 'No JSON-LD (Schema.org)'));

  const words = (doc.body ? doc.body.textContent : '').trim().split(/\s+/).filter(Boolean).length;
  add(L('Conținut', 'Content'), words > 300 ? 'pass' : 'warn', L(`${words} cuvinte`, `${words} words`));

  const score = Math.round(checks.reduce((s, c) => s + (c.level === 'pass' ? 1 : c.level === 'warn' ? 0.5 : 0), 0) / checks.length * 100);
  return { title, desc, og, url: (canonical && canonical.getAttribute('href')) || og.url || '', checks, score };
}
if (typeof module !== 'undefined') module.exports = { seoAnalyze };
