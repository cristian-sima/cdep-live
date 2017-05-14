
/* eslint-disable no-undefined, no-magic-numbers */

import reducer, {
  getPermission,
  getPermissionsAreFetched,
  getPermissionsAreFetching,
  getPermissionsHasError,
  getPermissionsShouldFetch,
  getPermissions,
} from "./permissions";

import * as Immutable from "immutable";
import * as matchers from "jest-immutable-matchers";
import { noError } from "utility";

import { addPermission, deletePermission, COMPANY_RESET_DATA } from "actions";

describe("company/permission reducer", () => {
  beforeEach(() => {
    jest.addMatchers(matchers);
  });

  it("returns the initial state", () => {
    const result = reducer(undefined, { type: "" });

    expect(result).toEqual({
      fetched  : false,
      fetching : false,
      error    : noError,

      data: Immutable.Map(),
    });
  });
  it("should handle COMPANY_FETCH_PERMISSIONS_PENDING", () => {
    const
      initialState = {
        error    : "Problem",
        fetching : false,
      },
      result = reducer(initialState, { type: "COMPANY_FETCH_PERMISSIONS_PENDING" });

    expect(result).toEqual({
      error    : noError,
      fetching : true,
    });
  });
  it("should handle COMPANY_FETCH_PERMISSIONS_REJECTED", () => {
    const
      initialState = {
        error    : noError,
        fetching : true,
      },
      error = "This is an error",
      payload = {
        type    : "COMPANY_FETCH_PERMISSIONS_REJECTED",
        payload : { error },
      },
      result = reducer(initialState, payload);

    expect(result).toEqual({
      fetching: false,
      error,
    });
  });
  it("should handle COMPANY_FETCH_PERMISSIONS_FULFILLED", () => {
    const
      initialState = {
        fetching : true,
        fetched  : false,
        data     : Immutable.Map(),
      },
      action = {
        type    : "COMPANY_FETCH_PERMISSIONS_FULFILLED",
        payload : {
          entities: Immutable.Map({
            "6": Immutable.Map({
              ID: 6,
            }),
            "7": Immutable.Map({
              ID: 7,
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
          ID: 6,
        }),
        "7": Immutable.Map({
          ID: 7,
        }),
      }),
    });
  });
  it("should handle COMPANY_ADD_PERMISSION", () => {
    const
      initialState = {
        data: Immutable.Map({
          "5": Immutable.Map({
            ID: 5,
          }),
          "7": Immutable.Map({
            ID: 7,
          }),
        }),
      },
      permission = Immutable.Map({
        ID: 4,
      }),
      result = reducer(initialState, addPermission(permission));

    expect(result.data).toEqualImmutable(Immutable.Map({
      "5": Immutable.Map({
        ID: 5,
      }),
      "7": Immutable.Map({
        ID: 7,
      }),
      "4": Immutable.Map({
        ID: 4,
      }),
    }));
  });
  it("should handle COMPANY_DELETE_PERMISSION", () => {
    const
      initialState = {
        data: Immutable.Map({
          "5": Immutable.Map({
            ID: 5,
          }),
          "7": Immutable.Map({
            ID: 7,
          }),
          "4": Immutable.Map({
            ID: 4,
          }),
        }),
      },
      result = reducer(initialState, deletePermission(7));

    expect(result).toEqual({
      data: Immutable.Map({
        "5": Immutable.Map({
          ID: 5,
        }),
        "4": Immutable.Map({
          ID: 4,
        }),
      }),
    });
  });
  it("handles the COMPANY_RESET_DATA", () => {
    const initialState = {
      fetched  : true,
      fetching : true,
      error    : "Problem",

      data: Immutable.Map({
        "4": Immutable.Map({
          ID: 4,
        }),
        "7": Immutable.Map({
          ID: 7,
        }),
      }),
    };

    const result = reducer(initialState, { type: COMPANY_RESET_DATA });

    expect(result).toEqual({
      fetched  : false,
      fetching : false,
      error    : noError,

      data: Immutable.Map(),
    });
  });

  it("selects the permission", () => {
    const
      permission = Immutable.Map({
        ID: 6,
      }),
      state = {
        companyPermissions: {
          data: Immutable.Map({
            "6": permission,
          }),
        },
      };

    expect(getPermission(state, "6")).toEqual(permission);
  });
  it("getPermissionsAreFetched", () => {
    expect(
      getPermissionsAreFetched({
        companyPermissions: {
          error    : noError,
          fetching : false,
          fetched  : true,
        },
      })
    ).toEqual(true);

    expect(
      getPermissionsAreFetched({
        companyPermissions: {
          error    : "This is an error",
          fetching : true,
          fetched  : false,
        },
      })
    ).toEqual(false);
  });
  it("getPermissionsAreFetching", () => {
    expect(
      getPermissionsAreFetching({
        companyPermissions: {
          error    : noError,
          fetching : true,
        },
      })
    ).toEqual(true);

    expect(
      getPermissionsAreFetching({
        companyPermissions: {
          error    : "This is an error",
          fetching : false,
        },
      })
    ).toEqual(false);
  });
  it("getPermissionsHasError", () => {
    expect(
      getPermissionsHasError({
        companyPermissions: {
          error: "This is an error",
        },
      })
    ).toEqual(true);

    expect(
      getPermissionsHasError({
        companyPermissions: {
          error: noError,
        },
      })
    ).toEqual(false);
  });
  it("getPermissionsShouldFetch", () => {
    expect(
      getPermissionsShouldFetch({
        companyInfo: {
          fetching : false,
          fetched  : true,
          error    : noError,
        },
        companyPermissions: {
          error    : noError,
          fetching : false,
          fetched  : false,
        },
      })
    ).toEqual(true);

    expect(
      getPermissionsShouldFetch({
        companyInfo: {
          fetching : true,
          fetched  : false,
          error    : "Problem",
        },
        companyPermissions: {
          error    : "Problem",
          fetching : true,
          fetched  : true,
        },
      })
    ).toEqual(false);
  });
  it("getPermissions", () => {
    expect(
      getPermissions({
        companyPermissions: {
          data: Immutable.Map({
            "4": Immutable.Map({
              ID: 4,
            }),
            "3": Immutable.Map({
              ID: 3,
            }),
            "7": Immutable.Map({
              ID: 7,
            }),
          }),
        },
      })
    ).toEqual(Immutable.List([
      Immutable.Map({
        ID: 3,
      }),
      Immutable.Map({
        ID: 4,
      }),
      Immutable.Map({
        ID: 7,
      }),
    ]));
  });
});
