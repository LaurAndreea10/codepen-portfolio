# v3 · Actualizare

Versiunea v2.1 și launcher-ul Arcade World au fost deja merged (PR #106 și respectiv #26). V3 actualizează aceeași rută, catalogul și înregistrările existente; nu crește numărul de proiecte și nu dublează cardul Arcade. Studiul de caz intră în sitemap. Publicarea v3 se verifică după merge/deploy.

## Istoricul integrării v2

# Integrare / Integration

Sursele v2 sunt pregătite pentru ruta `codepen-portfolio/candy-route/`.

- Repository: https://github.com/LaurAndreea10/codepen-portfolio
- Branch: `codex/candy-route-v2-20261026`
- Review: https://github.com/LaurAndreea10/codepen-portfolio/compare/main...codex/candy-route-v2-20261026
- Adăugări: catalog Challenge/Game, Arcade Pass (17 jocuri), sezon Halloween (4 challenge-uri), Finalizat recent (maximum 5), Istoric, RO/EN și sitemap. Metrica centrală crește de la 89 la 90 odată cu noul joc.

Arcade World:

- Repository: https://github.com/LaurAndreea10/ARCADE-WORLD
- Branch: `codex/candy-route-v2-20261026`
- Review: https://github.com/LaurAndreea10/ARCADE-WORLD/compare/main...codex/candy-route-v2-20261026
- Card nou în grila existentă; launcher în dialogul mare; cardul este clonat o singură dată în meniul mobil, inclusiv la redeschidere. Link separat și link EN. Progresul jocului rămâne separat de XP/coins ale tablei Arcade.

Ordine: merge/deploy pentru codepen-portfolio, apoi merge/deploy pentru Arcade World. Destinația publică nu trebuie presupusă disponibilă înaintea primului deploy. Testul local al launcher-ului folosește sursa jocului local în iframe; nu confirmă publicarea pe GitHub Pages. Publicarea în editorul CodePen nu a fost efectuată.
