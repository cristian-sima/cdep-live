// @flow

import type { Map as ImmutableMap } from "immutable";

export type DelegateForm = {|
  FullName: string;
  Nid: string;
  Document: string;
|}

export type Delegate = {
  ID: number;
  FullName: string;
  Nid: string;
  Document: string;
};

export type DelegateResponse = {
  Error : string,
  Delegate : Delegate,
};

export type DelegatesActions =
{|
  type: 'COMPANY_FETCH_DELEGATES';
  payload: any;
|}
| {|
  type: 'COMPANY_FETCH_DELEGATES_REJECTED';
  payload: {|
    error: ?string;
  |};
|}
| {|
  type: 'COMPANY_FETCH_DELEGATES_FULFILLED';
  payload: any;
|}
| {|
  type: 'COMPANY_FETCH_DELEGATES_PENDING';
|}
| {|
  type: 'COMPANY_ADD_DELEGATE';
  payload: ImmutableMap<string, Delegate>;
|}
| {|
  type: 'COMPANY_MODIFY_DELEGATE';
  payload: ImmutableMap<string, Delegate>;
|}
| {|
  type: 'COMPANY_DELETE_DELEGATE';
  payload: number;
|}
