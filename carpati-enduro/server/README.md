# Carpați Enduro online server

A dependency-free Node HTTP server for the existing GitHub Pages game. Implements password accounts, session tokens, private cloud saves with optimistic revisions, private four-player rooms, host/readiness/start coordination, live position exchange, co-op completion and a community leaderboard. The client is under Expedition Studio → Friends → Online.

## Run

Requires Node 20 or newer. From this directory:

```sh
node server.mjs
```

Defaults: port `8787`; private data outside the website folder at `~/.carpati-enduro-data`; allowed browser origin `https://laurandreea10.github.io`.

Environment variables:

- `PORT`: server port.
- `ENDURO_DATA`: persistent private directory; do not put it in a publicly served static folder.
- `ENDURO_ORIGINS`: comma-separated exact allowed origins. Add the local preview origin only for local testing.

Place the server behind HTTPS on a host with persistent disk. In the game, enter that HTTPS origin; create an account or sign in. No default destination, credentials or account are embedded. Tokens stay in page memory and expire after 24 hours; a server restart also signs everyone out. Passwords use salted scrypt hashes. There is no third-party identity service or email collection.

GitHub Pages cannot execute this Node server. No production server has been provisioned or configured by this PR; a reachable HTTPS host is still required. The code and API are tested, but a deployed cross-device browser session remains unverified. Do not describe online features as publicly active until such a host is deployed and configured.

## Cloud saves

Check the cloud revision before upload. A competing write returns HTTP 409 instead of overwriting newer progress. Download/restore uses the game's backup validation and retains the previous local recovery copy. Cloud snapshots are private to the signed-in player; JSON bodies have a 1.5 MB size limit.

## Live rooms

The host chooses a standard seeded race. At least two players must join and mark themselves ready. Start uses a shared server timestamp. The client publishes poses at up to four updates per second and polls at roughly three updates per second. This is live state exchange, with the latency of HTTP polling; it is not rollback netcode. Standard online settings use the base Enduro bike, no upgrades or bonuses, normal speed and balance assist 2; the player's local garage settings are restored afterwards.

Rooms and sessions are held in one process; idle rooms expire after 30 minutes. Accounts, cloud snapshots and the last 5,000 community results survive restarts. Run one server process against each data directory. Back up that private directory at the host.

The result endpoint checks membership, start time, bounded poses, plausible forward movement and minimum finish distance. It does not re-simulate clients, so the leaderboard is explicitly labelled **community**, not cheat-proof competition. Standalone local records never silently become global scores.

## Tests

From the repository root:

```sh
node --test carpati-enduro/tests/server.test.mjs
```

Tests use temporary storage and synthetic credentials. They cover login/hash storage, rejected origins, unauthenticated access, per-user save isolation, concurrent revision conflicts, lobby roles/readiness, live poses, invalid data and idempotent result submission.
