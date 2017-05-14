// @flow

import type { CompanyInfo } from "../company/info";

export type AccountAdministrator = 0;
export type AccountClient = 1;

export type AccountType = AccountAdministrator | AccountClient;

export type AccountInfo = {
  Surname : string;
  Name : string;
  Password : string;
  Email : string;
  Type : AccountType;
  RequireChange : boolean;
  IsActive : boolean;
  Companies : Array<CompanyInfo>;
};

export type InitialInformationResponse = {
  IsConnected: boolean;
  Account: AccountInfo;
  Companies: any;
};

export type ChangePasswordForm = {
  OldPassword : string;
  NewPassword : string;
  ConfirmPassword : string;
};

export type ChangePasswordResponse = {
  Error : string,
};

export type AccountInfoActions =
{|
  type: 'FETCH_CURRENT_ACCOUNT';
  payload: any;
|}
| {|
  type: 'ACCOUNT_SET_RESET_PASSWORD_EMAIL';
  payload: any;
|}
| {|
  type: 'FETCH_CURRENT_ACCOUNT_REJECTED';
  payload: {|
    error: string;
  |};
|}
| {|
  type: 'FETCH_CURRENT_ACCOUNT_FULFILLED';
  payload: InitialInformationResponse;
|}
| {|
  type: 'ACCOUNT_CHANGE_PASSWORD';
|}
