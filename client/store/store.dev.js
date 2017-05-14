/* eslint no-undef: "off"*/

import { applyMiddleware, compose, createStore } from "redux";
import { syncHistoryWithStore } from "react-router-redux";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import { createBrowserHistory } from "history";

// import the root reducer
import rootReducer from "reducers/state";

// create an object for the default data
const middleware = applyMiddleware(promise(), thunk),
  defaultState = {},
  getDev = () => {
    if (window.devToolsExtension) {
      return window.devToolsExtension();
    }

    return (func) => func;
  },
  enhancers = compose(
    middleware,
    getDev()
  ),
  store = createStore(rootReducer, defaultState, enhancers),
  history = syncHistoryWithStore(createBrowserHistory(), store);

if (module.hot) {
  module.hot.accept("reducers/", () => {

    /* eslint global-require: "off"*/

    const nextRootReducer = require("reducers/index").default;

    store.replaceReducer(nextRootReducer);
  });
}

export {
  history,
};


export default store;
