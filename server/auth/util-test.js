import { getMarca, prepareUser } from "./util";

describe("getMarca", () => {
  describe("given digits", () => {
    describe("given one digit", () => {
      describe("given just the first digit", () => {
        it("recognize a number from 1 to 9", () => {
          const result = getMarca({
            Position1: "1",
          });

          expect(result).toEqual(1);
        });
      });
      describe("given just the second digit", () => {
        it("recognize a number from 1 to 9", () => {
          const result = getMarca({
            Position2: "1",
          });

          expect(result).toEqual(1);
        });
      });
      describe("given just the third digit", () => {
        it("recognize a number from 1 to 9", () => {
          const result = getMarca({
            Position3: "1",
          });

          expect(result).toEqual(1);
        });
      });
    });

    describe("given first 2 digits", () => {
      it("recognize the number", () => {
        const
          result = getMarca({
              Position1 : "1",
              Position2 : "2",
            }),
          expected = 12;

        expect(result).toEqual(expected);
      });
    });

    describe("given last 2 digits", () => {
      it("recognize the number", () => {
        const
          result = getMarca({
              Position2 : "1",
              Position3 : "2",
            }),
          expected = 12;

        expect(result).toEqual(expected);
      });
    });

    describe("given first and last digits", () => {
      it("can not recognize", () => {
        const
          result = getMarca({
              Position1 : "1",
              Position3 : "2",
            }),
          expected = NaN;

        expect(result).toEqual(expected);
      });
    });
    describe("given all numbers", () => {
      it("recognize the number", () => {
        const
          result = getMarca({
              Position1 : "1",
              Position2 : "2",
              Position3 : "3",
            }),
          expected = 123;

        expect(result).toEqual(expected);
      });
    });
  });
  describe("given non-digits", () => {
    describe("given first pozition", () => {
      it("can not recognize", () => {
        const
          result = getMarca({
              Position1: "a",
            }),
          expected = NaN;

        expect(result).toEqual(expected);
      });
    });
    describe("given second pozition", () => {
      it("can not recognize", () => {
        const
          result = getMarca({
              Position2: "a",
            }),
          expected = NaN;

        expect(result).toEqual(expected);
      });
    });
    describe("given third pozition", () => {
      it("can not recognize", () => {
        const
          result = getMarca({
              Position3: "a",
            }),
          expected = NaN;

        expect(result).toEqual(expected);
      });
    });
  });
});

describe("prepareUser", () => {
  it("works", () => {
    const
      data = {
          nume    : "Sima",
          prenume : "Cristian",
          marca   : "1",
          grup    : "PSD",
        },
      temporaryPassword = "1234",
      result = prepareUser(data, temporaryPassword),
      expected = {
        name  : "Sima Cristian",
        marca : 1,
        group : "PSD",
        temporaryPassword,

        requireChange: true,
      };

    expect(result).toEqual(expected);
  });
});
