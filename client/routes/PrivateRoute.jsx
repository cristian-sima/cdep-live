// @flow

import type { State } from "types";

type PrivateRoutePropTypes = {
  component: any;
  isConnected: bool;
  location: string;
}

import React from "react";

import { Route } from "react-router-dom";
import { connect } from "react-redux";

import { getIsAccountConnected } from "reducers";

import Login from "../components/Login";

const mapStateToProps = (state : State) => ({
  isConnected: getIsAccountConnected(state),
});

class PrivateRoute extends React.Component {
  props: PrivateRoutePropTypes;

  constructor (props) {
    super(props);

    this.choose = (chooseProps) => {

      const { isConnected, component : Component } = this.props;

      return (
         isConnected ? (
           <Component {...chooseProps} />
         ) : (
           <Login {...chooseProps} />
         )
      );
    };
  }

  render () {
    /* eslint-disable */
    const { component, ...rest } = this.props;

    return (
      <Route {...rest} render={this.choose} />
    );
  }
}


export default connect(mapStateToProps)(PrivateRoute);
