# Ghid de testare — Gimnaziu Space

## Scop

Validăm dacă aplicația este ușor de folosit pe telefon, tabletă și desktop, pentru elevi din clasele V–VIII. Testarea nu cere cont și nu colectează date personale.

## Matrice minimă

| Suprafață | Ce verificăm |
|---|---|
| Telefon | navigare, butoane de minimum 44 px, quiz, AI Coach, orientare portret |
| Tabletă | grile, formule, memoratoare, simulare, orientare portret/landscape |
| Desktop | sidebar, filtre, printare, export/import, tastatură |
| Tastatură/cititor de ecran | skip link, focus, titluri, feedback aria-live, contrast |

## Sesiune de 10 minute

1. Deschide aplicația și selectează clasa.
2. Găsește o formulă și marcheaz-o „Știu”.
3. Citește un memorator și repetă un cartonaș.
4. Pornește un quiz de 5 întrebări și alege intenționat un răspuns greșit.
5. Deschide AI Coach și cere explicația greșelii.
6. Deschide „Subiecte & bareme” și găsește un an.
7. Deschide „Testare & feedback” și salvează observația.
8. Verifică dark mode, română/engleză și mărirea textului.
9. Deschide „Diagnostic”, alege o clasă și o materie, apoi termină testul.
10. Verifică harta competențelor, treci la exercițiul adaptiv și printează raportul.
11. Dintr-un quiz, semnalează o întrebare și verifică enunțul precompletat în formularul local.
12. Filtrează quizul după subiect/dificultate, cere indicii, activează concentrarea și citirea vocală.
13. Printează o fișă, verifică planul adaptiv și generează raportul pentru familie/profesor.
14. Compară două diagnostice și verifică timpii din raportul local.
15. Închide conexiunea și verifică indicatorul offline; reconectează și verifică actualizarea.

## Verificări versiunea 2.5

- `node validate-content.mjs` — structură quiz, traduceri, indexuri de răspuns, ani arhivă și cazuri de backup invalid.
- Telefon (320–520 px): bara de jos are cinci destinații și nu creează coloane implicite sau scroll orizontal; celelalte secțiuni rămân în meniul principal.
- Backup: exportă progresul, importă-l înapoi, apoi încearcă un JSON cu un câmp nested invalid; importul invalid trebuie respins fără să schimbe progresul salvat.
- Linkuri oficiale: verifică fiecare an în browser. Testul automat confirmă doar hostul și forma rutei; disponibilitatea paginilor ține de site-ul Ministerului.

## Criterii de acceptare

- Elevul găsește prima activitate în maximum 30 de secunde.
- Un răspuns greșit este explicat și apare în registrul de greșeli.
- Nicio funcție critică nu cere cont sau plată.
- Feedbackul se salvează local și se poate exporta.
- Harta competențelor se salvează local și se actualizează după un diagnostic nou.
- Exercițiul adaptiv prioritizează subiectele sub 80%, eșantioanele scurte și răspunsurile greșite recente; fără date anterioare revine la setul mixt.
- Raportul imprimabil afișează clasa, materia, nivelurile pe competențe și ultima simulare EN salvată.
- Nu apar erori în consolă în traseul de mai sus.
- Toate variantele tematice de simulare păstrează baremul orientativ și cronometrul coerente.

Nu introduceți nume, emailuri, fotografii sau alte date personale în observații.
