// @flow

import type { Map as ImmutableMap } from "immutable";

export type CompanyInfoID = number

export type CompanyInfoForm = {
  Address : string;
  BankAccount : string;
  BankName : string;
  Cif : string;
  Email : string;
  id: number;
  IsActive : boolean;
  IsVatPayer : boolean;
  Name : string;
  Phone : string;
  Registration : string;
}

export type CompanyInfo = CompanyInfoForm & {
  id: number;
}

export type CompanyInfoResponse = {
  Error : string,
  CompanyInfo : CompanyInfo,
};

export type CompanyInfoActions =
{|
  type: 'FETCH_CURRENT_COMPANY_INFO';
  payload: any;
|}
| {|
  type: 'FETCH_CURRENT_COMPANY_INFO_PENDING';
|}
| {|
  type: 'FETCH_CURRENT_COMPANY_INFO_REJECTED';
  payload: {|
    error: ?string;
  |};
|}
| {|
  type: 'FETCH_CURRENT_COMPANY_INFO_FULFILLED';
  payload: ImmutableMap<string, CompanyInfo>;
|}
| {|
  type: 'MODIFY_CURRENT_COMPANY_INFO';
  payload: any;
|}
| {|
  type: 'COMPANY_TOGGLE_MODULE';
  payload: any;
|}
| {|
  type: 'COMPANY_TOGGLE_MODULE_PENDING';
  payload: any;
|}
| {|
  type: 'COMPANY_TOGGLE_MODULE_REJECTED';
  payload: {|
    error: string;
  |};
|}
| {|
  type: 'COMPANY_TOGGLE_MODULE_FULFILLED';
  payload: {|
    Modules: any;
    ID: number;
  |};
|}
| {|
  type: 'COMPANY_RESET_DATA';
|}
