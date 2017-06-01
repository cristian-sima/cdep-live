import QPromise from "q";

import { StatusServiceUnavailable } from "../utility";

import {
  prepareUser,
  generateTemporaryPassword,
  marcaOperator,
  marcaAdministrator,
} from "../auth/util";

import { URL } from "../../config";

export const updateUsers = ({ body, db }, res) => {

  const
    error = (msg) => res.status(StatusServiceUnavailable).json({
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
              return error(errInsertMany);
            }

            return res.json({
              Error : "",
              Users : ops,
            });

          });
        },
        createSettings = () => {
          const query = {
            session: currentSession,
          };

          info.insert(query, (errCreate) => {
            if (errCreate) {
              return error(errCreate);
            }

            return insertNewUsers();
          });
        },
        prepareForNewSession = () => {
          info.updateMany({}, {
            $set: {
              session: currentSession,
            },
          }, (errUpdate) => {
            if (errUpdate) {
              return error(errUpdate);
            }
            const queryDelete = {
              marca: {
                $nin: [marcaOperator, marcaAdministrator],
              },
            };

            return users.remove(queryDelete, (errRemove) => {
              if (errRemove) {
                return error(errRemove);
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
            cursor = collection.find({
              marca: {
                $nin: [marcaOperator, marcaAdministrator],
              },
            });

          // read all docs
          cursor.each((cursorErr, currentUser) => {
            if (cursorErr) {
              return error(cursorErr);
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
                    returnUser = () => {
                      const query = {
                        marca: {
                          $nin: [marcaOperator, marcaAdministrator],
                        },
                      };

                      return users.find(query).toArray((errFind, newData) => {

                        if (errFind) {
                          return error(errFind);
                        }

                        return res.json({
                          Error : "",
                          Users : newData,
                        });
                      });
                    },
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
                      return error(errInsertMany);
                    }

                    return returnUser();
                  });
                }

                return null;
              }).
              fail(error);
            }

            return null;
          });
        };

      info.findOne({}, (errFind, settings) => {
        if (errFind) {
          return error(errFind);
        }

        if (settings) {
          if (settings.session === currentSession) {
            return performUpdate();
          }

          return prepareForNewSession();
        }

        return createSettings();
      });
    };

  fetch(URL.users).
  then((response) => response.json()).
  then((json) => {
    processData(json);
  }).
  catch(error);
};

export const getUsers = ({ body, db }, res) => {

  const
    query = {
      marca: {
        $nin: [marcaOperator, marcaAdministrator],
      },
    },
    users = db.collection("users");

  users.find(query).toArray((errFind, data) => {
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
