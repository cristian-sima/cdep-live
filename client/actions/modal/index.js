// @flow

import type { Action, Emit } from "types";

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

export const showItemDetailsModal = (id : string) : Action => (
  createModal("ITEM_DETAILS", {
    id,
  })
);

export const showCommentModal = (emit : Emit) : Action => (
  createModal("COMMENT_BOX", {
    emit,
  })
);
