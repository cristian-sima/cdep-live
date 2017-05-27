// @flow

import React from "react";

import { Route, Router } from "react-router-dom";
import { Provider } from "react-redux";

import PrivateRoute from "./PrivateRoute";

import Login from "../components/Login";
import UserList from "../components/UserList/WrapContainer";
import Wall from "../components/Wall";


const Root = ({ history, store } : { history : any, store : any }) => (
  <Provider store={store}>
    <Router history={history}>
      <div>
        <Route component={Login} path="/login" />
        <PrivateRoute component={Wall} exact path="/" />
        <PrivateRoute component={UserList} path="/user-list" />
      </div>
    </Router>
  </Provider>
);

export default Root;
