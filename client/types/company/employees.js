// @flow

export type EmployeeForm = {
  Date: string;
  LoadNextTime: boolean;
  Name: string;
}

export type Employee = EmployeeForm & {
  ID: number;
}

export type EmployeePeriodForm = {
  Start: number;
  End: number;

  Active: boolean;
  IgnoreWorkingDays: boolean;
  IgnoreWeekend: boolean;

  Working?: string;
  Extra?: string;
  Night?: string;
  SickLeave?: string;
  Holiday?: string;
  Missing?: string;
  Break?: string;
}

export type EmployeeResponse = {
  Error : string,
  Employee : Employee,
};

export type EmployeesActions =
{|
  type: 'COMPANY_FETCH_EMPLOYEES';
  payload: any;
  meta: {|
    year: string;
    month: string;
  |};
|}
| {|
  type: 'COMPANY_FETCH_EMPLOYEES_PENDING';
  meta: {|
    year: string;
    month: string;
  |};
|}
| {|
  type: 'COMPANY_FETCH_EMPLOYEES_REJECTED';
  payload: {|
    error: ?string;
  |};
  meta: {|
    year : string;
    month : string;
  |};
|}
| {|
  type: 'COMPANY_FETCH_EMPLOYEES_FULFILLED';
  payload: any;
  meta: {|
    year: string;
    month: string;
  |};
|}
| {|
  type: 'COMPANY_ADD_EMPLOYEE';
  payload: any;
|}
| {|
  type: 'COMPANY_MODIFY_EMPLOYEE';
  payload: {|
    oldEmployee: any;
    newEmployee: any;
  |};
|}
| {|
  type: 'COMPANY_MODIFY_EMPLOYEE';
  payload: any;
  meta: any;
|}
| {|
  type: 'COMPANY_DELETE_EMPLOYEE';
  payload: any;
|}
| {|
  type: 'COMPANY_AUTOCOMPLETE_EMPLOYEE';
  payload: any;
  meta: {|
    id: string;
  |}
|}
| {|
  type: 'COMPANY_AUTOCOMPLETE_EMPLOYEE_PENDING';
  payload: any;
  meta: {|
    id: string;
  |}
|}
| {|
  type: 'COMPANY_AUTOCOMPLETE_EMPLOYEE_FULFILLED';
  payload: any;
  meta: {|
    id: string;
  |}
|}
| {|
  type: 'COMPANY_LOAD_EMPLOYEES';
  payload: any;
  meta: any;
|}
| {|
  type: 'COMPANY_LOAD_EMPLOYEES_PENDING';
  meta: {|
    year : string;
    month : string;
    previousYear: string;
    previousMonth: string;
  |};
|}
| {|
  type: 'COMPANY_MULTIPLE_MODIFY_EMPLOYEES';
  payload: any;
|}
| {|
  type: 'COMPANY_CLEAR_EMPLOYEES';
  payload: any;
|}
| {|
  type: 'COMPANY_LOAD_EMPLOYEES_REJECTED';
  payload: {|
    error: ?string;
  |};
  meta: {|
    year : string;
    month : string;
    previousYear: string;
    previousMonth: string;
  |};
|}
| {|
  type: 'COMPANY_LOAD_EMPLOYEES_FULFILLED';
  payload: any;
  meta: {|
    year : string;
    month : string;
    previousYear: string;
    previousMonth: string;
  |};
|}
