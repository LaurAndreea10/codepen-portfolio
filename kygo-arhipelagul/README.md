# Kygo: Arhipelagul

## RO

Douăsprezece dintre jocurile mele, într-unul singur, cu Kygo (pudelul meu toy roșcat) ca erou. Fiecare insulă e o mecanică luată dintr-un proiect mai vechi.

| Insula | Mecanica | Inspirat din |
| --- | --- | --- |
| Valul | surf pe 3 culoare | Surf Run · SlideStorm Arena |
| Vidul | shooter cu valuri și boss | VOID HUNTER · VOID ORACLE |
| Șarpele-Prismă | snake cu lanțuri de 3 forme | Serpent Prism |
| Arena | air hockey contra Rivalului | Air Hockey Arcade · Puck & Pool Arena · PentArena |
| Livada | tăiat de fructe contra cronometru | LIVADA · Culesul |
| Conacul | labirint întunecat cu fantome | Kygo: Pe Urme · BooScary · StarForge Maze |
| Creasta | sărit peste bușteni, aplecat sub crengi | Carpați Enduro |
| Turnul | stivuit de blocuri | BlockForge |
| Zarurile | zbor prin goluri, zaruri cu efecte | DICE DRIFT 3D · ORACLE DRIFT |
| Coșul | aruncări la un coș în mișcare | Basket vs AI · PentArena |
| Circuitul | șosea care șerpuiește, trafic | VELOCITY X · Neon Drift |
| Pârtia | slalom, placa evoluează | GENOBOARD: Evo Rush |

Ce le leagă:

- **Lătratul**: un singur buton, cu efect diferit pe fiecare insulă.
- **5 niveluri pe insulă**, 3 stele pe nivel, 180 în total. Pe cele șase insule clasice, nivelul 5 are boss: Rechinul, Ochiul în două faze, Hidra, Campionul, Regina viespilor, Stăpânul umbrelor.
- **Fără sfârșit**: runde la rând, tot mai grele, cu record pe insulă.
- **Harta 3D**: Kygo sare de pe o insulă pe alta. Lista de dedesubt face același lucru din tastatură.
- **Arbore de abilități** (7 noduri), **provizii** pentru un nivel (scut, timp lent, oase duble), 6 blănuri și 5 accesorii, dintre care trei sunt cadou în sezonul lor.
- **Prestigiu**: de la 60 de stele poți relua atlasul, mai rapid și mai bogat în oase.
- **Competiție fără server**: provocarea zilei, provocarea săptămânii (3 insule), cod de provocare pentru aceeași hartă și diferența față de recordul tău, afișată în timp real.
- **16 realizări** și medalia „Tăcutul” pentru nivelurile câștigate fără lătrat.

Grafica e 3D (Three.js r128), pe același principiu ca în Kygo World: starea jocului rămâne 2D, iar Three.js o desenează. Fără WebGL sau cu „Grafică 3D” oprită, jocul rulează pe canvas 2D.

Accesibilitate: RO/EN (și `?lang=`), tastatură, atingere, gamepad, joc cu un singur buton (scanare), mod fără eșec, viteză 100/85/70%, contrast ridicat, temă deschisă pentru meniuri, mișcare redusă, vibrații opționale, anunțuri pentru cititoare de ecran. Progresul se salvează local și se poate copia sau importa ca text JSON.

Se poate instala ca aplicație și merge offline după prima vizită (`manifest.webmanifest`, `sw.js`). `index.pen.html` e aceeași versiune într-un singur fișier, pentru CodePen. [Studiu de caz](case-study.html).

Ce lipsește: clasament global (ar cere backend), lătrat înregistrat, trailer video, boși pe cele șase insule noi.

## EN

Twelve of my games in one, starring Kygo (my red toy poodle). Each island reuses a mechanic from an earlier project: lane surfing, a wave shooter, a shape-chain snake, air hockey, fruit slicing, a dark ghost maze, a jump-and-duck dirt bike, block stacking, flying through wall gaps with dice effects, shooting at a moving hoop, a winding road with traffic, and a slalom where the board evolves.

Five levels per island (180 stars), bosses on level 5 of the six classic islands, an endless mode, a 3D hub map, a 7-node skill tree, single-level supplies, coats and accessories, prestige, daily and weekly challenges, challenge codes, a live delta against your own best, and 16 achievements.

Rendered with Three.js r128 the same way as Kygo World, with a 2D canvas fallback. RO/EN, keyboard, touch, gamepad, one-switch scanning, no-fail mode, adjustable speed, high contrast, light menu theme, reduced motion. Installable and offline-capable. Progress is saved locally and can be copied or imported as JSON. [Case study](case-study.html).

Not included: a global leaderboard (it needs a backend), a recorded bark, a video trailer, bosses on the six new islands.

Made by Laura Andreea.
