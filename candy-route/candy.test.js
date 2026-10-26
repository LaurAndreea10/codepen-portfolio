import { maxCandy, bestRoute } from './candy.js';
describe('🍬 Candy Route — starter cases', () => {
  test('empty street', () => expect(maxCandy([])).toBe(0));
  test('one house', () => expect(maxCandy([5])).toBe(5));
  test('two houses', () => {
    expect(maxCandy([2, 7])).toBe(7);
    expect(maxCandy([9, 4])).toBe(9);
  });
  test('no neighboring houses', () => {
    expect(maxCandy([1, 2, 3, 1])).toBe(4);
    expect(maxCandy([2, 7, 9, 3, 1])).toBe(12);
  });
  test('alternating is not always optimal', () => {
    expect(maxCandy([5, 1, 1, 5])).toBe(10);
    expect(maxCandy([2, 1, 1, 2])).toBe(4);
  });
  test('greedy is not always optimal', () => {
    expect(maxCandy([4, 5, 4])).toBe(8);
    expect(maxCandy([6, 7, 6, 1])).toBe(12);
  });
  test('zeros', () => {
    expect(maxCandy([0, 0, 0])).toBe(0);
    expect(maxCandy([0, 3, 0, 0, 4])).toBe(7);
  });
  test('long street', () => expect(maxCandy(Array(100).fill(1))).toBe(50));
});
describe('✨ Extensions', () => {
  test('negative houses may be skipped', () => {
    expect(maxCandy([-5,-1,-8])).toBe(0);
    expect(maxCandy([5,-2,6])).toBe(11);
  });
  test('reconstructs an optimal route', () => {
    expect(bestRoute([2,7,9,3,1]).indices).toEqual([0,2,4]);
    expect(bestRoute([5,1,1,5]).indices).toEqual([0,3]);
  });
  test('circular streets', () => {
    expect(bestRoute([2,3,2],true).total).toBe(3);
    expect(bestRoute([5,1,1,5],true).total).toBe(6);
    expect(bestRoute([5],true).total).toBe(5);
    expect(bestRoute([],true).total).toBe(0);
  });
  test('does not mutate input', () => {
    const a=Object.freeze([4,5,4]);
    expect(maxCandy(a)).toBe(8);
    expect(bestRoute(a).indices).toEqual([0,2]);
  });
});
