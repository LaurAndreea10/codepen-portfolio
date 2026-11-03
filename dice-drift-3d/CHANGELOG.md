# DICE DRIFT 3D — Version History

## 2026-11-03 — v1.0.0 · Finalizat / Completed

- RO: Joc 3D de zbor pentru CodePen Challenge CSS random(). CSS calculează valori `random()` în proprietăți `@property`, jocul le citește cu `getComputedStyle` și construiește din ele valurile de cristale, porțile, paleta lumii și evenimentele Oracolului. Zarul 3D al Oracolului, scânteile de la lovituri și praful de stele din meniu sunt plasate tot de `random()`.
- EN: 3D flight game for the CodePen CSS random() challenge. CSS computes `random()` values in `@property` custom properties; the game reads them with `getComputedStyle` and builds crystal waves, gates, the world palette and Oracle events from them. The Oracle's 3D die, hit sparks and menu stardust are placed by `random()` too.
- Gameplay: cristale, porți cu combo, pereți cu gaură, spirale; zaruri care aruncă unul din 8 mutatori (Nuanță nouă, Furtună de cristale, Timp încetinit, Goana după aur, Fantomă, Oglindă, Porți uriașe, Scut reparat); Oracol la fiecare 25 s; boost cu warp; 3 scuturi (5 în modul asistat).
- Moduri: Zbor clasic (CSS random()) și Oracolul zilei (aceeași lume pentru toți în ziua respectivă, clasament separat).
- Three.js 0.170 din CDN, bloom (UnrealBloomPass), grilă și soare synthwave în shadere, particule, muzică și efecte WebAudio generate.
- RO/EN (și `?lang=`), tastatură/mouse/atingere cu buton BOOST, mod asistat, mișcare redusă, anunțuri pentru cititor de ecran, grafică ÎNALTĂ/ECO cu trecere automată pe ECO, 8 realizări, clasament local, distribuire.
- `index.pen.html` = aceeași versiune într-un singur fișier, pentru CodePen.
- Teste automate în Chromium (calea de fallback JS) la 1280 și 390 px: start, pauză, Oracol, mutatori, game over, salvare în clasament. Calea nativă `random()` (Safari 26+), telefonul fizic și cititorul de ecran rămân de verificat.
