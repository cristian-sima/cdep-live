// @flow
/* eslint-disable react/require-optimization */

import type { State, Dispatch } from "types";

type PrivateRoutePropTypes = {
  component: any;
  isConnected: bool;
  location: string;
  account: any;

  isReconnecting: bool;
  shouldReconnect: bool;
  performReconnect: () => void;
}

import React from "react";

import { Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import {
  performReconnect as performReconnectAction,
} from "actions";

import {
  getIsAccountConnected,
  getCurrentAccount,
  getShouldReconnect,
  getIsReconnecting,
} from "reducers";

import Login from "../components/Login";

import UserList from "../components/UserList";
import Wall from "../components/Wall";
import ChangePassword from "../components/ChangePassword";
import { LoadingMessage } from "../components/Messages";

const
  mapStateToProps = (state : State) => ({
    isReconnecting  : getIsReconnecting(state),
    shouldReconnect : getShouldReconnect(state),

    isConnected : getIsAccountConnected(state),
    account     : getCurrentAccount(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    performReconnect () {
      dispatch(performReconnectAction());
    },
  });


class PrivateRoute extends React.Component {
  props: PrivateRoutePropTypes;

  componentWillMount () {
    const { shouldReconnect, performReconnect } = this.props;

    if (shouldReconnect) {
      performReconnect();
    }
  }


  render () {
    const { isConnected, account, isReconnecting } = this.props;

    if (isReconnecting) {
      return (
        <LoadingMessage message="Așteaptă..." />
      );
    }

    if (!isConnected) {
      return (
        <Login {...this.props} />
      );
    }

    if (account.get("requireChange")) {
      return (
        <ChangePassword {...this.props} />
      );
    }

    return (
      <div>
        <Route component={Wall} exact path="/" />
        <Route component={UserList} path="/user-list" />
      </div>
    );
  }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PrivateRoute));
