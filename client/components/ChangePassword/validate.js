// @flow

import {
  validatePassword,
  extractErrorsFromCheckers,
} from "utility";

const
  checkers = {
    password : validatePassword,
    confirm  : validatePassword,
  };

const validate = extractErrorsFromCheckers(checkers);

export default validate;
