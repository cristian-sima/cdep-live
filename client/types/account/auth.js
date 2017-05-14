// @flow

export type LoginForm = {
  RememberMe: boolean;
  Email: string;
  Password: string;
};

export type LoginFormResponse = {
  Message: string;
  Captcha?: string;
};

export type AuthActions =
{|
  type: 'SHOW_CAPTCHA';
  payload: {
    id: string;
    name: string;
  };
|} | {|
  type: 'HIDE_CAPTCHA';
  payload: string;
|} | {|
  type: 'SHOW_RESET_CAPTCHA';
  payload: string;
|}
| {|
  type: 'CLEAR_RESET';
|}
| {|
  type: 'HIDE_RESET_CAPTCHA';
|}
| {|
  type: 'SET_RESET_EMAIL';
  payload: string;
|}
| {|
  type: 'SET_RESET_TOKEN';
  payload: {
    Token: string;
  };
|}
| {|
  type: 'SET_RESET_STEP';
  payload: {
    step: number;
  };
|}
