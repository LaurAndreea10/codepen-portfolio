# Kygo World · Insulele din Nori

**Build documentat:** `2026.09.30.1` (reperele funcționale sunt grupate în v1.0–v1.5.1). Numărul identifică buildul din această ramură și nu reprezintă un scor de calitate.

[Istoricul versiunilor](CHANGELOG.md) include etapele importante și commiturile GitHub cu codul exact; jocul îl afișează și în meniul „Istoricul versiunilor”. Istoricul complet rămâne în commiturile repository-ului.

Joc browser RO/EN inspirat de Kygo. Pornește direct din `index.html`, fără build sau biblioteci externe. Imaginile de joc `sky-islands.webp` și `kygo-sprite.webp` rămân lângă fișier.

## Moduri

- **Poveste:** 100 de niveluri în 25 de capitole, câte patru lumi cu 30 de pași și trei benzi de iarbă. Kygo aleargă automat; schimbi banda, sari peste obstacole, aduni oase și relicve, alegi ramuri și înfrunți câte un șef cu tipar de benzi sigure în fiecare lume. Un obiect ascuns pe lume deblochează un costum la final. Finalizarea acordă până la trei stele. La capătul fiecărui nivel apare un ecran de rezultat; «Următorul nivel» pornește doar la apăsare. La fiecare zece niveluri se acordă un bonus și o insignă.
- **Provocarea zilei:** un traseu Poveste stabil pentru ziua curentă. Minimum două relicve acordă un bonus o dată pe zi.
- **Contra cronometru:** încheie traseul Poveste în 30 de secunde; cel mai bun timp este salvat separat pentru fiecare ediție.
- **Explorare liberă:** deplasare manuală înainte/înapoi pe iarbă, cu schimbarea benzii și săritură.
- **Traseu creat:** pune până la 40 de oase sau pietre pe trei benzi, joacă traseul, exportă și importă cod JSON validat. Progresul Poveștii nu este schimbat.
- **Cursă**, **Campionat**, **Endless**, **Labirint**, **Comoară**, **Grădină / Zen** și **Duo** oferă provocări distincte. Labirintul are și provocare zilnică.

## Ediții de sărbătoare

Edițiile pornesc automat după calendarul Europe/Bucharest, indiferent de fusul dispozitivului: **Paște ortodox** de luni din Săptămâna Mare până luni după Înviere (intervalul se încheie marți la 00:00), **Halloween** 24–31 octombrie și **Crăciun** 24 decembrie–6 ianuarie. În meniu apare numărătoarea inversă până la următoarea ediție sau până la încheierea celei active; în joc apare cronometrul ediției active. Celelalte ediții nu pot fi selectate în afara perioadei lor. Poți alege Clasic în timpul evenimentului; trecerea automată se face la următoarea schimbare de perioadă. Fiecare ediție are decor, sunete sintetice și progres separat pentru cele 100 de niveluri. Halloween cere spargerea dovlecilor cu „Sparge!”, de Paște aduni ouă, iar de Crăciun cadouri. Trei din cele cinci obiective ale nivelului acordă insigna ediției.

## Recompensele lui Kygo

Oasele 🦴 sunt recompensa și moneda de joc: le culegi pe traseu, le primești pentru misiuni și le folosești pentru mingea, papionul, zgarda sau florile din grădina lui Kygo. Biscuiții 🍪 de pe traseu acordă câte două oase, iar frisbee-urile 🥏 câte trei. Colecția salvată local oferă încă cinci oase la fiecare cinci biscuiți sau trei frisbee-uri. Soldul deja salvat sub cheia internă `coins` este păstrat și afișat ca oase; progresul nu este resetat. Editorul acceptă în continuare codurile JSON vechi cu tipul intern `paw`, dar afișează obiectul ca os.

## Costume, captură și sunet

Cinci costume vizuale (clasic, nori, valuri, flori, regal) se pot echipa, cumpăra cu oase sau debloca prin găsirea obiectului ascuns din fiecare lume. Captura scenei se descarcă local ca PNG. Sunetul are volum reglabil; muzica sintetică și efectele au comenzi separate. Setările și progresul se păstrează în LocalStorage pe dispozitiv.

Pe mobil, alegerea modului sau atingerea butonului Start concentrează ecranul pe joc. Bara de sus păstrează Pauză și Meniu. Instrucțiunile stau în afara imaginii.

## Comenzi

| Acțiune | Tastatură | Mobil |
| --- | --- | --- |
| Pornește / reia | Enter / Start | Butonul Start pe scenă |
| Poveste | Deplasare automată | Schimbă banda prin swipe sus/jos; atinge pentru săritură |
| Halloween | E lângă dovleac | Butonul „Sparge!” |
| Explorare | Săgeți stânga/dreapta | Swipe orizontal sau butoanele Pas − / Pas + |
| Alte moduri | Săgeți / WASD | Swipe, butoane sau joystick opțional |
| Pauză | P | Butonul Pauză |

Setări: limbă, temă, contrast, mișcare redusă, sensibilitate swipe, viteze separate, mod fără eșec, vibrație, sunet, muzică, volum, comenzi pentru mâna stângă, scanare cu un buton și hartă text pe ture.

## v1.5 și v1.5.1

PWA cu manifest RO/EN, iconițe și service worker; pe HTTPS sau localhost, jocul este disponibil offline după pregătirea cache-ului. Problemele de înregistrare sunt afișate în cardul aplicației. Gardienii de la nivelurile 10–100 au o zonă finală de șapte pași; bara lor indică traversarea zonei. Harta permite rejucarea nivelurilor deblocate fără pierderea progresului maxim. Cele 25 de capitole au finaluri și amintiri distincte. Sunt disponibile statistici, 15 realizări și fantome cu traseu determinat prin seed în modurile de cursă.

Backupul poate fi descărcat ca JSON sau copiat ca cod `KYGO1:`. Importul validează forma completă și limitele datelor înainte de confirmarea înlocuirii; salvările vechi primesc valori implicite pentru câmpurile lipsă. Un import invalid păstrează progresul existent. Preferințele de limbă, temă, contrast și mișcare redusă persistă. Ghidul poate fi închis sau revăzut și rămâne disponibil la migrarea salvărilor anterioare v1.5.

## Testare

```sh
npm install --no-save playwright@1.55.0 @axe-core/playwright@4.10.2
npx playwright install chromium
node scripts/mobile-a11y.mjs
node scripts/kygo-world-tests.mjs
```

Ambele scripturi pornesc un server local și testează checkout-ul, inclusiv în PR. Auditul mobil verifică SkyDreams și Kygo la 360/390/412 px. `AUDIT_LIVE=1 node scripts/mobile-a11y.mjs` permite separat verificarea celor trei pagini publicate, inclusiv Revenue Landscape, aflat într-un alt repository.

Suita Kygo verifică 360/390/412/1280 px: ghid, manifest și iconițe, pornirea modurilor, keyboard, gesturi, accesibilitate axe în joc, preferințe persistente, calendar și progres pe ediții, cele 100 de tranziții de nivel în modul fără eșec, gardieni/finaluri, rejucare, import/export JSON și cod, respingerea datelor invalide, fantome și pornire offline. Accesul la starea internă este injectat doar în HTML-ul servit de serverul de test; nu există în jocul publicat. Testul celor 100 de niveluri verifică logica progresiei, nu dificultatea prin joc manual. Testarea pe telefon fizic rămâne necesară pentru sunet, haptics și performanță.
