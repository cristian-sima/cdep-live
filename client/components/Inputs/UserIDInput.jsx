// @flow

type InputTemplatePropTypes = {
  autoFocus?: boolean;
  input: any;
  label: string;
  placeholder: string;
  type: string;
  meta: {
    touched: boolean;
    error?: any;
    submitting: boolean;
  };
  left?: string;
  right?: string;

  onRegisterRef?: (callback : (node : any) => void) => void;
};

import React from "react";

import classnames from "classnames";

const UserIDInput = ({
  input,
  type,
  label,
  onRegisterRef,
  autoFocus,
  placeholder,
  left,
  right,
  meta: { submitting, touched, error },
} : InputTemplatePropTypes) => (
    <div className={classnames("form-group row", { "has-warning": touched && error })}>
      <label
        className={`${left ? left : "col-md-4"} text-md-right form-control-label`}
        htmlFor={input.name}>
        {label}
      </label>
      <div className={right ? right : "col-md-8"}>
        <input
          {...input}
          aria-label={label}
          autoFocus={autoFocus}
          className={classnames("user-ID-input form-control", {
            "form-control-warning": "form-control-warning",
          })}
          disabled={submitting}
          id={input.name}
          placeholder={placeholder}
          ref={onRegisterRef ? onRegisterRef : null}
          type={type}
        />
        <div className="form-control-feedback">
          {
            touched && error && <span>{error}</span>
          }
        </div>
      </div>
    </div>
  );

export default UserIDInput;
