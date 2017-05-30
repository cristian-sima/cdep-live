/* eslint-disable max-len, callback-return */

import express from "express";
import createIO from "socket.io";
import render from "./render";
import api from "./api";
import config from "../conf/server";
const { MongoClient } = require("mongodb");

import {
  sessionMiddleware,
  performLogin,
} from "./util";

MongoClient.connect("mongodb://localhost:27017/live", (err, database) => {
  if (err) {
    console.log(err);
  }
  const app = express();

// Make our db accessible to our router
  app.use((req, res, next) => {
    req.db = database;
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
      performLogin({
        ...socket.request,
        db: database,
      }, socket.request.res, next);
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
      database.collection("lists").find({}, (cursor) => {
        cursor.toArray((list) => {
          socket.emit("msg", {
            type    : "UPDATE_LIST",
            payload : list,
          });
        });
        database.close();
      });

      socket.on("UPDATING_LIST", () => {
        socket.broadcast.emit("msg", {
          type: "UPDATING_LIST",
        });

        updateList((list) => {
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
