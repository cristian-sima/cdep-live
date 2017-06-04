// @flow

import type { Dispatch } from "types";

type FormPropTypes = {
  error? : string;
  pristine : boolean;
  submitting : boolean;
  location: string;

  handleSubmit: (onSubmit : (formData : any) => Promise<*>) => void;
  changePassword: () => void;
}

import { withRouter } from "react-router";
import { connect } from "react-redux";
import { Field, reduxForm, SubmissionError } from "redux-form/immutable";
import React from "react";

import FocusTemplate from "../Inputs/FocusTemplate";

import validate from "./validate";

import {
  changePassword as changePasswordAction,
} from "actions";

import { changePassword as changePasswordRequest } from "request";

const
mapDispatchToProps = (dispatch : Dispatch) => ({
  changePassword: () => {
    setTimeout(() => {
      dispatch(changePasswordAction());
    });
  },
});

class ChangePassword extends React.Component {

  props: FormPropTypes;

  passwordField: HTMLInputElement;

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
      const { changePassword } = this.props;

      return changePasswordRequest(formData.toJS()).
      then((response) => {
        if (response.Error === "") {
          changePassword();
        } else {
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
    } = this.props;

    return (
      <div className="container ">
        <div className="
          mt-4
          col-lg-8 offset-lg-2
          col-md-10 offset-md-1
          col-xl-6 offset-xl-3">
          <div className="my-4">
            <h2 className="text-success">{"Bun venit"}</h2>
            <div>
              {"Trebuie să îți schimbi parola primită cu una aleasă de tine"}
            </div>
          </div>
          <form onSubmit={handleSubmit(this.handleSubmit)}>
            <Field
              autoFocus
              component={FocusTemplate}
              label="Noua parolă"
              name="password"
              onRegisterRef={this.handleRegisterRef}
              placeholder="Alege o parolă"
              type="password"
            />
            <Field
              component={FocusTemplate}
              label="Confirmă parola"
              name="confirmation"
              placeholder="Tastează încă o dată această parolă"
              type="password"
            />
            <div className="text-center">
              {error ? (
                <div className="alert alert-danger">
                  {error}
                </div>
              ) : null}
              <button
                aria-label="Conectează-mă"
                className="btn btn-info"
                disabled={pristine || submitting}
                type="submit">
                {"Gata"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const myForm = reduxForm({
  form: "CHANGE_PASSWORD",
  validate,
})(ChangePassword);

export default withRouter(connect(null, mapDispatchToProps)(myForm));
