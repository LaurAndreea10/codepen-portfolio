# PentArena — Changelog

## 2.1.0 — 2026-10-05

**RO.** Teren pe verticală pentru telefoanele ținute în picioare: fotbalul, air hockey-ul și biliardul se rotesc automat (poarta ta jos, a adversarului sus) și ocupă tot ecranul în loc de o bandă îngustă. Textele, numerele bilelor și bannerele rămân drepte; atingerile, multitouch-ul pentru 2 jucători (J1 jos, J2 sus) și săgețile urmează direcțiile de pe ecran. Baschetul și voleiul rămân pe orizontală, pentru că sunt văzute din lateral, și păstrează sugestia de rotire. Cache-ul offline a fost redenumit ca instalările existente să primească noua versiune.

**EN.** Vertical field for phones held upright: football, air hockey and pool rotate automatically (your goal at the bottom, the opponent at the top) and fill the screen instead of a thin strip. Text, ball numbers and banners stay upright; touches, two-player multitouch (P1 bottom, P2 top) and arrow keys follow on-screen directions. Basketball and volleyball stay landscape because they are side views, and keep the rotate hint. Offline cache renamed so installed copies pick up the new version.

Verificare / Verification: new core check for screen-relative keys when rotated; browser regression now asserts a vertical field at 360×800 and 390×844 and checks that each finger drives its own mallet in both orientations. Real phones still unverified.

## 2.0.0 — 2026-10-05

**RO.** PentArena intră în portofoliu ca joc complet, nu doar ca demo:

- **Carieră în trei ligi** (Bronz, Argint, Aur), fiecare un pentatlon contra unui rival cu viteză și precizie proprii; liga următoare se deblochează când strângi mai multe puncte decât rivalul.
- **2 jucători pe același dispozitiv** la toate cele cinci probe: tastatură separată (W A S D + Space / săgeți + Enter), jumătăți de ecran pe touch, ture alternative la baschet și biliard.
- **Mecanici noi:** fotbal cu sprint, șut încărcat și gol de aur; air hockey cu patru bonusuri (turbo, scut, crosă mare, îngheț) și regula pucului oprit; volei cu spike la fileu, ași și raliuri; baschet cu vânt, coș mobil și ceas de aruncare; biliard cu efect pe bila albă și bilă în mână după fault.
- **AI refăcut:** la baschet calculează traiectoria cu vânt și coș mobil; la biliard alege poziția pentru bila în mână și folosește efect ca să evite scăparea albei.
- **Reluări** cu încetinitorul la goluri și la punctele spectaculoase (se pot sări).
- **Progres:** XP și niveluri, monede, vestiar cu 6 culori și 3 urme ale mingii, 16 realizări, statistici pe sport, provocare zilnică cu semințe pe dată (o singură recompensă pe zi).
- **Accesibilitate:** anunțuri de scor pentru cititoare de ecran, contrast ridicat, mișcare redusă, dialoguri native, butoane de minimum 44 px.
- **PWA offline**, fonturi găzduite local (Fraunces, Inter, JetBrains Mono, licență OFL), backup JSON validat.

**EN.** PentArena joins the portfolio as a full game rather than a demo:

- **Three-league career** (Bronze, Silver, Gold), each a pentathlon against a rival with their own speed and accuracy; the next league unlocks when you out-score the rival.
- **Local two-player** in all five events: split keyboard (W A S D + Space / arrows + Enter), screen halves on touch, alternating turns in basketball and pool.
- **New mechanics:** football sprint, charged shot and golden goal; air hockey with four power-ups (turbo, shield, big mallet, freeze) and a stalled-puck rule; volleyball spikes, aces and rallies; basketball wind, moving hoop and shot clock; pool cue-ball spin and ball in hand after a foul.
- **Reworked AI:** basketball solves the trajectory under wind and a moving hoop; pool chooses a ball-in-hand position and uses draw to avoid scratches.
- **Slow-motion replays** for goals and highlight points (skippable).
- **Progression:** XP and levels, coins, a locker with 6 colours and 3 ball trails, 16 achievements, per-sport stats, date-seeded daily challenge (one reward per day).
- **Accessibility:** screen-reader score announcements, high contrast, reduced motion, native dialogs, 44 px minimum targets.
- **Offline PWA**, self-hosted fonts (Fraunces, Inter, JetBrains Mono, OFL), validated JSON backup.

Verificare / Verification: `test-core.cjs` (headless simulation of all sports, AI, progression, backup) and `test-browser.mjs` (4 viewports, touch and multitouch, dialogs, offline, axe) pass locally in Chromium. Real phones, tablets and screen readers have not been tested yet.

## 1.0.0 — 2026-10-05

- Prima versiune, ca artefact de sine stătător: cinci sporturi contra AI, turneu Pentatlon, trei dificultăți, 8 realizări, RO/EN. / First version as a standalone artifact: five sports against the AI, Pentathlon tournament, three difficulties, 8 achievements, RO/EN.
