import { isValidEmail } from "./validation";

const valid = true,
  notValid = false;

describe("given an email without @ [email]", () => {
  it("should not be valid", () => {
    expect(isValidEmail("email")).toBe(notValid);
  });
});

describe("given an email without the user [email@]", () => {
  it("should not be valid", () => {
    expect(isValidEmail("email@")).toBe(notValid);
  });
});

describe("given an email without domain [email@email]", () => {
  it("should not be valid", () => {
    expect(isValidEmail("email@email")).toBe(notValid);
  });
});

describe("given a good email (email@email.ro)", () => {
  it("should be valid", () => {
    expect(isValidEmail("email@email.ro")).toBe(valid);
  });
});
