// @flow

import type { Map as ImmutableMap } from "immutable";

export type SerialForm = {|
  Code: string;
  NrInvoice: number;
  NrCashing: number;
|};

export type Serial = {
  ID: string;
  Code: string;
  NrInvoice: number;
  NrCashing: number;
}

export type SerialResponse = {
  Error : string,
  Serial : Serial,
};

export type SerialsActions =
{|
  type: 'COMPANY_FETCH_SERIALS';
  payload: any;
|}
| {|
  type: 'COMPANY_FETCH_SERIALS_PENDING';
|}
| {|
  type: 'COMPANY_ADD_SERIAL';
  payload: ImmutableMap<string, Serial>;
|}
| {|
  type: 'COMPANY_MODIFY_SERIAL';
  payload: ImmutableMap<string, Serial>;
|}
| {|
  type: 'COMPANY_DELETE_SERIAL';
  payload: number;
|}
