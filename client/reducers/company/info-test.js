/* eslint-disable max-lines, no-undefined, no-magic-numbers */

import reducer, {
  getCurrentCompany,
  getCompanyToggleModuleIsFetching,
  getCompanyHasToggleModuleError,
  getCompanyIsFetched,
  getCompanyIsFetching,
  getCompanyHasFetchingError,
  getCompanyID,
  getCompanyModules,
  getCompanyShouldFetch,
} from "./info";

import * as Immutable from "immutable";

import { noError } from "utility/others";

import {
  toggleCompanyState,
  deleteCompany,
} from "actions";

describe("company/info reducer", () => {
  it("returns the initial state", () => {
    const result = reducer(undefined, { type: "" });

    expect(result).toEqual({
      error    : noError,
      fetched  : false,
      fetching : false,

      company: Immutable.Map(),

      toggleModuleIsFetching : false,
      toggleModuleError      : noError,
    });
  });
  it("handles FETCH_CURRENT_COMPANY_INFO_PENDING", () => {
    const
      initialState = {
        error    : "some error",
        fetched  : false,
        fetching : false,

        company: Immutable.Map({
          ID: "1",
        }),

        toggleModuleIsFetching : true,
        toggleModuleError      : "Problem",
      },
      result = reducer(initialState, { type: "FETCH_CURRENT_COMPANY_INFO_PENDING" });

    expect(result).toEqual({
      error    : noError,
      fetched  : false,
      fetching : true,

      company: Immutable.Map(),

      toggleModuleIsFetching : false,
      toggleModuleError      : noError,
    });
  });
  it("handles FETCH_CURRENT_COMPANY_INFO_REJECTED", () => {
    const
      initialState = {
        error    : noError,
        fetching : true,
      },
      error = "Problem",
      result = reducer(initialState, {
        type    : "FETCH_CURRENT_COMPANY_INFO_REJECTED",
        payload : { error },
      });

    expect(result).toEqual({
      error,
      fetching: false,
    });
  });
  it("handles FETCH_CURRENT_COMPANY_INFO_FULFILLED", () => {
    const
      company = Immutable.Map({
        ID: 7,
      }),
      initialState = {
        fetched  : false,
        fetching : true,

        company: Immutable.Map(),
      },
      result = reducer(initialState, {
        type    : "FETCH_CURRENT_COMPANY_INFO_FULFILLED",
        payload : company,
      });

    expect(result).toEqual({
      fetched  : true,
      fetching : false,

      company,
    });
  });
  it("handles MODIFY_CURRENT_COMPANY_INFO", () => {
    const
      company = Immutable.Map({
        ID   : 7,
        Name : "Nice Name LTD",
      }),
      initialState = {
        company: Immutable.Map({
          ID   : 7,
          Name : "Company Name LTD",
        }),
      },
      result = reducer(initialState, {
        type    : "MODIFY_CURRENT_COMPANY_INFO",
        payload : company,
      });

    expect(result).toEqual({
      company,
    });
  });
  describe("handles TOGGLE_COMPANY_STATE", () => {
    const
    initialState = {
      toggleModuleIsFetching : false,
      toggleModuleError      : noError,

      company: Immutable.Map({
        ID: 2,
      }),
    };

    it("do not modify if the ID of company is not the current one", () => {
      const
        data = Immutable.Map({
          ID: 1,
        }),
        result = reducer(initialState, toggleCompanyState(data));

      expect(result).toEqual(initialState);
    });
    it("do not modify if the current company is not fetched", () => {
      const
        data = Immutable.Map({
          ID: 2,
        }),
        initial = {
          ...initialState,
          fetched: false,
        },
        result = reducer(initial, toggleCompanyState(data));

      expect(result).toEqual(initial);
    });
    it("clears all information if the current company is fetched and it is modified", () => {
      const
        data = Immutable.Map({
          ID: 2,
        }),
        result = reducer(initialState, toggleCompanyState(data));

      expect(result).toEqual({
        toggleModuleIsFetching : false,
        toggleModuleError      : noError,

        company: Immutable.Map({
          ID: 2,
        }),
      });
    });
  });
  describe("handles DELETE_COMPANY", () => {
    const
    initialState = {
      error    : noError,
      fetched  : true,
      fetching : false,

      company: Immutable.Map({
        ID: 2,
      }),

      toggleModuleIsFetching : false,
      toggleModuleError      : noError,
    };

    it("do not modify if the ID of company is not the current one", () => {
      const
        data = Immutable.Map({
          ID: 1,
        }),
        result = reducer(initialState, deleteCompany(data));

      expect(result).toEqual(initialState);
    });
    it("do not modify if the current company is not fetched", () => {
      const
        data = Immutable.Map({
          ID: 2,
        }),
        initial = {
          ...initialState,
          fetched: false,
        },
        result = reducer(initial, deleteCompany(data));

      expect(result).toEqual(initial);
    });
    it("clears all information if the current company is fetched and it is modified", () => {
      const
        data = Immutable.Map({
          ID: 2,
        }),
        result = reducer(initialState, deleteCompany(data));

      expect(result).toEqual({
        error    : noError,
        fetched  : false,
        fetching : false,

        company: Immutable.Map(),

        toggleModuleIsFetching : false,
        toggleModuleError      : noError,
      });
    });
  });
  it("getCurrentCompany", () => {
    const
      company = Immutable.Map({
        ID: 7,
      }),
      state = {
        companyInfo: {
          company,
        },
      };

    expect(getCurrentCompany(state)).toEqual(company);
  });
  it("getCompanyToggleModuleIsFetching", () => {
    const
    state = {
      companyInfo: {
        toggleModuleIsFetching: true,
      },
    };

    expect(getCompanyToggleModuleIsFetching(state)).toEqual(true);
  });
  describe("getCompanyIsFetched", () => {
    it("it detects when it is not fetched", () => {
      const
      state = {
        companyInfo: {
          fetching : true,
          fetched  : false,
          error    : "Problem",
        },
      };

      expect(getCompanyIsFetched(state)).toEqual(false);
    });
    it("it detects when is fetched", () => {
      const
      state = {
        companyInfo: {
          fetching : false,
          fetched  : true,
          error    : noError,
        },
      };

      expect(getCompanyIsFetched(state)).toEqual(true);
    });
  });
  describe("getCompanyIsFetching", () => {
    it("it detects when it is not fetching", () => {
      const
      state = {
        companyInfo: {
          fetching : false,
          error    : "Problem",
        },
      };

      expect(getCompanyIsFetching(state)).toEqual(false);
    });
    it("it detects when is fetching", () => {
      const
      state = {
        companyInfo: {
          fetching : true,
          error    : noError,
        },
      };

      expect(getCompanyIsFetching(state)).toEqual(true);
    });
  });
  describe("getCompanyHasFetchingError", () => {
    it("detects errros", () => {
      const
      state = {
        companyInfo: {
          error: "This is a problem",
        },
      };

      expect(getCompanyHasFetchingError(state)).toEqual(true);
    });
    it("detects no errors", () => {
      const
      state = {
        companyInfo: {
          error: noError,
        },
      };

      expect(getCompanyHasFetchingError(state)).toEqual(false);
    });
  });
  it("getCompanyID", () => {
    const
    state = {
      companyInfo: {
        company: Immutable.Map({
          ID: 666,
        }),
      },
    };

    expect(getCompanyID(state)).toEqual(666);
  });
  describe("getCompanyModules", () => {
    it("returns an empty string if there are no modules", () => {
      const
      state = {
        companyInfo: {
          company: Immutable.Map(),
        },
      };

      expect(getCompanyModules(state)).toEqual("");
    });
    it("returns the modules if they exist", () => {
      const
      state = {
        companyInfo: {
          company: Immutable.Map({
            Modules: "invoices",
          }),
        },
      };

      expect(getCompanyModules(state)).toEqual("invoices");
    });
  });
  describe("getCompanyHasToggleModuleError", () => {
    it("detects errros", () => {
      const
        toggleModuleError = "This is a problem",
        state = {
          companyInfo: {
            toggleModuleError,
          },
        };

      expect(getCompanyHasToggleModuleError(state)).toEqual(true);
    });
    it("detects no errors", () => {
      const
        toggleModuleError = noError,
        state = {
          companyInfo: {
            toggleModuleError,
          },
        };

      expect(getCompanyHasToggleModuleError(state)).toEqual(false);
    });
  });
  describe("getCompanyShouldFetch", () => {
    describe("given account is not fetched, or it has error fetching or is fetching", () => {
      it("returns false", () => {
        const
          state = {
            account: {
              fetched: false,
            },
            companyInfo: {
              error    : "Problem",
              fetching : true,
            },
          },
          newID = 0;

        expect(getCompanyShouldFetch(state)(newID)).toEqual(false);
      });
    });
    describe("given the account is fetched, it has no error and it is not fetching", () => {
      describe("given the new ID is 0", () => {
        it("returns true", () => {
          const
            state = {
              account: {
                fetched: true,
              },
              companyInfo: {
                fetched  : true,
                error    : noError,
                fetching : false,
                company  : Immutable.Map(),
              },
            },
            newID = 0;

          expect(getCompanyShouldFetch(state)(newID)).toEqual(true);
        });
      });
      describe("given the new ID is not 0", () => {
        describe("given the new ID is not the same ", () => {
          it("returns true", () => {
            const
              state = {
                account: {
                  fetched: true,
                },
                companyInfo: {
                  fetched  : true,
                  error    : noError,
                  fetching : false,
                  company  : Immutable.Map({
                    ID: 7,
                  }),
                },
              },
              newID = 8;

            expect(getCompanyShouldFetch(state)(newID)).toEqual(true);
          });
        });
        describe("given the new ID is the same", () => {
          describe("given information are not fetched", () => {
            it("returns true", () => {
              const
                state = {
                  account: {
                    fetched: true,
                  },
                  companyInfo: {
                    fetched  : false,
                    error    : noError,
                    fetching : false,
                    company  : Immutable.Map({
                      ID: 8,
                    }),
                  },
                },
                newID = 8;

              expect(getCompanyShouldFetch(state)(newID)).toEqual(true);
            });
          });
          describe("given information is fetched", () => {
            it("returns false", () => {
              const
                state = {
                  account: {
                    fetched: true,
                  },
                  companyInfo: {
                    fetched  : true,
                    error    : noError,
                    fetching : false,
                    company  : Immutable.Map({
                      ID: 8,
                    }),
                  },
                },
                newID = 8;

              expect(getCompanyShouldFetch(state)(newID)).toEqual(false);
            });
          });
        });
      });
    });
  });
});
