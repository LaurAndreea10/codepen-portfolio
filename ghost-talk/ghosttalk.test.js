import { ghostTalk } from "./ghosttalk.js";

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
