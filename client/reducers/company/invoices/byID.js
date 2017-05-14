// @flow

import type { InvoiceByIDState } from "types";

import { COMPANY_RESET_DATA } from "actions";

import { noError } from "utility/others";

import * as Immutable from "immutable";

const initialState = Immutable.Map();

const
  mergeWith = (state : InvoiceByIDState, { payload }) => (
    state.mergeWith((previous, next) => {
      if (typeof previous === "undefined") {
        return next;
      }

      return previous;
    }, payload.Invoices.entities)
  ),
  fetchInvoicePending = (state : InvoiceByIDState, { meta }) => {
    const invoiceID = (meta) ? String(meta.id) : "";

    if (state.has(invoiceID)) {
      return state.update(invoiceID,
        (invoice) => invoice.set("IsFetching", true)
      );
    }

    const result = state.set(invoiceID, Immutable.Map({
      IsFetching        : true,
      AreDetailsFetched : false,
      FetchDetailsError : noError,
    }));

    return result;
  },
  fetchInvoiceRejected = (state : InvoiceByIDState, { payload : { error }, meta }) => {
    const invoiceID = (meta) ? String(meta.id) : "";

    return state.update(invoiceID,
      (invoice) => invoice.merge({
        IsFetching        : false,
        FetchDetailsError : error,
        AreDetailsFetched : false,
      })
    );
  },
  fetchInvoiceFulFilled = (state : InvoiceByIDState, { payload : { invoice } }) => {
    const
      current = invoice.merge({
        IsFetching        : false,
        FetchDetailsError : noError,
        AreDetailsFetched : true,
      }),
      id = String(invoice.get("ID"));

    return state.set(id, current);
  },
  addCashing = (state : InvoiceByIDState, { payload }) => (
    state.update(
      String(payload.get("InvoiceID")),
      (invoice : any) => {
        if (typeof invoice === "undefined") {
          return invoice;
        }

        const newPaid = parseFloat(
          (invoice.get("Paid") + payload.get("Total")).toFixed(2)
        );

        return (
          invoice.set("Paid", newPaid)
        );
      }
    )
  ),
  modifyCashing = (state : InvoiceByIDState, { payload : { newCashing, oldCashing } }) => (
    state.update(
      String(newCashing.get("InvoiceID")),
      (invoice : any) => {
        if (typeof invoice === "undefined") {
          return invoice;
        }

        const newPaid = parseFloat(
          (invoice.get("Paid") - oldCashing.get("Total") + newCashing.get("Total")).toFixed(2)
        );

        return invoice.set("Paid", newPaid);
      }
    )
  ),
  deleteCashing = (state : InvoiceByIDState, { payload }) => (
    state.update(
      String(payload.get("InvoiceID")),
      (invoice : any) => {
        if (typeof invoice === "undefined") {
          return invoice;
        }

        return (
          invoice.set("Paid", invoice.get("Paid") - payload.get("Total"))
        );
      }
    )
  ),
  addOrModifyInvoice = (state : InvoiceByIDState, { payload : { invoice } }) => (
    state.set(
      String(invoice.get("ID")),
      invoice.merge({
        AreDetailsFetched : true,
        IsFetching        : false,
        FetchDetailsError : noError,
      })
    )
  ),
  toggleInvoiceCancel = (state : InvoiceByIDState, { payload }) => (
    state.set(String(payload.get("ID")), payload)
  ),
  deleteInvoice = (state : InvoiceByIDState, { payload : { invoice } }) => (
    state.delete(
      String(invoice.get("ID"))
    )
  );

export const byIDInvoices = (state : InvoiceByIDState = initialState, action : any) => {
  switch (action.type) {
    case "COMPANY_FETCH_INVOICES_BY_CLIENT_FULFILLED":
    case "COMPANY_FETCH_INVOICES_FULFILLED":
      return mergeWith(state, action);

    case "COMPANY_FETCH_INVOICE_PENDING": {
      return fetchInvoicePending(state, action);
    }
    case "COMPANY_FETCH_INVOICE_REJECTED":
      return fetchInvoiceRejected(state, action);

    case "COMPANY_FETCH_INVOICE_FULFILLED":
      return fetchInvoiceFulFilled(state, action);

    case "COMPANY_ADD_CASHING":
      return addCashing(state, action);

    case "COMPANY_MODIFY_CASHING":
      return modifyCashing(state, action);

    case "COMPANY_TOGGLE_INVOICE_CANCEL":
      return toggleInvoiceCancel(state, action);

    case "COMPANY_DELETE_CASHING":
      return deleteCashing(state, action);

    case "COMPANY_ADD_INVOICE":
    case "COMPANY_MODIFY_INVOICE_DATA":
    case "COMPANY_MODIFY_INVOICE_CLIENT":
    case "COMPANY_MODIFY_INVOICE_DELEGATE":
    case "COMPANY_MODIFY_INVOICE_SERIAL":
      return addOrModifyInvoice(state, action);

    case "COMPANY_DELETE_INVOICE":
      return deleteInvoice(state, action);

    case COMPANY_RESET_DATA:
      return state.clear();

    default:
      return state;
  }
};
