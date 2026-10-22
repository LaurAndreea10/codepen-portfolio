# Verification · 22 October 2026

## Confirmed locally

- Ten Node groups passed: category boundaries and adjacent values, kg conversion, strict invalid-value handling, backup validation and artwork roundtrip, malformed input, statistics, deterministic daily seed, accuracy score and share-code roundtrip.
- Twelve browser flow groups passed in headless Chromium: scale/unit roundtrip; keyboard and hold; studio drawing/undo/redo/gallery/PNG; collection/favorites/duplicate/delete/recovery; valid and invalid import; all nine game modes and once-per-day XP; timed round/pause/resume; settings/RO-EN/tutorial/small-screen layout; axe scans; persistent/offline reload, direct single-file use and unavailable local storage.
- At 320 px, all five areas had no horizontal document overflow with enlarged text enabled. Desktop checked at 1200 px.
- Axe WCAG 2 A/AA and 2.1 AA scans: no violations reported in the five sampled panels. This is not a complete accessibility certification.
- Actual certificate PNG download and actual service-worker offline reload exercised in Chromium.

## Not confirmed

- Physical Android/iOS device interaction, mobile browser installation and Safari/Firefox behavior.
- Human screen-reader testing and perceived audio quality.
- Production deployment, public URLs for the proposed Studio and CI until the integration PR is run/merged.
- No claims about an official CodePen challenge evaluation beyond the repository's existing Jest suite.

Automated UI checks are in `tests/browser.mjs`. No remote service, global leaderboard, account sync or online multiplayer is included; championship AI and two-player play run locally.

The portfolio integration also passed the retained classic in-browser test runner and 16 root Jest tests with 100% statements/branches/functions/lines locally. CI is still unconfirmed until the PR jobs run.
