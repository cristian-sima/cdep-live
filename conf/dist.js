// @flow
/* eslint-disable no-console */

const fileName = "config-server.json";

const fs = require("fs");

const file = require(`../${fileName}`);

file.isProduction = true;

fs.writeFile(fileName, JSON.stringify(file, null, 2), (err) => {

  if (err) {
    return console.log(err);
  }

  return console.log("The configuration has been set for production");
});
