/* eslint-disable max-lines */
// @flow

const processErrors = ({ error, isArray, _error, arrayErrors }, { field, errors }) => {
  if (isArray) {
    if (arrayErrors) {
      errors[field] = arrayErrors;
    } else {
      errors[field] = { _error };
    }
  } else {
    errors[field] = error;
  }
};

export const extractErrorsFromCheckers = (checkers : any) => (values : any) => {
  const errors = {};

  for (const field in checkers) {
    if (Object.prototype.hasOwnProperty.call(checkers, field)) {
      const
        checker = checkers[field],
        result = checker(values.get(field)),
        { notValid } = result;

      if (notValid) {
        processErrors(result, {
          field,
          errors,
        });
      }
    }
  }

  return errors;
};

export const isValidEmail = (value : string) : boolean => (
  new RegExp("^.+\\@.+\\..+$").test(value)
);

export const validateEmail = (value : string) => {
  const
  notValid = (
    typeof value === "undefined" ||
    !isValidEmail(value)
  );

  return {
    notValid,
    error: "Trebuie o adresă validă de e-mail",
  };
};

export const validatePassword = (value : string) => {
  const
    lowerLimit = 4,
    upperLimit = 25,
    notValid = (
    typeof value === "undefined" ||
      value.length < lowerLimit ||
      value.length > upperLimit
    );

  return {
    notValid,
    error: `Parola are între ${lowerLimit} și ${upperLimit} de caractere`,
  };
};

export const validateCaptchaSolution = (value : string) => {
  const
    pattern = /^\d{6}$/,
    notValid = (
      typeof value !== "undefined" &&
      !pattern.test(value)
    );

  return {
    notValid,
    error: "Codul are exact șase cifre",
  };
};
