/* eslint-disable no-undefined, no-magic-numbers */

import reducer from "./modal";

import * as Immutable from "immutable";

import { hideModal } from "actions";

describe("account/modal reducer", () => {

  it("returns the initial state", () => {
    const result = reducer(undefined, { type: "" });

    expect(result).toEqual(Immutable.List());
  });

  it("handles SHOW_MODAL", () => {
    const result = reducer(undefined, {
      type    : "SHOW_MODAL",
      payload : {
        modalType  : "ADD_ARTICLE",
        modalProps : {
          ID: 1,
        },
      },
    });

    expect(result).toEqual(Immutable.List([
      {
        type  : "ADD_ARTICLE",
        props : {
          ID: 1,
        },
      },
    ]));
  });

  it("handles HIDE_MODAL", () => {
    const
      initialState = Immutable.List([
        {
          type  : "LIST_ARTICLES",
          props : {},
        },
        {
          type  : "ADD_ARTICLE",
          props : {
            ID: 1,
          },
        },
      ]),
      result = reducer(initialState, hideModal());

    expect(result).toEqual(Immutable.List([
      {
        type  : "LIST_ARTICLES",
        props : {},
      },
    ]));
  });

  it("handles SELECT_ITEM", () => {
    const
      initialState = Immutable.List([
        {
          type  : "ADD_ARTICLE",
          props : {
            ID: 1,
          },
        },
        {
          type  : "COMMENT_BOX",
          props : {},
        },
      ]),
      result = reducer(initialState, {
        type: "SELECT_ITEM",
      });

    expect(result).toEqual(Immutable.List([
      {
        type  : "COMMENT_BOX",
        props : {},
      },
    ]));
  });

  it("handles UPDATING_LIST", () => {
    const
      initialState = Immutable.List([
        {
          type  : "ADD_ARTICLE",
          props : {
            ID: 1,
          },
        },
        {
          type  : "LIST_ARTICLES",
          props : {},
        },
      ]),
      result = reducer(initialState, {
        type: "UPDATING_LIST",
      });

    expect(result).toEqual(Immutable.List([]));
  });
});
