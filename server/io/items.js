import { error, isSpecialAccount, isNormalUser } from "../utility";

import {
  selectItem as performSelectItem,
  updateList as performUpdateList,
  voteItem as performVoteItem,
} from "../items/operations";

export const selectItem = (socket, db) => (id) => {
  if (isSpecialAccount(socket.request.session.user.marca)) {
    return performSelectItem(db, id, () => {
      const data = {
        type    : "SELECT_ITEM",
        payload : id,
      };

      socket.emit("msg", data);
      socket.broadcast.emit("msg", data);
    });
  }

  return error("Nu ai voie");
};

export const updateList = (socket, db) => () => {
  socket.broadcast.emit("msg", {
    type: "UPDATING_LIST",
  });

  performUpdateList(db, (items) => {

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
};


export const voteItem = (socket, db) => (clientData) => {
  const { user } = socket.request.session;

  if (isNormalUser(user.marca)) {
    return performVoteItem(db, clientData, user, () => {
      const data = {
        type    : "VOTE_ITEM",
        payload : {
          ...clientData,
          group: user.group,
        },
      };

      socket.emit("msg", data);

      if (clientData.isPublicVote) {
        socket.broadcast.emit("msg", data);
      } else {
        socket.to(user.group).emit("msg", data);
      }
    });
  }

  return error("Nu ai voie");
};
