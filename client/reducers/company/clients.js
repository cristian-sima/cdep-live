// @flow

import type { Action, CompanyClientsState, State } from "types";

import { createSelector } from "reselect";
import * as Immutable from "immutable";

import { COMPANY_RESET_DATA } from "actions";
import { noError } from "utility";

import { getCompanyIsFetched } from "./info";

const newInitialState = () => ({
  error    : noError,
  fetched  : false,
  fetching : false,
  data     : Immutable.Map(),
});

const
  fetchClientsPending = (state : CompanyClientsState) => ({
    ...state,
    error    : noError,
    fetching : true,
  }),
  fetchClientsRejected = (state : CompanyClientsState, { payload : { error } }) => ({
    ...state,
    error,
    fetching: false,
  }),
  fetchClientsFulfilled = (state : CompanyClientsState, { payload }) => ({
    ...state,
    fetched  : true,
    fetching : false,

    data: payload.entities,
  }),
  setClient = (state: CompanyClientsState, { payload }) => ({
    ...state,
    data: state.data.set(String(payload.get("ID")), payload),
  }),
  handleDeleteClient = (state : CompanyClientsState, { payload }) => ({
    ...state,
    data: state.data.delete(String(payload)),
  }),
  handleAddInvoice = (state: CompanyClientsState, { payload : { invoice } }) => {
    const
      clientID = String(invoice.get("ClientID")),
      client = state.data.get(clientID);

    return {
      ...state,
      data: state.data.set(clientID, client.merge({
        AmountTo   : client.get("AmountTo") + invoice.get("Total"),
        AmountFrom : client.get("AmountFrom") + invoice.get("Paid"),
      })),
    };
  },
  handleModifyInvoice = (state: CompanyClientsState, { payload : { oldInvoice, invoice } }) => {
    const
      handleChangeClient = () => ({
        ...state,
        data: state.data.update(
            String(invoice.get("ClientID")), (newClient) => (
              newClient.merge({
                AmountTo   : newClient.get("AmountTo") + invoice.get("Total"),
                AmountFrom : newClient.get("AmountFrom") + invoice.get("Paid"),
              })
            )
          ).update(
            String(oldInvoice.get("ClientID")), (oldClient) => (
              oldClient.merge({
                AmountTo   : oldClient.get("AmountTo") - oldInvoice.get("Total"),
                AmountFrom : oldClient.get("AmountFrom") - oldInvoice.get("Paid"),
              })
            )
          ),
      }),
      handleClientIsSame = () => ({
        ...state,
        data: state.data.update(
          String(invoice.get("ClientID")), (client) => (
            client.merge({
              AmountTo: (
                client.get("AmountTo") - oldInvoice.get("Total") + invoice.get("Total")
              ),
              AmountFrom: (
                client.get("AmountFrom") - oldInvoice.get("Paid") + invoice.get("Paid")
              ),
            })
          )
        ),
      });

    if (oldInvoice.get("ClientID") !== invoice.get("ClientID")) {
      return handleChangeClient();
    }

    return handleClientIsSame();
  },
  updateAmounts = (state: CompanyClientsState, { payload : { invoice } }) => ({
    ...state,
    data: state.data.update(
      String(invoice.get("ClientID")), (client) => {
        if (typeof client === "undefined") {
          return client;
        }

        return client.merge({
          AmountTo   : client.get("AmountTo") - invoice.get("Total"),
          AmountFrom : client.get("AmountFrom") - invoice.get("Paid"),
        });
      }
    ),
  }),
  toggleInvoiceNotCancelled = (state: CompanyClientsState, invoice) => {
    const
      clientID = String(invoice.get("ClientID")),
      client = state.data.get(clientID);

    if (state.data.has(clientID)) {
      return {
        ...state,
        data: state.data.set(clientID, client.merge({
          AmountTo   : client.get("AmountTo") + invoice.get("Total"),
          AmountFrom : client.get("AmountFrom") + invoice.get("Paid"),
        })),
      };
    }

    return state;
  },
  toggleInvoiceCancel = (state: CompanyClientsState, { payload }) => {
    if (payload.get("IsCancelled")) {
      return updateAmounts(state, {
        payload: {
          invoice: payload,
        },
      });
    }

    return toggleInvoiceNotCancelled(state, payload);
  },
  handleAddCashing = (state: CompanyClientsState, { payload }) => ({
    ...state,
    data: state.data.update(
      String(payload.get("ClientID")),
      (client : any) => {
        if (typeof client === "undefined") {
          return client;
        }

        const amountFrom = client.get("AmountFrom") + payload.get("Total");

        return (
          client.set("AmountFrom", amountFrom)
        );
      }
    ),
  }),
  handleModifyCashing = (state: CompanyClientsState, { payload : { newCashing, oldCashing } }) => ({
    ...state,
    data: state.data.update(
      String(newCashing.get("ClientID")),
      (client : any) => {
        if (typeof client === "undefined") {
          return client;
        }

        const amountFrom = (
          client.get("AmountFrom") -
          oldCashing.get("Total") +
          newCashing.get("Total")
         );

        return client.set("AmountFrom", amountFrom);
      }
    ),
  }),
  handleDeleteCashing = (state: CompanyClientsState, { payload }) => ({
    ...state,
    data: state.data.update(
        String(payload.get("ClientID")),
        (client : any) => {
          if (typeof client === "undefined") {
            return client;
          }

          const amountFrom = client.get("AmountFrom") - payload.get("Total");

          return (
            client.set("AmountFrom", amountFrom)
          );
        }
      ),
  });

const reducer = (state : CompanyClientsState = newInitialState(), action : Action) => {

  switch (action.type) {
    case "COMPANY_FETCH_CLIENTS_PENDING":
      return fetchClientsPending(state, action);

    case "COMPANY_FETCH_CLIENTS_REJECTED":
      return fetchClientsRejected(state, action);

    case "COMPANY_FETCH_CLIENTS_FULFILLED":
      return fetchClientsFulfilled(state, action);

    case "COMPANY_ADD_CLIENT":
    case "COMPANY_MODIFY_CLIENT":
      return setClient(state, action);

    case "COMPANY_DELETE_CLIENT":
      return handleDeleteClient(state, action);

  // cashing

    case "COMPANY_ADD_CASHING":
      return handleAddCashing(state, action);

    case "COMPANY_MODIFY_CASHING":
      return handleModifyCashing(state, action);

    case "COMPANY_DELETE_CASHING":
      return handleDeleteCashing(state, action);

    // invoice

    case "COMPANY_ADD_INVOICE":
      return handleAddInvoice(state, action);

    case "COMPANY_MODIFY_INVOICE_DATA":
    case "COMPANY_MODIFY_INVOICE_CLIENT":
      return handleModifyInvoice(state, action);

    case "COMPANY_DELETE_INVOICE":
      return updateAmounts(state, action);

    case "COMPANY_TOGGLE_INVOICE_CANCEL":
      return toggleInvoiceCancel(state, action);

    case COMPANY_RESET_DATA:
      return newInitialState();

    default:
      return state;
  }
};

const
  getFetching = (state : State) => state.companyClients.fetching,
  getFetched = (state : State) => state.companyClients.fetched,
  getError = (state : State) => state.companyClients.error,
  getData = (state : State) => state.companyClients.data;

export const
  getClients = createSelector(
    getData,
    (ids) => ids.toList()
  ),
  getClient = (state : State, id : string) => (
    getData(state).get(id)
  );

export const getClientsAreFetched = createSelector(
  getFetching,
  getFetched,
  getError,
  (isFetching, isFetched, error) => (
    !isFetching && isFetched && error === noError
  )
);

export const getClientsAreFetching = createSelector(
  getFetching,
  getError,
  (isFetching, error) => (
    isFetching && error === noError
  )
);

export const getClientsHaveError = createSelector(
  getError,
  (error) => error !== noError
);

export const getClientsShouldFetch = createSelector(
  getCompanyIsFetched,
  getClientsAreFetched,
  getClientsAreFetching,
  (isFetchedCompanyInfo, isFetched, isFetching) => (
    isFetchedCompanyInfo && !isFetched && !isFetching
  )
);

export const getClientsSorted = createSelector(
  getClients,
  (list) => list.sortBy((client) => client.get("Name"))
);

export const getClientsFilteredByName = createSelector(
  getClientsSorted,
  (state : State, filter: string) => filter,
  (list, filter : string) => {
    if (filter === "") {
      return list;
    }

    return list.filter((client) => (
      client.
      get("Name").
      toLowerCase().
      includes(filter.toLowerCase())
    ));
  }
);

export default reducer;
