// @flow

import type { Cashing } from "./cashings";
import type { Serial } from "./serials";

export type InvoiceItemForm = {
  Name: string;
  UnitPrice: number;
  Vat: number;
  Quantity: number;
  Unit: string;
};

export type InvoiceForm = {
  Cashings: Array<Cashing>;
  ClientID: number;
  ClientName: string;
  Date: string;
  DelegateID: number;
  InverseTax: boolean;
  Items: Array<InvoiceItemForm>;
  Number: number;
  Paid: number;
  Serial: string;
  Total: number;
  TotalVat: number;
  VatAtCashing: boolean;
}

export type Invoice = InvoiceForm & {
  ID: number;
  Cashings: any;
}

export type InvoiceItem = InvoiceItemForm & {
  ID: number;
}

export type InvoiceResponse = {
  Error : string,
  Invoice : Invoice,
};

export type DeleteInvoiceResponse = {
  Error : string,
  Serial: Serial,
  Invoice : Invoice,
};

export type InvoicesActions =
{|
  type: 'COMPANY_FETCH_INVOICES';
  payload: any;
|}
| {|
  type: 'COMPANY_FETCH_INVOICES_PENDING';
|}
| {|
  type: 'COMPANY_FETCH_INVOICES_REJECTED';
  payload: {|
    error: ?string;
  |};
|}
| {|
  type: 'COMPANY_FETCH_INVOICES_FULFILLED';
  payload: {|
    Invoices: any;
    LastFetchedInvoiceNumber: number;
    Total: number;
  |};
|}
| {|
  type: 'COMPANY_FETCH_INVOICES_BY_CLIENT';
  payload: any;
  meta: {|
    clientID: string;
  |};
|}
| {|
  type: 'COMPANY_FETCH_INVOICES_BY_CLIENT_PENDING';
  meta: {|
    clientID: string;
  |};
|}
| {|
  type: 'COMPANY_FETCH_INVOICES_BY_CLIENT_REJECTED';
  meta: {|
    clientID: string;
  |};
  payload: {|
    error: ?string;
  |}
|}
| {|
  type: 'COMPANY_FETCH_INVOICES_BY_CLIENT_FULFILLED';
  meta: {|
    clientID: string;
  |};
  payload: {|
    Invoices: any;
    LastFetchedInvoiceNumber: number;
    Total: number;
  |}
|}
| {|
  type: 'COMPANY_FETCH_INVOICE';
  payload: any;
  meta: {|
    id: number;
  |};
|}
| {|
  type: 'COMPANY_FETCH_INVOICE_PENDING';
  meta: {|
    id: number;
  |};
|}
| {|
  type: 'COMPANY_FETCH_INVOICE_REJECTED';
  payload: {|
    error: ?string;
  |};
  meta: {|
    id: number;
  |};
|}
| {|
  type: 'COMPANY_FETCH_INVOICE_FULFILLED';
  payload: any;
  meta: {|
    year : string;
    previousYear: string;
  |};
|}
| {|
  type: 'COMPANY_ADD_INVOICE';
  payload: {
    invoice: any;
    cashings: any;
    items: any;
  };
|}
| {|
  type: 'COMPANY_MODIFY_INVOICE_DATA';
  payload: {
    cashings: any;
    invoice: any;
    items: any;
    oldInvoice: any;
  };
|}
| {|
  type: 'COMPANY_MODIFY_INVOICE_CLIENT';
  payload: {
    cashings: any;
    invoice: any;
    items: any;
    oldInvoice: any;
  };
|}
| {|
  type: 'COMPANY_MODIFY_INVOICE_DELEGATE';
  payload: {
    cashings: any;
    invoice: any;
    items: any;
    oldInvoice: any;
  };
|}
| {|
  type: 'COMPANY_MODIFY_INVOICE_SERIAL';
  payload: {
    cashings: any;
    invoice: any;
    items: any;
    oldInvoice: any;
  };
|}
| {|
  type: 'COMPANY_TOGGLE_INVOICE_CANCEL';
  payload: any;
|}
| {|
  type: 'COMPANY_DELETE_INVOICE';
  payload: {
    invoice: any;
    serial: any;
  };
|}
