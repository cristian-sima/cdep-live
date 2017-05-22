// @flow

import type { State, UsersState } from "types";

// import * as Immutable from "immutable";
import { noError } from "utility";
import { createSelector } from "reselect";

const initialState = {
  isUpdating  : false,
  errorUpdate : noError,
};

const
  updateUsersPending = (state : UsersState) => ({
    ...state,
    errorUpdate : noError,
    isUpdating  : true,
  }),
  updateUsersRejected = (state : UsersState, action) => ({
    ...state,
    errorUpdate : "Problem",
    isUpdating  : false,
  });

const reducer = (state : UsersState = initialState, action : any) => {
  switch (action.type) {
    case "UPDATE_USERS_PENDING":
      return updateUsersPending(state);

    case "UPDATE_USERS_REJECTED":
      return updateUsersRejected(state);

    default:
      return state;
  }
};

const
  updatingUserListSelector = (state : State) : bool => (
    state.users.isUpdating || false
  ),
  errorUpdateUserListSelector = (state : State) : string => (
    state.users.errorUpdate || noError
  );

export const getErrorUpdateUsers = createSelector(
  errorUpdateUserListSelector,
  (errorLoading) => (errorLoading !== noError)
);

export const getIsUpdatingUserList = createSelector(
  updatingUserListSelector,
  (isUpdating) => isUpdating
);

export default reducer;
