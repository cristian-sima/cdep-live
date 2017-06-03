/* eslint-disable max-lines, no-undefined */

import reducer, {
  getAuthCaptcha,
  getIsAccountConnected,
  getCurrentAccount,
  getIsSigningOff,
  getHasSignOffError,
  getShowSignOffConfirmation,
  getIsReconnecting,
  getHasReconnectError,
  getIsConnectingLive,
  getShowButtons,
  getIsSpecialAccount,
  getShouldReconnect,
} from "./auth";

import * as Immutable from "immutable";

import {
  showCaptcha,
  hideCaptcha,

  connectAccount,
  changePassword,
  confirmSignOff,
  cancelSignOff,
  connectingLive,
  connectedLive,

  showButtons,
} from "actions";

import {
  noError,
  marcaOperator,
  marcaAdministrator,
} from "utility";

describe("auth reducer", () => {
  it("returns the initial state", () => {
    const result = reducer(undefined, { type: "" });

    expect(result).toEqual({
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
  });

  it("handles SHOW_CAPTCHA", () => {
    const
      initialState = {
        captchas: Immutable.Map(),
      },
      result = reducer(initialState, showCaptcha({
        id   : "190340239043233232",
        name : "login",
      }));

    expect(result).toEqual({
      captchas: Immutable.Map({
        "login": "190340239043233232",
      }),
    });
  });

  it("handles HIDE_CAPTCHA", () => {
    const
      initialState = {
        captchas: Immutable.Map({
          "login": "190340239043233232",
        }),
      },
      result = reducer(initialState, hideCaptcha("login"));

    expect(result).toEqual({
      captchas: Immutable.Map(),
    });
  });

  it("handles ACCOUNT_CONNECTED", () => {
    const
      account = {
        _id: "n4n534jn5",
      },
      initialState = {
        account     : Immutable.Map(),
        isConnected : false,

        isReconnecting: true,
      },
      result = reducer(initialState, connectAccount(account));

    expect(result).toEqual({
      account     : Immutable.Map(account),
      isConnected : true,

      isReconnecting: false,
    });
  });

  describe("handles CHANGE_PASSWORD", () => {
    it("given the account is connected", () => {
      const
        initialState = {
          account: Immutable.Map({
            _id           : "234nb234j23fds",
            requireChange : true,
          }),
          isConnected: true,
        },
        result = reducer(initialState, changePassword());

      expect(result).toEqual({
        account: Immutable.Map({
          _id           : "234nb234j23fds",
          requireChange : false,
        }),
        isConnected: true,
      });
    });
    it("given the account is not connected", () => {
      const
        initialState = {
          isConnected: false,
        },
        result = reducer(initialState, changePassword());

      expect(result).toEqual({
        isConnected: false,
      });
    });
  });

  it("handles CONFIRM_SIGN_OFF", () => {
    const
      initialState = {
        confirmSignOff: false,
      },
      result = reducer(initialState, confirmSignOff());

    expect(result).toEqual({
      confirmSignOff: true,
    });
  });

  it("handles CANCEL_SIGN_OFF", () => {
    const
      initialState = {
        confirmSignOff: true,
      },
      result = reducer(initialState, cancelSignOff());

    expect(result).toEqual({
      confirmSignOff: false,
    });
  });

  it("handles SIGN_OFF_PENDING", () => {
    const
      initialState = {
        signOffError : "Problem",
        isSigningOff : false,
      },
      result = reducer(initialState, {
        type: "SIGN_OFF_PENDING",
      });

    expect(result).toEqual({
      signOffError : noError,
      isSigningOff : true,
    });
  });

  it("handles SIGN_OFF_REJECTED", () => {
    const
      error = "Problem",
      initialState = {
        signOffError : noError,
        isSigningOff : true,
      },
      result = reducer(initialState, {
        type: "SIGN_OFF_REJECTED",
        error,
      });

    expect(result).toEqual({
      signOffError : error,
      isSigningOff : false,
    });
  });

  it("handles SIGN_OFF_FULFILLED", () => {
    const
      initialState = {
        captchas: Immutable.Map({
          "AUTH": "2321323",
        }),

        isConnected : true,
        account     : Immutable.Map({
          "_id": "asdasdsads",
        }),

        isSigningOff   : true,
        signOffError   : "Problem",
        confirmSignOff : true,

        isReconnecting : true,
        reconnectError : "Problem",

        connectingLive: true,

        showButtons: true,
      },
      result = reducer(initialState, {
        type: "SIGN_OFF_FULFILLED",
      });

    expect(result).toEqual({
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
  });

  it("handles RECONNECT_PENDING", () => {
    const
      initialState = {
        isReconnecting : false,
        reconnectError : "Problem",
      },
      result = reducer(initialState, {
        type: "RECONNECT_PENDING",
      });

    expect(result).toEqual({
      isReconnecting : true,
      reconnectError : noError,
    });
  });

  it("handles RECONNECT_REJECTED", () => {
    const
      initialState = {
        isReconnecting : true,
        reconnectError : noError,
      },
      result = reducer(initialState, {
        type: "RECONNECT_REJECTED",
      });

    expect(result).toEqual({
      isReconnecting : false,
      reconnectError : "Problem",
    });
  });

  it("handles RECONNECT_FULFILLED", () => {
    const
      account = Immutable.Map({
        "_id": "sadasdsa243nj234",
      }),
      initialState = {
        account     : Immutable.Map(account),
        isConnected : false,

        isReconnecting: true,
      },
      result = reducer(initialState, {
        type    : "RECONNECT_FULFILLED",
        payload : account,
      });

    expect(result).toEqual({
      account     : Immutable.Map(account),
      isConnected : true,

      isReconnecting: false,
    });
  });

  it("handles CONNECTING_LIVE", () => {
    const
      initialState = {
        connectingLive: false,
      },
      result = reducer(initialState, connectingLive());

    expect(result).toEqual({
      connectingLive: true,
    });
  });

  it("handles CONNECTED_LIVE", () => {
    const
      initialState = {
        connectingLive: true,
      },
      result = reducer(initialState, connectedLive());

    expect(result).toEqual({
      connectingLive: false,
    });
  });

  it("handles SHOW_BUTTONS", () => {
    const
      initialState = {
        showButtons: false,
      },
      result = reducer(initialState, showButtons());

    expect(result).toEqual({
      showButtons: true,
    });
  });
});

describe("auth selectors", () => {
  it("getAuthCaptcha", () => {
    const
      state = {
        auth: {
          captchas: Immutable.Map({
            "reset" : "123123123123123",
            "login" : "12313123123",
          }),
        },
      },
      result = getAuthCaptcha(state, "reset");

    expect(result).toEqual("123123123123123");
  });
  it("getAuthCaptcha", () => {
    const
      state = {
        auth: {
          captchas: Immutable.Map({
            "reset" : "123123123123123",
            "login" : "12313123123",
          }),
        },
      },
      result = getAuthCaptcha(state, "reset");

    expect(result).toEqual("123123123123123");
  });

  describe("getIsAccountConnected", () => {
    it("detects when conected", () => {
      const
        state = {
          auth: {
            isConnected: true,
          },
        },
        result = getIsAccountConnected(state);

      expect(result).toEqual(true);
    });

    it("detects when disconnected", () => {
      const
        state = {
          auth: {
            isConnected: false,
          },
        },
        result = getIsAccountConnected(state);

      expect(result).toEqual(false);
    });
  });

  it("getCurrentAccount", () => {
    const
      account = Immutable.Map({
        "_id": "n32jn32nj432",
      }),
      state = {
        auth: {
          account,
        },
      },
      result = getCurrentAccount(state);

    expect(result).toEqual(account);
  });

  it("getIsSigningOff", () => {
    const
      state = {
        auth: {
          isSigningOff: true,
        },
      },
      result = getIsSigningOff(state);

    expect(result).toEqual(true);
  });

  describe("getHasSignOffError", () => {
    it("detects an error", () => {
      const
        state = {
          auth: {
            signOffError: "Problem",
          },
        },
        result = getHasSignOffError(state);

      expect(result).toEqual(true);
    });

    it("detects no error", () => {
      const
        state = {
          auth: {
            signOffError: noError,
          },
        },
        result = getHasSignOffError(state);

      expect(result).toEqual(false);
    });
  });

  it("getShowSignOffConfirmation", () => {
    const
      state = {
        auth: {
          confirmSignOff: true,
        },
      },
      result = getShowSignOffConfirmation(state);

    expect(result).toEqual(true);
  });

  it("getIsReconnecting", () => {
    const
      state = {
        auth: {
          isReconnecting: true,
        },
      },
      result = getIsReconnecting(state);

    expect(result).toEqual(true);
  });

  describe("getHasReconnectError", () => {
    it("detects an error", () => {
      const
        state = {
          auth: {
            reconnectError: "Problem",
          },
        },
        result = getHasReconnectError(state);

      expect(result).toEqual(true);
    });

    it("detects no error", () => {
      const
        state = {
          auth: {
            reconnectError: noError,
          },
        },
        result = getHasReconnectError(state);

      expect(result).toEqual(false);
    });
  });

  it("getIsConnectingLive", () => {
    const
      state = {
        auth: {
          connectingLive: true,
        },
      },
      result = getIsConnectingLive(state);

    expect(result).toEqual(true);
  });

  it("getShowButtons", () => {
    const
      state = {
        auth: {
          showButtons: true,
        },
      },
      result = getShowButtons(state);

    expect(result).toEqual(true);
  });


  describe("getIsSpecialAccount", () => {
    describe("detects a special account", () => {
      it("detects an operator", () => {
        const
          state = {
            auth: {
              account: Immutable.Map({
                marca: marcaOperator,
              }),
            },
          },
          result = getIsSpecialAccount(state);

        expect(result).toEqual(true);
      });
      it("detects an administrator", () => {
        const
          state = {
            auth: {
              account: Immutable.Map({
                marca: marcaAdministrator,
              }),
            },
          },
          result = getIsSpecialAccount(state);

        expect(result).toEqual(true);
      });
    });
    it("detects a normal user", () => {
      const
        state = {
          auth: {
            account: Immutable.Map({
              marca: 1,
            }),
          },
        },
        result = getIsSpecialAccount(state);

      expect(result).toEqual(false);
    });
  });

  describe("getShouldReconnect", () => {
    describe("given it is connected", () => {
      it("returns false", () => {
        const
          state = {
            auth: {
              isConnected: true,
            },
          },
          result = getShouldReconnect(state);

        expect(result).toEqual(false);
      });
    });
    describe("given it is not connected", () => {
      describe("given it is reconnecting", () => {
        it("returns false", () => {
          const
            state = {
              auth: {
                isConnected    : false,
                isReconnecting : true,
              },
            },
            result = getShouldReconnect(state);

          expect(result).toEqual(false);
        });
      });
      describe("given it is not reconnecting", () => {
        describe("given it has reconnecting error", () => {
          it("returns false", () => {
            const
              state = {
                auth: {
                  isConnected    : false,
                  isReconnecting : false,
                  reconnectError : "Problem",
                },
              },
              result = getShouldReconnect(state);

            expect(result).toEqual(false);
          });
        });
        describe("given it does not has reconnecting error", () => {
          it("returns true", () => {
            const
              state = {
                auth: {
                  isConnected    : false,
                  isReconnecting : false,
                  reconnectError : noError,
                },
              },
              result = getShouldReconnect(state);

            expect(result).toEqual(true);
          });
        });
      });
    });
  });

});
