import createHistory from "history/createBrowserHistory";
import { applyMiddleware, compose, createStore } from "redux";
import { routerMiddleware } from "react-router-redux";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";

// import the root reducer
import rootReducer from "reducers/state";

const
  history = createHistory(),
  middleware = applyMiddleware(routerMiddleware(history), promise(), thunk),
  enhancers = compose(
    middleware,
  ),
  store = createStore(rootReducer, {}, enhancers);

export {
  history,
};


export default store;
