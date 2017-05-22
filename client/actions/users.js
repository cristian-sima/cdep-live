// @flow

import type { Action } from "types";

import { updateUserList as updateUserListRequest } from "request";

export const updateUsers = () : Action => ({
  type    : "UPDATE_USERS",
  payload : updateUserListRequest(),
});
