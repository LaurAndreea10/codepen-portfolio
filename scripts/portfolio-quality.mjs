import { existsSync, readFileSync } from "node:fs";

const evidence = JSON.parse(readFileSync("data/portfolio-evidence.json", "utf8"));
const configSource = readFileSync("portfolio-config.js", "utf8");
const ro = readFileSync("portfolio.html", "utf8");
const en = readFileSync("en/index.html", "utf8");
const sitemap = readFileSync("sitemap.xml", "utf8");
const failures = [];

const countMatch = configSource.match(/projectCount:\s*(\d+)/);
if (!countMatch) failures.push("portfolio-config.js: missing projectCount");
const canonicalCount = countMatch ? Number(countMatch[1]) : NaN;

for (const project of [...evidence.featured, ...evidence.recent]) {
  if (!ro.includes(project.name)) failures.push(`RO missing project: ${project.name}`);
  if (project.caseStudy && !existsSync(project.caseStudy)) failures.push(`Missing case study: ${project.caseStudy}`);
}

for (const project of evidence.recent) {
  if (!en.includes(project.name)) failures.push(`EN missing recent project: ${project.name}`);
}

for (const [file, html, configPath] of [
  ["portfolio.html", ro, "portfolio-config.js"],
  ["en/index.html", en, "../portfolio-config.js"]
]) {
  if (!html.includes(`src="${configPath}"`) && !html.includes(`src='${configPath}'`)) {
    failures.push(`${file}: shared portfolio config is not loaded`);
  }
  const canonicalMetric = new RegExp(`\\b${canonicalCount}\\b`);
  if (!canonicalMetric.test(html)) {
    failures.push(`${file}: public metric differs from canonical ${canonicalCount}`);
  }
}

for (const page of ["portfolio.html", "en/", "proof-pack.html", "mobile-test-lab.html", "skydreams-portal/", "kygo-world/"]) {
  if (!sitemap.includes(`/codepen-portfolio/${page}`)) failures.push(`Sitemap missing: ${page}`);
}

for (const [file, html] of [["portfolio.html", ro], ["en/index.html", en]]) {
  const checks = [
    ["skip link", /class=["'][^"']*skip[^"']*["'][^>]+href=["']#/i],
    ["main landmark", /<main[^>]+id=["'][^"']+["']/i],
    ["focus styles", /:focus-visible/i],
    ["reduced motion", /prefers-reduced-motion/i],
    ["theme control", /theme/i],
    ["contrast control", /contrast/i],
    ["canonical", /rel=["']canonical["']/i],
    ["RO alternate", /hreflang=["']ro["']/i],
    ["EN alternate", /hreflang=["']en["']/i],
    ["Open Graph", /property=["']og:title["']/i],
    ["Twitter metadata", /name=["']twitter:(?:title|description)["']/i]
  ];
  for (const [label, pattern] of checks) if (!pattern.test(html)) failures.push(`${file}: missing ${label}`);
}

for (const project of evidence.recent.filter((item) => item.localPath)) {
  if (!existsSync(project.localPath)) {
    failures.push(`Missing local audit target: ${project.localPath}`);
    continue;
  }
  const html = readFileSync(project.localPath, "utf8");
  const checks = [
    ["viewport", /name=["']viewport["']/i],
    ["canonical", /rel=["']canonical["']/i],
    ["Open Graph", /property=["']og:title["']/i],
    ["Twitter Card", /name=["']twitter:card["']/i],
    ["structured data", /application\/ld\+json/i],
    ["focus-visible", /:focus-visible/i],
    ["reduced motion", /prefers-reduced-motion/i],
    ["theme", /theme/i],
    ["high contrast", /contrast/i]
  ];
  for (const [label, pattern] of checks) if (!pattern.test(html)) failures.push(`${project.localPath}: missing ${label}`);
}

if (failures.length) {
  console.error(`Portfolio quality audit failed (${failures.length}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`Portfolio quality audit passed: canonical metric ${canonicalCount}, ${evidence.featured.length} featured + ${evidence.recent.length} recent projects, RO/EN parity, SEO and accessibility hooks.`);
