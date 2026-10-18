import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { projectInventory } from './project-inventory.mjs';

const cwd = process.cwd(), fixture = mkdtempSync(join(tmpdir(), 'project-inventory-'));
try {
  process.chdir(fixture); mkdirSync('data');
  writeFileSync('projects.json', JSON.stringify([
    { title: { en: 'A' }, url: 'https://example.test/a/?lang=ro#top' },
    { title: { en: 'A translated' }, url: 'https://example.test/a/index.html?lang=en' },
    { title: { en: 'B prototype' }, url: 'https://example.test/b-prototype/' }
  ]));
  writeFileSync('data/project-inventory.json', JSON.stringify({ updated: '2026-10-18', aliases: { 'https://alternate.test/': 'https://example.test/a/' }, additionalProjects: [
    { name: 'A alternate host', url: 'https://alternate.test/' },
    { name: 'B product edition', url: 'https://example.test/b/' }
  ] }));
  const inventory = projectInventory();
  assert.equal(inventory.projects.length, 3, 'translations, fragments and aliases must not inflate the count; distinct product editions remain separate');
  assert.equal(inventory.updated, '2026-10-18');
  assert.equal(new Set(inventory.projects.map(p => p.url)).size, 3);
  console.log('PASS project inventory: duplicate URL, translated query, fragment, index alias, alternate host and distinct product edition.');
} finally { process.chdir(cwd); rmSync(fixture, { recursive: true, force: true }); }
