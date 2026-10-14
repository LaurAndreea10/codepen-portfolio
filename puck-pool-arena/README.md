# Puck & Pool Arena — v3.0.0

Air Hockey × Billiards. Browser-only arcade game, built as a standalone HTML/CSS/JavaScript experience.

## Gameplay / Joc
- Four billiard balls, six pockets, one striking puck and right-side goal.
- Pocket = +100 points; puck goal = +50 points.
- Ball-to-ball elastic collisions and wall rebounds with friction.
- Touch/pointer aiming, power and angle sliders, keyboard controls.
- Local best score via LocalStorage; no external libraries or accounts.

## Accessibility / Accesibilitate
- RO/EN switch, dark/light switch, high contrast toggle.
- Reduced motion toggle and respects system reduced-motion preference.
- Keyboard: Space to shoot (outside interactive controls), arrows for angle/power, P to pause.
- Buttons have visible focus, semantic controls, score in text, live status announcements, skip link.
- Responsive canvas and pointer controls for mobile.

## Technical notes
Version 1.1 adds a turn-based local AI in championship mode and 2.5D canvas perspective (not real WebGL 3D). No network multiplayer. The AI chooses a ball target and applies difficulty-based aiming error. Browser-only, zero dependencies.

## Campaign / Campanie
- 12 progressive levels with target scores and shot limits. Unlocks and medals stored locally.
- 3 championship leagues with alternating player and AI shots over up to 3 rounds. Rookie, Challenger and Champion difficulty.
- Neon City, Ocean Depths and Cosmic Orbit arena palettes with optional 2.5D table edge, drop shadows and depth effects. High contrast remains flat for readability.
- LocalStorage campaign key `puckPoolCampaignV1` is separate from the original `puckPoolBest` and `puckPoolPrefs` keys.

## v2.0 expansion (incremental)
- 100 levels, level selector with locking, 10-level progression bands.
- Additional arcade modes: Daily Challenge, Precision, Zen (using the existing core rules; not all modes have distinct scoring yet).
- Six new arena palettes (2.5D styling, not actual WebGL 3D).
- Optional generated sound, fullscreen, mobile focus, AI Coach aiming suggestion.
- Export/import JSON progress with schema checks. Original keys remain unchanged.
- All existing RO/EN, dark/light and high-contrast settings remain; new utility button labels are still partially English.
- **Known gaps:** real WebGL 3D, Arena Builder, power-up shop, unique bosses, genuine per-mode logic, online multiplayer and automated end-to-end accessibility testing are not complete.

## History
- **2026-10-14 · 2.0.0 (incremental):** 100-level progression framework, new arena themes and modes, backup, sound, focus and coaching tools; preserves v1.x.
- **2026-10-14 · 1.1.0:** Progressive levels, AI challenger, three championship leagues, three 2.5D arena styles, local campaign persistence; original v1.0.0 retained.
- **2026-10-13 · 1.0.0:** First playable fusion engine, bilingual UI and accessibility options.

## Manual QA
- [ ] Smoke-test levels 1–12, target/shot limits, next-level button and refresh persistence.
- [ ] Smoke-test three AI difficulties, championship round transitions, league unlocks and arena changes.
- [ ] Test on Android touchscreen (aim, shoot, orientation changes).
- [ ] Test with keyboard only and a screen reader.
- [ ] Verify RO/EN, theme and contrast persistence.
- [ ] Verify reduced motion and scores on mobile.

## 2026-10-14 — v2.1.0 additive integration
- Added keyboard-operable editor controls with pointer placement, undo and clear; obstacle layouts persist in a separate `puckPoolExtrasV1` key.
- Bumpers, magnetic nodes and wall posts now render and participate in physics.
- Added a virtual-coin economy (earn coins from scored points), a two-item cosmetic puck shop and selectable purchased skins.
- Added local progression statistics, preserving existing v1/v2 keys and historical entries.
- JavaScript passed syntax compilation; gameplay, screen-reader, touch and deployment regression testing remain unverified.

## Ten-direction tracking
| Direction | Current scope | Remaining gap |
|---|---|---|
| Arenas & 3D | 2.5D canvas palettes | True WebGL 3D |
| Game modes | Classic, campaign, daily, precision, zen, championship | Distinct rules for every proposed mode |
| Physics | Ball collisions, friction, wall reflection, interactive obstacles | Spin, detailed weights and advanced effects |
| AI opponents | Turn-based AI with three difficulties | Advanced personalities and strategic search |
| Levels & championship | 100-level structure and league framework | Unique level scripting and boss fights |
| Customization | Puck skins, earned coins and cosmetic shop | Full themed catalog and achievement rewards |
| Mobile | Touch controls, focus and fullscreen | Real-device test matrix |
| Accessibility | RO/EN core, themes, keyboard, live updates | Full new-control localization and assistive tech QA |
| Arena builder | Place, remove, save interactive obstacles | Arena JSON import/export and advanced editing |
| Product/portfolio | Local stats, backup, versioned README | Catalog, Arcade World and history indexing confirmation |

## 2026-10-14 · v3.0.0 — expanded feature integration
- Expanded mode selector with Survival, Boss Battle, Trick Shot and Pinball Pool. **These are variant presets using the common simulation, not bespoke mechanics or boss personalities.**
- AI Master tier with improved angle noise and speed; still a heuristic aim model.
- Puck spin modifier, adjustable via accessible range control; optional assisted aim overlay.
- Arena JSON import/export, file size and strict obstacle shape/range checks, preserving `puckPoolExtrasV1`.
- Localized new controls for RO/EN. Keyboard, high contrast, reduced motion and existing saves remain supported.
- No new runtime dependencies.

### Remaining verification and implementation
- True WebGL 3D engine / actual 3D camera is **not implemented**; the game continues to use canvas 2.5D.
- Distinct mechanics and scripted boss fights for all advertised modes, advanced tactical AI opponent, larger shop inventory and multiplayer are **not implemented**.
- Mobile gesture, screen reader, Lighthouse and game-regression test results are **not verified** in a browser.
- Portfolio hub, Arcade World, Finalizat and Istoric catalog registration requires separate integration checks.

## 2026-10-14 · v3.0.1 — easier pocketing
- Default pocket capture radius widened from 25 to 47 game units.
- Player can choose Easy (47), Normal (35), or Pro (25) pocket tolerance, persisted locally.
- Optional aim assist now gently corrects shots toward the nearest ball only when already aimed within roughly 14°.
- Pocket artwork scales with the chosen collision radius; legacy Pro mode retains original capture radius.
- Manual real-device gameplay and assistive technology QA still pending.
