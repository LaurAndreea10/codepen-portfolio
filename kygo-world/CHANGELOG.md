# Kygo World — istoric al versiunilor / Version history

Acest fișier rezumă etapele importante. Fiecare link duce la commitul GitHub cu codul exact al acelei versiuni. Istoricul complet al tuturor modificărilor rămâne în GitHub. Datele sunt în fusul Europe/Bucharest. / This file summarizes major milestones; linked commits preserve the exact code.

## 2026-10-05 · v1.5.1 · Validare suplimentară / Additional validation
- Backupurile resping coordonate nested cu tip greșit și identificatori de aplicație invalizi. / Reject incorrectly typed course coordinates and invalid app identifiers.
- Salvările vechi cu o hartă parțială a edițiilor păstrează nivelul ediției active; un nivel explicit din hartă are prioritate. / Preserve active progress in legacy partial edition maps; explicit edition levels take precedence.
- Regresiile verifică JSON și cod, progresul complet nemodificat la respingere, randarea și recuperarea salvărilor locale corupte. Cache offline reîmprospătat. / Regression coverage for JSON/code rejection, unchanged complete progress, rendering and corrupt local saves; refreshed offline cache.

## 2026-09-30 · v1.5.1 · Corectări și verificări / Fixes and regression checks
- Reconciliere cu v1.4.1: sprite optimizat și zone de atingere mărite păstrate. / Preserve the latest loading and touch improvements.
- Backup JSON/cod validat complet înainte de înlocuire; datele invalide nu șterg salvarea. / Validate backups before replacing progress.
- Scanare și joystick disponibile în ecranul mobil; focus pe scenă la Start, tastatură funcțională. / Keep assistive controls available during mobile play.
- Limbă, temă, contrast și mișcare redusă persistente; alt EN și manifest EN. / Persistent preferences and English app metadata.
- Calendar Europe/Bucharest și animații decorative oprite la mișcare redusă. / Consistent Romanian seasonal windows and reduced decorative motion.
- Service worker cu operații de cache urmărite până la finalizare și mesaj pentru erori de pregătire offline. / Reliable cache writes and offline error state.
- Playwright testează checkout-ul: progres, gardieni, finaluri, backup, fantome și offline, mobil și desktop. / Checkout-based regression tests. [PR #80](https://github.com/LaurAndreea10/codepen-portfolio/pull/80)

## 2026-09-29 · v1.4.1 · Încărcare mai rapidă / Faster loading
- Imaginile au dimensiunea folosită efectiv în joc (828 KB → 348 KB la prima încărcare; Lighthouse performanță 79 → 95), cu aceeași scenă desenată. Bifele și glisoarele din Setări au zone de atingere mai mari. / Images resized to what the game draws; larger touch targets in Settings. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/db840adda2cb7dfb440e5a14601fef8d1ce4cc32)

## 2026-09-27 · v1.5 · Aplicație, gardieni și fantome / App, guardians and ghosts
- Joc instalabil (PWA) care merge offline: manifest, iconițe și service worker; paginile se actualizează din rețea, imaginile rămân în cache. / Installable offline app.
- Gardieni la fiecare 10 niveluri: zonă finală de 7 pași, bandă sigură mai rapidă, bară de viață și 10 gardieni diferiți. / A guardian every 10 levels.
- Cursă cu fantoma în Cursă, Campionat și Endless: traseu cu seed, reluarea celei mai bune ture și cod de fantomă pentru prieteni. / Ghost races with shareable codes.
- Salvare și restaurare a progresului prin cod sau fișier JSON. / Backup and restore by code or file.
- Ghid nemodal în 4 pași la prima intrare și butonul „Continuă aventura”. / First-run guide and Continue button.
- Mișcări mai naturale: Kygo alunecă lin între benzi și celule, sare pe o traiectorie de arc fără întârziere, se înclină în viraje, se turtește la aterizare, trapează în alergare, se întoarce spre direcția de mers și respiră când stă; totul se oprește cu „Mișcare redusă”. Randare la 60 fps pe desktop. / Natural motion.
- Efecte și sunete: scântei și „+N 🦴” la fiecare recompensă, praf la săritură și aterizare, scuturare și scântei roșii la obstacole, confetti la gardieni; sunete generate în browser (clinchet de os, săritură, lovitură, scut, magnet, lătrat la victorie) și muzică cu melodie și bas pe fiecare lume. Oasele plutesc, obstacolele din față pulsează. Totul respectă „Mișcare redusă” și setările de sunet. / Effects and sound.
- Harta nivelurilor: toate cele 100 de niveluri pe 25 de capitole, cu stele, gardieni și finaluri; orice nivel deblocat se poate rejuca fără să scadă progresul. / Level map with safe replays.
- Finaluri distincte pentru fiecare dintre cele 25 de capitole: poveste proprie, amintire în album și obiectul capitolului la linia de sosire. / 25 distinct chapter endings.
- Buton „Salvează progresul ca fișier” în hartă și după fiecare final de capitol. / Backup file shortcut.
- Statistici și 15 realizări. / Stats and 15 achievements. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/ed06ec603ea22afeb6f5980b24140b9a44834096)
- Performanță: sprite-ul lui Kygo 346 KB → 61 KB, fundalul jocului în WebP (406 KB → 168 KB). / Lighter images.

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
