// @flow

import type { Action } from "types";

export const updatingList = () : Action => ({
  type: "UPDATING_LIST",
});

export const toggleItem = (id : string) : Action => ({
  type    : "TOGGLE_ITEM",
  payload : id,
});

export const togglePublicVote = () : Action => ({
  type: "TOGGLE_PUBLIC_VOTE",
});
