# Candy Route Arena — server opțional

Arena este implementată și verificată cu doi clienți HTTP și două pagini de browser. **Nu este activată pe un domeniu public.** GitHub Pages găzduiește jocul static, nu procesul Node al Arenei. Jocul local și offline funcționează fără server.

## Pornire

Necesită Node 22+; nu folosește pachete externe.

```bash
cd candy-route
npm run arena
```

Ascultă implicit numai pe `127.0.0.1:3377`. În dezvoltare, configurează originea exactă a paginii:

```bash
CANDY_ARENA_ORIGINS=http://127.0.0.1:8765 npm run arena
```

Pentru utilizare între dispozitive, gazda aleasă trebuie să ruleze procesul și să ofere HTTPS. Configurația de producție se face separat, după alegerea găzduirii. Nu este creat niciun cont și nu este activat niciun serviciu plătit de această implementare.

Variabile:

- `CANDY_ARENA_HOST`: interfața de ascultare; implicit `127.0.0.1`.
- `CANDY_ARENA_PORT`: implicit `3377`.
- `CANDY_ARENA_ORIGINS`: origini permise separate prin virgulă; implicit `https://laurandreea10.github.io`.
- `CANDY_ARENA_STORE`: cale opțională pentru clasament JSON. Fără ea, rezultatele sunt în memorie și dispar la restart. Scrierea folosește un fișier temporar și rename; un fișier existent invalid blochează pornirea, în loc să fie suprascris.

## Flux

În Aventură → Campionat → Multiplayer online, introduci adresa serverului. Creează o cameră, transmite codul celuilalt jucător, apoi fiecare trimite o rută. Serverul alege puzzle-ul și calculează scorurile; ignoră orice scor trimis de client. Rezultatul apare după ambele trimiteri. Numele afișate nu sunt identități autentificate.

Tokenul fiecărui participant rămâne în `sessionStorage` al filei, separat de backupuri. După reload, apasă **Reia conexiunea**. Nu se deschide automat o conexiune la un server salvat. Închiderea filei poate elimina tokenul; camera expiră după 30 de minute. Un alt participant nu poate relua o cameră plină fără tokenul original.

Serverul limitează camerele la 50, corpul unei cereri la 20 KB, clasamentul la 100 de rezultate și cererile la 180/minut/adresă. Sunt necesare configurarea și monitorizarea gazdei pentru folosirea publică la scară mare. Serverul validează reguli și scoruri; nu certifică identitatea jucătorilor sau modul în care au găsit soluția.

## Teste

`node --test arena.test.mjs` verifică două sesiuni, tokenuri distincte, respingerea rutelor invalide, scoruri calculate de server, interdicția trimiterii repetate, origini, expirare și limite. `npm run test:adventure-ui` include un meci între două pagini de browser și reluarea conexiunii după reload, folosind un server local temporar.

## Container de găzduire

Dockerfile folosește Node 22, fără instalarea dependențelor de test. Contextul de build este directorul `candy-route`. Serverul ascultă pe `0.0.0.0` în container și acceptă `PORT` al gazdei, dacă nu setezi explicit `CANDY_ARENA_PORT`. Pentru activare în Render este necesară conectarea contului și alegerea serviciului; nu a fost creat niciun serviciu public sau abonament în această sesiune. Tokenurile rămân excluse din backupuri.
