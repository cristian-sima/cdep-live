// @flow

import type { State } from "types";

type PrivateRoutePropTypes = {
  component: any;
  isConnected: bool;
  location: string;
}

import React from "react";

import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { getIsAccountConnected } from "reducers";


import Header from "../components/Header";

const mapStateToProps = (state : State) => ({
  isConnected: getIsAccountConnected(state),
});

class PrivateRoute extends React.Component {
  props: PrivateRoutePropTypes;

  check: () => void;

  constructor (props: PrivateRoutePropTypes) {
    super(props);

    this.check = () => {
      const { component : Component, isConnected, location } = this.props;

      return (
        isConnected ? (
          <div>
            <Header />
            <Component {...this.props} />
          </div>
        ) : (
          <Redirect to={{
            pathname : "/login",
            state    : { from: location },
          }} />
        )
      );
    };
  }

  render () {
    /* eslint-disable */
    const { component, ...rest } = this.props;

    return (
      <Route {...rest} render={this.check} />
    );
  }
}

export default connect(mapStateToProps)(PrivateRoute);
