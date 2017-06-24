import { applyMiddleware, compose, createStore } from "redux";
import { syncHistoryWithStore } from "react-router-redux";
import { browserHistory } from "react-router";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";

// import the root reducer
import rootReducer from "reducers/state";

// create an object for the default data
const defaultState = {},
  enhancers = compose(
    applyMiddleware(promise(), thunk),
  ),
  store = createStore(rootReducer, defaultState, enhancers),
  history = syncHistoryWithStore(browserHistory, store);

export {
  history,
};


export default store;
