// @flow

import type { Dispatch, State } from "types";

type UpdateBarPropTypes = {
  showButton: boolean;

  showConfirmModal: () => void;
};

import React from "react";
import { connect } from "react-redux";

import {
  showButtonsModal,
} from "actions";

import { getShowButtons } from "reducers";

const
  mapStateToProps = (state : State) => ({
    showButton: !getShowButtons(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    showConfirmModal () {
      dispatch(showButtonsModal());
    },
  });

const UpdateBar = ({ showConfirmModal, showButton } : UpdateBarPropTypes) => (
  <div className="mb-2 text-right">
    {
      showButton ? (
        <button className="btn btn-primary" onClick={showConfirmModal}>
          {"Alege sugestiile grupului"}
        </button>
      ) : null
    }
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(UpdateBar);
