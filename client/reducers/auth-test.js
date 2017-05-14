/* eslint-disable no-undefined, no-magic-numbers */

import reducer, {
  getAuthCaptcha,
} from "./auth";

import * as Immutable from "immutable";

import { showCaptcha, hideCaptcha } from "actions";

describe("account/auth reducer", () => {
  it("returns the initial state", () => {
    const result = reducer(undefined, { type: "" });

    expect(result).toEqual({
      captchas: Immutable.Map(),
    });
  });

  it("handles SHOW_CAPTCHA", () => {
    const
      initialState = {
        captchas: Immutable.Map(),
      },
      result = reducer(initialState, showCaptcha({
        id   : "190340239043233232",
        name : "login",
      }));

    expect(result).toEqual({
      captchas: Immutable.Map({
        "login": "190340239043233232",
      }),
    });
  });

  it("handles HIDE_CAPTCHA", () => {
    const
      initialState = {
        captchas: Immutable.Map({
          "login": "190340239043233232",
        }),
      },
      result = reducer(initialState, hideCaptcha("login"));

    expect(result).toEqual({
      captchas: Immutable.Map(),
    });
  });

  it("getAuthCaptcha", () => {
    const
      state = {
        auth: {
          captchas: Immutable.Map({
            "reset" : "123123123123123",
            "login" : "12313123123",
          }),
        },
      },
      result = getAuthCaptcha(state, "reset");

    expect(result).toEqual("123123123123123");
  });
});
