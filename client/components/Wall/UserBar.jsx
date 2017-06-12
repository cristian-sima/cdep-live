// @flow

import type { Dispatch, State } from "types";

type UpdateBarPropTypes = {
  showButton: boolean;
  showConfirmModal: () => void;
};

import { Link, withRouter } from "react-router-dom";
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
  <div className="mb-2 container">
    <div className="row">
      <div className="col">
        <Link to="/current">
          {"Proiect curent"}
        </Link>
      </div>
      <div className="col text-right">
        {
          showButton ? (
            <button className="btn btn-link btn-sm" onClick={showConfirmModal}>
              <span>
                {"Alege sugestiile"}
                <span className="hidden-sm-down">{" grupului"}</span>
              </span>
            </button>
          ) : null
        }
      </div>
    </div>
  </div>
);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UpdateBar));
