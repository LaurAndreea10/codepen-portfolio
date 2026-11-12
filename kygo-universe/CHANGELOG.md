# Universul Kygo / Kygo Universe

## 2026.11.12.3 — Park exploration, championship and resumable saves

- All eight park extensions: activity animations, free walking, four scenes, four-stage championship/medals, visible accessories, one-hand controls/pace, active-round checkpoints and in-scene park portals.
- Shared backup validation reuses the pure park engine validator for both v1 and v2 saves. Local profile slots include checkpoints and championship state.
- Existing realistic-art changes in World, Archipelago and On the Trail are retained.
- [Play](../kygo-world/joaca/) · [Full details and verification](../kygo-world/joaca/CHANGELOG.md).

## 2026.11.12.2 — Kygo’s Park

- Four new World activities: Dig for bones, Run, Catch the disc and Jump over hurdles, each with five stages and distinct rules.
- Park wins count in the World passport. Park progress is included in the eight-key backup schema and profile slots; seven-key legacy backups are migrated safely.
- New mode links in World and on the Universe map. [Play](../kygo-world/joaca/) · [Park release notes](../kygo-world/joaca/CHANGELOG.md).

## 2026.11.12.1 — Shared local universe

- New bilingual hub with linked island map, shared navigation and explicit engine bridges.
- Local named passport, explorer XP, stamps, six achievements and three device profiles.
- Real clear events from World, Archipelago and Trail; replay-safe rewards; historical progress migration does not count as today's event.
- Three-chapter cross-game campaign, daily and weekly objectives, seasonal reward claims and year-round World edition replay.
- Passport cosmetic workshop with previews, purchase confirmation and island decoration. These cosmetics do not replace native 3D inventories.
- Shared preferences, four camera presets on compatible scenes, graphics quality caps, separate music/effect volumes, key remapping and a one-hand preset.
- Allowlisted versioned backup, import preview, explicit replacement confirmation, recovery snapshot and rollback; unrelated product keys remain untouched.
- Bounded local result history, assistance flag, copy/share text and PNG result cards. Per-difficulty ranking remains partial.
- Per-game offline workers and coherent versioned cache shells; offline/GPU/physical-phone QA still pending.
- Fix World language handler overwriting the Archipelago link with the Trail URL.
- Add exact 126-item ledger; **the complete 126-item programme is not finished**.

### Verification

`node --test kygo-universe/tests/core.test.cjs` — 12 tests pass.
All game inline scripts and shared scripts pass Node syntax checks.
Repository checks pass: `scripts/portfolio-quality.mjs`, `scripts/seo-audit.mjs` and deterministic `scripts/generate-sitemap.mjs` output. Portfolio HTML stays within its 150,000-byte budget.
Browser: three game bridges load; profile saves; RO/EN and contrast work; separate profile starts with empty progress; achievement reward/purchase/decor toggle work; pause key remaps; a real World clear is recorded with score/time/assistance.

### Remaining

See `features.json` and `roadmap.html` for every numbered requirement and evidence. Backend-dependent work has no configured service, credentials or protocol. New shared 3D models/portals, in-world wardrobe and furniture, full mobile/assistive-tech/offline QA, and a rendered video trailer are not claimed as delivered.
