// @flow

export type CashingForm = {|
  ClientID: number;
  Date: string;
  InvoiceID: number;
  Number: number;
  Serial: number;
  Total: number;
|};

export type Cashing = {
  ID: number;
  ClientID: number;
  Date: string;
  InvoiceID: number;
  Number: number;
  Serial: number;
  Total: number;
};

export type CashingResponse = {
  Error : string,
  Cashing : Cashing,
};


export type addCashingPropTypes = {
  data: CashingForm;
  invoiceID: number;
};

export type modifyCashingPropTypes = {
  id: number;
  data: CashingForm;
  invoiceID: number;
};

export type deleteCashingPropTypes = {
  id: number;
  invoiceID: number;
};

export type CashingsActions =
{|
  type: 'COMPANY_ADD_CASHING';
  payload: any;
|}
| {|
  type: 'COMPANY_MODIFY_CASHING';
  payload: {
    newCashing: any;
    oldCashing: any;
  };
|}
| {|
  type: 'COMPANY_DELETE_CASHING';
  payload: any;
|}
