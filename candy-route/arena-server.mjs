// Optional self-hosted Arena. No server is contacted by the game until a user connects.
import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync, renameSync } from "node:fs";
import { pathToFileURL } from "node:url";
import {
  presetAdventure,
  adventureIssues,
  adventureScore,
  solveAdventure,
} from "./adventure-rules.js";
export function createArenaServer({
  allowedOrigins = ["https://laurandreea10.github.io"],
  now = Date.now,
  ttl = 30 * 60 * 1000,
  storeFile = "",
  maxRooms = 50,
} = {}) {
  const rooms = new Map(),
    rates = new Map();
  let leaderboard = [];
  if (storeFile) {
    try {
      const raw = JSON.parse(readFileSync(storeFile, "utf8"));
      if (!Array.isArray(raw) || raw.length > 100) throw Error();
      leaderboard = raw.map((r) => {
        if (
          !r ||
          typeof r.name !== "string" ||
          r.name.length > 30 ||
          !Number.isInteger(r.score) ||
          r.score < 0 ||
          r.score > 2000 ||
          !Number.isInteger(r.best) ||
          r.best < r.score ||
          r.best > 2000 ||
          typeof r.at !== "number"
        )
          throw Error("Invalid leaderboard");
        return { name: r.name, score: r.score, best: r.best, at: r.at };
      });
    } catch (e) {
      if (e.code !== "ENOENT")
        throw Error("Cannot read Arena leaderboard; refusing to overwrite it.");
    }
  }
  const persist = () => {
    if (!storeFile) return;
    writeFileSync(storeFile + ".tmp", JSON.stringify(leaderboard));
    renameSync(storeFile + ".tmp", storeFile);
  };
  function clean() {
    for (const [id, room] of rooms) if (room.expires <= now()) rooms.delete(id);
    for (const [ip, r] of rates) if (r.until <= now()) rates.delete(ip);
  }
  function view(room) {
    return {
      puzzle: room.puzzle,
      players: room.players.map((p) => ({
        id: p.id,
        name: p.name,
        submitted: p.picks !== null,
      })),
      results: room.results,
    };
  }
  const fail = (message, status = 400) =>
    Object.assign(new Error(message), { status });
  function playerName(value) {
    if (
      typeof value !== "string" ||
      !value.trim() ||
      value.trim().length > 30 ||
      /[\u0000-\u001f]/.test(value)
    )
      throw fail("Invalid display name");
    return value.trim();
  }
  const server = createServer(async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    const origin = req.headers.origin;
    if (origin && !allowedOrigins.includes(origin)) {
      res.writeHead(403).end(JSON.stringify({ error: "Origin not allowed" }));
      return;
    }
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    }
    if (req.method === "OPTIONS") {
      res.writeHead(204).end();
      return;
    }
    try {
      clean();
      const ip = req.socket.remoteAddress ?? "unknown";
      if (!rates.has(ip)) {
        if (rates.size >= 2000) throw fail("Server busy", 503);
        rates.set(ip, { count: 0, until: now() + 60000 });
      }
      const rate = rates.get(ip);
      if (++rate.count > 180) throw fail("Too many requests", 429);
      if (req.method === "GET" && req.url === "/leaderboard") {
        res.end(
          JSON.stringify({
            results: [...leaderboard]
              .sort((a, b) => b.score - a.score || a.at - b.at)
              .slice(0, 100),
          }),
        );
        return;
      }
      if (req.method !== "POST") throw fail("Endpoint not found", 404);
      let text = "";
      for await (const chunk of req) {
        text += chunk;
        if (Buffer.byteLength(text) > 20000)
          throw fail("Payload too large", 413);
      }
      let body;
      try {
        body = JSON.parse(text);
      } catch {
        throw fail("Invalid JSON");
      }
      if (!body || Array.isArray(body) || typeof body !== "object")
        throw fail("Invalid request");
      if (req.url === "/rooms") {
        if (rooms.size >= maxRooms) throw fail("Room limit reached", 503);
        const name = playerName(body.name);
        let roomId;
        do {
          roomId = randomBytes(4).toString("hex");
        } while (rooms.has(roomId));
        const puzzle = presetAdventure("classic", roomId, 8),
          room = {
            puzzle,
            expires: now() + ttl,
            players: [],
            results: null,
            best: solveAdventure(puzzle).total,
          };
        const player = {
          id: "p1",
          name,
          token: randomBytes(24).toString("hex"),
          picks: null,
        };
        room.players.push(player);
        rooms.set(roomId, room);
        res.end(
          JSON.stringify({
            room: roomId,
            player: player.id,
            token: player.token,
            state: view(room),
          }),
        );
        return;
      }
      if (typeof body.room !== "string" || !/^[a-f0-9]{8}$/.test(body.room))
        throw fail("Invalid room");
      const room = rooms.get(body.room);
      if (!room) throw fail("Room expired or missing", 404);
      if (req.url === "/join") {
        if (room.players.length >= 2) throw fail("Room full", 409);
        const player = {
          id: "p2",
          name: playerName(body.name),
          token: randomBytes(24).toString("hex"),
          picks: null,
        };
        room.players.push(player);
        res.end(
          JSON.stringify({
            room: body.room,
            player: player.id,
            token: player.token,
            state: view(room),
          }),
        );
        return;
      }
      const player = room.players.find(
        (p) => typeof body.token === "string" && p.token === body.token,
      );
      if (!player) throw fail("Invalid player token", 403);
      if (req.url === "/poll") {
        res.end(JSON.stringify(view(room)));
        return;
      }
      if (req.url !== "/submit") throw fail("Endpoint not found", 404);
      if (player.picks !== null) throw fail("Route already submitted", 409);
      if (room.players.length !== 2)
        throw fail("Wait for the second player", 409);
      if (adventureIssues(room.puzzle, body.picks).length)
        throw fail("Invalid route");
      player.picks = [...body.picks];
      if (room.players.every((p) => p.picks !== null)) {
        const results = room.players.map((p) => ({
          name: p.name,
          score: adventureScore(room.puzzle, p.picks),
          best: room.best,
        }));
        const next = [
          ...leaderboard,
          ...results.map((r) => ({ ...r, at: now() })),
        ].slice(-100);
        const previous = leaderboard;
        leaderboard = next;
        try {
          persist();
          room.results = results;
        } catch {
          leaderboard = previous;
          player.picks = null;
          throw fail("Could not persist result", 503);
        }
      }
      res.end(JSON.stringify(view(room)));
    } catch (e) {
      res
        .writeHead(e.status ?? 500)
        .end(JSON.stringify({ error: e.status ? e.message : "Server error" }));
    }
  });
  return server;
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const port = Number(process.env.CANDY_ARENA_PORT ?? process.env.PORT ?? 3377);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw Error("Invalid port");
  const server = createArenaServer({
    allowedOrigins: (
      process.env.CANDY_ARENA_ORIGINS ?? "https://laurandreea10.github.io"
    )
      .split(",")
      .map((s) => s.trim()),
    storeFile: process.env.CANDY_ARENA_STORE ?? "",
  });
  server.listen(port, process.env.CANDY_ARENA_HOST ?? "127.0.0.1", () =>
    process.stdout.write(`Candy Route Arena listening on port ${port}\n`),
  );
}
