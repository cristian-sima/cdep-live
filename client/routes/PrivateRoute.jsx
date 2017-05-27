// @flow

import type { State } from "types";

type PrivateRoutePropTypes = {
  component: any;
  isConnected: bool;
  location: string;
}

import React from "react";

import { Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { getIsAccountConnected } from "reducers";

import Login from "../components/Login";

import UserList from "../components/UserList";
import Wall from "../components/Wall";

const mapStateToProps = (state : State) => ({
  isConnected: getIsAccountConnected(state),
});

const PrivateRoute = (props : PrivateRoutePropTypes) => {
  if (!props.isConnected) {
    return (
      <Login {...props} />
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
