/* eslint-disable no-process-env, no-unused-vars: ["off"], no-console, no-undef, global-require */
/* eslint-disable no-magic-numbers, prefer-reflect */

import { AppContainer } from "react-hot-loader";
import { render } from "react-dom";
import React from "react";
import Root from "./routes/Root";
import store, { history } from "./store/store";

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/scss/font-awesome.scss";
import "./styles/index.scss";

render((
    <AppContainer>
      <Root history={history} store={store} />
    </AppContainer>
  ),
  document.getElementById("root")
);

if (module.hot) {

  module.hot.accept("./routes/Root", () => {
    const Root2 = require("./routes/Root").default;

    render((
      <AppContainer>
        <Root2 history={history} store={store} />
      </AppContainer>
    ),
    document.getElementById("root")
  );
  });

/**
* Warning from React Router, caused by react-hot-loader.
* The warning can be safely ignored, so filter it from the console.
* Otherwise you'll see it every time something changes.
* See https://github.com/gaearon/react-hot-loader/issues/298
*/

  const orgError = console.error;

  console.error = (message) => {
    if (message && message.indexOf("You cannot change <Router routes>;") === -1) {
    // Log the error as normally
      orgError.apply(console, [message]);
    }
  };

  console.warn = (message) => { // eslint-disable-line no-console
    if (message &&
    message.indexOf("Need to do a full reload") !== -1
  ) {
      console.log("Full reloading...");
      location.reload();
    }
  };
}
