import {
  weighPumpkin,
  weighPumpkinInKilograms,
  CATEGORY_NAMES,
  INVALID_WEIGHT,
  POUNDS_PER_KILOGRAM,
  WORLD_RECORD_POUNDS
} from "./pumpkin.js";

// The challenge's categories: under 10 lb Mini, under 50 Carving,
// under 1000 Giant, from 1000 up Record Breaker!
describe("🎃 Pumpkin Weigh-In — challenge categories", () => {
  test("light pumpkins are Mini", () => {
    expect(weighPumpkin(1)).toBe("Mini");
    expect(weighPumpkin(5)).toBe("Mini");
    expect(weighPumpkin(9.9)).toBe("Mini");
  });

  test("carving-size pumpkins are Carving", () => {
    expect(weighPumpkin(12)).toBe("Carving");
    expect(weighPumpkin(49)).toBe("Carving");
  });

  test("big pumpkins are Giant", () => {
    expect(weighPumpkin(200)).toBe("Giant");
    expect(weighPumpkin(999)).toBe("Giant");
  });

  test("record pumpkins are Record Breaker!", () => {
    expect(weighPumpkin(1500)).toBe("Record Breaker!");
    expect(weighPumpkin(2500)).toBe("Record Breaker!");
  });

  test("a weight exactly on a line moves up to the bigger category", () => {
    expect(weighPumpkin(10)).toBe("Carving");
    expect(weighPumpkin(50)).toBe("Giant");
    expect(weighPumpkin(1000)).toBe("Record Breaker!");
  });
});

// The two extra categories at the ends of the scale.
describe("🎃 Pumpkin Weigh-In — Tiny Gourd and Legendary", () => {
  test("anything under 1 lb is a Tiny Gourd, so 1 lb stays Mini", () => {
    expect(weighPumpkin(0)).toBe("Tiny Gourd");
    expect(weighPumpkin(0.4)).toBe("Tiny Gourd");
    expect(weighPumpkin(1)).toBe("Mini");
  });

  test("matching the world record is Legendary", () => {
    expect(weighPumpkin(WORLD_RECORD_POUNDS - 1)).toBe("Record Breaker!");
    expect(weighPumpkin(WORLD_RECORD_POUNDS)).toBe("Legendary");
    expect(weighPumpkin(4000)).toBe("Legendary");
  });

  test("the record line stays above 2500, so the challenge case keeps passing", () => {
    expect(WORLD_RECORD_POUNDS > 2500).toBe(true);
  });

  test("six categories, smallest to largest", () => {
    expect(CATEGORY_NAMES.join(" | ")).toBe(
      "Tiny Gourd | Mini | Carving | Giant | Record Breaker! | Legendary"
    );
  });
});

describe("🎃 Pumpkin Weigh-In — input that is not a weight", () => {
  test("negative numbers, text and empty values are invalid", () => {
    expect(weighPumpkin(-5)).toBe(INVALID_WEIGHT);
    expect(weighPumpkin("heavy")).toBe(INVALID_WEIGHT);
    expect(weighPumpkin(NaN)).toBe(INVALID_WEIGHT);
    expect(weighPumpkin(Infinity)).toBe(INVALID_WEIGHT);
    expect(weighPumpkin(undefined)).toBe(INVALID_WEIGHT);
  });

  test("numeric strings are read as numbers", () => {
    expect(weighPumpkin("12")).toBe("Carving");
    expect(weighPumpkin("1000")).toBe("Record Breaker!");
  });
});

describe("🎃 Pumpkin Weigh-In — kilograms", () => {
  test("kilograms are converted before weighing", () => {
    expect(weighPumpkinInKilograms(2)).toBe("Mini");
    expect(weighPumpkinInKilograms(10)).toBe("Carving");
    expect(weighPumpkinInKilograms(500)).toBe("Record Breaker!");
  });

  test("every line converts back to the same category", () => {
    [1, 10, 50, 1000, WORLD_RECORD_POUNDS].forEach((pounds) => {
      expect(weighPumpkinInKilograms(pounds / POUNDS_PER_KILOGRAM + 0.001)).toBe(
        weighPumpkin(pounds)
      );
    });
  });

  test("invalid kilograms are invalid too", () => {
    expect(weighPumpkinInKilograms(-1)).toBe(INVALID_WEIGHT);
    expect(weighPumpkinInKilograms("a lot")).toBe(INVALID_WEIGHT);
  });
});
