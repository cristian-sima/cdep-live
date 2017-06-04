// @flow

import type { ErrorType } from "./";

export type ModalState = any;

export type AuthState = {
  +captchas: any;

  +isConnected : bool;
  +account : any;

  +isSigningOff : bool;
  +signOffError : ErrorType;
  +confirmSignOff : bool;

  +isReconnecting : bool;
  +reconnectError : ErrorType;

  +connectingLive: bool;

  +showButtons: bool;
}

export type ListState = {
  +isUpdating : bool;
  +itemSelected : ?string;

  +itemToggled : ?string;
  +isPublicVote : bool;

  +data : any;
  +list : any;
}

export type UsersState = {
  +fetched : bool;
  +fetching : bool;
  +errorFetching : ErrorType;

  +isUpdating : bool;
  +errorUpdate : ErrorType;

  +data: any;
}

export type State = {
  +auth: AuthState;
  +list: ListState;
  +modal : ModalState;
  +users: UsersState;
};
