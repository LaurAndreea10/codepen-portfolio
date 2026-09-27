# Kygo World · Insulele din Nori

**Build documentat:** `2026.09.27`. Numărul identifică starea publică și nu reprezintă un scor de calitate.

Joc browser RO/EN inspirat de Kygo. Pornește direct din `index.html`, fără build sau biblioteci externe. Imaginile `sky-islands.jpg` și `kygo-sprite.webp` rămân lângă fișier.

## Moduri

- **Poveste:** 100 de niveluri în 25 de capitole, câte patru lumi cu 30 de pași și trei benzi de iarbă. Kygo aleargă automat; schimbi banda, sari peste obstacole, aduni oase și relicve, alegi ramuri și înfrunți câte un șef cu tipar de benzi sigure în fiecare lume. Un obiect ascuns pe lume deblochează un costum la final. Finalizarea acordă până la trei stele. La capătul fiecărui nivel apare un ecran de rezultat; «Următorul nivel» pornește doar la apăsare. La fiecare zece niveluri se acordă un bonus și o insignă.
- **Provocarea zilei:** un traseu Poveste stabil pentru ziua curentă. Minimum două relicve acordă un bonus o dată pe zi.
- **Contra cronometru:** încheie traseul Poveste în 30 de secunde; cel mai bun timp este salvat separat pentru fiecare ediție.
- **Explorare liberă:** deplasare manuală înainte/înapoi pe iarbă, cu schimbarea benzii și săritură.
- **Traseu creat:** pune până la 40 de oase sau pietre pe trei benzi, joacă traseul, exportă și importă cod JSON validat. Progresul Poveștii nu este schimbat.
- **Cursă**, **Campionat**, **Endless**, **Labirint**, **Comoară**, **Grădină / Zen** și **Duo** oferă provocări distincte. Labirintul are și provocare zilnică.

## Ediții de sărbătoare

Edițiile pornesc automat după data locală a dispozitivului: **Paște ortodox** de luni din Săptămâna Mare până luni după Înviere (intervalul se încheie marți la 00:00), **Halloween** 24–31 octombrie și **Crăciun** 24 decembrie–6 ianuarie. În meniu apare numărătoarea inversă până la următoarea ediție sau până la încheierea celei active; în joc apare cronometrul ediției active. Celelalte ediții nu pot fi selectate în afara perioadei lor. Poți alege Clasic în timpul evenimentului; trecerea automată se face la următoarea schimbare de perioadă. Fiecare ediție are decor, sunete sintetice și progres separat pentru cele 100 de niveluri. Halloween cere spargerea dovlecilor cu „Sparge!”, de Paște aduni ouă, iar de Crăciun cadouri. Trei din cele cinci obiective ale nivelului acordă insigna ediției.

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

## Testare

Workflow-ul „Recent projects mobile accessibility” verifică versiunea publică la 360, 390 și 412 px, inclusiv Start pe touch, ecranul focalizat, RO/EN și cheile progresului separat. Calendarul edițiilor este verificat separat cu date simulate în testul logic; verificările browser ale fiecărei ediții trebuie rulate în intervalul ei sau cu ceas controlat. Capturile reale de 390 px sunt atașate rulării. Testarea directă pe telefon rămâne necesară pentru performanță, sunet și gesturi.
