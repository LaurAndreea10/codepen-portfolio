#!/usr/bin/env node
// Grădina Curioasă — traduceri maghiară (HU) și ucraineană (UK) cu DeepL, pornind de la textul în engleză.
//
//   node scripts/deepl-translate.mjs --mode=extract   listează textele găsite (fără DeepL, fără cheie)
//   node scripts/deepl-translate.mjs --mode=review    compară traducerile actuale cu DeepL → curious-garden/translations/deepl-review.json
//   node scripts/deepl-translate.mjs --mode=apply     scrie traducerile DeepL în fișierele jocului, cu excepția celor din keep.json
//
// Cheia se citește din variabila de mediu DEEPL_AUTH_KEY (secret în GitHub, niciodată în repo).
// Cheile gratuite (DeepL API Free) se termină în „:fx” și folosesc api-free.deepl.com.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..', 'curious-garden');
const OUT_DIR = join(ROOT, 'translations');
const args = Object.fromEntries(process.argv.slice(2).map(a => a.replace(/^--/, '').split('=')).map(([k, v]) => [k, v ?? true]));
const MODE = args.mode || 'extract';
const TARGETS = { hu: 'HU', uk: 'UK' };
const CONTEXT = 'Short interface text from an educational game for children aged 3 to 12. Address the child informally and keep it short, friendly and simple. Keep emoji and placeholders exactly as they are.';

// ——— Un parser mic pentru literalele JS (obiecte, liste, texte). Codul care nu e literal este sărit.
function skipWs(s, i) {
  for (;;) {
    while (i < s.length && /\s/.test(s[i])) i++;
    if (s.startsWith('//', i)) { while (i < s.length && s[i] !== '\n') i++; continue; }
    if (s.startsWith('/*', i)) { const e = s.indexOf('*/', i + 2); i = e < 0 ? s.length : e + 2; continue; }
    return i;
  }
}
function parseString(s, i) {
  const q = s[i]; let j = i + 1, text = '';
  while (j < s.length && s[j] !== q) {
    if (s[j] === '\\') { const n = s[j + 1]; text += n === 'n' ? '\n' : n === 't' ? '\t' : n; j += 2; continue; }
    if (s[j] === '\n') return null;
    text += s[j++];
  }
  return j < s.length ? { type: 'str', value: text, quote: q, start: i, end: j + 1 } : null;
}
function parseTemplate(s, i) {
  let j = i + 1; const parts = []; let cur = '';
  while (j < s.length && s[j] !== '`') {
    if (s[j] === '\\') { cur += s[j + 1]; j += 2; continue; }
    if (s[j] === '$' && s[j + 1] === '{') {
      let d = 1, k = j + 2;
      while (k < s.length && d) { if (s[k] === '{') d++; else if (s[k] === '}') d--; if (d) k++; }
      parts.push(cur, { expr: s.slice(j + 2, k) }); cur = ''; j = k + 1; continue;
    }
    cur += s[j++];
  }
  parts.push(cur);
  return j < s.length ? { type: 'tpl', parts, start: i, end: j + 1 } : null;
}
function skipRaw(s, i) {
  let d = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === "'" || c === '"') { const r = parseString(s, i); i = r ? r.end : i + 1; continue; }
    if (c === '`') { const r = parseTemplate(s, i); i = r ? r.end : i + 1; continue; }
    if ('([{'.includes(c)) d++;
    else if (')]}'.includes(c)) { if (!d) return i; d--; }
    else if (c === ',' && !d) return i;
    i++;
  }
  return i;
}
function parseValue(s, i, depth = 0) {
  i = skipWs(s, i); const c = s[i];
  if (c === "'" || c === '"') return parseString(s, i);
  if (c === '`') return parseTemplate(s, i);
  if (c === '{') return parseObject(s, i, depth);
  if (c === '[') return parseArray(s, i, depth);
  const e = skipRaw(s, i); return e > i ? { type: 'raw', start: i, end: e } : null;
}
function parseObject(s, i, depth) {
  if (depth > 12) return null;
  const obj = { type: 'obj', props: {}, start: i }; i++;
  for (;;) {
    i = skipWs(s, i);
    if (s[i] === '}') { obj.end = i + 1; return obj; }
    let key;
    if (s[i] === "'" || s[i] === '"') { const k = parseString(s, i); if (!k) return null; key = k.value; i = k.end; }
    else if (s[i] === '.' && s.startsWith('...', i)) { const v = parseValue(s, i + 3, depth + 1); if (!v) return null; i = v.end; key = null; }
    else { const m = /^[A-Za-z_$][\w$]*|^\d+/.exec(s.slice(i, i + 80)); if (!m) return null; key = m[0]; i += key.length; }
    if (key !== null) {
      i = skipWs(s, i);
      if (s[i] !== ':') return null;
      const v = parseValue(s, i + 1, depth + 1); if (!v) return null;
      obj.props[key] = v; i = v.end;
    }
    i = skipWs(s, i);
    if (s[i] === ',') { i++; continue; }
    if (s[i] === '}') { obj.end = i + 1; return obj; }
    return null;
  }
}
function parseArray(s, i, depth) {
  const arr = { type: 'arr', items: [], start: i }; i++;
  for (;;) {
    i = skipWs(s, i);
    if (s[i] === ']') { arr.end = i + 1; return arr; }
    const v = parseValue(s, i, depth + 1); if (!v) return null;
    arr.items.push(v); i = skipWs(s, v.end);
    if (s[i] === ',') { i++; continue; }
    if (s[i] === ']') { arr.end = i + 1; return arr; }
    return null;
  }
}

// ——— Textele de tradus
const isText = n => n && (n.type === 'str' || n.type === 'tpl');
const plain = n => n.type === 'str' ? n.value : n.parts.map(p => typeof p === 'string' ? p : '${' + p.expr + '}').join('');
const hasLetters = t => /\p{L}{2}/u.test(t);
function leaves(node, path = [], out = []) {
  if (isText(node)) out.push([path.join('.'), node]);
  else if (node?.type === 'obj') for (const [k, v] of Object.entries(node.props)) leaves(v, [...path, k], out);
  else if (node?.type === 'arr') node.items.forEach((v, i) => leaves(v, [...path, i], out));
  return out;
}
const files = readdirSync(ROOT).filter(f => /\.js$/.test(f) && !/^(sw|feedback-display)\.js$/.test(f)).concat('index.html');
const sources = Object.fromEntries(files.map(f => [f, readFileSync(join(ROOT, f), 'utf8')]));
const objects = [];
for (const [file, src] of Object.entries(sources)) {
  let covered = -1;
  for (let i = 0; i < src.length; i++) {
    if (i < covered || (src[i] !== '{' && src[i] !== '[')) continue;
    const node = src[i] === '{' ? parseObject(src, i, 0) : parseArray(src, i, 0);
    if (!node) continue;
    if (node.type === 'obj' && (node.props.hu || node.props.uk) && (node.props.en || node.props.ro)) { objects.push({ file, kind: 'dict', node }); covered = node.end; }
    else if (node.type === 'obj' && (node.props.hu || node.props.uk) && !node.props.en) { objects.push({ file, kind: 'external', node }); covered = node.end; }
    else if (node.type === 'obj' && node.props.en?.type === 'obj' && node.props.ro) { objects.push({ file, kind: 'endict', node }); covered = node.end; }
    else if (node.type === 'arr' && node.items.length === 4 && node.items.every(isText)) {
      const [ro, en, hu, uk] = node.items.map(plain);
      if (hasLetters(en) && /[Ѐ-ӿ]/.test(uk) && en !== hu) { objects.push({ file, kind: 'quad', node }); covered = node.end; }
    }
  }
}
// Pentru i18n.js (doar hu/uk), textul englez stă în modulul respectiv.
const EXTERNAL_FILES = { index: ['index.html'], home: ['home.js'], premiumStoryText: ['premium.js'], premiumEvents: ['premium.js'] };
function englishFor(moduleName, keys) {
  const cands = objects.filter(o => (o.kind === 'dict' || o.kind === 'endict') && o.node.props.en && (EXTERNAL_FILES[moduleName] || [moduleName + '.js']).includes(o.file));
  let best = null, score = 0;
  for (const c of cands) { const en = c.node.props.en; const n = keys.filter(k => en.props?.[k]).length; if (n > score) { best = en; score = n; } }
  return best;
}
const entries = [];
function add(file, lang, en, node, where) {
  if (!isText(en) || !isText(node)) return;
  const enText = plain(en), ours = plain(node);
  if (!hasLetters(enText)) return;
  entries.push({ id: `${file}|${lang}|${enText}`, file, lang, where, en: enText, ours, node });
}
for (const o of objects) {
  if (o.kind === 'quad') { const [, en, hu, uk] = o.node.items; add(o.file, 'hu', en, hu, 'quad'); add(o.file, 'uk', en, uk, 'quad'); continue; }
  if (o.kind === 'endict') continue;
  if (o.kind === 'dict') {
    const en = o.node.props.en; if (!en) continue;
    const enLeaves = Object.fromEntries(leaves(en));
    for (const lang of ['hu', 'uk']) { const t = o.node.props[lang]; if (!t) continue; for (const [p, n] of leaves(t)) if (enLeaves[p]) add(o.file, lang, enLeaves[p], n, p); }
    continue;
  }
  // i18n.js: { modul: { hu:{…}, uk:{…} } } — obiectul găsit poate fi chiar modulul sau lista de module
  const modules = o.node.props.hu || o.node.props.uk ? { [findName(o)]: o.node } : o.node.props;
  for (const [name, mod] of Object.entries(modules)) {
    if (mod?.type !== 'obj') continue;
    const keys = Object.keys(mod.props.hu?.props || mod.props.uk?.props || {});
    const en = englishFor(name, keys); if (!en) continue;
    const enLeaves = Object.fromEntries(leaves(en));
    for (const lang of ['hu', 'uk']) { const t = mod.props[lang]; if (!t) continue; for (const [p, n] of leaves(t)) if (enLeaves[p]) add(o.file, lang, enLeaves[p], n, `${name}.${p}`); }
  }
}
function findName(o) { const src = sources[o.file]; const m = /([A-Za-z_$][\w$]*)\s*:\s*$/.exec(src.slice(Math.max(0, o.node.start - 60), o.node.start)); return m ? m[1] : '?'; }
// Același text englez poate apărea de mai multe ori; păstrăm fiecare apariție (au poziții diferite în fișier).
console.log(`Texte găsite: ${entries.length} (HU ${entries.filter(e => e.lang === 'hu').length}, UK ${entries.filter(e => e.lang === 'uk').length}) în ${new Set(entries.map(e => e.file)).size} fișiere.`);
if (MODE === 'extract') {
  if (args.out) writeFileSync(args.out, JSON.stringify(entries.map(({ node, ...e }) => e), null, 1));
  process.exit(0);
}

// ——— DeepL
const KEY = process.env.DEEPL_AUTH_KEY;
if (!KEY && !process.env.DEEPL_FAKE) { console.error('Lipsește DEEPL_AUTH_KEY. Adaug-o ca secret în GitHub (Settings → Secrets → Actions).'); process.exit(1); }
const API = KEY?.endsWith(':fx') ? 'https://api-free.deepl.com/v2/translate' : 'https://api.deepl.com/v2/translate';
const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const unesc = t => t.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
// Înlocuitorii {n} și ${expresie} devin etichete XML pe care DeepL nu le traduce.
function protect(e) {
  const keep = []; let text = e.en;
  text = esc(text).replace(/\$\{[^}]*\}|\{\w+\}/g, m => { keep.push(m); return `<x i="${keep.length - 1}"/>`; });
  return { text, keep };
}
const restore = (t, keep) => unesc(t.replace(/<x i="(\d+)"\s*\/>/g, (_, i) => keep[+i] ?? ''));
async function translate(texts, lang) {
  if (process.env.DEEPL_FAKE) return texts.map(t => t);
  const out = [];
  for (let i = 0; i < texts.length; i += 40) {
    const body = { text: texts.slice(i, i + 40), source_lang: 'EN', target_lang: TARGETS[lang], tag_handling: 'xml', context: CONTEXT, preserve_formatting: true };
    for (let attempt = 0; ; attempt++) {
      const r = await fetch(API, { method: 'POST', headers: { 'Authorization': `DeepL-Auth-Key ${KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (r.status === 429 && attempt < 5) { await new Promise(res => setTimeout(res, 2000 * (attempt + 1))); continue; }
      if (!r.ok) throw new Error(`DeepL ${r.status}: ${await r.text()}`);
      const j = await r.json(); out.push(...j.translations.map(t => t.text)); break;
    }
  }
  return out;
}
const unique = {};
for (const e of entries) { const k = `${e.lang}|${e.en}`; (unique[k] ||= { lang: e.lang, en: e.en, list: [] }).list.push(e); }
for (const lang of ['hu', 'uk']) {
  const items = Object.values(unique).filter(u => u.lang === lang), prot = items.map(u => protect(u));
  const res = await translate(prot.map(p => p.text), lang);
  items.forEach((u, i) => { const t = restore(res[i], prot[i].keep); u.list.forEach(e => { e.deepl = t; }); });
}
const changed = entries.filter(e => e.deepl && e.deepl.trim() !== e.ours.trim());
mkdirSync(OUT_DIR, { recursive: true });
const keepFile = join(OUT_DIR, 'keep.json');
const keep = new Set(existsSync(keepFile) ? JSON.parse(readFileSync(keepFile, 'utf8')).keep || [] : []);
writeFileSync(join(OUT_DIR, 'deepl-review.json'), JSON.stringify({ generated: new Date().toISOString(), total: entries.length, different: changed.length,
  items: changed.map(({ node, ...e }) => ({ id: e.id, file: e.file, lang: e.lang, where: e.where, en: e.en, ours: e.ours, deepl: e.deepl, kept: keep.has(e.id) })) }, null, 1));
console.log(`Diferite de DeepL: ${changed.length}. Raport: curious-garden/translations/deepl-review.json`);
if (MODE !== 'apply') process.exit(0);

// ——— Aplicarea: fiecare text se rescrie în locul lui, cu același tip de ghilimele; ${expresiile} rămân neschimbate.
function literal(e) {
  const n = e.node, t = e.deepl;
  if (n.type === 'str') return n.quote + t.replace(/\\/g, '\\\\').replace(new RegExp(n.quote, 'g'), '\\' + n.quote).replace(/\n/g, '\\n') + n.quote;
  return '`' + t.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$(?!\{)/g, '$') + '`';
}
const byFile = {};
for (const e of changed) if (!keep.has(e.id)) (byFile[e.file] ||= []).push(e);
for (const [file, list] of Object.entries(byFile)) {
  let src = sources[file];
  const seen = new Set();
  for (const e of list.sort((a, b) => b.node.start - a.node.start)) {
    if (seen.has(e.node.start)) continue; seen.add(e.node.start);
    const tplOk = e.node.type !== 'tpl' || (e.deepl.match(/\$\{/g) || []).length === e.node.parts.filter(p => typeof p !== 'string').length;
    if (!tplOk) { console.warn(`Sar peste ${e.id}: expresiile din text nu s-au păstrat.`); continue; }
    src = src.slice(0, e.node.start) + literal(e) + src.slice(e.node.end);
  }
  writeFileSync(join(ROOT, file), src);
  console.log(`${file}: ${seen.size} texte actualizate`);
}
