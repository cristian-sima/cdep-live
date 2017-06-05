/* eslint-disable no-undefined, no-magic-numbers */

import reducer from "./modal";

import * as Immutable from "immutable";

import { hideModal } from "actions";

describe("account/modal reducer", () => {

  it("returns the initial state", () => {
    const result = reducer(undefined, { type: "" });

    expect(result).toEqual(Immutable.Stack());
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

    expect(result).toEqual(Immutable.Stack([{
      type  : "ADD_ARTICLE",
      props : {
        ID: 1,
      },
    }]));
  });

  it("handles HIDE_MODAL", () => {
    const
      initialState = Immutable.Stack([{
        type  : "ADD_ARTICLE",
        props : {
          ID: 1,
        },
      }, {
        type  : "LIST_ARTICLES",
        props : {},
      }]),
      result = reducer(initialState, hideModal());

    expect(result).toEqual(Immutable.Stack([{
      type  : "LIST_ARTICLES",
      props : {},
    }]));
  });

  it("handles SELECT_ITEM", () => {
    const
      initialState = Immutable.Stack([{
        type  : "ADD_ARTICLE",
        props : {
          ID: 1,
        },
      }, {
        type  : "LIST_ARTICLES",
        props : {},
      }]),
      result = reducer(initialState, {
        type: "SELECT_ITEM",
      });

    expect(result).toEqual(Immutable.Stack([]));
  });
});
