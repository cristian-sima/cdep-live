// @flow

import type { Database, Response, Request, Next } from "./types";

import express from "express";
// import winston from "winston";
// import expressWinston from "express-winston";
import { MongoClient } from "mongodb";

import render from "./render";
import routes from "./routes";
import config from "../conf/server";

import createIO from "./io";

MongoClient.connect("mongodb://localhost:27017/live", (errConnectDatabase? : Error, db : Database) => {
  if (errConnectDatabase) {
    console.log(errConnectDatabase);
  }

  const app = express();

  app.use((req, res, next) => {
    req.db = db;
    next();
  });

  app.use("/static", express.static("server/static"));
  app.use("/api", routes);
  app.use("/", render);

  app.use((err : Error, req : Request, res : Response, next : Next) => {
    if (err) {
      return console.log(err);
    }

    return next(err);
  });

  const server = app.listen(config.port, () => {
    const { port } = server.address();

    createIO(server, db);

    console.log(`Backend server is up at port ${port}`);
  });
});
