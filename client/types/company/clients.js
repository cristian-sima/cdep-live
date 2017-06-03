// @flow

import type { Map as ImmutableMap } from "immutable";

export type ClientForm = {|
  Cif: string;
  Registration: string;
  Name: string;
  Address: string;
  Phone: string;
  Email: string;
  AmountTo: number;
  AmountFrom: number;
|};

export type Client = {
  ID: number;
  Cif: string;
  Registration: string;
  Name: string;
  IsVatPayer: boolean;
  Address: string;
  Phone: string;
  Email: string;
  AmountTo: number;
  AmountFrom: number;
};

export type ClientResponse = {
  Error : string,
  Client : Client,
};

export type ClientsActions =
{|
  type: 'COMPANY_FETCH_CLIENTS';
  payload: any;
|}
| {|
  type: 'COMPANY_FETCH_CLIENTS_PENDING';
|}
| {|
  type: 'COMPANY_FETCH_CLIENTS_REJECTED';
  payload: {|
    error: ?string;
  |};
|}
| {|
  type: 'COMPANY_FETCH_CLIENTS_FULFILLED';
  payload: any;
|}
| {|
  type: 'COMPANY_ADD_CLIENT';
  payload: ImmutableMap<string, Client>;
|}
| {|
  type: 'COMPANY_MODIFY_CLIENT';
  payload: ImmutableMap<string, Client>;
|}
| {|
  type: 'COMPANY_MODIFY_CLIENT_EMAIL';
  payload: { id : string, newEmail : string };
|}
| {|
  type: 'COMPANY_DELETE_CLIENT';
  payload: number;
|}
