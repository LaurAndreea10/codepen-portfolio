import { readFileSync } from 'node:fs';

export function projectInventory() {
  const catalogue = JSON.parse(readFileSync('projects.json', 'utf8'));
  const supplemental = JSON.parse(readFileSync('data/project-inventory.json', 'utf8'));
  const normalize = value => {
    const url = new URL(value);
    url.search = ''; url.hash = '';
    url.pathname = url.pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
    return url.href;
  };
  const aliases = new Map(Object.entries(supplemental.aliases).map(([from, to]) => [normalize(from), normalize(to)]));
  const projects = new Map();
  for (const project of [...catalogue.map(p => ({ name: p.title.en, url: p.url })), ...supplemental.additionalProjects]) {
    if (!project.name?.trim()) throw new Error('Inventory project needs a name');
    let canonical = normalize(project.url);
    canonical = aliases.get(canonical) || canonical;
    if (!projects.has(canonical)) projects.set(canonical, { ...project, url: canonical });
  }
  return { updated: supplemental.updated, projects: [...projects.values()] };
}
