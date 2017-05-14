// @flow

export type CompanyForm = {
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

export type Company = CompanyForm & {
  ID: number;
}

export type ToggleCompanyStateResponse = {
  Error: string;
  IsActive: boolean;
};

export type CompanyResponse = {
  Error : string,
  Company : Company,
};

export type CompaniesActions =
{|
  type: 'FETCH_COMPANIES';
  payload: any;
|}
| {|
  type: 'FETCH_COMPANIES_PENDING';
|}
| {|
  type: 'FETCH_COMPANIES_REJECTED';
  payload: {|
    error: ?string;
  |};
|}
| {|
  type: 'FETCH_COMPANIES_FULFILLED';
  payload: {|
    Companies: any;
    LastFetchedNumber: number;
    Total: number;
  |};
|}
| {|
  type: 'ADD_COMPANY';
  payload: any;
|}
| {|
  type: 'DELETE_COMPANY';
  payload: any;
|}
| {|
  type: 'TOGGLE_COMPANY_STATE';
  payload: any;
|}
