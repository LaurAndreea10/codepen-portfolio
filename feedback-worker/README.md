# Păreri din Grădina Curioasă → portofoliu

Părinții scriu o părere în zona pentru adulți a jocului, fără niciun cont. Părerea ajunge ca Issue în acest repo, cu etichetele `feedback` și `pending`. Apare în portofoliu doar după ce adaugi eticheta `approved`.

```
joc (zona pentru părinți) → Cloudflare Worker (gratuit) → Issue GitHub „pending”
                                                             ↓ tu adaugi „approved”
                                          portofoliu (secțiunea Păreri, RO + EN)
```

## Activare (o singură dată, ~10 minute)

1. **Token GitHub.** Pe GitHub: Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token.
   - Repository access: *Only select repositories* → `codepen-portfolio`
   - Permissions → Repository permissions → **Issues: Read and write** (nimic altceva)
   - Copiază tokenul; nu-l pune niciodată în cod sau în repo.
2. **Worker Cloudflare.** Fă-ți cont gratuit pe cloudflare.com (cu e-mail), apoi Workers & Pages → Create → Worker. Numește-l `gradina-feedback` și apasă Deploy.
3. Deschide editorul Worker-ului, înlocuiește tot codul cu `worker.js` din acest director și apasă Deploy.
4. În Settings → Variables and Secrets ale Worker-ului adaugă:
   - `GITHUB_TOKEN` — tip **Secret**, valoarea tokenului de la pasul 1
   - `GITHUB_REPO` — `LaurAndreea10/codepen-portfolio`
   - `ALLOWED_ORIGINS` — `https://laurandreea10.github.io`
5. Copiază adresa Worker-ului (de forma `https://gradina-feedback.<numele-tău>.workers.dev`) și pune-o în `curious-garden/feedback.js`, pe linia `const ENDPOINT=...`. Până atunci, formularul arată „se activează în curând”.

## Moderare

- Fiecare părere nouă apare în **Issues**, cu eticheta `pending`. Primești notificare de la GitHub, inclusiv în aplicația de pe telefon.
- **Publici** adăugând eticheta `approved`. Poți corecta textul din blocul JSON înainte.
- **Ascunzi** scoțând eticheta `approved`. Poți închide Issue-ul oricând; doar eticheta contează.
- Portofoliul arată ultimele 9 păreri aprobate. Doar Issue-urile create de contul tău (prin Worker) sunt luate în seamă.

## Protecții incluse

- Nu se cer și nu se salvează e-mail, telefon sau linkuri; textele care le conțin sunt respinse.
- Acord obligatoriu pentru publicare; sfat să nu fie scris numele complet al copilului.
- Capcană pentru roboți, trimitere minimă după 4 secunde și cel mult 3 păreri la 10 minute de la aceeași adresă.
- Doar site-ul tău poate trimite (CORS), iar tokenul stă doar în Cloudflare.
- Totul e gratuit: Cloudflare Workers are 100.000 de cereri pe zi pe planul gratuit, iar GitHub Issues nu costă nimic.

## Teste

```
node feedback-worker/test.mjs
```
