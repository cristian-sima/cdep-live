// @flow

import type { State } from "types";

type PrivateRoutePropTypes = {
  component: any;
  isConnected: bool;
  location: string;
  account: any;
}

import React from "react";

import { Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { getIsAccountConnected, getCurrentAccount } from "reducers";

import Login from "../components/Login";

import UserList from "../components/UserList";
import Wall from "../components/Wall";
import ChangePassword from "../components/ChangePassword";

const mapStateToProps = (state : State) => ({
  isConnected : getIsAccountConnected(state),
  account     : getCurrentAccount(state),
});

const PrivateRoute = (props : PrivateRoutePropTypes) => {
  const { isConnected, account } = props;

  if (!isConnected) {
    return (
      <Login {...props} />
    );
  }

  if (account.get("requireChange")) {
    return (
      <ChangePassword {...props} />
    );
  }

  return (
    <div>
      <Route component={Wall} exact path="/" />
      <Route component={UserList} path="/user-list" />
    </div>
  );
};

export default withRouter(connect(mapStateToProps)(PrivateRoute));
