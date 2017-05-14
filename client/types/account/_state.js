// @flow

import type { List, Map } from "immutable";

import type { Notification, Suggestion } from "./";

export type AccountInfoState = {
  info: any;
  error: any;
  fetched: boolean;
  fetching: boolean;
  companies: any;
};

export type SuggestionState = {
  error: any,
  fetching: boolean;

  term: string;

  map: Map<string, Array<Suggestion>>;
};

export type NotificationState = {
  counter: number;
  list: List<Notification>;
};

export type ModalState = any;


// bankHoliday

export type BankHolidayByIDState = any;

export type BankHolidayByYearState = any;

export type BankHolidaysState = {
  byID: BankHolidayByIDState;
  byYear: BankHolidayByYearState;
};

// companies

export type CompaniesByIDState = any;

export type CompaniesAllState = {
  error: any,
  fetched: boolean;
  fetching: boolean;
  IDs: any;
  lastFetchedNumber: number;
  total: number;
};

export type AccountCompaniesState = {
  byID: CompaniesByIDState;
  all: CompaniesAllState;
};

// accounts

export type AccountsByIDState = any;

export type AccountsAllState = {
  error: any,
  fetched: boolean;
  fetching: boolean;
  IDs: any;
  lastFetchedNumber: number;
  total: number;
};

export type AccountAccountsState = {
  byID: AccountsByIDState;
  all: AccountsAllState;
};

export type AuthState = {
  captchas: any;
  resetEmail: string;
  resetStep: number;
};

/** *************************************************************/

export type AccountState = {
  account : AccountInfoState;
  accounts : AccountAccountsState;
  bankHolidays: BankHolidaysState;
  companies: AccountCompaniesState;
  form: any;
  auth: AuthState;
  modal: ModalState;
  notifications: NotificationState;
  routing: any;
  suggestions: SuggestionState;
}
