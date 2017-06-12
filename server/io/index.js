// @flow

import type { ExpressServer, Database, Socket, Next } from "../types";

import createIO from "socket.io";

import { error, sessionMiddleware } from "../utility";

import * as items from "./items";

const performCreateIO = (server : ExpressServer, db : Database) => {
  const io = createIO(server);

  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  io.use((socket : Socket, next : Next) => {
    const
      { request } = socket,
      { session } = request;

    const thereIsASession = (
      typeof session !== "undefined" &&
        typeof session.marca !== "undefined"
    );

    if (thereIsASession) {
      const
        { marca } = session,
        users = db.collection("users");

      return users.findOne({ marca }, (errFindOne, user) => {
        if (errFindOne) {
          return next(error(errFindOne));
        }

        if (user) {
          socket.request.user = user;
          socket.request.session.user = user;
          socket.request.session.user.password = "";
        }

        return next();
      });
    }

    return next();
  });

  io.use(({ request : { session : { user } } }, next) => {
    if (user) {
      return next();
    }

    return next(new Error("Not connected"));
  });

  io.on("connection", (socket) => {

    const { user } = socket.request.session;

    socket.join(user.group);

    const list = db.collection("list");

    list.find({}).toArray((errFindList, data) => {
      if (errFindList) {
        return error(errFindList);
      }

      const info = db.collection("info");

      return info.findOne({}, (errFindInfo, { itemSelected }) => {
        if (errFindInfo) {
          return error(errFindInfo);
        }

        return socket.emit("msg", {
          type    : "UPDATE_LIST",
          payload : {
            list         : data || [],
            itemSelected : itemSelected || null,
          },
        });
      });
    });

    socket.on("UPDATING_LIST", items.updateList(socket, db));
    socket.on("SELECT_ITEM", items.selectItem(socket, db));
    socket.on("VOTE_ITEM", items.voteItem(socket, db));
    socket.on("UPDATE_COMMENT", items.updateComment(socket, db));
  });

  io.on("disconnect", (socket) => {
    const { user } = socket.request.session;

    socket.leave(user.group);
  });
};

export default performCreateIO;
