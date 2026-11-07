# ORACLE DRIFT — CSS random() Space Odyssey

## RO

Combină proiectele mele pentru CodePen Challenge CSS Random() din noiembrie 2026 într-un singur joc: **Random Constellation** (observatorul și oracolul din Night Oracle), **DICE DRIFT 3D** (zborul cu zaruri) și **VOID ORACLE** (arena de shooter).

Bucla jocului:

1. **Observatorul**: harta cu cinci constelații (Zarul, Vânătorul, Oracolul, Cometa, Busola). Oracolul alege cu CSS `random()` profeția (`random(0, 11, 1)`), trei zaruri (`random(1, 6, 1)`), regula arenei (`random(0, 7, 1)`), nuanța norocoasă a lumii (`random(0, 359, 1)`) și constelația-țintă (`random(0, 59, 1)`, din cele încă stinse). Poți arunca din nou o singură dată.
2. **Zborul 3D**: totalul zarurilor stabilește lungimea traseului. Fiecare obiect de pe traseu vine dintr-un element `.seed` cu propriile valori `random()`: poziție, tip (zar, asteroid, poartă, praf de stele) și fața zarului. Fețele prinse încarcă Nova, un 6 reface scutul, porțile la rând dau combo, iar asteroizii iau din scut.
3. **Arena**: două valuri și un boss cu tiparul constelației (rafale, foc țintit, spirală, ploaie, cruce rotitoare), cu trei faze, sub regula oracolului: ploaie de meteoriți, puncte duble, roi rapid, scut cadou, foc rapid, vid fragil, fântână gravitațională sau Nova încărcată.
4. **Constelația se aprinde** pe hartă. Când toate cinci sunt aprinse, începe un ciclu nou, mai greu, cu punctaj multiplicat.

Trei zaruri egale dau +1 scut. Foc automat, Nova pe Space sau pe buton, mod asistat, mișcare redusă, sunet comutabil, RO/EN (și `?lang=`), pauză automată când pleci din tab, anunțuri pentru cititoare de ecran, record salvat local.

JavaScript doar citește valorile calculate de CSS (`getComputedStyle` pe proprietăți `@property` de tip `<integer>`). Dacă browserul nu are încă `random()`, JavaScript completează aceleași proprietăți custom.

Un singur fișier, fără dependențe (doar fonturile Google). `index.pen.html` e aceeași versiune, pentru CodePen.

## EN

Combines my November 2026 CodePen CSS Random() Challenge projects into one game: **Random Constellation** (the observatory and the Night Oracle), **DICE DRIFT 3D** (the dice flight) and **VOID ORACLE** (the shooter arena).

1. **Observatory**: a map of five constellations. The oracle uses CSS `random()` for the fortune, three dice, the arena rule, the world's lucky hue and the target constellation. One free reroll.
2. **3D flight**: the dice total sets the route length; each object comes from a `.seed` element with its own `random()` values. Caught faces charge Nova, a 6 repairs the shield, consecutive gates build a combo, asteroids cost shield.
3. **Arena**: two waves and a three-phase boss with the constellation's pattern, under the oracle's rule.
4. **The constellation lights up**. Light all five for a new, harder cycle.

Without native `random()`, JavaScript fills in the same custom properties.

Author: Laura Andreea.

## CodePen tags

`cpc-css-random` · `codepenchallenge`
