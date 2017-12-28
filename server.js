/* eslint-disable no-console */
const webpack = require("webpack"),
  WebpackDevServer = require("webpack-dev-server"),
  webpackConfiguration = require("./webpack.config"),
  config = require("./config.json");

const {
  devAddress,
  devPort,

  apiAddress,
  apiPort,
} = config;

const
  devServer = `http://${devAddress}:${devPort}`,
  apiServer = `http://${apiAddress}:${apiPort}`;

new WebpackDevServer(webpack(webpackConfiguration), {
  publicPath         : webpackConfiguration.output.publicPath,
  hot                : true,
  historyApiFallback : true,
  stats              : {
    colors: true,
  },
  proxy: {
    "/client*": {
      target: devServer,
    },
    "/static*": {
      target: devServer,
      rewrite (req) {
        req.url = `/server${req.url}`;
      },
    },
    "/": {
      target: apiServer,
    },
    "*": {
      target: apiServer,
    },
    "reset-password/*": {
      target: apiServer,
    },
  },
}).listen(devPort, devAddress, (err) => {
  if (err) {
    return console.log(err);
  }

  return console.log(`The webpack-dev-server is online at http://${devAddress}:${devPort}`);
});
