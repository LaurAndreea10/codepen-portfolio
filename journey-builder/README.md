# Journey Builder

Editor vizual de automatizări de marketing, cu simulare. Desenezi fluxul din pași (Trigger, Email, SMS, Așteptare, Condiție, Test A/B, Obiectiv, Ieșire), apeși „Simulează” și vezi până la 5.000 de contacte curgând prin el, cu numărători pe fiecare pas și pe fiecare legătură.

**Autor:** Laura Andreea · Iași

## Ce face

- **Editor cu noduri:** drag & drop din paletă, legături trase cu mouse-ul sau alese din panoul Editare, pan și zoom, anulare/refacere (100 de pași), protecție la bucle.
- **Simulare:** fiecare contact are propriul generator pseudo-aleator pornit din seed, deci același seed dă același rezultat. Modelul include oboseala la mesaje (−8% deschidere și +60% dezabonare la fiecare mesaj în plus) și o șansă de cumpărare care depinde de deschidere, click și zilele de așteptare.
- **Rezultate:** rată de conversie, venit, cost de trimitere, dezabonări, zile până la conversie, mesaje per contact, distribuția rezultatelor și traficul pe fiecare pas.
- **Provocări:** trei ținte verificate oficial cu 5.000 de contacte, seed fix și rate standard, astfel încât contează doar structura fluxului.
- **Șabloane:** serie de bun venit, coș abandonat, reactivare.
- **Salvare:** automat în `localStorage`, export/import JSON și link de partajare cu fluxul codat în adresă.
- **Stil:** RO/EN (`?lang=en`), dark/light, tastatură completă, `prefers-reduced-motion` (simularea devine instantanee), responsive.

## Structură

```
journey-builder/
├── index.html       ← aplicația completă, un singur fișier, fără dependențe
├── index.pen.html   ← aceeași versiune, pentru CodePen
└── og.png           ← imaginea pentru Open Graph
```

## Tastatură

`Tab` ajunge la pași · săgeți mută pasul (cu `Shift`, pas fin) · `Delete` șterge · `Enter` deschide editarea · `Ctrl+Z` / `Ctrl+Shift+Z` · `+` `−` `0` zoom · `?` ajutor

## Verificat

Teste automate în Chromium la 1440, 1200 și 390 px: adăugare, legare din panou și cu mouse-ul, anulare, simulare animată și instantanee, provocări, link de partajare, schimbare de limbă și temă. Telefonul fizic, Safari, Firefox și cititoarele de ecran nu au fost verificate.
