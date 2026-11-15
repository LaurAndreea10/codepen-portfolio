# Email Studio

Builder de emailuri din blocuri, cu previzualizare, verificări înainte de trimitere și export HTML care funcționează în clienții de email reali.

**Autor:** Laura Andreea · Iași

## Ce face

- **10 blocuri:** antet, hero, text, imagine, buton, coloane (1–3), linie, spațiu, social, subsol. Le adaugi cu un click sau le tragi în email, le muți cu mânerul, cu săgețile sau cu `Alt` + `↑`/`↓`.
- **Editare directă** a titlurilor în email și editare completă în panoul Bloc.
- **Un singur generator de HTML** pentru editor, previzualizări și export, deci ce vezi este ce exporți.
- **Export pentru clienți de email:** tabele, stiluri inline, butoane VML pentru Outlook, comentarii condiționale MSO, stivuire pe mobil prin media query, stiluri pentru dark mode, preheader ascuns.
- **Previzualizări:** Mobil (375 px), Dark, Cod, plus cum arată subiectul și preheaderul în inbox.
- **Personalizare:** etichete `{{first_name}}`, `{{company}}`, `{{city}}`, cu date de test doar în previzualizare.
- **Verificări cu scor:** lungimea subiectului, semnale de spam, preheader, text alternativ, linkuri goale, link de dezabonare, contrast WCAG la text și butoane, limita Gmail de 102 KB, etichete necunoscute. Un click pe o problemă selectează blocul.
- **Siguranță:** tot textul este escapat, iar linkurile acceptă doar `http(s)`, `mailto` și `tel`.
- Trei șabloane, anulare/refacere, salvare automată, proiect JSON, RO/EN (`?lang=en`), dark/light.

## Structură

```
email-studio/
├── index.html       ← aplicația completă, un singur fișier, fără dependențe
├── index.pen.html   ← aceeași versiune, pentru CodePen
└── og.png
```

## Verificat

Teste automate în Chromium la 1440 și 390 px: adăugare, mutare din tastatură, cu mânerul și din paletă, ștergere și anulare, editare directă, date de test, cele patru moduri, escaparea textului și blocarea linkurilor `javascript:`. HTML-ul exportat a fost redat doar în Chromium; **nu a fost testat în Outlook, Gmail sau Apple Mail** și nici pe telefon fizic sau cu cititor de ecran.
