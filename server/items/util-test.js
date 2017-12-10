// flow

import {
  optiunePro,
  optiuneContra,

  getGuvern,
  getComisie,
  getAnGuvern,
  hasGroupVoted,

  encode,
  processPublicVote,
} from "./util";

describe("hasGroupVoted", () => {
  it("it voted", () => {
    it("given just the group", () => {
      expect(hasGroupVoted({
        publicVote : "PSD",
        group      : "PSD",
      })).toEqual(true);
    });
    it("given multiple parties", () => {
      expect(hasGroupVoted({
        publicVote : "PSD|PNL",
        group      : "PSD",
      })).toEqual(true);
    });
  });
  describe("it did not vote", () => {
    it("given undefined", () => {
      expect(hasGroupVoted({
        group: "PSD",
      })).toEqual(false);
    });
    it("given null", () => {
      expect(hasGroupVoted({
        publicVote : null,
        group      : "PSD",
      })).toEqual(false);
    });
    it("given other parties except the group", () => {
      expect(hasGroupVoted({
        publicVote : "USR|PNL",
        group      : "PSD",
      })).toEqual(false);
    });
  });
});

describe("getGuvern", () => {
  describe("given nothing", () => {
    it("returns nothing", () => {
      expect(getGuvern(null)).toEqual(null);
    });
  });
  describe("given a pro option", () => {
    it("detects it", () => {
      expect(getGuvern("FAVORABIL")).toEqual(optiunePro);
    });
  });
  describe("given a con option", () => {
    it("detects it", () => {
      expect(getGuvern("NEGATIV")).toEqual(optiuneContra);
    });
  });
  describe("given any other things", () => {
    it("returns nothing", () => {
      expect(getGuvern("ALTCEVA")).toEqual(null);
    });
  });
});

describe("getComisie", () => {
  describe("given nothing", () => {
    it("returns nothing", () => {
      expect(getComisie(null)).toEqual(null);
    });
  });
  describe("given a pro option", () => {
    it("detects it", () => {
      expect(getComisie("ADOPTARE")).toEqual(optiunePro);
    });
  });
  describe("given a con option", () => {
    it("detects it", () => {
      expect(getComisie("RESPINGERE")).toEqual(optiuneContra);
    });
  });
  describe("given any other things", () => {
    it("returns nothing", () => {
      expect(getComisie("ALTCEVA")).toEqual(null);
    });
  });
});

describe("getAnGuvern", () => {
  describe("given the guvern null", () => {
    it("returns null", () => {
      expect(getAnGuvern(null)).toEqual(null);
    });
  });
  describe("given the guvern valid", () => {
    describe("given the year null", () => {
      it("returns null", () => {
        expect(getAnGuvern("FAVORABIL", null)).toEqual(null);
      });
    });
    describe("given the year good", () => {
      describe("given the year does not contain 3 parts", () => {
        it("returns null", () => {
          expect(getAnGuvern("FAVORABIL", "1.2")).toEqual(null);
        });
      });
      describe("given the year contains 3 parts", () => {
        describe("given the third part is empty", () => {
          it("returns null", () => {
            expect(getAnGuvern("FAVORABIL", "1.2.")).toEqual(null);
          });
        });
        describe("given the third part is not a number", () => {
          it("returns null", () => {
            expect(getAnGuvern("FAVORABIL", "1.2.x")).toEqual(null);
          });
        });
        describe("given the third part is a number", () => {
          it("returns null", () => {
            const year = 2014;

            expect(getAnGuvern("FAVORABIL", "1.2.2014")).toEqual(year);
          });
        });
      });
    });
  });
});

describe("encode", () => {
  describe("given an empty array", () => {
    it("returns null", () => {
      expect(encode([])).toEqual(null);
    });
  });
  describe("given an non-empty array", () => {
    it("returns the join of array", () => {
      expect(encode([
        "PSD",
        "PNL",
        "UDMR",
      ])).toEqual("PSD|PNL|UDMR");
    });
  });
});

describe("processPublicVote", () => {
  describe("given is public vote", () => {
    describe("given the list of votes includes the group", () => {
      it("returns the list of votes", () => {
        const
          publicVote = encode([
            "PNL",
            "PSD",
          ]),
          result = processPublicVote({
            publicVote,
            group        : "PSD",
            isPublicVote : true,
          });

        expect(result).toEqual(publicVote);
      });
    });
    describe("given the list of votes does not include the group", () => {
      it("includes the group in the list", () => {
        const
          publicVote = encode(["PNL"]),
          result = processPublicVote({
            publicVote,
            group        : "PSD",
            isPublicVote : true,
          });

        expect(result).toEqual(encode([
          "PNL",
          "PSD",
        ]));
      });
    });
  });
  describe("given is not public vote", () => {
    it("removes the group from the list", () => {
      const
        publicVote = encode([
          "PNL",
          "PSD",
          "UDMR",
        ]),
        result = processPublicVote({
          publicVote,
          group        : "PSD",
          isPublicVote : false,
        });

      expect(result).toEqual(encode([
        "PNL",
        "UDMR",
      ]));
    });
  });
});
