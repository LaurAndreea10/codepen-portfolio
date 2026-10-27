import { normalizePuzzle, routeValid, seededValues } from "./studio-rules.js";
import { localDay } from "./game.js";
export const ADVENTURE_KEY = "laurai-candy-adventure-v1";
export const ADVENTURE_MODES = [
  "classic",
  "zones",
  "minimum",
  "recharge",
  "diversity",
  "delivery",
  "travel",
];
export function adventurePuzzle(raw) {
  if (!raw || !ADVENTURE_MODES.includes(raw.mode ?? "classic"))
    throw Error("mode");
  const base = normalizePuzzle(raw.base ?? raw),
    n = base.values.length;
  const integer = (x, min, max) => Number.isInteger(x) && x >= min && x <= max;
  const mode = raw.mode ?? "classic",
    minimum = raw.minimum ?? 0,
    start = raw.start ?? 0,
    finish = raw.finish ?? null,
    travel = raw.travel ?? 1000,
    bonus = raw.bonus ?? 0;
  if (
    !integer(minimum, 0, n) ||
    !integer(start, 0, n - 1) ||
    (finish !== null && !integer(finish, 0, n - 1)) ||
    !integer(travel, 0, 1000) ||
    !integer(bonus, 0, 50)
  )
    throw Error("rule");
  const arrays = (key, defaults, max) => {
    const values = raw[key] ?? defaults;
    if (
      !Array.isArray(values) ||
      values.length !== n ||
      values.some((v) => !integer(v, 0, max))
    )
      throw Error(key);
    return [...values];
  };
  return {
    mode,
    base,
    minimum,
    start,
    finish,
    travel,
    bonus,
    zones: arrays(
      "zones",
      base.values.map((_, i) => Math.floor(i / 3)),
      15,
    ),
    types: arrays(
      "types",
      base.values.map((_, i) => i % 3),
      2,
    ),
    rewards: arrays(
      "rewards",
      base.values.map(() => 0),
      99,
    ),
  };
}
export function adventureOrder(p, picks) {
  const route = [...picks].sort((a, b) => a - b);
  if (p.finish !== null && route.includes(p.finish)) {
    route.splice(route.indexOf(p.finish), 1);
    route.push(p.finish);
  }
  return route;
}
export function adventureIssues(raw, picks) {
  const p = raw,
    b = p.base,
    n = b.values.length;
  if (
    !Array.isArray(picks) ||
    new Set(picks).size !== picks.length ||
    picks.some((i) => !Number.isInteger(i) || i < 0 || i >= n)
  )
    return [{ code: "indices" }];
  const issues = [];
  if (
    !routeValid(
      { ...b, budget: p.mode === "recharge" ? n * 99 : b.budget },
      picks,
    )
  ) {
    if (picks.some((i) => b.closed.includes(i)))
      issues.push({
        code: "closed",
        houses: picks.filter((i) => b.closed.includes(i)),
      });
    const missing = b.required.filter((i) => !picks.includes(i));
    if (missing.length) issues.push({ code: "required", houses: missing });
    if (picks.length > b.k || (b.exact && picks.length !== b.k))
      issues.push({ code: "count", value: b.k });
    for (let a = 0; a < picks.length; a++)
      for (let c = a + 1; c < picks.length; c++) {
        const i = picks[a],
          j = picks[c],
          d = Math.abs(i - j);
        if (
          b.edges
            ? b.edges.some((e) => e.includes(i) && e.includes(j))
            : Math.min(d, b.circle ? n - d : Infinity) <= b.gap
        )
          issues.push({ code: "neighbors", houses: [i, j] });
      }
    const energy = picks.reduce((s, i) => s + b.costs[i], 0),
      time = picks.reduce((s, i) => s + b.minutes[i], 0);
    if (p.mode !== "recharge" && energy > b.budget)
      issues.push({ code: "energy", value: energy - b.budget });
    if (time > b.time) issues.push({ code: "time", value: time - b.time });
  }
  if (picks.length < p.minimum)
    issues.push({ code: "minimum", value: p.minimum - picks.length });
  const order = adventureOrder(p, picks);
  if (p.mode === "zones") {
    let previous = -1,
      run = 0;
    for (const i of order) {
      run = p.zones[i] === previous ? run + 1 : 1;
      previous = p.zones[i];
      if (run > 2) {
        issues.push({ code: "zones", houses: [i] });
        break;
      }
    }
  }
  if (p.mode === "recharge") {
    let energy = b.budget;
    for (const i of order) {
      if (energy < b.costs[i]) {
        issues.push({
          code: "recharge",
          houses: [i],
          value: b.costs[i] - energy,
        });
        break;
      }
      energy += p.rewards[i] - b.costs[i];
    }
  }
  if (p.finish !== null && !picks.includes(p.finish))
    issues.push({ code: "finish", houses: [p.finish] });
  let position = p.start,
    distance = 0;
  for (const i of order) {
    distance += Math.abs(i - position);
    position = i;
  }
  if (distance > p.travel)
    issues.push({ code: "travel", value: distance - p.travel });
  return issues;
}
export function adventureScore(p, picks) {
  return (
    picks.reduce((sum, i) => sum + p.base.values[i], 0) +
    new Set(picks.map((i) => p.types[i])).size * p.bonus
  );
}
export function solveAdventure(raw) {
  const p = adventurePuzzle(raw),
    n = p.base.values.length;
  let total = null,
    count = 0,
    routes = [];
  for (let mask = 0; mask < 2 ** n; mask++) {
    const route = [];
    for (let i = 0; i < n; i++) if (mask & (1 << i)) route.push(i);
    if (adventureIssues(p, route).length) continue;
    const score = adventureScore(p, route);
    if (total === null || score > total) {
      total = score;
      count = 0;
      routes = [];
    }
    if (score === total) {
      count++;
      if (routes.length < 50) routes.push(route);
    }
  }
  return { total, count, routes, operations: 2 ** n };
}
export function presetAdventure(mode = "classic", seed = "CandyRoute4", n = 8) {
  const base = normalizePuzzle({
      values: seededValues(seed, n, 1, 15),
      budget: 1000,
      time: 1000,
    }),
    p = { mode, base };
  if (mode === "zones") p.zones = Array(n).fill(0);
  if (mode === "minimum") p.minimum = Math.min(3, Math.ceil(n / 2));
  if (mode === "recharge") {
    p.base.budget = 3;
    p.rewards = base.values.map((_, i) => (i % 2 === 0 ? 4 : 0));
  }
  if (mode === "diversity") p.bonus = 5;
  if (mode === "delivery") p.finish = n - 1;
  if (mode === "travel") {
    p.start = Math.floor(n / 2);
    p.travel = Math.max(2, Math.floor(n / 2));
  }
  return adventurePuzzle(p);
}
export function newAdventureProfile() {
  return {
    choices: {},
    records: [],
    notes: [],
    campaigns: [],
    goal: 3,
    session: null,
    tournament: null,
  };
}
export function freshAdventure() {
  return {
    version: 1,
    screen: "home",
    profiles: {},
    prefs: {
      text: false,
      scale: 100,
      house: 100,
      orientation: false,
      character: true,
      decor: true,
      transitions: true,
      effects: true,
      weather: "none",
      night: true,
    },
    server: "",
  };
}
export function validateAdventure(raw) {
  if (
    !raw ||
    raw.version !== 1 ||
    ![
      "home",
      "play",
      "campaign",
      "studio",
      "learn",
      "progress",
      "settings",
      "adventure",
      "online",
    ].includes(raw.screen) ||
    !raw.profiles ||
    typeof raw.profiles !== "object" ||
    Array.isArray(raw.profiles) ||
    Object.keys(raw.profiles).length > 20
  )
    throw Error("adventure");
  const clean = freshAdventure(),
    pref = raw.prefs;
  if (!pref) throw Error("prefs");
  for (const k of [
    "text",
    "orientation",
    "character",
    "decor",
    "transitions",
    "effects",
    "night",
  ]) {
    if (typeof pref[k] !== "boolean") throw Error("prefs");
    clean.prefs[k] = pref[k];
  }
  if (
    !Number.isInteger(pref.scale) ||
    pref.scale < 80 ||
    pref.scale > 160 ||
    !Number.isInteger(pref.house) ||
    pref.house < 80 ||
    pref.house > 160 ||
    !["none", "rain", "snow", "leaves", "fog"].includes(pref.weather)
  )
    throw Error("prefs");
  clean.prefs.scale = pref.scale;
  clean.prefs.house = pref.house;
  clean.prefs.weather = pref.weather;
  clean.screen = raw.screen;
  if (typeof raw.server !== "string" || raw.server.length > 300)
    throw Error("server");
  clean.server = raw.server;
  for (const [key, profile] of Object.entries(raw.profiles)) {
    if (
      !/^p[0-3]$/.test(key) ||
      !profile ||
      !Array.isArray(profile.records) ||
      profile.records.length > 1000 ||
      !Array.isArray(profile.campaigns) ||
      profile.campaigns.length > 20 ||
      !Number.isInteger(profile.goal) ||
      profile.goal < 1 ||
      profile.goal > 30
    )
      throw Error("profile");
    const p = newAdventureProfile();
    p.goal = profile.goal;
    if (!profile.choices || Object.keys(profile.choices).length > 5)
      throw Error("choices");
    for (const [c, v] of Object.entries(profile.choices)) {
      if (!/^[0-4]$/.test(c) || !["lantern", "garden"].includes(v))
        throw Error("choice");
      p.choices[c] = v;
    }
    p.records = profile.records.map((r) => {
      if (
        !r ||
        typeof r.day !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(r.day) ||
        !ADVENTURE_MODES.includes(r.mode) ||
        typeof r.valid !== "boolean" ||
        typeof r.assisted !== "boolean" ||
        !Number.isInteger(r.score) ||
        Math.abs(r.score) > 2000 ||
        (r.best !== null &&
          (!Number.isInteger(r.best) || Math.abs(r.best) > 2000)) ||
        typeof r.puzzle !== "string" ||
        r.puzzle.length > 5000 ||
        typeof r.issue !== "string" ||
        r.issue.length > 500
      )
        throw Error("record");
      return {
        day: r.day,
        mode: r.mode,
        valid: r.valid,
        assisted: r.assisted,
        score: r.score,
        best: r.best,
        puzzle: r.puzzle,
        issue: r.issue,
      };
    });
    p.campaigns = profile.campaigns.map(validateCampaign);
    if (profile.notes !== undefined) {
      if (!Array.isArray(profile.notes) || profile.notes.length > 50)
        throw Error("notes");
      p.notes = profile.notes.map((note) => {
        if (
          !note ||
          !["observation", "before", "after", "evidence"].every(
            (k) => typeof note[k] === "string" && note[k].length <= 500,
          ) ||
          !/^\d{4}-\d{2}-\d{2}$/.test(note.day)
        )
          throw Error("note");
        return {
          day: note.day,
          observation: note.observation,
          before: note.before,
          after: note.after,
          evidence: note.evidence,
        };
      });
    }
    if (profile.session !== null) {
      const s = profile.session,
        puzzle = adventurePuzzle(s.puzzle);
      if (
        !Array.isArray(s.picks) ||
        s.picks.some(
          (i) =>
            !Number.isInteger(i) || i < 0 || i >= puzzle.base.values.length,
        ) ||
        new Set(s.picks).size !== s.picks.length ||
        typeof s.assisted !== "boolean" ||
        typeof s.checked !== "boolean" ||
        typeof s.name !== "string" ||
        s.name.length > 60
      )
        throw Error("session");
      const secondPicks = s.secondPicks ?? [];
      if (
        !Array.isArray(secondPicks) ||
        secondPicks.length > 16 ||
        new Set(secondPicks).size !== secondPicks.length ||
        secondPicks.some(
          (i) =>
            !Number.isInteger(i) || i < 0 || i >= puzzle.base.values.length,
        )
      )
        throw Error("secondPicks");
      p.session = {
        secondPicks: [...secondPicks],
        puzzle,
        picks: [...s.picks],
        assisted: s.assisted,
        checked: s.checked,
        name: s.name,
      };
    }
    if (profile.tournament !== null) {
      const t = profile.tournament;
      if (
        !["championship", "coop", "simultaneous", "package"].includes(t.kind) ||
        !Array.isArray(t.puzzles) ||
        t.puzzles.length < 1 ||
        t.puzzles.length > 20 ||
        !Number.isInteger(t.round) ||
        t.round < 0 ||
        t.round > t.puzzles.length ||
        !Array.isArray(t.scores) ||
        t.scores.length !== t.round ||
        t.scores.some(
          (s) =>
            !Array.isArray(s) ||
            s.length !== 2 ||
            s.some((v) => !Number.isInteger(v) || Math.abs(v) > 2000),
        )
      )
        throw Error("tournament");
      p.tournament = {
        kind: t.kind,
        puzzles: t.puzzles.map(adventurePuzzle),
        round: t.round,
        scores: t.scores.map((a) => [...a]),
      };
    }
    clean.profiles[key] = p;
  }
  return clean;
}
export function validateCampaign(raw) {
  if (
    !raw ||
    typeof raw.name !== "string" ||
    !raw.name.trim() ||
    raw.name.length > 60 ||
    !Array.isArray(raw.levels) ||
    raw.levels.length < 1 ||
    raw.levels.length > 20
  )
    throw Error("campaign");
  return {
    name: raw.name,
    levels: raw.levels.map((l, i) => {
      if (
        !l ||
        typeof l.name !== "string" ||
        l.name.length > 60 ||
        !Number.isInteger(l.chapter) ||
        l.chapter < 1 ||
        l.chapter > 5 ||
        !Number.isInteger(l.unlock) ||
        l.unlock < 0 ||
        l.unlock > i
      )
        throw Error("level");
      return {
        name: l.name,
        chapter: l.chapter,
        unlock: l.unlock,
        puzzle: adventurePuzzle(l.puzzle),
      };
    }),
  };
}
export function weeklyAdventure(profile, day = localDay()) {
  const start = new Date(day + "T12:00:00Z");
  start.setUTCDate(start.getUTCDate() - 6);
  const since = start.toISOString().slice(0, 10),
    records = profile.records.filter((r) => r.day >= since && r.day <= day),
    won = records.filter((r) => r.valid && !r.assisted && r.score === r.best);
  const modes = ADVENTURE_MODES.map((mode) => {
    const rows = records.filter((r) => r.mode === mode);
    return {
      mode,
      attempts: rows.length,
      wins: rows.filter((r) => r.valid && r.score === r.best && !r.assisted)
        .length,
    };
  });
  const weakest = [...modes].sort(
    (a, b) =>
      (a.attempts ? a.wins / a.attempts : 1) -
      (b.attempts ? b.wins / b.attempts : 1),
  )[0];
  return {
    attempts: records.length,
    wins: won.length,
    goal: profile.goal,
    modes,
    recommendation: weakest.attempts ? weakest.mode : "classic",
  };
}
export function botAdventure(p, kind = "greedy") {
  const order = [...p.base.values.keys()].sort((a, b) =>
    kind === "greedy" ? p.base.values[b] - p.base.values[a] || a - b : a - b,
  );
  let picks = [];
  if (kind === "strategist") return solveAdventure(p).routes[0] ?? [];
  for (const i of order) {
    if (kind === "alternate" && i % 2) continue;
    const next = [...picks, i];
    const issues = adventureIssues({ ...p, minimum: 0, finish: null }, next);
    if (!issues.length) picks = next;
  }
  if (adventureIssues(p, picks).length) return [];
  return picks;
}
