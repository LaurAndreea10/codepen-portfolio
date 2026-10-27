import { test } from "node:test";
import assert from "node:assert/strict";
import { createArenaServer } from "./arena-server.mjs";
import { solveAdventure } from "./adventure-rules.js";

test("two remote clients: tokens, server-scored routes, no duplicate scoring, standings", async () => {
  const server = createArenaServer();
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const root = `http://127.0.0.1:${server.address().port}`;
  async function post(path, body) {
    const res = await fetch(root + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return { status: res.status, body: await res.json() };
  }
  try {
    const first = (await post("/rooms", { name: "Laura" })).body;
    assert.ok(first.token);
    const second = (await post("/join", { room: first.room, name: "Player 2" }))
      .body;
    assert.notEqual(first.token, second.token);
    assert.equal(
      (await post("/join", { room: first.room, name: "extra" })).status,
      409,
    );
    assert.equal(
      (await post("/poll", { room: first.room, token: "bad" })).status,
      403,
    );
    assert.equal(
      (
        await post("/submit", {
          room: first.room,
          token: first.token,
          picks: [0, 1],
          score: 999999,
        })
      ).status,
      400,
    );
    const picks = solveAdventure(first.state.puzzle).routes[0];
    assert.equal(
      (
        await post("/submit", {
          room: first.room,
          token: first.token,
          picks,
          score: 999999,
        })
      ).body.results,
      null,
    );
    const final = (
      await post("/submit", {
        room: first.room,
        token: second.token,
        picks: [],
      })
    ).body;
    assert.equal(
      final.results[0].score,
      solveAdventure(first.state.puzzle).total,
    );
    assert.equal(final.results[1].score, 0);
    assert.equal(
      (
        await post("/submit", {
          room: first.room,
          token: second.token,
          picks: [],
        })
      ).status,
      409,
    );
    const board = await (await fetch(root + "/leaderboard")).json();
    assert.equal(board.results.length, 2);
    const denied = await fetch(root + "/leaderboard", {
      headers: { Origin: "https://example.invalid" },
    });
    assert.equal(denied.status, 403);
  } finally {
    server.closeAllConnections();
    await new Promise((r) => server.close(r));
  }
});
test("expired rooms and room caps are enforced", async () => {
  let time = 100;
  const server = createArenaServer({ now: () => time, ttl: 10, maxRooms: 1 });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const root = `http://127.0.0.1:${server.address().port}`;
  const post = (path, body) =>
    fetch(root + path, { method: "POST", body: JSON.stringify(body) });
  try {
    const first = await (await post("/rooms", { name: "A" })).json();
    assert.equal((await post("/rooms", { name: "B" })).status, 503);
    time = 111;
    assert.equal(
      (await post("/poll", { room: first.room, token: first.token })).status,
      404,
    );
    assert.equal((await post("/rooms", { name: "C" })).status, 200);
  } finally {
    server.closeAllConnections();
    await new Promise((r) => server.close(r));
  }
});

test("optional standings file survives restart and malformed files are preserved", async () => {
  const { mkdtemp, readFile, writeFile, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const folder = await mkdtemp(join(tmpdir(), "candy-arena-test-")),
    file = join(folder, "standings.json");
  let server;
  try {
    server = createArenaServer({ storeFile: file });
    await new Promise((r) => server.listen(0, "127.0.0.1", r));
    let root = `http://127.0.0.1:${server.address().port}`;
    const post = async (path, body) => {
      const r = await fetch(root + path, {
        method: "POST",
        body: JSON.stringify(body),
      });
      assert.equal(r.status, 200);
      return r.json();
    };
    const a = await post("/rooms", { name: "A" }),
      b = await post("/join", { room: a.room, name: "B" });
    await post("/submit", { room: a.room, token: a.token, picks: [] });
    await post("/submit", { room: a.room, token: b.token, picks: [] });
    assert.equal(JSON.parse(await readFile(file, "utf8")).length, 2);
    server.closeAllConnections();
    await new Promise((r) => server.close(r));
    server = createArenaServer({ storeFile: file });
    await new Promise((r) => server.listen(0, "127.0.0.1", r));
    root = `http://127.0.0.1:${server.address().port}`;
    assert.equal(
      (await (await fetch(root + "/leaderboard")).json()).results.length,
      2,
    );
    await writeFile(file, "invalid");
    assert.throws(() => createArenaServer({ storeFile: file }));
    assert.equal(await readFile(file, "utf8"), "invalid");
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise((r) => server.close(r));
    }
    await rm(folder, { recursive: true, force: true });
  }
});
