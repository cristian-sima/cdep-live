/* eslint-disable no-sync, global-require, no-mixed-requires, no-magic-numbers, handle-callback-err, max-len, callback-return */

import express from "express";
import bodyParser from "body-parser";
import clientSession from "client-sessions";

const bcrypt = require("bcrypt");
const router = express.Router();

const
  marcaOperator = 0,
  marcaAdministrator = 999;

router.use(bodyParser.urlencoded({
  extended: true,
}));

router.use(bodyParser.json());

router.use(clientSession({
  cookieName     : "session",
  secret         : "B83hfuin3989j3*&R383hfuin3989j3+3-83hfuin3989j3_ASD",
  duration       : 3000 * 60 * 1000,
  activeDuration : 5 * 60 * 1000,
}));

const cryptPassword = (raw : string) : string => {
  const salt = bcrypt.genSaltSync(10);

  return bcrypt.hashSync(raw, salt);
};

router.post("/auth/login", (req, res) => {

  const { body, db } = req;

  const {
    UserID: {
      Position1,
      Position2,
      Position3,
    },
    Password : RawPassword,
  } = body;

  const marca = Number(`${Position1 || " "}${Position2 || " "}${Position3 || " "}`, 10);

  const error = () => {
    req.session.reset();
    res.json({
      Error: "Datele nu au fost corecte pentru a vă conecta",
    });
  };

  if (isNaN(marca)) {
    error();
  } else {

    const users = db.collection("users");

    const
      findCurrentUser = () => {

        const
        credentials = {
          marca,
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
                req.session.marca = marca;

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


router.use((req, res, next) => {
  const { session, db } = req;

  if (session && session.marca) {
    const
      users = db.collection("users");

    users.findOne({ marca: session.marca }, (err, user) => {
      if (user) {
        req.user = user;
        delete req.user.password;
        req.session.user = user;
        res.locals.user = user;
      }

      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
});

const requireLogin = ({ user }, res, next) => {
  if (user) {
    next();
  } else {
    res.status(403).json({
      Error: "Accesul nu este permis",
    });
  }
};

const requireAdministrator = ({ user : { marca } }, res, next) => {
  if (marca === marcaAdministrator) {
    next();
  } else {
    res.status(403).json({
      Error: "Accesul nu este permis",
    });
  }
};

router.post("/update-user-list", [requireLogin, requireAdministrator, ({ body, db }, res) => {

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
      console.warn("to implement");
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
}]);

router.get("/user-list", [requireLogin, requireAdministrator, ({ body, db }, res) => {

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
}]);

export default router;
