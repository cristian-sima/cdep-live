// @flow

import type { Action } from "types";

import {
  fetchUsers as fetchUsersRequest,
  updateUserList as updateUserListRequest,
} from "request";

export const updateUsers = () : Action => ({
  type    : "UPDATE_USERS",
  payload : updateUserListRequest(),
});

export const fetchUsers = () : Action => ({
  type    : "FETCH_USERS",
  payload : fetchUsersRequest(),
});
