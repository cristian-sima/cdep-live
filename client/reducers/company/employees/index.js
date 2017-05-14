// @flow

import { combineReducers } from "redux";

import byID from "./byID";
import byMonth from "./byMonth";

export * from "./byID";
export * from "./byMonth";

export default combineReducers({
  byID,
  byMonth,
});
