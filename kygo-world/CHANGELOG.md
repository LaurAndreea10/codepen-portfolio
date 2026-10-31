# Kygo World — istoric al versiunilor / Version history

## 2026-10-31 · Kygo: Pe Urme v1.2.0 · Doar joacă, Kygo ca în logo / Pure play, Kygo like the logo
- RO: Kygo are acum corpul din logo: toy poodle roșcat cu tunsoare teddy, cap rotund și pufos, urechi mari, coadă pompon, papion alb cu buline și limbuța afară.
- Am scos toate panourile cu întrebări; totul se joacă direct în lumea 3D:
  - **Conacul bântuit**: 6 fantome ascunse (lătratul le scoate din ascunzătoare, le prinzi atingându-le; în Aventură fug puțin), 5 dovleci de decorat cu E (zâmbăreț, fioros, pisicuță, steluțe — apeși din nou pentru alt model) și 18 oase-recompensă de mâncat.
  - **Arena sporturilor**: 5 mingi ascunse prin tufișuri, 3 goluri date împingând mingea cu botul în poartă și 18 biscuiți. Reflectoarele și tabela se aprind pe măsură ce progresezi.
- Urma de miros duce la cea mai apropiată țintă; Spațiu (sau modul un singur buton) îl lasă pe Kygo să facă singur totul, inclusiv decoratul și golurile. Stelele vin acum din timp în Aventură; Plimbare n-are cronometru.
- EN: Kygo now has the logo's body: a red teddy-cut toy poodle with a polka-dot bow tie. All quiz panels are gone; everything is played in 3D — catch hidden ghosts, decorate pumpkins and eat treats in the Manor; find hidden balls, nose the football into the goal and munch biscuits in the Arena. Auto-follow and one-switch mode can complete everything.
- Verificat automat în Chromium: ambele regiuni terminate cap-coadă doar cu mersul automat, fără erori JS. Telefonul fizic, vocile și cititorul de ecran rămân neconfirmate. / Both regions completed headlessly via auto-follow; real devices remain unverified.

## 2026-10-31 · Kygo: Pe Urme v1.1.0 · Finalizat / Completed
- RO: joc nou în Kygo World, la [`pe-urme/`](pe-urme/), accesibil din bara de moduri (🐩 Pe Urme 3D). Kygo, toy poodle roșcat, explorează în 3D (Three.js) și găsește jucării pe urma mirosului, care e transmisă în trei feluri deodată: dâră vizuală, bipuri stereo mai rapide pe măsură ce se apropie și vibrații. Lătratul-sonar (B) spune vocal ce e în jur, la câți pași și în ce direcție; Spațiu pornește mersul automat.
  - **Regiunea 1 · Conacul bântuit** (eveniment Halloween): conacul pornește gri și se colorează cu fiecare jucărie. Provocări: numărătoarea BooScary, traducătorul Ghost Talk, cântarul Pumpkin Weigh-In și memoria Candy Route (cu indicii după două greșeli).
  - **Regiunea 2 · Arena sporturilor** (Olimpiada lui Kygo): fiecare probă aprinde un reflector și urcă scorul pe tabelă. Provocări: aruncarea la coș (Basket vs AI, cu zonă verde auzită și simțită), loviturile de departajare (PentArena, portarul se trădează aplecându-se), lovitura de biliard cu pucul (Puck & Pool, țintire „cald-rece” după înălțimea sunetului) și toboganul cu colaci (SlideStorm, banda se aude în stânga, la mijloc sau în dreapta).
  - Harta lumii (G) cu progres separat pe regiune; Coasta, Grădina și Livada și Bucătăria apar ca regiuni viitoare.
  - Accesibilitate: narațiune vocală, subtitrări pentru sunete, contrast ridicat, mod daltonism, mișcare redusă, text mare, fontul Atkinson Hyperlegible, mod un singur buton (scanare automată a opțiunilor), viteză reglabilă și mod Plimbare fără cronometru și fără eșec. RO/EN, dark/light, tastatură, touch cu joystick.
- EN: new game inside Kygo World at [`pe-urme/`](pe-urme/), linked from the mode bar. Kygo, a red toy poodle, explores in 3D and finds toys by scent (visual trail, stereo beeps, vibration) and a spoken bark sonar. Two regions — the Haunted Manor and the Sports Arena — with 8 challenges inspired by BooScary, Ghost Talk, Pumpkin Weigh-In, Candy Route, Basket vs AI, PentArena, Puck & Pool and SlideStorm. World map with per-region progress; narration, captions, high contrast, colour-blind mode, reduced motion, one-switch mode and a no-fail Stroll mode.
- Verificat automat în Chromium (WebGL software): toate cele 8 provocări jucate cap-coadă, ecranele de final, harta și călătoria între regiuni, fără erori JS. Telefonul fizic, vocile de sinteză și cititorul de ecran rămân neconfirmate. / Automated Chromium checks of all 8 challenges, win screens and region travel; real phone, speech voices and screen reader remain unverified.

## 2026-10-16 · v2026.10.16.2 · Randare fluidă și atlas reparat / Smoother rendering and repaired atlas
- Povestea rulează la până la 30 FPS pe mobil (înainte 20) și 60 FPS pe ecrane mari (înainte 30); timpul simulării rămâne independent de ritmul desenării. / Story rendering now targets up to 30 FPS on mobile (was 20) and 60 FPS on larger screens (was 30); simulation timing stays independent of rendering cadence.
- Atlasul de colecționabile corupt a fost înlocuit cu un WebP transparent valid, optimizat la 768×576; decuparea ține cont separat de lățimea și înălțimea celulelor. / Replaced the corrupt collectible atlas with a valid optimized 768×576 transparent WebP; sprite cropping now uses each cell's actual width and height.
- Ecranul static nu mai redesenează inutil în meniu sau pe pauză; scena se actualizează la comenzi și în timpul jocului. / Static scenes no longer redraw in the menu or while paused; input and active gameplay still refresh immediately.
- Progresul salvat, modurile RO/EN, contrastul ridicat și mișcarea redusă rămân păstrate. / Saved progress, RO/EN, high contrast, and reduced-motion support are preserved.

## 2026-10-16 · Obiecte realiste și randare mai rapidă / Realistic objects and faster rendering
- Obiectele de colecție, obstacolele și poarta folosesc atlasuri foto-realiste cu fundal transparent, în aceeași lumină caldă ca sprite-ul lui Kygo. / Collectibles, hazards, and the finish gate now use photorealistic transparent sprites lit to match Kygo.
- Sprite-urile și benzile de cursă sunt pregătite o singură dată și refolosite; au fost eliminate umbrele blurate calculate la fiecare cadru. / Sprites and racing lanes are pre-rendered and reused; per-frame blurred shadows were removed.
- În contrast ridicat rămâne randarea simplă cu contururi clare. / High-contrast mode keeps the simple high-visibility shapes.


## 2026-10-15 · Grafică realistă / Realistic graphics
- Scena Poveste folosește un peisaj panoramic realist; fundalul nu mai este acoperit de un filtru albastru și de un câmp plat. / Story mode now uses a realistic panoramic landscape without the blue tint and flat grass overlay.
- Traseul, obiectele de colecție, obstacolele, fanioanele și poarta sunt desenate cu texturi, umbre și forme canvas; sprite-ul lui Kygo rămâne neschimbat. / The path, collectibles, obstacles, flags, and gate use canvas shading and textures; Kygo’s sprite stays unchanged.
- Contrastul ridicat, edițiile sezoniere și modul RO/EN rămân compatibile. / High contrast, seasonal editions, and RO/EN remain supported.
- Integrat în `main` prin [PR #99](https://github.com/LaurAndreea10/codepen-portfolio/pull/99) pe 15 octombrie 2026. / Merged into `main` through [PR #99](https://github.com/LaurAndreea10/codepen-portfolio/pull/99) on 15 October 2026.


Acest fișier rezumă etapele importante. Fiecare link duce la commitul GitHub cu codul exact al acelei versiuni. Istoricul complet al tuturor modificărilor rămâne în GitHub. Datele sunt în fusul Europe/Bucharest. / This file summarizes major milestones; linked commits preserve the exact code.

## 2026-10-15 · Poveste și mișcare / Story and movement
- Povestea primește cinci acte bilingve afișate în panoul de capitol și în rezultatul nivelului. / Added five bilingual story acts in the chapter panel and level result.
- Crengile joase introduc o eschivă nouă: butonul „Alunecă” pe touch și tasta Shift; în modul fără eșec, Kygo alunecă automat pentru a evita impactul. / Low branches add a slide dodge with a touch button or Shift; safe mode auto-slides to avoid impact.
- S-au păstrat progresul local existent, structura salvărilor și trecerea manuală prin „Următorul nivel”. / Existing local progress, save shape, and manual Next-level transition are preserved.
- Verificări locale: sintaxa JavaScript, maparea celor cinci acte, controalele de alunecare și forma salvării. / Local checks cover JavaScript syntax, all five acts, slide controls, and unchanged save shape.
- Integrat în `main` prin [PR #98](https://github.com/LaurAndreea10/codepen-portfolio/pull/98) pe 15 octombrie 2026. / Merged into `main` through [PR #98](https://github.com/LaurAndreea10/codepen-portfolio/pull/98) on 15 October 2026.

## 2026-09-29 · v1.4.1 · Încărcare mai rapidă / Faster loading
- Imaginile au dimensiunea folosită efectiv în joc (828 KB → 348 KB la prima încărcare; Lighthouse performanță 79 → 95), cu aceeași scenă desenată. Bifele și glisoarele din Setări au zone de atingere mai mari. / Images resized to what the game draws; larger touch targets in Settings. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/db840adda2cb7dfb440e5a14601fef8d1ce4cc32)

## 2026-09-27 · v1.4 · 100 de niveluri / 100 levels
- Story are 100 de niveluri în 25 de capitole, cu trasee generate după nivel, obstacole graduale și bonus la fiecare 10 niveluri. Progresul existent rămâne salvat. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/cc3dbb74f0dd3afb80526851864d068ea7e31898)
- Ecran de rezultat cu „Următorul nivel”, „Reîncearcă nivelul” și „Joacă din nou”. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/5a6a0c6ffa4e9fdaef859712c7b8502597fed79f)

## 2026-09-27 · v1.3 · Recompense canine / Dog rewards
- Oasele înlocuiesc moneda afișată; biscuiții sunt recompense de traseu, iar salvările vechi sunt păstrate. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/9961681508572297076c7bef5e489e07e3b19eca)
- Colecție de biscuiți și frisbee-uri, cu obiective repetabile și bonusuri. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/3e8cebebc291a648c30717f7745721a3bdeccde1)

## 2026-09-27 · v1.2 · Calendar de evenimente / Event calendar
- Edițiile de Paște, Halloween și Crăciun au intervale active și numărătoare inversă. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/98d596530b030f3a4184ac160b988308d58c12a2)

## 2026-09-26 · v1.1 · Ediții și mobil / Editions and mobile
- Edițiile Halloween, Paște și Crăciun. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/cf44e278b7b11999c683ea1f4d7af6c58759bb3a)
- Vedere de joc dedicată pe mobil, fără text peste imagine. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/83ffb14ded9ff8f6ff3d9c7f87db4864aa42e054)
- Butonul Start tactil și randarea Story corectate. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/2ba1de16a138a98b7b5e29669f0968a779915499)
- Cele patru lumi tematice originale. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/ae04e881300ba274572ac2352104879628033e52)

## 2026-09-24–25 · v1.0 · Lansare / Launch
- Jocul Kygo World adăugat în portofoliu. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/6622a823bb7da4fecb76e2e5c7dbe8e04ca4f9c1)
- Grafică ilustrată și personajul Kygo. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/3c1505e7dea07160eb6420c4b39387e9a0f92490)
- Spațiu de joc și interacțiune mobilă îmbunătățite. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/4caf86f5b6d93c35f9881e4c20ec974bce1f81a2)

## Cum revii la o versiune / How to restore
Deschide commitul dorit și inspectează fișierele din acel punct. Pentru a reveni efectiv, creează un commit nou care restaurează fișierele selectate; nu reseta ramura principală și nu șterge salvările LocalStorage ale jucătorilor. / Open a linked commit to inspect the exact files, then restore selected files in a new commit.
