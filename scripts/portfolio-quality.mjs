import { existsSync, readFileSync } from "node:fs";

const evidence = JSON.parse(readFileSync("data/portfolio-evidence.json", "utf8"));
const ro = readFileSync("portfolio.html", "utf8");
const en = readFileSync("en/index.html", "utf8");
const sitemap = readFileSync("sitemap.xml", "utf8");
const failures = [];

for (const project of [...evidence.featured, ...evidence.recent]) {
  if (!ro.includes(project.name)) failures.push(`RO missing project: ${project.name}`);
  if (project.caseStudy && !existsSync(project.caseStudy)) failures.push(`Missing case study: ${project.caseStudy}`);
}

for (const project of evidence.recent) {
  if (!en.includes(project.name)) failures.push(`EN missing recent project: ${project.name}`);
}

for (const page of ["portfolio.html", "en/", "proof-pack.html", "mobile-test-lab.html"]) {
  if (!sitemap.includes(`/codepen-portfolio/${page}`)) failures.push(`Sitemap missing: ${page}`);
}

for (const [file, html] of [["portfolio.html", ro], ["en/index.html", en]]) {
  const checks = [
    ["skip link", /class=["'][^"']*skip[^"']*["'][^>]+href=["']#/i],
    ["main landmark", /<main[^>]+id=["'][^"']+["']/i],
    ["focus styles", /:focus-visible/i],
    ["reduced motion", /prefers-reduced-motion/i],
    ["theme control", /theme/i],
    ["contrast control", /contrast/i]
  ];
  for (const [label, pattern] of checks) if (!pattern.test(html)) failures.push(`${file}: missing ${label}`);
}

if (failures.length) {
  console.error(`Portfolio quality audit failed (${failures.length}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`Portfolio quality audit passed: ${evidence.featured.length} featured + ${evidence.recent.length} recent projects, RO/EN parity and accessibility hooks.`);
