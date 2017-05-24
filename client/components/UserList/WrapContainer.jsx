// @flow

import type { Dispatch, State } from "types";

type WrapContainerPropTypes = {
  updateList: () => void;
  isUpdating: bool;
  hasError: bool;
};

import React from "react";
import { Button } from "reactstrap";
import { connect } from "react-redux";

import { updateUsers } from "actions";
import { getIsUpdatingUserList, getErrorUpdateUsers } from "reducers";

import ListContainer from "./ListContainer";
import { LoadingSmallMessage } from "../Messages";

const
  mapStateToProps = (state : State) => ({
    isUpdating : getIsUpdatingUserList(state),
    hasError   : getErrorUpdateUsers(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    updateList () {
      dispatch(updateUsers());
    },
  });

class WrapContainer extends React.Component {
  props: WrapContainerPropTypes;

  shouldComponentUpdate (nextProps : WrapContainerPropTypes) {
    return (
      this.props.isUpdating !== nextProps.isUpdating ||
      this.props.hasError !== nextProps.hasError
    );
  }

  render () {
    const { updateList, isUpdating, hasError } = this.props;

    return (
      <div className="container mt-3">
        <h1>{"Listă utilizatori"}</h1>
        <hr />
        <div>
          <Button
            color="primary"
            disabled={isUpdating}
            onClick={updateList}>
            {
              isUpdating ? "Actualizez lista..." : "Actualizează datele"
            }
          </Button>
          {" "}
          {
            hasError ? (
              <div className="alert alert-warning mt-2">
                {"Nu am putut actualiza lista de utilizatori"}
              </div>
            ) : null
          }
          {
            isUpdating ? (
              <LoadingSmallMessage />
            ) : (
              <div className="mt-2">
                <ListContainer />
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WrapContainer);
