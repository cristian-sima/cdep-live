import * as Immutable from "immutable";

import {
  showCaptcha,
  hideCaptcha,
  connectAccount,
  changePassword,
  cancelSignOff,
  confirmSignOff,
  connectingLive,
  connectedLive,
} from "./index";

describe("auth actions", () => {

  it("should create an action to show a captcha", () => {
    const
      payload = {
          id   : "4n234234n23",
          name : "AUTH",
        },
      expectedAction = {
        type: "SHOW_CAPTCHA",
        payload,
      };

    expect(showCaptcha(payload)).toEqual(expectedAction);
  });

  it("should create an action to hide a captcha", () => {
    const
      payload = "AUTH",
      expectedAction = {
        type: "HIDE_CAPTCHA",
        payload,
      };

    expect(hideCaptcha(payload)).toEqual(expectedAction);
  });

  it("should create an action to connect an account", () => {
    const
      account = Immutable.Map({
          "_id": "234n234n234",
        }),
      expectedAction = {
        type    : "ACCOUNT_CONNECTED",
        payload : account,
      };

    expect(connectAccount(account)).toEqual(expectedAction);
  });

  it("should create an action to change the password", () => {
    const
      expectedAction = {
        type: "CHANGE_PASSWORD",
      };

    expect(changePassword()).toEqual(expectedAction);
  });

  it("should create an action to cancel sign off", () => {
    const
      expectedAction = {
        type: "CANCEL_SIGN_OFF",
      };

    expect(cancelSignOff()).toEqual(expectedAction);
  });

  it("should create an action to confirm sign off", () => {
    const
      expectedAction = {
        type: "CONFIRM_SIGN_OFF",
      };

    expect(confirmSignOff()).toEqual(expectedAction);
  });

  it("should create an action to show connecting to live", () => {
    const
      expectedAction = {
        type: "CONNECTING_LIVE",
      };

    expect(connectingLive()).toEqual(expectedAction);
  });

  it("should create an action to show it is connected to live", () => {
    const
      expectedAction = {
        type: "CONNECTED_LIVE",
      };

    expect(connectedLive()).toEqual(expectedAction);
  });
});
