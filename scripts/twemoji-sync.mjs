#!/usr/bin/env node
// Copiază în curious-garden/emoji/ imaginile Twemoji pentru toate emoji-urile folosite în joc.
// Rulează după ce adaugi emoji noi:
//   npm pack @twemoji/svg@15.0.0 && tar xzf twemoji-svg-15.0.0.tgz
//   node scripts/twemoji-sync.mjs ./package
import { readFileSync, readdirSync, existsSync, copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
const src = process.argv[2];
if (!src || !existsSync(src)) { console.error('Dă calea spre folderul cu SVG-urile Twemoji (package/ din @twemoji/svg).'); process.exit(1); }
const ROOT = join(import.meta.dirname, '..', 'curious-garden'), OUT = join(ROOT, 'emoji');
const RE = /(?:[#*0-9]\u{FE0F}?\u{20E3}|[\u{1F1E6}-\u{1F1FF}]{2}|\p{Extended_Pictographic}[\u{FE0F}\u{1F3FB}-\u{1F3FF}]?(?:\u{200D}\p{Extended_Pictographic}[\u{FE0F}\u{1F3FB}-\u{1F3FF}]?)*)/gu;
const code = e => { const c = [...e].map(x => x.codePointAt(0).toString(16)); return (c.includes('200d') ? c : c.filter(x => x !== 'fe0f')).join('-'); };
mkdirSync(OUT, { recursive: true });
const set = new Set();
for (const f of readdirSync(ROOT).filter(f => /\.(js|html)$/.test(f) && !/^(diploma|aproba|feedback|case-study|traduceri)/.test(f)))
  for (const m of readFileSync(join(ROOT, f), 'utf8').matchAll(RE)) set.add(code(m[0]));
let copied = 0; const missing = [];
for (const c of set) { const from = join(src, c + '.svg'); if (existsSync(from)) { copyFileSync(from, join(OUT, c + '.svg')); copied++; } else missing.push(c); }
console.log(`Twemoji: ${copied} imagini în curious-garden/emoji/${missing.length ? `; lipsesc: ${missing.join(' ')}` : ''}`);
