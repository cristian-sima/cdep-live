// @flow

import type { Dispatch } from "types";

type UpdateBarPropTypes = {
  updatingList: () => void;
};

import React from "react";
import { connect } from "react-redux";

import {
  updatingList as updatingListAction,
} from "actions";

const
  mapDispatchToProps = (dispatch : Dispatch, { emit }) => ({
    updatingList () {
      dispatch(updatingListAction());
      setTimeout(() => {
        emit("UPDATING_LIST");
      });
    },
  });

const UpdateBar = ({ updatingList } : UpdateBarPropTypes) => (
  <div className="mb-2 text-right">
    <button
      className="btn btn-danger btn-sm"
      onClick={updatingList}
      type="button">
      {"Actualizează ordinea de zi"}
    </button>
  </div>
);

export default connect(null, mapDispatchToProps)(UpdateBar);
