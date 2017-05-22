// @flow

import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form/immutable";
import { reducer as uiReducer } from "redux-ui";
import { routerReducer } from "react-router-redux";
import { reducer as notifications } from "react-notification-system-redux";

import auth from "./auth";
import users from "./users";

// try to keep them in alphabetic order
const rootReducer = combineReducers({
  auth,
  users,

  notifications,
  "form"   : formReducer,
  "router" : routerReducer,
  "ui"     : uiReducer,
});

export default rootReducer;
