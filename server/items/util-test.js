// flow

import {
  optiunePro,
  optiuneContra,
  optiuneNecunoscuta,

  proceseazaGuvern,
  proceseazaComisie,

  hasGroupVoted,
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
