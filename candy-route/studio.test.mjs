import { test } from "node:test";
import assert from "node:assert/strict";
import {
  makePuzzle,
  solveVariant,
  normalizePuzzle,
  routeValid,
  routeScore,
  freshStudio,
  validateStudio,
  parsePack,
  seededValues,
} from "./studio-rules.js";
import { validateState, freshState } from "./game.js";
import { bestRoute } from "./candy.js";

test("classic/circular studio agrees with existing DP for signed random streets", () => {
  for (let n = 1; n <= 10; n++)
    for (let seed = 0; seed < 20; seed++)
      for (const circle of [false, true]) {
        const values = seededValues(seed, n, -9, 9),
          p = makePuzzle(values, circle ? "circle" : "classic"),
          s = solveVariant(p);
        assert.equal(s.total, bestRoute(values, circle).total);
        for (const r of s.routes) {
          assert.ok(routeValid(p, r));
          assert.equal(routeScore(p, r), s.total);
        }
      }
});
test("spacing, count, resource and special house restrictions", () => {
  assert.equal(
    solveVariant(makePuzzle([5, 9, 4, 8], "gap", { gap: 2 })).total,
    13,
  );
  assert.equal(
    solveVariant(makePuzzle([5, 9, 4, 8], "maxk", { k: 1 })).total,
    9,
  );
  assert.equal(
    solveVariant(makePuzzle([-5, -9, -4, -8], "exactk", { k: 2 })).total,
    -9,
  );
  assert.equal(
    solveVariant(makePuzzle([5, 9, 4], "exactk", { k: 3 })).total,
    null,
  );
  assert.equal(
    solveVariant(makePuzzle([5, 9, 4], "energy", { budget: 0 })).total,
    0,
  );
  assert.equal(
    solveVariant(makePuzzle([5, 9, 4], "time", { time: 1 })).total,
    5,
  );
  assert.equal(solveVariant(makePuzzle([5, 99, 4], "closed")).total, 9);
  assert.deepEqual(solveVariant(makePuzzle([5, 1, 4], "required")).routes, [
    [1],
  ]);
  assert.equal(
    solveVariant(normalizePuzzle({ values: [1, 1], required: [0, 1] })).total,
    null,
  );
});
test("tree uses graph edges, not street adjacency", () => {
  const p = makePuzzle([10, 6, 6, 5, 5, 5, 5], "tree"),
    s = solveVariant(p);
  assert.equal(s.total, 30);
  assert.deepEqual(s.routes[0], [0, 3, 4, 5, 6]);
  assert.throws(() =>
    normalizePuzzle({
      values: [1, 2, 3],
      edges: [
        [0, 1],
        [1, 0],
      ],
    }),
  );
});
test("optimal ties counted exactly; route output capped at 50", () => {
  const s = solveVariant(makePuzzle(Array(16).fill(0)));
  assert.ok(s.count > 50);
  assert.equal(s.routes.length, 50);
  assert.equal(s.operations, 65536);
});
test("caps and invalid indices are rejected", () => {
  assert.throws(() => makePuzzle(Array(17).fill(1)));
  assert.throws(() => normalizePuzzle({ values: [NaN] }));
  assert.throws(() => normalizePuzzle({ values: [1], required: [0.5] }));
  assert.throws(() => normalizePuzzle({ values: [1], k: 2 }));
  const p = makePuzzle([2, 3, 4]);
  for (const route of [[0, 0], [0.5], [-1], [3], [0, 1]])
    assert.equal(routeValid(p, route), false);
});
test("backups roundtrip all profiles and preserve exploration assistance; reject atomically", () => {
  const data = freshStudio();
  data.profiles[0].puzzle = makePuzzle([1, 2, 3], "hidden");
  data.profiles[0].picks = [2];
  data.profiles[0].session = { checked: false, assisted: true, scouted: [0] };
  data.profiles[0].core = freshState();
  assert.deepEqual(validateStudio(data, validateState), data);
  const bad = structuredClone(data);
  bad.profiles[0].core = { version: 2 };
  assert.throws(() => validateStudio(bad, validateState));
  assert.equal(data.profiles[0].session.assisted, true);
  for (const mutate of [
    (s) => (s.active = 4),
    (s) => (s.profiles[0].picks = [99]),
    (s) => (s.volume = -1),
    (s) => (s.profiles[0].session.scouted = [0, 1, 2, 3]),
    (s) => (s.profiles[0].records = [{ day: "bad" }]),
  ]) {
    const bad = structuredClone(data);
    mutate(bad);
    assert.throws(() => validateStudio(bad, validateState));
  }
});
test("pack validates whole list before returning and preserves rules", () => {
  const p = makePuzzle([1, 4, 3], "circle");
  const pack = {
    version: 1,
    type: "candy-route-puzzles",
    items: [{ name: "Test", puzzle: p }],
  };
  assert.deepEqual(parsePack(pack), pack.items);
  pack.items.push({ name: "bad", puzzle: {} });
  assert.throws(() => parsePack(pack));
});
test("reproducible seeds, bounded values, no input mutation", () => {
  const v = seededValues("a", 16, -4, 5),
    copy = [...v];
  assert.deepEqual(v, seededValues("a", 16, -4, 5));
  assert.ok(v.every((x) => x >= -4 && x <= 5));
  solveVariant(makePuzzle(v));
  assert.deepEqual(v, copy);
});

test("combined constraints agree with an independent subset oracle", () => {
  for (let seed = 0; seed < 120; seed++) {
    const n = 1 + (seed % 8);
    const values = seededValues(seed, n, -4, 9);
    const p = normalizePuzzle({
      values,
      gap: 1 + (seed % 3),
      circle: seed % 2 === 0,
      k: seed % (n + 1),
      exact: seed % 4 === 0,
      budget: seed % 12,
      time: seed % 15,
      closed: seed % 3 === 0 ? [0] : [],
      required: seed % 5 === 0 ? [n - 1] : [],
      edges:
        seed % 7 === 0
          ? Array.from({ length: n - 1 }, (_, i) => [Math.floor(i / 2), i + 1])
          : null,
    });
    let expected = null;
    for (let mask = 0; mask < 2 ** n; mask++) {
      const chosen = Array.from({ length: n }, (_, i) => i).filter(
        (i) => mask & (1 << i),
      );
      if (chosen.length > p.k || (p.exact && chosen.length !== p.k)) continue;
      if (
        p.closed.some((i) => chosen.includes(i)) ||
        p.required.some((i) => !chosen.includes(i))
      )
        continue;
      if (
        chosen.reduce((s, i) => s + p.costs[i], 0) > p.budget ||
        chosen.reduce((s, i) => s + p.minutes[i], 0) > p.time
      )
        continue;
      let conflict = false;
      if (p.edges)
        conflict = p.edges.some(
          ([a, b]) => chosen.includes(a) && chosen.includes(b),
        );
      else
        for (let a = 0; a < chosen.length; a++)
          for (let b = a + 1; b < chosen.length; b++) {
            const distance = chosen[b] - chosen[a];
            if (distance <= p.gap || (p.circle && n - distance <= p.gap))
              conflict = true;
          }
      if (conflict) continue;
      const score = chosen.reduce((s, i) => s + values[i], 0);
      expected = expected === null ? score : Math.max(expected, score);
    }
    assert.equal(solveVariant(p).total, expected, `seed ${seed}`);
  }
});
