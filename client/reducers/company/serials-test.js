/* eslint-disable max-lines, no-undefined, no-magic-numbers */

import reducer, {
  getSerial,
  getSerialsAreFetched,
  getSerialsAreFetching,
  getSerialsHaveError,
  getSerialsShouldFetch,
  getSerials,
  getSerialsSorted,
} from "./serials";

import * as Immutable from "immutable";
import { noError } from "utility";

import {
  addSerial,
  modifySerial,
  deleteSerial,

  addInvoice,
  deleteInvoice,

  addCashing,
  deleteCashing,

  COMPANY_RESET_DATA,
 } from "actions";

describe("company/serials ", () => {

  it("returns the initial state", () => {
    const result = reducer(undefined, { type: "" });

    expect(result).toEqual({
      fetched  : false,
      fetching : false,
      error    : noError,

      data: Immutable.Map(),
    });
  });
  it("should handle COMPANY_FETCH_SERIALS_PENDING", () => {
    const
      initialState = {
        fetching : false,
        error    : "Problem",
      },
      result = reducer(initialState, { type: "COMPANY_FETCH_SERIALS_PENDING" });

    expect(result).toEqual({
      fetching : true,
      error    : noError,
    });
  });
  it("should handle COMPANY_FETCH_SERIALS_REJECTED", () => {
    const
      initialState = {
        fetching : true,
        error    : noError,
      },
      error = "This is an error",
      payload = {
        type    : "COMPANY_FETCH_SERIALS_REJECTED",
        payload : { error },
      },
      result = reducer(initialState, payload);

    expect(result).toEqual({
      fetching: false,
      error,
    });
  });
  it("should handle COMPANY_FETCH_SERIALS_FULFILLED", () => {
    const
      initialState = {
        fetching : true,
        fetched  : false,

        data: Immutable.Map(),
      },
      action = {
        type    : "COMPANY_FETCH_SERIALS_FULFILLED",
        payload : {
          entities: Immutable.Map({
            "6": Immutable.Map({
              ID   : 6,
              Name : "Serial 6",
            }),
            "7": Immutable.Map({
              ID   : 7,
              Name : "Serial 7",
            }),
          }),
        },
      },
      result = reducer(initialState, action);

    expect(result).toEqual({
      fetching : false,
      fetched  : true,

      data: Immutable.Map({
        "6": Immutable.Map({
          ID   : 6,
          Name : "Serial 6",
        }),
        "7": Immutable.Map({
          ID   : 7,
          Name : "Serial 7",
        }),
      }),
    });
  });
  it("should handle COMPANY_ADD_SERIAL", () => {
    const
      initialState = {
        data: Immutable.Map(),
      },
      serial = Immutable.Map({
        ID   : 4,
        Code : "Serial",
      }),
      result = reducer(initialState, addSerial(serial));

    expect(result).toEqual({
      data: Immutable.Map({
        "4": Immutable.Map({
          ID   : 4,
          Code : "Serial",
        }),
      }),
    });
  });
  it("should handle COMPANY_MODIFY_SERIAL", () => {
    const
      initialState = {
        data: Immutable.Map({
          "5": Immutable.Map({
            ID   : 5,
            Name : "Serial 5",
          }),
          "7": Immutable.Map({
            ID   : 7,
            Name : "Serial 7",
          }),
          "4": Immutable.Map({
            ID   : 4,
            Name : "Serial 44",
          }),
        }),
      },
      serial = Immutable.Map({
        ID   : 4,
        Name : "New name",
      }),
      result = reducer(initialState, modifySerial(serial));

    expect(result).toEqual({
      data: Immutable.Map({
        "4": Immutable.Map({
          ID   : 4,
          Name : "New name",
        }),
        "5": Immutable.Map({
          ID   : 5,
          Name : "Serial 5",
        }),
        "7": Immutable.Map({
          ID   : 7,
          Name : "Serial 7",
        }),
      }),
    });
  });
  it("should handle COMPANY_DELETE_SERIAL", () => {
    const
      initialState = {
        data: Immutable.Map({
          "8": Immutable.Map({
            ID   : 8,
            Code : "Serial 8",
          }),
          "4": Immutable.Map({
            ID   : 4,
            Code : "Serial 4",
          }),
        }),
      },
      result = reducer(initialState, deleteSerial(4));

    expect(result).toEqual({
      data: Immutable.Map({
        "8": Immutable.Map({
          ID   : 8,
          Code : "Serial 8",
        }),
      }),
    });
  });


  it("handles the COMPANY_RESET_DATA", () => {
    const initialState = {
      error    : noError,
      fetching : false,
      fetched  : true,

      data: Immutable.Map({
        "8": Immutable.Map({
          ID   : 8,
          Code : "Serial 8",
        }),
      }),
    };

    const result = reducer(initialState, { type: COMPANY_RESET_DATA });

    expect(result).toEqual({
      error    : noError,
      fetched  : false,
      fetching : false,

      data: Immutable.Map(),
    });
  });

  describe("should handle COMPANY_ADD_INVOICE", () => {
    describe("given an invoice with cashing", () => {
      it("increments the counter for invoices", () => {
        const
          initialState = {
            data: Immutable.Map({
              "1": Immutable.Map({
                "ID"        : 1,
                "Code"      : "SIM",
                "NrCashing" : 29,
                "NrInvoice" : 10,
              }),
              "2": Immutable.Map({
                "ID"        : 2,
                "Code"      : "TIM",
                "NrCashing" : 209,
                "NrInvoice" : 100,
              }),
            }),
          },
          result = reducer(initialState, addInvoice({
            invoice: Immutable.Map({
              Serial: "SIM",
            }),
            cashings: Immutable.List([]),
          }));

        expect(result).toEqual({
          data: Immutable.Map({
            "1": Immutable.Map({
              "ID"        : 1,
              "Code"      : "SIM",
              "NrCashing" : 29,
              "NrInvoice" : 11,
            }),
            "2": Immutable.Map({
              "ID"        : 2,
              "Code"      : "TIM",
              "NrCashing" : 209,
              "NrInvoice" : 100,
            }),
          }),
        });
      });
    });
    describe("given an invoice without cashing", () => {
      it("increments the counter for invoices and cashings", () => {
        const
          initialState = {
            data: Immutable.Map({
              "1": Immutable.Map({
                "ID"        : 1,
                "Code"      : "SIM",
                "NrCashing" : 29,
                "NrInvoice" : 10,
              }),
              "2": Immutable.Map({
                "ID"        : 2,
                "Code"      : "TIM",
                "NrCashing" : 209,
                "NrInvoice" : 100,
              }),
            }),
          },
          result = reducer(initialState, addInvoice({
            invoice: Immutable.Map({
              Serial: "SIM",
            }),
            cashings: Immutable.List([
              Immutable.Map({
                "ID": 1,
              }),
            ]),
          }));

        expect(result).toEqual({
          data: Immutable.Map({
            "1": Immutable.Map({
              "ID"        : 1,
              "Code"      : "SIM",
              "NrCashing" : 30,
              "NrInvoice" : 11,
            }),
            "2": Immutable.Map({
              "ID"        : 2,
              "Code"      : "TIM",
              "NrCashing" : 209,
              "NrInvoice" : 100,
            }),
          }),
        });
      });
    });
  });
  it("handles COMPANY_DELETE_INVOICE", () => {
    const
      initialState = {
        data: Immutable.Map({
          "1": Immutable.Map({
            "ID"        : 1,
            "Code"      : "SIM",
            "NrCashing" : 30,
            "NrInvoice" : 11,
          }),
          "2": Immutable.Map({
            "ID"        : 2,
            "Code"      : "TIM",
            "NrCashing" : 209,
            "NrInvoice" : 100,
          }),
        }),
      },
      invoice = Immutable.Map({
        "Serial": "TIM",
      }),
      serial = Immutable.Map({
        "NrCashing" : 200,
        "NrInvoice" : 99,
      }),
      result = reducer(initialState, deleteInvoice({
        serial,
        invoice,
      }));

    expect(result).toEqual({
      data: Immutable.Map({
        "1": Immutable.Map({
          "ID"        : 1,
          "Code"      : "SIM",
          "NrCashing" : 30,
          "NrInvoice" : 11,
        }),
        "2": Immutable.Map({
          "ID"        : 2,
          "Code"      : "TIM",
          "NrCashing" : 200,
          "NrInvoice" : 99,
        }),
      }),
    });
  });
  it("handles COMPANY_ADD_CASHING", () => {
    const
      initialState = {
        data: Immutable.Map({
          "1": Immutable.Map({
            "ID"        : 1,
            "Code"      : "SIM",
            "NrCashing" : 30,
            "NrInvoice" : 11,
          }),
          "2": Immutable.Map({
            "ID"        : 2,
            "Code"      : "TIM",
            "NrCashing" : 209,
            "NrInvoice" : 100,
          }),
        }),
      },
      cashing = Immutable.Map({
        "Serial": "TIM",
      }),
      result = reducer(initialState, addCashing(cashing));

    expect(result).toEqual({
      data: Immutable.Map({
        "1": Immutable.Map({
          "ID"        : 1,
          "Code"      : "SIM",
          "NrCashing" : 30,
          "NrInvoice" : 11,
        }),
        "2": Immutable.Map({
          "ID"        : 2,
          "Code"      : "TIM",
          "NrCashing" : 210,
          "NrInvoice" : 100,
        }),
      }),
    });
  });

  describe("COMPANY_DELETE_CASHING", () => {
    describe("given the cashing is the last one", () => {
      it("decrements the cashing couter", () => {
        const
          initialState = {
            data: Immutable.Map({
              "1": Immutable.Map({
                "ID"        : 1,
                "Code"      : "SIM",
                "NrCashing" : 30,
                "NrInvoice" : 11,
              }),
              "2": Immutable.Map({
                "ID"        : 2,
                "Code"      : "TIM",
                "NrCashing" : 209,
                "NrInvoice" : 100,
              }),
            }),
          },
          cashing = Immutable.Map({
            "Serial" : "TIM",
            "Number" : 208,
          }),
          result = reducer(initialState, deleteCashing(cashing));

        expect(result).toEqual({
          data: Immutable.Map({
            "1": Immutable.Map({
              "ID"        : 1,
              "Code"      : "SIM",
              "NrCashing" : 30,
              "NrInvoice" : 11,
            }),
            "2": Immutable.Map({
              "ID"        : 2,
              "Code"      : "TIM",
              "NrCashing" : 208,
              "NrInvoice" : 100,
            }),
          }),
        });
      });
    });
    describe("else, it does nothing", () => {
      it("decrements the cashing couter", () => {
        const
          initialState = {
            data: Immutable.Map({
              "1": Immutable.Map({
                "ID"        : 1,
                "Code"      : "SIM",
                "NrCashing" : 30,
                "NrInvoice" : 11,
              }),
              "2": Immutable.Map({
                "ID"        : 2,
                "Code"      : "TIM",
                "NrCashing" : 209,
                "NrInvoice" : 100,
              }),
            }),
          },
          cashing = Immutable.Map({
            "Serial" : "TIM",
            "Number" : 57,
          }),
          result = reducer(initialState, deleteCashing(cashing));

        expect(result).toEqual({
          data: Immutable.Map({
            "1": Immutable.Map({
              "ID"        : 1,
              "Code"      : "SIM",
              "NrCashing" : 30,
              "NrInvoice" : 11,
            }),
            "2": Immutable.Map({
              "ID"        : 2,
              "Code"      : "TIM",
              "NrCashing" : 209,
              "NrInvoice" : 100,
            }),
          }),
        });
      });
    });
  });

  it("selects the serial", () => {
    const
      serial = Immutable.Map({
        ID   : 6,
        Code : "Serial 6",
      }),
      state = {
        companySerials: {
          data: Immutable.Map({
            "6": serial,
          }),
        },
      };

    expect(getSerial(state, "6")).toEqual(serial);
  });
  it("getSerialsAreFetched", () => {
    expect(
      getSerialsAreFetched({
        companySerials: {
          error    : noError,
          fetching : false,
          fetched  : true,
        },
      })
    ).toEqual(true);

    expect(
      getSerialsAreFetched({
        companySerials: {
          error    : "This is an error",
          fetching : true,
          fetched  : false,
        },
      })
    ).toEqual(false);
  });
  it("getSerialsAreFetching", () => {
    expect(
      getSerialsAreFetching({
        companySerials: {
          error    : noError,
          fetching : true,
        },
      })
    ).toEqual(true);

    expect(
      getSerialsAreFetching({
        companySerials: {
          error    : "This is an error",
          fetching : false,
        },
      })
    ).toEqual(false);
  });
  it("getSerialsHaveError", () => {
    expect(
      getSerialsHaveError({
        companySerials: {
          error: "This is an error",
        },
      })
    ).toEqual(true);

    expect(
      getSerialsHaveError({
        companySerials: {
          error: noError,
        },
      })
    ).toEqual(false);
  });
  it("getSerialsShouldFetch", () => {
    expect(
      getSerialsShouldFetch({
        companyInfo: {
          fetching : false,
          fetched  : true,
          error    : noError,
        },
        companySerials: {
          error    : noError,
          fetching : false,
          fetched  : false,
        },
      })
    ).toEqual(true);

    expect(
      getSerialsShouldFetch({
        companyInfo: {
          fetching : true,
          fetched  : false,
          error    : "Problem",
        },
        companySerials: {
          error    : "Problem",
          fetching : true,
          fetched  : true,
        },
      })
    ).toEqual(false);
  });
  it("getSerials", () => {
    expect(
      getSerials({
        companySerials: {
          data: Immutable.Map({
            "4": Immutable.Map({
              ID   : 4,
              Code : "TIT",
            }),
            "3": Immutable.Map({
              ID   : 3,
              Code : "POP",
            }),
            "7": Immutable.Map({
              ID   : 7,
              Code : "ALL",
            }),
          }),
        },
      })
    ).toEqual(Immutable.List([
      Immutable.Map({
        ID   : 3,
        Code : "POP",
      }),
      Immutable.Map({
        ID   : 4,
        Code : "TIT",
      }),
      Immutable.Map({
        ID   : 7,
        Code : "ALL",
      }),
    ]));
  });
  it("getSerialsSorted", () => {
    expect(
      getSerialsSorted({
        companySerials: {
          data: Immutable.Map({
            "4": Immutable.Map({
              ID   : 4,
              Code : "TIT",
            }),
            "3": Immutable.Map({
              ID   : 3,
              Code : "POP",
            }),
            "7": Immutable.Map({
              ID   : 7,
              Code : "ALL",
            }),
          }),
        },
      })
    ).toEqual(Immutable.List([
      Immutable.Map({
        ID   : 7,
        Code : "ALL",
      }),
      Immutable.Map({
        ID   : 3,
        Code : "POP",
      }),
      Immutable.Map({
        ID   : 4,
        Code : "TIT",
      }),
    ]));
  });
});
