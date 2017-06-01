import { error, isSpecialAccount } from "../utility";

import {
  selectItem as performSelectItem,
  updateList as performUpdateList,
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
