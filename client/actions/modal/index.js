// @flow

import type { Action } from "types";

export const createModal = (modalType : string, modalProps? : any) : Action => ({
  type    : "SHOW_MODAL",
  payload : {
    modalType,
    modalProps,
  },
});

export const hideModal = () : Action => ({
  type: "HIDE_MODAL",
});

export * from "./account";
export * from "./company";
