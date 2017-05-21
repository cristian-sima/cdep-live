const bcrypt = require("bcrypt");

export const cryptPassword = (password, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return callback(err);
    }

    return bcrypt.hash(password, salt, (err2, hash) => callback(err2, hash));
  });
};

export const comparePassword = (password, userPassword, callback) => {
  bcrypt.compare(password, userPassword, (err, isPasswordMatch) => {
    if (err) {
      return callback(err);
    }

    return callback(null, isPasswordMatch);
  });
};
