/* eslint-disable no-undefined, no-magic-numbers, max-lines */

import reducer, {
  getErrorUpdateUsers,
  getIsUpdatingUserList,
  getUsers,

  getUsersAreFetched,
  getUsersAreFetching,
  getUsersHasError,
  getUsersShouldFetch,
  getIsResetingPassword,
} from "./users";

import * as Immutable from "immutable";

import { noError } from "utility";

describe("users reducer", () => {
  it("returns the initial state", () => {
    const result = reducer(undefined, { type: "" });

    expect(result).toEqual({
      fetched       : false,
      fetching      : false,
      errorFetching : noError,

      isUpdating  : false,
      errorUpdate : noError,

      isResetingPassword: false,

      data: Immutable.Map(),
    });
  });

  it("handles UPDATE_USERS_PENDING", () => {
    const
      initialState = {
        isUpdating  : false,
        errorUpdate : "Possible error",
      },
      result = reducer(initialState, {
        type: "UPDATE_USERS_PENDING",
      });

    expect(result).toEqual({
      isUpdating  : true,
      errorUpdate : noError,
    });
  });

  it("handles UPDATE_USERS_REJECTED", () => {
    const
      initialState = {
        isUpdating  : true,
        errorUpdate : noError,
      },
      result = reducer(initialState, {
        type: "UPDATE_USERS_REJECTED",
      });

    expect(result).toEqual({
      isUpdating  : false,
      errorUpdate : "Problem",
    });
  });

  it("handles FETCH_USERS_PENDING", () => {
    const
      initialState = {
        fetching      : false,
        errorFetching : "Problem",
      },
      result = reducer(initialState, {
        type: "FETCH_USERS_PENDING",
      });

    expect(result).toEqual({
      fetching      : true,
      errorFetching : noError,
    });
  });

  it("handles FETCH_USERS_REJECTED", () => {
    const
      initialState = {
        fetching      : true,
        errorFetching : noError,
      },
      result = reducer(initialState, {
        type    : "FETCH_USERS_REJECTED",
        payload : {
          error: "Problem",
        },
      });

    expect(result).toEqual({
      fetching      : false,
      errorFetching : "Problem",
    });
  });

  it("handles FETCH_USERS_FULFILLED", () => {
    const
      entities = Immutable.Map({
        "12": Immutable.Map({
          "_id": 12,
        }),
      }),
      initialState = {
        fetched  : false,
        fetching : true,

        data: Immutable.Map({}),
      },
      result = reducer(initialState, {
        type    : "FETCH_USERS_FULFILLED",
        payload : {
          entities,
        },
      });

    expect(result).toEqual({
      fetched  : true,
      fetching : false,

      data: entities,
    });
  });

  it("handles SIGN_OFF_FULFILLED", () => {
    const
      initialState = {
        fetched       : true,
        fetching      : true,
        errorFetching : "Problem",

        isUpdating  : true,
        errorUpdate : "Problem",

        isResetingPassword: true,

        data: Immutable.Map({
          "12": Immutable.Map({
            "_id": "12",
          }),
        }),
      },
      result = reducer(initialState, {
        type: "SIGN_OFF_FULFILLED",
      });

    expect(result).toEqual({
      fetched       : false,
      fetching      : false,
      errorFetching : noError,

      isUpdating  : false,
      errorUpdate : noError,

      isResetingPassword: false,

      data: Immutable.Map(),
    });
  });

  it("handles RESET_PASSWORD_PENDING", () => {
    const
      initialState = {
        isResetingPassword: false,
      },
      result = reducer(initialState, {
        type: "RESET_PASSWORD_PENDING",
      });

    expect(result).toEqual({
      isResetingPassword: true,
    });
  });

  it("handles RESET_PASSWORD_REJECTED", () => {
    const
      initialState = {
        isResetingPassword: true,
      },
      result = reducer(initialState, {
        type: "RESET_PASSWORD_REJECTED",
      });

    expect(result).toEqual({
      isResetingPassword: false,
    });
  });

  it("handles RESET_PASSWORD_FULFILLED", () => {
    const
      initialState = {
        isResetingPassword : true,
        data               : Immutable.Map({
          "2": Immutable.Map({
            "_id"               : "2",
            "password"          : "dsfswde f23r23 r4",
            "requireChange"     : false,
            "temporaryPassword" : "",
          }),
          "3": Immutable.Map({
            "_id"               : "3",
            "password"          : "dsdfnsdfsdf4",
            "requireChange"     : false,
            "temporaryPassword" : "",
          }),
        }),
      },
      result = reducer(initialState, {
        type    : "RESET_PASSWORD_FULFILLED",
        payload : {
          temporaryPassword: "1234",
        },
        meta: {
          id: "2",
        },
      });

    expect(result).toEqual({
      isResetingPassword : false,
      data               : Immutable.Map({
        "2": Immutable.Map({
          "_id"               : "2",
          "password"          : "",
          "requireChange"     : true,
          "temporaryPassword" : "1234",
        }),
        "3": Immutable.Map({
          "_id"               : "3",
          "password"          : "dsdfnsdfsdf4",
          "requireChange"     : false,
          "temporaryPassword" : "",
        }),
      }),
    });
  });
});

describe("users getters", () => {
  describe("getErrorUpdateUsers", () => {
    it("recognize a non-error", () => {
      const
        state = {
          users: {
            isUpdating  : false,
            errorUpdate : noError,
          },
        },
        result = getErrorUpdateUsers(state);

      expect(result).toEqual(false);
    });

    it("recognize a error", () => {
      const
        state = {
          users: {
            isUpdating  : false,
            errorUpdate : "This is a problem",
          },
        },
        result = getErrorUpdateUsers(state);

      expect(result).toEqual(true);
    });
  });

  describe("getIsUpdatingUserList", () => {
    it("recognize when it is updating", () => {
      const
        state = {
          users: {
            isUpdating  : true,
            errorUpdate : noError,
          },
        },
        result = getIsUpdatingUserList(state);

      expect(result).toEqual(true);
    });

    it("recognize when not updating", () => {
      const
        state = {
          users: {
            isUpdating  : false,
            errorUpdate : "This is a problem",
          },
        },
        result = getIsUpdatingUserList(state);

      expect(result).toEqual(false);
    });
  });

  it("getUsers", () => {
    const
      state = {
        users: {
          data: Immutable.Map({
            "31": Immutable.Map({
              "_id"   : "31",
              "marca" : "3",
            }),
            "11": Immutable.Map({
              "_id"   : "11",
              "marca" : "1",
            }),
            "21": Immutable.Map({
              "_id"   : "21",
              "marca" : "2",
            }),
          }),
        },
      },
      result = getUsers(state);

    expect(result).toEqual(Immutable.List([
      Immutable.Map({
        "_id"   : "11",
        "marca" : "1",
      }),
      Immutable.Map({
        "_id"   : "21",
        "marca" : "2",
      }),
      Immutable.Map({
        "_id"   : "31",
        "marca" : "3",
      }),
    ]));
  });

  describe("getUsersAreFetched", () => {
    describe("given is fetching", () => {
      it("returns false", () => {
        const
          state = {
            users: {
              fetching: true,
            },
          },
          result = getUsersAreFetched(state);

        expect(result).toEqual(false);
      });
    });
    describe("given is not fetching", () => {
      describe("given they are not fetched", () => {
        it("returns false", () => {
          const
            state = {
              users: {
                fetching : false,
                fetched  : false,
              },
            },
            result = getUsersAreFetched(state);

          expect(result).toEqual(false);
        });
      });
      describe("given they are not fetched", () => {
        describe("given there is an error", () => {
          it("returns false", () => {
            const
              state = {
                users: {
                  fetching      : false,
                  fetched       : true,
                  errorFetching : "Problem",
                },
              },
              result = getUsersAreFetched(state);

            expect(result).toEqual(false);
          });
        });
        describe("given there are no errors", () => {
          it("returns true", () => {
            const
              state = {
                users: {
                  fetching      : false,
                  fetched       : true,
                  errorFetching : noError,
                },
              },
              result = getUsersAreFetched(state);

            expect(result).toEqual(true);
          });
        });
      });
    });
  });

  describe("getUsersAreFetching", () => {
    describe("given they are fetched", () => {
      it("returns false", () => {
        const
          state = {
            users: {
              fetching: false,
            },
          },
          result = getUsersAreFetching(state);

        expect(result).toEqual(false);
      });
    });
    describe("given they are fetched", () => {
      describe("given there is an error", () => {
        it("returns false", () => {
          const
            state = {
              users: {
                fetching      : true,
                errorFetching : "Problem",
              },
            },
            result = getUsersAreFetching(state);

          expect(result).toEqual(false);
        });
      });
      describe("given there is no error", () => {
        it("returns true", () => {
          const
            state = {
              users: {
                fetching      : true,
                errorFetching : noError,
              },
            },
            result = getUsersAreFetching(state);

          expect(result).toEqual(true);
        });
      });
    });
  });
  describe("getUsersHasError", () => {
    it("detects an error", () => {
      const
        state = {
          users: {
            errorFetching: "Problem",
          },
        },
        result = getUsersHasError(state);

      expect(result).toEqual(true);
    });
    it("detects no error", () => {
      const
        state = {
          users: {
            errorFetching: noError,
          },
        },
        result = getUsersHasError(state);

      expect(result).toEqual(false);
    });
  });

  describe("getUsersShouldFetch", () => {
    describe("given it is updating", () => {
      it("should not fetch", () => {
        const
          state = {
            users: {
              isUpdating: true,
            },
          },
          result = getUsersShouldFetch(state);

        expect(result).toEqual(false);
      });
    });
    describe("given it is not updating", () => {
      describe("given they are fetched", () => {
        it("should not fetch", () => {
          const
            state = {
              users: {
                isUpdating    : true,
                isFetching    : false,
                isFetched     : true,
                errorFetching : noError,
              },
            },
            result = getUsersShouldFetch(state);

          expect(result).toEqual(false);
        });
      });
      describe("given they are not fetched", () => {
        describe("given they are fetching", () => {
          it("should not fetch", () => {
            const
              state = {
                users: {
                  isUpdating    : true,
                  isFetching    : true,
                  isFetched     : false,
                  errorFetching : "Problem",
                },
              },
              result = getUsersShouldFetch(state);

            expect(result).toEqual(false);
          });
        });
        describe("given they are not fetching", () => {
          it("should fetch", () => {
            const
              state = {
                users: {
                  isUpdating    : true,
                  isFetching    : false,
                  isFetched     : false,
                  errorFetching : "Problem",
                },
              },
              result = getUsersShouldFetch(state);

            expect(result).toEqual(false);
          });
        });
      });
      //
    });
  });
  describe("getIsResetingPassword", () => {
    it("detects when it is reseting the password", () => {
      const
        state = {
          users: {
            isResetingPassword: true,
          },
        },
        result = getIsResetingPassword(state);

      expect(result).toEqual(true);
    });
  });
});
