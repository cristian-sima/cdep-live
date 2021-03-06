// @flow

import React from "react";

// import { Route } from "react-router";
import { ConnectedRouter } from "react-router-redux";
import { Provider } from "react-redux";

import PrivateRoute from "./PrivateRoute";

import Header from "../components/Header";
import ModalRoot from "../components/Modal/Root";

const Root = ({ history, store } : { history : any, store : any }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <ModalRoot />
        <Header />
        <PrivateRoute />
      </div>
    </ConnectedRouter>
  </Provider>
);

export default Root;
