// @flow

import type { State, ListState } from "types";

import * as Immutable from "immutable";
import { createSelector } from "reselect";

import {
  normalizeArray,
  processPublicVote,
  optiuneNecunoscuta,
  getSortedItemList,
} from "utility";

const newInitialState = () => ({
  isUpdating   : false,
  itemSelected : null,

  itemToggled  : null,
  isPublicVote : false,

  data : Immutable.Map(),
  list : Immutable.List(),
});

const
  updateList = (state : ListState, { payload : { list, itemSelected } }) => {
    const data = normalizeArray(list).entities;

    return {
      ...state,
      isUpdating: false,
      itemSelected,

      data,
      list: getSortedItemList(data),
    };
  },
  updatingList = (state : ListState) => ({
    ...state,
    isUpdating: true,
  }),
  selectItem = (state : ListState, { payload }) => ({
    ...state,
    itemSelected: payload,
  }),
  voteItem = (state : ListState, { payload : { group, isPublicVote, id, optiune } }) => ({
    ...state,
    data: state.data.update(String(id), (item) => {
      if (typeof item === "undefined") {
        return item;
      }

      return item.merge({
        [group]    : optiune,
        publicVote : processPublicVote({
          publicVote   : item.get("publicVote"),
          group,
          isPublicVote : optiune === optiuneNecunoscuta ? false : isPublicVote,
        }),
      });
    }),
  }),
  toggledItem = (state : ListState, { payload }) => ({
    ...state,
    isPublicVote : false,
    itemToggled  : state.itemToggled === payload ? null : payload,
  }),
  togglePublicVote = (state : ListState) => ({
    ...state,
    isPublicVote: !state.isPublicVote,
  });

const reducer = (state : ListState = newInitialState(), action : any) => {
  switch (action.type) {
    case "UPDATE_LIST":
      return updateList(state, action);

    case "UPDATING_LIST":
      return updatingList(state, action);

    case "SELECT_ITEM":
      return selectItem(state, action);

    case "VOTE_ITEM":
      return voteItem(state, action);

    case "TOGGLE_ITEM":
      return toggledItem(state, action);

    case "TOGGLE_PUBLIC_VOTE":
      return togglePublicVote(state);

    case "SIGN_OFF_FULFILLED":
      return newInitialState();

    default:
      return state;
  }
};

const
  getList = (state : State) => state.list.list;

export const
  getIsUpdatingLive = (state : State) => state.list.isUpdating,
  getSelectedItem = (state : State) => state.list.itemSelected,
  getToggledItem = (state : State) => state.list.itemToggled,
  getIsPublicVote = (state : State) => state.list.isPublicVote,
  getItemsSorted = (state : State) => state.list.list;

export const
  getItem = (state : State, id : string) => state.list.data.get(id),
  getSelectedItemPosition = createSelector(
    getList,
    getSelectedItem,
    (list, itemSelected : string) => list.findIndex((item : string) => item === itemSelected)
  );

export default reducer;
