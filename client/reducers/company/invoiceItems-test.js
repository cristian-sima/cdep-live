/* eslint-disable no-undefined, no-magic-numbers */

import reducer, { getInvoiceItemsByInvoiceID } from "./invoiceItems";

import * as Immutable from "immutable";

import {
  addInvoice,
  modifyInvoiceData,
  deleteInvoice,
  COMPANY_RESET_DATA,
} from "actions";

describe("company/invoiceItems reducer", () => {
  it("returns the initial state", () => {
    const result = reducer(undefined, { type: "" });

    expect(result).toEqual(Immutable.Map());
  });
  it("handles COMPANY_ADD_INVOICE", () => {
    const
      items = Immutable.Map({
        "10": Immutable.Map({
          ID        : 10,
          InvoiceID : 1,
        }),
      }),
      invoice = Immutable.Map({
        ClientID : 4,
        ID       : 1,
      }),
      payload = {
        items,
        invoice,
      };

    const result = reducer(undefined, addInvoice(payload));

    expect(result).toEqual(Immutable.Map({
      "10": Immutable.Map({
        ID        : 10,
        InvoiceID : 1,
      }),
    }));
  });
  it("handles COMPANY_MODIFY_INVOICE_DATA", () => {
    const
      initialState = Immutable.Map({
        "9": Immutable.Map({
          ID        : 9,
          InvoiceID : 2,
        }),
        "10": Immutable.Map({
          ID        : 10,
          InvoiceID : 1,
        }),
      }),
      items = Immutable.Map({
        "11": Immutable.Map({
          ID        : 11,
          InvoiceID : 1,
        }),
      }),
      invoice = Immutable.Map({
        ID       : 1,
        ClientID : 4,
      }),
      payload = {
        items,
        invoice,
      };

    const result = reducer(initialState, modifyInvoiceData(payload));

    expect(result).toEqual(Immutable.Map({
      "9": Immutable.Map({
        ID        : 9,
        InvoiceID : 2,
      }),
      "11": Immutable.Map({
        ID        : 11,
        InvoiceID : 1,
      }),
    }));
  });
  it("handles COMPANY_FETCH_INVOICE_FULFILLED", () => {
    const
      initialState = Immutable.Map({
        "9": Immutable.Map({
          ID        : 9,
          InvoiceID : 2,
        }),
      }),
      items = Immutable.Map({
        "11": Immutable.Map({
          ID        : 11,
          InvoiceID : 1,
        }),
        "12": Immutable.Map({
          ID        : 12,
          InvoiceID : 1,
        }),
      }),
      invoice = Immutable.Map({
        ClientID : 4,
        ID       : 1,
      }),
      payload = {
        items,
        invoice,
      };

    const result = reducer(initialState, {
      type: "COMPANY_FETCH_INVOICE_FULFILLED",
      payload,
    });

    expect(result).toEqual(Immutable.Map({
      "9": Immutable.Map({
        ID        : 9,
        InvoiceID : 2,
      }),
      "11": Immutable.Map({
        ID        : 11,
        InvoiceID : 1,
      }),
      "12": Immutable.Map({
        ID        : 12,
        InvoiceID : 1,
      }),
    }));
  });
  it("handles COMPANY_DELETE_INVOICE", () => {
    const
      initialState = Immutable.Map({
        "8": Immutable.Map({
          ID        : 8,
          InvoiceID : 1,
        }),
        "11": Immutable.Map({
          ID        : 11,
          InvoiceID : 6,
        }),
        "9": Immutable.Map({
          ID        : 9,
          InvoiceID : 2,
        }),
        "12": Immutable.Map({
          ID        : 12,
          InvoiceID : 6,
        }),
      }),
      invoice = Immutable.Map({
        ClientID : 4,
        ID       : 6,
      });

    const result = reducer(initialState, deleteInvoice({ invoice }));

    expect(result).toEqual(Immutable.Map({
      "8": Immutable.Map({
        ID        : 8,
        InvoiceID : 1,
      }),
      "9": Immutable.Map({
        ID        : 9,
        InvoiceID : 2,
      }),
    }));
  });
  it("getInvoiceItemsByInvoiceID", () => {
    const
      initialState = Immutable.Map({
        "8": Immutable.Map({
          ID        : 8,
          InvoiceID : 1,
        }),
        "11": Immutable.Map({
          ID        : 11,
          InvoiceID : 6,
        }),
        "9": Immutable.Map({
          ID        : 9,
          InvoiceID : 2,
        }),
        "12": Immutable.Map({
          ID        : 12,
          InvoiceID : 6,
        }),
      }),
      state = {
        companyInvoiceItems: initialState,
      };

    const result = getInvoiceItemsByInvoiceID(state, 6);

    expect(result).toEqual(Immutable.Map({
      "11": Immutable.Map({
        ID        : 11,
        InvoiceID : 6,
      }),
      "12": Immutable.Map({
        ID        : 12,
        InvoiceID : 6,
      }),
    }));
  });
  it("handles the COMPANY_RESET_DATA", () => {
    const initialState = Immutable.Map({
      "10": Immutable.Map({
        ID        : 10,
        InvoiceID : 1,
      }),
      "11": Immutable.Map({
        ID        : 11,
        InvoiceID : 2,
      }),
    });

    const result = reducer(initialState, { type: COMPANY_RESET_DATA });

    expect(result).toEqual(Immutable.Map());
  });
});
