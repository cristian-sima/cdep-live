// flow

import {
  optiunePro,
  optiuneContra,
  optiuneNecunoscuta,

  proceseazaGuvern,
  proceseazaComisie,
} from "./items";

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
