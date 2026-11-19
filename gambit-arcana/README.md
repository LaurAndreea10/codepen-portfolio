# GAMBIT ARCANA — Șah & Strategie

## RO

Joc de șah premium în browser, cu un design luminos și minimalist (navy/cyan, plus mod întunecat), într-un singur fișier, fără dependențe (doar fonturile Google). Reguli FIDE complete, AI local într-un Web Worker și mecanici noi de strategie.

**Variante**
- **Clasic**: rocadă, en passant, promovare la alegere, pat, repetiție de trei ori, regula celor 50 de mutări, material insuficient.
- **Arcana** (nou): energie la fiecare mutare (+1, +1 în plus la captură, maximum 8) și o carte pe tură: Scut (2), Îngheț (3), Teleport (5), Renaștere (4), Oracol (1). Dacă o restricție ar bloca toate mutările, magia se risipește.
- **Ceață de război**: vezi doar pătratele pe care piesele tale le controlează; mutările adversarului sunt ascunse în listă. La doi jucători apare o cortină între mutări.
- **Regele dealului**: câștigi și ducând regele pe d4, e4, d5 sau e5.
- **Trei șahuri**: câștigi și dând trei șahuri.

**Moduri**
- Joc vs AI: 6 niveluri (~600 până la ~2050, estimativ), stiluri echilibrat / agresiv / defensiv, ceas opțional (3+2, 5+0, 10+5, 15+10).
- Turneul celor 8 Regate: opt adversari cu personalitate și variantă proprie, câte 3 stele fiecare.
- 20 de puzzle-uri de mat verificate de motor + provocarea zilei cu serie de zile.
- Doi jucători pe același dispozitiv, cu rotirea opțională a tablei.

**Unelte de strategie**: hartă de control (cine domină fiecare pătrat), detector de piese în pericol, indiciu, bară de evaluare, recunoașterea a peste 40 de deschideri, vizualizare 3D, revederea pozițiilor, analiză post-partidă (precizie, clasificarea mutărilor, graficul evaluării, momente cheie), PGN și FEN.

**Progres local**: rating Elo, statistici pe variante, 19 realizări, copie de siguranță JSON, reluarea partidei întrerupte.

**Accesibilitate**: mod luminos/întunecat, RO/EN (și `?lang=`), tabla navigabilă din tastatură (săgeți, Enter, Esc), etichete pentru cititorul de ecran pe fiecare pătrat, mutări anunțate, introducere în notație (e4, Nf3, O-O, e7e8q), contrast ridicat, mișcare redusă, promovare automată, sunet comutabil, vibrații opționale.

**Motorul**: tablă 0x88, generare de mutări legale validată cu perft (poziția inițială, Kiwipete și alte trei poziții de referință), alpha-beta cu adâncire iterativă, căutare de liniștire, mutări killer, tabele de poziție cu rege tapered, evaluare specifică pentru fiecare variantă și o mică bibliotecă de deschideri.

`index.pen.html` e aceeași versiune, pentru CodePen.

## EN

Premium single-file browser chess with complete FIDE rules, a local AI in a Web Worker and new strategy mechanics: Arcana cards powered by energy, Fog of war, King of the Hill and Three-check. Includes a campaign of 8 opponents, 20 engine-verified puzzles plus a daily challenge, a control heat map, danger warnings, post-game analysis with accuracy and an evaluation chart, opening recognition, a 3D view, local Elo, 19 achievements and a JSON backup. Bilingual RO/EN, keyboard- and screen-reader-friendly, high contrast and reduced motion.

Author: Laura Andreea.
