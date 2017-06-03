// @flow

import type { Action, ModalState } from "types";

import * as Immutable from "immutable";

const initialState = Immutable.Stack();

const
  showModal = (state : ModalState, { payload : { modalType, modalProps } }) => (
    state.push({
      type  : modalType,
      props : modalProps,
    })
  ),
  hideModal = (state : ModalState) => (
    state.pop()
  );

const reducer = (state : ModalState = initialState, action : Action) => {
  switch (action.type) {
    case "SHOW_MODAL":
      return showModal(state, action);

    case "HIDE_MODAL":
      return hideModal(state, action);

    case "SELECT_ITEM":
      return state.clear();

    default:
      return state;
  }
};

export default reducer;
