import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
const config = JSON.parse(readFileSync('.lighthouserc.json', 'utf8'));
config.ci.collect.url = config.ci.collect.url.map(url => url.replace('http://127.0.0.1:8765/codepen-portfolio/', 'https://laurandreea10.github.io/codepen-portfolio/'));
delete config.ci.collect.startServerCommand;
delete config.ci.collect.startServerReadyPattern;
mkdirSync('audit-artifacts', { recursive: true });
writeFileSync('audit-artifacts/lighthouse-live.json', JSON.stringify(config, null, 2) + '\n');
console.log(`Prepared the same mobile budgets for ${config.ci.collect.url.length} live URLs.`);
