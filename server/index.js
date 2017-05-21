import express from "express";
import render from "./render";
import api from "./api";
import config from "../conf/server";
const { MongoClient } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/live", (err, database) => {
  if (err) {
    return console.log(err);
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

    console.log(`Backend server is up at port ${port}`);
  });

});
