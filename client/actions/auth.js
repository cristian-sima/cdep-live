// @flow

import type { Action } from "types";

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
