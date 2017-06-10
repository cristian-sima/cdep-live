// @flow
/* eslint-disable no-magic-numbers */

type UserIDInputPropTypes = {
  autoFocus?: boolean;
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
  focusPrevious?: () => void;
  onRegisterRef?: (callback : (node : any) => void) => void;
}

type OnKeyUp = (data : {
  focusNext? : () => void;
  focusPrevious? : () => void;
}) => (event : KeyboardEvent) => void;

import React from "react";

import classnames from "classnames";
import { Field } from "redux-form/immutable";

const tryToFocusNext : OnKeyUp = ({ focusNext, focusPrevious }) => (event) => {
  if (event.target.value && event.target.value.length === 1) {
    const
      { key } = event,
      { shiftKey } = event,
      shouldFocusNext = (
          !((key === "Tab" && shiftKey) || (key === "Shift" && !shiftKey))
        );

    if (shouldFocusNext && typeof focusNext === "function") {
      focusNext();
    }
  } else {
    const
      { key } = event,
      shouldFocusPrevious = (
          key === "Backspace" ||
          key === "Delete"
        );

    if (shouldFocusPrevious && typeof focusPrevious === "function") {
      focusPrevious();
    }
  }
};

const DigitInput = ({
  input,
  autoFocus,
  onRegisterRef,
  focusNext,
  focusPrevious,
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
    onKeyUp={tryToFocusNext({
      focusPrevious,
      focusNext,
    })}
    pattern="[0-9]{1}"
    ref={onRegisterRef ? onRegisterRef : null}
    size="1"
    step="1"
    type="tel"
  />
);


class UserIDInput extends React.Component {
  props: UserIDInputPropTypes;

  positions: any;

  focusPosition: (position: number) => () => void;

  registerPosition1: () => void;
  registerPosition2: () => void;
  registerPosition3: () => void;

  handleRegisterRef: (position: number, node : any) => void;

  constructor (props : UserIDInputPropTypes) {
    super(props);

    this.positions = {};

    this.focusPosition = (position: number) => () => {
      setTimeout(() => {
        const { positions } = this;

        const field = positions[position];

        if (field && field !== null) {
          field.select();
        }
      });
    };

    this.registerPosition1 = (node : any) => {
      this.handleRegisterRef(1, node);
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
             onRegisterRef={this.registerPosition1}
            />
          <Field
            component={DigitInput}
            focusNext={this.focusPosition(3)}
            focusPrevious={this.focusPosition(1)}
            name="Position2"
            onRegisterRef={this.registerPosition2}
           />
          <Field
             component={DigitInput}
             focusNext={focusPassword}
             focusPrevious={this.focusPosition(2)}
             name="Position3"
             onRegisterRef={this.registerPosition3}
            />
        </div>
      </div>
    );
  }
}

export default UserIDInput;
