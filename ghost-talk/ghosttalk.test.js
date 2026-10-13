import { ghostTalk, ghostTalkText } from "./ghosttalk.js";

// The challenge's starter tests, unchanged.
describe("👻 Ghost Talk", () => {
  test("words that start with a vowel get -boo added to the end", () => {
    expect(ghostTalk("owl")).toBe("owl-boo");
    expect(ghostTalk("apple")).toBe("apple-boo");
    expect(ghostTalk("ice")).toBe("ice-boo");
  });

  test("words that start with a consonant move the first letter to the end and add -oo", () => {
    expect(ghostTalk("candy")).toBe("andy-coo");
    expect(ghostTalk("witch")).toBe("itch-woo");
    expect(ghostTalk("pumpkin")).toBe("umpkin-poo");
  });
});

// Edge cases from the challenge's ideas: capitalization and punctuation.
describe("👻 Ghost Talk — edge cases", () => {
  test("keeps a capital first letter at the front", () => {
    expect(ghostTalk("Candy")).toBe("Andy-coo");
    expect(ghostTalk("Owl")).toBe("Owl-boo");
  });

  test("keeps punctuation where it was", () => {
    expect(ghostTalk("candy!")).toBe("andy-coo!");
    expect(ghostTalk("owl?")).toBe("owl-boo?");
    expect(ghostTalk('"witch"')).toBe('"itch-woo"');
  });

  test("keeps a shouted word shouted", () => {
    expect(ghostTalk("BOO")).toBe("OO-BOO");
    expect(ghostTalk("OWL")).toBe("OWL-BOO");
  });

  test("translates a whole sentence word by word", () => {
    expect(ghostTalkText("Happy Halloween, candy!")).toBe("Appy-hoo Alloween-hoo, andy-coo!");
  });

  test("y counts as a consonant; only a, e, i, o, u are vowels", () => {
    expect(ghostTalk("yes")).toBe("es-yoo");
  });

  test("one-letter words", () => {
    expect(ghostTalk("a")).toBe("a-boo");
    expect(ghostTalk("b")).toBe("boo");
  });

  test("leaves anything without letters unchanged", () => {
    expect(ghostTalk("")).toBe("");
    expect(ghostTalk("42")).toBe("42");
    expect(ghostTalk("👻")).toBe("👻");
  });
});
