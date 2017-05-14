// @flow

import {
  validateEmail,
  validatePassword,
  validateCaptchaSolution,
  extractErrorsFromCheckers,
} from "utility";

const
  checkers = {
    Email           : validateEmail,
    Password        : validatePassword,
    CaptchaSolution : validateCaptchaSolution,
  };

const validate = extractErrorsFromCheckers(checkers);

export default validate;
