// @flow

import type { CompanyCashingsState, State, Action } from "types";

import { COMPANY_RESET_DATA } from "actions";

import * as Immutable from "immutable";
import { createSelector } from "reselect";

const initialState = Immutable.Map();

const
  addCashing = (state : CompanyCashingsState, { payload }) => (
    state.set(String(payload.get("ID")), payload)
  ),
  modifyCashing = (state : CompanyCashingsState, { payload : { newCashing } }) => (
    state.set(String(newCashing.get("ID")), newCashing)
  ),
  deleteCashing = (state : CompanyCashingsState, { payload }) => (
    state.delete(String(payload.get("ID")))
  ),
  deleteInvoice = (state : CompanyCashingsState, { payload : { invoice } }) => (
    state.filter((cashing) => (
      cashing.get("InvoiceID") !== invoice.get("ID")
    ))
  ),
  fetchInvoiceFulfilled = (state : CompanyCashingsState, { payload : { invoice, cashings } }) => {
    const
      invoiceID = invoice.get("ID"),
      strippedOld = state.filter((cashing) => (
      cashing.get("InvoiceID") !== invoiceID
    ));

    return strippedOld.merge(cashings);
  },
  modifyInvoice = (state : CompanyCashingsState, { payload : { cashings } }) => {
    if (cashings.size !== 1) {
      return state;
    }

    const cashing = cashings.first();

    return state.set(String(cashing.get("ID")), cashing);
  },
  addInvoice = (state : CompanyCashingsState, { payload : { cashings } }) => {
    if (cashings.size === 0) {
      return state;
    }

    const cashing = cashings.first();

    return state.set(String(cashing.get("ID")), cashing);
  };

const reducer = (state : CompanyCashingsState = initialState, action : Action) => {
  switch (action.type) {
    case "COMPANY_ADD_CASHING":
      return addCashing(state, action);

    case "COMPANY_MODIFY_CASHING":
      return modifyCashing(state, action);

    case "COMPANY_DELETE_CASHING":
      return deleteCashing(state, action);

    case "COMPANY_DELETE_INVOICE":
      return deleteInvoice(state, action);

    case "COMPANY_FETCH_INVOICE_FULFILLED":
      return fetchInvoiceFulfilled(state, action);

    case "COMPANY_MODIFY_INVOICE_DATA":
      return modifyInvoice(state, action);

    case "COMPANY_ADD_INVOICE":
      return addInvoice(state, action);

    case COMPANY_RESET_DATA:
      return state.clear();

    default:
      return state;
  }
};

const getCashings = (state : State) => state.companyCashings;

export const getCashing = (state : State, id : string) => (
  getCashings(state).get(id)
);

export const getCashingsByInvoiceID : (State, invoiceID: number) => any = createSelector(
  getCashings,
  (state, invoiceID) => invoiceID,
  (list, invoiceID : number) => list.filter(
    (cashing) => cashing.get("InvoiceID") === invoiceID
  )
);

export default reducer;
