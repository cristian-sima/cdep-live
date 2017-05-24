/* eslint-disable no-sync, global-require, no-mixed-requires, no-magic-numbers */

import express from "express";
import bodyParser from "body-parser";

const bcrypt = require("bcrypt");
const router = express.Router();

const
  marcaOperator = 0,
  marcaAdministrator = 999;

router.use(bodyParser.urlencoded({
  extended: true,
}));

router.use(bodyParser.json());

const cryptPassword = (raw : string) : string => {
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
          marca    : marcaOperator,
          password : cryptPassword("operator"),
        }, {
          marca    : marcaAdministrator,
          password : cryptPassword("administrator"),
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

const
  generateTemporaryPassword = () => {
    const
      min = 1000,
      max = 9999,
      raw = Math.floor(Math.random() * (max - min + 1)) + min;

    return String(raw);
  },
  prepareUser = ({ nume, marca, grup }, temporaryPassword) => ({
    name  : nume,
    marca,
    group : grup,
    temporaryPassword,

    requireChange : true,
    password      : cryptPassword(temporaryPassword),
  });

router.post("/update-user-list", ({ body, db }, res) => {

  const
    serverData = require("./user-request.json"),
    users = db.collection("users"),
    info = db.collection("info");

  const {
    sesiune: currentSession,
    parlamentari: newUsers,
  } = serverData;

  const
    error = () => res.json({
      Error: "Datele nu au fost corecte pentru a vă conecta",
    }),
    insertNewUsers = () => {
      const
        passwords = {},
        preparedUsers = [];

      for (const newUser of newUsers) {

        const { grup } = newUser;

        let temporaryPassword = passwords[grup];

        if (typeof temporaryPassword === "undefined") {
          temporaryPassword = generateTemporaryPassword();
          passwords[grup] = temporaryPassword;
        }

        preparedUsers.push(prepareUser(newUser, temporaryPassword));
      }

      users.insertMany(preparedUsers, (errInsertMany, { ops }) => {
        if (errInsertMany) {
          error();
        } else {
          res.json({
            Error : "",
            Users : ops,
          });
        }
      });
    },
    createSettings = () => {
      info.insert({
        session: currentSession,
      }, (errCreate) => {
        if (errCreate) {
          error();
        } else {
          insertNewUsers();
        }
      });
    },
    prepareForNewSession = () => {
      info.updateMany({}, {
        $set: {
          session: currentSession,
        },
      }, (errUpdate) => {
        if (errUpdate) {
          error();
        } else {
          users.remove({
            marca: {
              $nin: [marcaOperator, marcaAdministrator],
            },
          }, (errRemove) => {
            if (errRemove) {
              error();
            } else {
              insertNewUsers();
            }
          });
        }
      });
    },
    updateUsers = () => {
      console.log("to implement");
    };

  info.findOne({}, (errFind, settings) => {
    if (errFind) {
      error();
    } else if (settings) {
      if (settings.session === currentSession) {
        updateUsers();
      } else {
        prepareForNewSession();
      }
    } else {
      createSettings();
    }
  });
});

router.get("/user-list", ({ body, db }, res) => {
  const users = db.collection("users");

  users.find({
    marca: {
      $nin: [marcaOperator, marcaAdministrator],
    },
  }).toArray((errFind, data) => {
    if (errFind) {
      res.json({
        Error: "Nu am putut prelua lista",
      });
    } else {
      res.json({
        Users : data,
        Error : "",
      });
    }
  });
});

export default router;
