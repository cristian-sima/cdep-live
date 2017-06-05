// flow

import {
  optiunePro,
  optiuneContra,
  optiuneNecunoscuta,

  proceseazaGuvern,
  proceseazaComisie,

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

describe("proceseazaGuvern", () => {
  it("optiune pro", () => {
    expect(proceseazaGuvern("FAVORABIL")).toEqual(optiunePro);
  });
  it("optiune contra", () => {
    expect(proceseazaGuvern("NEGATIV")).toEqual(optiuneContra);
  });
  it("returns optiune necunoscuta", () => {
    expect(proceseazaGuvern("ALTCEVA")).toEqual(optiuneNecunoscuta);
  });
});

describe("proceseazaComisie", () => {
  it("optiune pro", () => {
    expect(proceseazaComisie("ADOPTARE")).toEqual(optiunePro);
  });
  it("optiune contra", () => {
    expect(proceseazaComisie("RESPINGERE")).toEqual(optiuneContra);
  });
  it("returns optiune necunoscuta", () => {
    expect(proceseazaComisie("ALTCEVA")).toEqual(optiuneNecunoscuta);
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
      expect(encode(["PSD", "PNL", "UDMR"])).toEqual("PSD|PNL|UDMR");
    });
  });
});

describe("processPublicVote", () => {
  describe("given is public vote", () => {
    describe("given the list of votes includes the group", () => {
      it("returns the list of votes", () => {
        const
          publicVote = encode(["PNL", "PSD"]),
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

        expect(result).toEqual(encode(["PNL", "PSD"]));
      });
    });
  });
  describe("given is not public vote", () => {
    it("removes the group from the list", () => {
      const
        publicVote = encode(["PNL", "PSD", "UDMR"]),
        result = processPublicVote({
          publicVote,
          group        : "PSD",
          isPublicVote : false,
        });

      expect(result).toEqual(encode(["PNL", "UDMR"]));
    });
  });
});
