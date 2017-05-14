// @flow

import type { Action, InvoiceAllState, State } from "types";

type SimpleSelector = (state : State, invoiceID : string) => any

import { COMPANY_RESET_DATA } from "actions";

import { createSelector } from "reselect";
import * as Immutable from "immutable";

import { getCompanyIsFetched } from "../info";

import { noError, nothingFetched, rowsPerLoad } from "utility";

const newInitialState = () : InvoiceAllState => ({
  IDs      : Immutable.List(),
  error    : noError,
  fetched  : false,
  fetching : false,

  lastFetchedInvoiceNumber : nothingFetched,
  total                    : nothingFetched,
});

const
  fetchInvoicesPending = (state : InvoiceAllState) => ({
    ...state,
    error    : noError,
    fetching : true,
  }),
  fetchInvoicesRejected = (state : InvoiceAllState, { payload : { error } }) => ({
    ...state,
    error,
    fetching: false,
  }),
  fetchInvoicesFulfilled = (state : InvoiceAllState, { payload }) => ({
    ...state,
    error                    : noError,
    fetched                  : true,
    lastFetchedInvoiceNumber : payload.LastFetchedInvoiceNumber,
    fetching                 : false,
    total                    : payload.Total,

    IDs: state.IDs.concat(payload.Invoices.result),
  }),
  addInvoice = (state : InvoiceAllState, { payload : { invoice } }) => {
    const { lastFetchedInvoiceNumber, total } = state;

    if (lastFetchedInvoiceNumber === nothingFetched) {
      return state;
    }

    const invoiceID = String(invoice.get("ID"));

    return {
      ...state,
      IDs                      : state.IDs.push(invoiceID),
      lastFetchedInvoiceNumber : lastFetchedInvoiceNumber + 1,
      total                    : total + 1,
    };
  },
  deleteInvoice = (state : InvoiceAllState, { payload : { invoice } }) => {
    const { lastFetchedInvoiceNumber, total } = state;

    const getLastFetchedPage = () => {
        if (lastFetchedInvoiceNumber === nothingFetched) {
          return nothingFetched;
        }

        return lastFetchedInvoiceNumber - 1;
      },
      getTotal = () => {
        if (total === nothingFetched) {
          return nothingFetched;
        }

        return total - 1;
      },
      invoiceID = String(invoice.get("ID"));

    return {
      ...state,
      IDs: state.IDs.delete(
        state.IDs.indexOf(invoiceID)
      ),
      lastFetchedInvoiceNumber : getLastFetchedPage(),
      total                    : getTotal(),
    };
  };

export const allInvoices = (state : InvoiceAllState = newInitialState(), action : Action) => {

  switch (action.type) {
    case "COMPANY_FETCH_INVOICES_PENDING":
      return fetchInvoicesPending(state, action);

    case "COMPANY_FETCH_INVOICES_REJECTED":
      return fetchInvoicesRejected(state, action);

    case "COMPANY_FETCH_INVOICES_FULFILLED":
      return fetchInvoicesFulfilled(state, action);

    case "COMPANY_ADD_INVOICE":
      return addInvoice(state, action);

    case "COMPANY_DELETE_INVOICE":
      return deleteInvoice(state, action);

    case COMPANY_RESET_DATA: {
      return newInitialState();
    }
    default:
      return state;
  }
};

const
  fetchingSelector = (state : State) => state.companyInvoices.all.fetching,
  errorSelector = (state : State) => state.companyInvoices.all.error,
  IDsListSelector = (state : State) => state.companyInvoices.all.IDs,
  byIDsMapSelector = (state : State) => state.companyInvoices.byID;

export const
  getTotalInvoiceSelector = (state : State) => state.companyInvoices.all.total,
  lastFetchedInvoiceNumberSelector = (state : State) => (
    state.companyInvoices.all.lastFetchedInvoiceNumber
  );

export const getInvoice = (state : State, id : string) => (
  byIDsMapSelector(state).get(id)
);

const getInvoices = createSelector(
  IDsListSelector,
  byIDsMapSelector,
  (list, byIDMap) => (
    list.map((id : number) => byIDMap.get(id))
  )
);

export const getIsFetchingInvoices = createSelector(
  fetchingSelector,
  errorSelector,
  (isFetching, error) => (
    isFetching && error === noError
  )
);

export const getShouldFetchInvoices = createSelector(
  getCompanyIsFetched,
  getIsFetchingInvoices,
  lastFetchedInvoiceNumberSelector,
  getTotalInvoiceSelector,
  (state, from: number) => from,
  (infoFetched, isFetching, lastFetchedInvoiceNumber, total, from) => (
    infoFetched && !isFetching &&
    (from + rowsPerLoad - 1 > lastFetchedInvoiceNumber) &&
    (
      (total === nothingFetched) ||
      (total > from)
    )
  )
);

export const getIsFetchingInvoicesError = createSelector(
  errorSelector,
  (error) => error !== noError
);

export const getCanLoadInvoicesLocally = createSelector(
  lastFetchedInvoiceNumberSelector,
  (state, from) => from,
  (lastFetchedInvoiceNumber, from) => (
    from + rowsPerLoad <= lastFetchedInvoiceNumber
  )
);

export const getSortedInvoices = createSelector(
  getInvoices,
  (list) => (
    list.sortBy((invoice) => -invoice.get("ID"))
  )
);

export const getInvoicesUpToSelector = createSelector(
  getSortedInvoices,
  (state, requestedUpTo : number) => requestedUpTo,
  (sortedInvoices, requestedUpTo: number) => (
    sortedInvoices.slice(0, requestedUpTo)
  )
);

export const getIsFetchingInvoiceDetailsError : SimpleSelector = createSelector(
  byIDsMapSelector,
  (state, id : string) => id,
  (byIDsMap, invoiceID) => {
    const ok = byIDsMap.has(invoiceID);

    if (!ok) {
      return false;
    }

    const invoice = byIDsMap.get(invoiceID),
      error = invoice.get("FetchDetailsError");

    return typeof error !== "undefined" && error !== noError;
  }
);

export const getIsFetchingInvoiceDetails : SimpleSelector = createSelector(
  byIDsMapSelector,
  (state, invoiceID : string) => invoiceID,
  (byIDsMap, invoiceID) => {

    const ok = byIDsMap.has(invoiceID);

    if (!ok) {
      return true;
    }

    const invoice = byIDsMap.get(invoiceID);

    return invoice.get("IsFetching") === true;
  }
);

export const getShouldFetchInvoiceDetails : SimpleSelector = createSelector(
  byIDsMapSelector,
  getCompanyIsFetched,
  (state, invoiceID : string) => invoiceID,
  (byIDsMap, hasFetchedCompanyInfo, invoiceID) => {

    if (!hasFetchedCompanyInfo) {
      return false;
    }

    const hasInvoice = byIDsMap.has(invoiceID);

    if (!hasInvoice) {
      return true;
    }

    const invoice = byIDsMap.get(invoiceID);

    return (
      !invoice.get("IsFetching") &&
      !invoice.get("AreDetailsFetched")
    );
  }
);

export const getAreFetchedInvoiceDetails : SimpleSelector = createSelector(
  byIDsMapSelector,
  getCompanyIsFetched,
  (state, invoiceID : string) => invoiceID,
  (byIDsMap, hasFetchedCompanyInfo, invoiceID) => {

    if (!hasFetchedCompanyInfo) {
      return false;
    }

    const hasInvoice = byIDsMap.has(invoiceID);

    if (!hasInvoice) {
      return false;
    }

    const invoice = byIDsMap.get(invoiceID);

    return (
      invoice.get("AreDetailsFetched")
    );
  }
);

export const shouldFetchAllInvoicesFrom = createSelector(
 getCanLoadInvoicesLocally,
 getShouldFetchInvoices,
 (canLoadLocally, shouldFetch) => (
   !canLoadLocally && shouldFetch
 )
);
