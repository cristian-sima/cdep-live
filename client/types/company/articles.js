// @flow

import type { Map as ImmutableMap } from "immutable";

export type ArticleID = number

export type ArticleForm = {
  Name: string;
  UnitPrice: string;
  Vat: string;
  Quantity: string;
  Unit: string;
}

export type Article = {
  ID: string;
  Name: string;
  UnitPrice: string;
  Vat: string;
  Quantity: string;
  Unit: string;
}

export type ArticleResponse = {
  Error : string,
  Article : Article,
};

export type ArticlesActions =
{|
  type: 'COMPANY_FETCH_ARTICLES';
  payload: any;
|}
| {|
  type: 'COMPANY_FETCH_ARTICLES_PENDING';
|}
| {|
  type: 'COMPANY_FETCH_ARTICLES_REJECTED';
  payload: {|
    error: ?string;
  |};
|}
| {|
  type: 'COMPANY_FETCH_ARTICLES_FULFILLED';
  payload: any;
|}
| {|
  type: 'COMPANY_ADD_ARTICLE';
  payload: ImmutableMap<string, Article>;
|}
| {|
  type: 'COMPANY_MODIFY_ARTICLE';
  payload: ImmutableMap<string, Article>;
|}
| {|
  type: 'COMPANY_DELETE_ARTICLE';
  payload: number;
|}
