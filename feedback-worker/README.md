# Păreri din Grădina Curioasă → portofoliu

Părinții scriu o părere în zona pentru adulți a jocului, fără niciun cont. Părerea ajunge ca Issue în acest repo, cu etichetele `feedback` și `pending`, și primești un e-mail cu ea. Apare în portofoliu doar după ce adaugi eticheta `approved`.

```
joc (zona pentru părinți) → Cloudflare Worker (gratuit) → Issue GitHub „pending”
                                          ↘ e-mail la tine (Resend, gratuit)
                                                             ↓ tu adaugi „approved”
                                          portofoliu (secțiunea Păreri, RO + EN)
```

## Activare (o singură dată, ~15 minute)

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
5. **E-mail (Resend).** Fă-ți cont gratuit pe resend.com **cu adresa la care vrei să primești părerile**. Creează o cheie API (API Keys → Create, permisiune *Sending access*) și adaug-o la Worker:
   - `RESEND_API_KEY` — tip **Secret**, cheia de la Resend
   - `NOTIFY_EMAIL` — aceeași adresă de e-mail ca a contului Resend

   Pe planul gratuit, Resend trimite doar la adresa contului tău, fără domeniu propriu. E exact cazul de aici. Primul e-mail poate ajunge în Spam: marchează-l „Nu este spam”.
6. Copiază adresa Worker-ului (de forma `https://gradina-feedback.<numele-tău>.workers.dev`) și pune-o în `curious-garden/feedback.js`, pe linia `const ENDPOINT=...`. Până atunci, formularul arată „se activează în curând”.

## Moderare

- Fiecare părere nouă îți vine pe **e-mail**, cu un buton spre Issue, și apare în **Issues** cu eticheta `pending`. GitHub nu te anunță singur, pentru că Issue-ul e creat chiar cu tokenul tău; de aceea există e-mailul.
- Dacă GitHub are o problemă, părerea tot ajunge pe e-mail, deci nu se pierde.
- **Publici** adăugând eticheta `approved`. Poți corecta textul din blocul JSON înainte.
- **Ascunzi** scoțând eticheta `approved`. Poți închide Issue-ul oricând; doar eticheta contează.
- Portofoliul arată ultimele 9 păreri aprobate. Doar Issue-urile create de contul tău (prin Worker) sunt luate în seamă.

## Protecții incluse

- Nu se cer și nu se salvează e-mail, telefon sau linkuri; textele care le conțin sunt respinse.
- Acord obligatoriu pentru publicare; sfat să nu fie scris numele complet al copilului.
- Capcană pentru roboți, trimitere minimă după 4 secunde și cel mult 3 păreri la 10 minute de la aceeași adresă.
- Doar site-ul tău poate trimite (CORS), iar tokenul stă doar în Cloudflare.
- Totul e gratuit: Cloudflare Workers are 100.000 de cereri pe zi pe planul gratuit, Resend trimite gratuit până la 100 de e-mailuri pe zi, iar GitHub Issues nu costă nimic.
- Adresa ta de e-mail nu apare nici în cod, nici în repo: stă doar în setările Worker-ului.

## Teste

```
node feedback-worker/test.mjs
```
