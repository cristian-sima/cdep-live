/* eslint-disable max-lines, no-undefined */

import reducer, {
  getIsUpdatingLive,
  getSelectedItem,
  getToggledItem,
  getIsPublicVote,
  getItemsSorted,
  getItem,
  getSelectedItemPosition,
  getIsUpdatingComment,
  getTemporaryComment,
  getIsPreparing,
  getNextID,
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

      temporaryComment  : "",
      isUpdatingComment : false,

      isPreparing: false,

      itemToggled  : null,
      isPublicVote : false,

      data : Immutable.Map(),
      list : Immutable.List(),
    });
  });

  it("handles UPDATE_LIST", () => {
    const
      list = [
          {
            "_id"      : "33",
            "position" : "3",
          },
          {
            "_id"      : "22",
            "position" : "2",
          },
          {
            "_id"      : "11",
            "position" : "1",
          },
        ],
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
      isUpdating  : false,
      isPreparing : false,
      itemSelected,

      data : normalizeArray(list).entities,
      list : Immutable.List([
        "11",
        "22",
        "33",
      ]),
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

  describe("it handles EXPRESS_SUGGESTION", () => {
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
            type    : "EXPRESS_SUGGESTION",
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
            type    : "EXPRESS_SUGGESTION",
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

  it("handles UPDATING_COMMENT", () => {
    const
      initialState = {
          isUpdatingComment: false,
        },
      result = reducer(initialState, {
        type: "UPDATING_COMMENT",
      });

    expect(result).toEqual({
      isUpdatingComment: true,
    });
  });

  it("handles UPDATE_TEMPORARY_COMMENT", () => {
    const
      temporaryComment = "new comment",
      initialState = {
        temporaryComment: "",
      },
      result = reducer(initialState, {
        type    : "UPDATE_TEMPORARY_COMMENT",
        payload : temporaryComment,
      });

    expect(result).toEqual({
      temporaryComment,
    });
  });

  it("handles UPDATE_COMMENT", () => {
    const
      comment = "new comment",
      id = "1",
      initialState = {
        isUpdatingComment : true,
        temporaryComment  : "new comment",
        data              : Immutable.Map({
          "1": Immutable.Map({
            "_id": id,
          }),
        }),
      },
      result = reducer(initialState, {
        type    : "UPDATE_COMMENT",
        payload : {
          comment,
          id,
        },
      });

    expect(result).toEqual({
      isUpdatingComment : false,
      temporaryComment  : "",

      data: Immutable.Map({
        "1": Immutable.Map({
          "_id": id,
          comment,
        }),
      }),
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
      list = Immutable.List([
          "1",
          "2",
          "3",
        ]),
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
      list = Immutable.List([
          "yu",
          "ny",
          "13",
          "a4",
        ]),
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

  it("getIsUpdatingComment", () => {
    const
      state = {
          list: {
            isUpdatingComment: true,
          },
        },
      result = getIsUpdatingComment(state);

    expect(result).toEqual(true);
  });

  it("getTemporaryComment", () => {
    const
      temporaryComment = "c",
      state = {
        list: {
          temporaryComment,
        },
      },
      result = getTemporaryComment(state);

    expect(result).toEqual(temporaryComment);
  });

  it("getIsPreparing", () => {
    const
      state = {
          list: {
            isPreparing: true,
          },
        },
      result = getIsPreparing(state);

    expect(result).toEqual(true);
  });

  describe("getNextID", () => {
    describe("given there is no more items", () => {
      it("returns null", () => {
        const
          state = {
              list: {
                itemSelected: "3",

                list: Immutable.List([
                  "1",
                  "2",
                  "3",
                ]),
              },
            },
          result = getNextID(state);

        expect(result).toEqual(null);
      });
    });
    describe("given there is a next element", () => {
      it("returns the id", () => {
        const
          state = {
              list: {
                itemSelected: "2",

                list: Immutable.List([
                  "1",
                  "2",
                  "3",
                ]),
              },
            },
          result = getNextID(state);

        expect(result).toEqual("3");
      });
    });
  });
});
