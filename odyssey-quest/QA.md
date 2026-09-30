# Verification · 2026-09-30

## Passed

- Pure engine: all 120 state transitions, repeated rewards, purchases, 360 deterministic variants across three difficulties, seeded plans, corrupt backup rejection, v1 migration, workshop validation and Europe/Bucharest date boundaries.
- Chromium interaction run: all 120 trials solved through rendered controls; persisted completion after reload; no repeated story currency.
- Story, Explore, Short, Daily, Challenge, Tournament, Zen, Quiz, Navigator, Duo and Workshop started and interacted with.
- Pause blocks a memory selection; timer expiration, time extension and timer disabling work.
- Profile switching preserves completed and fresh profiles independently.
- Settings, text enlargement, language and theme changes work.
- Backup download is valid v2 JSON; invalid import retains current progress.
- Layout checks at 390px and 320px with 130% text pass. The map alone intentionally scrolls sideways.
- axe-core WCAG 2 A/AA and 2.1 AA scan: zero violations in the checked game view. This is not a complete accessibility certification.
- Service worker registration and full offline reload preserve the app and progress.
- No browser JavaScript exceptions in the interaction run.

## Still requires real-device confirmation

- Android/Samsung install prompt, vibration and mobile keyboard behavior.
- TalkBack/VoiceOver reading order and real switch hardware.
- Audio across browsers; operating systems may restrict playback.
- Human checks of every screen in every preference combination.
- Automated tests do not establish Lighthouse performance scores or guarantee search indexing.

Public release checks for portfolio and Arcade are recorded separately after publishing.

## Additional final checks

- The self-contained HTML opens and exposes all 11 modes and 12 chapter controls.
- Trial selection, automatic scanning and Duo cooperation were exercised.
- The updated scene uses SVG and packaged symbol fonts; no remote font request is required.
- Existing portfolio SEO and quality scripts pass with 3 featured + 9 recent evidence entries.
- The local RO portfolio shows Odyssey in recent completions (five entries) and history; EN includes the play link.
- The Arcade mobile More panel exposes Odyssey even when the legacy mTab function is absent. Its floating controls are moved above the tab bar.
- The virtual-origin iframe test accepts the correct frame’s score and ignores a message from the parent window, then removes the iframe URL on close.
- Publication completed through GitHub on 2026-09-30. Pages deployment availability is checked separately.
- Version 2.0.1 regression: the solved trial includes Next in automatic scanning. Full 120-trial, axe, layout and offline checks pass again.
