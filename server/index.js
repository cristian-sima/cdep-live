/* eslint-disable max-len, callback-return, handle-callback-err, no-undefined */

import express from "express";
import createIO from "socket.io";
import { MongoClient } from "mongodb";

import render from "./render";
import api from "./api";
import config from "../conf/server";

import { error, sessionMiddleware, isSpecialAccount } from "./util/auth";
import { selectItem, updateList } from "./operations";

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
