import express from "express";
import render from "./render";
import api from "./api";
import config from "../conf/server";

const app = express();

app.use("/static", express.static("server/static"));
app.use("/api", api);
app.use("/", render);

const server = app.listen(config.port, () => {
  const { port } = server.address();

  console.log(`Backend server is up at port ${port}`);
});
