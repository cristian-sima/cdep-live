// @flow

import type { Request, Response } from "../types";

import bcrypt from "bcrypt";

import { getSpecialAccounts, getMarca } from "./util";

import { StatusServiceUnavailable, marcaContPublic } from "../utility";

export const login = (req : Request, res : Response) => {

  const { body, db } = req;

  const {
    UserID,
    Password : RawPassword,
  } = body;

  const marca = getMarca(UserID);

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

      const insertQuery = {
        session      : null,
        itemSelected : null,
      };

      return db.collection("info").insert(insertQuery, (errCreate) => {
        if (errCreate) {
          return loginError(errCreate);
        }

        return getSpecialAccounts((specialAccounts) => (
          users.insertMany(specialAccounts, (errUsersInsert) => {
            if (errUsersInsert) {
              return loginError(errUsersInsert);
            }

            return findCurrentUser();
          })
        ), loginError);
      });
    }

    return findCurrentUser();
  });

};

export const changePassword = (req: Request, res : Response) => {

  const { body, db, session : { user : { marca } } } = req;

  const { password, confirmation } = body;

  const
    specialError = (msg) => {
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
          return specialError(errHasing);
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
            return specialError(err);
          }

          return res.json({
            Error: "",
          });
        });
      });
    };

  if (marca === marcaContPublic) {
    return specialError("Imposibil de efectuat");
  }

  if (confirmation === password) {
    const
      passLength = password.length,
      minimLength = 4,
      maxLength = 25,
      notGoodLength = passLength < minimLength || passLength > maxLength;

    if (notGoodLength) {
      return specialError("Parola are între 4 și 25 de caractere");
    }

    return performChange();
  }

  return specialError("Trebuie să introduci aceeași parolă în ambele câmpuri");
};

export const signOff = ({ session } : Request, res : Response) => {
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

export const reconnect = ({ session, user } : Request, res : Response) => {
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
