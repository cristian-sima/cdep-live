import express from "express";
import routes from "./routes";
import config from "../conf/server";

const app = express();

app.use("/static", express.static("server/static"));
app.use("*", routes);

const server = app.listen(config.port, () => {
  const { port } = server.address();

  console.log(`Backend server is up at port ${port}`);
});
