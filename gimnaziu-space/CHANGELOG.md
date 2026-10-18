# Changelog — Gimnaziu Space

## 1.0.0 — 2026-10-18

Prima versiune.

- Acasă: alegerea clasei (V–VIII), numărătoare inversă EN 2027 (calendar în proiect), Demo de prezentare vs Experiența mea, coach local
- Pe clase, Formule (99), Memoratoare (27 + 29 de repere cronologice), Glosar (39)
- Cartonașe cu repetare spațiată Leitner, Quiz (83 de întrebări cu explicații)
- Simulare EN la matematică și română, cu cronometru și barem orientativ
- Pomodoro, plan de 7 zile, progres, insigne, export/import
- RO/EN, temă luminoasă/întunecată, setări de accesibilitate, PWA offline
- Mențiune vizibilă pe fiecare pagină: nu este material didactic oficial


## v2.0.0 · Unificare ExamSpace V–VIII · 2026-10-18

- Gimnaziu Space devine aplicația principală pentru clasele V–VIII.
- Au fost reunite AI Coach, registrul persistent al răspunsurilor greșite și explicațiile cu pași de reparare.
- Păstrate: formule, memoratoare, quizuri, simulări, subiecte și bareme, RO/EN, dark mode și accesibilitate.


## v2.1.0 · Pachet complet fără costuri · 2026-10-18

- Adăugate arhiva filtrabilă pentru subiecte și bareme și ruta Instrumente gratuite.
- Adăugate provocarea zilei, partajarea progresului, copierea linkului, printarea și certificatul HTML local.
- Extins backupul local, modul offline, comportamentul mobil și stilurile de printare.


## 2.2.0 — 2026-10-18

Pachet de validare și lansare fără costuri:

- rută locală „Testare & feedback” pentru sesiuni cu elevi;
- export JSON al observațiilor de testare;
- ghid pentru mobil, tabletă, desktop, tastatură și accesibilitate;
- checklist de verificare a conținutului și lansării;
- texte pregătite pentru Facebook și LinkedIn;
- ghid pentru capturi reale și trasee live;
- bundle și service worker actualizate.


## 2.3.0 — 2026-10-18

- Diagnostic inițial pe clasă și materie, cu hartă locală a competențelor.
- Quiz adaptiv care prioritizează competențele sub 80% și greșelile recente.
- Raport de recapitulare imprimabil, cu rezultate pe competențe și ultima simulare EN.
- Proveniență vizibilă pentru fiecare an din arhivă: Ministerul Educației și subiecte.edu.ro.
- Semnalarea unei probleme pornește formularul local cu întrebarea, clasa și materia completate.
- Backupurile existente primesc câmpurile noi în mod compatibil; datele rămân locale.


## 2.4.0 — 2026-10-18

- Extinsă banca de la 83 la 104 de itemi bilingvi în matematică, română, fizică, chimie, biologie, istorie, geografie și engleză.
- Adăugate filtre pentru subiect și dificultate estimativă, repetare spațiată a greșelilor, indicii în trei trepte și fișe de lucru imprimabile.
- Adăugate timp mediu/item, cronometrarea simulării, tendința diagnosticelor și raport local exportabil pentru familie/profesor.
- Adăugat plan adaptiv de recapitulare și variante tematice pentru simulările EN.
- Adăugate citirea vocală a întrebării, mod concentrare, ghid de citire, indicator online/offline/actualizare.
- Arhiva deschide acum pagina oficială pentru anul ales; diagnosticul trimite la programele școlare ale Ministerului și descrie explicit limitele etichetării automate.
- Feedbackul local poate fi clasificat pe categorii; cache-ul PWA a fost actualizat.

## 2.4.1 — 2026-10-18

- Versionate separat URL-urile pentru date și stiluri, pentru ca browserele cu cache PWA vechi să preia corect actualizarea 2.4.

## 2.5.0 — 2026-10-18

- Bara mobilă are cinci scurtături fără coloane implicite; toate celelalte secțiuni rămân în meniul principal.
- Backup JSON cu format explicit, compatibil cu exporturile v1 și validare completă a structurilor nested înainte de import; un fișier invalid sau prea mare nu suprascrie datele curente.
- Adăugat test automat pentru structura celor 104 de întrebări, textele RO/EN, răspunsuri, clase, materii, rutele arhivei și validarea backupurilor.
- Verificarea curriculumului rămâne marcată ca revizie de profesor; testul automat nu pretinde că validează adevărul fiecărei explicații.

## 2.6.0 — 2026-10-18

- Adăugată pagina Compare pentru a pune alături diagnostice și sesiuni PISA practice, cu progres pe competențe comune.
- Adăugat set PISA-style de șase sarcini originale, bilingve, din lectură, matematică și științe, cu explicații și istoric local.
- Rezultatele PISA intră în backupul verificat; datele vechi rămân compatibile.
- Actualizat cache-ul PWA și descrierile pentru noile module.
- Pagina precizează că sarcinile sunt orientative, nu itemi, punctaje sau evaluări oficiale OECD/PISA.

## 2.7.0 — 2026-10-18

- Pagina Acasă recomandă o misiune scurtă de 5 întrebări din greșelile recente, harta competențelor sau rezultatele quizurilor; progresul rămâne local.
- Progres → include o fișă imprimabilă din ultimele 20 de greșeli salvate, cu răspunsul ales, răspunsul corect și explicația existentă.
- Acasă → „Acoperirea băncii” afișează câte întrebări sunt etichetate pentru fiecare materie și clasă, cu legături către quizurile filtrate.
- Matricea descrie doar banca actuală de întrebări și precizează că nu certifică acoperirea programei.
- Extensie bilingvă în fișier separat, fără conturi, servicii externe sau date trimise în afara browserului; cache-ul offline a fost actualizat.
