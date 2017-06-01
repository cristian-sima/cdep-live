import bcrypt from "bcrypt";

import { marcaOperator, marcaAdministrator } from "./util";

import { StatusServiceUnavailable } from "../utility";

export const login = (req, res) => {

  const { body, db } = req;

  const {
    UserID: { Position1, Position2, Position3 },
    Password : RawPassword,
  } = body;

  const marca = Number(`${Position1 || " "}${Position2 || " "}${Position3 || " "}`, 10);

  const loginError = (msg) => {
    req.session.reset();
    res.json({
      Error: msg || "Datele nu au fost corecte pentru a vă conecta",
    });
  };

  if (isNaN(marca)) {
    return loginError();
  }

  const users = db.collection("users");

  const
  findCurrentUser = () => {

    const credentials = { marca };

    users.findOne(credentials, (err, user) => {

      if (err !== null || !user) {
        return loginError(err);
      }

      const connect = () => {
        req.session.marca = marca;

        res.json({
          Error   : "",
          account : {
            ...user,
            password: "",
          },
        });
      };

      if (user.requireChange) {
        if (user.temporaryPassword === RawPassword) {
          return connect();
        }

        return loginError();
      }

      return bcrypt.compare(RawPassword, user.password, (errComparePassword, isPasswordMatch) => {
        if (errComparePassword) {
          return loginError();
        }

        if (isPasswordMatch) {
          return connect();
        }

        return loginError();
      });
    });
  };

  return users.count().then((nrOfUsers) => {

    if (nrOfUsers === 0) {
      const specialAccounts = [{
        marca             : marcaOperator,
        name              : "Operator",
        temporaryPassword : "1234",
        requireChange     : true,
      }, {
        marca             : marcaAdministrator,
        name              : "Administrator",
        temporaryPassword : "1234",
        requireChange     : true,
      }];

      return users.insertMany(specialAccounts, (errUsersInsert) => {
        if (errUsersInsert) {
          return loginError(errUsersInsert);
        }

        return findCurrentUser();
      });
    }

    return findCurrentUser();
  });

};

export const changePassword = (req, res) => {

  const { body, db } = req;

  const { password, confirmation } = body;

  const
    error = (msg) => {
      res.json({
        Error: msg || "Datele nu au fost corecte pentru a vă conecta",
      });
    },
    performChange = () => {

      const
        users = db.collection("users"),
        { session : { user } } = req;

      bcrypt.hash(password, 10, (errHasing, hash) => {
        if (errHasing) {
          return error(errHasing);
        }

        const
          whereQuery = { _id: user._id },
          setQuery = {
            ...user,
            requireChange     : false,
            password          : hash,
            temporaryPassword : "",
          };

        return users.update(whereQuery, setQuery, (err) => {
          if (err) {
            return error(err);
          }

          return res.json({
            Error: "",
          });
        });
      });
    };

  if (confirmation === password) {
    const
      passLength = password.length,
      minimLength = 4,
      maxLength = 25,
      notGoodLength = passLength < minimLength || passLength > maxLength;

    if (notGoodLength) {
      return error("Parola are între 4 și 25 de caractere");
    }

    return performChange();
  }

  return error("Parolele trebuie să fie la fel");
};

export const signOff = ({ session }, res) => {
  const
  thereIsASession = (
    typeof session !== "undefined" &&
    typeof session.marca !== "undefined"
  );

  if (thereIsASession) {
    session.reset();
  }

  res.json({
    Error: "",
  });
};

export const reconnect = ({ session, user }, res) => {
  const
  thereIsASession = (
    typeof session !== "undefined" &&
    typeof session.marca !== "undefined" &&
    typeof user !== "undefined"
  );

  if (thereIsASession) {
    return res.json(user);
  }

  return res.status(StatusServiceUnavailable).json({
    Error: "",
  });
};
