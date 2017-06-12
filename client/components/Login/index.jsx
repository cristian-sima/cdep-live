// @flow

import type { Dispatch, State } from "types";

type FormPropTypes = {
  error? : string;
  CaptchaID?: string;
  pristine : boolean;
  submitting : boolean;
  isConnected: boolean;
  location: string;

  handleSubmit: (onSubmit : (formData : any) => Promise<*>) => void;
  showCaptcha: (newCaptcha : string) => void;
  hideCaptcha: () => void;
  startFormSubmit: () => void;
  stopFormSubmit: (errors : any) => void;
  connectAccount: (account : any) => void;
}

import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Field, reduxForm, FormSection, SubmissionError,
  change as changeAction,
  startSubmit as startFormSubmitAction,
  stopSubmit as stopFormSubmitAction,
} from "redux-form/immutable";
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

const formID = "AUTH_LOGIN_FORM";

const
  mapStateToProps = (state : State) => ({
      CaptchaID   : getAuthCaptcha(state, captchaName),
      isConnected : getIsAccountConnected(state),
    }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    showCaptcha: (newCaptcha : string) => {
      dispatch(changeAction(formID, "CaptchaSolution", ""));
      dispatch(showCaptchaAction({
        name : captchaName,
        id   : newCaptcha,
      }));
    },
    startFormSubmit: () => {
      dispatch(startFormSubmitAction(formID));
    },
    stopFormSubmit: (err) => {
      dispatch(stopFormSubmitAction(formID, err));
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

const returnProblem = (error : any) => {
  if (error) {
    if (error instanceof SubmissionError) {
      throw error;
    }

    throw new SubmissionError({
      _error: "Am pierdut conexiunea cu server-ul",
    });
  }
};

class Login extends React.Component {

  props: FormPropTypes;

  passwordField: HTMLInputElement;

  handleSubmit: (formData : any) => Promise<*>;
  focusPassword: () => void;
  handleRegisterRef: () => void;
  connectMePublic: () => void;

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
        then((response) => {
          if (response.Error === "") {
            connectAccount(response.account);
          } else {
            if (response.Captcha) {
              showCaptcha(response.Captcha);
            } else {
              hideCaptcha();
            }
            throw new SubmissionError({
              _error: response.Error,
            });
          }
        }).
        catch(returnProblem);
    };

    this.connectMePublic = () => {
      const { connectAccount, startFormSubmit, stopFormSubmit } = this.props;

      startFormSubmit();

      return performLoginRequest({
        UserID: {
          Position1 : "9",
          Position2 : "9",
          Position3 : "8",
        },
        Password: "parola",
      }).
        then((response) => {
          stopFormSubmit();
          if (response.Error === "") {
            connectAccount(response.account);
          } else {
            throw new SubmissionError({
              _error: response.Error,
            });
          }
        }).
        catch((err) => {
          stopFormSubmit(err.errors);

          return returnProblem(err);
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
          <div className="card">
            <div className="card-header">
              <i className="fa fa-file-text-o-o text-info" />
              {" Autentificare parlamentari"}
            </div>
            <div className="card-block">
              <form onSubmit={handleSubmit(this.handleSubmit)}>
                {error ? (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                ) : null}
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
                    {"Autentifică-te"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button
              className="btn btn-link"
              disabled={submitting}
              onClick={this.connectMePublic}
              type="button">
              {"Conectează-mă public"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const myForm = reduxForm({
  form: formID,
  validate,
})(Login);

export default connect(mapStateToProps, mapDispatchToProps)(myForm);
