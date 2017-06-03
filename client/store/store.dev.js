/* globals module */

import createHistory from "history/createBrowserHistory";
import { applyMiddleware, compose, createStore } from "redux";
import { routerMiddleware } from "react-router-redux";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";

// import the root reducer
import rootReducer from "reducers/state";

// create an object for the default data
const
  history = createHistory(),
  middleware = applyMiddleware(routerMiddleware(history), promise(), thunk),
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
  store = createStore(rootReducer, {}, enhancers);

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
