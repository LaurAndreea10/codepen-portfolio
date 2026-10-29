# Acoperirea celor 24 de direcții — Expedition 2.0

Aceasta este o extindere funcțională a jocului existent. Tabelul separă implementarea concretă de ideile care nu sunt încă livrate; **nu toate subpunctele listei inițiale sunt finalizate**. Nicio opțiune online nu simulează existența unui serviciu.

| # | Direcție | Disponibil în această versiune | Subpuncte rămase |
|---|---|---|---|
| 1 | Fizică și control | Presiune/aderență/viteză, suspensii, frână față/spate, sensibilitate, trepte și ambreiaj opțional; asistența existentă | Model complet de transmisie și feedback vizual dedicat fiecărei cauze a căderii |
| 2 | Obstacole | Terenul existent plus rădăcini, poduri statice și scări; suprafețe și dificultate configurabile | Balansoare, platforme mobile și deformarea terenului |
| 3 | Trasee și regiuni | Cele 8 regiuni păstrate; variante sigură/rapidă/tehnică, puncte panoramice, obiecte de explorat și trasee prin seed | Ramificații fizice în aceeași cursă, sate și hărți geografice noi |
| 4 | Vreme | Vreme dinamică opțională în expediții, efect asupra aderenței pentru pilot și AI, vânt cu indicator, replay al tranzițiilor | Umezire graduală, ciclu continuu zi/noapte și urme persistente |
| 5 | Moduri | Cele 10 probe noi, cu obiective și reguli distincte, pe lângă cele 9 moduri originale | Echilibrare extinsă pe dispozitive reale |
| 6 | Carieră | Cariera existentă păstrată; trei serii în câte trei etape, timpi cumulați, trofee locale, licențe de probă, sponsor fictiv | Ligi elaborate, licențe pe clasă și sală de trofee 3D |
| 7 | AI | Personalitățile existente păstrate; anticiparea obstacolelor după stil, viteza adaptată vremii, nume constante în rally | AI cu aceleași constrângeri fizice ca pilotul și alegerea ramificațiilor |
| 8 | Campioni | Triada cu trei dueluri succesive, rivalul anunțat, progres și trofeu la final | Secvențe narative și recompense cosmetice proprii fiecărui nou campion |
| 9 | Garaj | Cele 5 clase păstrate; reglaje individuale, preseturi și test gratuit fără recompense | Istoric dedicat fiecărei motociclete și mai multe compromisuri de upgrade |
| 10 | Personalizare | Culori libere, 8 ținute salvate, echipamentul și modelele originale, fotografie exportabilă | Editor de stickere, jante și articole de echipament suplimentare |
| 11 | Power-up-uri | Boost, scut, aderență, slow time, magnet, reparație; o activare/cursă și categorie de record separată | Alte combinații și echilibrare pe fiecare disciplină |
| 12 | Misiuni | Misiuni zilnice/săptămânale deterministe, progres, revendicare unică și contract săptămânal | Lanțuri narative pe regiuni și urmărirea unui obiectiv selectat în HUD |
| 13 | Școală | Cele 7 lecții păstrate; recomandare contextuală după cursă, practică repetabilă și replay/ghost | Ghost demonstrativ special pentru fiecare lecție și examene noi |
| 14 | Analiză | Istoric filtrabil, sectoare, locul căderilor, viteze, grafic și sugestie de îmbunătățire | Numărătoare pe obstacol și hărți comparative detaliate |
| 15 | Ghost/replay | Import/export JSON, pauză/viteză/seek/camere, traseu și vreme păstrate, recorduri separate după reguli | Mai multe ghosturi simultan și marcaje automate de momente în timeline |
| 16 | Editor | Segmente, înălțime, suprafață, profil modelat prin drag sau numere, Undo/Redo, testare și export validat | Obiecte 3D plasabile liber și configurarea arbitrară a checkpointurilor |
| 17 | Prieteni | 2–4 jucători pe rând, runde și clasament; provocare asincronă prin fișier ghost | Split-screen real, cooperare, curse live, lobby și clasamente globale |
| 18 | Accesibilitate | Comenzi repoziționabile, grupare pentru o mână, preset cu două comenzi, sensibilitate și opțiunile originale | Audit complet cu cititor de ecran și control cu o singură comandă |
| 19 | Mobil | Aranjament responsive, butoane configurabile, checkpoint reluat ca antrenament, mod economic | Adaptare automată a calității după FPS și validare pe telefoane fizice |
| 20 | Imagine/sunet | Camerele și animațiile existente, motor cu timbru pe clasă, marcaje de obiectiv în 2D/3D și fotografie 2D | Decoruri noi, animații de pilot refăcute și filtre foto configurabile |
| 21 | Salvare/PWA | Migrare locală, backup validat, recuperare, 4 sloturi, versiune, cache limitat la acest joc | Conturi și sincronizare cloud; validare în modul avion pe dispozitiv |
| 22 | Evenimente | Cele 6 evenimente originale, previzualizare și arhivă locală a rezultatelor | Festival aniversar și reguli noi de revenire a recompenselor |
| 23 | Stabilitate | Teste core/SW/browser, idempotența recompenselor, importuri validate, cronometre izolate pe cursă, protejarea cache-urilor vecine | Testare manuală extinsă la rate de cadre diferite și pe hardware real |
| 24 | Distribuție | Studiu RO/EN, changelog păstrat, card PNG, link feedback și patch Arcade World cu bridge validat | Video tutorial și publicare itch.io, care necesită acces la contul respectiv |

## Servicii care lipsesc efectiv

Nu există un backend pentru conturi, cloud save, lobby și multiplayer live în repository-ul static. Aceste funcții necesită alegerea și configurarea unui serviciu, un protocol de sincronizare și teste de rețea. Nu au fost create conturi, abonamente sau baze de date externe. Integrarea Arcade World este pregătită într-un PR separat; până la merge și deploy, site-ul public nu o primește.

## Compatibilitate

Progresul V1 rămâne sub aceeași cheie. Fizica și regulile V2 au chei de clasament distincte. Backupurile vechi sunt normalizate, iar înainte de import se păstrează copia de recuperare. Datele vechi nu sunt declarate recorduri compatibile cu noua fizică.
