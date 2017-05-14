// @flow

import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form/immutable";
import { reducer as uiReducer } from "redux-ui";
import { routerReducer } from "react-router-redux";
import { reducer as notifications } from "react-notification-system-redux";

// import accountReducers from "./account/state";
// import companyReducers from "./company/state";

// try to keep them in alphabetic order
const rootReducer = combineReducers({
  notifications,
  "form"    : formReducer,
  "routing" : routerReducer,
  "ui"      : uiReducer,
});

export default rootReducer;
