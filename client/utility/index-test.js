import * as Immutable from "immutable";

import {
  getSortedItemList,
  encode,
  processPublicVote,
} from "./index";

import * as matchers from "jest-immutable-matchers";

describe("getSortedItemList", () => {
  beforeEach(() => {
    jest.addMatchers(matchers);
  });

  describe("given an empty array", () => {
    const result = getSortedItemList(Immutable.Map({}));

    it("it returns an empty Immutable.List", () => {
      expect(result).toEqualImmutable(Immutable.List([]));
    });

  });
  describe("given a non-empty array", () => {
    const result = getSortedItemList(Immutable.Map({
      "1": Immutable.Map({
        _id      : "1",
        position : "2",
      }),
      "2": Immutable.Map({
        _id      : "2",
        position : "1",
      }),
    }));

    it("returns a sorted Immutable.List of IDs after 'position'", () => {
      expect(result).toEqualImmutable(Immutable.List([
        "2",
        "1",
      ]));
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
