// @flow

import type { State, ListState } from "types";

import * as Immutable from "immutable";
import { createSelector } from "reselect";

import { normalizeArray } from "utility";

const newInitialState = () => ({
  isUpdating: false,

  data: Immutable.Map(),
});

const
  updateList = (state : ListState, { payload }) => ({
    ...state,
    isUpdating : false,
    data       : normalizeArray(payload).entities,
  }),
  updatingList = (state : ListState) => ({
    ...state,
    isUpdating: true,
  });


const reducer = (state : ListState = newInitialState(), action : any) => {
  switch (action.type) {
    case "UPDATE_LIST":
      return updateList(state, action);

    case "UPDATING_LIST":
      return updatingList(state, action);

    case "SIGN_OFF_FULFILLED":
      return newInitialState();

    default:
      return state;
  }
};

const
  getData = (state : State) => state.list.data;

export const getIsUpdatingLive = (state : State) => state.list.isUpdating;

export const
  getItemsSorted = createSelector(
    getData,
    (map) => map.toList().sortBy(
      (item) => item.get("position")
    )
  );

export default reducer;
