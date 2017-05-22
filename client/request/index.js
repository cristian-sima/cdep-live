// @flow

import agent from "superagent";

import { withPromiseCallback } from "utility";
import * as Immutable from "immutable";

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

export const updateUserList = () => (
  new Promise((resolve, reject) => (
    agent.
    post("/update-user-list").
    type("json").
    end(
      withPromiseCallback(
        ({ Users, Error }) => resolve({
          Error,
          User: Immutable.Map(Users),
        }),
        reject
      )
    )
  )
)
);
