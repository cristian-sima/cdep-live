// @flow

import * as Immutable from "immutable";
import type { Action, CompanyInfoState, State } from "types";

import { createSelector } from "reselect";

import { noError } from "utility/others";

const newInitialState = () => ({
  error    : noError,
  fetched  : false,
  fetching : false,

  company: Immutable.Map(),

  toggleModuleIsFetching : false,
  toggleModuleError      : noError,
});

const
  fetchCompanyPending = () => ({
    ...newInitialState(),
    fetching: true,
  }),
  fetchCompanyRejected = (state : CompanyInfoState, { payload : { error } }) => ({
    ...state,
    error,
    fetching: false,
  }),
  fetchCompanyFulfilled = (state : CompanyInfoState, { payload }) => ({
    ...state,
    fetched  : true,
    fetching : false,

    company: payload,
  }),
  modifyCompany = (state : CompanyInfoState, { payload }) => ({
    ...state,
    company: payload,
  }),
  toggleToggleModulePending = (state : CompanyInfoState) => ({
    ...state,
    toggleModuleIsFetching : true,
    toggleModuleError      : noError,
  }),
  toggleModuleRejected = (state : CompanyInfoState, { payload : { error } }) => ({
    ...state,
    toggleModuleIsFetching : false,
    toggleModuleError      : error,
  }),
  toggleModuleFulfilled = (state : CompanyInfoState, { payload : { Modules } }) => ({
    ...state,
    toggleModuleIsFetching : false,
    toggleModuleError      : noError,

    company: state.company.set("Modules", Modules),
  }),
  clearInfoIfCurrentCompany = (state : CompanyInfoState, { payload }) => {
    const { company, fetched } = state;

    const
      dataID = String(payload.get("ID")),
      companyID = String(company.get("ID")),
      theCurrentCompanyHasChanged = fetched && (dataID === companyID);

    if (theCurrentCompanyHasChanged) {
      return newInitialState();
    }

    return state;
  };

const reducer = (state : CompanyInfoState = newInitialState(), action : Action) => {
  switch (action.type) {
    case "FETCH_CURRENT_COMPANY_INFO_PENDING":
      return fetchCompanyPending();

    case "FETCH_CURRENT_COMPANY_INFO_REJECTED":
      return fetchCompanyRejected(state, action);

    case "FETCH_CURRENT_COMPANY_INFO_FULFILLED":
      return fetchCompanyFulfilled(state, action);

    case "COMPANY_TOGGLE_MODULE_PENDING":
      return toggleToggleModulePending(state, action);

    case "COMPANY_TOGGLE_MODULE_REJECTED":
      return toggleModuleRejected(state, action);

    case "COMPANY_TOGGLE_MODULE_FULFILLED":
      return toggleModuleFulfilled(state, action);

    case "MODIFY_CURRENT_COMPANY_INFO":
      return modifyCompany(state, action);

    case "TOGGLE_COMPANY_STATE":
    case "DELETE_COMPANY":
      return clearInfoIfCurrentCompany(state, action);

    default:
      return state;
  }
};

const
  getFetching = (state : State) => state.companyInfo.fetching,
  getFetched = (state : State) => state.companyInfo.fetched,
  getError = (state : State) => state.companyInfo.error,
  getToggleModuleError = (state : State) => state.companyInfo.toggleModuleError,
  getCurrentAccountFetched = (state : State) => state.account.fetched;

const checkForNoErrors = (error) => error !== noError;

export const
  getCurrentCompany = (state : State) => state.companyInfo.company,
  getCompanyToggleModuleIsFetching = (state : State) => state.companyInfo.toggleModuleIsFetching;

export const getCompanyIsFetched = createSelector(
  getFetching,
  getFetched,
  getError,
  (isFetching, isFetched, error) => (
    !isFetching && isFetched && error === noError
  )
);

export const getCompanyIsFetching = createSelector(
  getFetching,
  getError,
  (isFetching, error) => (
    isFetching && error === noError
  )
);

export const getCompanyHasFetchingError = createSelector(
  getError,
  checkForNoErrors,
);

export const getCompanyID = createSelector(
  getCurrentCompany,
  (company) => company.get("ID")
);

export const getCompanyModules = createSelector(
  getCurrentCompany,
  (company) => company.get("Modules") || ""
);

export const getCompanyHasToggleModuleError = createSelector(
  getToggleModuleError,
  checkForNoErrors,
);

export const getCompanyShouldFetch = createSelector(
  getCurrentAccountFetched,
  getCompanyIsFetched,
  getCompanyHasFetchingError,
  getFetching,
  getCurrentCompany,
  (accountFetched, isFetched, hasError, isFetching, company) => (rawID : string) => {
    const
      hasIDChanged = () => {
        const
          id = company.get("ID"),
          newID = Number(rawID);

        return (
          id === 0 ||
          id !== newID ||
          (id === newID && !isFetched)
        );
      };

    return (
      accountFetched && !hasError && !isFetching && hasIDChanged()
    );
  }
);

export default reducer;
