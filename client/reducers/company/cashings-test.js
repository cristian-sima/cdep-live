/* eslint-disable max-lines, no-undefined, no-magic-numbers */

import reducer, {
  getCashing,
  getCashingsByInvoiceID,
} from "./cashings";

import * as Immutable from "immutable";
import * as matchers from "jest-immutable-matchers";

import {
  addCashing,
  modifyCashing,
  deleteCashing,
  deleteInvoice,
  modifyInvoiceData,
  addInvoice,
  COMPANY_RESET_DATA,
} from "actions";

describe("company/cashings reducer", () => {
  beforeEach(() => {
    jest.addMatchers(matchers);
  });

  it("returns the initial state", () => {
    const result = reducer(undefined, { type: "" });

    expect(result).toEqual(Immutable.Map());
  });
  it("handles COMPANY_ADD_CASHING", () => {
    const
      cashing = Immutable.Map({
        ID: 66,
      }),
      result = reducer(undefined, addCashing(cashing));

    expect(result).toEqual(Immutable.Map({
      "66": cashing,
    }));
  });
  it("handles COMPANY_MODIFY_CASHING", () => {
    const
      oldCashing = Immutable.Map({
        ID: 66,
      }),
      initialState = Immutable.Map({
        "66": oldCashing,
      }),
      newCashing = Immutable.Map({
        ID: 66,
      }),
      result = reducer(initialState, modifyCashing({
        oldCashing,
        newCashing,
      }));

    expect(result).toEqual(Immutable.Map({
      "66": newCashing,
    }));
  });
  it("handles COMPANY_DELETE_CASHING", () => {
    const
      cashing = Immutable.Map({
        ID: 67,
      }),
      initialState = Immutable.Map({
        "66": Immutable.Map({
          ID: 66,
        }),
        "67" : cashing,
        "68" : Immutable.Map({
          ID: 68,
        }),
      }),
      result = reducer(initialState, deleteCashing(cashing));

    expect(result).toEqual(Immutable.Map({
      "66": Immutable.Map({
        ID: 66,
      }),
      "68": Immutable.Map({
        ID: 68,
      }),
    }));
  });
  it("handles COMPANY_DELETE_INVOICE", () => {
    const
      invoice = Immutable.Map({
        ID: 3,
      }),
      initialState = Immutable.Map({
        "66": Immutable.Map({
          ID        : 66,
          InvoiceID : 1,
        }),
        "67": Immutable.Map({
          ID        : 67,
          InvoiceID : 3,
        }),
        "68": Immutable.Map({
          ID        : 68,
          InvoiceID : 1,
        }),
        "69": Immutable.Map({
          ID        : 69,
          InvoiceID : 3,
        }),
      }),
      result = reducer(initialState, deleteInvoice({ invoice }));

    expect(result).toEqual(Immutable.Map({
      "66": Immutable.Map({
        ID        : 66,
        InvoiceID : 1,
      }),
      "68": Immutable.Map({
        ID        : 68,
        InvoiceID : 1,
      }),
    }));
  });
  it("handles COMPANY_FETCH_INVOICE_FULFILLED", () => {
    const
      invoice = Immutable.Map({
        ID: 3,
      }),
      cashings = Immutable.Map({
        "67": Immutable.Map({
          ID        : 67,
          InvoiceID : 3,
        }),
        "69": Immutable.Map({
          ID        : 69,
          InvoiceID : 3,
        }),
      }),
      initialState = Immutable.Map({
        "66": Immutable.Map({
          ID        : 66,
          InvoiceID : 1,
        }),
        "67": Immutable.Map({
          ID        : 67,
          InvoiceID : 3,
        }),
        "68": Immutable.Map({
          ID        : 68,
          InvoiceID : 1,
        }),
      }),
      result = reducer(initialState, {
        type    : "COMPANY_FETCH_INVOICE_FULFILLED",
        payload : {
          invoice,
          cashings,
        },
      });

    expect(result).toEqualImmutable(Immutable.Map({
      "66": Immutable.Map({
        ID        : 66,
        InvoiceID : 1,
      }),
      "67": Immutable.Map({
        ID        : 67,
        InvoiceID : 3,
      }),
      "68": Immutable.Map({
        ID        : 68,
        InvoiceID : 1,
      }),
      "69": Immutable.Map({
        ID        : 69,
        InvoiceID : 3,
      }),
    }));
  });
  describe("it handles COMPANY_MODIFY_INVOICE_DATA", () => {
    describe("given the number of cashings is not 1", () => {
      it("returns the same state", () => {
        const
          cashings = Immutable.Map({
            "66": Immutable.Map({
              ID        : 66,
              InvoiceID : 1,
            }),
            "67": Immutable.Map({
              ID        : 67,
              InvoiceID : 3,
            }),
          }),
          initialState = Immutable.Map({
            "66": Immutable.Map({
              ID        : 66,
              InvoiceID : 1,
            }),
            "67": Immutable.Map({
              ID        : 67,
              InvoiceID : 3,
            }),
            "68": Immutable.Map({
              ID        : 68,
              InvoiceID : 1,
            }),
            "69": Immutable.Map({
              ID        : 69,
              InvoiceID : 3,
            }),
          }),
          result = reducer(initialState, modifyInvoiceData({ cashings }));

        expect(result).toEqualImmutable(initialState);
      });
    });
    describe("given the number of cashings is 1", () => {
      it("updates the cashing", () => {
        const
          cashings = Immutable.Map({
            "66": Immutable.Map({
              ID        : 66,
              InvoiceID : 1,
            }),
          }),
          initialState = Immutable.Map({
            "66": Immutable.Map({
              ID        : 66,
              InvoiceID : 1,
            }),
            "67": Immutable.Map({
              ID        : 67,
              InvoiceID : 3,
            }),
            "68": Immutable.Map({
              ID        : 68,
              InvoiceID : 1,
            }),
            "69": Immutable.Map({
              ID        : 69,
              InvoiceID : 3,
            }),
          }),
          result = reducer(initialState, modifyInvoiceData({ cashings }));

        expect(result).toEqualImmutable(Immutable.Map({
          "66": Immutable.Map({
            ID        : 66,
            InvoiceID : 1,
          }),
          "67": Immutable.Map({
            ID        : 67,
            InvoiceID : 3,
          }),
          "68": Immutable.Map({
            ID        : 68,
            InvoiceID : 1,
          }),
          "69": Immutable.Map({
            ID        : 69,
            InvoiceID : 3,
          }),
        }));
      });
    });
  });
  describe("it handles COMPANY_ADD_INVOICE", () => {
    describe("given the number of cashings is 0", () => {
      it("returns the same state", () => {
        const
          cashings = Immutable.Map(),
          initialState = Immutable.Map({
            "67": Immutable.Map({
              ID        : 67,
              InvoiceID : 3,
            }),
            "68": Immutable.Map({
              ID        : 68,
              InvoiceID : 1,
            }),
            "69": Immutable.Map({
              ID        : 69,
              InvoiceID : 3,
            }),
          }),
          result = reducer(initialState, addInvoice({ cashings }));

        expect(result).toEqualImmutable(initialState);
      });
    });
    describe("given the number of cashings not 0", () => {
      it("adds the cashing", () => {
        const
          cashings = Immutable.Map({
            "66": Immutable.Map({
              ID        : 66,
              InvoiceID : 1,
            }),
          }),
          initialState = Immutable.Map({
            "67": Immutable.Map({
              ID        : 67,
              InvoiceID : 3,
            }),
            "68": Immutable.Map({
              ID        : 68,
              InvoiceID : 1,
            }),
            "69": Immutable.Map({
              ID        : 69,
              InvoiceID : 3,
            }),
          }),
          result = reducer(initialState, addInvoice({ cashings }));

        expect(result).toEqualImmutable(Immutable.Map({
          "66": Immutable.Map({
            ID        : 66,
            InvoiceID : 1,
          }),
          "67": Immutable.Map({
            ID        : 67,
            InvoiceID : 3,
          }),
          "68": Immutable.Map({
            ID        : 68,
            InvoiceID : 1,
          }),
          "69": Immutable.Map({
            ID        : 69,
            InvoiceID : 3,
          }),
        }));
      });
    });
  });
  it("handles COMPANY_RESET_DATA", () => {
    const
      initialState = Immutable.Map({
        "66": Immutable.Map({
          ID        : 66,
          InvoiceID : 3,
        }),
        "67": Immutable.Map({
          ID        : 67,
          InvoiceID : 1,
        }),
        "68": Immutable.Map({
          ID        : 68,
          InvoiceID : 2,
        }),
        "69": Immutable.Map({
          ID        : 69,
          InvoiceID : 3,
        }),
      }),
      result = reducer(initialState, { type: COMPANY_RESET_DATA });

    expect(result).toEqualImmutable(Immutable.Map());
  });
  it("getCashing", () => {
    const
      cashing = Immutable.Map({
        ID: 45,
      }),
      state = {
        companyCashings: Immutable.Map({
          "45" : cashing,
          "46" : Immutable.Map({
            ID: "46",
          }),
        }),
      },
      result = getCashing(state, "45");

    expect(result).toEqualImmutable(cashing);
  });
  it("getCashingsByInvoiceID", () => {
    const
      state = {
        companyCashings: Immutable.Map({
          "66": Immutable.Map({
            ID        : 66,
            InvoiceID : 3,
          }),
          "67": Immutable.Map({
            ID        : 67,
            InvoiceID : 1,
          }),
          "68": Immutable.Map({
            ID        : 68,
            InvoiceID : 2,
          }),
          "69": Immutable.Map({
            ID        : 69,
            InvoiceID : 3,
          }),
        }),
      },
      result = getCashingsByInvoiceID(state, 3);

    expect(result).toEqualImmutable(Immutable.Map({
      "66": Immutable.Map({
        ID        : 66,
        InvoiceID : 3,
      }),
      "69": Immutable.Map({
        ID        : 69,
        InvoiceID : 3,
      }),
    }));
  });
});
