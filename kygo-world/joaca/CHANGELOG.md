# Parcul lui Kygo / Kygo’s Park

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

Only completed stages and personal records are saved in `kygo-play-v1`. An unfinished round restarts when the page reloads. All game data remains in this browser unless the player exports a backup.
