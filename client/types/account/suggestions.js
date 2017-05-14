// @flow

export type Suggestion = {
  ID: number;
  Name: string;
  Modules: string;
};

export type SuggestionsActions =
{|
  type: 'FETCH_SUGGESTIONS';
  payload: any;
|}
| {|
  type: 'FETCH_SUGGESTIONS_PENDING';
|}
| {|
  type: 'FETCH_SUGGESTIONS_REJECTED';
  payload: {|
    error: ?string;
  |};
|}
| {|
  type: 'FETCH_SUGGESTIONS_FULFILLED';
  payload: {|
    Suggestions : Array<Suggestion>;
    Term: string;
  |};
|}
| {|
  type: 'CHANGE_SUGGESTIONS_CURRENT_TERM';
  payload: string;
|}
