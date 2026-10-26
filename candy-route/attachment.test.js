import {
  maxCandy,
  candyRoute,
  maxCandyCulDeSac,
  culDeSacRoute,
  sumOf,
  isValidRoute,
  maxCandyBruteForce,
  maxCandyMemo,
  everyOtherHouse,
  biggestPileFirst,
} from "./candy.js";

describe("🍬 Candy Route", () => {
  test("a street with no houses has no candy", () => {
    expect(maxCandy([])).toBe(0);
  });

  test("a street with one house gives you that house's candy", () => {
    expect(maxCandy([5])).toBe(5);
  });

  test("with two houses, pick the better one", () => {
    expect(maxCandy([2, 7])).toBe(7);
    expect(maxCandy([9, 4])).toBe(9);
  });

  test("never visits two houses in a row", () => {
    expect(maxCandy([1, 2, 3, 1])).toBe(4); // 1 + 3
    expect(maxCandy([2, 7, 9, 3, 1])).toBe(12); // 2 + 9 + 1
  });

  test("visiting every other house isn't always best", () => {
    expect(maxCandy([5, 1, 1, 5])).toBe(10); // 5 + 5
    expect(maxCandy([2, 1, 1, 2])).toBe(4); // 2 + 2
  });

  test("grabbing the biggest pile first isn't always best", () => {
    expect(maxCandy([4, 5, 4])).toBe(8); // 4 + 4, not 5
    expect(maxCandy([6, 7, 6, 1])).toBe(12); // 6 + 6, not 7 + 1
  });

  test("handles houses that give out no candy", () => {
    expect(maxCandy([0, 0, 0])).toBe(0);
    expect(maxCandy([0, 3, 0, 0, 4])).toBe(7); // 3 + 4
  });

  test("handles a long street", () => {
    const street = Array(100).fill(1);
    expect(maxCandy(street)).toBe(50);
  });
});

describe("🗺️ Show the route", () => {
  test("empty street has an empty route", () => {
    expect(candyRoute([])).toEqual([]);
  });

  test("returns the houses to visit", () => {
    expect(candyRoute([2, 7, 9, 3, 1])).toEqual([0, 2, 4]);
    expect(candyRoute([5, 1, 1, 5])).toEqual([0, 3]);
    expect(candyRoute([4, 5, 4])).toEqual([0, 2]);
    expect(candyRoute([6, 7, 6, 1])).toEqual([0, 2]);
  });

  test("skips houses with nothing to give", () => {
    expect(candyRoute([0, 3, 0, 0, 4])).toEqual([1, 4]);
  });

  test("the route always matches maxCandy and is valid", () => {
    for (let run = 0; run < 300; run++) {
      const street = randomStreet(12, -5, 10);
      const route = candyRoute(street);
      expect(isValidRoute(route, street.length)).toBe(true);
      expect(sumOf(street, route)).toBe(maxCandy(street));
    }
  });
});

describe("👻 Trick houses (negative candy)", () => {
  test("a street of only tricks gives nothing — just walk past", () => {
    expect(maxCandy([-3, -1, -4])).toBe(0);
    expect(candyRoute([-3, -1, -4])).toEqual([]);
  });

  test("never visits a house that takes candy away", () => {
    expect(maxCandy([5, -10, -10, 5])).toBe(10);
    expect(maxCandy([3, -2, 4, -1, 6])).toBe(13); // 3 + 4 + 6
    expect(candyRoute([3, -2, 4, -1, 6])).toEqual([0, 2, 4]);
  });
});

describe("🔁 Cul-de-sac (first and last houses are neighbours)", () => {
  test("small streets", () => {
    expect(maxCandyCulDeSac([])).toBe(0);
    expect(maxCandyCulDeSac([7])).toBe(7);
    expect(maxCandyCulDeSac([2, 3])).toBe(3);
  });

  test("can't take both ends", () => {
    expect(maxCandyCulDeSac([2, 3, 2])).toBe(3);
    expect(maxCandyCulDeSac([1, 2, 3, 1])).toBe(4);
    expect(maxCandyCulDeSac([5, 1, 1, 5])).toBe(6); // not 10 anymore
  });

  test("route never uses both the first and last house", () => {
    for (let run = 0; run < 300; run++) {
      const street = randomStreet(10, -3, 10);
      const route = culDeSacRoute(street);
      expect(isValidRoute(route, street.length, { culDeSac: true })).toBe(true);
      expect(sumOf(street, route)).toBe(maxCandyCulDeSac(street));
    }
  });
});

describe("🧪 All strategies, compared", () => {
  test("DP, memo and brute force always agree", () => {
    for (let run = 0; run < 500; run++) {
      const street = randomStreet(14, -5, 10);
      const expected = maxCandyBruteForce(street);
      expect(maxCandy(street)).toBe(expected);
      expect(maxCandyMemo(street)).toBe(expected);
    }
  });

  test("greedy strategies fail on the tricky streets", () => {
    expect(everyOtherHouse([5, 1, 1, 5])).toBe(6); // best is 10
    expect(biggestPileFirst([4, 5, 4])).toBe(5); // best is 8
  });

  test("a really long street stays fast", () => {
    const street = Array(100_000).fill(2);
    expect(maxCandy(street)).toBe(100_000);
  });
});

function randomStreet(maxLength, min, max) {
  const length = Math.floor(Math.random() * (maxLength + 1));
  return Array.from(
    { length },
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );
}
