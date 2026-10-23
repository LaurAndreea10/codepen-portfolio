/** Pure challenge logic. Zero is a Tiny Gourd; thresholds are inclusive below. */
export const POUNDS_PER_KILOGRAM = 2.2046226218;
/** Historical challenge threshold, not a claim about the current world record. */
export const WORLD_RECORD_POUNDS = 2749;
export const INVALID_WEIGHT = 'Invalid weight';
const CATEGORIES = [
  {limit:1,name:'Tiny Gourd'}, {limit:10,name:'Mini'},
  {limit:50,name:'Carving'}, {limit:1000,name:'Giant'},
  {limit:WORLD_RECORD_POUNDS,name:'Record Breaker!'}, {limit:Infinity,name:'Legendary'}
];
export const CATEGORY_NAMES = Object.freeze(CATEGORIES.map(c=>c.name));
function numeric(value) {
  if(typeof value !== 'number' && typeof value !== 'string') return NaN;
  if(typeof value === 'string' && !value.trim()) return NaN;
  return Number(value);
}
export function weighPumpkin(pounds) {
  const n=numeric(pounds);
  return !Number.isFinite(n)||n<0 ? INVALID_WEIGHT : CATEGORIES.find(c=>n<c.limit).name;
}
export function weighPumpkinInKilograms(kilograms) {
  const n=numeric(kilograms);
  return !Number.isFinite(n)||n<0 ? INVALID_WEIGHT : weighPumpkin(n*POUNDS_PER_KILOGRAM);
}
