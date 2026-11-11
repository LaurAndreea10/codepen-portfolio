# Kygo: Arhipelagul

## RO

Șase dintre jocurile mele, într-unul singur, cu Kygo (pudelul meu toy roșcat) ca erou. Fiecare insulă e o mecanică luată dintr-un proiect mai vechi:

| Insula | Mecanica | Inspirat din |
| --- | --- | --- |
| Valul | surf pe 3 culoare | Surf Run · SlideStorm Arena |
| Vidul | shooter cu valuri și boss | VOID HUNTER · VOID ORACLE |
| Șarpele-Prismă | snake cu lanțuri de 3 forme | Serpent Prism |
| Arena | air hockey contra Rivalului | Air Hockey Arcade · Puck & Pool Arena · PentArena |
| Livada | tăiat de fructe contra cronometru | LIVADA · Culesul |
| Conacul | labirint întunecat cu fantome | Kygo: Pe Urme · BooScary · StarForge Maze |

Ce le leagă:

- **Lătratul**: un singur buton, cu efect diferit pe fiecare insulă.
- **Stele**: 3 pe nivel (terminat, cel mult o viață pierdută, toate cele 3 oase de aur), 54 în total.
- **Magazin**: 3 îmbunătățiri permanente și 6 culori de blană.
- **Oracolul**: toate cele șase jocuri la rând, cu aceleași vieți (se deschide la 18 stele).
- **Provocarea zilei**: aceeași pentru toți, cu serie de zile și rezultat de copiat.
- **12 realizări**.

Grafica e 3D (Three.js r128), pe același principiu ca în Kygo World: starea jocului rămâne 2D, iar Three.js o desenează în 3D. Dacă WebGL lipsește sau oprești „Grafică 3D” din Setări, jocul rulează pe canvas 2D.

RO/EN, tastatură și atingere, contrast ridicat, viteză 100/85/70%, mișcare redusă, sunet și muzică generate, pauză automată când pleci din tab, anunțuri pentru cititoare de ecran. Progresul se salvează local.

Un singur fișier, fără backend. `index.pen.html` e aceeași versiune, pentru CodePen.

## EN

Six of my games in one, starring Kygo (my red toy poodle). Each island reuses a mechanic from an earlier project: lane surfing, a wave shooter with a boss, a shape-chain snake, air hockey, fruit slicing and a dark ghost maze. One bark button with a different effect per island, 3 stars per level (54 total), a shop, the Oracle gauntlet, a daily challenge and 12 achievements.

Rendered in 3D with Three.js r128, the same way as Kygo World: game state stays 2D and Three.js draws it. Without WebGL, or with "3D graphics" off in Settings, it falls back to a 2D canvas.

RO/EN, keyboard and touch, high contrast, 100/85/70% speed, reduced motion, generated sound and music. Progress is saved locally. Single file, no backend.

Made by Laura Andreea.
