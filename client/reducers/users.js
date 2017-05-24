// @flow

import type { State, UsersState } from "types";

import * as Immutable from "immutable";
import { noError } from "utility";
import { createSelector } from "reselect";

const initialState = {
  fetched  : false,
  fetching : false,
  error    : noError,

  isUpdating  : false,
  errorUpdate : noError,

  data: Immutable.Map(),
};

const
  updateUsersPending = (state : UsersState) => ({
    ...state,
    errorUpdate : noError,
    isUpdating  : true,
    data        : Immutable.Map(),
  }),
  updateUsersRejected = (state : UsersState) => ({
    ...state,
    errorUpdate : "Problem",
    isUpdating  : false,
  }),
  updateUsersFulFilled = (state : UsersState, { payload }) => ({
    ...state,

    isUpdating : false,
    data       : payload.entities,

    fetched  : true,
    fetching : false,
  }),
  fetchUsersPending = (state : UsersState) => ({
    ...state,
    fetching : true,
    error    : noError,
  }),
  fetchUsersRejected = (state : UsersState, { payload : { error } }) => ({
    ...state,
    fetching: false,
    error,
  }),
  fetchUsersFulfilled = (state : UsersState, { payload }) => ({
    ...state,
    fetched  : true,
    fetching : false,

    data: payload.entities,
  });

const reducer = (state : UsersState = initialState, action : any) => {
  switch (action.type) {
    case "UPDATE_USERS_PENDING":
      return updateUsersPending(state);

    case "UPDATE_USERS_REJECTED":
      return updateUsersRejected(state);

    case "UPDATE_USERS_FULFILLED":
      return updateUsersFulFilled(state, action);

    case "FETCH_USERS_PENDING":
      return fetchUsersPending(state);

    case "FETCH_USERS_REJECTED":
      return fetchUsersRejected(state, action);

    case "FETCH_USERS_FULFILLED":
      return fetchUsersFulfilled(state, action);

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

export const
  getFetching = (state : State) => state.users.fetching,
  getFetched = (state : State) => state.users.fetched,
  getError = (state : State) => state.users.errorFetching,
  getData = (state : State) => state.users.data;

export const getErrorUpdateUsers = createSelector(
  errorUpdateUserListSelector,
  (errorLoading) => (errorLoading !== noError)
);

export const getIsUpdatingUserList = createSelector(
  updatingUserListSelector,
  (isUpdating) => isUpdating
);

export const
  getUsers = createSelector(
    getData,
    (data) => data.toList()
  ),
  getUser = (state : State, id : string) => (
    getData(state).get(id)
  );

export const getUsersAreFetched = createSelector(
  getFetching,
  getFetched,
  getError,
  (isFetching, isFetched, error) => (
    !isFetching && isFetched && error === noError
  )
);

export const getUsersAreFetching = createSelector(
  getFetching,
  getError,
  (isFetching, error) => (
    isFetching && error === noError
  )
);

export const getUsersHasError = createSelector(
  getError,
  (error) => error !== noError
);

export const getUsersShouldFetch = createSelector(
  getUsersAreFetched,
  getUsersAreFetching,
  (isFetched, isFetching) => (
    !isFetched && !isFetching
  )
);

export default reducer;
