/* eslint-disable max-len, callback-return, handle-callback-err, no-undefined */

import express from "express";
import createIO from "socket.io";
import fetch from "node-fetch";
import { MongoClient } from "mongodb";

import render from "./render";
import api from "./api";
import config from "../conf/server";

import {
  optiuneContra,
  optiunePro,

  sessionMiddleware,

  isSpecialAccount,
} from "./util";

const
  error = (msg) => {
    throw msg || "Ceva nu a mers cum trebuia";
  },
  getToday = () => {
    const
      date = new Date(),
      year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate(),
      nine = 9,
      dayString = day < nine ? `0${String(day)}` : day,
      monthString = month < nine ? `0${String(month)}` : month;

    return `${dayString}.${monthString}.${year}`;
  },
  selectItem = (db, id, callback) => {
    const
      list = db.collection("list"),
      info = db.collection("info");

    list.findOne({
      _id: id,
    }, (errFindOne) => {
      if (errFindOne) {
        error(errFindOne);
      } else {
        info.updateMany({}, {
          $set: {
            itemSelected: id,
          },
        }, (errUpdate) => {
          if (errUpdate) {
            error();
          } else {
            callback();
          }
        }
      );
      }
    });
  },

  updateList = (db, callback) => {
    const
      processData = ({ lista_de_vot: rawList }) => {
        const today = getToday();

        const
          info = db.collection("info"),
          list = db.collection("list");

        const
          insert = () => {
            const
          insertList = () => {
            const newList = [];

            const prepareItem = (rawItem) => {
              const
                optiuneNecunoscuta = 10,
                trimString = (raw : any) => String(raw).trim(),
                proceseazaGuvern = (raw : string) : ?number => {
                  if (typeof raw === "undefined") {
                    return raw;
                  }

                  switch (raw) {
                    case "NEGATIV":
                      return Number(optiuneContra);
                    case "FAVORABIL":
                      return Number(optiunePro);
                    default:
                      return optiuneNecunoscuta;
                  }
                },
                proceseazaComisie = (raw : string) : ?number => {
                  if (typeof raw === "undefined") {
                    return raw;
                  }

                  switch (raw) {
                    case "RESPINGERE":
                      return Number(optiuneContra);
                    case "ADOPTARE":
                      return Number(optiunePro);
                    default:
                      return optiuneNecunoscuta;
                  }
                },
                obtineAn = (raw : string) : ?number => {

                  const
                    parts = String(raw).split("."),
                    nrOfElements = 3;

                  if (parts.length === nrOfElements) {
                    const value = Number(parts[2]);

                    if (isNaN(value) || value === "") {
                      return optiuneNecunoscuta;
                    }

                    return value;
                  }

                  return optiuneNecunoscuta;
                },
                proceseazaCameraDecizionala = (raw) : bool => raw === "DA";

              const { titlu, proiect, pozitie, guvern, comisia } = rawItem;

              const newItem = {
                position          : Number(pozitie),
                title             : trimString(titlu),
                project           : trimString(proiect),
                cameraDecizionala : proceseazaCameraDecizionala(rawItem["camera decizionala"]),
              };

              // daca avem pozitia guvernului
              if (typeof guvern !== "undefined") {
                const optiune = proceseazaGuvern(guvern);

                if (optiune !== optiuneNecunoscuta) {
                  newItem.guvern = optiune;
                }

                // daca avem data guvernului
                if (typeof guvern !== "undefined") {
                  const
                    dataGuvern = rawItem["data guvern"],
                    an = obtineAn(dataGuvern);

                  if (an !== optiuneNecunoscuta) {
                    newItem.anGuvern = an;
                  }
                }
              }

              // daca avem pozitia comisiei
              if (typeof comisia !== "undefined") {
                const optiune = proceseazaComisie(comisia);

                if (optiune !== optiuneNecunoscuta) {
                  newItem.comisia = optiune;
                }
              }

              return newItem;
            };

            for (const rawItem of rawList) {
              newList.push(prepareItem(rawItem));
            }

            list.insertMany(newList, (errInsertNewList, { ops }) => {
              if (errInsertNewList) {
                error(errInsertNewList);
              } else {
                callback(ops);
              }
            });
          };

            info.updateMany({}, {
              $set: {
                updateDate: today,
              },
            }, (errUpdate) => {
              if (errUpdate) {
                error(errUpdate);
              } else {
                insertList();
              }
            });

          },
          clearData = () => {
            list.remove((errRemoveAll) => {
              if (errRemoveAll) {
                error(errRemoveAll);
              } else {
                insert();
              }
            });
          };

        info.findOne({}, (errFind, { updateDate }) => {
          if (errFind) {
            error(errFind);
          } else if (typeof updateDate === "undefined") {
            insert();
          } else if (updateDate === today) {
            list.find({}).toArray((errFindList, data) => {
              if (errFindList) {
                error(errFindList);
              }
              callback(data);
            });
          } else {
            clearData();
          }
        });
      };

    fetch("http://www.cdep.ro/pls/caseta/json_internship_vfinal?dat=").
    then((response) => response.json()).
    then((json) => {
      processData(json);
    }).
    catch(() => {
      error();
    });
  };

MongoClient.connect("mongodb://localhost:27017/live", (errConnectDatabase, db) => {
  if (errConnectDatabase) {
    console.log(errConnectDatabase);
  }
  const app = express();

  // Make our db accessible to our router
  app.use((req, res, next) => {
    req.db = db;
    next();
  });

  app.use("/static", express.static("server/static"));
  app.use("/api", api);
  app.use("/", render);


  const server = app.listen(config.port, () => {
    const { port } = server.address();

    const io = createIO(server);

    io.use((socket, next) => {
      sessionMiddleware(socket.request, socket.request.res, next);
    });

    io.use((socket, next) => {
      const
        { request } = socket,
        { session } = request;

      const thereIsASession = (
          typeof session !== "undefined" &&
          typeof session.marca !== "undefined"
        );

      if (thereIsASession) {
        const
          { marca } = session,
          users = db.collection("users");

        users.findOne({ marca }, (errFindOne, user) => {
          if (errFindOne) {
            next(error(errFindOne));
          } else {
            if (user) {
              socket.request.user = user;
              delete socket.request.user.password;
              socket.request.session.user = user;
            }

              // finishing processing the middleware and run the route
            next();
          }
        });
      } else {
        next();
      }
    });

    io.use((socket, next) => {
      const { request : { session : { user } } } = socket;

      if (user) {
        next();
      } else {
        next(new Error("Not connected"));
      }
    });

    io.on("connection", (socket) => {

      db.collection("list").
      find({}).
      toArray((errFindList, list) => {
        if (errFindList) {
          error(errFindList);
        } else {
          db.collection("info").findOne({}, (errFindInfo, { itemSelected }) => {
            if (errFindInfo) {
              error(errFindInfo);
            } else {
              socket.emit("msg", {
                type    : "UPDATE_LIST",
                payload : {
                  list         : list || [],
                  itemSelected : itemSelected || null,
                },
              });
            }
          });
        }
      });

      socket.on("UPDATING_LIST", () => {
        socket.broadcast.emit("msg", {
          type: "UPDATING_LIST",
        });

        updateList(db, (list) => {
          db.collection("info").findOne({}, (errFindInfo, { itemSelected }) => {
            if (errFindInfo) {
              error(errFindInfo);
            } else {
              const data = {
                type    : "UPDATE_LIST",
                payload : {
                  list,
                  itemSelected: itemSelected || null,
                },
              };

              socket.emit("msg", data);
              socket.broadcast.emit("msg", data);
            }
          });
        });
      });

      socket.on("SELECT_ITEM", (id) => {
        if (isSpecialAccount(socket.request.session.user.marca)) {
          selectItem(db, id, () => {
            const data = {
              type    : "SELECT_ITEM",
              payload : id,
            };

            socket.emit("msg", data);
            socket.broadcast.emit("msg", data);
          });
        } else {
          error("Nu ai permisiune");
        }
      });
    });

    console.log(`Backend server is up at port ${port}`);
  });

});
