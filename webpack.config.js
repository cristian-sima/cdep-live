/* global __dirname, module */
/* eslint-disable no-ternary, multiline-ternary, no-console, global-require, no-useless-escape */

let DashboardPlugin = null;

const path = require("path"),
  webpack = require("webpack"),
  config = require("./config-server.json");

const isDevelopmentMode = !config.isProduction,
  isProductionMode = config.isProduction,
  getDevtool = () => {
    if (isDevelopmentMode) {
      return "cheap-source-map";
    }

    return false;
  };

const displayInfo = () => {
  const getDevelopmentInfo = () => `
  Running in [development] mode
  `;

  const getProductionInfo = () => `
  Generating production version...
  `;

  if (isDevelopmentMode) {
    return getDevelopmentInfo();
  }

  return getProductionInfo();
};

if (isDevelopmentMode) {
  DashboardPlugin = require("webpack-dashboard/plugin");
}

console.log(displayInfo());

const createEntry = (name) => {
  const list = [];

  if (isDevelopmentMode) {
    const {
      devAddress,
      devPort,
    } = config;

    list.push(`webpack-dev-server/client?http://${devAddress}:${devPort}`);
    list.push("webpack/hot/only-dev-server");
    list.push("react-hot-loader/patch");
  }

  list.push(`./client/${name}.jsx`);

  return list;
};

module.exports = {
  devtool : getDevtool(),
  entry   : {
    app: createEntry("app"),
  },
  output: {
    path       : path.join(__dirname, "dist/static"),
    filename   : "[name].js",
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
    new DashboardPlugin(),
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
  // resolveLoader: {
  //   "fallback": path.join(__dirname, "node_modules"),
  // },
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
