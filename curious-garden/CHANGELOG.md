# Grădina Curioasă — istoricul versiunilor / Version history

Acest fișier rezumă etapele importante. Fiecare link duce la commitul GitHub cu codul exact al acelei versiuni. Istoricul complet rămâne în commiturile repository-ului. Datele sunt în fusul Europe/Bucharest.

This file summarises the major milestones; each link opens the GitHub commit with the exact code of that version.

## 2026-09-30 · v1.11 · Festivaluri de sărbători și calendarul de Advent / Holiday festivals and Advent calendar
- Mărțișor, Paște, Ziua Pământului, 1 Iunie, prima zi de școală și Halloween devin festivaluri de mai multe zile: în fiecare zi se deschide o provocare nouă (găsește, continuă șirul, memory, calcule pe vârstă, decorează), cu o recompensă pentru colecția festivalului. Zilele pierdute rămân deschise până la final. / Multi-day holiday festivals with a new challenge every day.
- Crăciun: calendar de Advent cu 24 de ferestre (1–24 decembrie, deschise până pe 7 ianuarie). Fiecare fereastră aduce o provocare și un glob pentru bradul copilului; la final apare steaua. Perioada evenimentului de Crăciun începe acum pe 1 decembrie. / Christmas Advent calendar with ornaments for the child’s tree.
- Anunț pe Acasă în perioada sărbătorii, buton „Festivalul” pe cardurile din Activități (previzualizare pentru adulți în rest), album cu obiectele decorate, insignă nouă „Spiritul sărbătorilor”. Teste noi cu data simulată. / Home banner, adult preview, holiday album, new badge, tests with simulated dates. [Cod / Code](COMMIT)

## 2026-09-30 · v1.10 · Petrecerea de ziua copilului / Birthday party
- De ziua copilului (cu 2 zile înainte, 3 zile după) se deschide petrecerea: mesaj „La mulți ani” cu numele copilului pe Acasă și trei activități în Atelierul aniversar: **Tortul**, **🎈 Baloane** și **🏠 Camera de petrecere**. / On the child’s birthday a party opens with the cake, balloons and a party room.
- Baloane pe vârste: 3–5 ani umflă 3 baloane fără să se spargă; 6–8 ani respectă o comandă pe culori, iar balonul umflat prea tare se sparge; 9+ ani lucrează cu aer în ml și apăsări exacte. / Age-based balloon challenges.
- Camera de petrecere: decorațiuni puse unde atinge copilul (sau cu butonul „Pune în cameră”), baloanele umflate atârnă din tavan, banner cu numele; 6–8 ani după listă, 9+ ani cu buget în lei; poza petrecerii se poate salva ca PNG. / Party room with list or budget challenges and a downloadable photo.
- Urarea și bannerul folosesc numele salvat la configurarea profilului (se schimbă odată cu profilul); fără nume, apare simplu „La mulți ani!”. / Greeting and banner use the profile’s saved nickname, or a plain “Happy birthday!”.
- În afara zilei de naștere, baloanele și camera sunt blocate; un adult le poate previzualiza. Insignă nouă „Gazda petrecerii”. / Locked outside the birthday window with an adult preview; new “Party host” badge. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/318b33c24cb864d99da28437e6abdcb1207c1d54)

## 2026-09-30 · v1.9 · Mai ușor de ales, mai mult de învățat / Easier to choose, more to learn
- **Ghidare fără să eliminăm nimic**: filtre în Ateliere (Creație, Natură, Meserii), „Recomandat azi”, eticheta NOU pentru atelierele neîncercate și stelele obținute pe fiecare card. Pe Acasă, „Sugestiile lui Bia”: continuă ultima activitate, un atelier nou și abilitatea care are nevoie de exercițiu. / Guidance without removing anything: filters, today’s pick, NEW labels, best stars, and Bia’s ideas on Home.
- **Activități mai adânci**: runde de 5 provocări (3 la pași) cu 1–3 stele; explicația „De ce?” după fiecare unealtă sau hrană aleasă corect (peste 60 de explicații, în 4 limbi); de la 9 ani, „Comanda zilei” cu trei probleme de potrivit deodată. / Rounds with stars, “Why?” explanations, and a three-problem job list for ages 9+.
- **Grafică**: pictogramele mari folosesc imagini Twemoji locale (arată la fel pe orice telefon), scene colorate pe atelier, animații pentru răspunsul corect și stele (dezactivate la „mișcare redusă”). / Local Twemoji icons, themed scenes per workshop, gentle answer animations.
- **Traduceri cu DeepL**: scriptul `scripts/deepl-translate.mjs`, workflow-ul manual „Curious Garden DeepL translations” (review/apply, cu testele rulate înainte de publicare) și pagina `traduceri.html` pentru verificare. Cheia DeepL stă doar în secretele GitHub. / DeepL review/apply workflow for Hungarian and Ukrainian. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/eae40a12c9ebd0d9645ab86b82a10e8d16c8e505)

## 2026-09-30 · v1.8 · Fermă, cules fructe și animale / Farm, fruit picking and animals
- **Ferma**: de la grâu la pâine, de la vacă la brânză și de la găină la ouă; utilajul potrivit (tractor, combină, găleata de muls, foarfeca de tuns oi); calcule cu ouă, cofraje, făină și rânduri de porumb. / Farm: wheat to bread, cow to cheese, hen to eggs; the right machine or tool; maths with eggs, boxes, flour and corn rows.
- **Cules fructe**: 3–5 ani culeg doar merele roșii, coapte; 6–8 ani culeg exact câte fructe de un fel li se cer; 9+ ani umplu coșul până la o greutate exactă, în grame. Plus întrebări despre anotimpuri. / Fruit picking: ripe apples only (3–5), an exact count of one fruit (6–8), an exact weight in grams (9+), plus seasons.
- **Animale**: hrana potrivită, puii animalelor, sunetele lor și calcule (picioare, ouă, fân). Notă de siguranță pentru animalele adevărate. / Animals: the right food, baby animals, animal sounds and maths, with a safety note for real animals.
- Atelierele au acum 12 meserii; motorul lor acceptă activități proprii pe fiecare atelier. / The Workshops screen now has 12 jobs. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/e3d2482ead5b187ad20589ed916e8bb8b46f760c)

## 2026-09-29 · v1.7 · Ateliere / Workshops
- Ecran nou „Ateliere” cu Desen (desen liber, colorează după cod, unește punctele, pixel art, galerie), Muzică (xilofon, cântece, repetă melodia, sus sau jos, ritmuri; sunete Web Audio), Olărit, Croșetat, Grădinărit, Construcții, Doctor, Service și Gătit. / New Workshops screen with drawing, music and 7 jobs. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/0f6b8ec07f5d57648d108da1f73da1369ddd4e13)

## 2026-09-29 · v1.6 · Jocul zilei și diplome / Game of the day and certificates
- „Jocul zilei” pe Acasă, diplome A4 pentru insigne, pagina de aprobare a părerilor, 4 teme noi de vocabular, Paștele catolic pentru HU/EN, aspect pentru tabletă pe orizontală. / Game of the day, printable certificates, feedback approval page, new vocabulary themes, Western Easter for HU/EN, tablet landscape layout. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/792752e49fa0751f128dd7a8dffe73e049850096)

## 2026-09-29 · v1.5 · Limbi străine / Foreign languages
- Engleză, franceză, germană și spaniolă prin joc: ascultă și atinge, memory, scrie cuvântul, propoziții, dialoguri, cuvintele zilei cu repetare spațiată. / English, French, German and Spanish through games with spaced repetition. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/d304a5fc9c3d67fb7884812d947a51fc16c4dbb9)

## 2026-09-29 · v1.4 · Părerea părinților / Parent feedback
- Formularul „Scrie-ți părerea” din zona pentru părinți; mesajele ajung pe e-mail prin Web3Forms, iar în portofoliu apar doar părerile aprobate, cu acord de publicare. / Parent feedback form with moderated, consented opinions in the portfolio. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/1277839411bcf3562f3dd905385d63ee60de7c0d) · [Web3Forms](https://github.com/LaurAndreea10/codepen-portfolio/commit/d206fe4eda8159ba88d56a04c727cf2f9fa020d9)

## 2026-09-29 · v1.3 · Contra lui Robo / Versus Robo
- X și 0, Memory și Bețișoarele contra unui robot calculat local, care se adaptează la copil. Fără server și fără costuri. / Tic-tac-toe, Memory and Nim against an adaptive local robot. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/bdb013167dbcec9c5e30ca75280aeab6062d3859)
- Licența MIT pentru codul jocului. / MIT licence for the game code. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/5b810312c8edda91865e5186c14e2331e8c24b79)

## 2026-09-29 · v1.2 · Jocuri noi și 4 limbi / New games and 4 languages
- Jocuri noi, recompense (abțibilduri, grădina, insigne), zona pentru părinți, accesibilitate, maghiară și ucraineană, teste automate în GitHub Actions. / New games, rewards, parent area, accessibility, Hungarian and Ukrainian, CI tests. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/971dcacace732662329d6607e505f0af51d2081f)

## 2026-09-29 · v1.1 · Ecrane, voce, offline / Screens, voice, offline
- Răspunsuri care nu mai sunt previzibile, ecrane separate, citire vocală și joc offline. / Unpredictable answers, separate screens, read-aloud and offline play. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/418b4bece6d80e3fd27cbee661bb899ab45dc363)

## 2026-09-29 · v1.0 · Niveluri de învățare / Learning levels
- Niveluri de învățare mai bune și progresul pentru adult. / Better learning levels and adult progress. [Cod / Code](https://github.com/LaurAndreea10/codepen-portfolio/commit/961917ec58d4ba0b82c8b1bd038e43508cc20097)

## Cum revii la o versiune / How to restore
Deschide commitul dorit și inspectează fișierele din acel punct. Pentru a reveni, creează un commit nou care restaurează fișierele alese; nu reseta ramura principală și nu șterge progresul salvat de copii în browser. / Open a linked commit to inspect the exact files, then restore selected files in a new commit.
