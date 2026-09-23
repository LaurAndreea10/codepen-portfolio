# SkyDreams Portal

[Joacă / Play](https://laurandreea10.github.io/codepen-portfolio/skydreams-portal/) · [Portofoliu / Portfolio](https://laurandreea10.github.io/codepen-portfolio/portfolio.html)

## RO

Joc de alergare printre platforme suspendate, inspirat de conceptul **SkyDreams** creat de Frank Force / Killed By A Pixel pentru JS1024 (2026). Această versiune este o implementare nouă, extinsă, într-un singur fișier HTML, fără dependențe.

- Trei lumi și ecrane de capitol: Grădina zorilor (platforme fragile), Furtuna electrică (cristale electrice) și Templul neon (porți cu un culoar deschis).
- Nouă moduri: Poveste, Fără sfârșit, Zen, Provocarea zilei, Contra cronometru, Colectare, Personalizat, Cursă Sprint și Campionat. Daily are traseu comun pe zi, obiectiv la 120 și record local; Sprint se termină la 180; Campionatul are trei manșe și podium local.
- Salt dublu, avânt, scut, stele, combo, misiuni și record local. Cristalele pot fi sparte pentru stele, zidurile fisurate cer două lovituri, blocurile se mișcă, iar cutremurele anunță culoarele care cedează. În Poveste, sparge cele trei nuclee de pe culoarul 4 pentru a deschide portalul; dacă le ratezi, reiei secvența finală păstrând nucleele deja sparte.
- Editor de pistă 8 × 7 și link de distribuire care include codul și platformele.
- Alegere RO/EN la prima deschidere și oricând din meniu; shop cu monede câștigate în joc, urmă luminoasă, aspect auriu și scut la start. Dark/light, contrast ridicat, mișcare redusă, viteză reglabilă, taste configurabile, asistență la salt și controale tactile.
- **Mod text pe ture:** alege culoarul, citește platformele următoare și avansează câte un pas; saltul acoperă trei platforme. Nu cere reflexe rapide. Activează-l din „Setări și accesibilitate”.

### Comenzi

| Acțiune | Tastatură | Mobil |
| --- | --- | --- |
| Stânga / dreapta | ← / → sau A / D, configurabile | Butoane sau glisare |
| Salt | Spațiu / ↑ sau W, configurabil | SARI |
| Dash | X, configurabil | ⇥ |
| Pauză | P / Esc | Butonul de pauză |
| Pas în modul text | Enter sau butonul „Avansează” | Butonul „Avansează” |

Pe pagina publicată, jocul poate fi instalat și jucat offline după prima încărcare completă. Setările și recordul se salvează local în browser. Jocul poate fi deschis direct din `index.html`. Pentru distribuirea unui traseu personalizat, folosește butonul „Distribuie traseul” pe pagina publicată.

**Accesibilitate:** modul text folosește butoane, listă HTML și anunțuri de stare. Jocul Canvas are indicii text pentru pericole. Testarea practică cu cititoare de ecran și utilizatori cu nevoi diverse rămâne importantă; nu pretindem compatibilitate universală.

## EN

A sky-platform runner inspired by the **SkyDreams** concept created by Frank Force / Killed By A Pixel for JS1024 (2026). This is a new, expanded single-file HTML implementation with no dependencies.

- Three worlds with chapter screens: Dawn Garden (fragile tiles), Electric Storm (electric crystals) and Neon Temple (single-lane gates).
- Nine modes: Story, Endless, Zen, Daily, Time Attack, Collect, Custom, Sprint Race and Championship. Daily uses a shared daily seed and a 120-distance goal; Sprint ends at 180; Championship spans three heats with a local podium.
- Double jump, dash, shield, stars, combos, missions and a locally saved best score. Break crystals for stars, hit cracked walls twice, dodge moving blocks and watch announced earthquake lanes. In Story mode, break three cores in lane 4 to open the portal; missed cores remain available on the repeated final section.
- An 8 × 7 course editor; shared links include both the course code and tile pattern.
- First-run RO/EN choice and menu switching; local coin shop for a glowing trail, gold skin and starting shield. Dark/light, high contrast, reduced motion, adjustable speed, remappable keys, jump assist and touch controls.
- **Turn-based text mode:** choose a lane, read upcoming tiles and advance one step at a time. A jump covers three tiles. Enable it under “Settings and accessibility”.

### Controls

| Action | Keyboard | Mobile |
| --- | --- | --- |
| Left / right | ← / → or A / D, remappable | Buttons or swipe |
| Jump | Space / ↑ or W, remappable | JUMP |
| Dash | X, remappable | ⇥ |
| Pause | P / Esc | Pause button |
| Text-mode step | Enter or “Advance” | “Advance” button |

On the published page, the game can be installed and played offline after its first complete load. Settings and the best score are stored in the browser. Open `index.html` directly to play. Use “Share course” on the published page to share a custom course.

**Accessibility:** text mode uses semantic buttons, an HTML list and live status messages. The Canvas game includes text hazard cues. Practical testing with screen readers and players with varied needs is still necessary; universal compatibility is not claimed.

## QA / Testare practică

- **RO/EN:** comută limba în meniu și în timpul jocului; verifică modurile, indicațiile și etichetele comenzilor.
- **Telefon:** verifică orientările portret și peisaj, comenzile tactile, panoul de setări, zonele de siguranță și modul text la lățimi de aproximativ 360–412 px.
- **Cititor de ecran:** activează modul text și parcurge cu NVDA + Chrome sau TalkBack + Chrome: alegerea culoarului, lista următoarelor platforme, saltul, avansarea, pauza, schimbarea capitolului și reluarea. Verifică anunțurile fără a depinde de Canvas.
- **Offline:** încarcă pagina publicată online, apoi dezactivează conexiunea și redeschide jocul din aceeași adresă sau din aplicația instalată. Funcția depinde de suportul browserului pentru service workers.

**EN:** Repeat these checks for both languages on portrait and landscape phones. With NVDA/Chrome or TalkBack/Chrome, verify lane selection, upcoming tiles, jump, advance, pause, chapter changes and replay. Load online first, then reopen offline to check the service worker. These are acceptance checks, not a claim of completed testing with physical devices or screen readers.

## Arcade World

SkyDreams Portal apare ca joc extern în ARCADE WORLD. Poate fi deschis în hub sau într-un tab separat; progresul și shop-ul SkyDreams rămân locale jocului. / SkyDreams Portal appears as an external game in ARCADE WORLD, with an in-hub launcher and a separate tab option. SkyDreams progress and shop stay local to the game.
