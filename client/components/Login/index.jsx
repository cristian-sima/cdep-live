// @flow

import type { Dispatch, LoginFormResponse, State } from "types";

type FormPropTypes = {
  error? : string;
  CaptchaID?: string;
  pristine : boolean;
  submitting : boolean;
  isConnected: boolean;
  location: string;

  handleSubmit: () => void;
  showCaptcha: (newCaptcha : string) => void;
  hideCaptcha: () => void;
  connectAccount: () => void;
}

import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Field, reduxForm, FormSection, SubmissionError, change } from "redux-form/immutable";
import React from "react";

import Captcha from "../Inputs/Captcha";
import FocusTemplate from "../Inputs/FocusTemplate";
import UserIDInput from "../Inputs/UserIDInput";

import { getAuthCaptcha, getIsAccountConnected } from "reducers";

import validate from "./validate";

import {
  hideCaptcha as hideCaptchaAction,
  showCaptcha as showCaptchaAction,
  connectAccount as connectAccountAction,
} from "actions";

import { performLogin as performLoginRequest } from "request";

const captchaName = "login";

const
  mapStateToProps = (state : State) => ({
    CaptchaID   : getAuthCaptcha(state, captchaName),
    isConnected : getIsAccountConnected(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    showCaptcha: (newCaptcha : string) => {
      dispatch(change("AUTH_LOGIN_FORM", "CaptchaSolution", ""));
      dispatch(showCaptchaAction({
        name : captchaName,
        id   : newCaptcha,
      }));
    },
    hideCaptcha: () => {
      dispatch(hideCaptchaAction(captchaName));
    },
    connectAccount: (account) => {
      setTimeout(() => {
        dispatch(connectAccountAction(account));
      });
    },
  });

const
  mapStateToPropsCaptcha = (state : any) => ({
    id: getAuthCaptcha(state, captchaName),
  }),
  CaptchaBox = connect(mapStateToPropsCaptcha)(Captcha);

class Login extends React.Component {

  props: FormPropTypes;

  passwordField: any;

  handleSubmit: (formData : any) => Promise<*>;
  focusPassword: () => void;
  handleRegisterRef: () => void;

  constructor () {
    super();

    this.focusPassword = () => {
      setTimeout(() => {
        const { passwordField } = this;

        if (passwordField && passwordField !== null) {
          passwordField.focus();
        }
      });
    };

    this.handleRegisterRef = (node : any) => {
      this.passwordField = node;
    };

    this.handleSubmit = (formData : any) => {
      const {
        CaptchaID,
        showCaptcha,
        hideCaptcha,
        connectAccount,
      } = this.props,
        data = {
          ...formData.toJS(),
          CaptchaID,
        };

      return performLoginRequest(data).
      then((response : LoginFormResponse) => {
        if (response.Error === "") {
          connectAccount(response.account);
        } else {
          if (response.Captcha) {
            showCaptcha(response.Captcha);
          } else {
            hideCaptcha(captchaName);
          }
          throw new SubmissionError({
            _error: response.Error,
          });
        }
      }).
      catch((error : any) => {
        if (error) {
          if (error instanceof SubmissionError) {
            throw error;
          }

          throw new SubmissionError({
            _error: "Am pierdut conexiunea cu server-ul",
          });
        }
      });
    };
  }

  render () {

    const {
      error,
      pristine,
      submitting,
      handleSubmit,
      isConnected,
    } = this.props;

    if (isConnected) {
      return (
        <Redirect to="/user-list" />
      );
    }

    return (
      <div className="container ">
        <div className="
          mt-4
          col-lg-8 offset-lg-2
          col-md-10 offset-md-1
          col-xl-6 offset-xl-3">
          {error ? (
            <div className="alert alert-danger">
              {error}
            </div>
          ) : null}
          <div className="card">
            <div className="card-header">
              <i className="fa fa-file-text-o-o text-info" />
              {" Te rugăm să te conectezi"}
            </div>
            <div className="card-block">
              <form onSubmit={handleSubmit(this.handleSubmit)}>
                <FormSection name="UserID">
                  <UserIDInput focusPassword={this.focusPassword} />
                </FormSection>
                <Field
                  component={FocusTemplate}
                  label="Parola"
                  name="Password"
                  onRegisterRef={this.handleRegisterRef}
                  placeholder="Tastează parola ta"
                  type="password"
                />
                <Field
                  component={CaptchaBox}
                  name="CaptchaSolution"
                />
                <div className="text-center">
                  <button
                    aria-label="Conectează-mă"
                    className="btn btn-primary"
                    disabled={pristine || submitting}
                    type="submit">
                    {"Conectează-mă"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const myForm = reduxForm({
  form: "AUTH_LOGIN_FORM",
  validate,
})(Login);

export default connect(mapStateToProps, mapDispatchToProps)(myForm);
