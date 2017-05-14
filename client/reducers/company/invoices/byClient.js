// @flow

import type { Action, InvoicesByClientState, State } from "types";

import { COMPANY_RESET_DATA } from "actions";

import { createSelector } from "reselect";
import * as Immutable from "immutable";

import { getCompanyIsFetched } from "../info";

import { noError, nothingFetched, rowsPerLoad } from "utility";

const
  fetchInvoicesByClientPending = (state : InvoicesByClientState, { meta }) => {
    const clientID = (meta) ? String(meta.clientID) : "",
      setFetching = {
        error    : noError,
        fetching : true,
      };

    if (state.has(clientID)) {
      return (
        state.update(clientID, (clientState) => clientState.merge(setFetching))
      );
    }

    return state.set(clientID, Immutable.Map({
      ...setFetching,
      IDs                      : Immutable.List(),
      lastFetchedInvoiceNumber : nothingFetched,
      total                    : nothingFetched,
    }));
  },
  fetchInvoicesByClientRejected = (state : InvoicesByClientState, { payload, meta }) => {
    const
      error = { payload },
      clientID = (meta) ? String(meta.clientID) : "",
      setError = {
        error,
        fetching : false,
        fetched  : false,
      };

    return state.update(clientID, (clientState) => (
      clientState.merge(setError)
    ));
  },
  fetchInvoicesByClientFulfilled = (state : InvoicesByClientState, { meta, payload }) => {
    const clientID = (meta) ? String(meta.clientID) : "",
      newIDs = payload.Invoices.result,
      oldState = state.get(clientID),
      setError = {
        error                    : noError,
        fetched                  : true,
        fetching                 : false,
        IDs                      : oldState.get("IDs").concat(newIDs),
        lastFetchedInvoiceNumber : payload.LastFetchedInvoiceNumber,
        total                    : payload.Total,
      };

    return state.update(clientID, (clientState) => (
      clientState.merge(setError)
    ));
  },
  deleteClient = (state : InvoicesByClientState, { payload }) => (
    state.delete(String(payload))
  ),
  addInvoice = (state : InvoicesByClientState, { payload : { invoice } }) => {
    const
      clientID = String(invoice.get("ClientID")),
      clientState = state.get(clientID);

    if (typeof clientState === "undefined") {
      return state;
    }

    const lastFetchedInvoiceNumber = clientState.get("lastFetchedInvoiceNumber"),
      total = clientState.get("total");

    if (lastFetchedInvoiceNumber === nothingFetched) {
      return state;
    }

    const invoiceID = String(invoice.get("ID"));

    return state.update(clientID, (currentState) => (
      currentState.merge({
        IDs                      : currentState.get("IDs").push(invoiceID),
        lastFetchedInvoiceNumber : lastFetchedInvoiceNumber + 1,
        total                    : total + 1,
      })
    ));
  },
  deleteInvoice = (state : InvoicesByClientState, { payload : { invoice } }) => {
    const
      clientID = String(invoice.get("ClientID")),
      clientState = state.get(clientID);

    if (typeof clientState === "undefined") {
      return state;
    }

    const lastFetchedInvoiceNumber = clientState.get("lastFetchedInvoiceNumber"),
      total = clientState.get("total");

    if (lastFetchedInvoiceNumber === nothingFetched) {
      return state;
    }

    return state.update(clientID, (currentState) => {
      const ids = currentState.get("IDs"),
        invoiceID = String(invoice.get("ID")),
        position = ids.indexOf(invoiceID);

      return currentState.merge({
        IDs                      : ids.delete(position),
        lastFetchedInvoiceNumber : lastFetchedInvoiceNumber - 1,
        total                    : total - 1,
      });
    });
  };

export const byClient = (
  state : InvoicesByClientState = Immutable.Map(),
  action : Action
) => {
  switch (action.type) {
    case "COMPANY_FETCH_INVOICES_BY_CLIENT_PENDING":
      return fetchInvoicesByClientPending(state, action);

    case "COMPANY_FETCH_INVOICES_BY_CLIENT_REJECTED":
      return fetchInvoicesByClientRejected(state, action);

    case "COMPANY_FETCH_INVOICES_BY_CLIENT_FULFILLED":
      return fetchInvoicesByClientFulfilled(state, action);

    case "COMPANY_DELETE_CLIENT":
      return deleteClient(state, action);

    case "COMPANY_ADD_INVOICE":
      return addInvoice(state, action);

    case "COMPANY_DELETE_INVOICE":
      return deleteInvoice(state, action);

    case COMPANY_RESET_DATA:
      return state.clear();

    default:
      return state;
  }
};

export const
  fetchingClientSelector = (state : State, clientID : string) => (
  state.companyInvoices.byClient.getIn([clientID, "fetching"]) || false
),
  fetchedClientSelector = (state : State, clientID : string) => (
  state.companyInvoices.byClient.getIn([clientID, "fetched"]) || false
),
  errorClientSelector = (state : State, clientID : string) => (
  state.companyInvoices.byClient.getIn([clientID, "error"]) || noError
),
  IDsListClientSelector = (state : State, clientID : string) => (
  state.companyInvoices.byClient.getIn([clientID, "IDs"]) || Immutable.Map()
),
  getTotalClientSelector = (state : State, clientID : string) => (
  state.companyInvoices.byClient.getIn([clientID, "total"]) || nothingFetched
),
  lastFetchedInvoiceNumberClientSelector = (state : State, clientID : string) => (
  state.companyInvoices.byClient.getIn([clientID, "lastFetchedInvoiceNumber"]) || nothingFetched
);

const byIDsMapSelector = (state : State) => state.companyInvoices.byID;

export const getIsFetchingClientInvoices = createSelector(
  fetchingClientSelector,
  errorClientSelector,
  (isFetching : boolean, error : any) => (
    isFetching &&
    (error === noError)
  )
);

export const getErrorFetchingClientInvoices = createSelector(
  errorClientSelector,
  (error : any) => (error !== noError)
);

export const getCanLoadClientInvoicesLocally = createSelector(
  lastFetchedInvoiceNumberClientSelector,
  (state : any, clientID: string, requestedFrom: number) => requestedFrom,
  (
    lastFetchedInvoiceNumber: number,
    requestedFrom : number,
  ) => (
    requestedFrom + rowsPerLoad <= lastFetchedInvoiceNumber
  )
);

export const getShouldFetchClientInvoices = createSelector(
  getCompanyIsFetched,
  getIsFetchingClientInvoices,
  lastFetchedInvoiceNumberClientSelector,
  getTotalClientSelector,
  (state : any, clientID : string, requestedFrom: number) => requestedFrom,
  (
    isFetchedCompanyInfo : boolean,
    isFetching : boolean,
    lastFetchedInvoiceNumber: number,
    total: number,
    requestedFrom : number,
  ) => (
    isFetchedCompanyInfo &&
    (!isFetching) &&
    (requestedFrom + rowsPerLoad - 1 > lastFetchedInvoiceNumber) &&
    (
      (total === nothingFetched) ||
      (total > requestedFrom)
    )
  )
);

export const getClientInvoices = createSelector(
  IDsListClientSelector,
  byIDsMapSelector,
  (list : any, byIDMap : any) => (
    list.map((id : number) => byIDMap.get(id))
  )
);

export const getSortedClientInvoices = createSelector(
  getClientInvoices,
  (list: any) => (
    list.sortBy((invoice : any) => -invoice.get("ID"))
  )
);

export const clientInvoicesUpToSelector = createSelector(
  getSortedClientInvoices,
  (state : any, clientID: string) => clientID,
  (state : any, clientID: string, requestedUpTo : number) => requestedUpTo,
  (clientSortedInvoices: any, clientID : string, requestedUpTo: number) => (
    clientSortedInvoices.slice(0, requestedUpTo)
  )
);

export const shouldFetchClientInvoicesFrom = createSelector(
 getCanLoadClientInvoicesLocally,
 getShouldFetchClientInvoices,
 (canLoadLocally, shouldFetch) => (
   !canLoadLocally && shouldFetch
 )
);
