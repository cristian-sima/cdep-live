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

export const showButtonsModal = () : Action => (
  createModal("SHOW_BUTTONS")
);

export const showItemDetailsModal = (id : string) : Action => (
  createModal("ITEM_DETAILS", {
    id,
  })
);
