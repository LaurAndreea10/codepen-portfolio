# 🏁 Neon Drift

> Joc de curse cu 3 perspective selectabile, AI opponents și circuit procedural · Vanilla JS · Canvas API · Zero dependențe

**[▶ Live Demo](https://laurandreea10.github.io/Neon-Drift/)** &nbsp;·&nbsp; [Portofoliu](https://laurandreea10.github.io/codepen-portfolio)

---

## Ce poți configura înainte de start

| Opțiune | Variante |
|---------|----------|
| **Perspectivă** | Top-down (drift) · Pseudo-3D (Outrun) · Side-scroller (F-Zero) |
| **Oponenți AI** | 1 opponent (duel) · 2 opponents (trio) |
| **Tururi** | Sprint (1) · Standard (3) · Long (5) |

Fiecare combinație produce o experiență vizuală complet diferită — același circuit, trei moduri de randare.

## Perspectivele

**Top-Down** — vedere de sus cu cameră care urmărește player-ul. Drift fizic vizibil, urme de frânare pe asfalt, smoke la derapaj.

**Pseudo-3D** — efect Outrun cu segmente de drum randate în perspectivă. Speed lines la viteze mari, AI apare în față pe drum.

**Side-Scroller** — lateral F-Zero style. Lățimea drumului vizibilă, mașinile se înclină în curbe, blur de viteză.

## Sistem tehnic

```
Circuit procedural    — generat cu seed aleator la fiecare cursă
                        Catmull-Rom spline prin puncte random dispuse radial

Fizică de drift       — viteză și direcție decuplate
                        grip vs slide bazat pe unghi de derapaj
                        inerție simulată cu blending pe vectori

AI navigation         — look-ahead pe centerline cu waypoints
                        agresivitate diferită per opponent
                        speed reduction în curbe strânse

Camera                — urmărire smooth cu interpolation
                        coordinate world-space → screen-space per renderer

Collision             — constraint față de centerline cu push-back
                        reducere de viteză la ieșire din pistă
```

## Stack

```
HTML5 Canvas API     — toate cele 3 renderere
Vanilla JS ES6+      — game loop, physics, AI, state machine
requestAnimationFrame — 60fps, delta-time pentru frame-rate independence
localStorage          — scoruri persistente
Zero npm / bundler    — un singur fișier HTML, deploy direct
```

## Controale

| Tastă | Acțiune |
|-------|---------|
| `W` / `↑` | Accelerează |
| `S` / `↓` | Frânează / marșarier |
| `A` / `←` | Volan stânga |
| `D` / `→` | Volan dreapta |
| `R` | Restart rapid |
| `ESC` | Înapoi la meniu |

## Deploy local

```bash
git clone https://github.com/LaurAndreea10/Neon-Drift.git
open index.html   # nu necesită server
```

## Ce demonstrează

- **Multiple rendering pipelines** dintr-un singur engine de fizică — același state, 3 vizualizări complet diferite
- **Procedural generation** cu seed-based RNG și Catmull-Rom splines
- **Physics decoupling** — viteza și direcția ca vectori separați, nu un simplu `x += speed * cos(angle)`
- **AI pathfinding** simplu dar eficient pe centerline precomputat
- **State machine** pentru meniu → countdown → cursă → rezultate
- **Camera systems** — urmărire în top-down, first-person projection în pseudo-3D, scroll lateral în side

---

Built by [Laura Andreea](https://laurandreea10.github.io/codepen-portfolio) · Vanilla JS · Canvas API · 2026
