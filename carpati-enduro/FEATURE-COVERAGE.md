# Cele 24 de direcții — Expedition 2.1

Tabelul descrie funcții concrete din cod, nu promite activarea unui serviciu care nu este găzduit. Jocul static și modurile locale sunt implementate. Serverul online este implementat și testat prin API, dar **nu există încă un endpoint HTTPS de producție configurat**. Publicarea pe itch.io necesită contul destinatar; pachetul HTML este pregătit.

| # | Direcție | Implementare |
|---|---|---|
| 1 | Fizică și control | Contacte pe roți, presiune/aderență/viteză, suspensie/agilitate, frână față/spate, model de cuplu/RPM, trepte automate/manuale, ambreiaj și feedback despre unghiul căderii. Model arcade, nu simulator mecanic de inginerie. |
| 2 | Obstacole | Rădăcini, scări, bușteni, pietre, poduri; platforme verticale mobile și balansoare care răspund la încărcare; șleauri limitate pe suprafețe moi. |
| 3 | Trasee | Cele 8 regiuni, rute configurabile, două ramificații fizice în expediții, puncte panoramice, explorare, cabane și hartă stilizată selectabilă. |
| 4 | Vreme | Ploaie/zăpadă/ceață/frunze, vânt, umezire/uscare graduală, cer cu tranziții zi/apus/noapte, urme de roți. |
| 5 | Moduri | Cele 9 moduri originale plus Sprint, Hard Enduro, Precision, Checkpoint Rush, Delivery, Rescue, Rally Raid, Expedition, Champions Trilogy și Exploration. |
| 6 | Carieră | Cariera originală păstrată, serii de etape, patru ligi cu promovare, licențe pe clasă după trei sosiri curate și sală de trofee cu perspectivă CSS 3D. |
| 7 | AI | Personalități și anticipare, adaptare la vreme; în expediții, adversarii folosesc corpuri independente pe roți și același rezolvitor de constrângeri/contacte ca pilotul; aleg și variante de ramificație. |
| 8 | Campioni | Dueluri, triadă, introduceri narative scurte, nume/stiluri distincte și modele de campion câștigate prin victorie. |
| 9 | Garaj | Cinci clase, reglaje/preseturi pe motocicletă, costuri/compromisuri ale upgrade-urilor, test gratuit și istoric al motocicletelor. |
| 10 | Personalizare | Culori, ținute, căști, text/culoare/poziție de sticker, jante, mănuși, cizme și ochelari. Aspectul poate fi fotografiat. |
| 11 | Bonusuri | Boost, scut, aderență, slow time, magnet și reparație; activare unică, alegere între etape și categorii separate de recorduri. |
| 12 | Misiuni | Misiuni zilnice/săptămânale, sponsor fictiv, lanțuri regionale și obiectiv selectat vizibil în cursă; recompense revendicabile o singură dată. |
| 13 | Școală | Cele 7 lecții păstrate, ghost demonstrativ generat prin simulare pentru fiecare lecție, examen de control și recomandări după încercări. |
| 14 | Analiză | Timpi/sectoare, viteze medie/maximă, căderi localizate, numărări pe sectoare de obstacole, grafic și hartă de frecvență a căderilor. |
| 15 | Ghost/replay | Import/export, seek/pauză/viteză/camere, trei ghosturi de comparație, marcaje jump/crash/checkpoint, geometria/ramificațiile și vremea reluării. |
| 16 | Editor | 3–40 segmente, suprafață/înălțime, profil modelat prin drag sau numere, obiecte plasabile la poziții procentuale, checkpointuri proprii, Undo/Redo, test și export validat. |
| 17 | Prieteni | Competiție pe rând, split-screen simultan cu două corpuri fizice și comenzi independente, cooperare locală; client/server pentru lobby privat de 2–4 persoane, pornire sincronizată, poziții live, cooperare și clasament comunitar. Online necesită găzduire. |
| 18 | Accesibilitate | RO/EN, contrast, text mare, comenzi repoziționabile, sensibilitate, asistență, reducerea mișcării, grupare pentru o mână și control cu o singură comandă. Auditul real cu cititor de ecran rămâne neconfirmat. |
| 19 | Mobil | Layout responsive, comenzi tactile, checkpoint salvat, mod economic și reducere opțională a calității după FPS. Dispozitivul fizic rămâne de verificat. |
| 20 | Imagine/sunet | Camerele și motoarele pe clase, decor adăugat, animație suplimentară a pilotului, obiective vizibile, fotografie și filtre natural/warm/mono/vivid. Exportul foto rămâne 2D. |
| 21 | Salvare/PWA | Migrare/backup/recuperare, patru sloturi, versiune, cache izolat; server pentru conturi și salvări private între dispozitive, cu revizii pentru conflicte. Serverul nu este găzduit public în acest PR. |
| 22 | Evenimente | Cele 6 ediții păstrate, arhivă, reluarea recompenselor în ediții anuale și festival aniversar cu trei probe. |
| 23 | Stabilitate | Teste de date/fizică/server/cache, suita browser, recompense idempotente și timer-e izolate; workflow CI dedicat testelor Node. Echilibrarea și măsurătorile pe hardware real nu sunt înlocuite de aceste verificări. |
| 24 | Distribuție | Studiu RO/EN, changelog păstrat, card PNG, feedback, integrare Arcade World, tutorial WebM exportat și ZIP HTML pentru itch.io. Uploadul într-un cont itch.io nu a fost efectuat. |

## Ce rămâne efectiv în afara implementării publicate

1. Găzduirea serverului online pe un endpoint HTTPS cu disc persistent, apoi testarea cu două dispozitive. GitHub Pages nu poate rula Node. Codul nu conține conturi, parole reale, abonamente sau destinații de server inventate.
2. Uploadul pachetului într-un cont itch.io identificat și autentificat.
3. Verificarea pe telefon fizic, cititor de ecran, modul avion și randarea WebGL completă. Browserul de previzualizare verifică alternativa 2D când WebGL este indisponibil.
4. Integrarea/merge și deployment-ul PR-urilor. Codul dintr-un PR nu este prezentat drept versiune publică deja livrată.

## Limite de produs

- Harta este stilizată; nu este hartă de navigație reală a Carpaților.
- Multiplayerul folosește schimb de poziții prin HTTP, cu latența pollingului; nu folosește rollback netcode.
- Clasamentul online este etichetat „comunitate”; serverul nu reproduce integral simularea pentru anti-cheat.
- Split-screen-ul și trofeele folosesc Canvas 2D, respectiv perspectivă CSS 3D; nu adaugă un al doilea motor WebGL.
- Reluările redau poziții înregistrate, nu o simulare deterministă completă a tuturor inputurilor.
- Deformarea terenului este superficială și plafonată; nu simulează volum de noroi sau distrugere structurală.
- Rezultatele V1/V2 sunt păstrate; regulile V2.1 au categorii distincte de record.
