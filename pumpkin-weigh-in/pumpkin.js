/**
 * 🎃 Pumpkin Weigh-In — logică pură, fără DOM.
 * Tot ce atinge pagina stă în app.js, ca fișierul ăsta să rămână 100% testabil.
 */

/** Factor oficial de conversie (1 kg = 2.2046226218 lb). */
export const POUNDS_PER_KILOGRAM = 2.2046226218;

/**
 * Recordul mondial Guinness: 2749 lb (Travis Gienger, octombrie 2023).
 * Un dovleac care îl atinge sau îl depășește nu mai e doar „record breaker" —
 * e legendar. Constantă exportată, ca testul să nu repete numărul.
 */
export const WORLD_RECORD_POUNDS = 2749;

/** Răspunsul pentru orice intrare care nu e un număr pozitiv. */
export const INVALID_WEIGHT = "Invalid weight";

/**
 * Pragul SUPERIOR al fiecărei categorii, în livre.
 * Un dovleac intră în prima categorie sub al cărei prag rămâne — exact
 * regula „pe linie urcă la categoria mai mare" cerută de testul 5.
 * Adaugi o categorie nouă? Doar inserezi o linie aici, în ordine crescătoare.
 */
const CATEGORIES = [
  { limit: 1, name: "Tiny Gourd" },
  { limit: 10, name: "Mini" },
  { limit: 50, name: "Carving" },
  { limit: 1000, name: "Giant" },
  { limit: WORLD_RECORD_POUNDS, name: "Record Breaker!" },
  { limit: Infinity, name: "Legendary" }
];

/** Numele categoriilor, în ordine — folosit de UI ca să deseneze traseul. */
export const CATEGORY_NAMES = CATEGORIES.map((category) => category.name);

/**
 * Categorisește un dovleac după greutatea în livre.
 * @param {number|string} pounds
 * @returns {string} numele categoriei sau INVALID_WEIGHT
 */
export function weighPumpkin(pounds) {
  const weight = Number(pounds);

  if (!Number.isFinite(weight) || weight < 0) {
    return INVALID_WEIGHT;
  }

  // `find` se oprește la primul prag nedepășit; ultimul e Infinity, deci
  // întoarce mereu ceva — fără `else` final și fără condiții duble.
  return CATEGORIES.find((category) => weight < category.limit).name;
}

/**
 * Aceeași categorisire, dar pornind de la kilograme.
 * @param {number|string} kilograms
 * @returns {string}
 */
export function weighPumpkinInKilograms(kilograms) {
  const weight = Number(kilograms);

  if (!Number.isFinite(weight) || weight < 0) {
    return INVALID_WEIGHT;
  }

  return weighPumpkin(weight * POUNDS_PER_KILOGRAM);
}
