// @flow

export type AccountForm = {
  ClientID: number;
  ClientName: string;
  Date: string;
  DelegateID: number;
  InverseTax: boolean;
  Number: number;
  Paid: number;
  Serial: string;
  Total: number;
  TotalVat: number;
  VatAtCashing: boolean;
}

export type Account = AccountForm & {
  ID: number;
}

export type ToggleAccountStateResponse = {
  Error: string;
  IsActive: boolean;
};

export type AccountResponse = {
  Error : string,
  Account : Account,
};

export type AccountsActions =
{|
  type: 'FETCH_ACCOUNTS';
  payload: any;
|}
| {|
  type: 'FETCH_ACCOUNTS_PENDING';
|}
| {|
  type: 'FETCH_ACCOUNTS_REJECTED';
  payload: {|
    error: ?string;
  |};
|}
| {|
  type: 'FETCH_ACCOUNTS_FULFILLED';
  payload: {|
    Accounts: any;
    LastFetchedNumber: number;
    Total: number;
  |};
|}
| {|
  type: 'ADD_ACCOUNT';
  payload: any;
|}
| {|
  type: 'MODIFY_ACCOUNT';
  payload: any;
|}
| {|
  type: 'DELETE_ACCOUNT';
  payload: any;
|}
| {|
  type: 'TOGGLE_ACCOUNT_STATE';
  payload: {
    id: string;
    IsActive : boolean;
  };
|}
| {|
  type: 'RESET_PASSWORD_ACCOUNT';
  payload: {
    id: string;
  };
|}
