// @flow

import type { Response, Request } from "../types";

import QPromise from "q";
import fetch from "node-fetch";
import { ObjectId } from "mongodb";

import { StatusServiceUnavailable, selectOnlyUsers, error } from "../utility";

import { prepareUser, generateTemporaryPassword } from "../auth/util";

import { URL } from "../../config";

export const updateUsers = ({ body, db } : Request, res : Response) => {

  const
    specialError = (msg) => res.status(StatusServiceUnavailable).json({
      Error: msg || "Nu am putut actualiza lista",
    }),
    processData = (serverData) => {

      const
        users = db.collection("users"),
        info = db.collection("info");

      const {
      camera : {
        legislatura: currentSession,
        deputati: newUsers,
      },
    } = serverData;

      const
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

          return users.insertMany(preparedUsers, (errInsertMany, { ops }) => {
            if (errInsertMany) {
              return specialError(errInsertMany);
            }

            return res.json({
              Error : "",
              Users : ops,
            });

          });
        },
        prepareForNewSession = () => {
          info.updateMany({}, {
            $set: {
              session: currentSession,
            },
          }, (errUpdate) => {
            if (errUpdate) {
              return specialError(errUpdate);
            }

            return users.remove(selectOnlyUsers, (errRemove) => {
              if (errRemove) {
                return specialError(errRemove);
              }

              return insertNewUsers();
            });
          });
        },
        performUpdate = () => {

          const userMap = {};

          for (const newUser of newUsers) {
            userMap[newUser.marca] = newUser;
          }

          const
            promises = [],
            collection = db.collection("users"),
            cursor = collection.find(selectOnlyUsers);

          // read all docs
          cursor.each((cursorErr, currentUser) => {
            if (cursorErr) {
              return specialError(cursorErr);
            }

            if (currentUser) {

              const newUser = userMap[currentUser.marca];

              if (typeof newUser === "undefined") {
                const
                  args = [{ _id: currentUser._id }],
                  promise = QPromise.npost(collection, "deleteOne", args);

                promises.push(promise);
              } else {
                const { nume, prenume, grup } = newUser;

                userMap[currentUser.marca].updated = true;

                const
                  update = {
                    $set: {
                      name  : `${nume} ${prenume}`,
                      group : grup,
                    },
                  },
                  args = [currentUser, update],
                  promise = QPromise.npost(collection, "update", args);

                promises.push(promise);
              }
            } else {

              QPromise.all(promises).then(() => {
                if (cursor.isClosed()) {
                  const
                    returnUser = () => (
                      users.find(selectOnlyUsers).toArray((errFind, newData) => {

                        if (errFind) {
                          return specialError(errFind);
                        }

                        return res.json({
                          Error : "",
                          Users : newData,
                        });
                      })
                    ),
                    toAddUser = [];


                  for (const key in userMap) {
                    if (Object.prototype.hasOwnProperty.call(userMap, key)) {
                      const newUser = userMap[key];

                      if (typeof newUser.updated === "undefined") {
                        toAddUser.push(prepareUser(newUser, generateTemporaryPassword()));
                      }
                    }
                  }

                  if (toAddUser.length === 0) {
                    return returnUser();
                  }

                  return users.insertMany(toAddUser, (errInsertMany) => {
                    if (errInsertMany) {
                      return specialError(errInsertMany);
                    }

                    return returnUser();
                  });
                }

                return null;
              }).
              fail(specialError);
            }

            return null;
          });
        };

      info.findOne({}, (errFind, settings) => {
        if (errFind) {
          return specialError(errFind);
        }

        if (settings.session === currentSession) {
          return performUpdate();
        }

        return prepareForNewSession();
      });
    };

  fetch(URL.users).
  then((response) => response.json()).
  then((json) => {
    processData(json);
  }).
  catch(specialError);
};

export const getUsers = ({ body, db } : Request, res : Response) => {

  const
    users = db.collection("users");

  users.find(selectOnlyUsers).toArray((errFind, data) => {
    if (errFind) {
      return res.json({
        Error: "Nu am putut prelua lista",
      });
    }

    return res.json({
      Users : data,
      Error : "",
    });
  });
};

export const resetPassword = (req : Request, res : Response) => {
  const { db, params : { accountID } } = req;

  const
    users = db.collection("users"),
    whereQuery = {
      _id: ObjectId(accountID),
    };

  return users.findOne(whereQuery, (errFindUser) => {

    if (errFindUser) {
      return error(errFindUser);
    }

    const
      temporaryPassword = generateTemporaryPassword(),
      setQuery = {
        "$set": {
          requireChange : true,
          temporaryPassword,
          password      : "",
        },
      };

    return users.update(whereQuery, setQuery, (errUpdate) => {
      if (errUpdate) {
        return error(errUpdate);
      }

      return res.json({
        temporaryPassword,
      });
    });
  });
};
