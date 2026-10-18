# Gimnaziu Space · ExamSpace unificat · clasele V–VIII

Aplicație de recapitulare pentru clasele V–VIII și Evaluarea Națională, construită pe același principiu ca [BAC Space](https://laurandreea10.github.io/BACapp/): conținut scurt, exercițiu imediat, progres salvat local, accesibilitate și două limbi (RO/EN).

**Live:** https://laurandreea10.github.io/codepen-portfolio/gimnaziu-space/

> **Nu este material didactic.** Proiect personal de front-end, creat independent. Nu este avizat de Ministerul Educației și nu înlocuiește manualele, programa, profesorul sau subiectele oficiale. Formulele și explicațiile sunt rezumate pentru recapitulare și pot simplifica.

## Ce conține

| Secțiune | Ce face |
|---|---|
| Acasă | Alegerea clasei, numărătoare inversă până la simularea și probele EN 2027 (calendar în proiect), **Demo de prezentare** vs **Experiența mea** (pornește de la zero), coach local |
| Pe clase | Pentru fiecare clasă: materiile, câte formule / memoratoare / întrebări există și scurtături |
| Formule | 99 de formule (matematică, fizică, chimie) cu căutare, filtre pe materie și clasă, „Știu”, favorite, copiere |
| Memoratoare | 27 de fișe (gramatică, figuri de stil, ortografie, compuneri, divizibilitate, unități, trigonometrie, științe, geografie, engleză) + 29 de repere cronologice; printabile |
| Glosar | 39 de termeni explicați pe scurt |
| Cartonașe | Repetare spațiată Leitner în 5 cutii, generată automat din formule, memoratoare, date istorice și glosar |
| Quiz + AI Coach | 83 de întrebări cu explicații, registru persistent al greșelilor și AI Coach local pentru întrebări și explicații |
| Simulare EN | Matematică (12 itemi + 3 probleme cu barem orientativ) și Română (text original, 6 itemi, compunere cu listă de verificare), cu cronometru |
| Focus & plan | Pomodoro 25/5/15 și plan de 7 zile |
| Progres | XP, serie de zile, activitate pe 28 de zile, acuratețe pe materii, 12 insigne, istoric simulări, export/import/ștergere |

## Unificare cu ExamSpace V–VIII

Gimnaziu Space este acum aplicația principală și reunește modulele ExamSpace V–VIII: arhiva de subiecte și bareme, lecțiile, formulele, memoratoarele, simulările, AI Coach și registrul local al răspunsurilor greșite. Vechiul URL `examspace-v-viii/` rămâne o rută compatibilă către această aplicație.

## Accesibilitate

- navigare completă din tastatură, link de salt, focus mutat pe titlu la schimbarea paginii
- temă luminoasă / întunecată / ca sistemul, contrast ridicat, `forced-colors`
- mărirea textului (100 / 115 / 130%), font Lexend, spațiere mai mare, reducerea animațiilor
- formule citite corect de cititoarele de ecran (text alternativ generat: „a la pătrat plus b la pătrat”)
- ținte de atingere ≥ 44 px, `aria-live` pentru feedback, verificat cu axe (WCAG 2.1 AA) la 390 și 1440 px

## Tehnic

HTML, CSS și JavaScript simplu, fără framework și fără build. Conținutul stă în `data.js` (RO/EN), logica în `app.js`. Progresul și setările se salvează doar în `localStorage`. Funcționează offline prin service worker.

### Mini-sintaxa formulelor

```
[a|b]      fracție          √{x}      radical
^2  ^{m+n} exponent         _1  _{AB} indice
```

## Surse oficiale

- [subiecte.edu.ro](https://subiecte.edu.ro/) — subiecte și bareme
- [edu.ro](https://www.edu.ro/) — calendar, metodologie, programe
- [manuale.edu.ro](https://www.manuale.edu.ro/) — manuale digitale

Datele EN VIII 2027 (simulare 16–18 martie, română 22 iunie, matematică 24 iunie) provin din calendarul publicat **în proiect** în august 2026 și pot fi modificate.

---
Realizat de Laura Andreea · proiect din portofoliul CodePen, în dezvoltare.


## Funcții implementate fără costuri recurente

- AI Coach local, fără API plătit, cu explicații pentru concepte și răspunsuri greșite.
- Registru persistent al greșelilor, repetare, explicații și pași de reparare.
- Arhivă pe ani pentru subiecte și bareme, cu link către sursa oficială.
- Provocarea zilei, XP, serii, insigne, progres și certificat local.
- Partajare prin Web Share/clipboard, printare, backup JSON și export local.
- PWA/offline, dark/light, contrast ridicat, text mărit, Lexend, reduced motion și tastatură.
- Fără cont, server, reclame, analytics sau servicii AI cu plată.
