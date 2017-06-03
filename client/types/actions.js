/* eslint-disable no-use-before-define */
// @flow

import type { Actions as AccountActions } from "./account/_actions";
import type { Actions as CompanyActions } from "./company/_actions";

export type Action = AccountActions | CompanyActions;

export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
