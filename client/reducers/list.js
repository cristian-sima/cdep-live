// @flow

import type { State, ListState } from "types";

import * as Immutable from "immutable";
import { createSelector } from "reselect";

import { normalizeArray } from "utility";

const newInitialState = () => ({
  isUpdating   : false,
  itemSelected : null,

  itemToggled  : null,
  isPublicVote : false,

  data: Immutable.Map(),
});

const
  updateList = (state : ListState, { payload : { list, itemSelected } }) => ({
    ...state,
    isUpdating : false,
    itemSelected,
    data       : normalizeArray(list).entities,
  }),
  updatingList = (state : ListState) => ({
    ...state,
    isUpdating: true,
  }),
  selectItem = (state : ListState, { payload }) => ({
    ...state,
    itemSelected: payload,
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
  getData = (state : State) => state.list.data;

export const
  getIsUpdatingLive = (state : State) => state.list.isUpdating,
  getSelectedItem = (state : State) => state.list.itemSelected,
  getToggledItem = (state : State) => state.list.itemToggled,
  getIsPublicVote = (state : State) => state.list.isPublicVote;

export const
  getItemsSorted = createSelector(
    getData,
    (map) => map.toList().sortBy(
      (item) => item.get("position")
    )
  ),
  getSelectedItemPosition = createSelector(
    getItemsSorted,
    getSelectedItem,
    (list, itemSelected) => list.findIndex((item) => item.get("_id") === itemSelected)
  );

export default reducer;
