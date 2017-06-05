import { isSpecialAccount, isNormalUser } from "./utility";

describe("isSpecialAccount", () => {
  describe("given the marca 0", () => {
    it("detects a special account", () => {
      const marca = 0;

      expect(isSpecialAccount(marca)).toEqual(true);
    });
  });
  describe("given the marca 999", () => {
    it("detects a special account", () => {
      const marca = 999;

      expect(isSpecialAccount(marca)).toEqual(true);
    });
  });
  describe("given any other number is not", () => {
    it("detects a normal account", () => {
      const marca = 221;

      expect(isSpecialAccount(marca)).toEqual(false);
    });
  });
});

describe("isNormalUser", () => {
  describe("given the marca 0", () => {
    it("detects a special account", () => {
      const marca = 0;

      expect(isNormalUser(marca)).toEqual(false);
    });
  });
  describe("given the marca 999", () => {
    it("detects a special account", () => {
      const marca = 999;

      expect(isNormalUser(marca)).toEqual(false);
    });
  });
  describe("given any other number is not", () => {
    it("detects a normal account", () => {
      const marca = 221;

      expect(isNormalUser(marca)).toEqual(true);
    });
  });
});
