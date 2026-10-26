/** Maximum non-adjacent sum. Visiting no houses is allowed.
 * O(n) time, O(1) extra memory; never changes the input.
 */
export function maxCandy(houses) {
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
export function bestRoute(houses, circular = false) {
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
