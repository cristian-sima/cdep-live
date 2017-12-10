// @flow

import type { Dispatch, State } from "types";

type WrapContainerPropTypes = {
  updateList: () => void;
  isAllowed: bool;
  isUpdating: bool;
  hasError: bool;
};

import React from "react";
import { Redirect } from "react-router-dom";
import { Button } from "reactstrap";
import { connect } from "react-redux";

import { updateUsers } from "actions";
import { getIsUpdatingUserList, getErrorUpdateUsers, getIsAdministratorAccount } from "reducers";

import ListContainer from "./ListContainer";
import { LoadingMessage } from "../Messages";

const
  mapStateToProps = (state : State) => ({
    isUpdating : getIsUpdatingUserList(state),
    hasError   : getErrorUpdateUsers(state),
    isAllowed  : getIsAdministratorAccount(state),
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
      this.props.isAllowed !== nextProps.isAllowed ||
      this.props.hasError !== nextProps.hasError
    );
  }

  render () {
    const { updateList, isUpdating, hasError, isAllowed } = this.props;

    if (!isAllowed) {
      return (
        <Redirect to="/" />
      );
    }

    return (
      <div className="container mt-3">
        <h1>{"Listă utilizatori"}</h1>
        <div className="text-right">
          <Button
            color="danger"
            disabled={isUpdating}
            onClick={updateList}
            size="sm">
            {
              isUpdating ? "Actualizez lista..." : "Actualizează datele"
            }
          </Button>
        </div>
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
            <LoadingMessage message="Actualizez datele..." />
          ) : (
            <div className="mt-2">
              <ListContainer />
            </div>
          )
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WrapContainer);
