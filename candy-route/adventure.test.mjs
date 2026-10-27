import { test } from "node:test";
import assert from "node:assert/strict";
import {
  adventurePuzzle,
  adventureIssues,
  adventureScore,
  solveAdventure,
  presetAdventure,
  freshAdventure,
  newAdventureProfile,
  validateAdventure,
  validateCampaign,
  weeklyAdventure,
  botAdventure,
} from "./adventure-rules.js";
import { bestRoute } from "./candy.js";
import { seededValues } from "./studio-rules.js";

test("classic Adventure agrees with the existing DP, signed inputs and circular endpoints", () => {
  for (let n = 1; n <= 8; n++)
    for (let seed = 0; seed < 12; seed++)
      for (const circle of [false, true]) {
        const a = seededValues(seed, n, -5, 8),
          p = adventurePuzzle({
            base: { values: a, circle, budget: 1000, time: 1000 },
          });
        assert.equal(solveAdventure(p).total, bestRoute(a, circle).total);
      }
});
test("new rules have explicit feasible/infeasible cases", () => {
  const base = { values: [4, 5, 4, 9, 3], budget: 1000, time: 1000 };
  let p = adventurePuzzle({ mode: "zones", base, zones: [0, 0, 0, 0, 0] });
  assert.ok(adventureIssues(p, [0, 2, 4]).some((i) => i.code === "zones"));
  assert.equal(solveAdventure(p).total, 14);
  p = adventurePuzzle({ mode: "minimum", base, minimum: 4 });
  assert.equal(solveAdventure(p).total, null);
  p = adventurePuzzle({
    mode: "recharge",
    base: { values: [4, 5, 4], costs: [2, 2, 3], budget: 2 },
    rewards: [4, 0, 0],
  });
  assert.equal(solveAdventure(p).total, 8);
  assert.ok(adventureIssues(p, [2]).some((i) => i.code === "recharge"));
  p = adventurePuzzle({
    mode: "diversity",
    base: { values: [4, 5, 4] },
    types: [0, 1, 2],
    bonus: 5,
  });
  assert.equal(solveAdventure(p).total, 18);
  p = adventurePuzzle({ mode: "delivery", base, finish: 0 });
  assert.equal(
    solveAdventure(p).routes.every((r) => r.includes(0)),
    true,
  );
  p = adventurePuzzle({ mode: "travel", base, start: 4, travel: 0 });
  assert.equal(solveAdventure(p).total, 3);
});
test("diagnostics name specific conflicts, missing houses and resource differences", () => {
  const p = adventurePuzzle({
    base: { values: [5, 9, 4], budget: 1, required: [2] },
  });
  const issues = adventureIssues(p, [0, 1]);
  assert.ok(
    issues.some(
      (x) =>
        x.code === "neighbors" && x.houses.includes(0) && x.houses.includes(1),
    ),
  );
  assert.ok(issues.some((x) => x.code === "required" && x.houses[0] === 2));
  assert.ok(issues.some((x) => x.code === "energy" && x.value === 2));
  assert.deepEqual(adventureIssues(p, [0.5]), [{ code: "indices" }]);
});
test("all presets and three bot strategies stay within bounds", () => {
  for (const mode of [
    "classic",
    "zones",
    "minimum",
    "recharge",
    "diversity",
    "delivery",
    "travel",
  ]) {
    const p = presetAdventure(mode, "test"),
      r = solveAdventure(p);
    assert.notEqual(r.total, null, mode);
    for (const route of r.routes) {
      assert.deepEqual(adventureIssues(p, route), []);
      assert.equal(adventureScore(p, route), r.total);
    }
    const exact = botAdventure(p, "strategist");
    assert.equal(adventureScore(p, exact), r.total);
  }
});
test("campaign unlock constraints and topology validation reject malformed packs", () => {
  const p = presetAdventure();
  assert.throws(() =>
    validateCampaign({
      name: "x",
      levels: [{ name: "one", chapter: 1, unlock: 1, puzzle: p }],
    }),
  );
  assert.throws(() =>
    adventurePuzzle({
      base: {
        values: [1, 2, 3],
        edges: [
          [0, 1],
          [1, 0],
        ],
      },
    }),
  );
  assert.throws(() => adventurePuzzle({ base: { values: Array(17).fill(1) } }));
  assert.throws(() => adventurePuzzle({ base: { values: [1] }, types: [3] }));
});
test("complete state preserves failures, assistance and campaign content; validation is atomic", () => {
  const s = freshAdventure(),
    p = newAdventureProfile();
  s.profiles.p0 = p;
  p.session = {
    puzzle: presetAdventure(),
    name: "test",
    picks: [0],
    secondPicks: [],
    assisted: true,
    checked: false,
  };
  p.records.push({
    day: "2026-10-27",
    mode: "classic",
    score: 0,
    best: 10,
    valid: false,
    assisted: true,
    puzzle: JSON.stringify(p.session.puzzle),
    issue: "neighbors",
  });
  assert.deepEqual(validateAdventure(s), s);
  const broken = structuredClone(s);
  broken.profiles.p0.session.picks = [999];
  assert.throws(() => validateAdventure(broken));
  assert.equal(s.profiles.p0.session.picks[0], 0);
});
test("weekly report excludes future and old attempts and recommends errors without penalizing a break", () => {
  const p = newAdventureProfile();
  for (const [day, valid] of [
    ["2026-10-20", false],
    ["2026-10-21", false],
    ["2026-10-27", true],
    ["2026-10-28", false],
  ])
    p.records.push({
      day,
      mode: "travel",
      valid,
      assisted: false,
      score: valid ? 10 : 0,
      best: 10,
    });
  const r = weeklyAdventure(p, "2026-10-27");
  assert.equal(r.attempts, 2);
  assert.equal(r.wins, 1);
  assert.equal(r.recommendation, "travel");
  assert.equal(weeklyAdventure(p, "2026-12-01").wins, 0);
  assert.equal(p.goal, 3);
});
