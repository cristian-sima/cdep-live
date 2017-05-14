// @flow

import type { State, AuthState } from "types";

import * as Immutable from "immutable";

const initialState = {
  captchas: Immutable.Map(),
};

const
  showCaptcha = (state : AuthState, { payload : { name, id } }) => ({
    ...state,
    captchas: state.captchas.set(name, id),
  }),
  hideCaptcha = (state : AuthState, { payload }) => ({
    ...state,
    captchas: state.captchas.delete(payload),
  });

const authReducer = (state : AuthState = initialState, action : any) => {
  switch (action.type) {
    case "SHOW_CAPTCHA":
      return showCaptcha(state, action);

    case "HIDE_CAPTCHA":
      return hideCaptcha(state, action);

    default:
      return state;
  }
};

export const
  getAuthCaptcha = (state : State, name : string) => state.auth.captchas.get(name) || "";

export default authReducer;
