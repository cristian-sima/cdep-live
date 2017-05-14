// @flow

import type { Action, CompanyDelegatesState, State } from "types";

import { COMPANY_RESET_DATA } from "actions";

import { createSelector } from "reselect";
import * as Immutable from "immutable";

import { noError } from "utility";

import { getCompanyIsFetched } from "./info";

const newInitialState = () : CompanyDelegatesState => ({
  fetched  : false,
  fetching : false,
  error    : noError,

  data: Immutable.Map(),
});

const
  fetchDelegatesPending = (state : CompanyDelegatesState) => ({
    ...state,
    fetching : true,
    error    : noError,
  }),
  fetchDelegatesRejected = (state : CompanyDelegatesState, { payload : { error } }) => ({
    ...state,
    fetching: false,
    error,
  }),
  fetchDelegatesFulfilled = (state : CompanyDelegatesState, { payload }) => ({
    ...state,
    fetched  : true,
    fetching : false,

    data: payload.entities,
  }),
  setDelegate = (state : CompanyDelegatesState, { payload }) => ({
    ...state,
    data: state.data.set(String(payload.get("ID")), payload),
  }),
  deleteDelegate = (state : CompanyDelegatesState, { payload }) => ({
    ...state,
    data: state.data.delete(String(payload)),
  });

const reducer = (state : CompanyDelegatesState = newInitialState(), action : Action) => {

  switch (action.type) {
    case "COMPANY_FETCH_DELEGATES_PENDING":
      return fetchDelegatesPending(state);

    case "COMPANY_FETCH_DELEGATES_REJECTED":
      return fetchDelegatesRejected(state, action);

    case "COMPANY_FETCH_DELEGATES_FULFILLED":
      return fetchDelegatesFulfilled(state, action);

    case "COMPANY_ADD_DELEGATE":
    case "COMPANY_MODIFY_DELEGATE":
      return setDelegate(state, action);

    case "COMPANY_DELETE_DELEGATE":
      return deleteDelegate(state, action);

    case COMPANY_RESET_DATA:
      return newInitialState();

    default:
      return state;
  }
};

const
  getFetching = (state : State) => state.companyDelegates.fetching,
  getFetched = (state : State) => state.companyDelegates.fetched,
  getError = (state : State) => state.companyDelegates.error,
  getData = (state : State) => state.companyDelegates.data;

export const
  getDelegates = createSelector(
    getData,
    (ids) => ids.toList()
  ),
  getDelegate = (state : State, id : string) => (
    getData(state).get(id)
  );

export const getDelegatesAreFetched = createSelector(
  getFetching,
  getFetched,
  getError,
  (isFetching, isFetched, error) => (
    !isFetching && isFetched && error === noError
  )
);

export const getDelegatesAreFetching = createSelector(
  getFetching,
  getError,
  (isFetching, error) => (
    isFetching && error === noError
  )
);

export const getDelegatesHaveError = createSelector(
  getError,
  (error) => error !== noError
);

export const getDelegatesShouldFetch = createSelector(
  getCompanyIsFetched,
  getDelegatesAreFetched,
  getDelegatesAreFetching,
  (isFetchedCompanyInfo, isFetched, isFetching) => (
    isFetchedCompanyInfo && !isFetched && !isFetching
  )
);

export const getDelegatesSorted = createSelector(
  getDelegates,
  (list) => list.sortBy(
    (delegate) => delegate.get("FullName")
  )
);

export default reducer;
