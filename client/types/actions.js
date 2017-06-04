/* eslint-disable no-use-before-define */
// @flow

export type Action = {|
  type: 'SHOW_CAPTCHA';
  payload: { id: string ; name : string },
|} | {|
  type: 'HIDE_CAPTCHA';
  payload: string;
|} | {|
  type: 'ACCOUNT_CONNECTED';
  payload: any;
|} | {|
  type: 'CHANGE_PASSWORD';
|} | {|
  type: 'CANCEL_SIGN_OFF';
|} | {|
  type: 'SIGN_OFF';
  payload: any;
|} | {|
  type: 'RECONNECT';
  payload: any;
|} | {|
  type: 'CONFIRM_SIGN_OFF';
|} | {|
  type: 'CONNECTING_LIVE';
|} | {|
  type: 'CONNECTED_LIVE';
|} | {|
  type: 'UPDATING_LIST';
|} | {|
  type: 'TOGGLE_ITEM';
  payload: string;
|} | {|
  type: 'TOGGLE_PUBLIC_VOTE';
|} | {|
  type: 'UPDATE_USERS';
  payload: any;
|} | {|
  type: 'FETCH_USERS';
  payload: any;
|} | {|
  type: 'SHOW_BUTTONS';
|}

export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
