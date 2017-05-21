// @flow

import agent from "superagent";

import { withPromiseCallback } from "utility";

export const performLogin = (formData : any) => (
  new Promise(
    (resolve, reject) => (
      agent.
      post("/api/auth/login").
      send(formData).
      type("form").
      end(
        withPromiseCallback(resolve, reject)
      )
    )
  )
);
