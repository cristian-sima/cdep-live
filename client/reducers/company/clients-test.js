/* eslint-disable max-lines, no-undefined, no-magic-numbers */

import reducer, {
  getClient,
  getClientsAreFetched,
  getClientsAreFetching,
  getClientsHaveError,
  getClientsShouldFetch,
  getClients,
  getClientsSorted,
  getClientsFilteredByName,
} from "./clients";

import * as Immutable from "immutable";
import { noError } from "utility";

import {
  addClient,
  modifyClient,
  deleteClient,

  addInvoice,
  modifyInvoiceClient,
  modifyInvoiceData,
  deleteInvoice,
  toggleCancelInvoice,

  addCashing,
  modifyCashing,
  deleteCashing,

  COMPANY_RESET_DATA,
 } from "actions";

describe("company/clients ", () => {

  it("returns the initial state", () => {
    const result = reducer(undefined, { type: "" });

    expect(result).toEqual({
      fetched  : false,
      fetching : false,
      error    : noError,

      data: Immutable.Map(),
    });
  });
  it("should handle COMPANY_FETCH_CLIENTS_PENDING", () => {
    const
      initialState = {
        fetching : false,
        error    : "Problem",
      },
      result = reducer(initialState, { type: "COMPANY_FETCH_CLIENTS_PENDING" });

    expect(result).toEqual({
      fetching : true,
      error    : noError,
    });
  });
  it("should handle COMPANY_FETCH_CLIENTS_REJECTED", () => {
    const
      initialState = {
        fetching : true,
        error    : noError,
      },
      error = "This is an error",
      payload = {
        type    : "COMPANY_FETCH_CLIENTS_REJECTED",
        payload : { error },
      },
      result = reducer(initialState, payload);

    expect(result).toEqual({
      fetching: false,
      error,
    });
  });
  it("should handle COMPANY_FETCH_CLIENTS_FULFILLED", () => {
    const
      initialState = {
        fetching : true,
        fetched  : false,

        data: Immutable.Map(),
      },
      action = {
        type    : "COMPANY_FETCH_CLIENTS_FULFILLED",
        payload : {
          entities: Immutable.Map({
            "6": Immutable.Map({
              ID   : 6,
              Name : "Client 6",
            }),
            "7": Immutable.Map({
              ID   : 7,
              Name : "Client 7",
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
          Name : "Client 6",
        }),
        "7": Immutable.Map({
          ID   : 7,
          Name : "Client 7",
        }),
      }),
    });
  });
  it("should handle COMPANY_ADD_CLIENT", () => {
    const
      initialState = {
        data: Immutable.Map(),
      },
      client = Immutable.Map({
        ID   : 4,
        Name : "Client",
      }),
      result = reducer(initialState, addClient(client));

    expect(result).toEqual({
      data: Immutable.Map({
        "4": Immutable.Map({
          ID   : 4,
          Name : "Client",
        }),
      }),
    });
  });
  it("should handle COMPANY_MODIFY_CLIENT", () => {
    const
      initialState = {
        data: Immutable.Map({
          "5": Immutable.Map({
            ID   : 5,
            Name : "Client 5",
          }),
          "7": Immutable.Map({
            ID   : 7,
            Name : "Client 7",
          }),
          "4": Immutable.Map({
            ID   : 4,
            Name : "Client 44",
          }),
        }),
      },
      client = Immutable.Map({
        ID   : 4,
        Name : "New name",
      }),
      result = reducer(initialState, modifyClient(client));

    expect(result).toEqual({
      data: Immutable.Map({
        "4": Immutable.Map({
          ID   : 4,
          Name : "New name",
        }),
        "5": Immutable.Map({
          ID   : 5,
          Name : "Client 5",
        }),
        "7": Immutable.Map({
          ID   : 7,
          Name : "Client 7",
        }),
      }),
    });
  });
  it("should handle COMPANY_DELETE_CLIENT", () => {
    const
      initialState = {
        data: Immutable.Map({
          "8": Immutable.Map({
            ID   : 8,
            Name : "Client 8",
          }),
          "4": Immutable.Map({
            ID   : 4,
            Name : "Client 4",
          }),
        }),
      },
      result = reducer(initialState, deleteClient(4));

    expect(result).toEqual({
      data: Immutable.Map({
        "8": Immutable.Map({
          ID   : 8,
          Name : "Client 8",
        }),
      }),
    });
  });
  it("should handle COMPANY_ADD_INVOICE", () => {
    const
      initialState = {
        data: Immutable.Map({
          "1": Immutable.Map({
            ID         : 1,
            AmountFrom : 10,
            AmountTo   : 10,
          }),
          "2": Immutable.Map({
            ID         : 2,
            AmountFrom : 45,
            AmountTo   : 21,
          }),
        }),
      },
      invoice = Immutable.Map({
        ClientID : 2,
        Total    : 20,
        Paid     : 20,
      }),
      result = reducer(initialState, addInvoice({ invoice }));

    expect(result).toEqual({
      data: Immutable.Map({
        "1": Immutable.Map({
          ID         : 1,
          AmountFrom : 10,
          AmountTo   : 10,
        }),
        "2": Immutable.Map({
          ID         : 2,
          AmountFrom : 65,
          AmountTo   : 41,
        }),
      }),
    });
  });
  describe("COMPANY_MODIFY_INVOICE_CLIENT", () => {
    describe("given the client is the same", () => {
      it("should handle COMPANY_MODIFY_INVOICE_CLIENT", () => {
        const
          initialState = {
            data: Immutable.Map({
              "1": Immutable.Map({
                AmountFrom : 10,
                AmountTo   : 10,
                ID         : 1,
              }),
              "2": Immutable.Map({
                AmountFrom : 45,
                AmountTo   : 21,
                ID         : 2,
              }),
            }),
          },
          oldInvoice = Immutable.Map({
            ClientID : 2,
            Total    : 20,
            Paid     : 20,
          }),
          invoice = Immutable.Map({
            ClientID : 2,
            Total    : 30,
            Paid     : 30,
          }),
          result = reducer(initialState, modifyInvoiceClient({
            oldInvoice,
            invoice,
          }));

        expect(result).toEqual({
          data: Immutable.Map({
            "1": Immutable.Map({
              AmountFrom : 10,
              AmountTo   : 10,
              ID         : 1,
            }),
            "2": Immutable.Map({
              AmountFrom : 55,
              AmountTo   : 31,
              ID         : 2,
            }),
          }),
        });
      });
    });
    describe("given the client has changed", () => {
      it("should handle COMPANY_MODIFY_INVOICE_CLIENT", () => {
        const
          initialState = {
            data: Immutable.Map({
              "1": Immutable.Map({
                AmountFrom : 10,
                AmountTo   : 10,
                ID         : 1,
              }),
              "2": Immutable.Map({
                AmountFrom : 40,
                AmountTo   : 10,
                ID         : 2,
              }),
            }),
          },
          oldInvoice = Immutable.Map({
            ClientID : 1,
            Total    : 10,
            Paid     : 5,
          }),
          invoice = Immutable.Map({
            ClientID : 2,
            Total    : 35,
            Paid     : 20,
          }),
          result = reducer(initialState, modifyInvoiceClient({
            oldInvoice,
            invoice,
          }));

        expect(result).toEqual({
          data: Immutable.Map({
            "1": Immutable.Map({
              AmountFrom : 5,
              AmountTo   : 0,
              ID         : 1,
            }),
            "2": Immutable.Map({
              AmountFrom : 60,
              AmountTo   : 45,
              ID         : 2,
            }),
          }),
        });
      });
    });
  });
  describe("COMPANY_MODIFY_INVOICE_DATA", () => {
    describe("given the client is the same", () => {
      it("should handle COMPANY_MODIFY_INVOICE_DATA", () => {
        const
          initialState = {
            data: Immutable.Map({
              "1": Immutable.Map({
                AmountFrom : 10,
                AmountTo   : 10,
                ID         : 1,
              }),
              "2": Immutable.Map({
                AmountFrom : 45,
                AmountTo   : 21,
                ID         : 2,
              }),
            }),
          },
          oldInvoice = Immutable.Map({
            ClientID : 2,
            Total    : 20,
            Paid     : 20,
          }),
          invoice = Immutable.Map({
            ClientID : 2,
            Total    : 30,
            Paid     : 30,
          }),
          result = reducer(initialState, modifyInvoiceData({
            oldInvoice,
            invoice,
          }));

        expect(result).toEqual({
          data: Immutable.Map({
            "1": Immutable.Map({
              AmountFrom : 10,
              AmountTo   : 10,
              ID         : 1,
            }),
            "2": Immutable.Map({
              AmountFrom : 55,
              AmountTo   : 31,
              ID         : 2,
            }),
          }),
        });
      });
    });
    describe("given the client has changed", () => {
      it("should handle COMPANY_MODIFY_INVOICE_DATA", () => {
        const
          initialState = {
            data: Immutable.Map({
              "1": Immutable.Map({
                AmountFrom : 10,
                AmountTo   : 10,
                ID         : 1,
              }),
              "2": Immutable.Map({
                AmountFrom : 40,
                AmountTo   : 10,
                ID         : 2,
              }),
            }),
          },
          oldInvoice = Immutable.Map({
            ClientID : 1,
            Total    : 10,
            Paid     : 5,
          }),
          invoice = Immutable.Map({
            ClientID : 2,
            Total    : 35,
            Paid     : 20,
          }),
          result = reducer(initialState, modifyInvoiceData({
            oldInvoice,
            invoice,
          }));

        expect(result).toEqual({
          data: Immutable.Map({
            "1": Immutable.Map({
              AmountFrom : 5,
              AmountTo   : 0,
              ID         : 1,
            }),
            "2": Immutable.Map({
              AmountFrom : 60,
              AmountTo   : 45,
              ID         : 2,
            }),
          }),
        });
      });
    });
  });
  it("should handle COMPANY_DELETE_INVOICE", () => {
    const
      initialState = {
        data: Immutable.Map({
          "1": Immutable.Map({
            ID         : 1,
            AmountFrom : 10,
            AmountTo   : 10,
          }),
          "2": Immutable.Map({
            ID         : 2,
            AmountFrom : 45,
            AmountTo   : 21,
          }),
        }),
      },
      invoice = Immutable.Map({
        ClientID : 2,
        Total    : 20,
        Paid     : 20,
      }),
      result = reducer(initialState, deleteInvoice({ invoice }));

    expect(result).toEqual({
      data: Immutable.Map({
        "1": Immutable.Map({
          ID         : 1,
          AmountFrom : 10,
          AmountTo   : 10,
        }),
        "2": Immutable.Map({
          ID         : 2,
          AmountFrom : 25,
          AmountTo   : 1,
        }),
      }),
    });
  });
  describe("COMPANY_TOGGLE_INVOICE_CANCEL", () => {
    describe("given the invoice is cancelled", () => {
      it("should subtract the from and to", () => {
        const
          initialState = {
            data: Immutable.Map({
              "1": Immutable.Map({
                ID         : 1,
                AmountFrom : 10,
                AmountTo   : 10,
              }),
              "2": Immutable.Map({
                ID         : 2,
                AmountFrom : 45,
                AmountTo   : 21,
              }),
            }),
          },
          invoice = Immutable.Map({
            ClientID    : 2,
            IsCancelled : true,
            Total       : 20,
            Paid        : 20,
          }),
          result = reducer(initialState, toggleCancelInvoice(invoice));

        expect(result).toEqual({
          data: Immutable.Map({
            "1": Immutable.Map({
              ID         : 1,
              AmountFrom : 10,
              AmountTo   : 10,
            }),
            "2": Immutable.Map({
              ID         : 2,
              AmountFrom : 25,
              AmountTo   : 1,
            }),
          }),
        });
      });
    });
    describe("given the invoice is not cancelled", () => {
      it("should add the from and to", () => {
        const
          initialState = {
            data: Immutable.Map({
              "1": Immutable.Map({
                ID         : 1,
                AmountFrom : 10,
                AmountTo   : 10,
              }),
              "2": Immutable.Map({
                ID         : 2,
                AmountFrom : 45,
                AmountTo   : 21,
              }),
            }),
          },
          invoice = Immutable.Map({
            ClientID : 2,
            Total    : 20,
            Paid     : 20,
          }),
          result = reducer(initialState, addInvoice({ invoice }));

        expect(result).toEqual({
          data: Immutable.Map({
            "1": Immutable.Map({
              ID         : 1,
              AmountFrom : 10,
              AmountTo   : 10,
            }),
            "2": Immutable.Map({
              ID         : 2,
              AmountFrom : 65,
              AmountTo   : 41,
            }),
          }),
        });
      });
    });
  });
  it("should handle COMPANY_ADD_CASHING", () => {
    const
      initialState = {
        data: Immutable.Map({
          "1": Immutable.Map({
            ID         : 1,
            AmountFrom : 10,
          }),
          "2": Immutable.Map({
            ID         : 2,
            AmountFrom : 45,
          }),
        }),
      },
      cashing = Immutable.Map({
        ClientID : 2,
        Total    : 20,
      }),
      result = reducer(initialState, addCashing(cashing));

    expect(result).toEqual({
      data: Immutable.Map({
        "1": Immutable.Map({
          ID         : 1,
          AmountFrom : 10,
        }),
        "2": Immutable.Map({
          ID         : 2,
          AmountFrom : 65,
        }),
      }),
    });
  });
  it("should handle COMPANY_MODIFY_CASHING", () => {
    const
      initialState = {
        data: Immutable.Map({
          "1": Immutable.Map({
            ID         : 1,
            AmountFrom : 10,
          }),
          "2": Immutable.Map({
            ID         : 2,
            AmountFrom : 96,
          }),
        }),
      },
      cashing = {
        oldCashing: Immutable.Map({
          ClientID : 2,
          Total    : 20,
        }),
        newCashing: Immutable.Map({
          ClientID : 2,
          Total    : 10,
        }),
      },
      result = reducer(initialState, modifyCashing(cashing));

    expect(result).toEqual({
      data: Immutable.Map({
        "1": Immutable.Map({
          ID         : 1,
          AmountFrom : 10,
        }),
        "2": Immutable.Map({
          ID         : 2,
          AmountFrom : 86,
        }),
      }),
    });
  });
  it("should handle COMPANY_DELETE_CASHING", () => {
    const
      initialState = {
        data: Immutable.Map({
          "1": Immutable.Map({
            ID         : 1,
            AmountFrom : 10,
          }),
          "2": Immutable.Map({
            ID         : 2,
            AmountFrom : 45,
          }),
        }),
      },
      cashing = Immutable.Map({
        ClientID : 2,
        Total    : 20,
      }),
      result = reducer(initialState, deleteCashing(cashing));

    expect(result).toEqual({
      data: Immutable.Map({
        "1": Immutable.Map({
          ID         : 1,
          AmountFrom : 10,
        }),
        "2": Immutable.Map({
          ID         : 2,
          AmountFrom : 25,
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
          Name : "Client 8",
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

  it("selects the client", () => {
    const
      client = Immutable.Map({
        ID   : 6,
        Name : "Client 6",
      }),
      state = {
        companyClients: {
          data: Immutable.Map({
            "6": client,
          }),
        },
      };

    expect(getClient(state, "6")).toEqual(client);
  });
  it("getClientsAreFetched", () => {
    expect(
      getClientsAreFetched({
        companyClients: {
          error    : noError,
          fetching : false,
          fetched  : true,
        },
      })
    ).toEqual(true);

    expect(
      getClientsAreFetched({
        companyClients: {
          error    : "This is an error",
          fetching : true,
          fetched  : false,
        },
      })
    ).toEqual(false);
  });
  it("getClientsAreFetching", () => {
    expect(
      getClientsAreFetching({
        companyClients: {
          error    : noError,
          fetching : true,
        },
      })
    ).toEqual(true);

    expect(
      getClientsAreFetching({
        companyClients: {
          error    : "This is an error",
          fetching : false,
        },
      })
    ).toEqual(false);
  });
  it("getClientsHaveError", () => {
    expect(
      getClientsHaveError({
        companyClients: {
          error: "This is an error",
        },
      })
    ).toEqual(true);

    expect(
      getClientsHaveError({
        companyClients: {
          error: noError,
        },
      })
    ).toEqual(false);
  });
  it("getClientsShouldFetch", () => {
    expect(
      getClientsShouldFetch({
        companyInfo: {
          fetching : false,
          fetched  : true,
          error    : noError,
        },
        companyClients: {
          error    : noError,
          fetching : false,
          fetched  : false,
        },
      })
    ).toEqual(true);

    expect(
      getClientsShouldFetch({
        companyInfo: {
          fetching : true,
          fetched  : false,
          error    : "Problem",
        },
        companyClients: {
          error    : "Problem",
          fetching : true,
          fetched  : true,
        },
      })
    ).toEqual(false);
  });
  it("getClients", () => {
    expect(
      getClients({
        companyClients: {
          data: Immutable.Map({
            "4": Immutable.Map({
              ID   : 4,
              Name : "Țânțar Ion",
            }),
            "3": Immutable.Map({
              ID   : 3,
              Name : "popescu iliescu",
            }),
            "7": Immutable.Map({
              ID   : 7,
              Name : "Alina",
            }),
          }),
        },
      })
    ).toEqual(Immutable.List([
      Immutable.Map({
        ID   : 3,
        Name : "popescu iliescu",
      }),
      Immutable.Map({
        ID   : 4,
        Name : "Țânțar Ion",
      }),
      Immutable.Map({
        ID   : 7,
        Name : "Alina",
      }),
    ]));
  });
  it("getClientsSorted", () => {
    expect(
      getClientsSorted({
        companyClients: {
          data: Immutable.Map({
            "4": Immutable.Map({
              ID   : 4,
              Name : "Țânțar Ion",
            }),
            "3": Immutable.Map({
              ID   : 3,
              Name : "popescu iliescu",
            }),
            "7": Immutable.Map({
              ID   : 7,
              Name : "Alina",
            }),
          }),
        },
      })
    ).toEqual(Immutable.List([
      Immutable.Map({
        ID   : 7,
        Name : "Alina",
      }),
      Immutable.Map({
        ID   : 3,
        Name : "popescu iliescu",
      }),
      Immutable.Map({
        ID   : 4,
        Name : "Țânțar Ion",
      }),
    ]));
  });
  describe(("getClientsFilteredByName"), () => {
    const
      state = {
        companyClients: {
          data: Immutable.Map({
            "3": Immutable.Map({
              ID   : 3,
              Name : "Zula",
            }),
            "2": Immutable.Map({
              ID   : 2,
              Name : "Trila",
            }),
            "1": Immutable.Map({
              ID   : 1,
              Name : "Antila",
            }),
          }),
        },
      };

    describe("given an empty string", () => {
      it("returns all the clients", () => {
        expect(
          getClientsFilteredByName(state, "")
        ).toEqual(Immutable.List([
          Immutable.Map({
            ID   : 1,
            Name : "Antila",
          }),
          Immutable.Map({
            ID   : 2,
            Name : "Trila",
          }),
          Immutable.Map({
            ID   : 3,
            Name : "Zula",
          }),
        ]));
      });
    });
    describe("given a non-empty string", () => {
      it("returns a sorted list filtered by the name", () => {
        expect(
          getClientsFilteredByName(state, "i")
        ).toEqual(Immutable.List([
          Immutable.Map({
            ID   : 1,
            Name : "Antila",
          }),
          Immutable.Map({
            ID   : 2,
            Name : "Trila",
          }),
        ]));

        expect(
          getClientsFilteredByName(state, "la")
        ).toEqual(Immutable.List([
          Immutable.Map({
            ID   : 1,
            Name : "Antila",
          }),
          Immutable.Map({
            ID   : 2,
            Name : "Trila",
          }),
          Immutable.Map({
            ID   : 3,
            Name : "Zula",
          }),
        ]));
      });
    });
  });
});
