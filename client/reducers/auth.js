// @flow

import type { State, AuthState } from "types";

import * as Immutable from "immutable";
import { createSelector } from "reselect";

import {
  marcaOperator,
  marcaAdministrator,
  marcaContPublic,
  noError,
} from "utility";

const newInitialState = () => ({
  captchas: Immutable.Map(),

  isConnected : false,
  account     : Immutable.Map(),

  isSigningOff   : false,
  signOffError   : noError,
  confirmSignOff : false,

  isReconnecting : false,
  reconnectError : noError,

  connectingLive: false,

  showButtons: false,
});

const
  showCaptcha = (state : AuthState, { payload : { name, id } }) => ({
    ...state,
    captchas: state.captchas.set(name, id),
  }),
  hideCaptcha = (state : AuthState, { payload }) => ({
    ...state,
    captchas: state.captchas.delete(payload),
  }),
  changePassword = (state : AuthState) => {
    if (state.isConnected) {
      return {
        ...state,
        account: state.account.set("requireChange", false),
      };
    }

    return state;
  },
  showSignOffConfirmation = (state : AuthState) => ({
    ...state,
    confirmSignOff: true,
  }),
  cancelSignOff = (state : AuthState) => ({
    ...state,
    confirmSignOff: false,
  }),
  signOffPending = (state : AuthState) => ({
    ...state,
    signOffError : noError,
    isSigningOff : true,
  }),
  signOffRejected = (state : AuthState, { error }) => ({
    ...state,
    signOffError : error,
    isSigningOff : false,
  }),
  reconnectPending = (state : AuthState) => ({
    ...state,
    isReconnecting : true,
    reconnectError : noError,
  }),
  reconnectRejected = (state : AuthState) => ({
    ...state,
    isReconnecting : false,
    reconnectError : "Problem",
  }),
  accountConnected = (state : AuthState, { payload }) => ({
    ...state,
    account     : Immutable.Map(payload),
    isConnected : true,

    isReconnecting: false,
  }),
  connectingLive = (state : AuthState) => ({
    ...state,
    connectingLive: true,
  }),
  connectedLive = (state : AuthState) => ({
    ...state,
    connectingLive: false,
  }),
  showButtons = (state : AuthState) => ({
    ...state,
    showButtons: true,
  });

const authReducer = (state : AuthState = newInitialState(), action : any) => {
  switch (action.type) {
    case "SHOW_CAPTCHA":
      return showCaptcha(state, action);

    case "HIDE_CAPTCHA":
      return hideCaptcha(state, action);

    case "ACCOUNT_CONNECTED":
      return accountConnected(state, action);

    case "CHANGE_PASSWORD":
      return changePassword(state);

    case "CONFIRM_SIGN_OFF":
      return showSignOffConfirmation(state);

    case "CANCEL_SIGN_OFF":
      return cancelSignOff(state);

    case "SIGN_OFF_PENDING":
      return signOffPending(state);

    case "SIGN_OFF_REJECTED":
      return signOffRejected(state, action);

    case "SIGN_OFF_FULFILLED":
      return newInitialState();

    case "RECONNECT_PENDING":
      return reconnectPending(state);

    case "RECONNECT_REJECTED":
      return reconnectRejected(state);

    case "RECONNECT_FULFILLED":
      return accountConnected(state, action);

    case "CONNECTING_LIVE":
      return connectingLive(state);

    case "CONNECTED_LIVE":
      return connectedLive(state);

    case "SHOW_BUTTONS":
      return showButtons(state);

    default:
      return state;
  }
};

export const
  getAuthCaptcha = (state : State, name : string) => state.auth.captchas.get(name) || "",

  getIsAccountConnected = (state : State) => state.auth.isConnected,
  getCurrentAccount = (state : State) => state.auth.account,
  getIsSigningOff = (state : State) => state.auth.isSigningOff,
  getHasSignOffError = (state : State) => state.auth.signOffError !== noError,
  getShowSignOffConfirmation = (state : State) => state.auth.confirmSignOff,

  getIsReconnecting = (state : State) => state.auth.isReconnecting,
  getHasReconnectError = (state : State) => state.auth.reconnectError !== noError,

  getIsConnectingLive = (state : State) => state.auth.connectingLive,

  getShowButtons = (state : State) => state.auth.showButtons;

export const getIsSpecialAccount = createSelector(
  getCurrentAccount,
  (data) => {
    const marca = data.get("marca");

    return marca === marcaAdministrator || marca === marcaOperator;
  }
);

export const getIsPublicAccount = createSelector(
  getCurrentAccount,
  (data) => (
    data.get("marca") === marcaContPublic
  )
);

export const getIsAdministratorAccount = createSelector(
  getCurrentAccount,
  (data) => (
    data.get("marca") === marcaAdministrator
  )
);

export const getShouldReconnect = createSelector(
  getIsAccountConnected,
  getIsReconnecting,
  getHasReconnectError,
  (isConnected, isReconnecting, hasError) => !isConnected && !isReconnecting && !hasError
);

export default authReducer;
