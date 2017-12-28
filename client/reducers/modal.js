// @flow

import type { Action, ModalState } from "types";

import * as Immutable from "immutable";

const initialState = Immutable.List();

const
  showModal = (state : ModalState, { payload : { modalType, modalProps } }) => (
    state.push({
      type  : modalType,
      props : modalProps,
    })
  ),
  hideModal = (state : ModalState) => (
    state.pop()
  ),
  selectItem = (state : ModalState) => (
    state.filter((item) => item.type === "COMMENT_BOX")
  );

const reducer = (state : ModalState = initialState, action : Action) => {
  switch (action.type) {
    case "SHOW_MODAL":
      return showModal(state, action);

    case "HIDE_MODAL":
      return hideModal(state);

    case "SELECT_ITEM":
      return selectItem(state);

    case "UPDATING_LIST":
      return state.clear();

    default:
      return state;
  }
};

export default reducer;
