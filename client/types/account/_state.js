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

export type AuthState = {
  captchas: any;
  resetEmail: string;
  resetStep: number;
};

export type UsersState = {
  isUpdating: bool;
  errorUpdate: string;
};

/** *************************************************************/

export type AccountState = {
  form: any;
  modal: ModalState;
  notifications: NotificationState;
  routing: any;

  auth: AuthState;
  users: UsersState;
}
