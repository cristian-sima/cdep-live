// flow-typed signature: 5a15ec78bc5db34a8a6b719e271e4c5f
// flow-typed version: 614bf49aa8/redux-mock-store_v1.2.x/flow_>=v0.25.x

declare module "redux-mock-store" {
  /*
    S = State
    A = Action
  */

  declare type mockStore = {
    <S, A>(state: S): mockStoreWithoutMiddleware<S, A>
  };
  declare type mockStoreWithoutMiddleware<S, A> = {
    getState(): S,
    getActions(): Array<A>,
    dispatch(action: A): A,
    clearActions(): void,
    subscribe(callback: Function): void,
    replaceReducer(nextReducer: Function): void
  };

  declare module.exports: (middlewares: ?Array<Function>) => mockStore;
}

// Filename aliases
declare module "redux-mock-store/src/index" {
  declare module.exports: $Exports<"redux-mock-store">;
}
declare module "redux-mock-store/src/index.js" {
  declare module.exports: $Exports<"redux-mock-store">;
}
