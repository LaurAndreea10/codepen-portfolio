'use strict';
/* Validare izolată a backupului: importul nu înlocuiește progresul până când
   toate colecțiile folosite de aplicație au o formă sigură. */
window.GS_PROGRESS = (() => {
  const isRecord = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
  const finite = (v, max = 1e9) => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= max;
  const integer = (v, max = 1e9) => finite(v, max) && Number.isInteger(v);
  const dateKey = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
  const isoDate = (v) => typeof v === 'string' && Number.isFinite(Date.parse(v));
  const safeKey = (k) => typeof k === 'string' && k.length > 0 && k.length <= 180 && !['__proto__', 'prototype', 'constructor'].includes(k);
  const localized = (v) => typeof v === 'string' || (isRecord(v) && typeof v.ro === 'string' && typeof v.en === 'string');
  const fresh = () => ({ v: 1, xp: 0, days: {}, quiz: {}, quizTime: {}, quizzes: 0, perfect: 0, cards: {}, reviews: 0, known: {}, fav: {}, memoRead: {}, pomos: 0, sims: [], pisa: [], plan: {}, badges: {}, mistakes: [], challenge: null, feedback: [], diagnostics: [], mastery: {} });
  const map = (src, check) => {
    if (src === undefined) return {};
    if (!isRecord(src)) return null;
    const out = {};
    for (const [key, value] of Object.entries(src)) {
      if (!safeKey(key)) return null;
      const result = check(value);
      if (result === null) return null;
      out[key] = result;
    }
    return out;
  };
  const countPair = (v, keys) => {
    if (!isRecord(v) || !keys.every((k) => integer(v[k]))) return null;
    return Object.fromEntries(keys.map((k) => [k, v[k]]));
  };
  const skill = (v) => {
    if (!isRecord(v) || !safeKey(v.id) || !localized(v.ro) || !localized(v.en) || !integer(v.ok) || !integer(v.total) || v.total < 1 || v.ok > v.total) return null;
    const out = { id: v.id, ro: v.ro, en: v.en, ok: v.ok, total: v.total };
    if (v.pct !== undefined) { if (!integer(v.pct, 100)) return null; out.pct = v.pct; }
    if (v.date !== undefined) { if (!isoDate(v.date)) return null; out.date = v.date; }
    return out;
  };
  function normalize(input) {
    let s = input;
    if (isRecord(s) && s.app !== undefined) {
      if (s.app !== 'Gimnaziu Space') return null;
      if (!isRecord(s.progress)) return null;
      s = s.progress;
    }
    if (!isRecord(s) || s.v !== 1 || !finite(s.xp)) return null;
    const out = fresh();
    out.xp = s.xp;
    for (const key of ['quizzes', 'perfect', 'reviews', 'pomos']) {
      if (s[key] !== undefined) { if (!integer(s[key])) return null; out[key] = s[key]; }
    }
    out.days = map(s.days, (v) => finite(v) ? v : null);
    if (out.days === null || Object.keys(out.days).some((k) => !dateKey(k))) return null;
    out.quiz = map(s.quiz, (v) => countPair(v, ['ok', 'bad']));
    if (out.quiz === null) return null;
    out.quizTime = map(s.quizTime, (v) => {
      if (!isRecord(v) || !finite(v.seconds) || !integer(v.count)) return null;
      return { seconds: v.seconds, count: v.count };
    });
    if (out.quizTime === null) return null;
    out.cards = map(s.cards, (v) => isRecord(v) && integer(v.b, 5) && v.b >= 1 && finite(v.due, 8.64e15) ? { b: v.b, due: v.due } : null);
    if (out.cards === null) return null;
    for (const key of ['known', 'fav', 'memoRead']) {
      out[key] = map(s[key], (v) => v === 1 || v === true ? 1 : null);
      if (out[key] === null) return null;
    }
    out.plan = map(s.plan, (v) => dateKey(v) ? v : null);
    if (out.plan === null) return null;
    out.badges = map(s.badges, (v) => dateKey(v) ? v : null);
    if (out.badges === null) return null;
    if (s.sims !== undefined) {
      if (!Array.isArray(s.sims) || s.sims.length > 100) return null;
      out.sims = [];
      for (const v of s.sims) {
        if (!isRecord(v) || !isoDate(v.d) || !['mat', 'rom'].includes(v.k) || !integer(v.p, 100)) return null;
        const rec = { d: v.d, k: v.k, p: v.p };
        if (v.minutes !== undefined) { if (!integer(v.minutes, 10000)) return null; rec.minutes = v.minutes; }
        if (v.profile !== undefined) { if (typeof v.profile !== 'string' || v.profile.length > 80) return null; rec.profile = v.profile; }
        out.sims.push(rec);
      }
    }
    if (s.mistakes !== undefined) {
      if (!Array.isArray(s.mistakes) || s.mistakes.length > 500) return null;
      out.mistakes = [];
      for (const v of s.mistakes) {
        if (!isRecord(v) || !safeKey(v.id) || !safeKey(v.s) || !integer(v.g, 8) || v.g < 5 || !safeKey(v.topic) || !localized(v.q) || !localized(v.chosen) || !localized(v.correct) || !localized(v.x) || !integer(v.stage, 4) || !finite(v.nextReview, 8.64e15) || !isoDate(v.when)) return null;
        out.mistakes.push({ id: v.id, s: v.s, g: v.g, topic: v.topic, q: v.q, chosen: v.chosen, correct: v.correct, x: v.x, stage: v.stage, nextReview: v.nextReview, when: v.when });
      }
    }
    if (s.challenge !== undefined && s.challenge !== null) {
      const v = s.challenge;
      if (!isRecord(v) || !dateKey(v.date) || !safeKey(v.id) || !integer(v.chosen, 3) || !integer(v.correct, 3)) return null;
      out.challenge = { date: v.date, id: v.id, chosen: v.chosen, correct: v.correct };
    }
    if (s.feedback !== undefined) {
      if (!Array.isArray(s.feedback) || s.feedback.length > 500) return null;
      out.feedback = [];
      for (const v of s.feedback) {
        if (!isRecord(v)) return null;
        const rec = {};
        for (const [key, value] of Object.entries(v)) {
          if (!safeKey(key) || !['string', 'boolean'].includes(typeof value) || (typeof value === 'string' && value.length > 5000)) return null;
          rec[key] = value;
        }
        out.feedback.push(rec);
      }
    }
    if (s.diagnostics !== undefined) {
      if (!Array.isArray(s.diagnostics) || s.diagnostics.length > 100) return null;
      out.diagnostics = [];
      for (const v of s.diagnostics) {
        if (!isRecord(v) || !isoDate(v.date) || !safeKey(v.subject) || !integer(v.grade, 8) || !integer(v.total, 1000) || v.total < 1 || !integer(v.correct, v.total) || !Array.isArray(v.skills)) return null;
        const skills = v.skills.map(skill);
        if (skills.some((x) => x === null)) return null;
        out.diagnostics.push({ date: v.date, subject: v.subject, grade: v.grade, total: v.total, correct: v.correct, skills });
      }
    }
    if (s.pisa !== undefined) {
      if (!Array.isArray(s.pisa) || s.pisa.length > 100) return null;
      out.pisa = [];
      for (const v of s.pisa) {
        if (!isRecord(v) || !isoDate(v.date) || !integer(v.total, 20) || v.total < 1 || !integer(v.correct, v.total)) return null;
        out.pisa.push({ date: v.date, total: v.total, correct: v.correct });
      }
    }
    out.mastery = map(s.mastery, skill);
    if (out.mastery === null) return null;
    if (s.adaptivePlan !== undefined) {
      if (!Array.isArray(s.adaptivePlan) || s.adaptivePlan.length > 14 || !s.adaptivePlan.every((v) => typeof v === 'string' && v.length <= 500)) return null;
      out.adaptivePlan = [...s.adaptivePlan];
    }
    return out;
  }
  return { fresh, normalize };
})();
