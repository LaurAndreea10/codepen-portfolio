// Advanced variants are deliberately capped at 16 houses: at most 65,536 subsets.
export const STUDIO_KEY = "laurai-candy-studio-v1";
export function normalizePuzzle(p) {
  if (
    !p ||
    !Array.isArray(p.values) ||
    p.values.length < 1 ||
    p.values.length > 16 ||
    p.values.some((v) => !Number.isInteger(v) || v < -99 || v > 99)
  )
    throw Error("values");
  const variant = p.variant ?? "classic";
  if (
    ![
      "classic",
      "circle",
      "gap",
      "maxk",
      "exactk",
      "energy",
      "time",
      "closed",
      "required",
      "taste",
      "hidden",
      "tree",
    ].includes(variant)
  )
    throw Error("variant");
  const n = p.values.length,
    index = (i) => Number.isInteger(i) && i >= 0 && i < n;
  const list = (k) => {
    const a = p[k] ?? [];
    if (
      !Array.isArray(a) ||
      a.some((i) => !index(i)) ||
      new Set(a).size !== a.length
    )
      throw Error(k);
    return [...a];
  };
  const gap = p.gap ?? 1,
    k = p.k ?? n,
    budget = p.budget ?? 100,
    time = p.time ?? 100;
  if (
    !Number.isInteger(gap) ||
    gap < 1 ||
    gap > 3 ||
    !Number.isInteger(k) ||
    k < 0 ||
    k > n ||
    ![budget, time].every((x) => Number.isInteger(x) && x >= 0 && x <= 1000)
  )
    throw Error("limits");
  const costs = p.costs ?? p.values.map((_, i) => (i % 3) + 1),
    minutes = p.minutes ?? p.values.map((_, i) => (i % 4) + 1);
  if (
    [costs, minutes].some(
      (a) =>
        !Array.isArray(a) ||
        a.length !== n ||
        a.some((x) => !Number.isInteger(x) || x < 1 || x > 99),
    )
  )
    throw Error("costs");
  if (
    (p.exact !== undefined && typeof p.exact !== "boolean") ||
    (p.circle !== undefined && typeof p.circle !== "boolean")
  )
    throw Error("flags");
  const edges = p.edges ?? null;
  if (edges !== null) {
    if (!Array.isArray(edges) || edges.length !== n - 1) throw Error("tree");
    const parent = Array.from({ length: n }, (_, i) => i),
      root = (i) => (parent[i] === i ? i : (parent[i] = root(parent[i])));
    for (const e of edges) {
      if (
        !Array.isArray(e) ||
        e.length !== 2 ||
        !e.every(index) ||
        e[0] === e[1] ||
        root(e[0]) === root(e[1])
      )
        throw Error("tree");
      parent[root(e[0])] = root(e[1]);
    }
  }
  return {
    variant,
    values: [...p.values],
    gap,
    k,
    budget,
    time,
    costs: [...costs],
    minutes: [...minutes],
    exact: p.exact === true,
    circle: p.circle === true,
    closed: list("closed"),
    required: list("required"),
    edges: edges?.map((e) => [...e]) ?? null,
  };
}
export function routeScore(p, picks) {
  return picks.reduce((s, i) => s + p.values[i], 0);
}
export function routeValid(raw, picks) {
  const p = raw,
    n = p.values.length;
  if (
    !Array.isArray(picks) ||
    picks.some((i) => !Number.isInteger(i) || i < 0 || i >= n) ||
    new Set(picks).size !== picks.length
  )
    return false;
  const selected = new Set(picks);
  if (
    picks.some((i) => p.closed.includes(i)) ||
    p.required.some((i) => !selected.has(i)) ||
    picks.length > p.k ||
    (p.exact && picks.length !== p.k)
  )
    return false;
  if (
    picks.reduce((s, i) => s + p.costs[i], 0) > p.budget ||
    picks.reduce((s, i) => s + p.minutes[i], 0) > p.time
  )
    return false;
  if (p.edges)
    return !p.edges.some(([a, b]) => selected.has(a) && selected.has(b));
  return picks.every((i, a) =>
    picks.every(
      (j, b) =>
        a === b ||
        Math.min(Math.abs(i - j), p.circle ? n - Math.abs(i - j) : Infinity) >
          p.gap,
    ),
  );
}
export function solveVariant(raw) {
  const p = normalizePuzzle(raw),
    n = p.values.length;
  let best = -Infinity,
    count = 0,
    operations = 0,
    routes = [];
  for (let mask = 0; mask < 2 ** n; mask++) {
    operations++;
    const picks = [];
    for (let i = 0; i < n; i++) if (mask & (1 << i)) picks.push(i);
    if (!routeValid(p, picks)) continue;
    const total = routeScore(p, picks);
    if (total > best) {
      best = total;
      count = 0;
      routes = [];
    }
    if (total === best) {
      count++;
      if (routes.length < 50) routes.push(picks);
    }
  }
  return { total: best === -Infinity ? null : best, routes, count, operations };
}
export function makePuzzle(values, variant = "classic", options = {}) {
  const n = values.length,
    p = { values, variant, gap: 1, k: n, budget: 1000, time: 1000 };
  if (variant === "gap") p.gap = options.gap ?? 2;
  if (variant === "maxk" || variant === "exactk") {
    p.k = Math.min(n, options.k ?? 3);
    p.exact = variant === "exactk";
  }
  if (variant === "energy") p.budget = options.budget ?? 6;
  if (variant === "time") p.time = options.time ?? 8;
  if (variant === "closed") p.closed = [Math.floor(n / 2)];
  if (variant === "required") p.required = [Math.floor(n / 2)];
  if (variant === "circle") p.circle = true;
  if (variant === "tree")
    p.edges = Array.from({ length: n - 1 }, (_, i) => [
      Math.floor(i / 2),
      i + 1,
    ]);
  return normalizePuzzle(p);
}
export function seededValues(seed, n = 8, min = 0, max = 20) {
  let s = 2166136261;
  for (const c of String(seed))
    s = Math.imul(s ^ c.charCodeAt(0), 16777619) >>> 0;
  return Array.from({ length: n }, () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return min + (s % (max - min + 1));
  });
}
export function blankProfile(name = "Laura") {
  return {
    name,
    records: [],
    collection: [],
    puzzle: null,
    picks: [],
    replay: [],
    core: null,
    session: { checked: false, assisted: false, scouted: [] },
    style: "relaxed",
    avatar: "pawn",
  };
}
export function freshStudio() {
  return {
    version: 1,
    active: 0,
    profiles: [blankProfile()],
    theme: "halloween",
    volume: 30,
    sound: false,
  };
}
export function validateStudio(raw, validateCore) {
  if (
    !raw ||
    raw.version !== 1 ||
    !Array.isArray(raw.profiles) ||
    raw.profiles.length < 1 ||
    raw.profiles.length > 4 ||
    !Number.isInteger(raw.active) ||
    raw.active < 0 ||
    raw.active >= raw.profiles.length ||
    !["halloween", "winter", "spring"].includes(raw.theme) ||
    !Number.isInteger(raw.volume) ||
    raw.volume < 0 ||
    raw.volume > 100
  )
    throw Error("studio");
  if(raw.sound!==undefined && typeof raw.sound!=="boolean")throw Error("sound");
  const clean = freshStudio();
  Object.assign(clean, {
    sound: raw.sound??false,
    active: raw.active,
    theme: raw.theme,
    volume: raw.volume,
  });
  clean.profiles = raw.profiles.map((p) => {
    if (
      !p ||
      typeof p.name !== "string" ||
      p.name.length < 1 ||
      p.name.length > 30 ||
      !Array.isArray(p.records) ||
      p.records.length > 2000 ||
      !Array.isArray(p.collection) ||
      p.collection.length > 100 ||
      !Array.isArray(p.picks) ||
      !Array.isArray(p.replay) ||
      p.replay.length > 100
    )
      throw Error("profile");
    const q = blankProfile(p.name);
    q.puzzle = p.puzzle === null ? null : normalizePuzzle(p.puzzle);
    // Incomplete routes need not satisfy required/exact constraints, but must use valid indices.
    const validPicks = (a) =>
      Array.isArray(a) &&
      a.length <= 16 &&
      new Set(a).size === a.length &&
      a.every(
        (i) =>
          Number.isInteger(i) && i >= 0 && i < (q.puzzle?.values.length ?? 0),
      );
    if (!validPicks(p.picks) || p.replay.some((a) => !validPicks(a)))
      throw Error("picks");
    q.picks = [...p.picks];
    q.replay = p.replay.map((a) => [...a]);
    if (p.style !== undefined && !["relaxed", "expert"].includes(p.style))
      throw Error("style");
    q.style = p.style ?? "relaxed";
    if (
      p.avatar !== undefined &&
      !["pawn", "lantern", "hat", "owl", "moon"].includes(p.avatar)
    )
      throw Error("avatar");
    q.avatar = p.avatar ?? "pawn";
    if (p.session !== undefined) {
      if (
        !p.session ||
        typeof p.session.checked !== "boolean" ||
        typeof p.session.assisted !== "boolean" ||
        !validPicks(p.session.scouted) ||
        p.session.scouted.length > 3
      )
        throw Error("session");
      q.session = {
        checked: p.session.checked,
        assisted: p.session.assisted,
        scouted: [...p.session.scouted],
      };
    }
    q.records = p.records.map((r) => {
      if (
        !r ||
        typeof r.day !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(r.day) ||
        typeof r.id !== "string" ||
        r.id.length > 2000 ||
        ![
          "classic",
          "circle",
          "gap",
          "maxk",
          "exactk",
          "energy",
          "time",
          "closed",
          "required",
          "taste",
          "hidden",
          "tree",
          "core",
        ].includes(r.variant) ||
        !Number.isFinite(r.score) ||
        !Number.isFinite(r.best) ||
        typeof r.assisted !== "boolean"
      )
        throw Error("record");
      return {
        day: r.day,
        id: r.id,
        variant: r.variant,
        score: r.score,
        best: r.best,
        assisted: r.assisted,
      };
    });
    q.collection = p.collection.map((item) => {
      if (
        !item ||
        typeof item.name !== "string" ||
        item.name.length < 1 ||
        item.name.length > 60
      )
        throw Error("collection");
      return { name: item.name, puzzle: normalizePuzzle(item.puzzle) };
    });
    q.core = p.core === null ? null : validateCore(p.core);
    return q;
  });
  return clean;
}
export function parsePack(raw) {
  if (
    !raw ||
    raw.version !== 1 ||
    raw.type !== "candy-route-puzzles" ||
    !Array.isArray(raw.items) ||
    raw.items.length < 1 ||
    raw.items.length > 100
  )
    throw Error("pack");
  return raw.items.map((x) => {
    if (typeof x.name !== "string" || !x.name.trim() || x.name.length > 60)
      throw Error("name");
    return { name: x.name, puzzle: normalizePuzzle(x.puzzle) };
  });
}
