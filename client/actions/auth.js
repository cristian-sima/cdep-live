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
