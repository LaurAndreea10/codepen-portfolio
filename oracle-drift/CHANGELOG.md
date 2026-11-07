# ORACLE DRIFT — Version History

## 2026-11-07 — v1.0.0 · Finalizat / Completed

- RO: Joc nou care combină Random Constellation, DICE DRIFT 3D și VOID ORACLE: observator cu cinci constelații și oracol CSS `random()` (profeție, trei zaruri, regula arenei, nuanța lumii, ținta), zbor 3D în care fiecare obiect vine dintr-un element `.seed` cu valori `random()`, arenă cu două valuri și boss în trei faze cu tiparul constelației, opt reguli, Nova, cicluri tot mai grele.
- EN: New game combining Random Constellation, DICE DRIFT 3D and VOID ORACLE: a five-constellation observatory with a CSS `random()` oracle, a 3D flight built from `random()` seeds, an arena with two waves and a three-phase boss per constellation, eight rules, Nova and harder cycles.
- RO/EN, tastatură/mouse/atingere, foc automat, mod asistat, mișcare redusă, sunet comutabil, record local.
- Teste automate în Chromium (calea de fallback JS) la 1280 și 390 px: observator, aruncare din nou, zbor, arenă, boss, constelație aprinsă, pauză, game over. Calea nativă `random()` (Safari 26+), telefonul fizic și cititorul de ecran rămân de verificat.
