# Carpați Enduro — istoric / changelog

## 2.0.0 — 2026-10-29 · Expedition Studio

- Păstrează meniul, cariera de 24 niveluri și progresul V1; adaugă un centru cu zece secțiuni RO/EN.
- Zece discipline noi, trei variante de rută, serii de trei etape, misiuni și contract săptămânal cu recompense unice.
- Editor cu 18 tipuri de teren, profil modelabil prin drag sau valori numerice, Undo/Redo, validare și JSON portabil.
- Presiune/suspensie cu efect în fizică, distribuție de frânare, trepte/ambreiaj opționale, șase bonusuri și categorii de record după reguli.
- Joc pe rând pentru 2–4 jucători, ghost/replay cu seek și camere, analiză și card PNG.
- Confort: poziții individuale ale comenzilor, sensibilitate, grupare pentru o mână și mod economic.
- Backup validat, recuperare, patru sloturi și reluare de la checkpoint ca antrenament; recompense idempotente și cronometre legate de cursă.
- Service worker limitat la cache-urile Carpați Enduro; actualizările așteaptă închiderea paginilor vechi.
- Studiu de caz RO/EN, arhivă evenimente și bridge de rezultate pentru integrarea Arcade World într-un PR separat.
- Livrarea este un folder static (`index.html` + `expedition-core.js` + PWA), fără build.
- Nu sunt conectate multiplayer live, lobby, clasament global sau cloud. Fotografia folosește randarea 2D. Vezi FEATURE-COVERAGE.md pentru subpunctele rămase și QA.md pentru limitele verificării.

## 1.0.0 — 2026-10-29 · Finalizat

- RO: joc moto 3D (Three.js 0.170 ca ES module, rezervă 2D clasic) care combină enduro, motocross și trial.
  - Carieră pe 24 de niveluri, de la Nivelul 1, în 8 regiuni, cu duel cu campionul la final de regiune.
  - 9 moduri: Cursă, Contratimp cu ghost, Trial, Hill Climb, Supraviețuire, Stunt, Eliminare, Duel, Antrenament liber; provocarea zilei și coduri de provocare.
  - Școala de pilotaj: 7 lecții ghidate cu obiective bifate pe ecran și duel cu antrenorul AI.
  - Evenimente sezoniere: Halloween, Ziua României, Crăciun, Mărțișor, Paște (dată ortodoxă calculată), Vacanța de vară — câte trei provocări și un model exclusiv.
  - Vreme: ploaie cu bălți, ninsoare, ceață, frunze; zi, apus, noapte cu far.
  - Magazin (12 modele, 5 căști, 5 efecte), recompense (bonus zilnic pe 7 zile, rang, realizări), garaj cu 5 motociclete și upgrade-uri.
  - Camere: Lateral, Cinematic, Urmărire, Cască (POV); sunet de motor, vânt și ploaie; vibrații pe mobil cu intensitate reglabilă.
  - Accesibilitate: tastatură, controller, butoane mari repoziționabile, mod cu 2 butoane, accelerație automată, asistență la echilibru, viteză de joc redusă, contrast ridicat, mișcare redusă, RO/EN, dark/light.
  - PWA: manifest, service worker, joc offline după prima vizită.
  - Teste automate în Chromium (desktop și telefon emulat, 3D și fallback 2D). Telefonul fizic și cititorul de ecran rămân de verificat.
- EN: 3D motorcycle game mixing enduro, motocross and trial: 24-level career from Level 1, 9 modes, riding school, seasonal events, weather, shop and rewards, four cameras, haptics, full accessibility options and an offline PWA. Automated Chromium checks; real phone and screen reader remain unverified.

