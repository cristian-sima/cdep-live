// @flow

import { combineReducers } from "redux";

import { byIDInvoices as byID } from "./byID";
import { allInvoices as all } from "./all";
import { byClient } from "./byClient";

export * from "./byID";
export * from "./all";
export * from "./byClient";

export default combineReducers({
  byID,
  all,
  byClient,
});
