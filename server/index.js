/* eslint-disable max-len, callback-return, handle-callback-err */

import express from "express";
import createIO from "socket.io";
import fetch from "node-fetch";
import { MongoClient } from "mongodb";

import render from "./render";
import api from "./api";
import config from "../conf/server";

import { sessionMiddleware } from "./util";

const
  error = (msg) => {
    throw msg || "Ceva nu a mers cum trebuia";
  },
  updateList = (db, callback) => {
    const
      processData = ({ lista_de_vot: rawList }) => {
        const
          date = new Date(),
          year = date.getFullYear(),
          month = date.getMonth(),
          day = date.getDate(),
          today = `${day}.${month}.${year}`;

        const
          info = db.collection("info"),
          list = db.collection("list");

        const
          insert = () => {
            const
          insertList = () => {
            const newList = [];

            const trimString = (raw : any) => String(raw).trim();

            for (const rawItem of rawList) {
              const { titlu, proiect, pozitie } = rawItem;

              newList.push({
                position : Number(pozitie),
                title    : trimString(titlu),
                project  : trimString(proiect),
              });
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
        }

        socket.emit("msg", {
          type    : "UPDATE_LIST",
          payload : list || [],
        });
      });

      socket.on("UPDATING_LIST", () => {
        socket.broadcast.emit("msg", {
          type: "UPDATING_LIST",
        });

        updateList(db, (list) => {
          const data = {
            type    : "UPDATE_LIST",
            payload : list,
          };

          socket.emit("msg", data);
          socket.broadcast.emit("msg", data);
        });
      });
    });

    console.log(`Backend server is up at port ${port}`);
  });

});
