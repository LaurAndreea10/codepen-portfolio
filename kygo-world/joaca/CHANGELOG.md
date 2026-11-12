# Parcul lui Kygo / Kygo’s Park

## 2026.11.12.3 — Toate cele opt extinderi / All eight park extensions

1. **Animații / Animations:** alternating running paws and tail, digging paws and soil, bone pickup arc, a caught disc attached to Kygo’s mouth, gravity-based jumping poses. Reduced motion uses simpler poses without particles.
2. **Plimbare liberă / Free walk:** bounded walkable park, four activity stations, arrow/WASD movement, touchable signs and optional automatic walking to a selected destination.
3. **Decoruri / Scenery:** meadow, forest, beach and snowy park, with distinct vegetation, terrain, scenery and seeded courses. The original levels and progress are preserved.
4. **Competiție combinată / Championship:** Dig → Run → Disc → Hurdles, next-stage transitions, retry after a loss, aggregate score/time, gold/silver/bronze medals and saved championship records. Rules stay fixed during a championship.
5. **Accesorii vizibile / Visible accessories:** scarf, bow tie and crown in four colours, drawn on Kygo in every activity and free walk.
6. **Comenzi ajustabile / Adjustable controls:** 100–160% buttons, centre/left-hand/right-hand clusters and 50–125% pace. Pace below 100% counts as assisted in records and passport results.
7. **Continuarea rundei / Resume:** validated checkpoints preserve digging patches and found bones, processed track events, disc flight, jump state, walk position and championship stage/results. Saves occur after actions, on pause/page hide and every two seconds during play. Recovered rounds open paused.
8. **Portaluri / Portals:** three in-scene portal locations to World, Archipelago and On the Trail. Approach a portal and confirm the destination in an accessible dialog; park state is saved before leaving.

### Compatibility and validation

Park save schema v2 keeps the original `kygo-play-v1` storage key and migrates v1 progress without losing completed stages or personal records. The same pure validator is used by the game and shared backup importer; checkpoints and customisations are included in all profile slots. Old seven/eight-key backups remain supported.

39 Node tests cover native rules, themes, pace, full championship completion, checkpoint rejection/resume, free-walk destinations, legacy migrations, backups and profile isolation. Browser checks cover an in-scene portal, snow/crown customisation, restored walk position, a real Dig championship clear, next-stage transition, and championship reload on stage two. Physical-phone and real screen-reader checks are still not claimed.

The park continues to use a perspective Canvas renderer. The portals in this release belong to the park; this does not claim that all three other engines have new native 3D portal scenes.

## 2026.11.12.2 — Patru moduri / Four play modes

- **Sapă după os / Dig for bones:** 4×4 patches, two digs per patch, three hidden bones and a distance-based scent clue; no time limit. Assisted mode adds an exact distance clue.
- **Aleargă / Run:** three lanes, bone collection, cone collisions, sprint with cooldown, finish distance and a collection target.
- **Prinde discul / Catch the disc:** projected throw trajectory, landing circle, alignment and an explicit catching window. Early presses do not count. Assisted mode aligns Kygo and extends the window.
- **Sari peste obstacole / Jump over hurdles:** gravity-based jumps, timed collisions, clear target and three lives; assisted mode jumps automatically.
- Five deterministic stages per mode; subsequent stages unlock after a win. Separate standard/assisted personal records and replay/next-stage actions.
- RO/EN, light/dark, high contrast, reduced motion, keyboard, semantic digging buttons, on-screen controls, pause on background/blur, optional sound and haptics.
- Perspective Canvas 2D park renderer; no WebGL or external graphics library required. Uses the original Kygo portrait in Dig/Disc and a rear-view drawing for Run/Jump.
- Real wins emit `park:<mode>:<level>` clear events to the World passport; repeated clears do not mint duplicate passport rewards.
- Park progress is included in the common backup and all three local profile slots. Seven-key legacy backups remain readable, with an empty park slot.
- Direct links from Kygo World and the Universe map; completion/history entry and canonical sitemap registration.

### Validation

28 Node tests: 13 park rules and 15 shared-core tests, including old backups and profile isolation.
Repository quality, SEO, generated sitemap, script syntax and local links checked before publication.
Browser checks: a full Dig victory, level unlock, a caught disc, mode switching, controls, pause, bilingual interface, four translated links in World and a park victory producing 100 XP / 15 coins in the shared passport. Physical-phone and real screen-reader verification remain to be done.

### Storage

Completed stages, personal records, customisation, championship results and the active round are stored locally in `kygo-play-v1`. The active round is restored paused after reload. All data remains in this browser unless the player exports a backup.
