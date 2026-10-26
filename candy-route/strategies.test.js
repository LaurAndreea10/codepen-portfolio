import { maxCandy,maxCandyMemo,maxCandyBruteForce,isValidRoute,compareStrategies } from './candy.js';
describe('Attached features — boundary regressions',()=>{
 test('default arguments represent an empty street',()=>expect(maxCandy()).toBe(0));
 test.each([[0.5],[-1],[2],[0,0],[NaN],[Infinity]])('rejects invalid route %j',r=>expect(isValidRoute(r,2)).toBe(false));
 test('one house is not its own neighbor',()=>expect(isValidRoute([0],1,{culDeSac:true})).toBe(true));
 test('two-house circle cannot select both endpoints',()=>expect(isValidRoute([0,1],2,{culDeSac:true})).toBe(false));
 test('route validation does not reorder the supplied array',()=>{const r=[4,0,2];expect(isValidRoute(r,5)).toBe(true);expect(r).toEqual([4,0,2]);});
 test('brute force rejects long inputs instead of overflowing bitmasks',()=>expect(()=>maxCandyBruteForce(Array(32).fill(1))).toThrow(RangeError));
 test('memoization falls back safely for long inputs',()=>expect(maxCandyMemo(Array(100000).fill(2))).toBe(100000));
 test('heuristics expose their known counterexamples',()=>{
  expect(compareStrategies([5,1,1,5]).find(r=>r.id==='alternate')).toMatchObject({total:6,gap:4});
  expect(compareStrategies([4,5,4]).find(r=>r.id==='greedy')).toMatchObject({total:5,gap:3});
 });
 test('all comparisons obey circular adjacency and can skip negative houses',()=>{
  for(const a of [[5,1,1,5],[9,1,9],[2,3],[-3,-1,-4],[0]])for(const circle of [false,true]){
   const rows=compareStrategies(a,circle),optimal=rows[0].total;
   for(const r of rows){if(r.exact)expect(r.total).toBe(optimal);else{expect(r.total).toBeLessThanOrEqual(optimal);expect(r.total).toBeGreaterThanOrEqual(0);}}
  }
 });
 test('UI skips brute force beyond its interactive limit',()=>expect(compareStrategies(Array(40).fill(1)).find(r=>r.id==='brute').total).toBeNull());
});
