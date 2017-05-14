// @flow

import type { CompanyInvoiceItemsState, State, Action } from "types";

import { COMPANY_RESET_DATA } from "actions";

import { createSelector } from "reselect";
import * as Immutable from "immutable";

const initialState = Immutable.Map();

const
  addModifyInvoice = (state : CompanyInvoiceItemsState, { payload : { items, invoice } }) => {

    const id = invoice.get("ID");

    const strippedOld = state.filter((item) => (
      item.get("InvoiceID") !== id
    ));

    return items.reduce((currentState, item) => (
      currentState.set(String(item.get("ID")), item)
    ), strippedOld);
  },
  fetchInvoiceFulfilled = (state : CompanyInvoiceItemsState, { payload : { invoice, items } }) => {
    const
      invoiceID = invoice.get("ID"),
      strippedOld = state.filter((item) => (
        item.get("InvoiceID") !== invoiceID
      ));

    return strippedOld.merge(items);
  },
  deleteInvoice = (state : CompanyInvoiceItemsState, { payload : { invoice } }) => (
    state.filter((item) => (
      item.get("InvoiceID") !== invoice.get("ID")
    ))
  );

const reducer = (state : CompanyInvoiceItemsState = initialState, action : Action) => {
  switch (action.type) {

    case "COMPANY_ADD_INVOICE":
    case "COMPANY_MODIFY_INVOICE_DATA":
      return addModifyInvoice(state, action);

    case "COMPANY_FETCH_INVOICE_FULFILLED":
      return fetchInvoiceFulfilled(state, action);

    case "COMPANY_DELETE_INVOICE":
      return deleteInvoice(state, action);

    case COMPANY_RESET_DATA:
      return state.clear();

    default:
      return state;
  }
};

const getInvoiceItems = (state : State) => state.companyInvoiceItems;

export const getInvoiceItemsByInvoiceID = createSelector(
  getInvoiceItems,
  (state, invoiceID) => invoiceID,
  (list, invoiceID) => {
    const id = Number(invoiceID);

    return (
      list.filter((item) => (item.get("InvoiceID") === id))
    );
  }
);

export default reducer;
