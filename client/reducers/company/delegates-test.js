
/* eslint-disable no-undefined, no-magic-numbers */

import reducer, {
  getDelegate,
  getDelegatesAreFetched,
  getDelegatesAreFetching,
  getDelegatesHaveError,
  getDelegatesShouldFetch,
  getDelegates,
  getDelegatesSorted,
} from "./delegates";

import * as Immutable from "immutable";
import { noError } from "utility";

import {
  addDelegate,
  modifyDelegate,
  deleteDelegate,
  COMPANY_RESET_DATA,
 } from "actions";

describe("company/delegates ", () => {

  it("returns the initial state", () => {
    const result = reducer(undefined, { type: "" });

    expect(result).toEqual({
      fetched  : false,
      fetching : false,
      error    : noError,

      data: Immutable.Map(),
    });
  });
  it("should handle COMPANY_FETCH_DELEGATES_PENDING", () => {
    const
      initialState = {
        fetching : false,
        error    : "Problem",
      },
      result = reducer(initialState, { type: "COMPANY_FETCH_DELEGATES_PENDING" });

    expect(result).toEqual({
      fetching : true,
      error    : noError,
    });
  });
  it("should handle COMPANY_FETCH_DELEGATES_REJECTED", () => {
    const
      initialState = {
        fetching : true,
        error    : noError,
      },
      error = "This is an error",
      payload = {
        type    : "COMPANY_FETCH_DELEGATES_REJECTED",
        payload : { error },
      },
      result = reducer(initialState, payload);

    expect(result).toEqual({
      fetching: false,
      error,
    });
  });
  it("should handle COMPANY_FETCH_DELEGATES_FULFILLED", () => {
    const
      initialState = {
        fetching : true,
        fetched  : false,

        data: Immutable.Map(),
      },
      action = {
        type    : "COMPANY_FETCH_DELEGATES_FULFILLED",
        payload : {
          entities: Immutable.Map({
            "6": Immutable.Map({
              ID   : 6,
              Name : "Delegate 6",
            }),
            "7": Immutable.Map({
              ID   : 7,
              Name : "Delegate 7",
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
          Name : "Delegate 6",
        }),
        "7": Immutable.Map({
          ID   : 7,
          Name : "Delegate 7",
        }),
      }),
    });
  });
  it("should handle COMPANY_ADD_DELEGATE", () => {
    const
      initialState = {
        data: Immutable.Map(),
      },
      delegate = Immutable.Map({
        ID       : "4",
        FullName : "Delegate",
      }),
      result = reducer(initialState, addDelegate(delegate));

    expect(result).toEqual({
      data: Immutable.Map({
        "4": Immutable.Map({
          ID       : "4",
          FullName : "Delegate",
        }),
      }),
    });
  });
  it("should handle COMPANY_MODIFY_DELEGATE", () => {
    const
      initialState = {
        data: Immutable.Map({
          "5": Immutable.Map({
            ID   : 5,
            Name : "Delegate 5",
          }),
          "7": Immutable.Map({
            ID   : 7,
            Name : "Delegate 7",
          }),
          "4": Immutable.Map({
            ID   : 4,
            Name : "Delegate 44",
          }),
        }),
      },
      delegate = Immutable.Map({
        ID   : 4,
        Name : "New name",
      }),
      result = reducer(initialState, modifyDelegate(delegate));

    expect(result).toEqual({
      data: Immutable.Map({
        "4": Immutable.Map({
          ID   : 4,
          Name : "New name",
        }),
        "5": Immutable.Map({
          ID   : 5,
          Name : "Delegate 5",
        }),
        "7": Immutable.Map({
          ID   : 7,
          Name : "Delegate 7",
        }),
      }),
    });
  });
  it("should handle COMPANY_DELETE_DELEGATE", () => {
    const
      initialState = {
        data: Immutable.Map({
          "8": Immutable.Map({
            ID       : "8",
            FullName : "Delegate 8",
          }),
          "4": Immutable.Map({
            ID       : "4",
            FullName : "Delegate 4",
          }),
        }),
      },
      result = reducer(initialState, deleteDelegate(4));

    expect(result).toEqual({
      data: Immutable.Map({
        "8": Immutable.Map({
          ID       : "8",
          FullName : "Delegate 8",
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
          ID       : "8",
          FullName : "Delegate 8",
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

  it("selects the delegate", () => {
    const
      delegate = Immutable.Map({
        ID       : 6,
        FullName : "Delegate 6",
      }),
      state = {
        companyDelegates: {
          data: Immutable.Map({
            "6": delegate,
          }),
        },
      };

    expect(getDelegate(state, "6")).toEqual(delegate);
  });
  it("getDelegatesAreFetched", () => {
    expect(
      getDelegatesAreFetched({
        companyDelegates: {
          error    : noError,
          fetching : false,
          fetched  : true,
        },
      })
    ).toEqual(true);

    expect(
      getDelegatesAreFetched({
        companyDelegates: {
          error    : "This is an error",
          fetching : true,
          fetched  : false,
        },
      })
    ).toEqual(false);
  });
  it("getDelegatesAreFetching", () => {
    expect(
      getDelegatesAreFetching({
        companyDelegates: {
          error    : noError,
          fetching : true,
        },
      })
    ).toEqual(true);

    expect(
      getDelegatesAreFetching({
        companyDelegates: {
          error    : "This is an error",
          fetching : false,
        },
      })
    ).toEqual(false);
  });
  it("getDelegatesHaveError", () => {
    expect(
      getDelegatesHaveError({
        companyDelegates: {
          error: "This is an error",
        },
      })
    ).toEqual(true);

    expect(
      getDelegatesHaveError({
        companyDelegates: {
          error: noError,
        },
      })
    ).toEqual(false);
  });
  it("getDelegatesShouldFetch", () => {
    expect(
      getDelegatesShouldFetch({
        companyInfo: {
          fetching : false,
          fetched  : true,
          error    : noError,
        },
        companyDelegates: {
          error    : noError,
          fetching : false,
          fetched  : false,
        },
      })
    ).toEqual(true);

    expect(
      getDelegatesShouldFetch({
        companyInfo: {
          fetching : true,
          fetched  : false,
          error    : "Problem",
        },
        companyDelegates: {
          error    : "Problem",
          fetching : true,
          fetched  : true,
        },
      })
    ).toEqual(false);
  });
  it("getDelegates", () => {
    expect(
      getDelegates({
        companyDelegates: {
          data: Immutable.Map({
            "4": Immutable.Map({
              ID       : 4,
              FullName : "Țânțar Ion",
            }),
            "3": Immutable.Map({
              ID       : 3,
              FullName : "popescu iliescu",
            }),
            "7": Immutable.Map({
              ID       : 7,
              FullName : "Alina",
            }),
          }),
        },
      })
    ).toEqual(Immutable.List([
      Immutable.Map({
        ID       : 3,
        FullName : "popescu iliescu",
      }),
      Immutable.Map({
        ID       : 4,
        FullName : "Țânțar Ion",
      }),
      Immutable.Map({
        ID       : 7,
        FullName : "Alina",
      }),
    ]));
  });
  it("getDelegatesSorted", () => {
    expect(
      getDelegatesSorted({
        companyDelegates: {
          data: Immutable.Map({
            "4": Immutable.Map({
              ID       : 4,
              FullName : "Țânțar Ion",
            }),
            "3": Immutable.Map({
              ID       : 3,
              FullName : "popescu iliescu",
            }),
            "7": Immutable.Map({
              ID       : 7,
              FullName : "Alina",
            }),
          }),
        },
      })
    ).toEqual(Immutable.List([
      Immutable.Map({
        ID       : 7,
        FullName : "Alina",
      }),
      Immutable.Map({
        ID       : 3,
        FullName : "popescu iliescu",
      }),
      Immutable.Map({
        ID       : 4,
        FullName : "Țânțar Ion",
      }),
    ]));
  });
});
