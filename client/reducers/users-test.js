/* eslint-disable no-undefined, no-magic-numbers */

import reducer, {
  getErrorUpdateUsers,
  getIsUpdatingUserList,
} from "./users";

import { noError } from "utility";

describe("users reducer", () => {
  it("returns the initial state", () => {
    const result = reducer(undefined, { type: "" });

    expect(result).toEqual({
      isUpdating  : false,
      errorUpdate : noError,
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
});
