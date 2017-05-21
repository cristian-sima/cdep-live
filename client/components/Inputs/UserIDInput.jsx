// @flow
/* eslint-disable no-magic-numbers */

type UserIDInputPropTypes = {
  autoFocus?: boolean;
  input: any;
  label: string;
  meta: {
    touched: boolean;
    error?: any;
    submitting: boolean;
  };
  left?: string;
  right?: string;

  focusPassword: () => void;
  onRegisterRef?: (callback : (node : any) => void) => void;
};

type DigitInputPropTypes = {
  autoFocus?: boolean;
  input: any;
  label: string;
  meta: {
    touched: boolean;
    error?: any;
    submitting: boolean;
  };

  focusNext?: () => void;
  onRegisterRef?: (callback : (node : any) => void) => void;
}

import React from "react";

import classnames from "classnames";
import { Field } from "redux-form/immutable";

const tryToFocusNext = (focusNext : () => void) => (event) => {
  if (event.target.value && event.target.value.length === 1) {
    focusNext();
  }
};

const DigitInput = ({
  input,
  autoFocus,
  onRegisterRef,
  focusNext,
  meta : { submitting },
} : DigitInputPropTypes) => (
  <input
    {...input}
    autoFocus={autoFocus}
    className={classnames("user-ID-input form-control", {
      "form-control-warning": "form-control-warning",
    })}
    disabled={submitting}
    inputMode="numeric"
    max="9"
    maxLength={1}
    min="0"
    onKeyUp={tryToFocusNext(focusNext)}
    ref={onRegisterRef ? onRegisterRef : null}
    size="1"
    type="text"
  />
);


class UserIDInput extends React.Component {
  props: UserIDInputPropTypes;

  positions: any;

  focusPosition: (position: number) => void;

  registerPosition2: () => void;
  registerPosition3: () => void;

  constructor (props) {
    super(props);

    this.positions = {};

    this.focusPosition = (position: number) => () => {
      setTimeout(() => {
        const { positions } = this;

        const field = positions[position];

        if (field && field !== null) {
          field.focus();
        }
      });
    };

    this.registerPosition2 = (node : any) => {
      this.handleRegisterRef(2, node);
    };

    this.registerPosition3 = (node : any) => {
      this.handleRegisterRef(3, node);
    };

    this.handleRegisterRef = (position : number, node : any) => {
      this.positions[position] = node;
    };
  }

  render () {
    const {
      left,
      right,
      focusPassword,
    } = this.props;

    return (
      <div className={"form-group row"}>
        <label
          className={`${left ? left : "col-md-4"} text-md-right form-control-label`}
          htmlFor="Marcap">
          {"Marca"}
        </label>
        <div className={`form-inline ${right ? right : "col-md-8"}`}>
          <Field
            autoFocus
             component={DigitInput}
             focusNext={this.focusPosition(2)}
              name="Position1"
            />
          <Field
            component={DigitInput}
            focusNext={this.focusPosition(3)}
            name="Position2"
            onRegisterRef={this.registerPosition2}
           />
          <Field
             component={DigitInput}
             focusNext={focusPassword}
             name="Position3"
             onRegisterRef={this.registerPosition3}
            />
        </div>
      </div>
    );
  }
}

export default UserIDInput;
