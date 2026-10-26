/** Maximum non-adjacent sum. Visiting no houses is allowed.
 * O(n) time, O(1) extra memory; never changes the input.
 */
export function maxCandy(houses = []) {
  let previous = 0;
  let twoBack = 0;
  for (const candy of houses) {
    const current = Math.max(previous, twoBack + candy);
    twoBack = previous;
    previous = current;
  }
  return previous;
}

/** Reconstruct one optimal route. On ties, prefer skipping the later house. */
export function bestRoute(houses = [], circular = false) {
  function linear(start, end) {
    const dp = [0, 0];
    const steps = [];
    for (let i = start; i < end; i++) {
      const take = dp[dp.length - 2] + houses[i];
      const skip = dp[dp.length - 1];
      dp.push(Math.max(skip, take));
      steps.push({ index: i, candy: houses[i], take, skip, best: Math.max(skip, take) });
    }
    const indices = [];
    let k = end - start;
    while (k > 0) {
      if (dp[k + 1] > dp[k]) {
        indices.push(start + k - 1);
        k -= 2;
      } else k--;
    }
    return { total: dp.at(-1), indices: indices.reverse(), steps };
  }
  if (!circular || houses.length <= 1) return linear(0, houses.length);
  const withoutLast = linear(0, houses.length - 1);
  const withoutFirst = linear(1, houses.length);
  return withoutLast.total >= withoutFirst.total ? withoutLast : withoutFirst;
}

// APIs from the attached implementation, using the existing deterministic solver.
export function candyRoute(houses = []) { return bestRoute(houses).indices; }
export function maxCandyCulDeSac(houses = []) { return bestRoute(houses, true).total; }
export function culDeSacRoute(houses = []) { return bestRoute(houses, true).indices; }
export function sumOf(houses, route) { return route.reduce((sum, i) => sum + houses[i], 0); }
export function isValidRoute(route, length, { culDeSac = false } = {}) {
  if (!Number.isInteger(length) || length < 0 || !Array.isArray(route)) return false;
  if (route.some(i => !Number.isInteger(i) || i < 0 || i >= length)) return false;
  const sorted = [...route].sort((a,b) => a-b);
  if (sorted.some((i,k) => k > 0 && i - sorted[k-1] < 2)) return false;
  return !(culDeSac && length > 1 && sorted[0] === 0 && sorted.at(-1) === length-1);
}

/** Exponential oracle, intentionally restricted to at most 20 houses. */
export function maxCandyBruteForce(houses = []) {
  if (houses.length > 20) throw new RangeError('Brute force supports at most 20 houses. Use maxCandy for long streets.');
  let best = 0;
  for (let mask=0; mask < 2 ** houses.length; mask++) {
    if (mask & (mask >> 1)) continue;
    let total=0;
    for (let i=0;i<houses.length;i++) if (mask & (1<<i)) total+=houses[i];
    best=Math.max(best,total);
  }
  return best;
}

/** Top-down memoization; long inputs use iterative DP to avoid call-stack overflow. */
export function maxCandyMemo(houses = []) {
  if (houses.length > 1000) return maxCandy(houses);
  const memo=new Map();
  function go(i) {
    if(i>=houses.length)return 0;
    if(!memo.has(i))memo.set(i,Math.max(houses[i]+go(i+2),go(i+1)));
    return memo.get(i);
  }
  return go(0);
}

/** Legal baseline, not an optimal algorithm. In circles, drop the weaker endpoint. */
export function everyOtherHouse(houses = [], { circular = false } = {}) {
  const totals=[0,1].map(parity=>{
    const route=houses.map((_,i)=>i).filter(i=>i%2===parity && houses[i]>0);
    if(circular && houses.length>1 && route[0]===0 && route.at(-1)===houses.length-1){
      if(houses[0]<=houses.at(-1))route.shift();else route.pop();
    }
    return sumOf(houses,route);
  });
  return Math.max(0,...totals);
}

/** Biggest-pile greedy baseline; supports the same adjacency rule as the current game. */
export function biggestPileFirst(houses = [], { circular = false } = {}) {
  const blocked=new Set();let total=0;
  [...houses.keys()].sort((a,b)=>houses[b]-houses[a] || a-b).forEach(i=>{
    if(blocked.has(i)||houses[i]<=0)return;
    total+=houses[i];blocked.add(i).add(i-1).add(i+1);
    if(circular && houses.length>1){if(i===0)blocked.add(houses.length-1);if(i===houses.length-1)blocked.add(0);}
  });
  return total;
}

/** Compare methods under identical rules. Avoid exponential work in the UI above 18 houses. */
export function compareStrategies(houses = [], circular = false) {
  function exact(fn){
    if(!circular || houses.length<=1)return fn(houses);
    return Math.max(fn(houses.slice(0,-1)),fn(houses.slice(1)));
  }
  const optimal=bestRoute(houses,circular).total;
  return [
    {id:'dp',total:optimal,exact:true},
    {id:'memo',total:exact(maxCandyMemo),exact:true},
    {id:'brute',total:houses.length<=18?exact(maxCandyBruteForce):null,exact:true},
    {id:'alternate',total:everyOtherHouse(houses,{circular}),exact:false},
    {id:'greedy',total:biggestPileFirst(houses,{circular}),exact:false}
  ].map(row=>({...row,gap:row.total===null?null:optimal-row.total}));
}
