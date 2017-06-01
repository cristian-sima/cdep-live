import createIO from "socket.io";

import { error, sessionMiddleware, isSpecialAccount } from "../utility";
import { selectItem, updateList } from "../items/operations";

const performCreateIO = (server, db) => {
  const io = createIO(server);

  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  io.use((socket, next) => {
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
          delete socket.request.user.password;
          socket.request.session.user = user;
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

    const list = db.collection("list");

    list.find({}).toArray((errFindList, data) => {
      if (errFindList) {
        return error(errFindList);
      }

      return db.collection("info").findOne({}, (errFindInfo, { itemSelected }) => {
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

    socket.on("UPDATING_LIST", () => {
      socket.broadcast.emit("msg", {
        type: "UPDATING_LIST",
      });

      updateList(db, (items) => {

        const info = db.collection("info");

        return info.findOne({}, (errFindInfo, { itemSelected }) => {
          if (errFindInfo) {
            return error(errFindInfo);
          }

          const data = {
            type    : "UPDATE_LIST",
            payload : {
              list         : items,
              itemSelected : itemSelected || null,
            },
          };

          socket.emit("msg", data);
          socket.broadcast.emit("msg", data);

          return null;
        });
      });
    });

    socket.on("SELECT_ITEM", (id) => {
      if (isSpecialAccount(socket.request.session.user.marca)) {
        return selectItem(db, id, () => {
          const data = {
            type    : "SELECT_ITEM",
            payload : id,
          };

          socket.emit("msg", data);
          socket.broadcast.emit("msg", data);
        });
      }

      return error("Nu ai voie");
    });
  });
};

export default performCreateIO;
