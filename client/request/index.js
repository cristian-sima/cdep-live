// @flow

import agent from "superagent";

import { withPromiseCallback, normalizeArray } from "utility";

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
    post("/api/update-user-list").
    type("json").
    end(
      withPromiseCallback(
        ({ Users }) => resolve(
          normalizeArray(Users)
        ),
        reject
      )
    )
  )
)
);

export const fetchUsers = () => (
  new Promise((resolve, reject) => (
    agent.
    get("/api/user-list").
    type("json").
    end(
      withPromiseCallback(
        ({ Users }) => resolve(
          normalizeArray(Users)
        ),
        reject
      )
    )
  )
)
);

export const changePassword = (formData : any) => (
  new Promise(
    (resolve, reject) => (
      agent.
      post("/api/auth/changePassword").
      send(formData).
      type("form").
      end(
        withPromiseCallback(resolve, reject)
      )
    )
  )
);
