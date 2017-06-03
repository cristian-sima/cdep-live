/* eslint-disable max-lines, no-undefined */

import reducer, {
  getIsUpdatingLive,
  getSelectedItem,
  getToggledItem,
  getIsPublicVote,
  getItemsSorted,
  getItem,
  getSelectedItemPosition,
} from "./list";

import * as Immutable from "immutable";

import { updatingList } from "actions";

import {
  normalizeArray,
  optiunePro,
  optiuneNecunoscuta,
  optiuneContra,
} from "utility";

describe("list reducer", () => {
  it("returns the initial state", () => {
    const result = reducer(undefined, { type: "" });

    expect(result).toEqual({
      isUpdating   : false,
      itemSelected : null,

      itemToggled  : null,
      isPublicVote : false,

      data : Immutable.Map(),
      list : Immutable.List(),
    });
  });

  it("handles UPDATE_LIST", () => {
    const
      list = [{
        "_id"      : "33",
        "position" : "3",
      }, {
        "_id"      : "22",
        "position" : "2",
      }, {
        "_id"      : "11",
        "position" : "1",
      }],
      itemSelected = "22",
      initialState = {
        isUpdating   : true,
        itemSelected : null,

        data : Immutable.Map(),
        list : Immutable.List(),
      },
      result = reducer(initialState, {
        type    : "UPDATE_LIST",
        payload : {
          list,
          itemSelected,
        },
      });

    expect(result).toEqual({
      isUpdating: false,
      itemSelected,

      data : normalizeArray(list).entities,
      list : Immutable.List(["11", "22", "33"]),
    });
  });

  it("handles UPDATING_LIST", () => {
    const
      initialState = {
        isUpdating: false,
      },
      result = reducer(initialState, updatingList());

    expect(result).toEqual({
      isUpdating: true,
    });
  });

  it("handles SELECT_ITEM", () => {
    const
      itemSelected = "221112",
      initialState = {
        itemSelected: null,
      },
      result = reducer(initialState, {
        type    : "SELECT_ITEM",
        payload : itemSelected,
      });

    expect(result).toEqual({
      itemSelected,
    });
  });

  describe("it handles VOTE_ITEM", () => {
    describe("given there is the unknown option", () => {
      it("removes the current party form the visibility list", () => {
        const
          group = "PSD",
          id = 78,
          optiune = optiuneNecunoscuta,
          initialState = {
            data: Immutable.Map({
              [id]: Immutable.Map({
                [group]    : optiunePro,
                publicVote : "PSD|PNL",
              }),
            }),
          },
          result = reducer(initialState, {
            type    : "VOTE_ITEM",
            payload : {
              group,
              isPublicVote: false,
              id,
              optiune,
            },
          });

        expect(result).toEqual({
          data: Immutable.Map({
            [id]: Immutable.Map({
              [group]    : optiuneNecunoscuta,
              publicVote : "PNL",
            }),
          }),
        });
      });
    });
    describe("given there is not the unknown option", () => {
      it("modifies the item", () => {
        const
          group = "PSD",
          id = 78,
          optiune = optiuneContra,
          initialState = {
            data: Immutable.Map({
              [id]: Immutable.Map({
                [group]    : optiunePro,
                publicVote : "PNL",
              }),
            }),
          },
          result = reducer(initialState, {
            type    : "VOTE_ITEM",
            payload : {
              group,
              isPublicVote: true,
              id,
              optiune,
            },
          });

        expect(result).toEqual({
          data: Immutable.Map({
            [id]: Immutable.Map({
              [group]    : optiuneContra,
              publicVote : "PNL|PSD",
            }),
          }),
        });
      });
    });
  });

  describe("it handles TOGGLE_ITEM", () => {
    describe("given the toggled item is the same as the current toggled one", () => {
      it("sets to null", () => {
        const
          itemToggled = "741",
          initialState = {
            isPublicVote: true,
            itemToggled,
          },
          result = reducer(initialState, {
            type    : "TOGGLE_ITEM",
            payload : itemToggled,
          });

        expect(result).toEqual({
          isPublicVote : false,
          itemToggled  : null,
        });
      });
    });
    describe("given the toggled item is not the same as the current toggled one", () => {
      it("sets the item", () => {
        const
          itemToggled = "741",
          initialState = {
            isPublicVote : true,
            itemToggled  : "78",
          },
          result = reducer(initialState, {
            type    : "TOGGLE_ITEM",
            payload : itemToggled,
          });

        expect(result).toEqual({
          isPublicVote: false,
          itemToggled,
        });
      });
    });
  });

  it("handles TOGGLE_PUBLIC_VOTE", () => {
    const
      initialState = {
        isPublicVote: true,
      },
      result = reducer(initialState, {
        type: "TOGGLE_PUBLIC_VOTE",
      });

    expect(result).toEqual({
      isPublicVote: false,
    });
  });
});

describe("list getters", () => {
  it("getIsUpdatingLive", () => {
    const
      state = {
        list: {
          isUpdating: true,
        },
      },
      result = getIsUpdatingLive(state);

    expect(result).toEqual(true);
  });

  it("getSelectedItem", () => {
    const
      itemSelected = "23232",
      state = {
        list: {
          itemSelected,
        },
      },
      result = getSelectedItem(state);

    expect(result).toEqual(itemSelected);
  });

  it("getToggledItem", () => {
    const
      itemToggled = "23232",
      state = {
        list: {
          itemToggled,
        },
      },
      result = getToggledItem(state);

    expect(result).toEqual(itemToggled);
  });

  it("getIsPublicVote", () => {
    const
      state = {
        list: {
          isPublicVote: true,
        },
      },
      result = getIsPublicVote(state);

    expect(result).toEqual(true);
  });

  it("getItemsSorted", () => {
    const
      list = Immutable.List(["1", "2", "3"]),
      state = {
        list: {
          list,
        },
      },
      result = getItemsSorted(state);

    expect(result).toEqual(list);
  });

  it("getItem", () => {
    const
      second = Immutable.Map({
        "_id": "2",
      }),
      data = Immutable.Map({
        "1": Immutable.Map({
          "_id": "1",
        }),
        "2": second,
      }),
      state = {
        list: {
          data,
        },
      },
      result = getItem(state, "2");

    expect(result).toEqual(second);
  });

  it("getSelectedItemPosition", () => {
    const
      list = Immutable.List(["yu", "ny", "13", "a4"]),
      state = {
        list: {
          itemSelected: "ny",
          list,
        },
      },
      result = getSelectedItemPosition(state),
      position = 1;

    expect(result).toEqual(position);
  });
});
