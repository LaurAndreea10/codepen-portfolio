# Test pe dispozitiv real și cititor de ecran

Aproape fiecare intrare din `CHANGELOG.md` se încheie cu „telefonul fizic și cititorul de ecran rămân neconfirmate”. Protocolul acesta transformă nota într-o dovadă: aceiași pași, de fiecare dată, cu rezultatele publicate, inclusiv ce nu merge.

## Ce testez prima dată

| Proiect | De ce | Link |
|---|---|---|
| Portofoliul (RO) | Prima pagină pe care o vede oricine | `portfolio.html` |
| Grădina Curioasă | Joc pentru copii, accesibilitatea contează cel mai mult | `curious-garden/` |
| Alpis Fusion CRM Premium | Proiectul principal de produs, cu formulare și tabele | `alpis-fusion-crm.html` |

## Pregătire (10 minute)

- **Android + TalkBack**: Setări → Accesibilitate → TalkBack. Gesturi de bază: glisare dreapta/stânga = element următor/anterior, dublă atingere = activare, glisare în sus apoi în jos = meniul de navigare (titluri, linkuri).
- **iPhone + VoiceOver** (dacă ai acces): Setări → Accesibilitate → VoiceOver. Aceleași gesturi, plus rotorul cu două degete pentru titluri.
- Notează modelul telefonului, versiunea de Android/iOS și browserul (Chrome, Safari).
- Pornește înregistrarea ecranului; clipul devine dovadă.

## Pași, pentru fiecare proiect

### A. Fără cititor de ecran (5 minute)

1. Deschide pagina pe date mobile, nu pe Wi-Fi. Notează dacă apare ceva care sare sau se mută în primele secunde.
2. Rotește telefonul în landscape și înapoi. Nimic nu trebuie să iasă din ecran.
3. Mărește textul din sistem la maximum (Setări → Afișaj → Mărime font). Textul nu se suprapune, nu se taie.
4. Atinge fiecare buton principal. Ținta se nimerește din prima, fără zoom.
5. Pentru jocuri: o rundă completă cu touch, apoi pauză și reluare.

### B. Cu TalkBack / VoiceOver (10 minute)

1. **Ordinea**: glisează prin primele 15 elemente. Ordinea citită urmează ordinea vizuală?
2. **Titluri**: din meniul de navigare, sari între titluri. Structura are sens fără să vezi pagina?
3. **Butoane și linkuri**: fiecare are un nume clar („Caută în tot portofoliul”), nu „buton” sau „link”?
4. **Meniuri și ferestre**: deschide „Mai mult” și căutarea Ctrl+K. Focusul intră în ele, iar la închidere revine pe butonul care le-a deschis?
5. **Schimbări dinamice**: după o acțiune (filtru, scor, mesaj de eroare), cititorul anunță rezultatul?
6. **Imagini și canvas**: elementele decorative sunt ignorate, iar cele cu informație au o descriere.
7. **Jocuri**: se poate porni un joc și se înțelege starea (scor, vieți, final) doar din ce se aude?

## Cum notez rezultatele

Pentru fiecare problemă găsită, o linie:

```
[proiect] [telefon / cititor] [pasul] — ce s-a întâmplat — ce mă așteptam — gravitate (blochează / deranjează / cosmetic)
```

Exemplu:

```
[portfolio] [Pixel 7, Android 15, TalkBack] B4 — focusul rămâne pe pagină după închiderea căutării — revine pe butonul „Caută” — deranjează
```

## Unde public

1. Rezultatele în `assets/proof/device-tests/AAAA-LL-ZZ.md`, cu clipurile alături (comprimate, sub 5 MB).
2. O intrare în `CHANGELOG.md`: „Testat pe [telefon] cu [cititor]: X probleme găsite, Y rezolvate.” Din acel moment, nota „neconfirmat” dispare doar pentru proiectele testate.
3. Problemele care rămân deschise devin issue-uri pe GitHub, cu eticheta `a11y-device`.

## Ritm

O dată pe lună, câte 1–2 proiecte. Mai bine puține și publicate decât multe și nenotate.
