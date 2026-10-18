import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const window = {};
vm.runInNewContext(readFileSync(join(root, 'data.v2.4.js'), 'utf8'), { window }, { filename: 'data.v2.4.js' });
vm.runInNewContext(readFileSync(join(root, 'progress.v2.5.js'), 'utf8'), { window }, { filename: 'progress.v2.5.js' });
const D = window.GS_DATA;
const localized = (v) => v && typeof v.ro === 'string' && v.ro.trim() && typeof v.en === 'string' && v.en.trim();
const subjectIds = new Set(D.SUBJECTS.map((s) => s.id));

assert.equal(D.SUBJECTS.length, 8, 'expected eight subjects');
assert.equal(D.QUIZ.length, 104, 'question count changed; update this check intentionally');
assert.equal(new Set(D.SUBJECTS.map((s) => s.id)).size, D.SUBJECTS.length, 'subject IDs must be unique');
for (const [i, q] of D.QUIZ.entries()) {
  assert.ok(subjectIds.has(q.s), `question ${i + 1} has an unknown subject`);
  assert.ok(Number.isInteger(q.g) && q.g >= 5 && q.g <= 8, `question ${i + 1} has an invalid grade`);
  assert.ok(localized(q.q) && localized(q.x), `question ${i + 1} needs RO and EN text/explanation`);
  assert.equal(q.o.length, 4, `question ${i + 1} must have four choices`);
  assert.ok(q.o.every(localized), `question ${i + 1} has a choice without RO/EN text`);
  assert.ok(Number.isInteger(q.a) && q.a >= 0 && q.a < q.o.length, `question ${i + 1} has an invalid answer index`);
}
const years = [...D.ARCHIVE].map((x) => x.year).sort();
assert.deepEqual(years, [2020, 2021, 2022, 2023, 2024, 2025, 2026]);
for (const item of D.ARCHIVE) assert.equal(new URL(item.u).hostname, 'subiecte.edu.ro', `archive ${item.year} must use the official host`);

const codec = window.GS_PROGRESS;
const base = codec.fresh();
assert.ok(codec.normalize(base), 'fresh progress must validate');
assert.ok(codec.normalize({ app: 'Gimnaziu Space', format: 'gimnaziu-space-backup', version: 2, exportedAt: new Date().toISOString(), progress: base }), 'new backup envelope must validate');
assert.ok(codec.normalize({ ...base, quizzes: 4 }), 'legacy v1 exports must remain importable');
const realistic = {
  ...base, xp: 45, days: { '2026-10-18': 45 }, quiz: { mat: { ok: 3, bad: 1 } },
  quizTime: { mat: { seconds: 95, count: 4 } }, quizzes: 1, perfect: 0,
  cards: { 'f-1': { b: 2, due: Date.now() } }, reviews: 1, known: { 'f-1': 1 }, fav: { 'f-2': 1 },
  memoRead: { 'm-1': 1 }, pomos: 1, sims: [{ d: new Date().toISOString(), k: 'mat', p: 72, minutes: 120, profile: 'balanced' }],
  plan: { 0: '2026-10-18' }, badges: { 'first-quiz': '2026-10-18' },
  mistakes: [{ id: 'mat|q', s: 'mat', g: 7, topic: 'algebra', q: { ro: 'Enunț', en: 'Prompt' }, chosen: { ro: 'A', en: 'A' }, correct: { ro: 'B', en: 'B' }, x: { ro: 'Explicație', en: 'Explanation' }, stage: 0, nextReview: Date.now(), when: new Date().toISOString() }],
  challenge: { date: '2026-10-18', id: 'mat|q', chosen: 1, correct: 2 },
  pisa: [{ date: new Date().toISOString(), total: 6, correct: 4 }],
  feedback: [{ device: 'phone', grade: 'VIII', task: 'quiz', category: 'Content', rating: '4', note: 'clear', accessibility: false, when: new Date().toISOString() }],
  diagnostics: [{ date: new Date().toISOString(), subject: 'mat', grade: 7, total: 1, correct: 1, skills: [{ id: 'algebra', ro: 'Algebră', en: 'Algebra', ok: 1, total: 1, pct: 100 }] }],
  mastery: { '7|mat|algebra': { id: 'algebra', ro: 'Algebră', en: 'Algebra', ok: 1, total: 1, pct: 100, date: new Date().toISOString() } },
  adaptivePlan: ['Quiz scurt']
};
assert.ok(codec.normalize(realistic), 'realistic nested progress must round-trip');
for (const broken of [
  { ...base, quiz: [] },
  { ...base, quizTime: { mat: { seconds: 'many', count: 1 } } },
  { ...base, sims: [{ d: 'today', k: 'math', p: 500 }] },
  { ...base, mistakes: [{ id: 'bad', s: 'mat', g: 7 }] },
  { ...base, diagnostics: [{ date: 'today', subject: 'mat', grade: 7, total: 2, correct: 1, skills: [{ id: 'x' }] }] },
  { ...base, pisa: [{ date: 'today', total: 6, correct: 4 }] },
  { ...base, mastery: { '7|mat|algebra': { id: 'algebra', ro: 'Algebră', en: 'Algebra', ok: 2, total: 1 } } },
  JSON.parse('{"v":1,"xp":1,"days":{"__proto__":{"polluted":true}}}')
]) assert.equal(codec.normalize(broken), null, 'malformed backup must be rejected without a partial import');

console.log(`Content and backup validation passed: ${D.QUIZ.length} questions, ${D.SUBJECTS.length} subjects, ${years.length} archive routes.`);
