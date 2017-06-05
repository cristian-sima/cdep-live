import * as Immutable from "immutable";

import { normalizeArray } from "./request";
import * as matchers from "jest-immutable-matchers";

describe("normalizeArray", () => {
  beforeEach(() => {
    jest.addMatchers(matchers);
  });

  describe("given an empty array", () => {
    const result = normalizeArray([]);

    it("the entities is an empty Immutable.Map", () => {
      expect(result.entities).toEqualImmutable(Immutable.Map());
    });

    it("the result is an empty Immutable.List", () => {
      expect(result.result).toEqualImmutable(Immutable.List([]));
    });

  });
  describe("given a non-empty array", () => {
    const result = normalizeArray([{
      _id  : "1",
      data : "asdasdsadasdas",
    }, {
      _id  : "2",
      data : "43342i43gf4t",
    }]);

    it("the entities is an empty Immutable.Map", () => {
      expect(result.entities).toEqualImmutable(Immutable.Map({
        "1": Immutable.Map({
          _id  : "1",
          data : "asdasdsadasdas",
        }),
        "2": Immutable.Map({
          _id  : "2",
          data : "43342i43gf4t",
        }),
      }));
    });

    it("the result is an empty Immutable.List", () => {
      expect(result.result).toEqualImmutable(Immutable.List(["1", "2"]));
    });

  });
});
