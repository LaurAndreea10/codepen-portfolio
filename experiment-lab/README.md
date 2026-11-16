# Experiment Lab

Patru experimente interactive despre A/B testing și atribuire, în care intuiția se construiește prin simulare, nu prin formule.

**Autor:** Laura Andreea · Iași

## Cele patru experimente

1. **Privitul pe furiș.** 400 de teste A/A (fără nicio diferență reală), cu valoarea p urmărită la fiecare verificare. Arată câte teste ar fi fost declarate câștigătoare dacă te oprești la primul p < 0,05, comparat cu o singură verificare la final.
2. **Cât trafic îți trebuie.** Distribuția diferenței observate când variantele sunt identice și când B chiar este mai bun. Zona colorată este exact puterea testului. Calculează eșantionul necesar pentru 80% putere și durata la traficul tău.
3. **Atribuire.** 300 de călătorii generate (plus cele adăugate de tine) împărțite pe canale după cinci modele: prima atingere, ultima atingere, liniar, declin în timp, în formă de U. Evidențiază canalul al cărui merit se schimbă cel mai mult.
4. **Oprești testul?** Joc în opt runde: vezi datele de pe parcurs, alegi să lansezi, să păstrezi sau să aștepți, apoi afli adevărul. Rundele includ intenționat serii norocoase.

## Cum sunt făcute calculele

- Testul z pentru două proporții, cu varianță comună, bilateral.
- Putere și mărime de eșantion cu aproximarea normală (α = 0,05 bilateral, putere 80%).
- Simulările folosesc un generator pseudo-aleator cu seed și extrageri Bernoulli, vizitator cu vizitator.

Verificat față de valori cunoscute: p = 0,0597 pentru 50/1000 față de 70/1000; 31.231 de vizitatori per variantă pentru a detecta 5% → 5,5%.

## Structură

Un singur fișier, `index.html`, fără dependențe. `index.pen.html` este aceeași versiune, pentru CodePen. RO/EN (`?lang=en`), dark/light, taburi accesibile din tastatură.

## Verificat

Teste automate în Chromium la 1280 și 390 px: valorile statistice de mai sus, toate cele patru experimente, suma creditelor pe fiecare model (100%), un joc complet. Telefonul fizic, Safari, Firefox și cititoarele de ecran nu au fost verificate. Este un instrument de învățare, nu un calculator pentru decizii reale de business.
