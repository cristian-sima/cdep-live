// @flow

import type { Map as ImmutableMap } from "immutable";

export type PermissionID = number

export type PermissionForm = {
  Name: string;
  UnitPrice: string;
  Vat: string;
  Quantity: string;
  Unit: string;
}

export type Permission = {
  ID: string;
  Name: string;
  UnitPrice: string;
  Vat: string;
  Quantity: string;
  Unit: string;
}

export type PermissionResponse = {
  Error : string;
  Permission : Permission;
  Captcha: string;
};

export type PermissionsActions =
{|
  type: 'COMPANY_FETCH_PERMISSIONS';
  payload: any;
|}
| {|
  type: 'COMPANY_FETCH_PERMISSIONS_PENDING';
|}
| {|
  type: 'COMPANY_FETCH_PERMISSIONS_REJECTED';
  payload: {|
    error: ?string;
  |};
|}
| {|
  type: 'COMPANY_FETCH_PERMISSIONS_FULFILLED';
  payload: any;
|}
| {|
  type: 'COMPANY_ADD_PERMISSION';
  payload: ImmutableMap<string, Permission>;
|}
| {|
  type: 'COMPANY_MODIFY_PERMISSION';
  payload: ImmutableMap<string, Permission>;
|}
| {|
  type: 'COMPANY_DELETE_PERMISSION';
  payload: number;
|}
