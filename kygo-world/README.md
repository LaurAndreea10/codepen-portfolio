# Kygo World · Insulele din Nori

Joc browser RO/EN inspirat de Kygo. Pornește direct din `index.html`; nu are build sau biblioteci externe. Imaginile `sky-islands.jpg` și `kygo-sprite.webp` trebuie să rămână lângă fișier.

## Moduri

- **Poveste:** patru lumi tematice cu pericole distincte, 30 de pași și trei benzi de iarbă. Kygo aleargă automat; schimbi banda pentru lăbuțe și trei relicve, sari peste obstacole, folosești scutul și magnetul, treci prin puncte de control și o furtună finală. Colecția completă oferă o insignă. Viteza poveștii se reglează separat; în modul fără eșec sare automat peste obstacole.
- **Cursă:** trei piste, săritură peste pietre, alunecare sub arcade, rampe și lăbuțe.
- **Campionat:** trei manșe consecutive; **Endless:** urmărește recordul.
- **Labirint:** cheie, poartă, indiciu, dificultăți, ceață opțională și provocare zilnică fără cronometru.
- **Comoară:** trei chei pe insule; **Grădină / Zen:** colecție, flori, udat, anotimpuri și joacă; **Duo:** Kygo și pasărea prietenă adună împreună lăbuțe.

## Comenzi

| Acțiune | Tastatură | Mobil |
| --- | --- | --- |
| Poveste | Pornire cu Start; deplasare automată | Start pe scenă; atinge Sari pentru salt |\n| Alte moduri | Săgeți / WASD | Swipe, butoane ținute apăsate sau joystick opțional |
| Săritură / acțiune | Spațiu | Atingere pe scenă sau butonul Acțiune |
| Cursă: schimbă pista | Stânga / Dreapta | Swipe stânga / dreapta |
| Cursă: sari / alunecă | Sus / Jos | Swipe sus / jos |
| Prietenul din Duo | IJKL | Al doilea set de butoane |
| Pauză | P | Butonul Pauză |

Setări: limbă, temă, contrast, mișcare redusă, sensibilitate swipe, viteză separată pentru Poveste și Cursă, mod fără eșec, vibrație și sunet opționale, comenzi pentru mâna stângă, scanare cu un buton, hartă text pe ture. Progresul se salvează local pe dispozitiv.

## Testare

Sintaxa JavaScript este verificată cu `node --check`. Verificarea logicii simulează finalizarea unui nivel Poveste, adunarea cheilor în Comoară, rezolvarea labirintului și pornirea celorlalte moduri. Testarea vizuală directă pe un telefon rămâne recomandată.
