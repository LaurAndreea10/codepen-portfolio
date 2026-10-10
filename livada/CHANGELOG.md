# LIVADA — istoric versiuni / version history

## 1.1.0 — 2026-10-10 — Culesul / The Harvest

**RO**
- Joc nou la `livada/joc/`: tai fructele cu swipe sau prin atingere, ocolești viespile, umpli sticle de suc.
- Patru moduri: Clasic (3 vieți; pierzi una la fiecare fruct scăpat sau viespe tăiată), Contra timp (60 s; viespea costă 5 s), Comanda zilei (90 s; rețete generate din data zilei, aceleași pentru toți), Zen (90 s, fără viespi și fără penalizări).
- Combo de 3+ fructe dintr-o mișcare, mărul de aur (puncte ×2 timp de 7 s și ploaie de fructe), sticlă îmbuteliată la fiecare 15 fructe (+5).
- 12 realizări, recorduri pe mod și statistici totale, salvate local cu validare; ștergere progres din Setări.
- Setări: sunet generat în browser, ritm lent (−30%), tăiere prin atingere, contrast ridicat, mișcare redusă (pornită implicit dacă sistemul o cere).
- Pauză cu Esc/P și automat la schimbarea filei; RO/EN cu `?lang=en`; funcționează offline după prima vizită (service worker).
- Landing page: link „Joacă” în meniu, buton la secțiunea de amestec și în final.
- Reparat înainte de publicare: ecranul de final putea reapărea peste meniu dacă ieșeai din pauză exact când se pierdea ultima viață.

**EN**
- New game at `livada/joc/`: slice fruit by swiping or tapping, avoid wasps, fill juice bottles.
- Four modes: Classic, Time attack, Order of the day (recipes seeded by date, same for everyone), Zen.
- 3+ combos, golden apple (×2 points for 7 s plus a fruit shower), a bottle every 15 fruits (+5).
- 12 achievements, per-mode records and totals with validated local saves.
- Settings: synthesized sound, slow pace, tap to slice, high contrast, reduced motion.
- Pause with Esc/P and on tab switch; RO/EN; offline after the first visit.

**Verificat / Checked:** Chromium headless la 390 și 1280 px: combo din swipe, penalizarea viespii pe mod, fruct scăpat, mărul de aur, tăiere prin atingere (touch), pauză și ieșire, final de rundă, salvare și realizări, contrast ridicat; fără erori JS. Neconfirmat: telefon real, Safari/iOS, cititor de ecran.

## 1.0.0 — 2026-10-10

- Landing page cinematic: intro animat, titlu presat la scroll, patru arome cu culori proprii, constructor de amestec, calendarul culesului, RO/EN.
