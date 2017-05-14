// @flow

import agent from "superagent";

import { withPromiseCallback } from "utility";

export const performLogin = (formData : any) => (
  new Promise(
    (resolve, reject) => (
      agent.
      post("/api/extern/login").
      type("form").
      send(formData).
      end(
        withPromiseCallback(resolve, reject)
      )
    )
  )
);
