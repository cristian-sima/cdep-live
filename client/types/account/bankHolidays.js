// @flow

export type BankHolidayForm = {
  Date: string;
  LoadNextTime: boolean;
  Name: string;
}

export type BankHoliday = BankHolidayForm & {
  ID: number;
}

export type BankHolidayResponse = {
  Error : string,
  BankHoliday : BankHoliday,
};

export type BankHolidaysActions =
{|
  type: 'FETCH_BANK_HOLIDAYS';
  payload: any;
  meta: {|
    year: string;
  |};
|}
| {|
  type: 'FETCH_BANK_HOLIDAYS_PENDING';
  meta: {|
    year: string;
  |};
|}
| {|
  type: 'FETCH_BANK_HOLIDAYS_REJECTED';
  payload: {|
    error: ?string;
  |};
  meta: {|
    year : string;
  |};
|}
| {|
  type: 'FETCH_BANK_HOLIDAYS_FULFILLED';
  payload: any;
  meta: {|
    year: string;
  |};
|}
| {|
  type: 'ADD_BANK_HOLIDAY';
  payload: any;
|}
| {|
  type: 'MODIFY_BANK_HOLIDAY';
  payload: {|
    oldBankHoliday: any;
    newBankHoliday: any;
  |};
|}
| {|
  type: 'DELETE_BANK_HOLIDAY';
  payload: any;
|}
| {|
  type: 'LOAD_BANK_HOLIDAYS';
  payload: any;
  meta: {|
    year : string;
    previousYear: string;
  |};
|}
| {|
  type: 'LOAD_BANK_HOLIDAYS_PENDING';
  meta: {|
    year : string;
    previousYear: string;
  |};
|}
| {|
  type: 'LOAD_BANK_HOLIDAYS_REJECTED';
  payload: {|
    error: ?string;
  |};
  meta: {|
    year : string;
    previousYear: string;
  |};
|}
| {|
  type: 'LOAD_BANK_HOLIDAYS_FULFILLED';
  payload: any;
  meta: {|
    year : string;
    previousYear: string;
  |};
|}
