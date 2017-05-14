// @flow

import type { State, Action, CompanyPermissionsState } from "types";

import { COMPANY_RESET_DATA } from "actions";

import * as Immutable from "immutable";
import { createSelector } from "reselect";

import { noError } from "utility";

import { getCompanyIsFetched } from "./info";

const getInitialState = () => ({
  fetched  : false,
  fetching : false,
  error    : noError,

  data: Immutable.Map(),
});

const
  fetchPermissionsPending = (state : CompanyPermissionsState) => ({
    ...state,
    fetching : true,
    error    : noError,
  }),
  fetchPermissionsRejected = (state : CompanyPermissionsState, { payload : { error } }) => ({
    ...state,
    fetching: false,
    error,
  }),
  fetchPermissionsFulfilled = (state : CompanyPermissionsState, { payload }) => ({
    ...state,
    fetched  : true,
    fetching : false,

    data: payload.entities,
  }),
  addPermission = (state : CompanyPermissionsState, { payload }) => ({
    ...state,
    data: state.data.set(String(payload.get("ID")), payload),
  }),
  deletePermission = (state : CompanyPermissionsState, { payload }) => ({
    ...state,
    data: state.data.delete(String(payload)),
  });

const reducer = (state : CompanyPermissionsState = getInitialState(), action : Action) => {
  switch (action.type) {
    case "COMPANY_FETCH_PERMISSIONS_PENDING":
      return fetchPermissionsPending(state);

    case "COMPANY_FETCH_PERMISSIONS_REJECTED":
      return fetchPermissionsRejected(state, action);

    case "COMPANY_FETCH_PERMISSIONS_FULFILLED":
      return fetchPermissionsFulfilled(state, action);

    case "COMPANY_ADD_PERMISSION":
      return addPermission(state, action);

    case "COMPANY_DELETE_PERMISSION":
      return deletePermission(state, action);

    case COMPANY_RESET_DATA:
      return getInitialState();

    default:
      return state;
  }
};


const
  getFetching = (state : State) => state.companyPermissions.fetching,
  getFetched = (state : State) => state.companyPermissions.fetched,
  getError = (state : State) => state.companyPermissions.error,
  getData = (state : State) => state.companyPermissions.data;

export const
  getPermissions = createSelector(
    getData,
    (data) => data.toList()
  ),
  getPermission = (state : State, id : string) => (
    getData(state).get(id)
  );

export const getPermissionsAreFetched = createSelector(
  getFetching,
  getFetched,
  getError,
  (isFetching, isFetched, error) => (
    !isFetching && isFetched && error === noError
  )
);

export const getPermissionsAreFetching = createSelector(
  getFetching,
  getError,
  (isFetching, error) => (
    isFetching && error === noError
  )
);

export const getPermissionsHasError = createSelector(
  getError,
  (error) => error !== noError
);

export const getPermissionsShouldFetch = createSelector(
  getCompanyIsFetched,
  getPermissionsAreFetched,
  getPermissionsAreFetching,
  (infoFetched, isFetched, isFetching) => (
    infoFetched && !isFetched && !isFetching
  )
);

export default reducer;
