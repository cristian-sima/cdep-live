// @flow

import agent from "superagent";

import { withPromiseCallback, normalizeArray } from "utility";

export const performLogin = (formData : any) => (
  new Promise(
    (resolve, reject) => (
      agent.
      post("/api/login").
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
    post("/api/users/update").
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
    get("/api/users").
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

export const signOff = () => (
  new Promise(
    (resolve, reject) => (
      agent.
      post("/api/auth/signOff").
      end(
        withPromiseCallback(resolve, reject)
      )
    )
  )
);

export const performReconnect = () => (
  new Promise(
    (resolve, reject) => (
      agent.
      post("/api/auth/reconnect").
      end(
        withPromiseCallback(resolve, reject)
      )
    )
  )
);
