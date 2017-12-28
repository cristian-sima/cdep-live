/* global __dirname, module */
/* eslint-disable no-ternary, multiline-ternary, no-console, global-require, no-useless-escape */

const
  path = require("path"),
  webpack = require("webpack"),
  WebpackGitHash = require("webpack-git-hash"),
  fs = require("fs");

const
  config = require("./config-server.json"),
  devConfig = require("./config.json");

const
  entries = ["app"],
  indexFolderPath = "./server/code/";

const
  isDevelopmentMode = !config.isProduction,
  isProductionMode = config.isProduction,
  getDevtool = () => {
    if (isDevelopmentMode) {
      return "cheap-source-map";
    }

    return false;
  };

const displayInfo = () => {
  if (isDevelopmentMode) {
    return "Running in [development] mode...";
  }

  return "Generating production version...";
};

const getEntity = () => {
  const createEntry = (name) => {
    const list = [];

    if (isDevelopmentMode) {
      const {
        devAddress,
        devPort,
      } = devConfig;

      list.push(`webpack-dev-server/client?http://${devAddress}:${devPort}`);
      list.push("webpack/hot/only-dev-server");
      list.push("react-hot-loader/patch");
    }

    list.push(`./client/${name}.jsx`);

    return list;
  };

  return entries.reduce((accumulator, currentValue) => Object.assign(accumulator, {
    [currentValue]: createEntry(currentValue),
  }), {});
};

console.log(displayInfo());

const gitHashPlugin = new WebpackGitHash({
  cleanup  : true,
  callback : (versionHash) => entries.map((entry) => {
    const filename = `${indexFolderPath}/${entry}.js`;

    return fs.readFile(filename, "utf8", (errRead, data) => {
      if (errRead) {
        return console.log(errRead);
      }

      const
        reg = new RegExp(`src="\/static\/${entry}-\\w+.js"`),
        newData = data.replace(reg, `src="/static/${entry}-${versionHash}.js"`);

      return fs.writeFile(filename, newData, (errWrite) => {
        if (errWrite) {
          return console.log(errWrite);
        }

        return null;
      });
    });
  }),
});

module.exports = {
  devtool : getDevtool(),
  entry   : getEntity(),
  output  : {
    path       : path.join(__dirname, "server/static"),
    filename   : "[name]-[githash].js",
    publicPath : "/static/",
  },
  plugins: isProductionMode ? [
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production"),
      },
    }),
    new webpack.DefinePlugin({
      "process.env": {
        "BABEL_ENV": JSON.stringify("production"),
      },
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ro/),
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
    }),
    gitHashPlugin,
  ] : [
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("development"),
      },
    }),
    new webpack.DefinePlugin({
      "process.env": {
        "BABEL_ENV": JSON.stringify("developmentTime"),
      },
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ro/),
    new webpack.HotModuleReplacementPlugin(),
    gitHashPlugin,
  ],
  resolve: {
    extensions: [
      ".js",
      ".jsx",
    ],
    modules: [
      "client",
      "node_modules",
    ],
  },
  module: {
    rules: [
      {
        test    : /\.jsx?$/,
        use     : ["babel-loader"],
        include : path.join(__dirname, "client"),
      },
      {
        test : /\.scss$/,
        use  : [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test : /\.css$/,
        use  : [
          "style-loader",
          "css-loader",
        ],
      },
      {
        test   : /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader : "url-loader?limit=10000&minetype=application/font-woff",
      },
      {
        test   : /\.jpe?g$|\.gif$|\.png$/,
        loader : "url-loader",
      },
      {
        test   : /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader : "file-loader",
      },
    ],
  },
};
