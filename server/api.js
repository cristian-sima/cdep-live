/* eslint-disable no-sync */

import express from "express";
import bodyParser from "body-parser";

const bcrypt = require("bcrypt");


const router = express.Router();

router.use(bodyParser.urlencoded({
  extended: true,
}));

router.use(bodyParser.json());

const generatePassword = (raw : string) : string => {
  const salt = bcrypt.genSaltSync(10);

  return bcrypt.hashSync(raw, salt);
};

router.post("/auth/login", ({ body, db }, res) => {

  const {
    UserID: {
      Position1,
      Position2,
      Position3,
    },
    Password : RawPassword,
  } = body;

  const ID = Number(`${Position1 || " "}${Position2 || " "}${Position3 || " "}`, 10);

  const error = () => res.json({
    Error: "Datele nu au fost corecte pentru a vă conecta",
  });

  if (isNaN(ID)) {
    error();
  } else {

    const users = db.collection("users");

    const
      findCurrentUser = () => {

        const
        credentials = {
          "marca": ID,
        };

        users.findOne(credentials, (err, user) => {

          if (err !== null || !user) {
            error();
          } else {
            bcrypt.compare(RawPassword, user.password, (errComparePassword, isPasswordMatch) => {
              if (errComparePassword) {
                error();
              }

              if (isPasswordMatch) {
                res.json({
                  Error: "",
                });
              } else {
                error();
              }
            });
          }
        });
      };

    users.count().then((nrOfUsers) => {

      if (nrOfUsers === 0) {
        const specialAccounts = [{
          marca    : 0,
          password : generatePassword("operator"),
        }, {
          marca    : 999,
          password : generatePassword("administrator"),
        }];

        users.insertMany(specialAccounts, (errUsersInsert) => {
          if (errUsersInsert) {
            error();
          }

          findCurrentUser();
        });
      } else {
        findCurrentUser();
      }
    });
  }
});

router.post("/update-user-list", ({ body, db }, res) => {
  res.json({
    "merge": "da",
  });
});

export default router;
