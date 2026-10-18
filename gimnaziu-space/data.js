'use strict';
/* Gimnaziu Space — conținut bilingv RO/EN pentru clasele V–VIII.
   Material de recapitulare personal, NU material didactic oficial.

   Mini-sintaxă pentru formule (randată ca HTML + citită corect de cititoarele de ecran):
     [a|b]   fracție a supra b         √{x}   radical din x
     ^2 ^{m+n}  exponent               _1 _{AB}  indice                                  */

const L = (ro, en) => ({ ro, en: en ?? ro });

const SUBJECTS = [
  { id: 'mat',  icon: '∑', hue: 210, ro: 'Matematică',      en: 'Mathematics',  grades: [5, 6, 7, 8], en8: true },
  { id: 'rom',  icon: 'Ă', hue: 345, ro: 'Limba română',    en: 'Romanian',     grades: [5, 6, 7, 8], en8: true },
  { id: 'fiz',  icon: 'F', hue: 265, ro: 'Fizică',          en: 'Physics',      grades: [6, 7, 8] },
  { id: 'chi',  icon: 'H', hue: 160, ro: 'Chimie',          en: 'Chemistry',    grades: [7, 8] },
  { id: 'bio',  icon: '❧', hue: 120, ro: 'Biologie',        en: 'Biology',      grades: [5, 6, 7, 8] },
  { id: 'ist',  icon: '⌛', hue: 30,  ro: 'Istorie',         en: 'History',      grades: [5, 6, 7, 8] },
  { id: 'geo',  icon: '◍', hue: 190, ro: 'Geografie',       en: 'Geography',    grades: [5, 6, 7, 8] },
  { id: 'eng',  icon: 'E', hue: 55,  ro: 'Limba engleză',   en: 'English',      grades: [5, 6, 7, 8] }
];

/* ─────────────────────────── FORMULE ─────────────────────────── */
const FORMULAS = [
  // Matematică · clasa a V-a
  { id: 'm-pow1', s: 'mat', g: [5], t: L('Produsul puterilor cu aceeași bază', 'Product of powers, same base'), m: 'a^m · a^n = a^{m+n}' },
  { id: 'm-pow2', s: 'mat', g: [5], t: L('Câtul puterilor cu aceeași bază', 'Quotient of powers, same base'), m: 'a^m : a^n = a^{m−n}', n: L('a ≠ 0, m ≥ n', 'a ≠ 0, m ≥ n') },
  { id: 'm-pow3', s: 'mat', g: [5], t: L('Puterea unei puteri', 'Power of a power'), m: '(a^m)^n = a^{m·n}' },
  { id: 'm-pow4', s: 'mat', g: [5], t: L('Puterea unui produs', 'Power of a product'), m: '(a · b)^n = a^n · b^n' },
  { id: 'm-pow0', s: 'mat', g: [5], t: L('Puteri speciale', 'Special powers'), m: 'a^0 = 1,  a^1 = a,  1^n = 1', n: L('a^0 = 1 doar pentru a ≠ 0', 'a^0 = 1 only for a ≠ 0') },
  { id: 'm-div',  s: 'mat', g: [5], t: L('Teorema împărțirii cu rest', 'Division with remainder'), m: 'D = Î · C + R,  R < Î', n: L('D – deîmpărțit, Î – împărțitor, C – cât, R – rest', 'D – dividend, Î – divisor, C – quotient, R – remainder') },
  { id: 'm-fr1',  s: 'mat', g: [5], t: L('Adunarea fracțiilor cu același numitor', 'Adding fractions, same denominator'), m: '[a|n] + [b|n] = [a + b|n]' },
  { id: 'm-fr2',  s: 'mat', g: [5, 6], t: L('Înmulțirea fracțiilor', 'Multiplying fractions'), m: '[a|b] · [c|d] = [a · c|b · d]' },
  { id: 'm-fr3',  s: 'mat', g: [5, 6], t: L('Împărțirea fracțiilor', 'Dividing fractions'), m: '[a|b] : [c|d] = [a|b] · [d|c]', n: L('Înmulțești cu inversa celei de-a doua', 'Multiply by the reciprocal of the second') },
  { id: 'm-ma',   s: 'mat', g: [5], t: L('Media aritmetică', 'Arithmetic mean'), m: 'm_a = [a_1 + a_2 + … + a_n|n]' },
  { id: 'm-sq',   s: 'mat', g: [5], t: L('Pătratul: perimetru și arie', 'Square: perimeter and area'), m: 'P = 4 · l,  A = l^2' },
  { id: 'm-rect', s: 'mat', g: [5], t: L('Dreptunghiul: perimetru și arie', 'Rectangle: perimeter and area'), m: 'P = 2 · (L + l),  A = L · l' },
  { id: 'm-cube5', s: 'mat', g: [5], t: L('Volumul cubului', 'Volume of a cube'), m: 'V = l^3' },
  { id: 'm-box5', s: 'mat', g: [5], t: L('Volumul paralelipipedului dreptunghic', 'Volume of a rectangular box'), m: 'V = L · l · h' },

  // Matematică · clasa a VI-a
  { id: 'm-prop', s: 'mat', g: [6], t: L('Proprietatea fundamentală a proporției', 'Fundamental property of proportions'), m: '[a|b] = [c|d]  ⇔  a · d = b · c', n: L('Produsul mezilor = produsul extremilor', 'Product of means = product of extremes') },
  { id: 'm-pct',  s: 'mat', g: [6], t: L('Procente', 'Percentages'), m: 'p% din x = [p|100] · x' },
  { id: 'm-dp',   s: 'mat', g: [6], t: L('Mărimi direct proporționale', 'Directly proportional quantities'), m: '[a|x] = [b|y] = [c|z] = k' },
  { id: 'm-ip',   s: 'mat', g: [6], t: L('Mărimi invers proporționale', 'Inversely proportional quantities'), m: 'a · x = b · y = c · z = k' },
  { id: 'm-prob', s: 'mat', g: [6], t: L('Probabilitatea unui eveniment', 'Probability of an event'), m: L('P = [nr. cazuri favorabile|nr. cazuri posibile]', 'P = [favourable outcomes|possible outcomes]'), n: L('0 ≤ P ≤ 1', '0 ≤ P ≤ 1') },
  { id: 'm-tri',  s: 'mat', g: [6], t: L('Suma unghiurilor unui triunghi', 'Sum of the angles of a triangle'), m: 'm(∠A) + m(∠B) + m(∠C) = 180°' },
  { id: 'm-ang',  s: 'mat', g: [6], t: L('Unghiuri complementare / suplementare', 'Complementary / supplementary angles'), m: L('complementare: 90°,  suplementare: 180°', 'complementary: 90°,  supplementary: 180°') },
  { id: 'm-ext',  s: 'mat', g: [6], t: L('Unghiul exterior al triunghiului', 'Exterior angle of a triangle'), m: L('m(∠ext) = suma celor două unghiuri interioare neadiacente', 'm(∠ext) = sum of the two non-adjacent interior angles') },
  { id: 'm-atri', s: 'mat', g: [6, 7], t: L('Aria triunghiului', 'Area of a triangle'), m: 'A = [b · h|2]' },
  { id: 'm-atrd', s: 'mat', g: [7], t: L('Aria triunghiului dreptunghic', 'Area of a right triangle'), m: 'A = [c_1 · c_2|2]' },

  // Matematică · clasa a VII-a
  { id: 'm-pit',  s: 'mat', g: [7], t: L('Teorema lui Pitagora', 'Pythagorean theorem'), m: 'a^2 = b^2 + c^2', n: L('a – ipotenuza; b, c – catetele', 'a – hypotenuse; b, c – legs') },
  { id: 'm-cat',  s: 'mat', g: [7], t: L('Teorema catetei', 'Leg theorem'), m: 'AB^2 = BD · BC', n: L('D – piciorul înălțimii din unghiul drept A', 'D – foot of the altitude from the right angle A') },
  { id: 'm-inal', s: 'mat', g: [7], t: L('Teorema înălțimii', 'Altitude theorem'), m: 'AD^2 = BD · DC' },
  { id: 'm-h',    s: 'mat', g: [7], t: L('Înălțimea în triunghiul dreptunghic', 'Altitude in a right triangle'), m: L('h = [c_1 · c_2|ip]', 'h = [c_1 · c_2|hyp]') },
  { id: 'm-sin',  s: 'mat', g: [7], t: L('Sinusul unui unghi ascuțit', 'Sine of an acute angle'), m: L('sin B = [cateta opusă|ipotenuză]', 'sin B = [opposite leg|hypotenuse]') },
  { id: 'm-cos',  s: 'mat', g: [7], t: L('Cosinusul unui unghi ascuțit', 'Cosine of an acute angle'), m: L('cos B = [cateta alăturată|ipotenuză]', 'cos B = [adjacent leg|hypotenuse]') },
  { id: 'm-tg',   s: 'mat', g: [7], t: L('Tangenta unui unghi ascuțit', 'Tangent of an acute angle'), m: L('tg B = [cateta opusă|cateta alăturată]', 'tan B = [opposite leg|adjacent leg]') },
  { id: 'm-fcp1', s: 'mat', g: [7], t: L('Pătratul sumei', 'Square of a sum'), m: '(a + b)^2 = a^2 + 2ab + b^2' },
  { id: 'm-fcp2', s: 'mat', g: [7], t: L('Pătratul diferenței', 'Square of a difference'), m: '(a − b)^2 = a^2 − 2ab + b^2' },
  { id: 'm-fcp3', s: 'mat', g: [7], t: L('Diferența de pătrate', 'Difference of squares'), m: 'a^2 − b^2 = (a − b)(a + b)' },
  { id: 'm-rad1', s: 'mat', g: [7], t: L('Produsul radicalilor', 'Product of square roots'), m: '√{a} · √{b} = √{a · b}', n: L('a, b ≥ 0', 'a, b ≥ 0') },
  { id: 'm-rad2', s: 'mat', g: [7], t: L('Scoaterea factorilor de sub radical', 'Taking factors out of a root'), m: '√{a^2 · b} = |a| · √{b}' },
  { id: 'm-rad3', s: 'mat', g: [7], t: L('Raționalizarea numitorului', 'Rationalising the denominator'), m: '[a|√{b}] = [a√{b}|b]' },
  { id: 'm-mg',   s: 'mat', g: [7], t: L('Media geometrică', 'Geometric mean'), m: 'm_g = √{a · b}', n: L('a, b ≥ 0', 'a, b ≥ 0') },
  { id: 'm-mp',   s: 'mat', g: [7], t: L('Media ponderată', 'Weighted mean'), m: 'm_p = [a · p_a + b · p_b|p_a + p_b]' },
  { id: 'm-ec1',  s: 'mat', g: [7], t: L('Ecuația de gradul I', 'Linear equation'), m: 'ax + b = 0  ⇒  x = −[b|a]', n: L('a ≠ 0', 'a ≠ 0') },
  { id: 'm-par',  s: 'mat', g: [7], t: L('Aria paralelogramului', 'Area of a parallelogram'), m: 'A = b · h' },
  { id: 'm-romb', s: 'mat', g: [7], t: L('Aria rombului', 'Area of a rhombus'), m: 'A = [d_1 · d_2|2]' },
  { id: 'm-trap', s: 'mat', g: [7], t: L('Aria trapezului', 'Area of a trapezoid'), m: 'A = [(B + b) · h|2]' },
  { id: 'm-lmt',  s: 'mat', g: [7], t: L('Linia mijlocie în trapez', 'Midsegment of a trapezoid'), m: 'l_m = [B + b|2]' },
  { id: 'm-lm',   s: 'mat', g: [7], t: L('Linia mijlocie în triunghi', 'Midsegment of a triangle'), m: L('l_m = [latura paralelă|2]', 'l_m = [parallel side|2]') },
  { id: 'm-echi', s: 'mat', g: [7], t: L('Triunghiul echilateral', 'Equilateral triangle'), m: 'h = [l√{3}|2],  A = [l^2√{3}|4]' },
  { id: 'm-diag', s: 'mat', g: [7], t: L('Diagonala pătratului', 'Diagonal of a square'), m: 'd = l√{2}' },
  { id: 'm-circ', s: 'mat', g: [7], t: L('Cercul: lungime și arie', 'Circle: circumference and area'), m: 'L = 2πR,  A = πR^2' },
  { id: 'm-arc',  s: 'mat', g: [7], t: L('Lungimea unui arc de cerc', 'Length of an arc'), m: 'l = [πRn°|180°]' },
  { id: 'm-sect', s: 'mat', g: [7], t: L('Aria sectorului de cerc', 'Area of a circular sector'), m: 'A = [πR^2n°|360°]' },
  { id: 'm-inscr', s: 'mat', g: [7], t: L('Unghiul înscris în cerc', 'Inscribed angle'), m: L('m(∠înscris) = [m(arcului cuprins)|2]', 'm(∠inscribed) = [m(intercepted arc)|2]') },

  // Matematică · clasa a VIII-a
  { id: 'm-flin', s: 'mat', g: [8], t: L('Funcția liniară', 'Linear function'), m: 'f(x) = ax + b', n: L('Gf ∩ Oy = (0, b); Gf ∩ Ox: rezolvi f(x) = 0', 'Gf ∩ Oy = (0, b); Gf ∩ Ox: solve f(x) = 0') },
  { id: 'm-dist', s: 'mat', g: [8], t: L('Distanța dintre două puncte', 'Distance between two points'), m: 'AB = √{(x_B − x_A)^2 + (y_B − y_A)^2}' },
  { id: 'm-mij',  s: 'mat', g: [8], t: L('Mijlocul unui segment', 'Midpoint of a segment'), m: 'M([x_A + x_B|2], [y_A + y_B|2])' },
  { id: 'm-delta', s: 'mat', g: [8], t: L('Ecuația de gradul al II-lea', 'Quadratic equation'), m: 'Δ = b^2 − 4ac,  x_{1,2} = [−b ± √{Δ}|2a]', n: L('Δ > 0: două soluții, Δ = 0: una, Δ < 0: nicio soluție reală', 'Δ > 0: two solutions, Δ = 0: one, Δ < 0: no real solution') },
  { id: 'm-cube', s: 'mat', g: [8], t: L('Cubul', 'Cube'), m: 'A_t = 6l^2,  V = l^3,  d = l√{3}' },
  { id: 'm-box',  s: 'mat', g: [8], t: L('Paralelipipedul dreptunghic', 'Rectangular box'), m: 'A_t = 2(Ll + lh + Lh),  V = Llh,  d = √{L^2 + l^2 + h^2}' },
  { id: 'm-prism', s: 'mat', g: [8], t: L('Prisma dreaptă', 'Right prism'), m: 'A_l = P_b · h,  A_t = A_l + 2A_b,  V = A_b · h' },
  { id: 'm-pyr',  s: 'mat', g: [8], t: L('Piramida regulată', 'Regular pyramid'), m: 'A_l = [P_b · a_p|2],  A_t = A_l + A_b,  V = [A_b · h|3]' },
  { id: 'm-apot', s: 'mat', g: [8], t: L('Apotema piramidei regulate', 'Slant height of a regular pyramid'), m: 'a_p^2 = h^2 + a_b^2', n: L('a_b – apotema bazei', 'a_b – apothem of the base') },
  { id: 'm-trunchi', s: 'mat', g: [8], t: L('Trunchiul de piramidă', 'Frustum of a pyramid'), m: 'V = [h|3](A_B + A_b + √{A_B · A_b})' },
  { id: 'm-cil',  s: 'mat', g: [8], t: L('Cilindrul circular drept', 'Right circular cylinder'), m: 'A_l = 2πRG,  A_t = 2πR(G + R),  V = πR^2G' },
  { id: 'm-con',  s: 'mat', g: [8], t: L('Conul circular drept', 'Right circular cone'), m: 'A_l = πRG,  A_t = πR(G + R),  V = [πR^2h|3]', n: L('G^2 = h^2 + R^2', 'G^2 = h^2 + R^2') },
  { id: 'm-tcon', s: 'mat', g: [8], t: L('Trunchiul de con', 'Frustum of a cone'), m: 'V = [πh|3](R^2 + r^2 + Rr)' },
  { id: 'm-sfera', s: 'mat', g: [8], t: L('Sfera', 'Sphere'), m: 'A = 4πR^2,  V = [4πR^3|3]' },

  // Fizică
  { id: 'f-v',    s: 'fiz', g: [6], t: L('Viteza medie', 'Average speed'), m: 'v_m = [d|t]', n: L('unitate SI: m/s; 1 m/s = 3,6 km/h', 'SI unit: m/s; 1 m/s = 3.6 km/h') },
  { id: 'f-rho',  s: 'fiz', g: [6], t: L('Densitatea', 'Density'), m: 'ρ = [m|V]', n: L('unitate SI: kg/m^3', 'SI unit: kg/m^3') },
  { id: 'f-G',    s: 'fiz', g: [6, 7], t: L('Greutatea', 'Weight'), m: 'G = m · g', n: L('g ≈ 9,8 N/kg (adesea se aproximează cu 10 N/kg)', 'g ≈ 9.8 N/kg (often rounded to 10 N/kg)') },
  { id: 'f-Fe',   s: 'fiz', g: [6, 7], t: L('Forța elastică (legea lui Hooke)', 'Elastic force (Hooke’s law)'), m: 'F_e = k · Δl' },
  { id: 'f-L',    s: 'fiz', g: [7], t: L('Lucrul mecanic', 'Mechanical work'), m: 'L = F · d', n: L('unitate SI: J (joule)', 'SI unit: J (joule)') },
  { id: 'f-P',    s: 'fiz', g: [7], t: L('Puterea mecanică', 'Mechanical power'), m: 'P = [L|t] = F · v', n: L('unitate SI: W (watt)', 'SI unit: W (watt)') },
  { id: 'f-eta',  s: 'fiz', g: [7], t: L('Randamentul', 'Efficiency'), m: 'η = [L_u|L_c] · 100%' },
  { id: 'f-Ec',   s: 'fiz', g: [7], t: L('Energia cinetică', 'Kinetic energy'), m: 'E_c = [m · v^2|2]' },
  { id: 'f-Ep',   s: 'fiz', g: [7], t: L('Energia potențială gravitațională', 'Gravitational potential energy'), m: 'E_p = m · g · h' },
  { id: 'f-Em',   s: 'fiz', g: [7], t: L('Energia mecanică', 'Mechanical energy'), m: 'E = E_c + E_p' },
  { id: 'f-M',    s: 'fiz', g: [7], t: L('Momentul forței', 'Moment of a force'), m: 'M = F · b', n: L('b – brațul forței', 'b – lever arm') },
  { id: 'f-lev',  s: 'fiz', g: [7], t: L('Echilibrul pârghiei', 'Lever balance'), m: 'F · b_F = R · b_R' },
  { id: 'f-p',    s: 'fiz', g: [7, 8], t: L('Presiunea', 'Pressure'), m: 'p = [F|S]', n: L('unitate SI: Pa (pascal)', 'SI unit: Pa (pascal)') },
  { id: 'f-ph',   s: 'fiz', g: [8], t: L('Presiunea hidrostatică', 'Hydrostatic pressure'), m: 'p = ρ · g · h' },
  { id: 'f-arh',  s: 'fiz', g: [8], t: L('Forța arhimedică', 'Buoyant force (Archimedes)'), m: L('F_A = ρ_{lichid} · g · V_{dezlocuit}', 'F_A = ρ_{liquid} · g · V_{displaced}') },
  { id: 'f-Q',    s: 'fiz', g: [8], t: L('Căldura (încălzire / răcire)', 'Heat (warming / cooling)'), m: 'Q = m · c · Δt', n: L('c – căldura specifică', 'c – specific heat') },
  { id: 'f-Qlat', s: 'fiz', g: [8], t: L('Căldura latentă (topire, vaporizare)', 'Latent heat (melting, vaporising)'), m: 'Q = m · λ' },
  { id: 'f-cal',  s: 'fiz', g: [8], t: L('Ecuația calorimetrică', 'Calorimetric equation'), m: L('Q_{primit} = Q_{cedat}', 'Q_{absorbed} = Q_{released}') },
  { id: 'f-I',    s: 'fiz', g: [8], t: L('Intensitatea curentului electric', 'Electric current'), m: 'I = [q|t]', n: L('unitate SI: A (amper)', 'SI unit: A (ampere)') },
  { id: 'f-ohm',  s: 'fiz', g: [8], t: L('Legea lui Ohm (porțiune de circuit)', 'Ohm’s law (circuit section)'), m: 'I = [U|R]' },
  { id: 'f-R',    s: 'fiz', g: [8], t: L('Rezistența unui conductor', 'Resistance of a conductor'), m: 'R = ρ · [l|S]', n: L('ρ – rezistivitatea materialului', 'ρ – resistivity of the material') },
  { id: 'f-Rs',   s: 'fiz', g: [8], t: L('Rezistoare în serie', 'Resistors in series'), m: 'R_s = R_1 + R_2 + … + R_n' },
  { id: 'f-Rp',   s: 'fiz', g: [8], t: L('Rezistoare în paralel', 'Resistors in parallel'), m: '[1|R_p] = [1|R_1] + [1|R_2] + … + [1|R_n]' },
  { id: 'f-Pel',  s: 'fiz', g: [8], t: L('Puterea electrică', 'Electric power'), m: 'P = U · I = I^2 · R = [U^2|R]' },
  { id: 'f-W',    s: 'fiz', g: [8], t: L('Energia electrică', 'Electrical energy'), m: 'W = U · I · t = P · t', n: L('1 kWh = 3 600 000 J', '1 kWh = 3,600,000 J') },

  // Chimie
  { id: 'c-M',    s: 'chi', g: [7], t: L('Masa molară', 'Molar mass'), m: L('M = suma maselor atomice (A) din formulă', 'M = sum of the atomic masses (A) in the formula'), n: L('Ex.: M_{H_2O} = 2 · 1 + 16 = 18 g/mol', 'E.g. M_{H_2O} = 2 · 1 + 16 = 18 g/mol') },
  { id: 'c-n',    s: 'chi', g: [7], t: L('Numărul de moli', 'Number of moles'), m: 'n = [m|M]' },
  { id: 'c-NA',   s: 'chi', g: [7], t: L('Numărul de particule', 'Number of particles'), m: 'N = n · N_A,  N_A ≈ 6,022 · 10^{23} mol^{−1}' },
  { id: 'c-c',    s: 'chi', g: [7], t: L('Concentrația procentuală', 'Percent concentration'), m: 'c = [m_d|m_s] · 100', n: L('m_d – masa substanței dizolvate, m_s – masa soluției', 'm_d – mass of solute, m_s – mass of solution') },
  { id: 'c-ms',   s: 'chi', g: [7], t: L('Masa soluției', 'Mass of the solution'), m: L('m_s = m_d + m_{apă}', 'm_s = m_d + m_{water}') },
  { id: 'c-pct',  s: 'chi', g: [7], t: L('Compoziția procentuală a unui element', 'Percent composition of an element'), m: L('%E = [masa elementului într-un mol|M] · 100', '%E = [mass of the element in one mole|M] · 100') },
  { id: 'c-cons', s: 'chi', g: [7, 8], t: L('Legea conservării masei', 'Law of conservation of mass'), m: L('m_{reactanți} = m_{produși}', 'm_{reactants} = m_{products}') },
  { id: 'c-Vm',   s: 'chi', g: [8], t: L('Volumul molar al gazelor (c.n.)', 'Molar volume of gases (STP)'), m: 'V = n · V_m,  V_m = 22,4 L/mol' },
  { id: 'c-ro',   s: 'chi', g: [7], t: L('Densitatea soluției', 'Density of a solution'), m: 'ρ = [m_s|V_s]' }
];

/* ───────────────────────── MEMORATOARE ───────────────────────── */
// Fiecare foaie: { id, s, g, t, i: [[termen, explicație], …] } — fiecare element L(ro, en)
const P = (a, b) => [a, b];
const MEMOS = [
  // ───── Limba română
  { id: 'r-pv', s: 'rom', g: [5, 6, 7, 8], t: L('Părțile de vorbire', 'Parts of speech'), i: [
    P(L('Flexibile (își schimbă forma)', 'Inflected (change form)'), L('substantiv, articol, adjectiv, pronume, numeral, verb', 'noun, article, adjective, pronoun, numeral, verb')),
    P(L('Neflexibile', 'Uninflected'), L('adverb, prepoziție, conjuncție, interjecție', 'adverb, preposition, conjunction, interjection')),
    P(L('Substantivul', 'Noun'), L('gen, număr, caz; comun sau propriu (fată, București)', 'gender, number, case; common or proper (fată, București)')),
    P(L('Verbul', 'Verb'), L('persoană, număr, timp, mod; predicativ, copulativ (a fi, a deveni) sau auxiliar', 'person, number, tense, mood; predicative, linking (a fi, a deveni) or auxiliary')),
    P(L('Cazurile', 'Cases'), L('N (cine? ce?), Ac (pe cine? ce?), G (al, a, ai, ale cui?), D (cui?), V (strigare)', 'N (who? what?), Ac (whom? what?), G (whose?), D (to whom?), V (address)')),
    P(L('Modurile verbului', 'Verb moods'), L('personale: indicativ, conjunctiv, condițional-optativ, imperativ; nepersonale: infinitiv, gerunziu, participiu, supin', 'finite: indicative, subjunctive, conditional, imperative; non-finite: infinitive, gerund, participle, supine'))
  ]},
  { id: 'r-pp', s: 'rom', g: [5, 6, 7, 8], t: L('Părțile de propoziție', 'Parts of the sentence'), i: [
    P(L('Subiectul', 'Subject'), L('răspunde la „cine?” / „ce?” pus verbului; poate fi exprimat, inclus sau subînțeles', 'answers “who?/what?” about the verb; can be stated, included in the verb or implied')),
    P(L('Predicatul verbal', 'Verbal predicate'), L('verb la mod personal (Ana citește.)', 'finite verb (Ana citește.)')),
    P(L('Predicatul nominal', 'Nominal predicate'), L('verb copulativ + nume predicativ (Cerul este senin.)', 'linking verb + predicate noun/adjective (Cerul este senin.)')),
    P(L('Atributul', 'Attribute'), L('determină un substantiv: care? ce fel de? al cui? (casa veche)', 'modifies a noun: which? what kind? whose? (casa veche)')),
    P(L('Complementul direct', 'Direct object'), L('pe cine? ce? (Citesc o carte.)', 'whom? what? (Citesc o carte.)')),
    P(L('Complementul indirect', 'Indirect object'), L('cui? despre cine? cu cine? (I-am scris prietenei.)', 'to whom? about whom? (I-am scris prietenei.)')),
    P(L('Complementele circumstanțiale', 'Adverbials'), L('de loc (unde?), de timp (când?), de mod (cum?), de cauză (de ce?), de scop (cu ce scop?)', 'place (where?), time (when?), manner (how?), cause (why?), purpose (what for?)'))
  ]},
  { id: 'r-fs', s: 'rom', g: [5, 6, 7, 8], t: L('Figurile de stil', 'Figures of speech'), i: [
    P(L('Epitetul', 'Epithet'), L('determinant care exprimă o însușire expresivă: „codrul verde”', 'an expressive descriptor: „codrul verde”')),
    P(L('Comparația', 'Simile'), L('apropie doi termeni printr-un element de legătură (ca, precum, cât): „alb ca neaua”', 'links two terms with “like/as”: „alb ca neaua”')),
    P(L('Personificarea', 'Personification'), L('atribuie însușiri omenești unor lucruri sau ființe: „vântul plânge”', 'gives human traits to objects or animals: „vântul plânge”')),
    P(L('Metafora', 'Metaphor'), L('comparație subînțeleasă, fără element de legătură: „ochii — două stele”', 'an implied comparison without “like”: „ochii — două stele”')),
    P(L('Enumerația', 'Enumeration'), L('înșiruire de termeni de același fel', 'a list of similar terms')),
    P(L('Repetiția', 'Repetition'), L('reluarea unui cuvânt pentru accent', 'repeating a word for emphasis')),
    P(L('Hiperbola', 'Hyperbole'), L('exagerare: „un uriaș cât un munte”', 'exaggeration: „un uriaș cât un munte”')),
    P(L('Antiteza', 'Antithesis'), L('opoziție între două idei sau imagini', 'contrast between two ideas or images')),
    P(L('Inversiunea', 'Inversion'), L('schimbarea ordinii firești a cuvintelor: „albastra zare”', 'reversing the usual word order: „albastra zare”'))
  ]},
  { id: 'r-orto', s: 'rom', g: [5, 6, 7, 8], t: L('Ortografie: scriere cu sau fără cratimă', 'Spelling: with or without hyphen'), i: [
    P(L('s-a / sa', 's-a / sa'), L('s-a = pronume + verb (s-a dus); sa = adjectiv posesiv (cartea sa)', 's-a = pronoun + verb (s-a dus); sa = possessive (cartea sa)')),
    P(L('s-au / sau', 's-au / sau'), L('s-au = pronume + verb (s-au jucat); sau = conjuncție (azi sau mâine)', 's-au = pronoun + verb (s-au jucat); sau = “or” (azi sau mâine)')),
    P(L('i-a / ia', 'i-a / ia'), L('i-a = pronume + verb (i-a spus); ia = verbul a lua (ia cartea)', 'i-a = pronoun + verb (i-a spus); ia = “take” (ia cartea)')),
    P(L('l-a / la', 'l-a / la'), L('l-a = pronume + verb (l-a văzut); la = prepoziție (la școală)', 'l-a = pronoun + verb (l-a văzut); la = preposition (la școală)')),
    P(L('v-a / va', 'v-a / va'), L('v-a = pronume + verb (v-a chemat); va = auxiliar de viitor (va pleca)', 'v-a = pronoun + verb (v-a chemat); va = future auxiliary (va pleca)')),
    P(L('ne-a / nea', 'ne-a / nea'), L('ne-a = pronume + verb (ne-a ajutat); nea = zăpadă', 'ne-a = pronoun + verb (ne-a ajutat); nea = snow')),
    P(L('n-am / neam', 'n-am / neam'), L('n-am = nu am; neam = familie, popor', 'n-am = “I don’t have”; neam = kin, people')),
    P(L('odată / o dată', 'odată / o dată'), L('odată = cândva (A fost odată); o dată = o singură dată (am fost o dată)', 'odată = once upon a time; o dată = one single time')),
    P(L('numai / nu mai', 'numai / nu mai'), L('numai = doar; nu mai = negație (nu mai vine)', 'numai = only; nu mai = no longer')),
    P(L('deloc / de loc', 'deloc / de loc'), L('deloc = nicidecum; de loc = de origine (e de loc din Iași)', 'deloc = not at all; de loc = native to (e de loc din Iași)'))
  ]},
  { id: 'r-gen', s: 'rom', g: [5, 6, 7, 8], t: L('Genuri, specii și moduri de expunere', 'Genres, forms and modes'), i: [
    P(L('Genul epic', 'Epic genre'), L('acțiune, narator, personaje; specii: basm, fabulă, legendă, schiță, povestire, nuvelă, roman', 'plot, narrator, characters; forms: fairy tale, fable, legend, sketch, short story, novella, novel')),
    P(L('Genul liric', 'Lyric genre'), L('exprimarea directă a sentimentelor; specii: pastel, doină, poezie lirică', 'direct expression of feelings; forms: pastoral, doina, lyric poem')),
    P(L('Genul dramatic', 'Dramatic genre'), L('text pentru scenă: replici, indicații scenice; specii: comedie, dramă', 'written for the stage: lines, stage directions; forms: comedy, drama')),
    P(L('Narațiunea', 'Narration'), L('relatarea întâmplărilor în ordine', 'telling events in order')),
    P(L('Descrierea', 'Description'), L('prezintă trăsături ale unui loc, obiect sau personaj (portret, tablou)', 'presents features of a place, object or character')),
    P(L('Dialogul', 'Dialogue'), L('schimb de replici între personaje; dinamizează acțiunea', 'exchange of lines between characters')),
    P(L('Momentele subiectului', 'Plot stages'), L('expozițiune → intriga → desfășurarea acțiunii → punctul culminant → deznodământ', 'exposition → inciting incident → rising action → climax → resolution'))
  ]},
  { id: 'r-fraza', s: 'rom', g: [7, 8], t: L('Fraza: coordonare și subordonare', 'Complex sentences: coordination and subordination'), i: [
    P(L('Coordonare copulativă', 'Copulative coordination'), L('și, nici, iar (adăugare)', 'și, nici, iar (adding)')),
    P(L('Coordonare adversativă', 'Adversative coordination'), L('dar, iar, însă, ci (opoziție)', 'dar, iar, însă, ci (contrast)')),
    P(L('Coordonare disjunctivă', 'Disjunctive coordination'), L('sau, ori, fie (alegere)', 'sau, ori, fie (choice)')),
    P(L('Coordonare conclusivă', 'Conclusive coordination'), L('deci, așadar, prin urmare (concluzie)', 'deci, așadar, prin urmare (conclusion)')),
    P(L('Subordonate', 'Subordinate clauses'), L('subiectivă, predicativă, atributivă, completivă directă/indirectă, circumstanțiale (de loc, timp, mod, cauză, scop)', 'subject, predicative, relative, object clauses, adverbial clauses (place, time, manner, cause, purpose)')),
    P(L('Numărul propozițiilor', 'Counting clauses'), L('= numărul predicatelor (verbe la mod personal)', '= the number of predicates (finite verbs)'))
  ]},
  { id: 'r-comp', s: 'rom', g: [6, 7, 8], t: L('Compuneri: structuri utile', 'Writing tasks: useful structures'), i: [
    P(L('Text argumentativ', 'Argumentative text'), L('opinia (ipoteza) → cel puțin două argumente cu exemple → concluzie; conectori: în primul rând, în al doilea rând, așadar', 'opinion → at least two arguments with examples → conclusion; linkers: firstly, secondly, therefore')),
    P(L('Caracterizarea de personaj', 'Character sketch'), L('prezentare → trăsătură 1 + secvență → trăsătură 2 + secvență → mijloace directe/indirecte → concluzie', 'introduction → trait 1 + passage → trait 2 + passage → direct/indirect means → conclusion')),
    P(L('Rezumatul', 'Summary'), L('persoana a III-a, fără dialog și fără citate, ideile principale în ordine, timp verbal unitar', 'third person, no dialogue or quotes, main ideas in order, consistent tense')),
    P(L('Textul narativ', 'Narrative text'), L('titlu, momentele subiectului, narator, timp și spațiu precizate', 'title, plot stages, narrator, clear time and place')),
    P(L('Verificarea finală', 'Final check'), L('număr de cuvinte cerut, așezare în pagină, ortografie, punctuație, scris lizibil', 'word count, layout, spelling, punctuation, legible handwriting'))
  ]},
  { id: 'r-punct', s: 'rom', g: [5, 6, 7, 8], t: L('Virgula: reguli esențiale', 'Commas: essential rules'), i: [
    P(L('Se pune virgulă', 'Use a comma'), L('la enumerare, la vocativ, înaintea lui dar/însă/ci, după o apoziție, după subordonata circumstanțială așezată înaintea regentei', 'in lists, around a vocative, before dar/însă/ci, around an apposition, after a fronted adverbial clause')),
    P(L('Nu se pune virgulă', 'No comma'), L('între subiect și predicat, între predicat și complementul direct, înaintea lui „și” copulativ (în general)', 'between subject and predicate, between verb and direct object, before copulative „și” (usually)'))
  ]},

  // ───── Matematică
  { id: 'm-divz', s: 'mat', g: [5, 6], t: L('Criterii de divizibilitate', 'Divisibility rules'), i: [
    P(L('cu 2', 'by 2'), L('ultima cifră pară (0, 2, 4, 6, 8)', 'last digit even')),
    P(L('cu 3', 'by 3'), L('suma cifrelor se divide cu 3', 'sum of digits divisible by 3')),
    P(L('cu 4', 'by 4'), L('numărul format din ultimele două cifre se divide cu 4', 'the last two digits form a multiple of 4')),
    P(L('cu 5', 'by 5'), L('ultima cifră 0 sau 5', 'last digit 0 or 5')),
    P(L('cu 9', 'by 9'), L('suma cifrelor se divide cu 9', 'sum of digits divisible by 9')),
    P(L('cu 10', 'by 10'), L('ultima cifră 0', 'last digit 0')),
    P(L('cu 25', 'by 25'), L('ultimele două cifre: 00, 25, 50 sau 75', 'last two digits 00, 25, 50 or 75')),
    P(L('Numere prime < 50', 'Primes < 50'), L('2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47', '2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47'))
  ]},
  { id: 'm-mult', s: 'mat', g: [5, 6, 7, 8], t: L('Mulțimi de numere și ordinea operațiilor', 'Number sets and order of operations'), i: [
    P(L('Incluziuni', 'Inclusions'), L('ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ', 'ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ')),
    P(L('Numere iraționale', 'Irrational numbers'), L('ℝ \\ ℚ, de exemplu √2, √3, π', 'ℝ \\ ℚ, e.g. √2, √3, π')),
    P(L('Ordinea operațiilor', 'Order of operations'), L('paranteze rotunde → drepte → acolade; apoi puteri, apoi × și :, apoi + și −', 'round → square → curly brackets; then powers, then × and :, then + and −')),
    P(L('Modulul', 'Absolute value'), L('|x| = x dacă x ≥ 0; |x| = −x dacă x < 0', '|x| = x if x ≥ 0; |x| = −x if x < 0'))
  ]},
  { id: 'm-um', s: 'mat', g: [5, 6], t: L('Unități de măsură', 'Units of measurement'), i: [
    P(L('Lungime', 'Length'), L('1 km = 1000 m; 1 m = 10 dm = 100 cm = 1000 mm', '1 km = 1000 m; 1 m = 10 dm = 100 cm = 1000 mm')),
    P(L('Arie', 'Area'), L('1 m² = 100 dm² = 10 000 cm²; 1 ha = 10 000 m²; 1 ar = 100 m²', '1 m² = 100 dm² = 10,000 cm²; 1 ha = 10,000 m²; 1 are = 100 m²')),
    P(L('Volum', 'Volume'), L('1 m³ = 1000 dm³; 1 dm³ = 1000 cm³', '1 m³ = 1000 dm³; 1 dm³ = 1000 cm³')),
    P(L('Capacitate', 'Capacity'), L('1 L = 1 dm³; 1 L = 1000 mL', '1 L = 1 dm³; 1 L = 1000 mL')),
    P(L('Masă', 'Mass'), L('1 t = 1000 kg; 1 kg = 1000 g', '1 t = 1000 kg; 1 kg = 1000 g')),
    P(L('Timp', 'Time'), L('1 h = 60 min = 3600 s; 1 zi = 24 h', '1 h = 60 min = 3600 s; 1 day = 24 h'))
  ]},
  { id: 'm-trig', s: 'mat', g: [7, 8], t: L('Valori trigonometrice uzuale', 'Common trigonometric values'), i: [
    P(L('30°', '30°'), L('sin = 1/2, cos = √3/2, tg = √3/3', 'sin = 1/2, cos = √3/2, tan = √3/3')),
    P(L('45°', '45°'), L('sin = √2/2, cos = √2/2, tg = 1', 'sin = √2/2, cos = √2/2, tan = 1')),
    P(L('60°', '60°'), L('sin = √3/2, cos = 1/2, tg = √3', 'sin = √3/2, cos = 1/2, tan = √3')),
    P(L('Cateta opusă unghiului de 30°', 'Leg opposite 30°'), L('este jumătate din ipotenuză', 'is half the hypotenuse'))
  ]},
  { id: 'm-lin', s: 'mat', g: [6, 7], t: L('Linii și puncte importante în triunghi', 'Key lines and points in a triangle'), i: [
    P(L('Medianele → G', 'Medians → G'), L('centrul de greutate; G este la 2/3 de vârf și 1/3 de bază pe fiecare mediană', 'centroid; G lies 2/3 from the vertex on each median')),
    P(L('Bisectoarele → I', 'Angle bisectors → I'), L('centrul cercului înscris', 'centre of the inscribed circle')),
    P(L('Mediatoarele → O', 'Perpendicular bisectors → O'), L('centrul cercului circumscris', 'centre of the circumscribed circle')),
    P(L('Înălțimile → H', 'Altitudes → H'), L('ortocentrul', 'orthocentre')),
    P(L('Triunghi dreptunghic', 'Right triangle'), L('mediana dusă din unghiul drept = ipotenuza / 2', 'median to the hypotenuse = hypotenuse / 2'))
  ]},
  { id: 'm-pat', s: 'mat', g: [7], t: L('Patrulatere: proprietăți', 'Quadrilaterals: properties'), i: [
    P(L('Paralelogram', 'Parallelogram'), L('laturi opuse paralele și egale; diagonalele se înjumătățesc', 'opposite sides parallel and equal; diagonals bisect each other')),
    P(L('Dreptunghi', 'Rectangle'), L('paralelogram cu un unghi drept; diagonale egale', 'parallelogram with a right angle; equal diagonals')),
    P(L('Romb', 'Rhombus'), L('paralelogram cu laturi egale; diagonale perpendiculare, sunt bisectoare', 'parallelogram with equal sides; perpendicular diagonals that bisect the angles')),
    P(L('Pătrat', 'Square'), L('dreptunghi și romb în același timp', 'both a rectangle and a rhombus')),
    P(L('Trapez', 'Trapezoid'), L('o singură pereche de laturi paralele; isoscel: laturi neparalele egale, diagonale egale', 'exactly one pair of parallel sides; isosceles: equal legs and diagonals')),
    P(L('Suma unghiurilor', 'Angle sum'), L('360° în orice patrulater convex', '360° in any convex quadrilateral'))
  ]},
  { id: 'm-en', s: 'mat', g: [8], t: L('Strategie pentru proba de matematică', 'Strategy for the maths paper'), i: [
    P(L('Structura', 'Structure'), L('3 subiecte × 6 itemi (18 în total), 2 ore; verifică mereu modelul oficial al anului', '3 parts × 6 items (18 in total), 2 hours; always check the official model for the year')),
    P(L('Ordinea', 'Order'), L('rezolvă întâi itemii siguri, marchează-i pe ceilalți și revino', 'solve the sure items first, mark the rest and come back')),
    P(L('Geometrie', 'Geometry'), L('desen mare, notații clare, scrie ipoteza și ce ai de demonstrat', 'large drawing, clear labels, write the givens and the goal')),
    P(L('Redactarea', 'Write-up'), L('justifică fiecare pas; unitățile de măsură la final', 'justify every step; units at the end')),
    P(L('Verificare', 'Check'), L('înlocuiește soluția în ecuație; estimează dacă rezultatul are sens', 'substitute back; estimate whether the result makes sense'))
  ]},

  // ───── Fizică
  { id: 'f-si', s: 'fiz', g: [6, 7, 8], t: L('Unități SI și transformări', 'SI units and conversions'), i: [
    P(L('Mărimi fundamentale', 'Base quantities'), L('lungime – m, masă – kg, timp – s, intensitate – A, temperatură – K', 'length – m, mass – kg, time – s, current – A, temperature – K')),
    P(L('Unități derivate', 'Derived units'), L('forță – N, lucru mecanic/energie – J, putere – W, presiune – Pa, tensiune – V, rezistență – Ω', 'force – N, work/energy – J, power – W, pressure – Pa, voltage – V, resistance – Ω')),
    P(L('Prefixe', 'Prefixes'), L('k = 10³, M = 10⁶, c = 10⁻², m = 10⁻³, μ = 10⁻⁶', 'k = 10³, M = 10⁶, c = 10⁻², m = 10⁻³, μ = 10⁻⁶')),
    P(L('km/h ↔ m/s', 'km/h ↔ m/s'), L('km/h : 3,6 = m/s; m/s · 3,6 = km/h', 'km/h ÷ 3.6 = m/s; m/s × 3.6 = km/h')),
    P(L('Temperatură', 'Temperature'), L('T(K) = t(°C) + 273,15', 'T(K) = t(°C) + 273.15'))
  ]},
  { id: 'f-el', s: 'fiz', g: [8], t: L('Circuite electrice', 'Electric circuits'), i: [
    P(L('Ampermetrul', 'Ammeter'), L('se leagă în serie', 'connected in series')),
    P(L('Voltmetrul', 'Voltmeter'), L('se leagă în paralel', 'connected in parallel')),
    P(L('În serie', 'In series'), L('aceeași intensitate; tensiunile se adună', 'same current; voltages add up')),
    P(L('În paralel', 'In parallel'), L('aceeași tensiune; intensitățile se adună', 'same voltage; currents add up')),
    P(L('Siguranță', 'Safety'), L('nu atinge prizele sau firele dezizolate; experimentele se fac doar cu profesorul', 'never touch sockets or bare wires; experiments only with a teacher'))
  ]},

  // ───── Chimie
  { id: 'c-elem', s: 'chi', g: [7, 8], t: L('Elemente uzuale și valențe', 'Common elements and valences'), i: [
    P(L('H, Na, K, Ag', 'H, Na, K, Ag'), L('valența I', 'valence I')),
    P(L('O, Mg, Ca, Zn, Ba', 'O, Mg, Ca, Zn, Ba'), L('valența II', 'valence II')),
    P(L('Al', 'Al'), L('valența III', 'valence III')),
    P(L('C', 'C'), L('valența IV (și II)', 'valence IV (and II)')),
    P(L('Fe, Cu', 'Fe, Cu'), L('Fe: II, III; Cu: I, II', 'Fe: II, III; Cu: I, II')),
    P(L('Mase atomice rotunjite', 'Rounded atomic masses'), L('H = 1, C = 12, N = 14, O = 16, Na = 23, Mg = 24, Al = 27, S = 32, Cl = 35,5, Ca = 40, Fe = 56, Cu = 64', 'H = 1, C = 12, N = 14, O = 16, Na = 23, Mg = 24, Al = 27, S = 32, Cl = 35.5, Ca = 40, Fe = 56, Cu = 64'))
  ]},
  { id: 'c-subst', s: 'chi', g: [7, 8], t: L('Clase de substanțe și indicatori', 'Classes of substances and indicators'), i: [
    P(L('Oxizi', 'Oxides'), L('element + oxigen (CO₂, CaO)', 'element + oxygen (CO₂, CaO)')),
    P(L('Acizi', 'Acids'), L('H + radical acid (HCl, H₂SO₄); pH < 7; înroșesc turnesolul', 'H + acid radical (HCl, H₂SO₄); pH < 7; turn litmus red')),
    P(L('Baze', 'Bases'), L('metal + grupări OH (NaOH, Ca(OH)₂); pH > 7; albăstresc turnesolul; fenolftaleina devine roșu-carmin', 'metal + OH groups (NaOH, Ca(OH)₂); pH > 7; turn litmus blue; phenolphthalein turns pink-red')),
    P(L('Săruri', 'Salts'), L('metal + radical acid (NaCl, CaCO₃)', 'metal + acid radical (NaCl, CaCO₃)')),
    P(L('Neutralizare', 'Neutralisation'), L('acid + bază → sare + apă', 'acid + base → salt + water')),
    P(L('Siguranță', 'Safety'), L('nu gusta și nu mirosi direct substanțele; experimentele doar în laborator, cu profesorul', 'never taste or directly smell chemicals; experiments only in the lab with a teacher'))
  ]},

  // ───── Biologie
  { id: 'b-5', s: 'bio', g: [5], t: L('Clasa a V-a: lumea vie', 'Grade 5: the living world'), i: [
    P(L('Regnuri', 'Kingdoms'), L('bacterii, protiste, ciuperci, plante, animale', 'bacteria, protists, fungi, plants, animals')),
    P(L('Celula', 'The cell'), L('unitatea de bază a viețuitoarelor: membrană, citoplasmă, nucleu', 'basic unit of life: membrane, cytoplasm, nucleus')),
    P(L('Ecosistem', 'Ecosystem'), L('biotop (mediul) + biocenoză (viețuitoarele)', 'biotope (environment) + biocenosis (living things)')),
    P(L('Lanț trofic', 'Food chain'), L('producători → consumatori → descompunători', 'producers → consumers → decomposers'))
  ]},
  { id: 'b-6', s: 'bio', g: [6], t: L('Clasa a VI-a: plantele și animalele', 'Grade 6: plants and animals'), i: [
    P(L('Organele plantei', 'Plant organs'), L('rădăcină, tulpină, frunză (vegetative); floare, fruct, sămânță (de reproducere)', 'root, stem, leaf (vegetative); flower, fruit, seed (reproductive)')),
    P(L('Fotosinteza', 'Photosynthesis'), L('dioxid de carbon + apă —(lumină, clorofilă)→ substanțe organice + oxigen', 'carbon dioxide + water —(light, chlorophyll)→ organic substances + oxygen')),
    P(L('Respirația', 'Respiration'), L('substanțe organice + oxigen → dioxid de carbon + apă + energie', 'organic substances + oxygen → carbon dioxide + water + energy')),
    P(L('Vertebrate', 'Vertebrates'), L('pești, amfibieni, reptile, păsări, mamifere', 'fish, amphibians, reptiles, birds, mammals'))
  ]},
  { id: 'b-7', s: 'bio', g: [7], t: L('Clasa a VII-a: corpul uman', 'Grade 7: the human body'), i: [
    P(L('Sistemul digestiv', 'Digestive system'), L('cavitate bucală → faringe → esofag → stomac → intestin subțire → intestin gros', 'mouth → pharynx → oesophagus → stomach → small intestine → large intestine')),
    P(L('Sistemul circulator', 'Circulatory system'), L('inimă (4 camere), artere, vene, capilare; mica și marea circulație', 'heart (4 chambers), arteries, veins, capillaries; pulmonary and systemic circulation')),
    P(L('Sistemul respirator', 'Respiratory system'), L('căi respiratorii + plămâni; schimbul de gaze în alveole', 'airways + lungs; gas exchange in the alveoli')),
    P(L('Sistemul nervos', 'Nervous system'), L('central (encefal, măduva spinării) și periferic; unitatea: neuronul', 'central (brain, spinal cord) and peripheral; unit: the neuron')),
    P(L('Analizatorii', 'Sensory systems'), L('vizual, auditiv, olfactiv, gustativ, cutanat', 'visual, auditory, olfactory, gustatory, cutaneous'))
  ]},
  { id: 'b-8', s: 'bio', g: [8], t: L('Clasa a VIII-a: ereditate, evoluție, mediu', 'Grade 8: heredity, evolution, environment'), i: [
    P(L('ADN și gene', 'DNA and genes'), L('informația ereditară se află în ADN, organizat în cromozomi', 'hereditary information is in DNA, organised in chromosomes')),
    P(L('Omul', 'Humans'), L('46 de cromozomi (23 de perechi) în celulele corpului', '46 chromosomes (23 pairs) in body cells')),
    P(L('Dominant / recesiv', 'Dominant / recessive'), L('caracterul dominant se manifestă și într-o singură copie', 'a dominant trait shows even with one copy')),
    P(L('Evoluția', 'Evolution'), L('schimbarea speciilor în timp prin selecție naturală', 'change of species over time through natural selection')),
    P(L('Protecția mediului', 'Environmental protection'), L('reducere, reutilizare, reciclare; arii protejate', 'reduce, reuse, recycle; protected areas'))
  ]},

  // ───── Geografie
  { id: 'g-ro', s: 'geo', g: [8], t: L('România: date esențiale', 'Romania: key facts'), i: [
    P(L('Suprafața', 'Area'), L('238 397 km²', '238,397 km²')),
    P(L('Vecini', 'Neighbours'), L('Ucraina, Republica Moldova, Bulgaria, Serbia, Ungaria; ieșire la Marea Neagră', 'Ukraine, Republic of Moldova, Bulgaria, Serbia, Hungary; coast on the Black Sea')),
    P(L('Carpații', 'The Carpathians'), L('Orientali, Meridionali, Occidentali; cel mai înalt vârf: Moldoveanu (2544 m), în Munții Făgăraș', 'Eastern, Southern, Western; highest peak: Moldoveanu (2,544 m), Făgăraș Mountains')),
    P(L('Treptele de relief', 'Relief levels'), L('munți, dealuri și podișuri, câmpii (aproximativ câte o treime)', 'mountains, hills and plateaus, plains (roughly a third each)')),
    P(L('Dunărea', 'The Danube'), L('1075 km pe teritoriul sau la granița României; se varsă prin Delta Dunării în Marea Neagră', '1,075 km in or along Romania; flows through the Danube Delta into the Black Sea')),
    P(L('Clima', 'Climate'), L('temperat-continentală, cu influențe oceanice (vest), de ariditate (est) și submediteraneene (sud-vest)', 'temperate continental, with oceanic (west), dry (east) and sub-Mediterranean (south-west) influences'))
  ]},
  { id: 'g-lume', s: 'geo', g: [5, 6, 7], t: L('Planeta și continentele', 'The planet and the continents'), i: [
    P(L('Continentele (7)', 'Continents (7)'), L('Asia, Africa, America de Nord, America de Sud, Antarctica, Europa, Australia (Oceania)', 'Asia, Africa, North America, South America, Antarctica, Europe, Australia (Oceania)')),
    P(L('Oceanele', 'Oceans'), L('Pacific (cel mai mare), Atlantic, Indian, Arctic, Austral', 'Pacific (largest), Atlantic, Indian, Arctic, Southern')),
    P(L('Cel mai înalt vârf', 'Highest peak'), L('Everest, circa 8849 m (Himalaya)', 'Everest, about 8,849 m (Himalayas)')),
    P(L('Paralele și meridiane', 'Parallels and meridians'), L('Ecuatorul (0° latitudine); meridianul Greenwich (0° longitudine)', 'Equator (0° latitude); Greenwich meridian (0° longitude)')),
    P(L('Mișcările Pământului', 'Earth’s motions'), L('rotație (24 h, zi și noapte); revoluție (≈365 zile, anotimpurile)', 'rotation (24 h, day and night); revolution (≈365 days, seasons)'))
  ]},

  // ───── Limba engleză
  { id: 'e-tense', s: 'eng', g: [5, 6, 7, 8], t: L('Timpurile verbale de bază', 'Basic tenses'), i: [
    P(L('Present Simple', 'Present Simple'), L('obiceiuri, adevăruri: She plays tennis every day.', 'habits, facts: She plays tennis every day.')),
    P(L('Present Continuous', 'Present Continuous'), L('acțiune în desfășurare acum: I am reading.', 'happening now: I am reading.')),
    P(L('Past Simple', 'Past Simple'), L('acțiune încheiată în trecut: We visited Iași last year.', 'finished past action: We visited Iași last year.')),
    P(L('Present Perfect', 'Present Perfect'), L('trecut legat de prezent: I have already finished.', 'past linked to now: I have already finished.')),
    P(L('Future', 'Future'), L('will (decizie, predicție) / be going to (plan): I’m going to study.', 'will (decision, prediction) / be going to (plan): I’m going to study.'))
  ]},
  { id: 'e-irr', s: 'eng', g: [5, 6, 7, 8], t: L('Verbe neregulate frecvente', 'Common irregular verbs'), i: [
    P(L('be', 'be'), L('was/were – been', 'was/were – been')),
    P(L('go', 'go'), L('went – gone', 'went – gone')),
    P(L('have', 'have'), L('had – had', 'had – had')),
    P(L('do', 'do'), L('did – done', 'did – done')),
    P(L('see', 'see'), L('saw – seen', 'saw – seen')),
    P(L('write', 'write'), L('wrote – written', 'wrote – written')),
    P(L('take', 'take'), L('took – taken', 'took – taken')),
    P(L('buy', 'buy'), L('bought – bought', 'bought – bought')),
    P(L('think', 'think'), L('thought – thought', 'thought – thought')),
    P(L('begin', 'begin'), L('began – begun', 'began – begun'))
  ]}
];

/* ───────────────────── REPERE CRONOLOGICE ───────────────────── */
const TIMELINE = [
  { y: '776 î.Hr.', g: 5, e: L('Primele Jocuri Olimpice atestate (Grecia antică)', 'First recorded Olympic Games (ancient Greece)') },
  { y: '753 î.Hr.', g: 5, e: L('Fondarea Romei, după tradiție', 'Founding of Rome, according to tradition') },
  { y: '82–44 î.Hr.', g: 5, e: L('Domnia lui Burebista, statul dac unificat', 'Reign of Burebista, the unified Dacian state') },
  { y: '101–102, 105–106', g: 5, e: L('Războaiele daco-romane (Decebal – Traian)', 'Dacian Wars (Decebalus – Trajan)') },
  { y: '106', g: 5, e: L('Dacia devine provincie romană', 'Dacia becomes a Roman province') },
  { y: '271–275', g: 5, e: L('Retragerea aureliană din Dacia', 'Aurelian withdrawal from Dacia') },
  { y: '476', g: 5, e: L('Căderea Imperiului Roman de Apus', 'Fall of the Western Roman Empire') },
  { y: '1054', g: 6, e: L('Marea Schismă dintre Biserica de Răsărit și cea de Apus', 'The Great Schism between the Eastern and Western Churches') },
  { y: '1330', g: 6, e: L('Bătălia de la Posada (Basarab I)', 'Battle of Posada (Basarab I)') },
  { y: '1453', g: 6, e: L('Cucerirea Constantinopolului de către otomani', 'Fall of Constantinople to the Ottomans') },
  { y: '1457–1504', g: 6, e: L('Domnia lui Ștefan cel Mare în Moldova', 'Reign of Stephen the Great in Moldavia') },
  { y: '1475', g: 6, e: L('Bătălia de la Vaslui', 'Battle of Vaslui') },
  { y: '1492', g: 6, e: L('Cristofor Columb ajunge în America', 'Christopher Columbus reaches the Americas') },
  { y: '1600', g: 6, e: L('Mihai Viteazul unește cele trei țări române', 'Michael the Brave unites the three Romanian principalities') },
  { y: '1789', g: 7, e: L('Revoluția Franceză', 'The French Revolution') },
  { y: '1821', g: 7, e: L('Mișcarea condusă de Tudor Vladimirescu', 'Uprising led by Tudor Vladimirescu') },
  { y: '1848', g: 7, e: L('Revoluțiile de la 1848 în Europa și în țările române', 'The 1848 revolutions in Europe and the Romanian lands') },
  { y: '1859', g: 7, e: L('Unirea Principatelor (24 ianuarie), domnitor Alexandru Ioan Cuza', 'Union of the Principalities (24 January), ruler Alexandru Ioan Cuza') },
  { y: '1866', g: 7, e: L('Carol I devine domnitor; prima constituție internă', 'Carol I becomes ruler; first domestic constitution') },
  { y: '1877', g: 7, e: L('Proclamarea independenței (9 mai)', 'Declaration of independence (9 May)') },
  { y: '1881', g: 7, e: L('Proclamarea Regatului României', 'Proclamation of the Kingdom of Romania') },
  { y: '1914–1918', g: 8, e: L('Primul Război Mondial', 'World War I') },
  { y: '1918', g: 8, e: L('Marea Unire (1 decembrie, Alba Iulia)', 'The Great Union (1 December, Alba Iulia)') },
  { y: '1923', g: 8, e: L('Constituția României Mari', 'Constitution of Greater Romania') },
  { y: '1939–1945', g: 8, e: L('Al Doilea Război Mondial', 'World War II') },
  { y: '1947', g: 8, e: L('Abdicarea regelui Mihai I; proclamarea republicii (30 decembrie)', 'King Michael I abdicates; republic proclaimed (30 December)') },
  { y: '1989', g: 8, e: L('Revoluția din decembrie, căderea regimului comunist', 'December Revolution, fall of the communist regime') },
  { y: '2004', g: 8, e: L('România intră în NATO', 'Romania joins NATO') },
  { y: '2007', g: 8, e: L('România intră în Uniunea Europeană', 'Romania joins the European Union') }
];

/* ─────────────────────────── GLOSAR ─────────────────────────── */
const GLOSSARY = [
  { s: 'mat', t: L('Ipotenuza', 'Hypotenuse'), d: L('Latura opusă unghiului drept, cea mai lungă din triunghiul dreptunghic.', 'The side opposite the right angle, the longest in a right triangle.') },
  { s: 'mat', t: L('Catetă', 'Leg'), d: L('Fiecare dintre laturile care formează unghiul drept.', 'Each of the two sides forming the right angle.') },
  { s: 'mat', t: L('Apotemă', 'Apothem / slant height'), d: L('La piramida regulată: înălțimea unei fețe laterale, dusă din vârf.', 'In a regular pyramid: the height of a lateral face from the apex.') },
  { s: 'mat', t: L('Generatoare', 'Slant height (cone/cylinder)'), d: L('Segmentul G care „generează” suprafața laterală a conului sau cilindrului.', 'The segment G that “sweeps” the lateral surface of a cone or cylinder.') },
  { s: 'mat', t: L('Număr prim', 'Prime number'), d: L('Număr natural mai mare decât 1 care are doar doi divizori: 1 și el însuși.', 'A natural number greater than 1 with exactly two divisors: 1 and itself.') },
  { s: 'mat', t: L('Cel mai mare divizor comun', 'Greatest common divisor'), d: L('Cel mai mare număr care divide toate numerele date.', 'The largest number dividing all the given numbers.') },
  { s: 'mat', t: L('Cel mai mic multiplu comun', 'Least common multiple'), d: L('Cel mai mic număr nenul divizibil cu toate numerele date.', 'The smallest non-zero number divisible by all the given numbers.') },
  { s: 'mat', t: L('Număr irațional', 'Irrational number'), d: L('Număr real care nu se poate scrie ca fracție de numere întregi (√2, π).', 'A real number that cannot be written as a fraction of integers (√2, π).') },
  { s: 'mat', t: L('Funcție', 'Function'), d: L('Regulă care asociază fiecărui element din domeniu exact un element din codomeniu.', 'A rule assigning each element of the domain exactly one element of the codomain.') },
  { s: 'mat', t: L('Proiecție ortogonală', 'Orthogonal projection'), d: L('Piciorul perpendicularei duse dintr-un punct pe o dreaptă sau un plan.', 'The foot of the perpendicular from a point onto a line or plane.') },
  { s: 'rom', t: L('Narator', 'Narrator'), d: L('Vocea care relatează întâmplările; poate fi personaj sau nu.', 'The voice telling the events; may or may not be a character.') },
  { s: 'rom', t: L('Expozițiune', 'Exposition'), d: L('Primul moment al subiectului: timpul, locul, personajele.', 'First plot stage: time, place, characters.') },
  { s: 'rom', t: L('Deznodământ', 'Resolution'), d: L('Momentul final al subiectului, în care se rezolvă conflictul.', 'The final plot stage, where the conflict is resolved.') },
  { s: 'rom', t: L('Eu liric', 'Lyrical self'), d: L('Vocea care își exprimă sentimentele într-o poezie lirică.', 'The voice expressing feelings in a lyric poem.') },
  { s: 'rom', t: L('Sinonime', 'Synonyms'), d: L('Cuvinte cu formă diferită și sens asemănător (frumos – minunat).', 'Different words with similar meaning (frumos – minunat).') },
  { s: 'rom', t: L('Antonime', 'Antonyms'), d: L('Cuvinte cu sens opus (cald – rece).', 'Words with opposite meanings (cald – rece).') },
  { s: 'rom', t: L('Omonime', 'Homonyms'), d: L('Cuvinte cu aceeași formă și sens diferit (broască – animal / broască – încuietoare).', 'Same form, different meaning (broască – frog / lock).') },
  { s: 'rom', t: L('Paronime', 'Paronyms'), d: L('Cuvinte cu formă asemănătoare și sens diferit (original – originar).', 'Similar form, different meaning (original – originar).') },
  { s: 'rom', t: L('Neologism', 'Neologism'), d: L('Cuvânt nou, împrumutat recent dintr-o limbă străină.', 'A new word, recently borrowed from another language.') },
  { s: 'fiz', t: L('Mărime fizică', 'Physical quantity'), d: L('Proprietate care se poate măsura și se exprimă prin număr și unitate.', 'A measurable property expressed by a number and a unit.') },
  { s: 'fiz', t: L('Inerția', 'Inertia'), d: L('Tendința unui corp de a-și păstra starea de repaus sau de mișcare.', 'A body’s tendency to keep its state of rest or motion.') },
  { s: 'fiz', t: L('Randament', 'Efficiency'), d: L('Cât din energia consumată devine energie utilă, în procente.', 'How much of the energy used becomes useful energy, as a percentage.') },
  { s: 'fiz', t: L('Conductor electric', 'Electrical conductor'), d: L('Material prin care curentul electric trece ușor (metale).', 'A material through which current flows easily (metals).') },
  { s: 'chi', t: L('Atom', 'Atom'), d: L('Cea mai mică particulă a unui element chimic care păstrează proprietățile lui.', 'The smallest particle of an element that keeps its properties.') },
  { s: 'chi', t: L('Moleculă', 'Molecule'), d: L('Grup de atomi legați chimic (H₂O, O₂).', 'A group of chemically bonded atoms (H₂O, O₂).') },
  { s: 'chi', t: L('Mol', 'Mole'), d: L('Cantitatea de substanță care conține 6,022 · 10²³ particule.', 'The amount of substance containing 6.022 × 10²³ particles.') },
  { s: 'chi', t: L('Soluție', 'Solution'), d: L('Amestec omogen dintre un dizolvat și un solvent (de obicei apă).', 'A homogeneous mixture of a solute and a solvent (usually water).') },
  { s: 'chi', t: L('pH', 'pH'), d: L('Scară de la 0 la 14: sub 7 acid, 7 neutru, peste 7 bazic.', 'A 0–14 scale: below 7 acidic, 7 neutral, above 7 basic.') },
  { s: 'bio', t: L('Fotosinteză', 'Photosynthesis'), d: L('Procesul prin care plantele verzi produc substanțe organice folosind lumina.', 'The process by which green plants make organic substances using light.') },
  { s: 'bio', t: L('Organ', 'Organ'), d: L('Structură formată din țesuturi care îndeplinește o funcție (inima, frunza).', 'A structure made of tissues with a specific function (heart, leaf).') },
  { s: 'bio', t: L('Biodiversitate', 'Biodiversity'), d: L('Varietatea formelor de viață dintr-un loc sau de pe Pământ.', 'The variety of life in a place or on Earth.') },
  { s: 'ist', t: L('Sursă istorică', 'Historical source'), d: L('Orice urmă a trecutului: document scris, obiect, construcție, mărturie.', 'Any trace of the past: written document, object, building, testimony.') },
  { s: 'ist', t: L('Constituție', 'Constitution'), d: L('Legea fundamentală a unui stat.', 'The fundamental law of a state.') },
  { s: 'ist', t: L('Domnitor', 'Ruler (voivode)'), d: L('Conducătorul unei țări române în Evul Mediu și în epoca modernă timpurie.', 'Head of a Romanian principality in the Middle Ages and early modern era.') },
  { s: 'geo', t: L('Relief', 'Landforms'), d: L('Totalitatea formelor de suprafață ale scoarței terestre.', 'All the shapes of the Earth’s surface.') },
  { s: 'geo', t: L('Fluviu', 'Major river'), d: L('Râu mare care se varsă direct într-o mare sau ocean.', 'A large river flowing directly into a sea or ocean.') },
  { s: 'geo', t: L('Altitudine', 'Altitude'), d: L('Înălțimea unui punct față de nivelul mării.', 'Height of a point above sea level.') },
  { s: 'eng', t: L('Irregular verb', 'Irregular verb'), d: L('Verb care nu formează trecutul cu -ed (go – went – gone).', 'A verb that doesn’t form the past with -ed (go – went – gone).') },
  { s: 'eng', t: L('Auxiliary verb', 'Auxiliary verb'), d: L('Verb ajutător pentru timpuri, întrebări, negații (do, be, have).', 'A helping verb for tenses, questions, negatives (do, be, have).') }
];

/* ──────────────────────────── QUIZ ──────────────────────────── */
// a = indexul răspunsului corect
const Q = (s, g, q, o, a, x) => ({ s, g, q, o, a, x });
const QUIZ = [
  // Matematică
  Q('mat', 5, L('Cât este 2³ · 2²?', 'What is 2³ · 2²?'), [L('2⁵ = 32'), L('2⁶ = 64'), L('4⁵'), L('10')], 0, L('Bazele sunt egale, deci exponenții se adună: 3 + 2 = 5.', 'Same base, so add the exponents: 3 + 2 = 5.')),
  Q('mat', 5, L('Restul împărțirii lui 47 la 6 este:', 'The remainder of 47 divided by 6 is:'), [L('5'), L('7'), L('1'), L('3')], 0, L('47 = 6 · 7 + 5, iar 5 < 6.', '47 = 6 · 7 + 5, and 5 < 6.')),
  Q('mat', 5, L('Media aritmetică a numerelor 4, 7 și 13 este:', 'The mean of 4, 7 and 13 is:'), [L('8'), L('7'), L('24'), L('12')], 0, L('(4 + 7 + 13) : 3 = 24 : 3 = 8.', '(4 + 7 + 13) ÷ 3 = 24 ÷ 3 = 8.')),
  Q('mat', 5, L('Un dreptunghi are L = 8 cm și l = 5 cm. Perimetrul este:', 'A rectangle has L = 8 cm and l = 5 cm. Its perimeter is:'), [L('26 cm'), L('40 cm'), L('13 cm'), L('80 cm')], 0, L('P = 2 · (8 + 5) = 26 cm. 40 cm² ar fi aria.', 'P = 2 · (8 + 5) = 26 cm. 40 cm² would be the area.')),
  Q('mat', 5, L('Care număr se divide cu 9?', 'Which number is divisible by 9?'), [L('3 456'), L('2 345'), L('1 001'), L('5 555')], 0, L('3 + 4 + 5 + 6 = 18, iar 18 se divide cu 9.', '3 + 4 + 5 + 6 = 18, which is divisible by 9.')),
  Q('mat', 5, L('Fracția 3/4 : 1/2 este egală cu:', '3/4 ÷ 1/2 equals:'), [L('3/2'), L('3/8'), L('2/3'), L('1/4')], 0, L('Înmulțești cu inversa: 3/4 · 2/1 = 6/4 = 3/2.', 'Multiply by the reciprocal: 3/4 · 2/1 = 6/4 = 3/2.')),
  Q('mat', 6, L('25% din 80 este:', '25% of 80 is:'), [L('20'), L('25'), L('32'), L('4')], 0, L('25/100 · 80 = 20.', '25/100 · 80 = 20.')),
  Q('mat', 6, L('Dacă x/6 = 4/12, atunci x este:', 'If x/6 = 4/12, then x is:'), [L('2'), L('3'), L('8'), L('24')], 0, L('x · 12 = 6 · 4 = 24, deci x = 2.', 'x · 12 = 6 · 4 = 24, so x = 2.')),
  Q('mat', 6, L('Un triunghi are unghiurile de 50° și 60°. Al treilea unghi are:', 'A triangle has angles of 50° and 60°. The third angle is:'), [L('70°'), L('90°'), L('110°'), L('60°')], 0, L('180° − 50° − 60° = 70°.', '180° − 50° − 60° = 70°.')),
  Q('mat', 6, L('Probabilitatea de a obține un număr par la aruncarea unui zar este:', 'The probability of rolling an even number on a die is:'), [L('1/2'), L('1/3'), L('1/6'), L('2/3')], 0, L('Cazuri favorabile: 2, 4, 6 (3 din 6) → 3/6 = 1/2.', 'Favourable: 2, 4, 6 (3 of 6) → 3/6 = 1/2.')),
  Q('mat', 6, L('Suplementul unui unghi de 35° are:', 'The supplement of a 35° angle is:'), [L('145°'), L('55°'), L('325°'), L('65°')], 0, L('180° − 35° = 145°. 55° ar fi complementul.', '180° − 35° = 145°. 55° would be the complement.')),
  Q('mat', 7, L('Catetele unui triunghi dreptunghic au 6 cm și 8 cm. Ipotenuza are:', 'A right triangle has legs of 6 cm and 8 cm. The hypotenuse is:'), [L('10 cm'), L('14 cm'), L('12 cm'), L('√14 cm')], 0, L('a² = 36 + 64 = 100, deci a = 10 cm.', 'a² = 36 + 64 = 100, so a = 10 cm.')),
  Q('mat', 7, L('(x + 3)² este egal cu:', '(x + 3)² equals:'), [L('x² + 6x + 9'), L('x² + 9'), L('x² + 3x + 9'), L('2x + 6')], 0, L('(a + b)² = a² + 2ab + b², cu 2ab = 2 · x · 3 = 6x.', '(a + b)² = a² + 2ab + b², with 2ab = 6x.')),
  Q('mat', 7, L('√50 se mai poate scrie:', '√50 can be written as:'), [L('5√2'), L('25√2'), L('2√5'), L('10√5')], 0, L('√50 = √(25 · 2) = 5√2.', '√50 = √(25 · 2) = 5√2.')),
  Q('mat', 7, L('Soluția ecuației 3x − 12 = 0 este:', 'The solution of 3x − 12 = 0 is:'), [L('x = 4'), L('x = −4'), L('x = 9'), L('x = 36')], 0, L('3x = 12, deci x = 4.', '3x = 12, so x = 4.')),
  Q('mat', 7, L('sin 30° este egal cu:', 'sin 30° equals:'), [L('1/2'), L('√3/2'), L('√2/2'), L('1')], 0, L('Cateta opusă unghiului de 30° este jumătate din ipotenuză.', 'The leg opposite 30° is half the hypotenuse.')),
  Q('mat', 7, L('Aria unui cerc cu raza 3 cm este:', 'The area of a circle with radius 3 cm is:'), [L('9π cm²'), L('6π cm²'), L('3π cm²'), L('18π cm²')], 0, L('A = πR² = 9π cm². 6π cm este lungimea cercului.', 'A = πR² = 9π cm². 6π cm is the circumference.')),
  Q('mat', 7, L('Un trapez are bazele 10 cm și 6 cm. Linia mijlocie are:', 'A trapezoid has bases 10 cm and 6 cm. Its midsegment is:'), [L('8 cm'), L('16 cm'), L('4 cm'), L('2 cm')], 0, L('(10 + 6) : 2 = 8 cm.', '(10 + 6) ÷ 2 = 8 cm.')),
  Q('mat', 7, L('Media geometrică a numerelor 4 și 9 este:', 'The geometric mean of 4 and 9 is:'), [L('6'), L('6,5'), L('36'), L('13')], 0, L('√(4 · 9) = √36 = 6.', '√(4 · 9) = √36 = 6.')),
  Q('mat', 7, L('Diagonala unui pătrat cu latura 5 cm are:', 'The diagonal of a square with side 5 cm is:'), [L('5√2 cm'), L('10 cm'), L('25 cm'), L('5√3 cm')], 0, L('d = l√2 = 5√2 cm.', 'd = l√2 = 5√2 cm.')),
  Q('mat', 8, L('Graficul funcției f(x) = 2x − 4 intersectează axa Ox în punctul:', 'The graph of f(x) = 2x − 4 meets the x-axis at:'), [L('(2, 0)'), L('(0, −4)'), L('(−2, 0)'), L('(4, 0)')], 0, L('f(x) = 0 ⇒ 2x = 4 ⇒ x = 2.', 'f(x) = 0 ⇒ 2x = 4 ⇒ x = 2.')),
  Q('mat', 8, L('Volumul unui cub cu latura 3 cm este:', 'The volume of a cube with side 3 cm is:'), [L('27 cm³'), L('9 cm³'), L('54 cm³'), L('18 cm³')], 0, L('V = l³ = 27 cm³. 54 cm² este aria totală.', 'V = l³ = 27 cm³. 54 cm² is the total surface area.')),
  Q('mat', 8, L('Diagonala unui cub cu latura 4 cm este:', 'The space diagonal of a cube with side 4 cm is:'), [L('4√3 cm'), L('4√2 cm'), L('12 cm'), L('16 cm')], 0, L('d = l√3 = 4√3 cm.', 'd = l√3 = 4√3 cm.')),
  Q('mat', 8, L('Un cilindru are R = 2 cm și G = 5 cm. Volumul este:', 'A cylinder has R = 2 cm and G = 5 cm. Its volume is:'), [L('20π cm³'), L('10π cm³'), L('40π cm³'), L('14π cm³')], 0, L('V = πR²G = π · 4 · 5 = 20π cm³.', 'V = πR²G = π · 4 · 5 = 20π cm³.')),
  Q('mat', 8, L('Un con are R = 3 cm și h = 4 cm. Generatoarea are:', 'A cone has R = 3 cm and h = 4 cm. Its slant height is:'), [L('5 cm'), L('7 cm'), L('√7 cm'), L('25 cm')], 0, L('G² = h² + R² = 16 + 9 = 25, deci G = 5 cm.', 'G² = 16 + 9 = 25, so G = 5 cm.')),
  Q('mat', 8, L('Distanța dintre A(1, 2) și B(4, 6) este:', 'The distance between A(1, 2) and B(4, 6) is:'), [L('5'), L('7'), L('25'), L('√7')], 0, L('√(3² + 4²) = √25 = 5.', '√(3² + 4²) = √25 = 5.')),
  Q('mat', 8, L('Ecuația x² − 5x + 6 = 0 are soluțiile:', 'The equation x² − 5x + 6 = 0 has the solutions:'), [L('2 și 3'), L('−2 și −3'), L('1 și 6'), L('nu are soluții reale')], 0, L('Δ = 25 − 24 = 1; x = (5 ± 1) / 2 ⇒ 3 și 2.', 'Δ = 25 − 24 = 1; x = (5 ± 1) / 2 ⇒ 3 and 2.')),
  Q('mat', 8, L('Volumul unei piramide cu aria bazei 36 cm² și înălțimea 5 cm este:', 'A pyramid with base area 36 cm² and height 5 cm has volume:'), [L('60 cm³'), L('180 cm³'), L('90 cm³'), L('41 cm³')], 0, L('V = A_b · h / 3 = 36 · 5 / 3 = 60 cm³.', 'V = base · h / 3 = 36 · 5 / 3 = 60 cm³.')),

  // Română
  Q('rom', 5, L('În „codrul verde”, cuvântul „verde” este:', 'In „codrul verde”, „verde” is:'), [L('epitet'), L('metaforă'), L('personificare'), L('comparație')], 0, L('Este un adjectiv care exprimă o însușire a codrului.', 'It is an adjective expressing a quality of the forest.')),
  Q('rom', 5, L('Care este forma corectă?', 'Which form is correct?'), [L('Ea s-a dus la școală.'), L('Ea sa dus la școală.'), L('Ea s-au dus la școală.'), L('Ea sau dus la școală.')], 0, L('s-a = pronume reflexiv + verb auxiliar.', 's-a = reflexive pronoun + auxiliary verb.')),
  Q('rom', 5, L('„Vântul plânge printre ramuri.” conține:', '„Vântul plânge printre ramuri.” contains:'), [L('o personificare'), L('o comparație'), L('o enumerație'), L('o hiperbolă')], 0, L('„A plânge” este o acțiune omenească atribuită vântului.', 'Crying is a human action given to the wind.')),
  Q('rom', 5, L('Prima etapă a momentelor subiectului este:', 'The first plot stage is:'), [L('expozițiunea'), L('intriga'), L('punctul culminant'), L('deznodământul')], 0, L('Expozițiunea prezintă timpul, locul și personajele.', 'The exposition introduces time, place and characters.')),
  Q('rom', 6, L('În „Ion citește o carte.”, „o carte” este:', 'In „Ion citește o carte.”, „o carte” is:'), [L('complement direct'), L('subiect'), L('atribut'), L('complement indirect')], 0, L('Răspunde la întrebarea „ce?” pusă verbului „citește”.', 'It answers “what?” about the verb „citește”.')),
  Q('rom', 6, L('„Cerul este senin.” are predicat:', '„Cerul este senin.” has a predicate that is:'), [L('nominal'), L('verbal'), L('nu are predicat'), L('dublu')], 0, L('„este” (copulativ) + „senin” (nume predicativ).', '„este” (linking verb) + „senin” (predicate adjective).')),
  Q('rom', 6, L('Care este sinonimul cuvântului „a hoinări”?', 'Which is a synonym of „a hoinări”?'), [L('a umbla fără țintă'), L('a se grăbi'), L('a dormi'), L('a se opri')], 0, L('„A hoinări” înseamnă a umbla fără un scop precis.', '„A hoinări” means to wander aimlessly.')),
  Q('rom', 6, L('Fabula este o specie a genului:', 'The fable belongs to the:'), [L('epic'), L('liric'), L('dramatic'), L('științific')], 0, L('Are acțiune, personaje (de obicei animale) și o morală.', 'It has a plot, characters (often animals) and a moral.')),
  Q('rom', 7, L('Câte propoziții are fraza „Am aflat că vii mâine și m-am bucurat.”?', 'How many clauses are in „Am aflat că vii mâine și m-am bucurat.”?'), [L('3'), L('2'), L('4'), L('1')], 0, L('Predicate: „am aflat”, „vii”, „m-am bucurat” → 3 propoziții.', 'Predicates: „am aflat”, „vii”, „m-am bucurat” → 3 clauses.')),
  Q('rom', 7, L('Conjuncția „dar” leagă propoziții prin coordonare:', 'The conjunction „dar” links clauses by:'), [L('adversativă'), L('copulativă'), L('disjunctivă'), L('conclusivă')], 0, L('„Dar” exprimă o opoziție.', '„Dar” expresses contrast.')),
  Q('rom', 7, L('În rezumat NU folosim:', 'In a summary we do NOT use:'), [L('dialogul și citatele'), L('persoana a III-a'), L('ideile principale'), L('ordinea întâmplărilor')], 0, L('Rezumatul redă ideile esențiale în propriile cuvinte, fără dialog.', 'A summary gives the key ideas in your own words, without dialogue.')),
  Q('rom', 8, L('„Alb ca neaua” este:', '„Alb ca neaua” is:'), [L('o comparație'), L('o metaforă'), L('un epitet'), L('o antiteză')], 0, L('Elementul de legătură „ca” indică o comparație.', 'The linking word „ca” marks a simile.')),
  Q('rom', 8, L('Într-un text argumentativ, ipoteza este:', 'In an argumentative text, the thesis is:'), [L('opinia pe care o susții'), L('concluzia finală'), L('un exemplu'), L('un citat obligatoriu')], 0, L('Ipoteza formulează punctul de vedere, susținut apoi prin argumente.', 'The thesis states your view, then supported by arguments.')),
  Q('rom', 8, L('Care cuvânt este scris corect?', 'Which word is spelled correctly?'), [L('într-o'), L('întro'), L('în-tr-o'), L('într o')], 0, L('„Într-o” se scrie cu cratimă.', '„Într-o” is written with a hyphen.')),
  Q('rom', 8, L('Caracterizarea indirectă reiese din:', 'Indirect characterisation comes from:'), [L('fapte, limbaj, gesturi, relații'), L('afirmațiile directe ale naratorului'), L('titlul operei'), L('numele autorului')], 0, L('Cititorul deduce trăsăturile din comportamentul personajului.', 'The reader infers traits from how the character behaves.')),

  // Fizică
  Q('fiz', 6, L('Un biciclist parcurge 30 km în 2 h. Viteza medie este:', 'A cyclist travels 30 km in 2 h. The average speed is:'), [L('15 km/h'), L('60 km/h'), L('32 km/h'), L('28 km/h')], 0, L('v = d / t = 30 / 2 = 15 km/h.', 'v = d / t = 30 / 2 = 15 km/h.')),
  Q('fiz', 6, L('72 km/h înseamnă:', '72 km/h equals:'), [L('20 m/s'), L('72 m/s'), L('259,2 m/s'), L('7,2 m/s')], 0, L('72 : 3,6 = 20 m/s.', '72 ÷ 3.6 = 20 m/s.')),
  Q('fiz', 6, L('Unitatea de măsură pentru densitate în SI este:', 'The SI unit for density is:'), [L('kg/m³'), L('g'), L('N'), L('m³/kg')], 0, L('ρ = m / V → kg / m³.', 'ρ = m / V → kg / m³.')),
  Q('fiz', 7, L('Greutatea unui corp cu masa 5 kg (g = 10 N/kg) este:', 'The weight of a 5 kg body (g = 10 N/kg) is:'), [L('50 N'), L('5 N'), L('0,5 N'), L('15 N')], 0, L('G = m · g = 5 · 10 = 50 N.', 'G = m · g = 5 · 10 = 50 N.')),
  Q('fiz', 7, L('Lucrul mecanic efectuat de o forță de 20 N pe 3 m (pe direcția deplasării) este:', 'The work of a 20 N force over 3 m (along the motion) is:'), [L('60 J'), L('23 J'), L('6,67 J'), L('60 W')], 0, L('L = F · d = 60 J (joule, nu watt).', 'W = F · d = 60 J (joules, not watts).')),
  Q('fiz', 7, L('Energia cinetică a unui corp de 2 kg cu viteza 3 m/s este:', 'Kinetic energy of a 2 kg body at 3 m/s is:'), [L('9 J'), L('6 J'), L('18 J'), L('3 J')], 0, L('E_c = m · v² / 2 = 2 · 9 / 2 = 9 J.', 'E_k = m · v² / 2 = 2 · 9 / 2 = 9 J.')),
  Q('fiz', 7, L('Puterea se măsoară în:', 'Power is measured in:'), [L('W (watt)'), L('J (joule)'), L('N (newton)'), L('Pa (pascal)')], 0, L('P = L / t → J/s = W.', 'P = W / t → J/s = W.')),
  Q('fiz', 8, L('Prin un rezistor de 10 Ω trece un curent de 2 A. Tensiunea este:', 'A 2 A current flows through a 10 Ω resistor. The voltage is:'), [L('20 V'), L('5 V'), L('12 V'), L('0,2 V')], 0, L('U = R · I = 10 · 2 = 20 V.', 'U = R · I = 10 · 2 = 20 V.')),
  Q('fiz', 8, L('Două rezistoare de 6 Ω legate în paralel au rezistența echivalentă:', 'Two 6 Ω resistors in parallel have an equivalent resistance of:'), [L('3 Ω'), L('12 Ω'), L('6 Ω'), L('36 Ω')], 0, L('1/R = 1/6 + 1/6 = 1/3 ⇒ R = 3 Ω.', '1/R = 1/6 + 1/6 = 1/3 ⇒ R = 3 Ω.')),
  Q('fiz', 8, L('Ampermetrul se montează în circuit:', 'An ammeter is connected:'), [L('în serie'), L('în paralel'), L('oricum'), L('doar la baterie')], 0, L('Trebuie să fie străbătut de același curent ca elementul măsurat.', 'It must carry the same current as the measured element.')),
  Q('fiz', 8, L('Căldura necesară pentru a încălzi 2 kg de apă cu 10 °C (c = 4180 J/(kg·°C)) este:', 'Heat to warm 2 kg of water by 10 °C (c = 4180 J/(kg·°C)):'), [L('83 600 J'), L('41 800 J'), L('8 360 J'), L('20 900 J')], 0, L('Q = m · c · Δt = 2 · 4180 · 10 = 83 600 J.', 'Q = m · c · Δt = 2 · 4180 · 10 = 83,600 J.')),

  // Chimie
  Q('chi', 7, L('Masa molară a apei (H₂O) este:', 'The molar mass of water (H₂O) is:'), [L('18 g/mol'), L('17 g/mol'), L('16 g/mol'), L('34 g/mol')], 0, L('2 · 1 + 16 = 18 g/mol.', '2 · 1 + 16 = 18 g/mol.')),
  Q('chi', 7, L('Câți moli sunt în 88 g de CO₂ (M = 44 g/mol)?', 'How many moles in 88 g of CO₂ (M = 44 g/mol)?'), [L('2 moli'), L('0,5 moli'), L('44 moli'), L('4 moli')], 0, L('n = m / M = 88 / 44 = 2.', 'n = m / M = 88 / 44 = 2.')),
  Q('chi', 7, L('20 g sare dizolvată în 80 g apă formează o soluție de concentrație:', '20 g salt in 80 g water gives a concentration of:'), [L('20%'), L('25%'), L('80%'), L('16%')], 0, L('m_s = 100 g; c = 20 / 100 · 100 = 20%.', 'm_s = 100 g; c = 20 / 100 · 100 = 20%.')),
  Q('chi', 7, L('O soluție cu pH = 3 este:', 'A solution with pH = 3 is:'), [L('acidă'), L('bazică'), L('neutră'), L('nu se poate ști')], 0, L('pH < 7 înseamnă mediu acid.', 'pH < 7 means acidic.')),
  Q('chi', 8, L('Reacția dintre un acid și o bază se numește:', 'The reaction between an acid and a base is called:'), [L('neutralizare'), L('oxidare'), L('descompunere'), L('fotosinteză')], 0, L('Acid + bază → sare + apă.', 'Acid + base → salt + water.')),
  Q('chi', 8, L('Fenolftaleina, în prezența unei baze, devine:', 'In a base, phenolphthalein turns:'), [L('roșu-carmin'), L('incoloră'), L('albastră'), L('galbenă')], 0, L('În mediu bazic fenolftaleina se colorează în roșu-carmin.', 'In basic solutions it turns pink-red.')),

  // Biologie
  Q('bio', 5, L('Unitatea de bază a viețuitoarelor este:', 'The basic unit of living things is:'), [L('celula'), L('organul'), L('atomul'), L('țesutul')], 0, L('Toate viețuitoarele sunt alcătuite din celule.', 'All living things are made of cells.')),
  Q('bio', 6, L('Fotosinteza are loc în principal în:', 'Photosynthesis mainly happens in the:'), [L('frunze'), L('rădăcini'), L('flori'), L('semințe')], 0, L('Frunzele conțin multă clorofilă.', 'Leaves contain a lot of chlorophyll.')),
  Q('bio', 6, L('Ce gaz eliberează plantele în fotosinteză?', 'Which gas do plants release in photosynthesis?'), [L('oxigen'), L('dioxid de carbon'), L('azot'), L('hidrogen')], 0, L('Fotosinteza produce substanțe organice și oxigen.', 'Photosynthesis produces organic substances and oxygen.')),
  Q('bio', 7, L('Câte camere are inima omului?', 'How many chambers does the human heart have?'), [L('4'), L('2'), L('3'), L('6')], 0, L('Două atrii și două ventricule.', 'Two atria and two ventricles.')),
  Q('bio', 7, L('Schimbul de gaze în plămâni are loc la nivelul:', 'Gas exchange in the lungs happens in the:'), [L('alveolelor'), L('traheei'), L('laringelui'), L('bronhiilor mari')], 0, L('Alveolele sunt înconjurate de capilare.', 'Alveoli are surrounded by capillaries.')),
  Q('bio', 8, L('Câți cromozomi are o celulă a corpului uman?', 'How many chromosomes does a human body cell have?'), [L('46'), L('23'), L('44'), L('48')], 0, L('23 de perechi, adică 46.', '23 pairs, i.e. 46.')),

  // Istorie
  Q('ist', 5, L('Dacia a devenit provincie romană în anul:', 'Dacia became a Roman province in:'), [L('106'), L('271'), L('82 î.Hr.'), L('476')], 0, L('După al doilea război daco-roman (105–106).', 'After the second Dacian War (105–106).')),
  Q('ist', 5, L('Cine a condus statul dac unificat în secolul I î.Hr.?', 'Who led the unified Dacian state in the 1st century BC?'), [L('Burebista'), L('Decebal'), L('Traian'), L('Dromihete')], 0, L('Burebista a domnit aproximativ între 82 și 44 î.Hr.', 'Burebista ruled roughly 82–44 BC.')),
  Q('ist', 6, L('Bătălia de la Posada (1330) este legată de:', 'The Battle of Posada (1330) is linked to:'), [L('Basarab I'), L('Ștefan cel Mare'), L('Mihai Viteazul'), L('Mircea cel Bătrân')], 0, L('Victoria lui Basarab I asupra regelui Ungariei.', 'Basarab I’s victory over the King of Hungary.')),
  Q('ist', 6, L('Unirea din 1600 a fost realizată de:', 'The union of 1600 was achieved by:'), [L('Mihai Viteazul'), L('Alexandru Ioan Cuza'), L('Vlad Țepeș'), L('Carol I')], 0, L('Mihai Viteazul a reunit Țara Românească, Transilvania și Moldova.', 'Michael the Brave united Wallachia, Transylvania and Moldavia.')),
  Q('ist', 7, L('Unirea Principatelor a avut loc în:', 'The Union of the Principalities took place in:'), [L('1859'), L('1918'), L('1877'), L('1848')], 0, L('24 ianuarie 1859, prin dubla alegere a lui Cuza.', '24 January 1859, through Cuza’s double election.')),
  Q('ist', 7, L('Independența României a fost proclamată în:', 'Romania’s independence was proclaimed in:'), [L('1877'), L('1881'), L('1866'), L('1918')], 0, L('9 mai 1877.', '9 May 1877.')),
  Q('ist', 8, L('Marea Unire a fost proclamată la:', 'The Great Union was proclaimed at:'), [L('Alba Iulia, 1 decembrie 1918'), L('Iași, 24 ianuarie 1859'), L('București, 9 mai 1877'), L('Cluj, 1923')], 0, L('Adunarea de la Alba Iulia, 1 decembrie 1918.', 'The Alba Iulia Assembly, 1 December 1918.')),
  Q('ist', 8, L('România a aderat la Uniunea Europeană în:', 'Romania joined the European Union in:'), [L('2007'), L('2004'), L('1989'), L('2010')], 0, L('1 ianuarie 2007. În 2004 a aderat la NATO.', '1 January 2007. It joined NATO in 2004.')),

  // Geografie
  Q('geo', 5, L('Cel mai mare ocean este:', 'The largest ocean is the:'), [L('Pacific'), L('Atlantic'), L('Indian'), L('Arctic')], 0, L('Oceanul Pacific acoperă cea mai mare suprafață.', 'The Pacific covers the largest area.')),
  Q('geo', 5, L('Mișcarea de rotație a Pământului determină:', 'Earth’s rotation causes:'), [L('alternanța zi–noapte'), L('anotimpurile'), L('mareele lunare'), L('cutremurele')], 0, L('Rotația durează circa 24 de ore.', 'One rotation takes about 24 hours.')),
  Q('geo', 8, L('Cel mai înalt vârf din România este:', 'Romania’s highest peak is:'), [L('Moldoveanu'), L('Negoiu'), L('Omu'), L('Pietrosul Rodnei')], 0, L('Moldoveanu, 2544 m, în Munții Făgăraș.', 'Moldoveanu, 2,544 m, in the Făgăraș Mountains.')),
  Q('geo', 8, L('Dunărea se varsă în:', 'The Danube flows into the:'), [L('Marea Neagră'), L('Marea Mediterană'), L('Marea Baltică'), L('Oceanul Atlantic')], 0, L('Prin cele trei brațe ale Deltei: Chilia, Sulina, Sfântu Gheorghe.', 'Through the Delta’s three branches: Chilia, Sulina, Sfântu Gheorghe.')),
  Q('geo', 8, L('Care țară NU se învecinează cu România?', 'Which country does NOT border Romania?'), [L('Polonia'), L('Ungaria'), L('Serbia'), L('Bulgaria')], 0, L('Vecinii sunt Ucraina, Rep. Moldova, Bulgaria, Serbia și Ungaria.', 'Neighbours: Ukraine, Moldova, Bulgaria, Serbia and Hungary.')),

  // Engleză
  Q('eng', 5, L('Alege forma corectă: „She ___ to school every day.”', 'Choose: „She ___ to school every day.”'), [L('goes'), L('go'), L('going'), L('gone')], 0, L('Present Simple, persoana a III-a singular: +s/es.', 'Present Simple, third person singular: +s/es.')),
  Q('eng', 6, L('Forma de trecut a lui „write” este:', 'The past form of „write” is:'), [L('wrote'), L('writed'), L('written'), L('writes')], 0, L('write – wrote – written.', 'write – wrote – written.')),
  Q('eng', 7, L('„I ___ already finished my homework.”', '„I ___ already finished my homework.”'), [L('have'), L('has'), L('am'), L('did')], 0, L('Present Perfect: have/has + participiu.', 'Present Perfect: have/has + past participle.')),
  Q('eng', 8, L('„Look at those clouds! It ___ rain.”', '„Look at those clouds! It ___ rain.”'), [L('is going to'), L('goes to'), L('will to'), L('is go to')], 0, L('Predicție bazată pe dovezi prezente: be going to.', 'Prediction based on present evidence: be going to.'))
];

/* ─────────────────────── SIMULARE EN VIII ─────────────────────── */
// Text original scris pentru aplicație (nu este fragment din vreo operă).
const SIM_ROM_TEXT = L(
`Bunicul își deschidea atelierul în fiecare dimineață la șapte, chiar și duminica. Spunea că lemnul „se trezește devreme” și că trebuie să-l asculți înainte să-l tai. Eu nu înțelegeam ce poate spune o scândură, așa că stăteam pe un scaun mic și număram rumegușul care cădea ca o ninsoare aurie.

Într-o zi, mi-a pus în mână o daltă și o bucată de tei.
— Nu te grăbi. Lemnul îți arată singur pe unde vrea să meargă.
Am lucrat toată după-amiaza la o pasăre strâmbă, cu o aripă mai mare decât cealaltă. Când i-am arătat-o, bunicul a zâmbit și a așezat-o pe raftul cel mai înalt, lângă viorile lui.
— De ce acolo? am întrebat.
— Pentru că e prima. Primele lucruri se țin la vedere, ca să-ți amintești de unde ai pornit.`,
`Every morning at seven Grandpa opened his workshop, even on Sundays. He said wood “wakes up early” and that you must listen to it before you cut it. I did not understand what a plank could say, so I sat on a small stool and counted the sawdust falling like golden snow.

One day he put a chisel and a piece of linden wood in my hand.
— Don’t rush. The wood shows you where it wants to go.
I worked all afternoon on a crooked bird, one wing bigger than the other. When I showed it to him, Grandpa smiled and placed it on the highest shelf, next to his violins.
— Why there? I asked.
— Because it’s the first. First things are kept in sight, so you remember where you started.`
);

const SIM_ROM = [
  Q('rom', 8, L('Ce înseamnă, în text, că lemnul „se trezește devreme”?', 'In the text, what does “wood wakes up early” suggest?'), [L('Bunicul personifică lemnul, sugerând respect pentru materialul cu care lucrează'), L('Lemnul este ud dimineața'), L('Atelierul are ferestre spre răsărit'), L('Bunicul nu doarme noaptea')], 0, L('Este o personificare care arată atitudinea bunicului față de meserie.', 'It is personification showing the grandfather’s respect for his craft.')),
  Q('rom', 8, L('Figura de stil din „rumegușul care cădea ca o ninsoare aurie” este:', 'The figure of speech in “sawdust falling like golden snow” is:'), [L('comparația'), L('enumerația'), L('antiteza'), L('repetiția')], 0, L('Elementul de legătură „ca” marchează comparația.', 'The word “like / ca” marks a simile.')),
  Q('rom', 8, L('Naratorul textului este:', 'The narrator of the text is:'), [L('narator-personaj, la persoana I'), L('narator omniscient, la persoana a III-a'), L('bunicul'), L('nu există narator')], 0, L('Folosește „eu”, „am lucrat” — participă la întâmplări.', 'Uses “I”, “I worked” — takes part in the events.')),
  Q('rom', 8, L('Modul de expunere dominant în a doua parte a textului este:', 'The dominant mode in the second part of the text is:'), [L('narațiunea cu dialog'), L('descrierea'), L('monologul liric'), L('argumentarea')], 0, L('Se relatează o întâmplare, cu replici ale personajelor.', 'An event is told, with characters’ lines.')),
  Q('rom', 8, L('De ce așază bunicul pasărea pe raftul cel mai înalt?', 'Why does Grandpa put the bird on the highest shelf?'), [L('Pentru că primele lucruri amintesc de unde ai pornit'), L('Pentru că este cea mai frumoasă sculptură'), L('Ca să nu o vadă nimeni'), L('Pentru că vrea să o vândă')], 0, L('Răspunsul apare în ultima replică a bunicului.', 'The answer is in Grandpa’s last line.')),
  Q('rom', 8, L('În „Nu te grăbi.”, verbul este la modul:', 'In „Nu te grăbi.”, the verb is in the:'), [L('imperativ (forma negativă)'), L('indicativ'), L('conjunctiv'), L('infinitiv')], 0, L('Imperativul negativ se formează cu „nu” + infinitivul scurt.', 'The negative imperative is „nu” + short infinitive.'))
];

const SIM_ROM_WRITE = {
  task: L('Redactează un text de minimum 150 de cuvinte în care să argumentezi dacă primele încercări (chiar imperfecte) sunt importante, pornind de la textul dat și de la experiența ta.', 'Write at least 150 words arguing whether first attempts (even imperfect ones) matter, drawing on the text and your own experience.'),
  rubric: [
    L('Formulezi clar opinia (ipoteza)', 'You state your opinion clearly'),
    L('Dai cel puțin două argumente', 'You give at least two arguments'),
    L('Fiecare argument are un exemplu (din text sau din experiența ta)', 'Each argument has an example (from the text or your life)'),
    L('Folosești conectori (în primul rând, de asemenea, așadar)', 'You use linkers (firstly, also, therefore)'),
    L('Ai o concluzie care reia opinia', 'You end with a conclusion that restates your opinion'),
    L('Respecți numărul minim de cuvinte', 'You meet the minimum word count'),
    L('Ai verificat ortografia și punctuația', 'You checked spelling and punctuation')
  ]
};

const SIM_MAT_PROBLEMS = [
  {
    q: L('Un paralelipiped dreptunghic are L = 8 cm, l = 6 cm și h = 10 cm.\na) Calculează volumul.\nb) Calculează diagonala bazei.\nc) Calculează aria totală.', 'A rectangular box has L = 8 cm, l = 6 cm and h = 10 cm.\na) Find the volume.\nb) Find the diagonal of the base.\nc) Find the total surface area.'),
    steps: [
      L('a) V = L · l · h = 8 · 6 · 10 = 480 cm³', 'a) V = L · l · h = 8 · 6 · 10 = 480 cm³'),
      L('b) d_b² = L² + l² = 64 + 36 = 100 ⇒ d_b = 10 cm', 'b) d² = L² + l² = 64 + 36 = 100 ⇒ d = 10 cm'),
      L('c) A_t = 2(Ll + lh + Lh) = 2(48 + 60 + 80) = 376 cm²', 'c) A_t = 2(Ll + lh + Lh) = 2(48 + 60 + 80) = 376 cm²')
    ]
  },
  {
    q: L('Se consideră funcția f: ℝ → ℝ, f(x) = 2x − 6.\na) Calculează f(0) + f(3).\nb) Determină punctele de intersecție ale graficului cu axele.\nc) Rezolvă ecuația f(x) = x.', 'Let f: ℝ → ℝ, f(x) = 2x − 6.\na) Compute f(0) + f(3).\nb) Find where the graph meets the axes.\nc) Solve f(x) = x.'),
    steps: [
      L('a) f(0) = −6, f(3) = 0 ⇒ f(0) + f(3) = −6', 'a) f(0) = −6, f(3) = 0 ⇒ f(0) + f(3) = −6'),
      L('b) Cu Oy: (0, −6); cu Ox: 2x − 6 = 0 ⇒ (3, 0)', 'b) y-axis: (0, −6); x-axis: 2x − 6 = 0 ⇒ (3, 0)'),
      L('c) 2x − 6 = x ⇒ x = 6', 'c) 2x − 6 = x ⇒ x = 6')
    ]
  },
  {
    q: L('Triunghiul ABC este dreptunghic în A, cu AB = 9 cm și AC = 12 cm. AD ⊥ BC, D ∈ BC.\na) Calculează BC.\nb) Calculează AD.\nc) Calculează aria triunghiului ABC.', 'Triangle ABC has a right angle at A, AB = 9 cm, AC = 12 cm. AD ⊥ BC, D on BC.\na) Find BC.\nb) Find AD.\nc) Find the area of ABC.'),
    steps: [
      L('a) BC² = 81 + 144 = 225 ⇒ BC = 15 cm (T. Pitagora)', 'a) BC² = 81 + 144 = 225 ⇒ BC = 15 cm (Pythagoras)'),
      L('b) AD = AB · AC / BC = 108 / 15 = 7,2 cm', 'b) AD = AB · AC / BC = 108 / 15 = 7.2 cm'),
      L('c) A = AB · AC / 2 = 54 cm²', 'c) A = AB · AC / 2 = 54 cm²')
    ]
  }
];

/* ─────────────────────────── ACHIEVEMENTS ─────────────────────────── */
const BADGES = [
  { id: 'first-quiz', icon: '✦', t: L('Primul quiz', 'First quiz'), d: L('Termină un quiz.', 'Finish a quiz.') },
  { id: 'perfect',    icon: '★', t: L('Fără greșeală', 'Flawless'), d: L('Un quiz de minimum 5 întrebări, toate corecte.', 'A quiz of 5+ questions, all correct.') },
  { id: 'cards-20',   icon: '❖', t: L('20 de cartonașe', '20 flashcards'), d: L('Repetă 20 de cartonașe.', 'Review 20 flashcards.') },
  { id: 'cards-100',  icon: '◆', t: L('100 de cartonașe', '100 flashcards'), d: L('Repetă 100 de cartonașe.', 'Review 100 flashcards.') },
  { id: 'formulas-10', icon: '∑', t: L('Colecționar de formule', 'Formula collector'), d: L('Marchează 10 formule ca știute.', 'Mark 10 formulas as known.') },
  { id: 'memo-5',     icon: '▤', t: L('Cititor atent', 'Careful reader'), d: L('Parcurge 5 memoratoare.', 'Read 5 study sheets.') },
  { id: 'pomo-1',     icon: '◷', t: L('Prima sesiune de focus', 'First focus session'), d: L('Termină un Pomodoro.', 'Finish a Pomodoro.') },
  { id: 'pomo-10',    icon: '◴', t: L('10 sesiuni de focus', '10 focus sessions'), d: L('Termină 10 Pomodoro.', 'Finish 10 Pomodoros.') },
  { id: 'sim-1',      icon: '✎', t: L('Prima simulare', 'First mock exam'), d: L('Termină o simulare.', 'Finish a mock exam.') },
  { id: 'streak-3',   icon: '🔥', t: L('3 zile la rând', '3-day streak'), d: L('Învață 3 zile consecutive.', 'Study 3 days in a row.') },
  { id: 'streak-7',   icon: '☀', t: L('O săptămână', 'One week'), d: L('Învață 7 zile consecutive.', 'Study 7 days in a row.') },
  { id: 'all-subj',   icon: '◎', t: L('Explorator', 'Explorer'), d: L('Răspunde la quiz la toate cele 8 materii.', 'Answer quizzes in all 8 subjects.') }
];

/* ─────────────────────────── LINKURI OFICIALE ─────────────────────────── */
const OFFICIAL = [
  { u: 'https://subiecte.edu.ro/', t: L('Subiecte și bareme oficiale (subiecte.edu.ro)', 'Official papers and marking schemes (subiecte.edu.ro)') },
  { u: 'https://www.edu.ro/', t: L('Ministerul Educației (edu.ro) — calendar, metodologie, programe', 'Ministry of Education (edu.ro) — calendar, rules, syllabi') },
  { u: 'https://www.manuale.edu.ro/', t: L('Manuale școlare digitale (manuale.edu.ro)', 'Digital school textbooks (manuale.edu.ro)') }
];

/* Calendar EN VIII 2027 — PROIECT publicat de MEC în august 2026; se verifică pe edu.ro. */
const EXAM_DATES = {
  draft: true,
  sim: '2027-03-16',
  rom: '2027-06-22',
  mat: '2027-06-24'
};

window.GS_DATA = { SUBJECTS, FORMULAS, MEMOS, TIMELINE, GLOSSARY, QUIZ, SIM_ROM_TEXT, SIM_ROM, SIM_ROM_WRITE, SIM_MAT_PROBLEMS, BADGES, OFFICIAL, EXAM_DATES };
