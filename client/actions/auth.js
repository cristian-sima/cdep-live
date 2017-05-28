// @flow

import type { Action } from "types";

import { signOff as signOffRequest } from "request";

export const showCaptcha = (payload : { id: string ; name : string }) : Action => ({
  type: "SHOW_CAPTCHA",
  payload,
});

export const hideCaptcha = (payload : string) : Action => ({
  type: "HIDE_CAPTCHA",
  payload,
});

export const connectAccount = (payload : any) : Action => ({
  type: "ACCOUNT_CONNECTED",
  payload,
});

export const changePassword = () : Action => ({
  type: "CHANGE_PASSWORD",
});

export const cancelSignOff = () : Action => ({
  type: "CANCEL_SIGN_OFF",
});

export const signOff = () : Action => ({
  type    : "SIGN_OFF",
  payload : signOffRequest(),
});

export const confirmSignOff = () : Action => ({
  type: "CONFIRM_SIGN_OFF",
});
